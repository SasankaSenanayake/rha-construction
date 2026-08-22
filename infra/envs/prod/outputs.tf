output "site_bucket_name" {
  value = module.static_site.bucket_name
}

output "cloudfront_distribution_id" {
  value = module.static_site.distribution_id
}

output "cloudfront_domain_name" {
  value = module.static_site.distribution_domain_name
}

output "api_base_url" {
  value       = module.forms_api.api_endpoint
  description = "Set this as NEXT_PUBLIC_API_BASE_URL in apps/web/.env"
}

output "dynamodb_table_name" {
  value = module.data.table_name
}

output "lambda_function_name" {
  value       = module.forms_api.function_name
  description = "Set as LAMBDA_FUNCTION_NAME in GitHub Actions vars"
}

output "gha_deploy_app_role_arn" {
  value       = module.iam.deploy_app_role_arn
  description = "Set as AWS_DEPLOY_ROLE_ARN in GitHub Actions secrets/vars"
}

output "gha_terraform_ci_role_arn" {
  value       = module.iam.terraform_ci_role_arn
  description = "Set as AWS_TERRAFORM_ROLE_ARN in GitHub Actions secrets/vars"
}
