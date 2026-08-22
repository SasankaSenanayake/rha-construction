resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "${var.name_prefix}-site-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_function" "url_rewrite" {
  name    = "${var.name_prefix}-url-rewrite"
  runtime = "cloudfront-js-2.0"
  comment = "Rewrites clean URLs to index.html objects; redirects / to /en/"
  publish = true
  code    = file("${path.module}/cloudfront-function/url-rewrite.js")
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = ""
  price_class         = var.price_class
  aliases             = var.manage_dns ? [var.domain_name, "www.${var.domain_name}"] : []
  comment             = "${var.name_prefix} static site"

  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = "s3-site-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "s3-site-origin"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    cache_policy_id        = data.aws_cloudfront_cache_policy.caching_optimized.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.url_rewrite.arn
    }
  }

  custom_error_response {
    error_code         = 403
    response_code      = 404
    response_page_path = "/en/404/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 404
    response_page_path = "/en/404/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.manage_dns ? false : true
    acm_certificate_arn            = var.manage_dns ? aws_acm_certificate_validation.site[0].certificate_arn : null
    ssl_support_method             = var.manage_dns ? "sni-only" : null
    minimum_protocol_version       = var.manage_dns ? "TLSv1.2_2021" : null
  }
}

data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}
