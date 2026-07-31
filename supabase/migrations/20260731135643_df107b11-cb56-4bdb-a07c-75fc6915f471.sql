-- ============ 1. roles helper (needed by explore import policies) ============
do $$ begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin','moderator','user');
  end if;
end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
drop policy if exists "Users read own roles" on public.user_roles;
create policy "Users read own roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- ============ 2. Texas Bills platform ============
create extension if not exists pg_trgm;

create table if not exists public.legislative_sessions (
  id uuid primary key default gen_random_uuid(),
  legislature_number integer not null,
  session_code text not null default 'R',
  session_name text not null,
  session_type text not null default 'regular',
  start_date date,
  end_date date,
  is_current boolean not null default false,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (legislature_number, session_code)
);

create table if not exists public.legislative_committees (
  id uuid primary key default gen_random_uuid(),
  legislature_number integer not null,
  session_code text not null default 'R',
  chamber text not null check (chamber in ('house','senate','joint')),
  committee_name text not null,
  committee_slug text not null,
  committee_code text,
  description text,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (legislature_number, session_code, chamber, committee_slug)
);

create table if not exists public.bills (
  id uuid primary key default gen_random_uuid(),
  legislative_session_id uuid references public.legislative_sessions(id) on delete restrict,
  legislature_number integer not null,
  session_code text not null default 'R',
  bill_type text not null,
  bill_number integer not null,
  bill_identifier text generated always as (upper(bill_type) || ' ' || bill_number::text) stored,
  chamber text not null check (chamber in ('house','senate','joint')),
  caption text not null,
  short_title text,
  description text,
  summary text,
  plain_language_summary text,
  seo_title text,
  seo_description text,
  current_status_code text not null default 'filed',
  current_status_label text not null default 'Filed',
  current_status_description text,
  current_chamber text,
  current_committee_id uuid references public.legislative_committees(id) on delete set null,
  introduced_date date,
  last_action_date date,
  passed_house_date date,
  passed_senate_date date,
  sent_to_governor_date date,
  signed_date date,
  effective_date date,
  vetoed_date date,
  became_law boolean not null default false,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  source_url text,
  bill_text_url text,
  fiscal_note_url text,
  analysis_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_synced_at timestamptz,
  unique (legislature_number, session_code, bill_type, bill_number)
);

create table if not exists public.bill_sponsors (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  representative_id uuid,
  external_legislator_id text,
  sponsor_name text not null,
  sponsor_slug text,
  sponsor_role text not null,
  chamber text,
  party text,
  district text,
  sequence integer not null default 0,
  date_added date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique nulls not distinct (bill_id, representative_id, external_legislator_id, sponsor_name, sponsor_role)
);

create table if not exists public.bill_actions (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  action_date date not null,
  action_time time,
  action_sequence integer not null default 0,
  chamber text,
  action_code text,
  action_text text not null,
  normalized_status text,
  committee_id uuid references public.legislative_committees(id) on delete set null,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bill_id, action_date, action_sequence, action_text)
);

create table if not exists public.bill_committee_history (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  committee_id uuid references public.legislative_committees(id) on delete set null,
  chamber text,
  committee_name text not null,
  action_type text,
  action_description text,
  referred_date date,
  hearing_date date,
  vote_date date,
  reported_date date,
  sequence integer not null default 0,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bill_subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bill_subject_relationships (
  bill_id uuid not null references public.bills(id) on delete cascade,
  subject_id uuid not null references public.bill_subjects(id) on delete cascade,
  primary key (bill_id, subject_id)
);

create table if not exists public.bill_article_relationships (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  article_id uuid not null references public.daily_articles(id) on delete cascade,
  relationship_type text not null default 'mention',
  confidence numeric(4,3) check (confidence between 0 and 1),
  is_manual boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bill_id, article_id)
);

create table if not exists public.bill_documents (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  document_type text not null,
  document_title text not null,
  document_date date,
  document_url text not null,
  file_format text,
  version_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bill_id, document_url)
);

create index if not exists bills_identity_idx on public.bills (legislature_number, session_code, bill_type, bill_number);
create index if not exists bills_status_last_action_idx on public.bills (current_status_code, last_action_date desc);
create index if not exists bills_caption_trgm_idx on public.bills using gin (caption gin_trgm_ops);
create index if not exists bill_sponsors_bill_idx on public.bill_sponsors (bill_id, sequence);
create index if not exists bill_sponsors_slug_idx on public.bill_sponsors (sponsor_slug);
create index if not exists bill_sponsors_name_trgm_idx on public.bill_sponsors using gin (sponsor_name gin_trgm_ops);
create index if not exists bill_actions_bill_timeline_idx on public.bill_actions (bill_id, action_date desc, action_sequence desc);
create index if not exists bill_committee_history_bill_idx on public.bill_committee_history (bill_id, sequence);
create index if not exists bill_documents_bill_idx on public.bill_documents (bill_id, document_date desc);
create index if not exists bill_article_relationships_bill_idx on public.bill_article_relationships (bill_id, is_manual desc, confidence desc);

create or replace function public.bills_set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

do $$
declare t text;
begin
  foreach t in array array['legislative_sessions','legislative_committees','bills','bill_sponsors','bill_actions','bill_committee_history','bill_subjects','bill_article_relationships','bill_documents']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('drop policy if exists "Public read %1$s" on public.%1$I', t);
    execute format('create policy "Public read %1$s" on public.%1$I for select using (true)', t);
    execute format('drop trigger if exists trg_%1$s_updated_at on public.%1$I', t);
    execute format('create trigger trg_%1$s_updated_at before update on public.%1$I for each row execute function public.bills_set_updated_at()', t);
  end loop;
end $$;

alter table public.bill_subject_relationships enable row level security;
grant select on public.bill_subject_relationships to anon, authenticated;
grant all on public.bill_subject_relationships to service_role;
drop policy if exists "Public read bill_subject_relationships" on public.bill_subject_relationships;
create policy "Public read bill_subject_relationships" on public.bill_subject_relationships for select using (true);

-- ============ 3. Publishing safety net tables ============
create table if not exists public.publishing_alerts (
  id uuid primary key default gen_random_uuid(),
  incident_key text not null unique,
  status text not null default 'open' check (status in ('open','resolved')),
  latest_published_at timestamptz,
  reserve_slug text,
  message text not null,
  opened_at timestamptz not null default now(),
  resolved_at timestamptz,
  notification_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reserve_article_publications (
  reserve_key text primary key,
  slug text not null unique,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

grant select on public.publishing_alerts to authenticated;
grant all on public.publishing_alerts to service_role;
grant select on public.reserve_article_publications to authenticated;
grant all on public.reserve_article_publications to service_role;
alter table public.publishing_alerts enable row level security;
alter table public.reserve_article_publications enable row level security;
drop policy if exists "authenticated reads publishing alerts" on public.publishing_alerts;
create policy "authenticated reads publishing alerts" on public.publishing_alerts for select to authenticated using (true);
drop policy if exists "authenticated reads reserve publications" on public.reserve_article_publications;
create policy "authenticated reads reserve publications" on public.reserve_article_publications for select to authenticated using (true);

-- ============ 4. Explore import platform ============
do $$ begin
  if not exists (select 1 from pg_type where typname = 'explore_import_execution_mode') then
    create type public.explore_import_execution_mode as enum ('live','dry-run','preview');
  end if;
  if not exists (select 1 from pg_type where typname = 'explore_import_record_action') then
    create type public.explore_import_record_action as enum ('insert','update','unchanged','duplicate','reject');
  end if;
  if not exists (select 1 from pg_type where typname = 'explore_import_job_status') then
    create type public.explore_import_job_status as enum ('queued','running','completed','completed_with_warnings','failed','cancelled','rolled_back');
  end if;
end $$;

create table if not exists public.explore_import_sources (
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

do $$ begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='explore_import_jobs' and column_name='source_id')
     and not exists (select 1 from information_schema.columns where table_schema='public' and table_name='explore_import_jobs' and column_name='entity_source_id') then
    alter table public.explore_import_jobs rename column source_id to entity_source_id;
  end if;
end $$;

alter table public.explore_import_jobs alter column connector_key drop not null;
alter table public.explore_import_jobs drop constraint if exists explore_import_jobs_status_check;
alter table public.explore_import_jobs
  add constraint explore_import_jobs_status_check
  check (status in ('queued','running','completed','completed_with_warnings','failed','cancelled','rolled_back'));
alter table public.explore_import_jobs
  add column if not exists source_id uuid references public.explore_import_sources(id) on delete restrict,
  add column if not exists mode text not null default 'manual',
  add column if not exists execution_mode public.explore_import_execution_mode not null default 'live',
  add column if not exists requested_by uuid,
  add column if not exists heartbeat_at timestamptz,
  add column if not exists statistics jsonb not null default '{}'::jsonb,
  add column if not exists warnings jsonb not null default '[]'::jsonb,
  add column if not exists error jsonb,
  add column if not exists cursor_before jsonb,
  add column if not exists cursor_after jsonb,
  add column if not exists parent_job_id uuid references public.explore_import_jobs(id) on delete set null;

create table if not exists public.explore_import_records (
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
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (job_id, external_id)
);

create table if not exists public.explore_import_revisions (
  id uuid primary key default gen_random_uuid(),
  import_record_id uuid not null references public.explore_import_records(id) on delete cascade,
  entity_id uuid,
  operation text not null,
  before_payload jsonb,
  after_payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.explore_import_rollbacks (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.explore_import_jobs(id) on delete restrict,
  requested_by uuid,
  status text not null default 'queued',
  statistics jsonb not null default '{}'::jsonb,
  error jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists explore_import_jobs_source_status_idx on public.explore_import_jobs(source_id, status, created_at desc);
create index if not exists explore_import_records_review_idx on public.explore_import_records(review_status, action, created_at desc);
create index if not exists explore_import_records_external_idx on public.explore_import_records(source_id, external_id, created_at desc);
create index if not exists explore_import_records_checksum_idx on public.explore_import_records(checksum);

do $$
declare t text;
begin
  foreach t in array array['explore_import_sources','explore_import_jobs','explore_import_records','explore_import_revisions','explore_import_rollbacks']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('drop policy if exists "Admins manage %1$s" on public.%1$I', t);
    execute format('create policy "Admins manage %1$s" on public.%1$I for all to authenticated using (public.has_role(auth.uid(), ''admin'')) with check (public.has_role(auth.uid(), ''admin''))', t);
  end loop;
end $$;

create or replace function public.claim_explore_import_job()
returns public.explore_import_jobs
language plpgsql security definer set search_path = public as $$
declare claimed public.explore_import_jobs;
begin
  select * into claimed from public.explore_import_jobs
  where status = 'queued' order by created_at
  for update skip locked limit 1;
  if claimed.id is null then return null; end if;
  update public.explore_import_jobs
  set status = 'running', started_at = now(), heartbeat_at = now()
  where id = claimed.id returning * into claimed;
  return claimed;
end;
$$;

revoke execute on function public.claim_explore_import_job() from public;
grant execute on function public.claim_explore_import_job() to service_role;