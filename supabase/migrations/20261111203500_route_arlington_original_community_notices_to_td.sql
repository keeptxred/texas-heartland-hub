-- November 11, 2026 independent Arlington first-party source routing correction.
-- The new dated official-index collector (#3686) proved four real city stories.
-- Three are nonpolitical local-community items and are NOT KTR politics/news.
-- Keep every original source link, publication date, quality gate, routing
-- lock and preexisting published URL. A listing snippet without an original
-- source body is NOT authority content and must never gain rewrite readiness.

CREATE OR REPLACE FUNCTION public.route_arlington_official_lifestyle_post_guard()
RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $function$
DECLARE t text := lower(coalesce(new.title,''));
BEGIN
  IF new.source='City of Arlington — Original News'
    AND new.link ~ '^https://www\.arlingtontx\.gov/News-Articles/20[0-9]{2}/[A-Za-z]+/'
    AND t LIKE '%arlington%'
    AND (t ~ 'board game earns two awards'
      OR t ~ 'digital media friendly texas certification'
      OR t ~ 'donate children.s coats, hats and gloves at arlington fire stations')
    AND t !~ '(murder|shoot|indict|arrest|legislat|budget|city council|lawsuit|investigation|tax increase)'
    AND new.internal_slug IS NULL AND new.texasdefined_slug IS NULL
    AND coalesce((new.viral_signals->>'routing_lock')::boolean,false)=false
  THEN
    new.target_site:='texasdefined';
    new.target_section:='Texas Life';
    -- Keep this an unpublished discovery pointer. A future original full text
    -- will still face the unchanged source/hydration, author, image, 750-word,
    -- canonicals and protected owner publication rules of TexasDefined.
    IF length(coalesce(new.extracted_body,'')) < 2200 THEN
      new.ready_for_rewrite:=false;
    END IF;
  END IF;
  RETURN new;
END
$function$;

-- Runs after the generic political and source-quality owner routers. This
-- strictly DOWNGRADES publication readiness when original evidence is absent;
-- it never promotes an unreviewed story. Same-source political/legal reports
-- are negative controls by exact title and keywords.
DROP TRIGGER IF EXISTS zzzzzzzzzzzzzzzzzz_route_arlington_official_lifestyle ON public.texas_news_feed;
CREATE TRIGGER zzzzzzzzzzzzzzzzzz_route_arlington_official_lifestyle
BEFORE INSERT OR UPDATE ON public.texas_news_feed
FOR EACH ROW EXECUTE FUNCTION public.route_arlington_official_lifestyle_post_guard();

-- Bounded, exact, original-source backfill of three newly ingested city items.
-- Explicit false guards against the ordinary routing-quality triggers making
-- a headline-only source eligible to rewrite on a route-only UPDATE.
UPDATE public.texas_news_feed
   SET target_site='texasdefined', target_section='Texas Life', ready_for_rewrite=false
 WHERE id IN (6940681,6940682,6940683)
   AND source='City of Arlington — Original News'
   AND internal_slug IS NULL AND texasdefined_slug IS NULL
   AND coalesce((viral_signals->>'routing_lock')::boolean,false)=false
   AND length(coalesce(extracted_body,'')) < 2200;

DO $assert$
DECLARE correctly_routed integer; golf_unchanged integer; politics_unchanged integer;
BEGIN
  SELECT count(*) INTO correctly_routed FROM public.texas_news_feed
   WHERE id IN (6940681,6940682,6940683)
     AND target_site='texasdefined' AND target_section='Texas Life'
     AND ready_for_rewrite=false
     AND internal_slug IS NULL AND texasdefined_slug IS NULL
     AND source='City of Arlington — Original News';
  IF correctly_routed<>3 THEN
    RAISE EXCEPTION 'Arlington first-party community routing wrong: %/3', correctly_routed;
  END IF;
  SELECT count(*) INTO golf_unchanged FROM public.texas_news_feed WHERE id=6940684
    AND target_site='texasdefined' AND target_section='Sports';
  IF golf_unchanged<>1 THEN
    RAISE EXCEPTION 'Arlington original sports article route changed unexpectedly';
  END IF;
  SELECT count(*) INTO politics_unchanged FROM public.texas_news_feed WHERE id=6889910
    AND target_site='keeptxred' AND target_section='Politics';
  IF politics_unchanged<>1 THEN
    RAISE EXCEPTION 'Governor-elect regulatory park-sale news route changed unexpectedly';
  END IF;
END $assert$;
