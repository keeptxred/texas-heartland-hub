# KeepTXRed evergreen authority and verification ledger

## Scope
Improve permanent Texas government, property tax, laws, public services, economy and business reference pages. Preserve existing election functionality; do not expand candidate/race content. Lifestyle destinations belong to TexasDefined.

## Existing foundation (verified from main)
- `src/shared/texas-platform/entities.ts` and `relationships.ts` contain the shared entity graph.
- `scripts/shared/validate-entity-framework.ts` checks entity identifiers, routes, relationships and official-source URL syntax, but does not independently verify factual claims.
- Homepage already links to policy trackers, data, legislature, representatives, districts and economy.
- Existing `shared:entities:validate` and `seo:validate` commands must continue passing.

## Phase 1 priority inventory (25 topics, NOT 25 assumed missing pages)
Homestead exemption; property tax protest; appraisal districts; property tax deadlines; senior exemptions; disabled veteran exemptions; homeowners insurance; Texas Constitution; Texas Property Code; Texas Public Information Act; landlord-tenant law; firearm law; HOA law; Comptroller; DPS; TxDOT; Attorney General; Railroad Commission; Secretary of State; Texas LLC formation; franchise tax; sales tax permits; cost of living; employment and wages; housing market.

## Verification policy
- Agencies and laws: weekly plus event-driven checks of primary sources.
- Tax deadlines and rates: monthly plus official releases and effective-date triggers.
- Economy: on publication of the underlying official dataset.
- Historical reference: quarterly.
- Source outages are not verification successes. No substantive content changes, `dateModified` changes, or last-verified claims without evidence.
- Any disputed, legal, political, tax, or financial change requires editorial review.
- Store exact source URL, check time, evidence, diff and review decision. Do not treat HTTP 200 or an unchanged page hash as independent factual verification.
- Respect source robots, rate limits, caching and reasonable fetch budgets.

## Release checklist
1. Inventory all existing routes and their source references; mark each of 25 topics existing / partial / missing.
2. Prioritize improvements to existing pages; prevent near-duplicate routes and cross-site cannibalization.
3. Connect source checks to existing ingestion/cron and durable Supabase storage after schema inspection.
4. Add admin review queue with source excerpts, before/after diff, reviewer and audit trail.
5. Add tests for failed sources, conflicting evidence, stale facts, approvals, redirects and published metadata.
6. Verify staging and production before enabling automation.

## Current status
Typed verification records, source checks, source registry, route inventory, private database tables and CI validation have been implemented. The secure editorial queue, durable source-check ingestion, complete factual inventory and production release remain unfinished.

## Implementation checkpoint
- Private ledger SQL migration committed and applied to Supabase on 2026-10-11.
- Read-only official-source list and scheduled GitHub Actions workflow committed; scheduled workflows do not run from an unmerged feature branch.
- A successful source fetch is classified as retrieved-not-verified, not a factual verification.
- PR must pass CI and merge before the weekly watch can run from default branch. No automatic publication.

## Database application verified (2026-10-11)
- Applied private `ktr_evergreen_verifications` and `ktr_evergreen_verification_events` tables in Supabase project `ftkznprjljkhymknvhye` through two database migrations.
- Queried Postgres catalog to verify both tables have row-level security enabled.
- Tables are deliberately not exposed to anonymous or ordinary authenticated clients; absence of public RLS policies is intentional.
- Source-check to ledger ingestion and editorial review UI are **not yet implemented**; no content is auto-published.

## Security design decision
The existing `/admin` layout uses a client-side passcode and sessionStorage, which is **not** server authentication. Do not expose service-role credentials or a ledger-writing endpoint protected only by that passcode. A server-verified identity and authorization check must precede editorial writes. Until then, keep the private Supabase tables server-only and use CI artifacts for source monitoring.

## Source-check ingestion implementation (2026-10-11)
- `scripts/evergreen/persist-source-results.mjs` writes each source check to the private Supabase ledger and appends an audit event, **only** when server credentials are configured.
- The weekly workflow invokes ingestion with GitHub Actions secrets `KTR_EVERGREEN_SUPABASE_URL` and `KTR_EVERGREEN_SUPABASE_SERVICE_ROLE_KEY`. Without these, ingestion fails closed and the workflow reports a failure rather than silently succeeding.
- Source monitor entries use `source:<id>` and `/internal/evergreen/sources/<id>` identifiers, not fabricated published page claims. They are not a substitute for per-page factual review.
- Do not put the service-role key in client-side Vite variables. Confirm secrets and workflow execution after merge; the secure editorial approval interface remains unimplemented.

## CI and credential checkpoint (2026-10-11)
- All six CI checks passed on commit `111715821`, including Evergreen Entity Audit, workflow validation, repository health and production build.
- The ingestion runner now fails closed on missing credentials; CI checks validate syntax but do not exercise the private production database write.
- Configure and verify GitHub Actions secrets before merging or dispatching the source-watch workflow. No claim of successful live ingestion is made.

## Live readiness check (2026-10-11)
- All six CI workflows succeeded at `363539f9737e217f56c7283b389dfd2904df419f`.
- Direct database counts: **zero** rows in `ktr_evergreen_verifications` and **zero** rows in `ktr_evergreen_verification_events`. No live source ingestion has occurred; do not describe it as operational.
- Weekly schedule activates on default branch only after merge; secret availability and real service-role write permissions still require a workflow run.
- Do not merge or announce production readiness before verifying real ledger writes, authenticated editorial review, and the publishing guard.

## Batch ingestion integrity (2026-10-11)
- The private writer prevalidates every source record before its first network write, rejecting duplicate IDs, malformed government URLs, unknown statuses and invalid timestamps.
- **Important remaining limitation:** PostgREST writes to verification records and audit events are separate requests; a network failure between them can leave a partial batch. Production acceptance requires atomic server-side ingestion (single transaction or equivalent idempotent recovery) before treating this as fully reliable.

## Atomic ingestion deployment (2026-10-11)
- Applied `ktr_evergreen_atomic_source_ingestion` migration to the shared Supabase project. GitHub migration file: `supabase/migrations/20261011194500_ktr_evergreen_atomic_source_ingestion.sql`.
- `ktr_ingest_evergreen_source_batch(jsonb)` performs all verification upserts and append-only audit inserts in one PostgreSQL transaction, validating the batch before writes.
- Direct privilege check: `anon_execute=false`, `authenticated_execute=false`, `service_execute=true`.
- GitHub ingestion script now calls the atomic RPC; the prior separate REST writes are removed.
- **Still pending:** GitHub Actions credentials, successful live source-watch dispatch and persisted records, CI for these new changes, authenticated human review, and release verification.

## CI acceptance update (2026-10-11)
- Commit `4ca4cc7c316f0eff0f38f050b20cabdcd9ce98b9` passed all six pull-request workflows: repository health, production build, evergreen audit, workflow validation, roundup contract, daily news publication.
- The live Supabase ledger still had zero verification records and zero events at last inspection; successful CI does not establish live ingestion.
- The source-watch workflow now retains its source-check artifact on failure for diagnostics; private ledger persistence remains mandatory and fails closed when secrets are missing.
- PR remains draft; do not merge or claim full release readiness until live credentials, persisted source checks, authenticated human factual approval, and production verification are complete.

## Authenticated editorial review gate (2026-10-12 migration)
- Applied `ktr_evergreen_authenticated_editor_approval` migration: private `ktr_evergreen_reviewers` allowlist keyed to `auth.users`, and `ktr_approve_evergreen_verification(entity_id)` with a server-side `auth.uid()` authorization check, locked-row validation, and append-only editor approval event.
- Anonymous callers cannot execute the approval RPC. Authenticated callers must additionally be enabled in the reviewer allowlist. Raw `source:*` monitoring observations are explicitly ineligible for factual approval.
- Reviewer allowlist is intentionally empty pending confirmation of the owner's actual Supabase Auth user UUID. Do not guess an identity or authorize the browser-only `/admin` passcode.
- Remaining: provision an authenticated editor using an owner-verified Auth identity, build an authenticated review UI, exercise positive/negative end-to-end approval tests, and prove source-watch ingestion with configured GitHub secrets.
