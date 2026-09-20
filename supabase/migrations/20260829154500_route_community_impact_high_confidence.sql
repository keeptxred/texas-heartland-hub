-- Route a narrow set of deterministic Community Impact stories that the
-- primary site router leaves in review. Keep this source-scoped and preserve
-- review for ambiguous stories.

create or replace function public.route_high_confidence_discovery_gaps()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  t text := lower(coalesce(new.title,''));
  h text := lower(coalesce(new.title,'') || ' ' || coalesce(new.description,'') || ' ' || coalesce(new.source,''));
  src text := lower(coalesce(new.source,'') || ' ' || coalesce(new.trend_source,''));
begin
  if new.internal_slug is not null or new.texasdefined_slug is not null then return new; end if;
  if coalesce((new.viral_signals->>'routing_lock')::boolean,false) then return new; end if;
  if coalesce(new.target_site,'review') <> 'review' then return new; end if;

  -- Community Impact: deterministic municipal/infrastructure/education news.
  if src ~ 'community impact'
     and h ~ '(generator installation|water infrastructure upgrades?|bond sale|water district.*(invest|project)|required curriculum list|curriculum list)'
  then
    new.target_site := 'keeptxred';
    new.target_section := 'Texas News';
    return new;
  end if;

  -- Community Impact: deterministic local-life/opening/park features.
  if src ~ 'community impact'
     and h ~ '(salon.*relocat|bridal.*relocat|bass pro shops|live music|neighborhood park|indoor playground|home building)'
  then
    new.target_site := 'texasdefined';
    new.target_section := case when h ~ 'neighborhood park' then 'Explore' else 'Texas Life' end;
    return new;
  end if;

  -- Existing high-confidence KTR civic / infrastructure / Texas health-service news.
  if h ~ '(council of governments|regional council.*board|loop [0-9]+.*shutdown|highway .*shutdown|highway closure|road closure|thunderstorms?.*hail|hail.*national weather service|hail.*\mnws\M|maternal health program|health sciences center.*grant|diabetes testing access.*rural west texas)' then
    new.target_site := 'keeptxred';
    new.target_section := 'Texas News';
    return new;
  end if;

  -- Existing high-confidence TexasDefined local-life / event / outdoor discovery.
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

-- Re-evaluate only recent unlinked Community Impact review rows.
update public.texas_news_feed
set title = title
where trend_source = 'Community Impact — Texas Hyperlocal'
  and internal_slug is null
  and texasdefined_slug is null
  and target_site = 'review'
  and created_at >= now() - interval '48 hours';
