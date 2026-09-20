-- Restore the intentionally public, read-only migration parity verifier after
-- confirming that KeepTXRed GitHub Actions uses it with the publishable key when
-- database-write credentials are unavailable.
--
-- The RPC only answers whether caller-supplied migration versions are present
-- (or reconciled through the private equivalence table). It exposes no SQL text
-- and performs no writes. PUBLIC remains revoked; only the explicit API roles
-- and service_role may execute it.
revoke all on function public.verify_repo_migrations(text[]) from public;
grant execute on function public.verify_repo_migrations(text[]) to anon, authenticated, service_role;

comment on function public.verify_repo_migrations(text[]) is
  'Intentionally public read-only migration parity check for repository CI using the publishable Supabase key. Returns only whether caller-supplied migration version identifiers are present or reconciled; exposes no SQL text and permits no database writes.';
