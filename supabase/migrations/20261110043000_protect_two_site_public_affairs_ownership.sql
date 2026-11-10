-- Two-site newsroom ownership correction for misrouted, unpublished government
-- action and criminal/legal news in the TexasDefined publication-ready queue.
-- Narrow rule, never accept a discovery publisher as factual corroboration.
-- Do not publish, create new URLs, reset manual locks or override prior articles.
CREATE OR REPLACE FUNCTION public.high_confidence_public_affairs_section(headline text)
RETURNS text
LANGUAGE sql IMMUTABLE
SET search_path = public
AS $function$
  SELECT CASE
    WHEN lower(coalesce(headline,'')) ~
      '(district attorney|county attorney|prosecutor|(^|[^a-z])da([^a-z]|$))'
      AND lower(coalesce(headline,'')) ~
      '(recus|investigat|indict|charges|criminal case|fraud|lawsuit|prosecut)'
      THEN 'Texas News'
    WHEN lower(coalesce(headline,'')) ~
      '(fbi (raids?|search|agents?)|wire fraud|ponzi scheme|sentenced|pleads? guilty|indicted|charged with)'
      THEN 'Texas News'
    WHEN lower(coalesce(headline,'')) ~
      '(city council|county commissioners?|commissioners court|school board)'
      AND lower(coalesce(headline,'')) ~
      '(approv|propos|vote|budget|zon|ordinance|contract|restrictions?|recus)'
      THEN 'Texas News'
    WHEN lower(coalesce(headline,'')) ~
      '(^|[^a-z])(houston|dallas|austin|san antonio|el paso|fort worth|arlington|lubbock) (considers?|approves?|adopts?|proposes?|enacts?) (new )?(restrictions?|regulations?|ordinance|zoning|ban|budget|tax)'
      THEN 'Texas News'
    WHEN lower(coalesce(headline,'')) ~
      '(^|[^a-z])metro (approves?|adopts?|votes?|proposes?)'
      AND lower(coalesce(headline,'')) ~
      '(\$|million|billion|budget|spending|funding|capital plan|roads|sidewalks)'
      THEN 'Texas News'
    ELSE NULL
  END
$function$;

CREATE OR REPLACE FUNCTION public.enforce_two_site_public_affairs_ownership()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE section text;
BEGIN
  IF new.target_site IS DISTINCT FROM 'texasdefined'
    OR new.internal_slug IS NOT NULL OR new.texasdefined_slug IS NOT NULL
    OR coalesce((new.viral_signals->>'routing_lock')::boolean,false)
  THEN RETURN new; END IF;

  section := public.high_confidence_public_affairs_section(new.title);
  IF section IS NULL THEN RETURN new; END IF;

  new.target_site := 'keeptxred';
  new.target_section := section;
  -- This is a publication hold while claims, primary court documents and
  -- editorial ownership are reviewed; it does not remove feed source evidence.
  new.viral_signals := coalesce(new.viral_signals,'{}'::jsonb) ||
      jsonb_build_object(
        'auto_publish_eligible',false,
        'editorial_lane','REVIEW',
        'post_rewrite_review_required',true,
        'post_rewrite_review_reason','Government, legal or public-funding action requires original-source editorial review',
        'two_site_owner_guard','KTR'
      );
  RETURN new;
END
$function$;

DROP TRIGGER IF EXISTS zzzzzzzzzzzzzzz_guard_two_site_public_affairs ON public.texas_news_feed;
-- Lexical order AFTER existing sports and other ownership triggers.
CREATE TRIGGER zzzzzzzzzzzzzzz_guard_two_site_public_affairs
BEFORE INSERT OR UPDATE OF title, description, source, trend_source, target_site, target_section, viral_signals
ON public.texas_news_feed
FOR EACH ROW EXECUTE FUNCTION public.enforce_two_site_public_affairs_ownership();

-- Only previously misrouted, unpublished/unlocked items in the recent window;
-- material target-site change ensures the routing trigger fires.
UPDATE public.texas_news_feed f
SET target_site = 'keeptxred', target_section = 'Texas News'
WHERE f.created_at >= timestamptz '2026-10-20T00:00:00Z'
  AND f.target_site = 'texasdefined'
  AND f.internal_slug IS NULL AND f.texasdefined_slug IS NULL
  AND coalesce((f.viral_signals->>'routing_lock')::boolean,false) = false
  AND public.high_confidence_public_affairs_section(f.title) IS NOT NULL;

-- Verify real problem cases and benign negatives in the transaction.
DO $assert$
DECLARE phrase text;
BEGIN
  FOREACH phrase IN ARRAY ARRAY[
    'Bexar County DA Joe Gonzales seeks to recuse himself from Neil Calfas case',
    'El Paso mayor''s brother sentenced for wire fraud in NBA Ponzi scheme',
    'FBI raids Midlothian oil and gas business facing fraud lawsuits',
    'Houston considers restrictions on gas stations near residential neighborhoods',
    'METRO approves $40 million plan to repair roads, sidewalks along bus routes',
    'City council approves zoning changes in city neighborhoods'
  ] LOOP
    IF public.high_confidence_public_affairs_section(phrase) IS DISTINCT FROM 'Texas News' THEN
      RAISE EXCEPTION 'Public-affairs ownership test failed: %', phrase;
    END IF;
  END LOOP;

  FOREACH phrase IN ARRAY ARRAY[
    'McKinney National Airport announces flights to Fort Myers',
    'Starship launch at Starbase scheduled for November 13',
    'Holly Hop Ice Cream Shoppe closes after 18 years',
    'Houston Museum of Natural Science offers free meteorite exhibit',
    'Texas college football playoff pairings announced',
    'METRO riders plan weekend museum trip'
  ] LOOP
    IF public.high_confidence_public_affairs_section(phrase) IS NOT NULL THEN
      RAISE EXCEPTION 'Benign TexasDefined ownership exclusion failed: %', phrase;
    END IF;
  END LOOP;
END $assert$;

COMMENT ON FUNCTION public.enforce_two_site_public_affairs_ownership()
IS 'Final guard preventing unpublished high-confidence crime/litigation/government budget headlines from entering TexasDefined automatic-publication ownership; preserves manual locks, original evidence, and publication quality gates.';
