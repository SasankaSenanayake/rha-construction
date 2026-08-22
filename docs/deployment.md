# Deployment

Step-by-step commands are in the root [README](../README.md#deploying-infrastructure-terraform). This page covers the operational details worth knowing before you run anything.

## Order of operations for a first-ever deploy

1. `infra/bootstrap` — creates the Terraform state S3 bucket. Local-only, manual, once.
2. `infra/envs/prod` — the actual stack (S3 site bucket, CloudFront, API Gateway, Lambda, DynamoDB, SES, alarms, budgets, IAM). Requires real `terraform.tfvars` values to be useful beyond a syntax check — with only placeholder defaults, `manage_dns = false` so no Route 53 / DNS-dependent resources are created, and CloudFront serves over its default `*.cloudfront.net` certificate.
3. Copy the Terraform outputs (`gha_deploy_app_role_arn`, `gha_terraform_ci_role_arn`, `api_base_url`, `site_bucket_name`, `cloudfront_distribution_id`, `dynamodb_table_name`) into the GitHub repo's Actions **variables**.
4. Push to `main` — `deploy-app.yml` and `deploy-lambda.yml` pick up from there automatically.

## Why the app/Lambda deploys are automatic but Terraform apply is not

`deploy-app.yml` and `deploy-lambda.yml` only ever touch S3 object contents, a CloudFront invalidation, or a Lambda function's code — all trivially re-runnable if something goes wrong. `terraform-apply.yml` is `workflow_dispatch`-only and gated behind the `production` GitHub Environment's required reviewers, because a bad `terraform apply` (e.g. an accidental resource replacement) can be destructive or costly in a way a bad app deploy isn't.

## Cache-Control strategy

`deploy-app.yml` syncs in three passes:

1. `aws s3 sync ... --delete` — baseline, handles added/removed files.
2. Re-upload `_next/static/*` with `Cache-Control: public,max-age=31536000,immutable` — safe because these filenames are content-hashed by Next.js.
3. Re-upload `*.html` with `Cache-Control: public,max-age=0,must-revalidate` — so a new deploy is visible immediately (subject to the CloudFront invalidation that follows).

## Clean URLs

Next's static export with `trailingSlash: true` produces `/about/index.html` for the `/about/` route. S3's REST origin doesn't auto-resolve directory index files, so `infra/modules/static-site/cloudfront-function/url-rewrite.js` runs on CloudFront's Viewer Request event to append `index.html` where needed, and to 302-redirect the bare `/` to `/en/`.

## SES sandbox mode

New SES setups start in sandbox mode: only verified identities can send, and only verified addresses can receive. `infra/modules/email` pre-verifies the business owner's receiving address (`ses_to_address`) so form notification emails work immediately after apply. File an AWS SES production-access request separately once a real sending domain is set — approval can take a day or more, so do this early rather than at the last minute before launch.
