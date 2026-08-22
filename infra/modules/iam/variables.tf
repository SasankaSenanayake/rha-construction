variable "name_prefix" {
  type = string
}

variable "create_oidc_provider" {
  type        = bool
  default     = true
  description = "Set false if token.actions.githubusercontent.com is already registered as an OIDC provider in this AWS account (e.g. by another project) — the provider is an account-wide singleton."
}

variable "github_org" {
  type        = string
  description = "GitHub org/user that owns the repo, e.g. your-github-username"
}

variable "github_repo" {
  type        = string
  description = "Repo name, e.g. rha-construction"
}

variable "github_environment" {
  type        = string
  default     = "production"
  description = "GitHub Environment name the deploy/apply jobs run under (sets the OIDC sub claim's environment:<name> segment)."
}

variable "github_deploy_branch" {
  type        = string
  default     = "main"
  description = "Branch this stack's terraform-plan workflow trusts for its ref:refs/heads/<branch> and workflow_dispatch OIDC sub claims."
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
