-- Expanded original Texas space-flight headlines from KRGV's actual Nov. 7
-- listing: "SpaceX sets target date for 15th Starship launch at Starbase".
-- Live initial router missed "15th Starship" / "Starship launch" word orders.
-- "Pending regulatory approval" does not itself make launch visitor coverage
-- a politics article. Separate regulatory disputes remain KeepTXRed stories.
-- Preserve all existing routing locks and publication-quality gates.
CREATE OR REPLACE FUNCTION public.route_nov8_texas_story_archetypes()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  h text := lower(coalesce(new.title,'') || ' ' || coalesce(new.description,''));
  locked boolean := coalesce((new.viral_signals->>'routing_lock')::boolean, false);
BEGIN
  -- Never touch published/linked stories or a manually locked classification.
  IF new.internal_slug IS NOT NULL OR new.texasdefined_slug IS NOT NULL OR locked THEN
    RETURN new;
  END IF;

  -- Material public-safety disruption / investigations belong to KTR.
  IF h ~ '(lufkin.*(water (main|line) break|water service|hotel district|truck stop)|(water (main|line) break|water service).*lufkin)'
     OR h ~ '(midlothian.*(fbi|federal (agents|investigat|search)|oil.and.gas.*(search|raid))|(fbi|federal agents).*midlothian)'
  THEN
    new.target_site := 'keeptxred';
    new.target_section := 'Texas News';
    RETURN new;
  END IF;

  -- Public-facing travel, culture, local business, giving and sport belong to TD.
  -- Narrow named benchmarks plus reusable story patterns, never a generic word
  -- such as "Texas" or "closing" alone.
  IF h ~ '(mckinney national airport|avelo.*mckinney|mckinney.*avelo)'
       AND h ~ '(commercial|flight|passenger|destination|terminal|travel|route)' THEN
    new.target_site := 'texasdefined';
    new.target_section := 'Explore';
  ELSIF h ~ '(buda.*(wiener dog|dachshund|sculpture|statue)|(wiener dog|dachshund).*buda)'
       AND h ~ '(nam(e|ing)|vote|sculpture|statue)' THEN
    new.target_site := 'texasdefined';
    new.target_section := 'Texas Life';
  ELSIF h ~ '(holly hop|ice cream shoppe.*(clos|final day)|lubbock.*ice cream.*clos)' THEN
    new.target_site := 'texasdefined';
    new.target_section := 'Food & Drink';
  ELSIF h ~ '(kilgore.*(turkey|ham|food drive|giveaway)|credit union of texas.*(turkey|ham|food drive))'
       OR h ~ '(community food drive|holiday food giveaway|annual turkey giveaway)' THEN
    new.target_site := 'texasdefined';
    new.target_section := 'Texas Life';
  ELSIF h ~ '(schlitterbahn.*(texas tides|renam|trademark)|texas tides.*(schlitterbahn|galveston))' THEN
    new.target_site := 'texasdefined';
    new.target_section := 'Explore';
  ELSIF h ~ '(meteorite.*(houston museum|fall to earth)|fall to earth.*(museum|meteorite))' THEN
    new.target_site := 'texasdefined';
    new.target_section := 'Explore';
  ELSIF h ~ '(starship.*(flight 15|test flight|booster catch|ship catch|launch)|15th starship.*(launch|flight)|spacex.*starship.*launch|starbase.*(test flight|launch))'
       AND h !~ '(lawsuit|regulatory (hearing|challenge|lawsuit)|election|campaign|land sale|environmental impact)' THEN
    new.target_site := 'texasdefined';
    new.target_section := 'Explore';
  ELSIF h ~ '(baylor.*(iowa state|cyclones)|(iowa state|cyclones).*baylor)'
       AND h ~ '(beat|defeat|win|victory|42.31|surge|rall)' THEN
    new.target_site := 'texasdefined';
    new.target_section := 'Sports';
  ELSE
    RETURN new;
  END IF;

  -- This is *only* ownership classification: do not set classification
  -- confidence, ready_for_rewrite, extracted_body, reputation, or publish flags.
  RETURN new;
END;
$function$;

-- Material site/section update only for unpublished, unlocked, source-backed
-- KRGV Flight 15 discovery rows from the recent window.
UPDATE public.texas_news_feed
SET target_site = 'texasdefined', target_section = 'Explore'
WHERE created_at >= timestamptz '2026-11-05T00:00:00Z'
  AND source = 'KRGV Rio Grande Valley — Direct Local Headlines'
  AND (lower(title) ~ '(15th starship|starship.*flight 15|starship.*launch)')
  AND internal_slug IS NULL AND texasdefined_slug IS NULL
  AND coalesce((viral_signals->>'routing_lock')::boolean, false) = false
  AND (target_site IS DISTINCT FROM 'texasdefined' OR target_section IS DISTINCT FROM 'Explore');
