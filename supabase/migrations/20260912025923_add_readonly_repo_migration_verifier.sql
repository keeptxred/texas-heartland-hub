create or replace function public.verify_repo_migrations(expected_versions text[])
returns table(version text, applied boolean)
language sql
security definer
set search_path = pg_catalog, public, supabase_migrations
as $$
  select v.version,
         exists (
           select 1
           from supabase_migrations.schema_migrations m
           where m.version = v.version
         ) as applied
  from unnest(expected_versions) as v(version);
$$;

revoke all on function public.verify_repo_migrations(text[]) from public, anon, authenticated;
grant execute on function public.verify_repo_migrations(text[]) to service_role;
