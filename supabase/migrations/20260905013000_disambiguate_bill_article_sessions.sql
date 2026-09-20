-- Prevent automatic bill/article relationships from crossing Texas legislative sessions
-- when the same bill identifier is reused in regular and called sessions.

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
  with bill_candidates as (
    select
      b.*,
      count(*) over (
        partition by b.legislature_number, b.bill_type, b.bill_number
      ) as identifier_session_count
    from public.bills b
    where b.is_active = true
      and (p_bill_id is null or b.id = p_bill_id)
  ), candidates as (
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
        'legislature_number', b.legislature_number,
        'session_code', b.session_code,
        'matcher', 'explicit-bill-identifier-v2-session-aware',
        'matched_field', case
          when lower(coalesce(a.title, '')) ~ ('(^|[^a-z0-9])' || lower(b.bill_type) || '[[:space:]-]*' || b.bill_number::text || '([^0-9]|$)') then 'title'
          else 'dek'
        end
      ) as evidence
    from bill_candidates b
    join public.daily_articles a
      on a.published_at >= now() - make_interval(days => greatest(1, least(p_article_days, 3650)))
     and (
       lower(coalesce(a.title, '')) ~ ('(^|[^a-z0-9])' || lower(b.bill_type) || '[[:space:]-]*' || b.bill_number::text || '([^0-9]|$)')
       or lower(coalesce(a.dek, '')) ~ ('(^|[^a-z0-9])' || lower(b.bill_type) || '[[:space:]-]*' || b.bill_number::text || '([^0-9]|$)')
     )
    where (
      b.identifier_session_count = 1
      or (
        b.session_code = 'R'
        and lower(coalesce(a.title, '') || ' ' || coalesce(a.dek, '')) not like '%special session%'
      )
      or (
        b.session_code = '1'
        and (
          lower(coalesce(a.title, '') || ' ' || coalesce(a.dek, '')) like '%first special session%'
          or lower(coalesce(a.title, '') || ' ' || coalesce(a.dek, '')) like '%1st special session%'
          or lower(coalesce(a.title, '') || ' ' || coalesce(a.dek, '')) like '%special session 1%'
        )
      )
      or (
        b.session_code = '2'
        and (
          lower(coalesce(a.title, '') || ' ' || coalesce(a.dek, '')) like '%second special session%'
          or lower(coalesce(a.title, '') || ' ' || coalesce(a.dek, '')) like '%2nd special session%'
          or lower(coalesce(a.title, '') || ' ' || coalesce(a.dek, '')) like '%special session 2%'
        )
      )
    )
    order by a.published_at desc
    limit greatest(1, least(p_limit, 25000))
  ), upserted as (
    insert into public.bill_article_relationships
      (bill_id, article_id, relationship_type, confidence, is_manual, source, review_status, evidence, updated_at)
    select bill_id, article_id, relationship_type, confidence, false,
      'explicit-bill-identifier-v2-session-aware',
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

  -- Remove older automatic edges that are now ambiguous across sessions and
  -- whose article does not explicitly identify the called session.
  delete from public.bill_article_relationships relationship
  using public.bills b, public.daily_articles a
  where relationship.bill_id = b.id
    and relationship.article_id = a.id
    and relationship.is_manual = false
    and relationship.source in ('explicit-bill-identifier-v1', 'explicit-bill-identifier-v2-session-aware')
    and (
      select count(*)
      from public.bills sibling
      where sibling.is_active = true
        and sibling.legislature_number = b.legislature_number
        and sibling.bill_type = b.bill_type
        and sibling.bill_number = b.bill_number
    ) > 1
    and b.session_code <> 'R'
    and not (
      (b.session_code = '1' and (
        lower(coalesce(a.title, '') || ' ' || coalesce(a.dek, '')) like '%first special session%'
        or lower(coalesce(a.title, '') || ' ' || coalesce(a.dek, '')) like '%1st special session%'
        or lower(coalesce(a.title, '') || ' ' || coalesce(a.dek, '')) like '%special session 1%'
      ))
      or (b.session_code = '2' and (
        lower(coalesce(a.title, '') || ' ' || coalesce(a.dek, '')) like '%second special session%'
        or lower(coalesce(a.title, '') || ' ' || coalesce(a.dek, '')) like '%2nd special session%'
        or lower(coalesce(a.title, '') || ' ' || coalesce(a.dek, '')) like '%special session 2%'
      ))
    );

  return query select coalesce(v_inserted, 0), coalesce(v_updated, 0);
end;
$$;

revoke all on function public.refresh_bill_article_relationships(uuid, integer, integer) from public;
grant execute on function public.refresh_bill_article_relationships(uuid, integer, integer) to service_role;

comment on function public.refresh_bill_article_relationships(uuid, integer, integer) is
  'Builds guarded bill/article relationships using explicit bill identifiers and session-aware disambiguation for repeated bill numbers.';
