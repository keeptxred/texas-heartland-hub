-- Guarded bill relationship automation.
-- Article links require an explicit bill identifier (for example "HB 123") in title/dek.
-- Subject links require verified subject names in canonical bill text fields.

alter table public.bill_subject_relationships
  add column if not exists confidence numeric(4,3) check (confidence between 0 and 1),
  add column if not exists source text not null default 'manual',
  add column if not exists is_manual boolean not null default true,
  add column if not exists review_status text not null default 'approved'
    check (review_status in ('pending','approved','rejected')),
  add column if not exists evidence jsonb not null default '{}'::jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.bill_article_relationships
  add column if not exists source text not null default 'manual',
  add column if not exists review_status text not null default 'approved'
    check (review_status in ('pending','approved','rejected')),
  add column if not exists evidence jsonb not null default '{}'::jsonb;

create index if not exists bill_subject_relationships_review_idx
  on public.bill_subject_relationships (bill_id, review_status, is_manual desc, confidence desc);
create index if not exists bill_article_relationships_review_idx
  on public.bill_article_relationships (bill_id, review_status, is_manual desc, confidence desc);

-- Preserve existing relationships as approved manual records.
update public.bill_subject_relationships
set is_manual = true,
    source = coalesce(nullif(source, ''), 'manual'),
    review_status = 'approved',
    confidence = coalesce(confidence, 1.000)
where confidence is null or source = 'manual';

update public.bill_article_relationships
set source = coalesce(nullif(source, ''), case when is_manual then 'manual' else 'legacy' end),
    review_status = case when is_manual then 'approved' else coalesce(nullif(review_status, ''), 'pending') end,
    confidence = coalesce(confidence, case when is_manual then 1.000 else 0.700 end);

create or replace function public.refresh_bill_subject_relationships(
  p_bill_id uuid default null,
  p_limit integer default 1000
)
returns table(inserted integer, updated integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inserted integer := 0;
  v_updated integer := 0;
begin
  with candidates as (
    select
      b.id as bill_id,
      s.id as subject_id,
      case
        when lower(coalesce(b.caption, '')) ~ ('(^|[^a-z0-9])' || regexp_replace(lower(s.name), '[^a-z0-9]+', '[^a-z0-9]+', 'g') || '([^a-z0-9]|$)') then 0.930
        when lower(coalesce(b.plain_language_summary, b.summary, b.description, '')) ~ ('(^|[^a-z0-9])' || regexp_replace(lower(s.name), '[^a-z0-9]+', '[^a-z0-9]+', 'g') || '([^a-z0-9]|$)') then 0.850
        else 0.000
      end::numeric(4,3) as confidence,
      jsonb_build_object('subject_name', s.name, 'matcher', 'verified-subject-exact-phrase-v1') as evidence
    from public.bills b
    cross join public.bill_subjects s
    where b.is_active = true
      and (p_bill_id is null or b.id = p_bill_id)
      and length(trim(s.name)) >= 4
      and (
        lower(coalesce(b.caption, '')) ~ ('(^|[^a-z0-9])' || regexp_replace(lower(s.name), '[^a-z0-9]+', '[^a-z0-9]+', 'g') || '([^a-z0-9]|$)')
        or lower(coalesce(b.plain_language_summary, b.summary, b.description, '')) ~ ('(^|[^a-z0-9])' || regexp_replace(lower(s.name), '[^a-z0-9]+', '[^a-z0-9]+', 'g') || '([^a-z0-9]|$)')
      )
    order by b.last_action_date desc nulls last
    limit greatest(1, least(p_limit, 10000))
  ), upserted as (
    insert into public.bill_subject_relationships
      (bill_id, subject_id, confidence, source, is_manual, review_status, evidence, updated_at)
    select bill_id, subject_id, confidence, 'verified-subject-matcher-v1', false,
      case when confidence >= 0.900 then 'approved' else 'pending' end,
      evidence, now()
    from candidates
    on conflict (bill_id, subject_id) do update
      set confidence = excluded.confidence,
          source = excluded.source,
          review_status = case
            when public.bill_subject_relationships.is_manual then public.bill_subject_relationships.review_status
            else excluded.review_status
          end,
          evidence = excluded.evidence,
          updated_at = now()
      where public.bill_subject_relationships.is_manual = false
    returning (xmax = 0) as was_inserted
  )
  select count(*) filter (where was_inserted), count(*) filter (where not was_inserted)
  into v_inserted, v_updated
  from upserted;

  return query select coalesce(v_inserted, 0), coalesce(v_updated, 0);
end;
$$;

create or replace function public.refresh_bill_article_relationships(
  p_bill_id uuid default null,
  p_article_days integer default 730,
  p_limit integer default 5000
)
returns table(inserted integer, updated integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inserted integer := 0;
  v_updated integer := 0;
begin
  with candidates as (
    select
      b.id as bill_id,
      a.id as article_id,
      case
        when lower(coalesce(a.title, '')) ~ ('(^|[^a-z0-9])' || lower(b.bill_type) || '[[:space:]-]*' || b.bill_number::text || '([^0-9]|$)') then 0.980
        when lower(coalesce(a.dek, '')) ~ ('(^|[^a-z0-9])' || lower(b.bill_type) || '[[:space:]-]*' || b.bill_number::text || '([^0-9]|$)') then 0.920
        else 0.000
      end::numeric(4,3) as confidence,
      case
        when lower(coalesce(a.title, '')) ~ ('(^|[^a-z0-9])' || lower(b.bill_type) || '[[:space:]-]*' || b.bill_number::text || '([^0-9]|$)') then 'primary-subject'
        else 'mention'
      end as relationship_type,
      jsonb_build_object(
        'bill_identifier', b.bill_identifier,
        'matcher', 'explicit-bill-identifier-v1',
        'matched_field', case
          when lower(coalesce(a.title, '')) ~ ('(^|[^a-z0-9])' || lower(b.bill_type) || '[[:space:]-]*' || b.bill_number::text || '([^0-9]|$)') then 'title'
          else 'dek'
        end
      ) as evidence
    from public.bills b
    join public.daily_articles a
      on a.published_at >= now() - make_interval(days => greatest(1, least(p_article_days, 3650)))
     and (
       lower(coalesce(a.title, '')) ~ ('(^|[^a-z0-9])' || lower(b.bill_type) || '[[:space:]-]*' || b.bill_number::text || '([^0-9]|$)')
       or lower(coalesce(a.dek, '')) ~ ('(^|[^a-z0-9])' || lower(b.bill_type) || '[[:space:]-]*' || b.bill_number::text || '([^0-9]|$)')
     )
    where b.is_active = true
      and (p_bill_id is null or b.id = p_bill_id)
      -- Avoid cross-session ambiguity for reused identifiers unless the article names the legislature/session.
      and (
        b.legislature_number = (select max(legislature_number) from public.bills where is_active = true)
        or lower(coalesce(a.title, '') || ' ' || coalesce(a.dek, '')) like '%' || b.legislature_number::text || 'th%'
      )
    order by a.published_at desc
    limit greatest(1, least(p_limit, 25000))
  ), upserted as (
    insert into public.bill_article_relationships
      (bill_id, article_id, relationship_type, confidence, is_manual, source, review_status, evidence, updated_at)
    select bill_id, article_id, relationship_type, confidence, false,
      'explicit-bill-identifier-v1',
      case when confidence >= 0.950 then 'approved' else 'pending' end,
      evidence, now()
    from candidates
    on conflict (bill_id, article_id) do update
      set relationship_type = excluded.relationship_type,
          confidence = excluded.confidence,
          source = excluded.source,
          review_status = case
            when public.bill_article_relationships.is_manual then public.bill_article_relationships.review_status
            else excluded.review_status
          end,
          evidence = excluded.evidence,
          updated_at = now()
      where public.bill_article_relationships.is_manual = false
    returning (xmax = 0) as was_inserted
  )
  select count(*) filter (where was_inserted), count(*) filter (where not was_inserted)
  into v_inserted, v_updated
  from upserted;

  return query select coalesce(v_inserted, 0), coalesce(v_updated, 0);
end;
$$;

create or replace function public.refresh_bill_relationships(
  p_bill_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_subject record;
  v_article record;
begin
  select * into v_subject from public.refresh_bill_subject_relationships(p_bill_id, 10000);
  select * into v_article from public.refresh_bill_article_relationships(p_bill_id, 730, 25000);
  return jsonb_build_object(
    'subjects', jsonb_build_object('inserted', coalesce(v_subject.inserted,0), 'updated', coalesce(v_subject.updated,0)),
    'articles', jsonb_build_object('inserted', coalesce(v_article.inserted,0), 'updated', coalesce(v_article.updated,0))
  );
end;
$$;

revoke all on function public.refresh_bill_subject_relationships(uuid, integer) from public;
revoke all on function public.refresh_bill_article_relationships(uuid, integer, integer) from public;
revoke all on function public.refresh_bill_relationships(uuid) from public;
grant execute on function public.refresh_bill_subject_relationships(uuid, integer) to service_role;
grant execute on function public.refresh_bill_article_relationships(uuid, integer, integer) to service_role;
grant execute on function public.refresh_bill_relationships(uuid) to service_role;

comment on function public.refresh_bill_relationships(uuid) is
  'Builds guarded bill subject/article relationships. Article matching requires an explicit bill identifier and avoids generic headline/entity matching.';
