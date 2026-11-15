-- November 15: the actual Nov14 private-operator/public-parkland sale report
-- was incorrectly classified as TexasDefined Explore / AUTO_PUBLISH.
-- Preserve source evidence and rights: source and publication dates are untouched.
-- This narrow final guard must run AFTER the other feed routing guards.
-- It only touches unpublished, unlocked items. No permissions are widened.

CREATE OR REPLACE FUNCTION private.is_spacex_public_land_transaction(headline text)
RETURNS boolean
LANGUAGE sql IMMUTABLE
SET search_path = public
AS $rule$
  SELECT
    lower(coalesce(headline,'')) ~ '(spacex|starbase|boca chica)'
    AND lower(coalesce(headline,'')) ~
      '(public parkland|public park land|public land|state park land|parkland sale|park land sale)'
    AND lower(coalesce(headline,'')) ~
      '(sale|sell|buy|purchas|leas|acquir|eyeing|eyes|consider|pause|deal|transfer)';
$rule$;

CREATE OR REPLACE FUNCTION public.guard_spacex_public_land_disposition()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $guard$
BEGIN
  IF NEW.internal_slug IS NOT NULL OR NEW.texasdefined_slug IS NOT NULL
     OR coalesce((NEW.viral_signals->>'routing_lock')::boolean,false)
  THEN RETURN NEW; END IF;

  IF NOT private.is_spacex_public_land_transaction(NEW.title)
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
$guard$;

DROP TRIGGER IF EXISTS zzzzzzzzzzzzzzzzzzz_guard_spacex_public_land_disposition ON public.texas_news_feed;
CREATE TRIGGER zzzzzzzzzzzzzzzzzzz_guard_spacex_public_land_disposition
BEFORE INSERT OR UPDATE OF title, description, source, trend_source, target_site, target_section, viral_signals
ON public.texas_news_feed
FOR EACH ROW EXECUTE FUNCTION public.guard_spacex_public_land_disposition();

-- Backfill only this exact headline class, in the recent, unlocked and
-- unpublished candidate window. Existing published URLs remain immutable.
UPDATE public.texas_news_feed f
SET target_site = 'keeptxred',
    target_section = 'Politics',
    ready_for_rewrite = false,
    viral_signals = coalesce(f.viral_signals,'{}'::jsonb)
      || jsonb_build_object(
        'auto_publish_eligible',false,
        'editorial_lane','REVIEW',
        'post_rewrite_review_required',true,
        'post_rewrite_review_reason','Public parkland disposition needs original legal and agency evidence; no auto publication',
        'two_site_owner_guard','KTR'
      )
WHERE f.created_at >= timestamptz '2026-11-01T00:00:00Z'
  AND f.target_site IN ('texasdefined','keeptxred')
  AND f.internal_slug IS NULL
  AND f.texasdefined_slug IS NULL
  AND coalesce((f.viral_signals->>'routing_lock')::boolean,false) = false
  AND private.is_spacex_public_land_transaction(f.title)
  AND (
    f.target_site IS DISTINCT FROM 'keeptxred'
    OR f.target_section IS DISTINCT FROM 'Politics'
    OR f.ready_for_rewrite IS DISTINCT FROM false
    OR f.viral_signals->>'auto_publish_eligible' IS DISTINCT FROM 'false'
    OR f.viral_signals->>'post_rewrite_review_required' IS DISTINCT FROM 'true'
  );

DO $assert$
DECLARE title text;
DECLARE failing integer;
BEGIN
  FOREACH title IN ARRAY ARRAY[
    'SpaceX confirms it’s eyeing public parkland, but says it won’t buy Boca Chica Beach',
    'Hinojosa asks for pause on state park land sale to SpaceX',
    'Texas considers leasing public land near Starbase',
    'Boca Chica public parkland transfer to SpaceX draws questions'
  ] LOOP
    IF private.is_spacex_public_land_transaction(title) IS DISTINCT FROM true
    THEN RAISE EXCEPTION 'Public land politics not held: %', title; END IF;
  END LOOP;

  FOREACH title IN ARRAY ARRAY[
    'Starship launch targeted for November 13 at Starbase',
    'Boca Chica Beach reopens with updated public access hours',
    'Texas state park expands public wildlife viewing land',
    'SpaceX opens private launchpad visitor information page'
  ] LOOP
    IF private.is_spacex_public_land_transaction(title) IS DISTINCT FROM false
    THEN RAISE EXCEPTION 'Normal TexasDefined visitor topic blocked: %', title; END IF;
  END LOOP;

  SELECT count(*) INTO failing
  FROM public.texas_news_feed f
  WHERE f.created_at >= timestamptz '2026-11-01T00:00:00Z'
    AND f.internal_slug IS NULL AND f.texasdefined_slug IS NULL
    AND coalesce((f.viral_signals->>'routing_lock')::boolean,false)=false
    AND private.is_spacex_public_land_transaction(f.title)
    AND (f.target_site IS DISTINCT FROM 'keeptxred'
      OR f.target_section IS DISTINCT FROM 'Politics'
      OR f.ready_for_rewrite IS DISTINCT FROM false
      OR f.viral_signals->>'auto_publish_eligible' IS DISTINCT FROM 'false'
      OR f.viral_signals->>'post_rewrite_review_required' IS DISTINCT FROM 'true');
  IF failing > 0
  THEN RAISE EXCEPTION 'Public parkland transaction review policy not fully applied: %', failing; END IF;
END
$assert$;
