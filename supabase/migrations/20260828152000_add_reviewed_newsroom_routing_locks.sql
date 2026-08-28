-- Preserve explicitly reviewed/manual newsroom routing across later bulk router
-- passes. The mechanism is generic; the data backfill below applies it to the
-- durable Texas Flyover Aug. 10 recovery rows by semantic title patterns.

create or replace function public.enforce_newsroom_routing_lock()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  locked boolean := coalesce((new.viral_signals->>'routing_lock')::boolean, false);
  locked_site text := nullif(new.viral_signals->>'routing_locked_site', '');
  locked_section text := nullif(new.viral_signals->>'routing_locked_section', '');
begin
  if locked and locked_site is not null then
    new.target_site := locked_site;
    if locked_section is not null then new.target_section := locked_section; end if;
  end if;
  return new;
end;
$function$;

drop trigger if exists zzzzzz_enforce_newsroom_routing_lock on public.texas_news_feed;
create trigger zzzzzz_enforce_newsroom_routing_lock
before insert or update of title, description, source, trend_source, viral_signals
on public.texas_news_feed
for each row execute function public.enforce_newsroom_routing_lock();

-- Backfill reviewed routing locks for the Aug. 10 recovery cohort. These rows
-- remain review-gated; the lock changes destination only and never publishes.
with mapped as (
  select id,
    case
      when lower(title) ~ '(battle of the nueces|german unionists)' then 'texasdefined'
      when lower(title) ~ '(richardson.*lego|lego.*public safety)' then 'texasdefined'
      when lower(title) ~ '(kaylee hottle|school for the deaf.*scholarship)' then 'texasdefined'
      when lower(title) ~ '(counties ranked.*born|born in the state)' then 'texasdefined'
      when lower(title) ~ '(old eds plano|eds.*implod)' then 'texasdefined'
      else 'keeptxred'
    end as locked_site,
    case
      when lower(title) ~ '(battle of the nueces|german unionists)' then 'History'
      when lower(title) ~ '(richardson.*lego|lego.*public safety)' then 'Texas Life'
      when lower(title) ~ '(kaylee hottle|school for the deaf.*scholarship)' then 'Texas Life'
      when lower(title) ~ '(counties ranked.*born|born in the state)' then 'Texas Life'
      when lower(title) ~ '(old eds plano|eds.*implod)' then 'Texas Life'
      when lower(title) ~ '(don nelson|jonah bride|quinnen williams|tate taylor)' then 'Sports'
      when lower(title) ~ '(casey.*pak-a-sak|texas stadium|sushi.*doordash)' then 'Business'
      when lower(title) ~ '(bastrop.*council)' then 'Politics'
      else 'Texas News'
    end as locked_section
  from public.texas_news_feed
  where coalesce((viral_signals->>'flyover_aug10_reconciliation')::boolean, false) = true
), updated as (
  update public.texas_news_feed f
  set target_site = m.locked_site,
      target_section = m.locked_section,
      viral_signals = coalesce(f.viral_signals, '{}'::jsonb) || jsonb_build_object(
        'routing_lock', true,
        'routing_locked_site', m.locked_site,
        'routing_locked_section', m.locked_section,
        'routing_lock_reason', 'Reviewed Texas Flyover Aug. 10 recovery disposition'
      )
  from mapped m
  where f.id = m.id
  returning f.id
)
select count(*) from updated;

comment on function public.enforce_newsroom_routing_lock() is
  'Final routing-preservation guard for manually reviewed newsroom rows carrying routing_lock metadata.';
