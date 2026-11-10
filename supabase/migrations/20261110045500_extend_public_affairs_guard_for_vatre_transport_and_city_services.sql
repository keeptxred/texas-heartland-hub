-- Add narrow public-affairs topics found in the first live TD source hydration run.
-- No publication, no privilege widening, no quality bypass.
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
    WHEN lower(coalesce(headline,'')) ~
      '(^|[^a-z])(vatre|voter.approved tax rate election|commissioners race results)([^a-z]|$)'
      THEN 'Elections'
    WHEN lower(coalesce(headline,'')) ~
      '(^|[^a-z])(nhtsa|national highway traffic safety administration)([^a-z]|$)'
      AND lower(coalesce(headline,'')) ~ '(probing|investigat|recall|violations?|enforcement|regulat)'
      THEN 'Texas News'
    WHEN lower(coalesce(headline,'')) ~
      '(trash cans?|graffiti|park maintenance|sanitation services)'
      AND lower(coalesce(headline,'')) ~
      '(not the city|city no longer|city stops|city ending|city to stop|municipal contract|city delegates)'
      THEN 'Texas News'
    ELSE NULL
  END
$function$;

-- The pre-existing final owner trigger calls this helper; do not add an
-- additional competing trigger. Apply only to unlocked/unpublished recent
-- rows that were actually routed to TD.
UPDATE public.texas_news_feed f
SET target_site = 'keeptxred',
    target_section = public.high_confidence_public_affairs_section(f.title),
    viral_signals = coalesce(f.viral_signals,'{}'::jsonb) ||
      jsonb_build_object(
        'auto_publish_eligible',false,
        'editorial_lane','REVIEW',
        'post_rewrite_review_required',true,
        'post_rewrite_review_reason','Government, legal, elections or regulatory action requires original evidence and editorial review',
        'two_site_owner_guard','KTR'
      )
WHERE f.created_at >= timestamptz '2026-11-05T00:00:00Z'
  AND f.target_site = 'texasdefined'
  AND f.internal_slug IS NULL AND f.texasdefined_slug IS NULL
  AND coalesce((f.viral_signals->>'routing_lock')::boolean,false) = false
  AND public.high_confidence_public_affairs_section(f.title) IS NOT NULL;

DO $assert$
DECLARE example text;
BEGIN
  IF public.high_confidence_public_affairs_section('CFISD VATRE fails, ESD9 commissioners race results: 5 trending stories') <> 'Elections'
  THEN RAISE EXCEPTION 'VATRE election must belong to KTR Elections'; END IF;

  IF public.high_confidence_public_affairs_section('NHTSA probing Waymo software recall after bus violations') <> 'Texas News'
  THEN RAISE EXCEPTION 'NHTSA enforcement must belong to KTR'; END IF;

  IF public.high_confidence_public_affairs_section('Who will empty trash cans and remove graffiti at Pease Park? Not the city anymore') <> 'Texas News'
  THEN RAISE EXCEPTION 'Municipal service change must belong to KTR'; END IF;

  FOREACH example IN ARRAY ARRAY[
    'McKinney National Airport opens first commercial passenger terminal',
    'Temple High School BBQ Team qualifies for state competition',
    'SpaceX sets date for 15th Starship launch at Starbase',
    'Houston Museum of Natural Science offers free meteorite exhibit',
    'Texas college football cross-country championships',
    'Park visitors clean up litter at volunteer event'
  ] LOOP
    IF public.high_confidence_public_affairs_section(example) IS NOT NULL
    THEN RAISE EXCEPTION 'Normal TexasDefined topic must not be routed to politics: %',example; END IF;
  END LOOP;
END $assert$;
