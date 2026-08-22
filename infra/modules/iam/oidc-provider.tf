# Fetched dynamically rather than hardcoded: GitHub has rotated its OIDC
# TLS certificate issuer before (DigiCert -> Let's Encrypt), which silently
# breaks a hardcoded thumbprint. AWS validates the cert chain itself and
# largely ignores this value in practice, but the field is still required.
data "tls_certificate" "github_actions" {
  url = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_openid_connect_provider" "github_actions" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
  thumbprint_list = [
    data.tls_certificate.github_actions.certificates[
      length(data.tls_certificate.github_actions.certificates) - 1
    ].sha1_fingerprint
  ]
}
