# Apply PR #98 legislative document ingestion migrations

Waiting on the branch sync: PR #98 / `feature/legislative-document-ingestion` is not in this workspace yet, and neither migration file exists. Once you sync it, I run the steps below with no redesign and no new SQL of my own.

## Steps

1. Confirm both files are present, unchanged from the PR:
   - `supabase/migrations/20260803010000_legislative_document_ingestion.sql`
   - `supabase/migrations/20260803020000_legislative_document_completeness.sql`
2. Apply them in that order, verbatim, one migration call each. If the first fails, stop and report — no partial patching.
3. Verify against the live database:
   - new `bill_documents` columns (document/version/hash/text fields) present with expected types
   - `legislative_report_indexes` table exists, with RLS enabled and grants present
   - `refresh_bill_document_latest_flags` function exists
   - `legislative_bill_document_completeness` exists
4. Verify the app:
   - `/bills` returns 200
   - one existing bill-detail page (`/bills/texas/89/hb/939`) returns 200
   - server logs and responses show no PGRST, missing-column, missing-table, or 500 errors
5. Fix only errors caused directly by these two migrations (for example a grant or RLS omission that blocks an existing page). Anything else gets reported, not changed.

## Out of scope

- No local archive import run
- No publish/deploy
- No schema changes beyond the two PR migrations
- No UI or design changes

## Report

Migration result, verification result (each check pass/fail), and any exact error messages.
