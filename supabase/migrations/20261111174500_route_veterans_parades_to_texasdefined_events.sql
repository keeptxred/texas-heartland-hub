-- Nov 11 2026 Flyover event-destination recovery.
-- The existing Nov 9 helper handled only Arlington, leaving independently
-- sourced Houston, El Paso, Killeen and Amarillo Veterans Day parade
-- notices on KTR or review/Unclassified. These belong in TexasDefined
-- recurring event coverage, NOT thin daily news copies. This is route-only;
-- existing feed evidence, editorial review, time expiry, locks and quality
-- guards remain unchanged. No auto publishing or index requests.

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
  -- A parade/commemoration logistics story is a nonpolitical event listing
  -- even when the venue is Houston, Amarillo, Killeen or El Paso. Do not
  -- capture violence, legal process or public-safety incident reports.
  ELSIF t ~ '(veterans? day|veteran.s day)' AND
        t ~ '(parade|ceremon(y|ies)|commemorat|celebrat)' AND
        t !~ '(shoot|arrest|crash|lawsuit|indict|fatal|killed|police investigation|threat|bomb)' THEN
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
        t ~ '(tuberculosis|\mtb\M|host.directed|grant|research|ebola|virus|vaccine|therapy|therapeutic|infectious disease|biodefense)' AND
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

WITH proposed AS MATERIALIZED (
  SELECT id, public.nov9_flyover_story_destination(title,description) as destination
  FROM public.texas_news_feed
  WHERE created_at >= timestamptz '2026-11-01T00:00:00Z'
    AND lower(coalesce(title,'')) ~ '(veterans? day|veteran.s day)'
    AND internal_slug IS NULL AND texasdefined_slug IS NULL
    AND coalesce((viral_signals->>'routing_lock')::boolean,false) = false
)
UPDATE public.texas_news_feed f
  SET target_site = 'texasdefined', target_section = 'Events'
FROM proposed p
WHERE f.id=p.id AND p.destination=ARRAY['texasdefined','Events']
  AND (f.target_site,f.target_section) IS DISTINCT FROM ('texasdefined','Events')
  AND f.internal_slug IS NULL AND f.texasdefined_slug IS NULL
  AND coalesce((f.viral_signals->>'routing_lock')::boolean,false) = false;

DO $assert$
DECLARE a text[];
BEGIN
  SELECT public.nov9_flyover_story_destination('Houston Veterans Day parade returns Wednesday: route, schedule and road closures',NULL) INTO a;
  IF a IS DISTINCT FROM ARRAY['texasdefined','Events'] THEN RAISE EXCEPTION 'Houston event route: %',a; END IF;
  SELECT public.nov9_flyover_story_destination('Honor all who served at Veterans Day parade, ceremony',NULL) INTO a;
  IF a IS DISTINCT FROM ARRAY['texasdefined','Events'] THEN RAISE EXCEPTION 'El Paso event route: %',a; END IF;
  SELECT public.nov9_flyover_story_destination('Annual Veterans Day parade returns to downtown Amarillo',NULL) INTO a;
  IF a IS DISTINCT FROM ARRAY['texasdefined','Events'] THEN RAISE EXCEPTION 'Amarillo event route: %',a; END IF;
  SELECT public.nov9_flyover_story_destination('Veterans Day parade crash killed two pedestrians, police investigation',NULL) INTO a;
  IF a IS NOT NULL THEN RAISE EXCEPTION 'Public-safety event negative control: %',a; END IF;
  SELECT public.nov9_flyover_story_destination('Texas Biomed implements first-ever therapy development strategy to combat expanding Ebola outbreak',NULL) INTO a;
  IF a IS DISTINCT FROM ARRAY['texasdefined','Texas Life'] THEN RAISE EXCEPTION 'Biomed regression: %',a; END IF;
  SELECT public.nov9_flyover_story_destination('Hinojosa asks for pause on state park land sale to SpaceX',NULL) INTO a;
  IF a IS DISTINCT FROM ARRAY['keeptxred','Politics'] THEN RAISE EXCEPTION 'Politics priority regression: %',a; END IF;
END $assert$;
