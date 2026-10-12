-- Applied to production shared database; monitored without disabling any publishing jobs.

create table if not exists private.database_capacity_daily (
  measured_day date primary key,
  measured_at timestamptz not null default now(),
  database_bytes bigint not null check(database_bytes > 0),
  status text not null check(status in ('ok','warning','critical','over_limit'))
);
alter table private.database_capacity_daily enable row level security;
revoke all on private.database_capacity_daily from public,anon,authenticated;

create or replace function private.capture_database_capacity_daily()
returns bigint
language plpgsql
security definer
set search_path = ''
as $function$
declare
  bytes_used bigint;
  quota_status text;
begin
  select pg_catalog.pg_database_size(pg_catalog.current_database()) into bytes_used;
  quota_status := case
    when bytes_used >= 500000000 then 'over_limit'
    when bytes_used >= 475000000 then 'critical'
    when bytes_used >= 450000000 then 'warning'
    else 'ok'
  end;
  insert into private.database_capacity_daily(measured_day,measured_at,database_bytes,status)
  values ((now() at time zone 'UTC')::date,now(),bytes_used,quota_status)
  on conflict(measured_day) do update
    set measured_at=excluded.measured_at,
        database_bytes=excluded.database_bytes,
        status=excluded.status;
  return bytes_used;
end;
$function$;
revoke all on function private.capture_database_capacity_daily() from public,anon,authenticated;
select cron.schedule(
  'free-tier-database-capacity-monitor',
  '55 4,16 * * *',
  'SELECT private.capture_database_capacity_daily()'
);

