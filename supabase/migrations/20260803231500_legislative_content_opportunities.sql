-- Deduplicated legislative change events for editorial review.
create table if not exists public.legislative_content_opportunities (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  action_id uuid references public.bill_actions(id) on delete set null,
  event_type text not null check (event_type in (
    'filed','committee-referral','committee-hearing','vote','passed-house','passed-senate',
    'passed','sent-to-governor','signed','became-law','vetoed'
  )),
  event_date date,
  headline text not null,
  summary text,
  priority integer not null default 50 check (priority between 0 and 100),
  source_url text,
  dedupe_key text not null unique,
  status text not null default 'new' check (status in ('new','reviewed','dismissed','published')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists legislative_content_opportunities_status_idx
  on public.legislative_content_opportunities (status, priority desc, event_date desc, created_at desc);
create index if not exists legislative_content_opportunities_bill_idx
  on public.legislative_content_opportunities (bill_id, event_date desc);

alter table public.legislative_content_opportunities enable row level security;
drop policy if exists "No public legislative opportunities" on public.legislative_content_opportunities;
create policy "No public legislative opportunities"
  on public.legislative_content_opportunities for select using (false);

create or replace function public.refresh_legislative_content_opportunities(
  p_since_days integer default 30
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inserted integer := 0;
begin
  with candidates as (
    select
      b.id as bill_id,
      a.id as action_id,
      case
        when lower(a.action_text) ~ 'veto' then 'vetoed'
        when lower(a.action_text) ~ 'signed by the governor|governor signed' then 'signed'
        when lower(a.action_text) ~ 'became law|filed without signature|effective' then 'became-law'
        when lower(a.action_text) ~ 'sent to the governor|presented to governor' then 'sent-to-governor'
        when lower(a.action_text) ~ 'passed senate' then 'passed-senate'
        when lower(a.action_text) ~ 'passed house' then 'passed-house'
        when lower(a.action_text) ~ 'record vote|vote recorded|yeas|nays|adopted' then 'vote'
        when lower(a.action_text) ~ 'public hearing|scheduled for hearing|hearing set' then 'committee-hearing'
        when lower(a.action_text) ~ 'referred to|committee referral' then 'committee-referral'
        when lower(a.action_text) ~ 'filed|introduced|received by the secretary' then 'filed'
        else null
      end as event_type,
      a.action_date as event_date,
      b.bill_identifier,
      b.caption,
      a.action_text,
      coalesce(a.source_url, b.source_url) as source_url
    from public.bill_actions a
    join public.bills b on b.id = a.bill_id
    where a.action_date >= current_date - greatest(1, least(p_since_days, 365))
      and b.is_active = true
  ), normalized as (
    select *,
      case event_type
        when 'vetoed' then 100 when 'signed' then 98 when 'became-law' then 96
        when 'sent-to-governor' then 92 when 'passed-senate' then 88 when 'passed-house' then 88
        when 'vote' then 78 when 'committee-hearing' then 72 when 'committee-referral' then 62
        when 'filed' then 45 else 50 end as priority
    from candidates where event_type is not null
  ), inserted as (
    insert into public.legislative_content_opportunities
      (bill_id, action_id, event_type, event_date, headline, summary, priority, source_url, dedupe_key, metadata)
    select
      bill_id, action_id, event_type, event_date,
      case event_type
        when 'vetoed' then bill_identifier || ' vetoed'
        when 'signed' then bill_identifier || ' signed by governor'
        when 'became-law' then bill_identifier || ' becomes Texas law'
        when 'sent-to-governor' then bill_identifier || ' sent to governor'
        when 'passed-senate' then bill_identifier || ' passes Texas Senate'
        when 'passed-house' then bill_identifier || ' passes Texas House'
        when 'vote' then bill_identifier || ' receives recorded vote'
        when 'committee-hearing' then bill_identifier || ' committee hearing scheduled'
        when 'committee-referral' then bill_identifier || ' referred to committee'
        else bill_identifier || ' filed'
      end,
      action_text || case when caption is not null then ' — ' || caption else '' end,
      priority, source_url,
      bill_id::text || ':' || event_type || ':' || coalesce(action_id::text, event_date::text),
      jsonb_build_object('bill_identifier', bill_identifier, 'caption', caption, 'action_text', action_text)
    from normalized
    on conflict (dedupe_key) do nothing
    returning 1
  )
  select count(*) into v_inserted from inserted;

  return jsonb_build_object('inserted', v_inserted);
end;
$$;

revoke all on function public.refresh_legislative_content_opportunities(integer) from public;
grant execute on function public.refresh_legislative_content_opportunities(integer) to service_role;

comment on table public.legislative_content_opportunities is
  'Deduplicated editorial opportunities generated from meaningful official Texas legislative actions.';