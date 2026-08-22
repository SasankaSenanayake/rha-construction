data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda_exec" {
  name               = "${var.name_prefix}-forms-api-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

# Deliberately narrower than the AWS-managed AWSLambdaBasicExecutionRole
# (which grants logs:* on Resource: *) — this Lambda only ever needs to
# write its own log stream, put one DynamoDB item, and send one SES email.
data "aws_iam_policy_document" "lambda_permissions" {
  statement {
    sid       = "WriteOwnLogs"
    effect    = "Allow"
    actions   = ["logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["${aws_cloudwatch_log_group.forms_api.arn}:*"]
  }

  statement {
    sid       = "WriteSubmissions"
    effect    = "Allow"
    actions   = ["dynamodb:PutItem"]
    resources = [var.table_arn]
  }

  statement {
    sid       = "SendNotificationEmail"
    effect    = "Allow"
    actions   = ["ses:SendEmail", "ses:SendRawEmail"]
    resources = [var.ses_identity_arn]
  }
}

resource "aws_iam_role_policy" "lambda_permissions" {
  name   = "${var.name_prefix}-forms-api-lambda-policy"
  role   = aws_iam_role.lambda_exec.id
  policy = data.aws_iam_policy_document.lambda_permissions.json
}
