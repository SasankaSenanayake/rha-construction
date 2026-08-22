variable "name_prefix" {
  type = string
}

# Provisioned, fixed low capacity — comfortably inside DynamoDB's always-free
# 25 WCU / 25 RCU tier at the traffic volumes a lead-gen form sees.
resource "aws_dynamodb_table" "form_submissions" {
  name           = "${var.name_prefix}-form-submissions"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "pk"
  range_key      = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  point_in_time_recovery {
    enabled = true
  }
}

output "table_name" {
  value = aws_dynamodb_table.form_submissions.name
}

output "table_arn" {
  value = aws_dynamodb_table.form_submissions.arn
}
