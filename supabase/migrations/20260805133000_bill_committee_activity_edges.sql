-- Represent verified committee hearings and vote activity as distinct authority edges.
-- This migration does not infer vote totals or member positions; it uses only
-- official hearing_date and vote_date values already stored in committee history.

create or replace function public.refresh_bill_committee_activity_edges(
  p_bill_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hearings integer := 0;
  v_votes integer := 0;
begin
  -- Replace only automated activity edges for the requested scope.
  delete from public.authority_relationships ar
  where ar.is_manual = false
    and ar.relationship_type in ('committee-hearing', 'committee-vote')
    and (
      p_bill_id is null
      or (ar.source_type = 'bill' and ar.source_key = p_bill_id::text)
      or (ar.target_type = 'bill' and ar.target_key = p_bill_id::text)
    );

  with hearing_rows as (
    select distinct on (history.bill_id, committee.committee_slug)
      history.bill_id,
      committee.committee_slug,
      history.hearing_date,
      history.action_description,
      history.source_url
    from public.bill_committee_history history
    join public.legislative_committees committee on committee.id = history.committee_id
    where history.hearing_date is not null
      and (p_bill_id is null or history.bill_id = p_bill_id)
    order by history.bill_id, committee.committee_slug, history.hearing_date desc, history.sequence desc
  ), inserted as (
    insert into public.authority_relationships
      (source_type, source_key, target_type, target_key, relationship_type, score, evidence, is_manual)
    select
      edge.source_type,
      edge.source_key,
      edge.target_type,
      edge.target_key,
      'committee-hearing',
      36,
      jsonb_build_object(
        'source', 'official-committee-history',
        'hearing_date', edge.hearing_date,
        'action_description', edge.action_description,
        'source_url', edge.source_url
      ),
      false
    from (
      select 'bill'::text source_type, bill_id::text source_key,
        'committee'::text target_type, committee_slug target_key,
        hearing_date, action_description, source_url
      from hearing_rows
      union all
      select 'committee'::text, committee_slug,
        'bill'::text, bill_id::text,
        hearing_date, action_description, source_url
      from hearing_rows
    ) edge
    on conflict (source_type, source_key, target_type, target_key, relationship_type)
    do update set
      score = case when authority_relationships.is_manual then authority_relationships.score else excluded.score end,
      evidence = case when authority_relationships.is_manual then authority_relationships.evidence else excluded.evidence end,
      updated_at = now()
    returning 1
  )
  select count(*) into v_hearings from inserted;

  with vote_rows as (
    select distinct on (history.bill_id, committee.committee_slug)
      history.bill_id,
      committee.committee_slug,
      history.vote_date,
      history.action_description,
      history.source_url
    from public.bill_committee_history history
    join public.legislative_committees committee on committee.id = history.committee_id
    where history.vote_date is not null
      and (p_bill_id is null or history.bill_id = p_bill_id)
    order by history.bill_id, committee.committee_slug, history.vote_date desc, history.sequence desc
  ), inserted as (
    insert into public.authority_relationships
      (source_type, source_key, target_type, target_key, relationship_type, score, evidence, is_manual)
    select
      edge.source_type,
      edge.source_key,
      edge.target_type,
      edge.target_key,
      'committee-vote',
      38,
      jsonb_build_object(
        'source', 'official-committee-history',
        'vote_date', edge.vote_date,
        'action_description', edge.action_description,
        'source_url', edge.source_url,
        'vote_tally_available', false
      ),
      false
    from (
      select 'bill'::text source_type, bill_id::text source_key,
        'committee'::text target_type, committee_slug target_key,
        vote_date, action_description, source_url
      from vote_rows
      union all
      select 'committee'::text, committee_slug,
        'bill'::text, bill_id::text,
        vote_date, action_description, source_url
      from vote_rows
    ) edge
    on conflict (source_type, source_key, target_type, target_key, relationship_type)
    do update set
      score = case when authority_relationships.is_manual then authority_relationships.score else excluded.score end,
      evidence = case when authority_relationships.is_manual then authority_relationships.evidence else excluded.evidence end,
      updated_at = now()
    returning 1
  )
  select count(*) into v_votes from inserted;

  return jsonb_build_object(
    'hearing_edges', v_hearings,
    'vote_edges', v_votes
  );
end
$$;

revoke all on function public.refresh_bill_committee_activity_edges(uuid) from public;
grant execute on function public.refresh_bill_committee_activity_edges(uuid) to service_role;

-- Backfill verified committee activity already present in the database.
select public.refresh_bill_committee_activity_edges(null);

comment on function public.refresh_bill_committee_activity_edges(uuid) is
  'Builds bill-to-committee hearing and vote authority edges from the latest official committee-history dates without inferring vote totals.';
