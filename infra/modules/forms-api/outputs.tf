output "api_endpoint" {
  value       = aws_apigatewayv2_api.forms_api.api_endpoint
  description = "Base invoke URL, e.g. https://abc123.execute-api.eu-west-1.amazonaws.com — set as NEXT_PUBLIC_API_BASE_URL"
}

output "function_name" {
  value = aws_lambda_function.forms_api.function_name
}

output "api_id" {
  value = aws_apigatewayv2_api.forms_api.id
}
