-- Keep the event-publication lease aligned with the AI rewrite stale-pending
-- window. A dead Worker must not leave the outer event claim blocking retries
-- after claim_ai_rewrite_slot already considers the rewrite stale.

CREATE OR REPLACE FUNCTION public.claim_news_event_cluster_publication(
  p_cluster_id uuid,
  p_claim_token text,
  p_claim_ttl_seconds integer DEFAULT 900
)
RETURNS TABLE(acquired boolean, published_slug text)
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_slug text;
BEGIN
  IF p_claim_ttl_seconds < 60 OR p_claim_ttl_seconds > 7200 THEN
    RAISE EXCEPTION 'claim ttl out of range';
  END IF;

  -- A canonical slug is terminal even if a later refresh accidentally changed
  -- the cluster status. Never mint a duplicate article for that event.
  SELECT c.published_slug INTO v_slug
  FROM public.news_event_clusters c
  WHERE c.id = p_cluster_id;

  IF v_slug IS NOT NULL THEN
    RETURN QUERY SELECT false, v_slug;
    RETURN;
  END IF;

  UPDATE public.news_event_clusters
  SET publish_claim_token = p_claim_token,
      publish_claimed_at = now(),
      publish_attempt_count = publish_attempt_count + 1
  WHERE id = p_cluster_id
    AND status <> 'published'
    AND published_slug IS NULL
    AND (next_publish_eligible_at IS NULL OR next_publish_eligible_at <= now())
    AND (
      publish_claim_token IS NULL
      OR publish_claimed_at IS NULL
      OR publish_claimed_at < now() - make_interval(secs => p_claim_ttl_seconds)
    );

  IF FOUND THEN
    RETURN QUERY SELECT true, NULL::text;
    RETURN;
  END IF;

  SELECT c.published_slug INTO v_slug
  FROM public.news_event_clusters c
  WHERE c.id = p_cluster_id;

  RETURN QUERY SELECT false, v_slug;
END;
$$;

-- The matching AI rewrite claim is already stale after 15 minutes. Clear any
-- older outer claims now so blocked events recover immediately after rollout.
UPDATE public.news_event_clusters
SET publish_claim_token = NULL,
    publish_claimed_at = NULL
WHERE status <> 'published'
  AND publish_claimed_at <= now() - interval '15 minutes';
