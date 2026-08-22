# An IAM OIDC provider for a given URL is an account-wide singleton — if
# another project in this AWS account already registered
# token.actions.githubusercontent.com, creating a second one conflicts.
# Set create_oidc_provider = false to reuse the existing one instead.
data "aws_caller_identity" "current" {}

locals {
  oidc_provider_arn = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
}

# Fetched dynamically rather than hardcoded: GitHub has rotated its OIDC
# TLS certificate issuer before (DigiCert -> Let's Encrypt), which silently
# breaks a hardcoded thumbprint. AWS validates the cert chain itself and
# largely ignores this value in practice, but the field is still required.
data "tls_certificate" "github_actions" {
  count = var.create_oidc_provider ? 1 : 0
  url   = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_openid_connect_provider" "github_actions" {
  count          = var.create_oidc_provider ? 1 : 0
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
  thumbprint_list = [
    data.tls_certificate.github_actions[0].certificates[
      length(data.tls_certificate.github_actions[0].certificates) - 1
    ].sha1_fingerprint
  ]
}

data "aws_iam_openid_connect_provider" "existing" {
  count = var.create_oidc_provider ? 0 : 1
  arn   = local.oidc_provider_arn
}

locals {
  oidc_provider_effective_arn = var.create_oidc_provider ? aws_iam_openid_connect_provider.github_actions[0].arn : data.aws_iam_openid_connect_provider.existing[0].arn
}
