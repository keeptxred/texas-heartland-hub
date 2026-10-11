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
