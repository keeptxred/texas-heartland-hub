REVOKE ALL ON FUNCTION public.verify_repo_migrations(text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_repo_migrations(text[]) TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.verify_repo_migrations(text[]) IS
  'Read-only migration parity check for repository CI. Returns only whether caller-supplied migration version identifiers are present; does not expose SQL or permit database writes.';
