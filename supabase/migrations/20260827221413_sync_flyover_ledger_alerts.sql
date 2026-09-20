-- Keep the Aug. 10 Flyover admin alerts derived from the durable reconciliation
-- ledger so alert counts cannot drift from the keyed benchmark state.

create or replace function public.sync_flyover_aug10_publishing_alerts()
returns void
language plpgsql
security definer
set search_path = public
as $function$
declare
  review_count integer;
  source_needed_count integer;
  published_count integer;
  out_of_scope_count integer;
begin
  select
    count(*) filter (where disposition='review_ready'),
    count(*) filter (where disposition='source_needed'),
    count(*) filter (where disposition='published'),
    count(*) filter (where disposition='out_of_scope')
  into review_count, source_needed_count, published_count, out_of_scope_count
  from public.flyover_aug10_reconciliation;

  insert into public.publishing_alerts (incident_key,status,message,opened_at,resolved_at,updated_at)
  values (
    'flyover-aug10-review-ready',
    case when review_count > 0 then 'open' else 'resolved' end,
    format('Aug. 10 Flyover reconciliation: %s stories are source-backed and held for editorial review; none should auto-publish. %s are published and %s are out of scope. See flyover_aug10_reconciliation for exact feed IDs and evidence.', review_count, published_count, out_of_scope_count),
    now(),
    case when review_count > 0 then null else now() end,
    now()
  )
  on conflict (incident_key) do update set
    status=excluded.status,
    message=excluded.message,
    resolved_at=case
      when excluded.status='resolved' then coalesce(public.publishing_alerts.resolved_at,now())
      else null
    end,
    updated_at=now();

  insert into public.publishing_alerts (incident_key,status,message,opened_at,resolved_at,updated_at)
  values (
    'flyover-aug10-source-needed',
    case when source_needed_count > 0 then 'open' else 'resolved' end,
    case
      when source_needed_count > 0 then format('Aug. 10 Flyover reconciliation: %s stories still require source verification. Do not fabricate or auto-publish them.', source_needed_count)
      else 'Resolved: no Aug. 10 Flyover stories remain source_needed. Any unpublished stories remain explicitly review-held or out of scope.'
    end,
    now(),
    case when source_needed_count > 0 then null else now() end,
    now()
  )
  on conflict (incident_key) do update set
    status=excluded.status,
    message=excluded.message,
    resolved_at=case
      when excluded.status='resolved' then coalesce(public.publishing_alerts.resolved_at,now())
      else null
    end,
    updated_at=now();
end;
$function$;

create or replace function public.trigger_sync_flyover_aug10_publishing_alerts()
returns trigger
language plpgsql
security definer
set search_path = public
as $function$
begin
  perform public.sync_flyover_aug10_publishing_alerts();
  return null;
end;
$function$;

drop trigger if exists flyover_aug10_alert_sync on public.flyover_aug10_reconciliation;
create trigger flyover_aug10_alert_sync
after insert or update or delete on public.flyover_aug10_reconciliation
for each statement execute function public.trigger_sync_flyover_aug10_publishing_alerts();

select public.sync_flyover_aug10_publishing_alerts();

revoke all on function public.sync_flyover_aug10_publishing_alerts() from public;
revoke all on function public.trigger_sync_flyover_aug10_publishing_alerts() from public;
