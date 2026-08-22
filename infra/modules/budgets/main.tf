variable "name_prefix" {
  type = string
}

variable "budget_limit_usd" {
  type        = number
  default     = 10
  description = "Monthly cost budget in USD. Free-tier services should keep actual spend near zero; this is a safety net."
}

variable "alert_email" {
  type = string
}

resource "aws_budgets_budget" "monthly_cost" {
  name         = "${var.name_prefix}-monthly-cost"
  budget_type  = "COST"
  limit_amount = tostring(var.budget_limit_usd)
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.alert_email]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.alert_email]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = [var.alert_email]
  }
}
