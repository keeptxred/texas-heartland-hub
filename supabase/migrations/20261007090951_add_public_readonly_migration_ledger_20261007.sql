create table if not exists public.repo_migration_public_ledger (
  version text primary key,
  mirrored_at timestamptz not null default now()
);

alter table public.repo_migration_public_ledger enable row level security;

drop policy if exists "Public read migration ledger" on public.repo_migration_public_ledger;
create policy "Public read migration ledger"
  on public.repo_migration_public_ledger
  for select
  to anon, authenticated
  using (true);

revoke all privileges on table public.repo_migration_public_ledger from public, anon, authenticated;
grant select on table public.repo_migration_public_ledger to anon, authenticated, service_role;

insert into public.repo_migration_public_ledger(version)
select version
from supabase_migrations.schema_migrations
on conflict (version) do nothing;

create or replace function public.mirror_supabase_migration_ledger()
returns trigger
language plpgsql
security definer
set search_path = public, supabase_migrations, pg_temp
as $$
begin
  if tg_op = 'DELETE' then
    delete from public.repo_migration_public_ledger where version = old.version;
    return old;
  end if;

  insert into public.repo_migration_public_ledger(version, mirrored_at)
  values (new.version, now())
  on conflict (version) do update set mirrored_at = excluded.mirrored_at;

  if tg_op = 'UPDATE' and old.version is distinct from new.version then
    delete from public.repo_migration_public_ledger where version = old.version;
  end if;

  return new;
end;
$$;

revoke all on function public.mirror_supabase_migration_ledger() from public, anon, authenticated;
grant execute on function public.mirror_supabase_migration_ledger() to postgres, service_role;

drop trigger if exists mirror_repo_migration_public_ledger
  on supabase_migrations.schema_migrations;

create trigger mirror_repo_migration_public_ledger
after insert or update or delete
on supabase_migrations.schema_migrations
for each row execute function public.mirror_supabase_migration_ledger();
