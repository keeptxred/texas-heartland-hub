-- Security review checkpoint for the repository migration parity RPC.
-- This temporarily removed public API-role execution while the cross-repository
-- dependency was audited. The immediately following migration restores the
-- intentionally public, read-only contract used by GitHub verify-only mode.
revoke all on function public.verify_repo_migrations(text[]) from public, anon, authenticated;
grant execute on function public.verify_repo_migrations(text[]) to service_role;
