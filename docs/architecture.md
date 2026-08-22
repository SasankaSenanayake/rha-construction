# Architecture

See the root [README](../README.md) for setup, deployment, and cost details. This page covers the "why" behind the shape of the system.

## Why fully static + serverless-for-forms

`output: 'export'` in `apps/web/next.config.mjs` produces a plain directory of HTML/CSS/JS with no Node server required at runtime. That directory is served by S3 behind CloudFront — there's no compute to patch, scale, or pay for idle. The only dynamic behavior the site needs (the contact and quote forms) is isolated into a single Lambda behind API Gateway, called directly from the browser via `fetch`.

## Why one Lambda, not two

`backend/forms-api/src/index.ts` routes on `event.routeKey` (`POST /contact` vs `POST /quote`) rather than deploying two separate functions. At this traffic volume the operational simplicity (one IAM role, one log group, one cold start to reason about) outweighs the isolation benefit of splitting them — see `infra/modules/forms-api`.

## Why a repository abstraction for storage

`backend/forms-api/src/repository/submission-repository.interface.ts` defines a storage-agnostic `save()` method; `DynamoDbSubmissionRepository` is the only implementation today. If a future need arises to move off DynamoDB (e.g. to Postgres for richer querying/admin tooling), only a new class implementing the same interface is needed — handler logic in `handlers/contact.ts` / `handlers/quote.ts` never changes.

## Why JSON content instead of a CMS

`apps/web/content/**/*.json` requires every project/service/testimonial to carry all three locale translations (`translations.{en,si,ta}`), enforced by Zod schemas (`lib/content/schema.ts`) at build time. This makes a missing Sinhala or Tamil translation a build failure, not a silent gap on the live site — see `docs/content-authoring.md`.

## Why Terraform modules are split the way they are

Each module in `infra/modules/` maps to one AWS capability area (`static-site`, `forms-api`, `data`, `email`, `observability`, `budgets`, `iam`) so a change to, say, the CloudFront cache behavior doesn't require reasoning about the DynamoDB table definition in the same file. `infra/envs/prod/main.tf` is the only place that wires them together.
