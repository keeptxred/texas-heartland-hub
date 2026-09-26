-- Route a bounded set of current review-lane gaps using established site ownership.
CREATE OR REPLACE FUNCTION public.route_high_confidence_discovery_gaps()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
declare
  t text := lower(coalesce(new.title,''));
  h text := lower(coalesce(new.title,'') || ' ' || coalesce(new.description,'') || ' ' || coalesce(new.source,''));
  src text := lower(coalesce(new.source,'') || ' ' || coalesce(new.trend_source,''));
begin
  if new.internal_slug is not null or new.texasdefined_slug is not null then return new; end if;
  if coalesce((new.viral_signals->>'routing_lock')::boolean,false) then return new; end if;
  if coalesce(new.target_site,'review') <> 'review' then return new; end if;

  -- Government/public-affairs and infrastructure remain KeepTXRed.
  if h ~ '(city[- ]funded immigration programs?|immigration programs?.*contract|academic freedom|curriculum changes?|tirz money|non-city residents.*pay.*librar|txdot event|outer loop.*open|paving begins.*delays|public funding.*clubhouse)'
  then
    new.target_site := 'keeptxred';
    new.target_section := 'Texas News';
    return new;
  end if;

  -- Statewide employment/economic reporting remains KeepTXRed Business.
  if h ~ '(texas adds [0-9,]+ jobs|jobs? .*growth|employment growth|jobs over the year)'
  then
    new.target_site := 'keeptxred';
    new.target_section := 'Business';
    return new;
  end if;

  -- Consumer real-estate and relocation intent belongs to TexasDefined.
  if h ~ '(real estate market|home sales|home prices|gen z movers|movers in 20[0-9]{2}|relocation)'
  then
    new.target_site := 'texasdefined';
    new.target_section := 'Real Estate';
    return new;
  end if;

  -- Lifestyle openings, culture and weather belong to TexasDefined.
  if h ~ '(store .* opens? in|documentary .*premiere|free music friday|first fall front)'
  then
    new.target_site := 'texasdefined';
    new.target_section := 'Texas Life';
    return new;
  end if;

  if src ~ 'community impact'
     and h ~ '(generator installation|water infrastructure upgrades?|bond sale|water district.*(invest|project)|required curriculum list|curriculum list)'
  then
    new.target_site := 'keeptxred';
    new.target_section := 'Texas News';
    return new;
  end if;

  if src ~ 'community impact'
     and h ~ '(salon.*relocat|bridal.*relocat|bass pro shops|live music|neighborhood park|indoor playground|home building)'
  then
    new.target_site := 'texasdefined';
    new.target_section := case when h ~ 'neighborhood park' then 'Explore' else 'Texas Life' end;
    return new;
  end if;

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

-- Re-evaluate only recent, unpublished SEO review rows.
UPDATE public.texas_news_feed
SET title = title
WHERE pub_date >= now() - interval '24 hours'
  AND routing_type = 'SEO_ARTICLE'
  AND target_site = 'review'
  AND internal_slug IS NULL
  AND texasdefined_slug IS NULL;
