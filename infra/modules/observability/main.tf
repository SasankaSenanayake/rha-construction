variable "name_prefix" {
  type = string
}

variable "alert_email" {
  type        = string
  description = "Email address to receive Lambda error / API 5xx alarm notifications."
}

variable "lambda_function_name" {
  type = string
}

variable "api_id" {
  type = string
}

variable "api_stage_name" {
  type    = string
  default = "$default"
}

resource "aws_sns_topic" "alerts" {
  name = "${var.name_prefix}-alerts"
}

resource "aws_sns_topic_subscription" "alert_email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "${var.name_prefix}-forms-api-lambda-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 0
  alarm_description   = "forms-api Lambda returned one or more errors in the last 5 minutes."
  alarm_actions       = [aws_sns_topic.alerts.arn]
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = var.lambda_function_name
  }
}

resource "aws_cloudwatch_metric_alarm" "lambda_throttles" {
  alarm_name          = "${var.name_prefix}-forms-api-lambda-throttles"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Throttles"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 0
  alarm_description   = "forms-api Lambda was throttled in the last 5 minutes."
  alarm_actions       = [aws_sns_topic.alerts.arn]
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = var.lambda_function_name
  }
}

resource "aws_cloudwatch_metric_alarm" "api_5xx" {
  alarm_name          = "${var.name_prefix}-forms-api-5xx"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "5xx"
  namespace           = "AWS/ApiGateway"
  period              = 300
  statistic           = "Sum"
  threshold           = 0
  alarm_description   = "forms-api API Gateway returned one or more 5xx responses in the last 5 minutes."
  alarm_actions       = [aws_sns_topic.alerts.arn]
  treat_missing_data  = "notBreaching"

  dimensions = {
    ApiId = var.api_id
    Stage = var.api_stage_name
  }
}
