# GitHub's OIDC token "sub" claim format depends on how the job is
# triggered — a plain ref-based push is repo:OWNER/REPO:ref:refs/heads/BRANCH,
# a pull_request run is repo:OWNER/REPO:pull_request, but a job that
# specifies `environment: production` (as all of ours do at least once)
# gets repo:OWNER/REPO:environment:production instead, *regardless* of the
# trigger event. Each role's trust policy has to list every sub format any
# workflow that assumes it can actually present.
#
# As of the current GitHub default, the "OWNER/REPO" portion itself is also
# no longer the plain name — it's suffixed with each one's immutable numeric
# ID (e.g. "SasankaSenanayake@35719611/rha-construction@1342629525"), a
# GitHub-side hardening change to prevent identity confusion across repo
# renames/transfers. Confirmed via `gh api
# repos/OWNER/REPO/actions/oidc/customization/sub` (returns
# `sub_claim_prefix` including the IDs even with `use_default: true`) and
# via CloudTrail's rejected AssumeRoleWithWebIdentity events, which show the
# actual presented subject. The `@*` wildcard below matches the ID without
# hardcoding it, so this module stays portable across repos.
locals {
  deploy_app_allowed_subs = [
    # deploy-app.yml and deploy-lambda.yml both set environment: <github_environment>
    "repo:${var.github_org}@*/${var.github_repo}@*:environment:${var.github_environment}",
  ]

  terraform_ci_allowed_subs = [
    # terraform-plan.yml: pull_request trigger, no environment
    "repo:${var.github_org}@*/${var.github_repo}@*:pull_request",
    # terraform-plan.yml: workflow_dispatch trigger, no environment
    "repo:${var.github_org}@*/${var.github_repo}@*:ref:refs/heads/${var.github_deploy_branch}",
    # terraform-apply.yml: workflow_dispatch trigger, environment: <github_environment>
    "repo:${var.github_org}@*/${var.github_repo}@*:environment:${var.github_environment}",
  ]
}

data "aws_iam_policy_document" "deploy_app_assume_role" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [local.oidc_provider_effective_arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = local.deploy_app_allowed_subs
    }
  }
}

data "aws_iam_policy_document" "terraform_ci_assume_role" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [local.oidc_provider_effective_arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = local.terraform_ci_allowed_subs
    }
  }
}

# Deploys the built Next.js export to S3 + invalidates CloudFront
# (deploy-app.yml), and updates the Lambda function's code
# (deploy-lambda.yml). Deliberately excluded from any Terraform/infra
# permissions — an app-deploy workflow can never change infrastructure.
resource "aws_iam_role" "deploy_app" {
  name               = "${var.name_prefix}-gha-deploy-app"
  assume_role_policy = data.aws_iam_policy_document.deploy_app_assume_role.json
}

data "aws_iam_policy_document" "deploy_app_permissions" {
  statement {
    sid       = "SyncSiteBucket"
    effect    = "Allow"
    actions   = ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"]
    resources = [var.site_bucket_arn, "${var.site_bucket_arn}/*"]
  }

  statement {
    sid       = "InvalidateDistribution"
    effect    = "Allow"
    actions   = ["cloudfront:CreateInvalidation"]
    resources = [var.distribution_arn]
  }

  statement {
    sid       = "UpdateLambdaCode"
    effect    = "Allow"
    actions   = ["lambda:UpdateFunctionCode"]
    resources = [var.lambda_function_arn]
  }
}

resource "aws_iam_role_policy" "deploy_app_permissions" {
  name   = "${var.name_prefix}-gha-deploy-app-policy"
  role   = aws_iam_role.deploy_app.id
  policy = data.aws_iam_policy_document.deploy_app_permissions.json
}

# Runs `terraform plan`/`apply` against infra/**. Scoped to the approved
# service list (S3, CloudFront, Lambda, API Gateway, DynamoDB, SES, ACM,
# Route53, CloudWatch, SNS, Budgets, IAM-for-these-resources) — never
# AdministratorAccess. terraform-plan.yml uses this on every infra PR;
# terraform-apply.yml uses it only on manual, human-approved dispatch.
resource "aws_iam_role" "terraform_ci" {
  name               = "${var.name_prefix}-gha-terraform-ci"
  assume_role_policy = data.aws_iam_policy_document.terraform_ci_assume_role.json
}

data "aws_iam_policy_document" "terraform_ci_permissions" {
  statement {
    sid    = "ApprovedServices"
    effect = "Allow"
    actions = [
      "s3:*",
      "cloudfront:*",
      "lambda:*",
      "apigateway:*",
      "dynamodb:*",
      "ses:*",
      "acm:*",
      "route53:*",
      "logs:*",
      "cloudwatch:*",
      "sns:*",
      "budgets:*",
      "iam:GetRole",
      "iam:CreateRole",
      "iam:DeleteRole",
      "iam:UpdateAssumeRolePolicy",
      "iam:PutRolePolicy",
      "iam:DeleteRolePolicy",
      "iam:GetRolePolicy",
      "iam:PassRole",
      "iam:TagRole",
      "iam:ListRolePolicies",
      "iam:ListAttachedRolePolicies",
    ]
    resources = ["*"]
  }

  statement {
    sid       = "TerraformStateAccess"
    effect    = "Allow"
    actions   = ["s3:GetObject", "s3:PutObject", "s3:ListBucket"]
    resources = [var.terraform_state_bucket_arn, "${var.terraform_state_bucket_arn}/*"]
  }
}

resource "aws_iam_role_policy" "terraform_ci_permissions" {
  name   = "${var.name_prefix}-gha-terraform-ci-policy"
  role   = aws_iam_role.terraform_ci.id
  policy = data.aws_iam_policy_document.terraform_ci_permissions.json
}

output "deploy_app_role_arn" {
  value = aws_iam_role.deploy_app.arn
}

output "terraform_ci_role_arn" {
  value = aws_iam_role.terraform_ci.arn
}
