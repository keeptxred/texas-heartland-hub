-- Deployed to shared Supabase project ftkznprjljkhymknvhye; keep source control consistent with applied migration.

create table if not exists private.cron_success_history_daily (
  run_day date not null,
  job_id bigint not null,
  result_status text not null,
  pruned_count bigint not null default 0,
  first_started_at timestamptz not null,
  last_started_at timestamptz not null,
  primary key (run_day, job_id, result_status)
);
alter table private.cron_success_history_daily enable row level security;
revoke all on private.cron_success_history_daily from public, anon, authenticated;

create or replace function private.prune_successful_cron_run_history(p_batch_limit integer default 20000)
returns bigint
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_removed bigint := 0;
begin
  if p_batch_limit is null or p_batch_limit < 1 or p_batch_limit > 20000 then
    raise exception 'batch limit must be between 1 and 20000';
  end if;

  with selected as (
    select d.runid
    from cron.job_run_details d
    where d.status = 'succeeded'
      and d.end_time is not null
      and d.end_time < now() - interval '7 days'
    order by d.end_time asc
    limit p_batch_limit
    for update skip locked
  ),
  removed as (
    delete from cron.job_run_details d
    using selected s
    where d.runid = s.runid
    returning d.jobid, d.status, d.start_time
  ),
  summary as (
    select
      (start_time at time zone 'UTC')::date as run_day,
      jobid as job_id,
      status as result_status,
      count(*)::bigint as pruned_count,
      min(start_time) as first_started_at,
      max(start_time) as last_started_at
    from removed
    group by 1, 2, 3
  ),
  stored as (
    insert into private.cron_success_history_daily
      (run_day, job_id, result_status, pruned_count, first_started_at, last_started_at)
    select run_day, job_id, result_status, pruned_count, first_started_at, last_started_at
    from summary
    on conflict (run_day, job_id, result_status)
    do update
      set pruned_count = private.cron_success_history_daily.pruned_count + excluded.pruned_count,
          first_started_at = least(private.cron_success_history_daily.first_started_at, excluded.first_started_at),
          last_started_at = greatest(private.cron_success_history_daily.last_started_at, excluded.last_started_at)
    returning 1
  )
  select count(*) into v_removed from removed;

  return v_removed;
end;
$function$;
revoke all on function private.prune_successful_cron_run_history(integer) from public, anon, authenticated;

