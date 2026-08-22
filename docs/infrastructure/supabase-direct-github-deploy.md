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

## One-time GitHub setup

1. In Supabase, open the production project and choose **Connect**.
2. Copy the **Session Pooler** URI.
3. Replace the password placeholder with the production database password.
4. In GitHub, open **Settings → Secrets and variables → Actions** for `keeptxred/texas-heartland-hub`.
5. Create repository secret `SUPABASE_DB_URL` with that URI.
6. Run **Apply Supabase Migrations** manually with `dry_run_only=true` once.
7. If the preview is correct, rerun normally. Future migration files merged to `main` deploy automatically.

## Legacy fallback

For compatibility, the workflow still supports the older linked-project method when both `SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_PASSWORD` exist. Once `SUPABASE_DB_URL` is configured, the direct database route takes precedence.

## Security

Never commit the database URI or database password to the repository. Keep the URI only in GitHub Actions secrets. The workflow does not print the secret value.
