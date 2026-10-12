
CREATE OR REPLACE FUNCTION public.read_shared_free_tier_database_capacity()
RETURNS jsonb LANGUAGE sql SECURITY DEFINER SET search_path=''
AS $fn$
  SELECT jsonb_build_object(
    'measured_at', now(),
    'project_id','ftkznprjljkhymknvhye',
    'database_bytes',pg_catalog.pg_database_size(pg_catalog.current_database()),
    'limit_bytes',500000000,
    'status',CASE
      WHEN pg_catalog.pg_database_size(pg_catalog.current_database()) >= 500000000 THEN 'over_limit'
      WHEN pg_catalog.pg_database_size(pg_catalog.current_database()) >= 475000000 THEN 'urgent'
      WHEN pg_catalog.pg_database_size(pg_catalog.current_database()) >= 450000000 THEN 'critical'
      WHEN pg_catalog.pg_database_size(pg_catalog.current_database()) >= 400000000 THEN 'investigate'
      WHEN pg_catalog.pg_database_size(pg_catalog.current_database()) >= 375000000 THEN 'warning'
      ELSE 'ok' END
  );
$fn$;
REVOKE ALL ON FUNCTION public.read_shared_free_tier_database_capacity() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.read_shared_free_tier_database_capacity() TO service_role;

