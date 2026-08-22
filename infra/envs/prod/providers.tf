terraform {
  required_version = ">= 1.9"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "rha-construction"
      Environment = "prod"
      ManagedBy   = "terraform"
    }
  }
}

# CloudFront requires ACM certificates to be issued in us-east-1,
# regardless of which region the rest of the stack runs in.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "rha-construction"
      Environment = "prod"
      ManagedBy   = "terraform"
    }
  }
}
