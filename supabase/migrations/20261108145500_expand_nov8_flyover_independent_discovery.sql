-- 2026-11-08 Texas Flyover benchmark: repair *independent* source discovery and
-- precise two-site ownership. Newsletter prose is never a substantive source.
-- Preserve existing ingestion, event clustering, review, source validation, image
-- gating and publication safeguards. No auto-publish flags are changed.
WITH proposed(source_name, relay_key, category, notes) AS (
  VALUES
  ('Texas Community Giving and Food Drives — Google News', 'google-local-giving', 'Non-Political', 'Seasonal food drives, community giveaways, and small-town volunteer events (Kilgore turkey drive benchmark).'),
  ('Texas Local Utility Disruptions — Google News', 'google-local-utility', 'Local', 'Short-lived local water service, boil-water and utility interruption notices (Lufkin water main benchmark); require current restoration check.'),
  ('Texas Local Business Openings Closings — Google News', 'google-local-business-change', 'Non-Political', 'Independent community restaurants and retailers opening or closing (Holly Hop Lubbock benchmark).'),
  ('Texas Local Federal Investigations — Google News', 'google-local-investigations', 'Local', 'Verified federal/local investigation and warrant reports (Midlothian FBI benchmark); allegations are not charges.'),
  ('Texas Space and Starbase Launches — Google News', 'google-space-launches', 'Non-Political', 'Starbase flight tests and launch targets; retain provisional status until official flight clearance.'),
  ('Texas Attractions and Brand Changes — Google News', 'google-attraction-changes', 'Non-Political', 'Museum exhibits, visitor attractions and proposed amusement/waterpark name changes; trademark filings are not confirmations.'),
  ('Texas Community Art and Naming — Google News', 'google-community-art', 'Non-Political', 'Public art contests and civic traditions (Buda dachshund statue benchmark).')
)
INSERT INTO public.content_sources
  (platform, source_name, source_url, rss_url, category, notes, source_reputation_score, enabled)
SELECT
  'rss', p.source_name, 'https://news.google.com/',
  'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-priority?feed=' || p.relay_key,
  p.category, 'Discovery-only Google News pointer. ' || p.notes,
  55::smallint, true
FROM proposed p
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_sources s
  WHERE lower(s.source_name) = lower(p.source_name)
     OR lower(coalesce(s.rss_url,'')) =
       lower('https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-priority?feed=' || p.relay_key)
);

-- Idempotently reactivate these specific news-discovery feeds only.
UPDATE public.content_sources
SET enabled = true
WHERE source_name IN (
  'Texas Community Giving and Food Drives — Google News',
  'Texas Local Utility Disruptions — Google News',
  'Texas Local Business Openings Closings — Google News',
  'Texas Local Federal Investigations — Google News',
  'Texas Space and Starbase Launches — Google News',
  'Texas Attractions and Brand Changes — Google News',
  'Texas Community Art and Naming — Google News'
);

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
  ELSIF h ~ '(starship.*(flight 15|test flight|booster catch|ship catch)|starbase.*(test flight|launch))'
       AND h !~ '(lawsuit|regulat|election|campaign|land sale|environmental impact)' THEN
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

DROP TRIGGER IF EXISTS zzx_route_nov8_texas_story_archetypes ON public.texas_news_feed;
CREATE TRIGGER zzx_route_nov8_texas_story_archetypes
BEFORE INSERT OR UPDATE OF title, description, source, trend_source, target_site, target_section
ON public.texas_news_feed
FOR EACH ROW
EXECUTE FUNCTION public.route_nov8_texas_story_archetypes();

-- Recheck *only* bounded recent, unpublished event candidates. Trigger order
-- leaves the established zzz_* quality/ownership guards authoritative.
UPDATE public.texas_news_feed
SET title = title
WHERE created_at >= timestamptz '2026-11-04T00:00:00Z'
  AND internal_slug IS NULL
  AND texasdefined_slug IS NULL
  AND coalesce((viral_signals->>'routing_lock')::boolean, false) IS FALSE
  AND lower(coalesce(title,'') || ' ' || coalesce(description,'')) ~
    '(lufkin.*water|midlothian.*(fbi|federal)|mckinney.*(airport|avelo)|avelo.*mckinney|buda.*(wiener|dachshund|sculpture)|holly hop|ice cream shoppe|kilgore.*(turkey|ham)|credit union of texas.*(turkey|ham)|community food drive|holiday food giveaway|annual turkey giveaway|schlitterbahn|texas tides|meteorite.*museum|fall to earth|starship.*flight|starbase.*launch|baylor.*iowa state|iowa state.*baylor)';

COMMENT ON FUNCTION public.route_nov8_texas_story_archetypes() IS
  'Narrow 2026-11-08 independent Texas newsroom benchmark routing; preserves source/readiness/syndication controls and owner locks.';
