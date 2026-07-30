-- Texas Bills platform: normalized, idempotent legislative data model
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
  article_id uuid not null,
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
create index if not exists bill_sponsors_name_trgm_idx on public.bill_sponsors using gin (sponsor_name gin_trgm_ops);
create index if not exists bill_actions_bill_timeline_idx on public.bill_actions (bill_id, action_date desc, action_sequence desc);
create index if not exists bill_committee_history_bill_idx on public.bill_committee_history (bill_id, sequence);
create index if not exists bill_article_relationships_bill_idx on public.bill_article_relationships (bill_id, is_manual desc, confidence desc);

alter table public.legislative_sessions enable row level security;
alter table public.legislative_committees enable row level security;
alter table public.bills enable row level security;
alter table public.bill_sponsors enable row level security;
alter table public.bill_actions enable row level security;
alter table public.bill_committee_history enable row level security;
alter table public.bill_subjects enable row level security;
alter table public.bill_subject_relationships enable row level security;
alter table public.bill_article_relationships enable row level security;
alter table public.bill_documents enable row level security;

do $$
declare t text;
begin
  foreach t in array array['legislative_sessions','legislative_committees','bills','bill_sponsors','bill_actions','bill_committee_history','bill_subjects','bill_subject_relationships','bill_article_relationships','bill_documents']
  loop
    execute format('drop policy if exists "Public read %1$s" on public.%1$I', t);
    execute format('create policy "Public read %1$s" on public.%1$I for select using (true)', t);
  end loop;
end $$;

comment on table public.bills is 'Canonical Texas legislation records; automated sync must not overwrite curated plain-language summaries.';
comment on table public.bill_actions is 'Official action text and normalized status history, ordered by action_sequence and date.';