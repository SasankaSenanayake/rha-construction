variable "name_prefix" {
  type = string
}

variable "table_name" {
  type = string
}

variable "table_arn" {
  type = string
}

variable "ses_from_address" {
  type = string
}

variable "ses_to_address" {
  type = string
}

variable "ses_identity_arn" {
  type        = string
  description = "ARN of the verified SES domain identity used to scope the ses:SendEmail IAM permission."
}

variable "allowed_origin" {
  type        = string
  description = "Origin allowed to call this API via CORS — the CloudFront distribution's own URL."
}

variable "log_retention_days" {
  type    = number
  default = 14
}
