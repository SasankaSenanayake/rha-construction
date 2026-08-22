# Partial backend config — the state bucket name comes from
# infra/bootstrap's output and is supplied at init time so it never has to
# be hardcoded here:
#
#   terraform init -backend-config="bucket=<state-bucket-name-from-bootstrap>"
#
# S3-native locking (use_lockfile) avoids needing a separate DynamoDB lock
# table, supported by Terraform 1.9+.
terraform {
  backend "s3" {
    key          = "rha-construction/dev/terraform.tfstate"
    region       = "eu-west-1"
    use_lockfile = true
    encrypt      = true
  }
}
