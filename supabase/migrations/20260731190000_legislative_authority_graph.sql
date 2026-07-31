-- Legislative authority graph, incremental-ingestion state, and scored related content.
-- Additive only: existing bill records and editorial fields are preserved.

create table if not exists public.legislative_sync_runs (
  id uuid primary key default gen_random_uuid(),
  source_key text not null default 'texas-legislature-online',
  legislature_number integer not null,
  session_code text not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'running' check (status in ('running','completed','completed_with_warnings','failed')),
  cursor_before jsonb not null default '{}'::jsonb,
  cursor_after jsonb not null default '{}'::jsonb,
  records_seen integer not null default 0,
  records_changed integer not null default 0,
  errors jsonb not null default '[]'::jsonb
);

create table if not exists public.legislative_source_records (
  source_key text not null,
  source_record_key text not null,
  source_url text not null,
  source_updated_at timestamptz,
  content_hash text not null,
  last_seen_at timestamptz not null default now(),
  last_imported_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  primary key (source_key, source_record_key)
);

create table if not exists public.authority_relationships (
  id uuid primary key default gen_random_uuid(),
  source_type text not null check (source_type in ('bill','representative','committee','district','election','government','article','session','subject')),
  source_key text not null,
  target_type text not null check (target_type in ('bill','representative','committee','district','election','government','article','session','subject')),
  target_key text not null,
  relationship_type text not null,
  score integer not null default 0 check (score >= 0),
  evidence jsonb not null default '{}'::jsonb,
  is_manual boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_type, source_key, target_type, target_key, relationship_type)
);

create index if not exists authority_relationships_source_score_idx
  on public.authority_relationships (source_type, source_key, score desc, target_type);
create index if not exists authority_relationships_target_score_idx
  on public.authority_relationships (target_type, target_key, score desc, source_type);

create or replace function public.upsert_bidirectional_authority_relationship(
  p_source_type text, p_source_key text, p_target_type text, p_target_key text,
  p_relationship_type text, p_score integer, p_evidence jsonb default '{}'::jsonb,
  p_is_manual boolean default false
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.authority_relationships
    (source_type, source_key, target_type, target_key, relationship_type, score, evidence, is_manual, updated_at)
  values
    (p_source_type, p_source_key, p_target_type, p_target_key, p_relationship_type, p_score, p_evidence, p_is_manual, now()),
    (p_target_type, p_target_key, p_source_type, p_source_key, p_relationship_type, p_score, p_evidence, p_is_manual, now())
  on conflict (source_type, source_key, target_type, target_key, relationship_type)
  do update set
    score = case when authority_relationships.is_manual then authority_relationships.score else excluded.score end,
    evidence = case when authority_relationships.is_manual then authority_relationships.evidence else excluded.evidence end,
    is_manual = authority_relationships.is_manual or excluded.is_manual,
    updated_at = now();
end $$;

create or replace function public.related_authority_content(
  p_source_type text, p_source_key text, p_limit integer default 12
) returns table (
  target_type text, target_key text, relationship_type text, score integer, evidence jsonb
) language sql stable security invoker set search_path = public as $$
  select ar.target_type, ar.target_key, ar.relationship_type, ar.score, ar.evidence
  from public.authority_relationships ar
  where ar.source_type = p_source_type and ar.source_key = p_source_key
  order by ar.is_manual desc, ar.score desc, ar.target_type, ar.target_key
  limit least(greatest(p_limit, 1), 50)
$$;

-- Maintain the graph from normalized bill relationships. Re-running is idempotent.
create or replace function public.refresh_legislative_authority_graph() returns void
language plpgsql security definer set search_path = public as $$
declare r record;
begin
  for r in
    select b.id::text bill_key, bs.sponsor_slug target_key, bs.sponsor_role
    from bills b join bill_sponsors bs on bs.bill_id = b.id
    where bs.sponsor_slug is not null
  loop
    perform upsert_bidirectional_authority_relationship('bill', r.bill_key, 'representative', r.target_key,
      r.sponsor_role, case when lower(r.sponsor_role) in ('author','primary author','sponsor','primary sponsor') then 40 else 32 end,
      jsonb_build_object('source','official-sponsor-record'));
  end loop;

  for r in
    select distinct b.id::text bill_key, lc.committee_slug target_key
    from bills b join bill_committee_history bh on bh.bill_id = b.id
    join legislative_committees lc on lc.id = bh.committee_id
  loop
    perform upsert_bidirectional_authority_relationship('bill', r.bill_key, 'committee', r.target_key,
      'committee-referral', 30, jsonb_build_object('source','official-committee-history'));
  end loop;

  for r in
    select b.id::text bill_key, (b.legislature_number::text || lower(b.session_code)) target_key
    from bills b
  loop
    perform upsert_bidirectional_authority_relationship('bill', r.bill_key, 'session', r.target_key,
      'legislative-session', 25, jsonb_build_object('source','official-bill-record'));
  end loop;

  for r in
    select bar.bill_id::text bill_key, bar.article_id::text target_key,
      greatest(10, least(40, round(coalesce(bar.confidence, .5) * 40)::int)) score
    from bill_article_relationships bar
  loop
    perform upsert_bidirectional_authority_relationship('bill', r.bill_key, 'article', r.target_key,
      'related-news', r.score, jsonb_build_object('source','article-linker'));
  end loop;
end $$;

alter table public.legislative_sync_runs enable row level security;
alter table public.legislative_source_records enable row level security;
alter table public.authority_relationships enable row level security;
drop policy if exists "Public read authority relationships" on public.authority_relationships;
create policy "Public read authority relationships" on public.authority_relationships for select using (true);
grant select on public.authority_relationships to anon, authenticated;
grant execute on function public.related_authority_content(text,text,integer) to anon, authenticated;

comment on table public.legislative_source_records is 'Content hashes and upstream timestamps used to skip unchanged official TLO records.';
comment on table public.authority_relationships is 'Bidirectional scored links; manual rows win over automated refreshes.';
