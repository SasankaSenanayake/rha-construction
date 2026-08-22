variable "name_prefix" {
  type = string
}

variable "github_org" {
  type        = string
  description = "GitHub org/user that owns the repo, e.g. your-github-username"
}

variable "github_repo" {
  type        = string
  description = "Repo name, e.g. rha-construction"
}

variable "site_bucket_arn" {
  type = string
}

variable "distribution_arn" {
  type = string
}

variable "lambda_function_arn" {
  type = string
}

variable "terraform_state_bucket_arn" {
  type = string
}
