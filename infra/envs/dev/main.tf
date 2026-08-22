module "static_site" {
  source = "../../modules/static-site"
  providers = {
    aws           = aws
    aws.us_east_1 = aws.us_east_1
  }

  name_prefix     = var.name_prefix
  domain_name     = var.domain_name
  manage_dns      = var.manage_dns
  route53_zone_id = var.route53_zone_id
}

module "data" {
  source      = "../../modules/data"
  name_prefix = var.name_prefix
}

module "email" {
  source          = "../../modules/email"
  ses_domain      = var.ses_domain
  ses_to_address  = var.ses_to_address
  manage_dns      = var.manage_dns
  route53_zone_id = var.route53_zone_id
}

module "forms_api" {
  source = "../../modules/forms-api"

  name_prefix      = var.name_prefix
  table_name       = module.data.table_name
  table_arn        = module.data.table_arn
  ses_from_address = var.ses_from_address
  ses_to_address   = var.ses_to_address
  ses_identity_arn = module.email.sending_domain_identity_arn
  allowed_origin   = module.static_site.site_origin
}

module "observability" {
  source = "../../modules/observability"

  name_prefix          = var.name_prefix
  alert_email          = var.alert_email
  lambda_function_name = module.forms_api.function_name
  api_id               = module.forms_api.api_id
}

module "budgets" {
  source = "../../modules/budgets"

  name_prefix      = var.name_prefix
  budget_limit_usd = var.budget_limit_usd
  alert_email      = var.alert_email
}

module "iam" {
  source = "../../modules/iam"

  name_prefix                = var.name_prefix
  create_oidc_provider       = var.create_oidc_provider
  github_org                 = var.github_org
  github_repo                = var.github_repo
  github_environment         = "development"
  github_deploy_branch       = "dev"
  site_bucket_arn            = "arn:aws:s3:::${module.static_site.bucket_name}"
  distribution_arn           = module.static_site.distribution_arn
  lambda_function_arn        = "arn:aws:lambda:${var.aws_region}:${data.aws_caller_identity.current.account_id}:function:${module.forms_api.function_name}"
  terraform_state_bucket_arn = var.terraform_state_bucket_arn
}

data "aws_caller_identity" "current" {}
