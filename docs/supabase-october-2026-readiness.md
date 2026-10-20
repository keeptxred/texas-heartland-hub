# Explicit Data API permissions

Supabase stops automatically granting API access to newly created public tables on October 30, 2026. Existing grants remain unchanged. Both sites use project `ftkznprjljkhymknvhye`.

The additive `explicit_data_api_grants_readiness` migration is identical in both repositories. It reconciles application table and sequence permissions after legacy migrations have run. Do not rewrite the historical migration records. Run the complete migration chain before starting application traffic in a recreated environment.

The reviewed manifest records the SELECT/INSERT/UPDATE/DELETE permissions present on October 20, plus USAGE/SELECT on sequences. It does not restore automatic default grants, change row policies, or copy administrative privileges such as TRUNCATE. Private tables remain service-role-only where that is their existing access model. All existing public tables already have RLS enabled; the migration also establishes that condition on a rebuilt table.

One source-tracked table, `newsroom_editorial_actions`, is absent in production. Its creation migration describes it as a server-only audit log. The readiness migration therefore grants only service-role DML if it exists. It does not create it in production.

Because each repository can contain only part of the shared schema, the migration skips absent objects by exact name. It is idempotent and should be applied only once to the shared project. This change reconciles permissions; it does not claim to repair unrelated historical dependency or extension problems in a complete database reset.

New table migrations must include explicit role grants, RLS, appropriate policies, and sequence permissions for generated IDs. `node --test scripts/database/test-data-api-grants.mjs` checks the frozen legacy manifest and rejects new static public table definitions without those declarations. Dynamic SQL creation requires manual review; this structural validator is not a complete SQL parser or authorization audit.

Verification: isolated PostgreSQL-compatible PGlite execution with default API grants absent, empty/subset schema execution, repeated application, 2,004 per-role privilege assertions, RLS-denied reads without a policy, anonymous denial on private intake, and service-role access. Full application migration replay and production HTTP flows are separate checks; the isolated test uses representative empty relations with the exact production object names.
