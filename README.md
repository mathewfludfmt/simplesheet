# SimpleSheet MVP

A production-ready MVP Next.js app that replaces the Smartsheet + Data Shuttle campaign workflow with a simpler architecture: Vercel-hosted frontend, Supabase Auth/Postgres, and a typed Excel importer for the `Campaigns` worksheet.

## What this MVP includes

- Internal authenticated dashboard for campaign operations.
- Excel import workflow that upserts by `campaign_number` and never overwrites manual/internal fields.
- Partner-authenticated read-only portal limited to `partner_visible` campaigns.
- Import run logging, row-level error logging, and UI summaries.
- Supabase SQL migrations, seed data, typed data access layer, and basic tests.

## Architecture

- **Frontend**: Next.js App Router, React, TypeScript, Tailwind CSS.
- **Backend/data access**: Supabase Postgres + Supabase Auth.
- **Deployment**: Vercel for the web app; Supabase for database/auth.
- **Import parser**: `xlsx` reading the `Campaigns` worksheet.
- **Secrets**: environment variables only.

## Routes

- `/login`
- `/internal/campaigns`
- `/internal/campaigns/[id]`
- `/internal/imports`
- `/partner/campaigns`

## Setup

1. Copy `.env.example` to `.env.local` and fill in Supabase values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Apply the SQL migration in Supabase SQL editor or via Supabase CLI.
4. Run the seed SQL for local/demo data.
5. Start the app:
   ```bash
   npm run dev
   ```

## Supabase auth and role setup

- Create users in Supabase Auth.
- Insert matching rows into `profiles` with role `internal` or `partner`.
- Middleware and server-side guards enforce route-level access.
- RLS policies restrict data access and partner visibility.

## Import behavior

- Reads only the `Campaigns` worksheet.
- Uses `CampaignNumber` as the unique business key.
- Existing campaigns: update imported/source fields only.
- New campaigns: insert a new record with default manual values.
- Missing `CampaignNumber`: write to `campaign_import_errors`.
- Every import writes a `campaign_import_runs` record with processed/inserted/updated/failed counters and summary JSON.

## Verification checklist

Run before deploying:

```bash
npm run lint
npm run typecheck
npm run test
```

Then validate in-app:

- Import creates new campaigns for unseen `campaign_number` values.
- Import updates existing campaigns for existing `campaign_number` values.
- Manual/internal fields remain unchanged after import.
- Partner users cannot access `/internal/*`.
- Internal users can access import and campaign editing flows.
- Partner portal returns only `partner_visible = true` campaigns.

## Deployment notes

### Vercel
- Add the same environment variables from `.env.example`.
- Deploy the Next.js app directly from the repository.
- Configure production domain and auth redirect URLs in Supabase.

### Supabase
- Run the migration in the target project.
- Create auth users and corresponding `profiles` rows.
- Optionally create a database webhook or cron later for notifications, but not required for MVP.

## Assumptions

- `notes` in the partner view are treated as partner-safe copy for MVP. For phase 2, split this into `internal_notes` and `partner_notes`.
- Sorting is primarily handled through database ordering plus focused filters to keep the MVP small.
- Uploads are handled synchronously in the Next.js route for the smallest viable production footprint.
- Provided Excel examples were not present in the repository, so the importer follows the explicitly supplied `Campaigns` worksheet mapping specification.

## Recommended phase 2 improvements

- Separate `partner_notes` from internal notes.
- Add async/background import processing for larger workbooks.
- Add audit history for manual field edits.
- Add richer sorting, saved filters, and pagination.
- Add file storage for archived uploaded workbooks.
