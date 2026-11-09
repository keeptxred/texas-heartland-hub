-- 2026-11-09 Flyover benchmark: additive owner-only routing on the existing shared newsroom.
-- Flyover prose is NOT a source. Never activate blocked Google News relays or bypass
-- existing factual corroboration, article length, hero image, source, duplication,
-- review, and Google people-first quality gates.
-- This helper is deterministic and reusable by both trigger and bounded backfill.
CREATE OR REPLACE FUNCTION public.nov9_flyover_story_destination(headline text, summary text)
RETURNS text[]
LANGUAGE plpgsql IMMUTABLE
SET search_path = public
AS $function$
DECLARE
  t text := lower(coalesce(headline,''));
  h text := lower(coalesce(headline,'') || ' ' || coalesce(summary,''));
BEGIN
  -- Actual government actions override incidental tourist words such as "park".
  IF t ~ '(hinojosa|governor.elect|gov..elect)' AND
     t ~ '(state park|boca chica|park land)' AND
     t ~ '(land sale|sale|purchase|pause|spacex)' THEN
    RETURN ARRAY['keeptxred','Politics'];
  ELSIF t ~ '(whitmire|houston|hpd)' AND t ~ '(ice|immigration enforcement)' AND
        t ~ '(police|cooperat|executive order|restrict|calls?|policy)' THEN
    RETURN ARRAY['keeptxred','Texas News'];
  ELSIF t ~ '(harrison|hinojosa|governor.elect)' AND
        t ~ '(governor.*(power|emergency)|limit.*power|special session|emergency power)' THEN
    RETURN ARRAY['keeptxred','Politics'];
  ELSIF t ~ '(hinojosa|governor.elect)' AND
        t ~ '(transition team|transition website|resume portal|incoming administration)' THEN
    RETURN ARRAY['keeptxred','Politics'];
  ELSIF t ~ '(abbott|governor)' AND t ~ '(flood|storm|emergency response)' THEN
    RETURN ARRAY['keeptxred','Texas News'];
  ELSIF t ~ '(public defender|chief investigator)' AND t ~ '(murder|stabb|wife.*death)' THEN
    RETURN ARRAY['keeptxred','Texas News'];
  ELSIF t ~ '(odessa|mcm grande|santiago valencia)' AND
        t ~ '(hotel.*shoot|shoot|suspect|armed and dangerous)' THEN
    RETURN ARRAY['keeptxred','Texas News'];
  -- Nonpolitical Texas visitor, outdoors, culture, research and human-interest
  -- features. Negative controls exclude legal/regulatory/violent crime angles.
  ELSIF t ~ '(arlington.*veterans.*parade|texas veterans day parade)' AND
        t !~ '(shoot|arrest|crash|lawsuit|indict)' THEN
    RETURN ARRAY['texasdefined','Events'];
  ELSIF t ~ '(canyon ranch.*(austin|spicewood|resort|spa)|largest spa.*texas)' AND
        t !~ '(lawsuit|regulat|tax subsidy|investigation)' THEN
    RETURN ARRAY['texasdefined','Explore'];
  ELSIF t ~ '(kimpton.*fredericksburg|the meuse.*(hotel|bludorn|chef)|bludorn.*fredericksburg)' AND
        t !~ '(lawsuit|regulat|investigation)' THEN
    RETURN ARRAY['texasdefined','Explore'];
  ELSIF h ~ '(utep|el paso|mallard)' AND t ~ '(mallard|ducks?)' AND
        t ~ '(genetic|dna|inbred|diversity|farm.raised|game.farm)' THEN
    RETURN ARRAY['texasdefined','Explore'];
  ELSIF t ~ '(texas biomed|texas biomedical)' AND
        t ~ '(tuberculosis|\mtb\M|host.directed|grant|research)' AND
        t !~ '(politic|legislat|regulat|lawsuit|investigation)' THEN
    RETURN ARRAY['texasdefined','Texas Life'];
  ELSIF t ~ '(texas lutheran|tlu bulldogs)' AND
        t ~ '(centenary|scac championship|conference championship|28.20|football.*(win|title|tribute|honor))' AND
        t !~ '(students killed|students die|crash kills)' THEN
    RETURN ARRAY['texasdefined','Sports'];
  ELSIF t ~ '(cowboys.*colts|colts.*cowboys|texans.*chargers|chargers.*texans)' AND
        t !~ '(arrest|lawsuit|taxpayer|public funding|shooting)' THEN
    RETURN ARRAY['texasdefined','Sports'];
  ELSIF t ~ '(nehomar ochoa|ochoa jr)' AND
        t ~ '(astros|fall league|prospect|arizona)' THEN
    RETURN ARRAY['texasdefined','Sports'];
  ELSIF t ~ '(smu|texas a.m|baylor|longhorns)' AND t ~ '(volleyball)' AND
        t ~ '(win|defeat|match|rank|loss|beat|sweep)' THEN
    RETURN ARRAY['texasdefined','Sports'];
  ELSIF t ~ '(archdiocese of san antonio)' AND
        t ~ '(centennial|100 years|century|100th anniversary)' THEN
    RETURN ARRAY['texasdefined','History'];
  ELSIF t ~ '(diane day)' AND t ~ '(radio hall of fame|hall of fame|radio)' THEN
    RETURN ARRAY['texasdefined','Texas Life'];
  ELSIF t ~ '(ida mae ford)' AND t ~ '(birthday|102|parade)' THEN
    RETURN ARRAY['texasdefined','Texas Life'];
  ELSIF t ~ '(peaceful small towns|most peaceful.*towns)' AND
        t !~ '(crime|politic|police)' THEN
    RETURN ARRAY['texasdefined','Explore'];
  END IF;
  RETURN NULL;
END
$function$;

-- Keep the helper callable by all existing newsroom insert/update roles. It is a
-- pure classifier: no secret reads or data writes, and existing row-level
-- routing, permissions and publication gates remain authoritative.

CREATE OR REPLACE FUNCTION public.route_nov9_flyover_story_destination()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  desired text[];
BEGIN
  IF new.internal_slug IS NOT NULL
     OR new.texasdefined_slug IS NOT NULL
     OR coalesce((new.viral_signals->>'routing_lock')::boolean,false) THEN
    RETURN new;
  END IF;
  desired := public.nov9_flyover_story_destination(new.title,new.description);
  IF desired IS NOT NULL THEN
    new.target_site := desired[1];
    new.target_section := desired[2];
  END IF;
  -- Never set approval, source reputation, extracted body, rewrite eligibility,
  -- auto-publish flags, article slugs, or editorial confidence.
  RETURN new;
END
$function$;

DROP TRIGGER IF EXISTS zzxy_route_nov9_flyover_story_destination ON public.texas_news_feed;
CREATE TRIGGER zzxy_route_nov9_flyover_story_destination
BEFORE INSERT OR UPDATE OF title, description, source, trend_source, target_site, target_section
ON public.texas_news_feed FOR EACH ROW
EXECUTE FUNCTION public.route_nov9_flyover_story_destination();

-- A content-neutral no-op is discarded by aaa_skip_noop_texas_news_feed.
-- This backfill changes material ownership fields only for matching rows,
-- time-bounded, unpublished, manually unlocked and genuinely misrouted.
WITH proposed AS MATERIALIZED (
 SELECT f.id, public.nov9_flyover_story_destination(f.title,f.description) as destination
 FROM public.texas_news_feed f
 WHERE f.created_at >= timestamptz '2026-11-01T00:00:00Z'
 AND f.internal_slug IS NULL AND f.texasdefined_slug IS NULL
 AND coalesce((f.viral_signals->>'routing_lock')::boolean,false) = false
 AND lower(coalesce(f.title,'')) ~
  '(hinojosa|whitmire|houston|hpd|harrison|governor|abbott|public defender|chief investigator|odessa|mcm grande|santiago valencia|arlington|texas veterans day parade|canyon ranch|largest spa|kimpton|the meuse|bludorn|mallard|ducks?|texas biomed|texas biomedical|texas lutheran|tlu bulldogs|cowboys|colts|texans|chargers|nehomar|ochoa|volleyball|archdiocese|diane day|ida mae ford|peaceful small towns)'
)
UPDATE public.texas_news_feed f
SET target_site = proposed.destination[1],
    target_section = proposed.destination[2]
FROM proposed
WHERE f.id = proposed.id AND proposed.destination IS NOT NULL
 AND (f.target_site IS DISTINCT FROM proposed.destination[1]
      OR f.target_section IS DISTINCT FROM proposed.destination[2])
 AND f.internal_slug IS NULL AND f.texasdefined_slug IS NULL
 AND coalesce((f.viral_signals->>'routing_lock')::boolean,false) = false;

-- Exact-route positive and negative controls reject accidental broad capture.
DO $assert$
DECLARE
  actual text[];
BEGIN
  SELECT public.nov9_flyover_story_destination('Hinojosa asks for pause on state park land sale to SpaceX',NULL) INTO actual;
  IF actual IS DISTINCT FROM ARRAY['keeptxred','Politics'] THEN RAISE EXCEPTION 'political park sale routing failed: %',actual; END IF;
  SELECT public.nov9_flyover_story_destination('Texas Veterans Day Parade in Arlington to celebrate those who served',NULL) INTO actual;
  IF actual IS DISTINCT FROM ARRAY['texasdefined','Events'] THEN RAISE EXCEPTION 'Arlington event routing failed: %',actual; END IF;
  SELECT public.nov9_flyover_story_destination('Canyon Ranch Austin Opens With the Largest Spa in Texas',NULL) INTO actual;
  IF actual IS DISTINCT FROM ARRAY['texasdefined','Explore'] THEN RAISE EXCEPTION 'Spa routing failed: %',actual; END IF;
  SELECT public.nov9_flyover_story_destination('UTEP study finds mallard genetic diversity declining',NULL) INTO actual;
  IF actual IS DISTINCT FROM ARRAY['texasdefined','Explore'] THEN RAISE EXCEPTION 'Mallard routing failed: %',actual; END IF;
  SELECT public.nov9_flyover_story_destination('Archdiocese of San Antonio marks 100 years with centennial Mass',NULL) INTO actual;
  IF actual IS DISTINCT FROM ARRAY['texasdefined','History'] THEN RAISE EXCEPTION 'Culture centennial routing failed: %',actual; END IF;
  SELECT public.nov9_flyover_story_destination('Texas Lutheran football honors teammates and clinches SCAC championship',NULL) INTO actual;
  IF actual IS DISTINCT FROM ARRAY['texasdefined','Sports'] THEN RAISE EXCEPTION 'TLU sports routing failed: %',actual; END IF;
  SELECT public.nov9_flyover_story_destination('Texas Lutheran students killed in crash near Seguin',NULL) INTO actual;
  IF actual IS NOT NULL THEN RAISE EXCEPTION 'Crime/accident exclusion failed: %',actual; END IF;
  SELECT public.nov9_flyover_story_destination('National dog breed rankings revealed',NULL) INTO actual;
  IF actual IS NOT NULL THEN RAISE EXCEPTION 'National dogs exclusion failed: %',actual; END IF;
  SELECT public.nov9_flyover_story_destination('Canyon Ranch faces tax subsidy investigation',NULL) INTO actual;
  IF actual IS NOT NULL THEN RAISE EXCEPTION 'Legal spa exclusion failed: %',actual; END IF;
END $assert$;

COMMENT ON FUNCTION public.nov9_flyover_story_destination(text,text)
 IS 'Nov 9 2026 source-independent Texas story ownership. Does not grant article readiness, bypass source checks or authorize publication.';
