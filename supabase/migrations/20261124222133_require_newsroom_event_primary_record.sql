-- Applied in production to prevent further unverified generated newsroom inserts.
CREATE OR REPLACE FUNCTION public.guard_generated_newsroom_source_diversity()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  event_record_count integer := 0;
BEGIN
  IF NEW.kind IS DISTINCT FROM 'news' OR NEW.author IS DISTINCT FROM 'Keep TX Red Newsroom'
    OR coalesce(NEW.body_json->'authority'->>'generatedFromResearchPacket','false') <> 'true' THEN
    RETURN NEW;
  END IF;
  SELECT count(*) INTO event_record_count
  FROM public.news_research_packets p
  CROSS JOIN LATERAL jsonb_array_elements(coalesce(p.packet_json->'sources','[]'::jsonb)) s
  WHERE p.cluster_id::text = NEW.body_json->'authority'->>'storyClusterId'
    AND s->>'isPrimarySource' = 'true'
    AND length(trim(coalesce(nullif(s->>'extractedBody',''),s->>'description',''))) >= 160
    AND s->>'url' ~* '^https://([^/@:]+\.(gov|mil|state\.tx\.us)|nvidianews\.nvidia\.com|blogs\.nvidia\.com|investor\.nvidia\.com|([^/@:]+\.)?ercot\.com)/[^?#]+'
    AND EXISTS (SELECT 1 FROM jsonb_array_elements(coalesce(NEW.body_json->'sources','[]'::jsonb)) a WHERE a->>'url'=s->>'url');
  IF event_record_count=0 THEN
    RAISE EXCEPTION USING ERRCODE='23514', MESSAGE='newsroom_event_primary_evidence_hold', HINT='Collect and verify a substantive direct primary record in the research packet before publication.';
  END IF;
  IF EXISTS (SELECT 1 FROM jsonb_array_elements(coalesce(NEW.body_json->'sections','[]'::jsonb)) s WHERE lower(trim(s->>'heading'))='permanent ktr context') THEN
    RAISE EXCEPTION USING ERRCODE='23514', MESSAGE='newsroom_unvalidated_context_hold', HINT='Remove the legacy automatic policy graph section before publication.';
  END IF;
  RETURN NEW;
END;
$function$
;
