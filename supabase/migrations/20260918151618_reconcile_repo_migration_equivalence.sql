create table if not exists public.repo_migration_equivalences (
  expected_version text primary key,
  actual_version text not null unique,
  actual_name text not null,
  reason text not null,
  created_at timestamptz not null default now(),
  constraint repo_migration_equivalences_expected_numeric check (expected_version ~ '^[0-9]+$'),
  constraint repo_migration_equivalences_actual_numeric check (actual_version ~ '^[0-9]+$')
);

alter table public.repo_migration_equivalences enable row level security;
revoke all on table public.repo_migration_equivalences from public, anon, authenticated;

insert into public.repo_migration_equivalences (expected_version, actual_version, actual_name, reason)
values (
  '20260918150000',
  '20260918150628',
  'remediate_exact_subject_image_backlog',
  'The supported Supabase apply_migration connector applied the exact repository migration SQL and Supabase recorded its execution-time version 20260918150628.'
)
on conflict (expected_version) do update
set actual_version = excluded.actual_version,
    actual_name = excluded.actual_name,
    reason = excluded.reason;

create or replace function public.verify_repo_migrations(expected_versions text[])
returns table(version text, applied boolean)
language sql
stable
security definer
set search_path = pg_catalog, public, supabase_migrations
as $$
  select v.version,
         exists (
           select 1
           from supabase_migrations.schema_migrations m
           where m.version = v.version
         )
         or exists (
           select 1
           from public.repo_migration_equivalences e
           join supabase_migrations.schema_migrations m
             on m.version = e.actual_version
            and m.name = e.actual_name
           where e.expected_version = v.version
         ) as applied
  from unnest(expected_versions) as v(version);
$$;

revoke all on function public.verify_repo_migrations(text[]) from public;
grant execute on function public.verify_repo_migrations(text[]) to anon, authenticated, service_role;
