variable "name_prefix" {
  type        = string
  description = "Prefix used for resource names, e.g. rha-construction-prod"
}

variable "domain_name" {
  type        = string
  description = "Apex domain the site will be served from, e.g. example.com (placeholder until a real domain is chosen)"
}

variable "manage_dns" {
  type        = bool
  default     = false
  description = "Whether to create Route 53 records. Leave false until domain_name is a real, owned domain."
}

variable "route53_zone_id" {
  type        = string
  default     = ""
  description = "Hosted zone ID for domain_name. Required only when manage_dns is true."
}

variable "price_class" {
  type        = string
  default     = "PriceClass_200"
  description = "CloudFront price class. PriceClass_200 includes Asia Pacific edge locations, relevant for Sri Lankan visitors."
}
