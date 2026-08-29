-- Reproduce the production TLO enrichment queue, targeted repair path,
-- durable run reconciliation, route-health diagnostics, and conservative cron cadence.

create or replace function public.get_tlo_seed_enrichment_candidates(p_limit integer default 10)
returns table(
  id uuid,
  legislature_number integer,
  session_code text,
  bill_type text,
  bill_number integer,
  bill_identifier text,
  last_action_date date
)
language sql
stable
security definer
set search_path = public, private, pg_temp
as $$
  select b.id,b.legislature_number,b.session_code,b.bill_type,b.bill_number,b.bill_identifier,b.last_action_date
  from public.bills b
  where b.legislature_number=89
    and b.is_active=true
    and length(trim(coalesce(b.plain_language_summary,''))) < 80
    and length(trim(coalesce(b.summary,''))) < 80
    and length(trim(coalesce(b.description,''))) < 80
    and b.analysis_url is null
    and b.fiscal_note_url is null
    and exists (
      select 1 from public.bill_actions a
      where a.bill_id=b.id and a.action_code='tlo-filed-report-latest'
    )
    and not exists (
      select 1 from public.bill_actions a
      where a.bill_id=b.id
        and coalesce(a.action_code,'') not in ('tlo-filed-report-latest','tlo-rss-meeting','tlo-rss-calendar')
    )
    and not exists (select 1 from public.bill_documents d where d.bill_id=b.id)
    and not exists (select 1 from public.bill_committee_history h where h.bill_id=b.id)
    and not exists (
      select 1 from public.bill_subject_relationships s
      where s.bill_id=b.id and s.review_status='approved'
    )
    and not exists (
      select 1 from public.bill_article_relationships ar
      where ar.bill_id=b.id and ar.review_status='approved'
    )
    and not exists (
      select 1 from public.bill_editorial_enrichments e
      where e.bill_id=b.id and e.review_status='approved'
    )
  order by
    case lower(coalesce(b.current_status_code,''))
      when 'effective' then 1
      when 'signed' then 2
      when 'became-law' then 3
      when 'vetoed' then 4
      when 'passed' then 5
      when 'sent-to-governor' then 6
      when 'sent_to_governor' then 6
      when 'filed_with_sos' then 7
      else 8
    end,
    case b.session_code when 'R' then 1 when '1' then 2 when '2' then 3 else 4 end,
    case b.bill_type
      when 'hb' then 1 when 'sb' then 2 when 'hjr' then 3 when 'sjr' then 4
      when 'hcr' then 5 when 'scr' then 6 when 'hr' then 7 when 'sr' then 8 else 9
    end,
    b.bill_number
  limit greatest(1,least(coalesce(p_limit,10),20));
$$;

revoke all on function public.get_tlo_seed_enrichment_candidates(integer) from public, anon, authenticated;
grant execute on function public.get_tlo_seed_enrichment_candidates(integer) to service_role;

create or replace function private.trigger_tlo_enrichment_for_bills(p_bill_ids uuid[])
returns bigint
language plpgsql
security definer
set search_path = private, public, net, pg_temp
as $$
declare
  v_token text;
  v_request_id bigint;
  v_count integer;
  v_valid integer;
begin
  v_count := coalesce(array_length(p_bill_ids,1),0);
  if v_count < 1 or v_count > 20 then
    raise exception 'bill id list must contain between 1 and 20 ids';
  end if;
  if (select count(distinct x) from unnest(p_bill_ids) x) <> v_count then
    raise exception 'duplicate bill ids are not allowed';
  end if;
  select count(*) into v_valid
  from public.bills
  where id = any(p_bill_ids) and legislature_number = 89;
  if v_valid <> v_count then
    raise exception 'all targeted bills must exist in the 89th Legislature';
  end if;
  select token into v_token from private.tlo_sync_config where singleton=true;
  if v_token is null then raise exception 'TLO sync token missing'; end if;

  select net.http_post(
    url := 'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/tlo-bill-sync-trigger',
    headers := jsonb_build_object('Content-Type','application/json','x-ktr-tlo-sync',v_token),
    body := jsonb_build_object('action','enrich','bill_ids',to_jsonb(p_bill_ids)),
    timeout_milliseconds := 120000
  ) into v_request_id;
  return v_request_id;
end;
$$;

revoke all on function private.trigger_tlo_enrichment_for_bills(uuid[]) from public, anon, authenticated;
grant execute on function private.trigger_tlo_enrichment_for_bills(uuid[]) to service_role;

create or replace function private.reconcile_stale_legislative_sync_runs()
returns integer
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_count integer;
begin
  update public.legislative_sync_runs
  set status='failed',
      completed_at=coalesce(completed_at,now()),
      errors=coalesce(errors,'[]'::jsonb) || jsonb_build_array(jsonb_build_object(
        'type','stale-run-reconciled',
        'message','Run remained in running state for more than 15 minutes and was reconciled automatically.',
        'reconciled_at',now()
      ))
  where status='running'
    and started_at < now()-interval '15 minutes';
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function private.reconcile_stale_legislative_sync_runs() from public, anon, authenticated;
grant execute on function private.reconcile_stale_legislative_sync_runs() to service_role;

create index if not exists legislative_sync_runs_source_started_idx
  on public.legislative_sync_runs(source_key, started_at desc);
create index if not exists legislative_sync_runs_running_started_idx
  on public.legislative_sync_runs(started_at)
  where status='running';

create or replace function private.tlo_called_session_route_health()
returns jsonb
language sql
stable
security definer
set search_path = public, private, pg_temp
as $$
with called as (
  select b.id,b.legislature_number,b.session_code,lower(b.bill_type) bill_type,b.bill_number
  from public.bills b
  where b.legislature_number=89 and b.session_code in ('1','2') and b.is_active=true
), regular as (
  select lower(bill_type) bill_type,bill_number,id
  from public.bills
  where legislature_number=89 and session_code='R' and is_active=true
), called_keys as (
  select bill_type,bill_number,count(*) called_count,array_agg(session_code order by session_code) sessions
  from called
  group by bill_type,bill_number
), key_health as (
  select ck.*,(r.id is not null) has_regular
  from called_keys ck
  left join regular r using (bill_type,bill_number)
), record_health as (
  select c.*,(r.id is not null) has_regular
  from called c
  left join regular r using (bill_type,bill_number)
), edges as (
  select count(*)::bigint edge_count,count(distinct ar.target_key)::bigint bill_count
  from public.authority_relationships ar
  join called c on ar.target_type='bill' and ar.target_key=c.id::text
)
select jsonb_build_object(
  'generated_at',now(),
  'called_session_records',(select count(*) from called),
  'session_1_records',(select count(*) from called where session_code='1'),
  'session_2_records',(select count(*) from called where session_code='2'),
  'called_records_with_regular_collision',(select count(*) from record_health where has_regular),
  'called_records_without_regular',(select count(*) from record_health where not has_regular),
  'ambiguous_unqualified_route_keys',(select count(*) from key_health where has_regular or called_count>1),
  'route_keys_regular_plus_called',(select count(*) from key_health where has_regular),
  'route_keys_regular_plus_one_called',(select count(*) from key_health where has_regular and called_count=1),
  'route_keys_regular_plus_two_called',(select count(*) from key_health where has_regular and called_count=2),
  'route_keys_called_only_both_sessions',(select count(*) from key_health where not has_regular and called_count=2),
  'route_keys_unique_called_only',(select count(*) from key_health where not has_regular and called_count=1),
  'all_called_records_require_session_qualified_path',not exists(select 1 from key_health where not has_regular and called_count=1),
  'authority_edges_to_called_bills',(select edge_count from edges),
  'called_bills_with_authority_edges',(select bill_count from edges),
  'collision_free',not exists(select 1 from key_health where has_regular or called_count>1)
);
$$;

create or replace function private.tlo_committee_route_health()
returns jsonb
language sql
stable
security definer
set search_path = public, private, pg_temp
as $$
with ranked as (
  select c.*,
         row_number() over (
           partition by c.committee_slug
           order by c.legislature_number desc,c.updated_at desc,c.chamber asc
         ) as rn
  from public.legislative_committees c
  where c.legislature_number=89
), hist as (
  select committee_id,count(*)::bigint as rows
  from public.bill_committee_history
  group by committee_id
), agg as (
  select r.committee_slug,
         count(*)::int as identities,
         count(distinct r.chamber)::int as chambers,
         coalesce(sum(h.rows),0)::bigint as total_history,
         coalesce(sum(h.rows) filter(where r.rn=1),0)::bigint as selected_history,
         coalesce(sum(h.rows) filter(where r.rn<>1),0)::bigint as hidden_identity_history
  from ranked r
  left join hist h on h.committee_id=r.id
  group by r.committee_slug
), selected as (
  select committee_slug,id from ranked where rn=1
), upcoming as (
  select s.committee_id,c.committee_slug
  from public.bill_schedule_events s
  join public.legislative_committees c on c.id=s.committee_id
  where s.is_active=true and s.event_date>=current_date and c.legislature_number=89
), totals as (
  select
    count(*) filter(where identities>1) as multi_identity_slugs,
    count(*) filter(where chambers>1) as cross_chamber_slugs,
    count(*) filter(where hidden_identity_history>0) as slugs_hiding_identity_history,
    coalesce(sum(hidden_identity_history),0)::bigint as hidden_identity_history_rows,
    count(*) filter(where selected_history>100) as slugs_over_route_limit,
    coalesce(sum(greatest(selected_history-100,0)),0)::bigint as hidden_route_limit_rows,
    coalesce(sum(total_history),0)::bigint as total_history_rows
  from agg
), upcoming_totals as (
  select count(*)::bigint as upcoming_total,
         count(*) filter(where u.committee_id<>s.id)::bigint as upcoming_hidden_by_selected_identity
  from upcoming u
  join selected s using(committee_slug)
)
select jsonb_build_object(
  'generated_at',now(),
  'multi_identity_slugs',t.multi_identity_slugs,
  'cross_chamber_slugs',t.cross_chamber_slugs,
  'slugs_hiding_history',t.slugs_hiding_identity_history,
  'hidden_history_rows',t.hidden_identity_history_rows,
  'slugs_over_route_limit',t.slugs_over_route_limit,
  'hidden_route_limit_rows',t.hidden_route_limit_rows,
  'total_rows_not_exposed_by_current_route',t.hidden_identity_history_rows+t.hidden_route_limit_rows,
  'total_history_rows',t.total_history_rows,
  'upcoming_schedule_events',u.upcoming_total,
  'upcoming_hidden_by_selected_identity',u.upcoming_hidden_by_selected_identity,
  'routing_complete',t.hidden_identity_history_rows=0
    and t.hidden_route_limit_rows=0
    and t.cross_chamber_slugs=0
    and u.upcoming_hidden_by_selected_identity=0
)
from totals t cross join upcoming_totals u;
$$;

create or replace function private.tlo_relationship_identity_health()
returns jsonb
language sql
stable
security definer
set search_path = public, private, pg_temp
as $$
select jsonb_build_object(
  'generated_at',now(),
  'schedule_committee_identity_mismatches',(
    select count(*)
    from public.bill_schedule_events s
    join public.bills b on b.id=s.bill_id
    join public.legislative_committees c on c.id=s.committee_id
    where b.legislature_number=89
      and (c.legislature_number<>b.legislature_number
        or c.session_code<>b.session_code
        or c.chamber<>s.chamber)
  ),
  'history_committee_identity_mismatches',(
    select count(*)
    from public.bill_committee_history h
    join public.bills b on b.id=h.bill_id
    join public.legislative_committees c on c.id=h.committee_id
    where b.legislature_number=89
      and (c.legislature_number<>b.legislature_number
        or c.session_code<>b.session_code)
  ),
  'known_tlo_action_date_corrections',(select count(*) from private.tlo_action_date_corrections),
  'unapplied_known_date_corrections',(
    select count(*)
    from public.bill_actions a
    join private.tlo_action_date_corrections c on c.source_url=a.source_url
    where a.action_code='tlo-history'
      and a.action_date=c.published_action_date
      and c.published_action_date<>c.corrected_action_date
  ),
  'legal_last_action_mismatches',(
    select count(*)
    from public.bills b
    join lateral (
      select max(a.action_date) maxd
      from public.bill_actions a
      where a.bill_id=b.id
        and coalesce(a.action_code,'') not in ('tlo-rss-meeting','tlo-rss-calendar')
    ) x on true
    where b.legislature_number=89
      and x.maxd is not null
      and b.last_action_date is distinct from x.maxd
  )
);
$$;

revoke all on function private.tlo_called_session_route_health() from public, anon, authenticated;
revoke all on function private.tlo_committee_route_health() from public, anon, authenticated;
revoke all on function private.tlo_relationship_identity_health() from public, anon, authenticated;
grant execute on function private.tlo_called_session_route_health() to service_role;
grant execute on function private.tlo_committee_route_health() to service_role;
grant execute on function private.tlo_relationship_identity_health() to service_role;

do $$
begin
  if exists(select 1 from cron.job where jobname='ktr-tlo-seed-bill-enrichment') then
    perform cron.unschedule('ktr-tlo-seed-bill-enrichment');
  end if;
  if exists(select 1 from cron.job where jobname='ktr-tlo-post-enrichment-normalization') then
    perform cron.unschedule('ktr-tlo-post-enrichment-normalization');
  end if;
  if exists(select 1 from cron.job where jobname='ktr-legislative-sync-run-reconcile') then
    perform cron.unschedule('ktr-legislative-sync-run-reconcile');
  end if;
end;
$$;

select cron.schedule(
  'ktr-tlo-seed-bill-enrichment',
  '25,55 * * * *',
  $$select private.trigger_tlo_bill_sync('enrich');$$
);
select cron.schedule(
  'ktr-tlo-post-enrichment-normalization',
  '28,58 * * * *',
  $$select private.trigger_tlo_bill_sync('normalize');$$
);
select cron.schedule(
  'ktr-legislative-sync-run-reconcile',
  '5 * * * *',
  $$select private.reconcile_stale_legislative_sync_runs();$$
);
