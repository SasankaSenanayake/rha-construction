variable "ses_domain" {
  type        = string
  description = "Domain to send from, e.g. rha-construction.example.com (placeholder until a real sending domain is chosen)"
}

variable "ses_to_address" {
  type        = string
  description = "Business owner's email address that receives lead notifications. Must be verified while SES is in sandbox mode."
}

variable "manage_dns" {
  type    = bool
  default = false
}

variable "route53_zone_id" {
  type    = string
  default = ""
}

resource "aws_ses_domain_identity" "sending_domain" {
  domain = var.ses_domain
}

resource "aws_ses_domain_dkim" "sending_domain" {
  domain = aws_ses_domain_identity.sending_domain.domain
}

resource "aws_route53_record" "ses_verification" {
  count = var.manage_dns ? 1 : 0

  zone_id = var.route53_zone_id
  name    = "_amazonses.${var.ses_domain}"
  type    = "TXT"
  ttl     = 600
  records = [aws_ses_domain_identity.sending_domain.verification_token]
}

resource "aws_route53_record" "dkim" {
  for_each = var.manage_dns ? toset(aws_ses_domain_dkim.sending_domain.dkim_tokens) : toset([])

  zone_id = var.route53_zone_id
  name    = "${each.value}._domainkey.${var.ses_domain}"
  type    = "CNAME"
  ttl     = 600
  records = ["${each.value}.dkim.amazonses.com"]
}

# SES starts in sandbox mode: only verified identities can receive mail
# until AWS approves a production-access request. This placeholder
# verifies the owner's receiving address so notification emails work
# immediately after apply, before production access is granted.
resource "aws_ses_email_identity" "owner_recipient" {
  email = var.ses_to_address
}

output "sending_domain_identity_arn" {
  value = aws_ses_domain_identity.sending_domain.arn
}
