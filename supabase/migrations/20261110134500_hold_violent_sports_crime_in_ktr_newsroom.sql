-- A football setting does not make assault allegations a lifestyle sports story.
-- Keep verified hard-news reporting in KTR and require editorial review.
CREATE OR REPLACE FUNCTION public.guard_violent_athletic_incident_ownership()
RETURNS trigger LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE t text := lower(coalesce(new.title,''));
BEGIN
  IF new.internal_slug IS NOT NULL OR new.texasdefined_slug IS NOT NULL
     OR coalesce((new.viral_signals->>'routing_lock')::boolean,false)
  THEN RETURN new; END IF;

  IF t ~ '(police say|police said|according to police|police report)'
     AND t ~ '(strangl|assault|attack|stabb|shoot|violent|injur)'
     AND t ~ '(football|basketball|sports?|game|player|athlete|high school)'
  THEN
     new.target_site := 'keeptxred';
     new.target_section := 'Texas News';
     new.viral_signals := coalesce(new.viral_signals,'{}'::jsonb)
       || jsonb_build_object('auto_publish_eligible',false,
         'editorial_lane','REVIEW','post_rewrite_review_required',true,
         'post_rewrite_review_reason','Alleged crime at sports event requires primary police records and independent editorial verification');
  END IF;
  RETURN new;
END;
$function$;

DROP TRIGGER IF EXISTS zzzzzzzzzzzzzzzz_guard_violent_athletic_incident ON public.texas_news_feed;
CREATE TRIGGER zzzzzzzzzzzzzzzz_guard_violent_athletic_incident
BEFORE INSERT OR UPDATE OF title,description,target_site,viral_signals
ON public.texas_news_feed FOR EACH ROW
EXECUTE FUNCTION public.guard_violent_athletic_incident_ownership();

-- Bounded, unpublished, explicitly identified source; no published URL changed.
UPDATE public.texas_news_feed SET target_site='keeptxred',target_section='Texas News'
WHERE id=6907276
AND internal_slug IS NULL AND texasdefined_slug IS NULL
AND coalesce((viral_signals->>'routing_lock')::boolean,false)=false
AND lower(title) ~ '(police say|police said)'
AND lower(title) ~ 'strangl';

DO $assert$
BEGIN
 IF EXISTS (SELECT 1 FROM public.texas_news_feed
   WHERE id=6907276 AND (target_site<>'keeptxred'
   OR viral_signals->>'auto_publish_eligible' IS DISTINCT FROM 'false'
   OR viral_signals->>'editorial_lane' IS DISTINCT FROM 'REVIEW'
   OR viral_signals->>'post_rewrite_review_required' IS DISTINCT FROM 'true'))
 THEN RAISE EXCEPTION 'Criminal football incident still misrouted or unreviewed'; END IF;
END $assert$;
