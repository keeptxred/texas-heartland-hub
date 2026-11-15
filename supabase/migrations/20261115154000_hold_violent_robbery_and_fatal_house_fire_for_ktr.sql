-- Distinguish actual local public-safety reports from ordinary Texas sports,
-- events and visitor coverage. This follows the observed 2026-11-15
-- TexasDefined misroutes of a Dallas shooting/robbery and Irving fatal fire.
-- Preserve unpublished source evidence, bylines, times and editorial locks.
-- No article creation, original-source rewriting or permissions widening.

CREATE OR REPLACE FUNCTION private.is_texas_local_fatal_crime_or_fire(headline text)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path=public
AS $matcher$
 SELECT (
    lower(coalesce(headline,'')) ~ '(shot|shooting|stabbed|stabbing)'
    AND lower(coalesce(headline,'')) ~ '(robbed|robbery)'
    AND lower(coalesce(headline,'')) ~ '(dallas|irving|fort worth|arlington|houston|austin|texas|san antonio)'
 ) OR (
    lower(coalesce(headline,'')) ~ '(killed|dead|died|fatal)'
    AND lower(coalesce(headline,'')) ~ '(house fire|apartment fire|residential fire)'
    AND lower(coalesce(headline,'')) ~ '(fire officials|fire department|firefighters|dallas|irving|texas)'
 );
$matcher$;

CREATE OR REPLACE FUNCTION public.guard_local_fatal_crime_fire_owner()
RETURNS trigger LANGUAGE plpgsql SET search_path=public
AS $guard$
BEGIN
  IF NEW.internal_slug IS NOT NULL OR NEW.texasdefined_slug IS NOT NULL
    OR coalesce((NEW.viral_signals->>'routing_lock')::boolean,false)
  THEN RETURN NEW; END IF;
  IF NOT private.is_texas_local_fatal_crime_or_fire(NEW.title)
  THEN RETURN NEW; END IF;
  NEW.target_site := 'keeptxred';
  NEW.target_section := 'Texas News';
  NEW.ready_for_rewrite := false;
  NEW.viral_signals := coalesce(NEW.viral_signals,'{}'::jsonb)
    || jsonb_build_object(
      'editorial_lane','REVIEW',
      'auto_publish_eligible',false,
      'post_rewrite_review_required',true,
      'post_rewrite_review_reason','Victim, police or fatal-fire reporting requires independent official first-party evidence',
      'two_site_owner_guard','KTR'
    );
  RETURN NEW;
END
$guard$;

DROP TRIGGER IF EXISTS zzzzzzzzzzzzzzzzzzzz_guard_local_fatal_crime_fire ON public.texas_news_feed;
-- Lexicographically after existing site-owner, sports and SpaceX guards.
CREATE TRIGGER zzzzzzzzzzzzzzzzzzzz_guard_local_fatal_crime_fire
BEFORE INSERT OR UPDATE OF title, description, source, trend_source,
  target_site, target_section, viral_signals, ready_for_rewrite
ON public.texas_news_feed
FOR EACH ROW EXECUTE FUNCTION public.guard_local_fatal_crime_fire_owner();

UPDATE public.texas_news_feed f
SET target_site='keeptxred',target_section='Texas News',ready_for_rewrite=false,
    viral_signals=coalesce(f.viral_signals,'{}'::jsonb) ||
      jsonb_build_object(
        'editorial_lane','REVIEW','auto_publish_eligible',false,
        'post_rewrite_review_required',true,
        'post_rewrite_review_reason','Victim, police or fatal-fire reporting requires independent official first-party evidence',
        'two_site_owner_guard','KTR'
      )
WHERE f.created_at >= timestamptz '2026-11-12T00:00:00Z'
  AND f.target_site IN ('texasdefined','keeptxred')
  AND f.internal_slug IS NULL AND f.texasdefined_slug IS NULL
  AND coalesce((f.viral_signals->>'routing_lock')::boolean,false)=false
  AND private.is_texas_local_fatal_crime_or_fire(f.title)
  AND (
       f.target_site IS DISTINCT FROM 'keeptxred'
       OR f.target_section IS DISTINCT FROM 'Texas News'
       OR f.ready_for_rewrite IS DISTINCT FROM false
       OR f.viral_signals->>'editorial_lane' IS DISTINCT FROM 'REVIEW'
       OR f.viral_signals->>'auto_publish_eligible' IS DISTINCT FROM 'false'
       OR f.viral_signals->>'post_rewrite_review_required' IS DISTINCT FROM 'true'
  );

DO $assert$
DECLARE title text;
DECLARE failed int;
BEGIN
 FOREACH title IN ARRAY ARRAY[
   'Dallas man shot while being robbed, police say',
   '2 people killed in early morning house fire in Irving, fire officials say',
   'Austin man shot during robbery, police investigating',
   'Fatal Dallas apartment fire leaves people dead, firefighters say'
 ] LOOP
   IF private.is_texas_local_fatal_crime_or_fire(title) IS DISTINCT FROM true
   THEN RAISE EXCEPTION 'Local victim headline not held: %',title; END IF;
 END LOOP;
 FOREACH title IN ARRAY ARRAY[
   'Texas Tech locks in for shootout versus Oklahoma State',
   'Longhorns shot past rival in basketball title game',
   'Family friendly fire safety fair at Dallas park',
   'Irving museum hosts community firefighter history exhibition',
   'Texas college football team wins championship'
 ] LOOP
   IF private.is_texas_local_fatal_crime_or_fire(title) IS DISTINCT FROM false
   THEN RAISE EXCEPTION 'Benign sporting or visitor headline overblocked: %',title; END IF;
 END LOOP;

 SELECT count(*) INTO failed FROM public.texas_news_feed f
 WHERE f.created_at>=timestamptz '2026-11-12T00:00:00Z'
   AND f.internal_slug IS NULL AND f.texasdefined_slug IS NULL
   AND coalesce((f.viral_signals->>'routing_lock')::boolean,false)=false
   AND private.is_texas_local_fatal_crime_or_fire(f.title)
   AND (f.target_site IS DISTINCT FROM 'keeptxred'
     OR f.target_section IS DISTINCT FROM 'Texas News'
     OR f.ready_for_rewrite IS DISTINCT FROM false
     OR f.viral_signals->>'auto_publish_eligible' IS DISTINCT FROM 'false');
 IF failed>0 THEN RAISE EXCEPTION 'Uncorrected current public-safety feed rows %',failed; END IF;
END
$assert$;
