create or replace function public.election_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.election_polls (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  election_cycle_id text not null,
  race_id text,
  jurisdiction_id text,
  title text not null check (length(trim(title)) > 0),
  status text not null check (status in ('draft', 'fielding', 'completed', 'published', 'revised', 'withdrawn', 'archived')),
  pollster_name text not null check (length(trim(pollster_name)) > 0),
  pollster_url text,
  pollster_grade text not null default 'unrated',
  sponsors jsonb not null default '[]'::jsonb check (jsonb_typeof(sponsors) = 'array'),
  field_start_date date not null,
  field_end_date date not null,
  release_date date,
  methodology jsonb not null check (jsonb_typeof(methodology) = 'object'),
  topline_url text,
  questionnaire_url text,
  crosstabs_url text,
  internal_poll boolean not null default false,
  partisan_poll boolean not null default false,
  tracking_poll boolean not null default false,
  source_name text not null check (length(trim(source_name)) > 0),
  source_url text not null check (source_url ~ '^https?://'),
  retrieved_at timestamptz not null,
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'in_review', 'scheduled', 'published', 'unpublished', 'archived')),
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified', 'pending_review', 'verified', 'rejected', 'needs_update')),
  freshness_status text not null default 'unknown'
    check (freshness_status in ('fresh', 'aging', 'stale', 'expired', 'unknown')),
  published_at timestamptz,
  verified_at timestamptz,
  data_as_of timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint election_polls_field_dates check (field_end_date >= field_start_date)
);

create table if not exists public.election_poll_questions (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.election_polls(id) on delete cascade,
  question_key text not null,
  question_type text not null,
  prompt text not null check (length(trim(prompt)) > 0),
  display_order integer,
  sample_size integer check (sample_size is null or sample_size > 0),
  population text not null
    check (population in ('adults', 'registered_voters', 'likely_voters', 'primary_voters', 'caucus_goers', 'party_members', 'other', 'unknown')),
  notes text,
  unique (poll_id, question_key)
);

create table if not exists public.election_poll_responses (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.election_poll_questions(id) on delete cascade,
  response_key text not null,
  label text not null check (length(trim(label)) > 0),
  candidate_id text,
  party text,
  percentage numeric(5, 2) check (percentage is null or (percentage >= 0 and percentage <= 100)),
  respondent_count integer check (respondent_count is null or respondent_count >= 0),
  is_undecided boolean not null default false,
  is_other boolean not null default false,
  unique (question_id, response_key)
);

create index if not exists election_polls_race_date_idx
  on public.election_polls (race_id, field_end_date desc);
create index if not exists election_polls_pollster_idx
  on public.election_polls (pollster_name, field_end_date desc);
create index if not exists election_poll_questions_poll_idx
  on public.election_poll_questions (poll_id);
create index if not exists election_poll_responses_question_idx
  on public.election_poll_responses (question_id);
create index if not exists election_poll_responses_candidate_idx
  on public.election_poll_responses (candidate_id);

drop trigger if exists election_polls_set_updated_at on public.election_polls;
create trigger election_polls_set_updated_at
before update on public.election_polls
for each row execute function public.election_set_updated_at();

alter table public.election_polls enable row level security;
alter table public.election_poll_questions enable row level security;
alter table public.election_poll_responses enable row level security;

create policy "Published election polls are publicly readable"
  on public.election_polls for select
  using (publication_status = 'published');

create policy "Published election poll questions are publicly readable"
  on public.election_poll_questions for select
  using (
    exists (
      select 1
      from public.election_polls
      where election_polls.id = election_poll_questions.poll_id
        and election_polls.publication_status = 'published'
    )
  );

create policy "Published election poll responses are publicly readable"
  on public.election_poll_responses for select
  using (
    exists (
      select 1
      from public.election_poll_questions
      join public.election_polls
        on election_polls.id = election_poll_questions.poll_id
      where election_poll_questions.id = election_poll_responses.question_id
        and election_polls.publication_status = 'published'
    )
  );

grant select on public.election_polls to anon, authenticated;
grant select on public.election_poll_questions to anon, authenticated;
grant select on public.election_poll_responses to anon, authenticated;
