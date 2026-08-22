# Content Authoring

Full field reference lives in the Zod schemas at `apps/web/lib/content/schema.ts` — this page is a quick how-to.

## Adding a project

Create `apps/web/content/projects/<new-slug>.json` following the shape of an existing file (e.g. `nugegoda-family-home.json`). Required:

- `category` — must be one of `residential`, `commercial`, `renovation`, `interior-finishing`, `project-management`.
- `images` — at least one, each `src` must point to a file that actually exists under `apps/web/public/images/...` (the build fails otherwise).
- `translations.en`, `translations.si`, `translations.ta` — all three required, each with `title`, `summary`, and `bodyMd` (Markdown, rendered to HTML at build time).

Set `"featured": true` to have it appear in the homepage's featured-projects section.

## Adding a testimonial

Create `apps/web/content/testimonials/<id>.json`. `projectSlug` is optional — set it to link a testimonial to a specific project. `rating` is 1–5.

## Editing services

There are exactly 5 service files under `apps/web/content/services/`, one per fixed slug — these map 1:1 to the site's Services sub-pages and to the `projectType` options on the quote form. Don't add or remove service files without also updating `PROJECT_TYPES` in `packages/shared/src/schemas/quote.ts`, since that enum is the single source of truth shared between the content schema, the quote form, and the Lambda's validation.

## Adding real photos

1. Drop original photos under `apps/web/content-source-images/`, mirroring the target path under `public/images/` (e.g. a photo destined for `public/images/projects/foo/photo-1.webp` goes in `content-source-images/projects/foo/photo-1.jpg`).
2. Run `npm run optimize-images --workspace=apps/web` — resizes to a max 1600px width and re-encodes as WebP via `sharp` (static export has no server-side image optimization, so this has to happen at authoring time).
3. Reference the resulting `public/images/...` path from the relevant content JSON file.

## Translations

Every UI string (nav, buttons, form labels, static page copy) lives in `apps/web/messages/{en,si,ta}.json`, using next-intl's ICU message format. The Sinhala and Tamil strings currently in this repo — both in `messages/` and in every content file's `translations.si` / `translations.ta` — were drafted for structural completeness and have **not** been reviewed by a native speaker. Get that review before launch.
