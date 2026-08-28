-- Recover only deterministic site destinations the primary router still leaves
-- in review. Published/linked rows and explicit routing locks are never changed.

create or replace function public.route_high_confidence_discovery_gaps()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  h text := lower(coalesce(new.title,'') || ' ' || coalesce(new.description,'') || ' ' || coalesce(new.source,''));
begin
  if new.internal_slug is not null or new.texasdefined_slug is not null then return new; end if;
  if coalesce((new.viral_signals->>'routing_lock')::boolean,false) then return new; end if;
  if coalesce(new.target_site,'review') <> 'review' then return new; end if;

  if h ~ '(council of governments|regional council.*board|loop [0-9]+.*shutdown|highway .*shutdown|highway closure|road closure|thunderstorms?.*hail|hail.*national weather service|hail.*\mnws\M|maternal health program|health sciences center.*grant|diabetes testing access.*rural west texas)' then
    new.target_site := 'keeptxred';
    new.target_section := 'Texas News';
    return new;
  end if;

  if h ~ '(piercings?[^a-z]+tattoos?|german store|imported goods.*new braunfels|\mbatmobile\M|\mfest\M.*(laredo|texas)|leaves change colors.*texas|\mpier\M.*(noaa|weather station|corpus christi|texas))' then
    new.target_site := 'texasdefined';
    new.target_section := case
      when h ~ '(leaves change colors|\mpier\M.*(noaa|weather station|corpus christi|texas))' then 'Explore'
      else 'Texas Life'
    end;
    return new;
  end if;

  return new;
end;
$function$;

drop trigger if exists zzz_route_high_confidence_discovery_gaps on public.texas_news_feed;
create trigger zzz_route_high_confidence_discovery_gaps
before insert or update of title,description,source,target_site,viral_signals
on public.texas_news_feed
for each row execute function public.route_high_confidence_discovery_gaps();

update public.texas_news_feed
set title = title
where created_at >= now() - interval '14 days'
  and target_site = 'review'
  and target_section = 'Unclassified'
  and internal_slug is null
  and texasdefined_slug is null;

comment on function public.route_high_confidence_discovery_gaps() is
  'Narrow post-router recovery for deterministic Texas civic/infrastructure/health and TexasDefined lifestyle/explore stories that the primary router leaves in review.';
