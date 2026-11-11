-- Restore Nov 9 Flyover nonpolitical biomedical research ownership only.
-- Production read-only audit 2026-11-11: original first-party source story
-- "Texas Biomed implements first-ever therapy development strategy to combat
-- expanding Ebola outbreak" (link on txbiomed.org) was misrouted to
-- KeepTXRed Business instead of TexasDefined Texas Life. Prior November 9
-- helper handled the original tuberculosis grant but not Ebola/preclinical
-- biomedical research. Distinguish research from regulation, lawsuits or
-- government health-policy actions. This is ownership-only, never approval.
--
-- Replaces the existing pure deterministic classifier in-place. The original
-- downstream trigger, ownership locks and editorial/publication gates remain.

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

-- Repair only the exact original-publisher row when unpublished and unlocked.
-- No readiness flags, slugs, source scores, images or publication records change.
UPDATE public.texas_news_feed
SET target_site='texasdefined', target_section='Texas Life'
WHERE link = 'https://www.txbiomed.org/news-press/news/texas-biomed-implements-first-ever-therapy-development-strategy-to-combat-ebola/'
  AND lower(title) = lower('Texas Biomed implements first-ever therapy development strategy to combat expanding Ebola outbreak')
  AND internal_slug IS NULL AND texasdefined_slug IS NULL
  AND coalesce((viral_signals->>'routing_lock')::boolean,false)=false
  AND (target_site,target_section) IS DISTINCT FROM ('texasdefined','Texas Life');

DO $assert$
DECLARE a text[];
BEGIN
  SELECT public.nov9_flyover_story_destination('Texas Biomed implements first-ever therapy development strategy to combat expanding Ebola outbreak',NULL) INTO a;
  IF a IS DISTINCT FROM ARRAY['texasdefined','Texas Life']
  THEN RAISE EXCEPTION 'Verified first-party Ebola research misrouted: %',a; END IF;
  SELECT public.nov9_flyover_story_destination('Texas Biomed awarded grant for tuberculosis research',NULL) INTO a;
  IF a IS DISTINCT FROM ARRAY['texasdefined','Texas Life']
  THEN RAISE EXCEPTION 'Existing tuberculosis research route regressed: %',a; END IF;
  SELECT public.nov9_flyover_story_destination('Texas Biomed faces government regulatory investigation into funding',NULL) INTO a;
  IF a IS NOT NULL
  THEN RAISE EXCEPTION 'Government/legal negative control misrouted: %',a; END IF;
  SELECT public.nov9_flyover_story_destination('Hinojosa asks for pause on state park land sale to SpaceX',NULL) INTO a;
  IF a IS DISTINCT FROM ARRAY['keeptxred','Politics']
  THEN RAISE EXCEPTION 'Government/park priority regressed: %',a; END IF;
END $assert$;

COMMENT ON FUNCTION public.nov9_flyover_story_destination(text,text)
IS 'November 9 2026 independent source routing, including first-party nonpolitical biomedical research. Ownership-only; no article approvals.';
