-- Restore the intentionally public, read-only migration parity verifier used by
-- GitHub Actions when database-write credentials are unavailable. This RPC only
-- returns whether caller-supplied migration version identifiers exist in the
-- Supabase migration ledger; it does not expose SQL text or permit writes.
revoke all on function public.verify_repo_migrations(text[]) from public;
grant execute on function public.verify_repo_migrations(text[]) to anon, authenticated, service_role;

comment on function public.verify_repo_migrations(text[]) is
  'Read-only migration parity check for repository CI. Returns only whether caller-supplied migration version identifiers are present; does not expose SQL or permit database writes.';
