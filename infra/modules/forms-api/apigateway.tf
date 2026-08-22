resource "aws_apigatewayv2_api" "forms_api" {
  name          = "${var.name_prefix}-forms-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = [var.allowed_origin]
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["content-type"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.forms_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.forms_api.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "contact" {
  api_id    = aws_apigatewayv2_api.forms_api.id
  route_key = "POST /contact"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "quote" {
  api_id    = aws_apigatewayv2_api.forms_api.id
  route_key = "POST /quote"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_cloudwatch_log_group" "api_access_logs" {
  name              = "/aws/apigateway/${var.name_prefix}-forms-api"
  retention_in_days = var.log_retention_days
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.forms_api.id
  name        = "$default"
  auto_deploy = true

  # Conservative throttle as a cheap abuse guardrail on a public endpoint.
  default_route_settings {
    throttling_burst_limit = 20
    throttling_rate_limit  = 10
  }

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_access_logs.arn
    format = jsonencode({
      requestId               = "$context.requestId"
      ip                      = "$context.identity.sourceIp"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
    })
  }
}

resource "aws_lambda_permission" "apigateway_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.forms_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.forms_api.execution_arn}/*/*"
}
