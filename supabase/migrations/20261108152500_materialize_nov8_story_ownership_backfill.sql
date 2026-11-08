-- The 20261108145500 discovery migration seeds the feeds and installs routing.
-- It intentionally did not force publication state. Its historical UPDATE title=title
-- was swallowed by aaa_skip_noop_texas_news_feed, which safely skips unchanged
-- rows before any downstream routing triggers can run.
-- Apply a *material* site/section change only to matching recent, unpublished,
-- unlocked candidates; all existing final newsroom guards still execute.
WITH desired AS MATERIALIZED (
  SELECT
    id,
    CASE
      WHEN h ~ '(lufkin.*(water (main|line) break|water service|hotel district|truck stop)|(water (main|line) break|water service).*lufkin)'
        OR h ~ '(midlothian.*(fbi|federal (agents|investigat|search)|oil.and.gas.*(search|raid))|(fbi|federal agents).*midlothian)'
        THEN 'keeptxred'
      WHEN h ~ '(mckinney national airport|avelo.*mckinney|mckinney.*avelo)'
           AND h ~ '(commercial|flight|passenger|destination|terminal|travel|route)'
        THEN 'texasdefined'
      WHEN h ~ '(buda.*(wiener dog|dachshund|sculpture|statue)|(wiener dog|dachshund).*buda)'
           AND h ~ '(nam(e|ing)|vote|sculpture|statue)'
        THEN 'texasdefined'
      WHEN h ~ '(holly hop|ice cream shoppe.*(clos|final day)|lubbock.*ice cream.*clos)'
        THEN 'texasdefined'
      WHEN h ~ '(kilgore.*(turkey|ham|food drive|giveaway)|credit union of texas.*(turkey|ham|food drive))'
        OR h ~ '(community food drive|holiday food giveaway|annual turkey giveaway)'
        THEN 'texasdefined'
      WHEN h ~ '(schlitterbahn.*(texas tides|renam|trademark)|texas tides.*(schlitterbahn|galveston))'
        THEN 'texasdefined'
      WHEN h ~ '(meteorite.*(houston museum|fall to earth)|fall to earth.*(museum|meteorite))'
        THEN 'texasdefined'
      WHEN h ~ '(starship.*(flight 15|test flight|booster catch|ship catch)|starbase.*(test flight|launch))'
           AND h !~ '(lawsuit|regulat|election|campaign|land sale|environmental impact)'
        THEN 'texasdefined'
      WHEN h ~ '(baylor.*(iowa state|cyclones)|(iowa state|cyclones).*baylor)'
           AND h ~ '(beat|defeat|win|victory|42.31|surge|rall)'
        THEN 'texasdefined'
      ELSE NULL
    END AS site,
    CASE
      WHEN h ~ '(lufkin.*(water (main|line) break|water service|hotel district|truck stop)|(water (main|line) break|water service).*lufkin)'
        OR h ~ '(midlothian.*(fbi|federal (agents|investigat|search)|oil.and.gas.*(search|raid))|(fbi|federal agents).*midlothian)'
        THEN 'Texas News'
      WHEN h ~ '(mckinney national airport|avelo.*mckinney|mckinney.*avelo)'
           AND h ~ '(commercial|flight|passenger|destination|terminal|travel|route)'
        THEN 'Explore'
      WHEN h ~ '(buda.*(wiener dog|dachshund|sculpture|statue)|(wiener dog|dachshund).*buda)'
           AND h ~ '(nam(e|ing)|vote|sculpture|statue)'
        THEN 'Texas Life'
      WHEN h ~ '(holly hop|ice cream shoppe.*(clos|final day)|lubbock.*ice cream.*clos)'
        THEN 'Food & Drink'
      WHEN h ~ '(kilgore.*(turkey|ham|food drive|giveaway)|credit union of texas.*(turkey|ham|food drive))'
        OR h ~ '(community food drive|holiday food giveaway|annual turkey giveaway)'
        THEN 'Texas Life'
      WHEN h ~ '(schlitterbahn.*(texas tides|renam|trademark)|texas tides.*(schlitterbahn|galveston))'
        OR h ~ '(meteorite.*(houston museum|fall to earth)|fall to earth.*(museum|meteorite))'
        THEN 'Explore'
      WHEN h ~ '(starship.*(flight 15|test flight|booster catch|ship catch)|starbase.*(test flight|launch))'
           AND h !~ '(lawsuit|regulat|election|campaign|land sale|environmental impact)'
        THEN 'Explore'
      WHEN h ~ '(baylor.*(iowa state|cyclones)|(iowa state|cyclones).*baylor)'
           AND h ~ '(beat|defeat|win|victory|42.31|surge|rall)'
        THEN 'Sports'
      ELSE NULL
    END AS section
  FROM (
    SELECT id, lower(coalesce(title,'') || ' ' || coalesce(description,'')) AS h
    FROM public.texas_news_feed
    WHERE created_at >= timestamptz '2026-11-04T00:00:00Z'
      AND internal_slug IS NULL
      AND texasdefined_slug IS NULL
      AND coalesce((viral_signals->>'routing_lock')::boolean, false) = false
      AND lower(coalesce(title,'') || ' ' || coalesce(description,'')) ~
        '(lufkin.*water|midlothian.*(fbi|federal)|mckinney.*(airport|avelo)|avelo.*mckinney|buda.*(wiener|dachshund|sculpture)|holly hop|ice cream shoppe|kilgore.*(turkey|ham)|credit union of texas.*(turkey|ham)|community food drive|holiday food giveaway|annual turkey giveaway|schlitterbahn|texas tides|meteorite.*museum|fall to earth|starship.*flight|starbase.*launch|baylor.*iowa state|iowa state.*baylor)'
  ) incoming
)
UPDATE public.texas_news_feed f
SET target_site = desired.site,
    target_section = desired.section
FROM desired
WHERE f.id = desired.id
  AND desired.site IS NOT NULL
  AND desired.section IS NOT NULL
  AND (
    f.target_site IS DISTINCT FROM desired.site
    OR f.target_section IS DISTINCT FROM desired.section
  )
  AND f.internal_slug IS NULL
  AND f.texasdefined_slug IS NULL
  AND coalesce((f.viral_signals->>'routing_lock')::boolean, false) = false;

-- No publication, authoring or quality-score fields are modified.
