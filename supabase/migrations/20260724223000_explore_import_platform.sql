create type public.explore_import_job_status as enum ('queued','running','completed','completed_with_warnings','failed','cancelled','rolled_back');
create type public.explore_import_execution_mode as enum ('live','dry-run','preview');
create type public.explore_import_record_action as enum ('insert','update','unchanged','duplicate','reject');

create table public.explore_import_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text not null,
  endpoint text not null,
  enabled boolean not null default true,
  schedule text,
  configuration jsonb not null default '{}'::jsonb,
  cursor jsonb not null default '{}'::jsonb,
  last_success_at timestamptz,
  last_failure_at timestamptz,
  consecutive_failures integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_type, name)
);

alter table public.explore_import_jobs rename column source_id to entity_source_id;
alter table public.explore_import_jobs alter column connector_key drop not null;
alter table public.explore_import_jobs drop constraint if exists explore_import_jobs_status_check;
alter table public.explore_import_jobs
  add constraint explore_import_jobs_status_check
  check (status in ('queued','running','completed','completed_with_warnings','failed','cancelled','rolled_back'));
alter table public.explore_import_jobs
  add column source_id uuid references public.explore_import_sources(id) on delete restrict,
  add column mode text not null default 'manual',
  add column execution_mode public.explore_import_execution_mode not null default 'live',
  add column requested_by uuid references auth.users(id) on delete set null,
  add column heartbeat_at timestamptz,
  add column statistics jsonb not null default '{}'::jsonb,
  add column warnings jsonb not null default '[]'::jsonb,
  add column error jsonb,
  add column cursor_before jsonb,
  add column cursor_after jsonb,
  add column parent_job_id uuid references public.explore_import_jobs(id) on delete set null;

create table public.explore_import_records (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.explore_import_jobs(id) on delete cascade,
  source_id uuid not null references public.explore_import_sources(id) on delete restrict,
  external_id text not null,
  entity_id uuid,
  action public.explore_import_record_action not null,
  checksum text not null,
  previous_checksum text,
  normalized_payload jsonb not null,
  raw_payload jsonb,
  validation_issues jsonb not null default '[]'::jsonb,
  duplicate_candidates jsonb not null default '[]'::jsonb,
  review_status text not null default 'pending',
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (job_id, external_id)
);

create table public.explore_import_revisions (
  id uuid primary key default gen_random_uuid(),
  import_record_id uuid not null references public.explore_import_records(id) on delete cascade,
  entity_id uuid,
  operation text not null,
  before_payload jsonb,
  after_payload jsonb,
  created_at timestamptz not null default now()
);

create table public.explore_import_rollbacks (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.explore_import_jobs(id) on delete restrict,
  requested_by uuid references auth.users(id) on delete set null,
  status text not null default 'queued',
  statistics jsonb not null default '{}'::jsonb,
  error jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index explore_import_jobs_source_status_idx on public.explore_import_jobs(source_id, status, created_at desc);
create index explore_import_records_review_idx on public.explore_import_records(review_status, action, created_at desc);
create index explore_import_records_external_idx on public.explore_import_records(source_id, external_id, created_at desc);
create index explore_import_records_checksum_idx on public.explore_import_records(checksum);

alter table public.explore_import_sources enable row level security;
alter table public.explore_import_jobs enable row level security;
alter table public.explore_import_records enable row level security;
alter table public.explore_import_revisions enable row level security;
alter table public.explore_import_rollbacks enable row level security;

-- Some deployments provide a shared two-argument public.has_role helper, while
-- clean databases do not. Create authenticated-admin policies only when that
-- helper is available. Service-role operations continue to bypass RLS.
do $$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'has_role'
      and p.pronargs = 2
  ) then
    execute 'create policy "Admins manage explore import sources" on public.explore_import_sources for all to authenticated using (public.has_role(auth.uid(), ''admin'')) with check (public.has_role(auth.uid(), ''admin''))';
    execute 'create policy "Admins manage explore import jobs" on public.explore_import_jobs for all to authenticated using (public.has_role(auth.uid(), ''admin'')) with check (public.has_role(auth.uid(), ''admin''))';
    execute 'create policy "Admins manage explore import records" on public.explore_import_records for all to authenticated using (public.has_role(auth.uid(), ''admin'')) with check (public.has_role(auth.uid(), ''admin''))';
    execute 'create policy "Admins manage explore import revisions" on public.explore_import_revisions for all to authenticated using (public.has_role(auth.uid(), ''admin'')) with check (public.has_role(auth.uid(), ''admin''))';
    execute 'create policy "Admins manage explore import rollbacks" on public.explore_import_rollbacks for all to authenticated using (public.has_role(auth.uid(), ''admin'')) with check (public.has_role(auth.uid(), ''admin''))';
  end if;
end
$$;

create or replace function public.claim_explore_import_job()
returns public.explore_import_jobs
language plpgsql
security definer
set search_path = public
as $$
declare claimed public.explore_import_jobs;
begin
  select * into claimed from public.explore_import_jobs
  where status = 'queued'
  order by created_at
  for update skip locked
  limit 1;
  if claimed.id is null then return null; end if;
  update public.explore_import_jobs
  set status = 'running', started_at = now(), heartbeat_at = now()
  where id = claimed.id returning * into claimed;
  return claimed;
end;
$$;
