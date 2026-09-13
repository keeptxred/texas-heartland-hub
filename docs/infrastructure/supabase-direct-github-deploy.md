# Direct Supabase migrations from GitHub

KeepTXRed deploys Supabase database migrations directly from GitHub Actions.

## Preferred production path

The `Apply Supabase Migrations` workflow accepts a single GitHub Actions repository secret named `SUPABASE_DB_URL`.

Set that secret to the production project's **Session Pooler** Postgres connection URI from the Supabase dashboard's **Connect** dialog. Use the connection string with the real database password substituted for the password placeholder.

Why Session Pooler: GitHub-hosted runners are IPv4 clients, while a direct Supabase database hostname may require IPv6 depending on the project. The Session Pooler is the safer CI transport.

The workflow then runs:

```sh
supabase db push --db-url "$SUPABASE_DB_URL" --include-all
supabase migration list --db-url "$SUPABASE_DB_URL"
```

This path talks directly to Postgres and does not require a Supabase Personal Access Token.

## Fail-closed read-only parity fallback

If no database write transport is configured, the workflow does **not** skip migration safety and does **not** pretend migrations were applied. It switches to a read-only verification mode implemented by `scripts/verify-supabase-migration-parity.sh`.

The production migration ledger predates the current repository history and does not contain every historical SQL filename still present in `supabase/migrations/`. For that reason, verify-only mode deliberately checks the **migration delta introduced by the exact current revision**, not the entire historical directory.

The fallback works as follows:

1. determine the exact parent-to-current revision diff;
2. inspect changes under `supabase/migrations/`;
3. allow only newly added, correctly versioned migration files in verify-only mode;
4. fail closed if an existing migration was edited, deleted, or renamed because a version-only ledger check cannot prove SQL-content equivalence;
5. call production `verify_repo_migrations(text[])` using only the checked-in public Supabase URL and publishable key; and
6. succeed only when production reports every newly added migration version in that revision as already applied.

If the revision changes only the migration workflow or verifier and adds no SQL migration, the current-delta parity check succeeds with a zero-version result. It does not claim that the historical repository and historical Supabase ledger are globally identical.

The RPC exposes only boolean ledger membership for caller-supplied migration version identifiers. It cannot run SQL or mutate the database.

This fallback is intended for the case where a newly introduced repository migration was already applied through a controlled production operation but GitHub has no database write secret. A genuinely new unapplied migration still stops the deployment chain until a write transport is configured or the migration is applied through another controlled path.

## One-time GitHub setup

1. In Supabase, open the production project and choose **Connect**.
2. Copy the **Session Pooler** URI.
3. Replace the password placeholder with the production database password.
4. In GitHub, open **Settings → Secrets and variables → Actions** for `keeptxred/texas-heartland-hub`.
5. Create repository secret `SUPABASE_DB_URL` with that URI.
6. Run **Apply Supabase Migrations** manually with `dry_run_only=true` once.
7. If the preview is correct, rerun normally. Future migration files merged to `main` deploy automatically.

The read-only fallback means an already-applied newly added migration can still be proven safe when that secret is absent, but `SUPABASE_DB_URL` remains the preferred configuration because it lets CI apply genuinely new migrations rather than only verify them.

## Legacy fallback

For compatibility, the workflow still supports the older linked-project method when both `SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_PASSWORD` exist. Once `SUPABASE_DB_URL` is configured, the direct database route takes precedence.

## Security

Never commit the database URI or database password to the repository. Keep the URI only in GitHub Actions secrets. The workflow does not print the secret value.

The read-only parity fallback intentionally uses only public frontend Supabase configuration and a narrowly scoped read-only RPC. Do not replace that public key with a service-role key.
