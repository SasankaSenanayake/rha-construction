output "bucket_name" {
  value = aws_s3_bucket.site.bucket
}

output "distribution_id" {
  value = aws_cloudfront_distribution.site.id
}

output "distribution_arn" {
  value = aws_cloudfront_distribution.site.arn
}

output "distribution_domain_name" {
  value = aws_cloudfront_distribution.site.domain_name
}

# Used by the forms-api module to scope API Gateway CORS to the actual
# CloudFront domain instead of a manually-tracked variable.
output "site_origin" {
  value = var.manage_dns ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.site.domain_name}"
}
