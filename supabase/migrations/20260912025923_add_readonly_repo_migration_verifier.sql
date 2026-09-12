CREATE OR REPLACE FUNCTION public.verify_repo_migrations(expected_versions text[])
RETURNS TABLE(version text, applied boolean)
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, supabase_migrations
AS $$
  SELECT v.version,
         EXISTS (
           SELECT 1
           FROM supabase_migrations.schema_migrations m
           WHERE m.version = v.version
         ) AS applied
  FROM unnest(expected_versions) AS v(version);
$$;

REVOKE ALL ON FUNCTION public.verify_repo_migrations(text[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_repo_migrations(text[]) TO service_role;

COMMENT ON FUNCTION public.verify_repo_migrations(text[]) IS
  'Read-only helper for checking whether caller-supplied repository migration versions exist in production migration history.';
