variable "aws_region" {
  type    = string
  default = "eu-west-1"
}

variable "name_prefix" {
  type    = string
  default = "rha-construction-dev"
}

# --- Placeholders: replace before a real `terraform apply` ---

variable "domain_name" {
  type        = string
  description = "PLACEHOLDER — apex domain the site will be served from once purchased, e.g. rhaconstruction.lk"
  default     = "example.com"
}

variable "manage_dns" {
  type        = bool
  default     = false
  description = "Set true only once domain_name is a real, owned domain and route53_zone_id is set."
}

variable "route53_zone_id" {
  type    = string
  default = ""
}

variable "ses_domain" {
  type        = string
  description = "PLACEHOLDER — domain SES will send from, e.g. rhaconstruction.lk"
  default     = "example.com"
}

variable "ses_from_address" {
  type        = string
  description = "PLACEHOLDER — verified sending address, e.g. no-reply@rhaconstruction.lk"
  default     = "no-reply@example.com"
}

variable "ses_to_address" {
  type        = string
  description = "PLACEHOLDER — business owner's address that receives lead notifications"
  default     = "owner@example.com"
}

variable "alert_email" {
  type        = string
  description = "PLACEHOLDER — receives budget and CloudWatch alarm notifications"
  default     = "owner@example.com"
}

variable "budget_limit_usd" {
  type    = number
  default = 5
}

variable "github_org" {
  type        = string
  description = "PLACEHOLDER — GitHub org/user hosting this repo"
  default     = "your-github-username"
}

variable "github_repo" {
  type    = string
  default = "rha-construction"
}

variable "terraform_state_bucket_arn" {
  type        = string
  description = "ARN of the state bucket created by infra/bootstrap"
}

variable "create_oidc_provider" {
  type        = bool
  default     = false
  description = "Set false if this AWS account already has token.actions.githubusercontent.com registered as an OIDC provider (it's an account-wide singleton, so a second stack reusing the account needs this false)."
}
