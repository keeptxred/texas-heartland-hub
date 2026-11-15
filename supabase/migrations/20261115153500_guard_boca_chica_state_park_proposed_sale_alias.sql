-- Extend the already-deployed 20261115145500 public-parkland disposition
-- guard to the actual Nov. 13 syndicated Texas Tribune headline.
-- It says "buy Boca Chica State Park", not "public parkland", and slipped
-- through both existing word-order guards. This is a new migration: never
-- edit the already applied historical migration. No publishing approval.
CREATE OR REPLACE FUNCTION private.is_spacex_public_land_transaction(headline text)
RETURNS boolean
LANGUAGE sql IMMUTABLE
SET search_path = public
AS $rule$
  SELECT lower(coalesce(headline,'')) ~ '(spacex|starbase|boca chica)'
     AND lower(coalesce(headline,'')) ~
       '(public parkland|public park land|public land|state park land|state park|parkland sale|park land sale|parkland purchase)'
     AND lower(coalesce(headline,'')) ~
       '(sale|sell|selling|buy|buying|bought|purchas|leas|acquir|eyeing|eyes|consider|pause|deal|trade|transfer)';
$rule$;

-- The zzz... BEFORE INSERT/UPDATE guard from 20261115145500 invokes the
-- function at execution time, so updated definition immediately protects
-- future original-source ingestion. Backfill only unlocked/unpublished
-- references, without touching dates, publisher links, article copy or slugs.
UPDATE public.texas_news_feed f
SET target_site='keeptxred',
    target_section='Politics',
    ready_for_rewrite=false,
    viral_signals=coalesce(f.viral_signals,'{}'::jsonb) ||
      jsonb_build_object(
        'auto_publish_eligible',false,
        'editorial_lane','REVIEW',
        'post_rewrite_review_required',true,
        'post_rewrite_review_reason','Public state park disposition to private operator requires original agency evidence and manual review',
        'two_site_owner_guard','KTR')
WHERE f.created_at >= timestamptz '2026-11-01T00:00:00Z'
  AND f.internal_slug IS NULL
  AND f.texasdefined_slug IS NULL
  AND coalesce((f.viral_signals->>'routing_lock')::boolean,false)=false
  AND private.is_spacex_public_land_transaction(f.title)
  AND (
    f.target_site IS DISTINCT FROM 'keeptxred'
    OR f.target_section IS DISTINCT FROM 'Politics'
    OR f.ready_for_rewrite IS DISTINCT FROM false
    OR f.viral_signals->>'auto_publish_eligible' IS DISTINCT FROM 'false'
    OR f.viral_signals->>'post_rewrite_review_required' IS DISTINCT FROM 'true'
  );

DO $assert$
DECLARE t text; wrong integer;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'SpaceX reveals details on its proposal to buy Boca Chica State Park',
    'SpaceX confirms it’s eyeing public parkland, but says it won’t buy Boca Chica Beach',
    'Hinojosa asks for pause on state park land sale to SpaceX',
    'Boca Chica state park sold to Starbase for expansion'
  ] LOOP
    IF private.is_spacex_public_land_transaction(t) IS DISTINCT FROM true
    THEN RAISE EXCEPTION 'Unprotected public state park transaction: %', t; END IF;
  END LOOP;
  FOREACH t IN ARRAY ARRAY[
    'Starship launch planned near Boca Chica State Park',
    'Boca Chica State Park public beach access hours updated',
    'State park offers new family wildlife tours',
    'SpaceX announces new Texas visitor museum'
  ] LOOP
    IF private.is_spacex_public_land_transaction(t) IS DISTINCT FROM false
    THEN RAISE EXCEPTION 'Visitor coverage falsely blocked: %', t; END IF;
  END LOOP;
  SELECT count(*) INTO wrong FROM public.texas_news_feed f
  WHERE f.id IN (6965926,6965933)
    AND (f.target_site IS DISTINCT FROM 'keeptxred'
      OR f.target_section IS DISTINCT FROM 'Politics'
      OR f.ready_for_rewrite IS DISTINCT FROM false
      OR f.viral_signals->>'auto_publish_eligible' IS DISTINCT FROM 'false'
      OR f.viral_signals->>'post_rewrite_review_required' IS DISTINCT FROM 'true'
      OR f.internal_slug IS NOT NULL OR f.texasdefined_slug IS NOT NULL);
  IF wrong > 0 THEN
    RAISE EXCEPTION 'Nov13 Boca Chica official-sale aliases not safely held: %', wrong;
  END IF;
END
$assert$;
