## Goal
Automatically sync products from Printify into the database every hour using a `pg_cron` job.

## What already exists
- `/api/public/hooks/sync-printify` — a server route that fetches all products from Printify, maps them, upserts them into the `products` table, and deactivates stale ones.
- `pg_cron` and `pg_net` extensions — already enabled and used by the email queue.

## What will be added
A single `pg_cron` schedule named `sync-printify-hourly` that calls the existing sync endpoint via `pg_net` every hour.

## Cron schedule
`0 * * * *` — runs at the top of every hour.

## Technical details
- Endpoint: `POST https://project--eabc624d-53f7-4564-8bf9-613c4b63a016.lovable.app/api/public/hooks/sync-printify`
- The endpoint accepts POST with an empty body and returns `{ ok, fetched, upserted, deactivated }`.
- No auth headers needed — `/api/public/*` routes are public.

## Validation after setup
Query `cron.job` to confirm the schedule exists, and optionally check `cron.job_run_details` after the first hour to verify successful runs.