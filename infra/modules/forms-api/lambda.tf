resource "aws_cloudwatch_log_group" "forms_api" {
  name              = "/aws/lambda/${var.name_prefix}-forms-api"
  retention_in_days = var.log_retention_days
}

# Terraform needs *some* deployment package to create the function. CI owns
# the real code via `aws lambda update-function-code` after every push to
# main (see .github/workflows/deploy-lambda.yml); this placeholder is only
# ever used on the very first apply, and lifecycle.ignore_changes below
# stops later `terraform apply` runs from reverting CI's deploys.
data "archive_file" "placeholder" {
  type        = "zip"
  output_path = "${path.module}/.placeholder/function.zip"

  source {
    content  = "export const handler = async () => ({ statusCode: 200, body: 'placeholder' });"
    filename = "index.mjs"
  }
}

resource "aws_lambda_function" "forms_api" {
  function_name = "${var.name_prefix}-forms-api"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  architectures = ["arm64"]
  memory_size   = 256
  timeout       = 10

  filename         = data.archive_file.placeholder.output_path
  source_code_hash = data.archive_file.placeholder.output_base64sha256

  environment {
    variables = {
      SUBMISSIONS_TABLE_NAME = var.table_name
      SES_FROM_ADDRESS       = var.ses_from_address
      SES_TO_ADDRESS         = var.ses_to_address
    }
  }

  depends_on = [aws_cloudwatch_log_group.forms_api]

  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }
}
