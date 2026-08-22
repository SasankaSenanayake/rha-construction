# Only requested once domain_name is real and manage_dns is true — an ACM
# cert for a placeholder/unowned domain can never validate and will sit
# (or time out) waiting forever. CloudFront falls back to its default
# *.cloudfront.net certificate whenever this is skipped (see cloudfront.tf).
#
# CloudFront only accepts ACM certificates issued in us-east-1, regardless
# of where the rest of the stack lives — hence the aliased provider.
resource "aws_acm_certificate" "site" {
  count = var.manage_dns ? 1 : 0

  provider                  = aws.us_east_1
  domain_name               = var.domain_name
  subject_alternative_names = ["www.${var.domain_name}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = var.manage_dns ? {
    for dvo in aws_acm_certificate.site[0].domain_validation_options : dvo.domain_name => {
      name  = dvo.resource_record_name
      type  = dvo.resource_record_type
      value = dvo.resource_record_value
    }
  } : {}

  zone_id = var.route53_zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.value]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "site" {
  count = var.manage_dns ? 1 : 0

  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.site[0].arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}
