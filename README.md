# RHA Construction — Website & Infrastructure

A production-ready marketing site for RHA Construction, a Sri Lankan construction contractor. Fully static Next.js frontend (English/Sinhala/Tamil) served from S3 + CloudFront, with a minimal serverless backend (Lambda + API Gateway + DynamoDB + SES) for the contact and quote forms — designed to run at effectively zero cost within AWS's free tier.

## Status: placeholder content

Everything here builds, tests, and deploys, but several things are **placeholders** that must be replaced before going live:

- **Company legal name, phone/WhatsApp number, email, address** — set in `apps/web/.env.example` / GitHub Actions repo variables.
- **Domain name** — `infra/envs/prod/terraform.tfvars` `domain_name` / `ses_domain`.
- **Project photos, case-study copy, testimonials** — `apps/web/content/**/*.json` and `apps/web/public/images/**` currently hold generated placeholder SVGs and drafted (not real) case studies/testimonials.
- **Sinhala and Tamil translations** (`apps/web/messages/{si,ta}.json` and the `translations.{si,ta}` blocks in every content file) were drafted without a native-speaker review — get one before launch.
- **SES production access** — new SES accounts start in *sandbox mode* and can only email verified addresses. File an AWS SES production-access request early; it can take a day or more to be approved.

## Repository layout

```
apps/web/            Next.js 14 App Router site (output: 'export')
packages/shared/      Zod schemas + types shared by the web app and the Lambda
backend/forms-api/    Single Lambda handling POST /contact and POST /quote
infra/                Terraform (bootstrap/, envs/prod/, modules/*)
.github/workflows/    CI, app deploy, Lambda deploy, Terraform plan/apply
```

## Local development

Requires Node 20+ (see `.nvmrc`) and npm.

```bash
npm install
cp apps/web/.env.example apps/web/.env.local   # edit with placeholder or real values
npm run dev                                    # starts apps/web on localhost:3000
```

Visit `http://localhost:3000/en/`, `/si/`, `/ta/`. Forms POST to `NEXT_PUBLIC_API_BASE_URL` — point that at a deployed dev-stage API Gateway endpoint, or stub it locally.

### Running tests

```bash
npm test --workspaces      # Vitest across packages/shared, backend/forms-api, apps/web
npm run typecheck --workspaces
npm run lint --workspaces
```

### Building the static site

```bash
npm run build --workspace=apps/web    # -> apps/web/out/
```

## Adding or editing content

Content is git-tracked JSON (no CMS) under `apps/web/content/`:

- `content/projects/<slug>.json` — one file per portfolio project. `translations.{en,si,ta}` are all required; the build fails loudly if one is missing or if an `images[].src` doesn't exist under `public/`.
- `content/services/<slug>.json` — one of the 5 fixed service slugs (`residential`, `commercial`, `renovation`, `interior-finishing`, `project-management`).
- `content/testimonials/*.json` — one file per testimonial.

To add real photos: drop originals under `apps/web/content-source-images/` (mirroring the target path under `public/images/`) and run `npm run optimize-images --workspace=apps/web` — this resizes to a max 1600px width and re-encodes as WebP via `sharp`, since static export has no server-side image optimization.

UI strings (nav, buttons, form labels) live in `apps/web/messages/{en,si,ta}.json` — next-intl ICU format.

## Deploying infrastructure (Terraform)

One-time, local, manual bootstrap (creates the Terraform state bucket):

```bash
cd infra/bootstrap
AWS_PROFILE=<your-profile> terraform init
AWS_PROFILE=<your-profile> terraform apply -var="state_bucket_name=rha-construction-tfstate-<unique-suffix>"
```

Then, for the main stack:

```bash
cd infra/envs/prod
cp terraform.tfvars.example terraform.tfvars   # fill in real values
AWS_PROFILE=<your-profile> terraform init -backend-config="bucket=<state-bucket-name-from-bootstrap>"
AWS_PROFILE=<your-profile> terraform plan
AWS_PROFILE=<your-profile> terraform apply
```

Outputs include the CloudFront domain, API base URL, DynamoDB table name, and the two GitHub Actions OIDC role ARNs — copy these into the repo's GitHub Actions **variables** (Settings → Secrets and variables → Actions → Variables): `AWS_DEPLOY_ROLE_ARN`, `AWS_TERRAFORM_ROLE_ARN`, `AWS_REGION`, `S3_BUCKET_NAME`, `CLOUDFRONT_DISTRIBUTION_ID`, `LAMBDA_FUNCTION_NAME`, `API_BASE_URL`, `TF_STATE_BUCKET`, plus the `NEXT_PUBLIC_*` business-detail variables used by `deploy-app.yml`. Also create a GitHub **Environment** named `production` with required reviewers, so `terraform-apply.yml` and the deploy workflows are gated.

## CI/CD

- **`ci.yml`** — lint/typecheck/test/build sanity check on every PR and push.
- **`deploy-app.yml`** — auto-runs on push to `main` when `apps/web/**` or `packages/shared/**` change: builds the static export, syncs to S3 in three passes (baseline, then long-cache hashed assets, then short-cache HTML), invalidates CloudFront.
- **`deploy-lambda.yml`** — auto-runs on push to `main` when `backend/forms-api/**` or `packages/shared/**` change: bundles with esbuild, updates the Lambda's code via `aws lambda update-function-code`.
- **`terraform-plan.yml`** — runs `terraform plan` on any PR touching `infra/**`, posts the diff for review.
- **`terraform-apply.yml`** — `workflow_dispatch` only, gated by the `production` environment's required reviewers. Infra changes are **never** automatic on push — a bad app/Lambda deploy is trivially fixable by re-running the workflow, but a bad infra apply can be destructive, so it always requires a deliberate, reviewed trigger.

All AWS access from GitHub Actions uses OIDC federation (`infra/modules/iam`) — no long-lived AWS access keys are stored as secrets.

## Estimated monthly cost

Assuming low-to-medium traffic (a few thousand page views/month, a few hundred form submissions/month) and staying within AWS's **always-free** tiers (DynamoDB 25 WCU/RCU, Lambda 1M requests, SES 62k emails from EC2/Lambda) plus the **12-months-free** tiers on a new account (CloudFront 1TB transfer, API Gateway 1M HTTP API calls, S3 5GB):

| Service | New account (first 12 months) | After 12 months / established account |
|---|---|---|
| S3 | $0 (within 5GB free tier) | ~$0.10–0.50/mo (few GB of assets) |
| CloudFront | $0 (within 1TB free tier) | ~$1–5/mo at this traffic level |
| Lambda | $0 (always-free 1M requests/mo) | $0 (unlikely to exceed always-free tier) |
| API Gateway (HTTP API) | $0 (within 1M calls free tier) | ~$1/mo per 1M calls beyond that — **flagged**: this is the main cost cliff to watch after year one |
| DynamoDB | $0 (always-free 25 WCU/25 RCU) | $0 (form-submission volume is far below this) |
| SES | $0 (well within free sending limits) | $0 |
| Route 53 | N/A until a domain is added | ~$0.50/mo per hosted zone + $12–15/yr domain registration (external) |
| ACM | $0 (always free) | $0 |
| CloudWatch / SNS / Budgets | $0–1/mo (small log volume, one SNS topic) | $0–1/mo |

**Realistic estimate: $0–2/month for the first year**, rising to roughly **$2–8/month** after the 12-month free tier expires, dominated by CloudFront data transfer and Route 53's hosted-zone fee — assuming traffic stays in the "small local business" range this site is built for. An AWS Budgets alert (`infra/modules/budgets`) is wired to email at 80%/100% of a configurable monthly ceiling (`budget_limit_usd`, default $10) as a safety net.

## Flagged cost/scope risks

- **API Gateway HTTP API** free tier is time-limited to a new account's first 12 months, then billed per-million-calls — the single highest-risk line item to monitor via Budgets.
- **CloudFront** free tier is also 12-months-only; `PriceClass_200` (chosen for Sri Lanka/Asia-Pacific latency) costs slightly more than `PriceClass_100` outside that window.
- **SES sandbox mode** — until AWS approves production access, only *verified* recipient addresses receive email. The Terraform `email` module pre-verifies the business owner's receiving address so notifications work immediately, but sending to arbitrary customer addresses (if that's ever added) would need production access first.
- Everything is deliberately scoped to S3, CloudFront, Lambda, API Gateway, DynamoDB, SES, ACM, Route 53, CloudWatch, SNS (added with explicit approval for error alarms), and Budgets — no other AWS service is used.
