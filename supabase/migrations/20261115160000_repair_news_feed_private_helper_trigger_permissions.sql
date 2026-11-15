-- Restore shared newsroom ingest while preserving private-schema isolation.
-- Live pg_net 2026-11-15: ingest-feeds returned HTTP 500 / Postgres 42501,
-- "permission denied for schema private", on every batched INSERT.
-- Two public BEFORE INSERT trigger functions called private SQL helpers
-- as service_role, which (correctly) has no USAGE on private.
-- Inline their exact immutable title predicates instead of granting broad
-- private schema access, using SECURITY DEFINER, or relaxing editorial holds.
-- Existing private helper functions remain available to privileged callers.

CREATE OR REPLACE FUNCTION public.guard_local_fatal_crime_fire_owner()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.internal_slug IS NOT NULL OR NEW.texasdefined_slug IS NOT NULL
    OR coalesce((NEW.viral_signals->>'routing_lock')::boolean,false)
  THEN RETURN NEW; END IF;
  IF NOT (
    (
      lower(coalesce(NEW.title,'')) ~ '(shot|shooting|stabbed|stabbing)'
      AND lower(coalesce(NEW.title,'')) ~ '(robbed|robbery)'
      AND lower(coalesce(NEW.title,'')) ~ '(dallas|irving|fort worth|arlington|houston|austin|texas|san antonio)'
    ) OR (
      lower(coalesce(NEW.title,'')) ~ '(killed|dead|died|fatal)'
      AND lower(coalesce(NEW.title,'')) ~ '(house fire|apartment fire|residential fire)'
      AND lower(coalesce(NEW.title,'')) ~ '(fire officials|fire department|firefighters|dallas|irving|texas)'
    )
  )
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
$function$;

CREATE OR REPLACE FUNCTION public.guard_spacex_public_land_disposition()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.internal_slug IS NOT NULL OR NEW.texasdefined_slug IS NOT NULL
     OR coalesce((NEW.viral_signals->>'routing_lock')::boolean,false)
  THEN RETURN NEW; END IF;

  IF NOT (
    lower(coalesce(NEW.title,'')) ~ '(spacex|starbase|boca chica)'
    AND lower(coalesce(NEW.title,'')) ~ '(public parkland|public park land|public land|state park land|state park|parkland sale|park land sale|parkland purchase)'
    AND lower(coalesce(NEW.title,'')) ~ '(sale|sell|selling|sold|buy|buying|bought|purchas|leas|acquir|eyeing|eyes|consider|pause|deal|trade|transfer)'
  )
  THEN RETURN NEW; END IF;

  NEW.target_site := 'keeptxred';
  NEW.target_section := 'Politics';
  NEW.ready_for_rewrite := false;
  NEW.viral_signals := coalesce(NEW.viral_signals,'{}'::jsonb)
    || jsonb_build_object(
      'auto_publish_eligible',false,
      'editorial_lane','REVIEW',
      'post_rewrite_review_required',true,
      'post_rewrite_review_reason','Public parkland disposition needs original legal and agency evidence; no auto publication',
      'two_site_owner_guard','KTR'
    );
  RETURN NEW;
END
$function$;


DO $newsroom_private_check$
BEGIN
  IF position('private.' IN pg_get_functiondef('public.guard_local_fatal_crime_fire_owner()'::regprocedure)) > 0
    OR position('private.' IN pg_get_functiondef('public.guard_spacex_public_land_disposition()'::regprocedure)) > 0
  THEN RAISE EXCEPTION 'News ingest role-private helper dependency not removed'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid='public.texas_news_feed'::regclass
    AND tgname='zzzzzzzzzzzzzzzzzzzz_guard_local_fatal_crime_fire' AND tgenabled='O')
    OR NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid='public.texas_news_feed'::regclass
    AND tgname='zzzzzzzzzzzzzzzzzzz_guard_spacex_public_land_disposition' AND tgenabled='O')
  THEN RAISE EXCEPTION 'Expected safety trigger missing or disabled'; END IF;
END $newsroom_private_check$;
