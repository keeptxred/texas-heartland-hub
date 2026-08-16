-- Multi-source synthesis Phase 6: timing/lifecycle concurrency protection.
-- One event may be synthesized by many workers, but only one worker may own
-- the publication claim at a time. Stale claims expire automatically.

ALTER TABLE public.news_event_clusters
  ADD COLUMN IF NOT EXISTS publish_claim_token text,
  ADD COLUMN IF NOT EXISTS publish_claimed_at timestamptz,
  ADD COLUMN IF NOT EXISTS publish_attempt_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS next_publish_eligible_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_news_event_clusters_publish_claim
  ON public.news_event_clusters(status, publish_claimed_at)
  WHERE status <> 'published';

CREATE OR REPLACE FUNCTION public.claim_news_event_cluster_publication(
  p_cluster_id uuid,
  p_claim_token text,
  p_claim_ttl_seconds integer DEFAULT 1200
)
RETURNS TABLE(acquired boolean, published_slug text)
LANGUAGE plpgsql
AS $$
DECLARE
  v_slug text;
BEGIN
  IF p_claim_ttl_seconds < 60 OR p_claim_ttl_seconds > 7200 THEN
    RAISE EXCEPTION 'claim ttl out of range';
  END IF;

  UPDATE public.news_event_clusters
  SET publish_claim_token = p_claim_token,
      publish_claimed_at = now(),
      publish_attempt_count = publish_attempt_count + 1
  WHERE id = p_cluster_id
    AND status <> 'published'
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

CREATE OR REPLACE FUNCTION public.release_news_event_cluster_publication_claim(
  p_cluster_id uuid,
  p_claim_token text
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.news_event_clusters
  SET publish_claim_token = NULL,
      publish_claimed_at = NULL
  WHERE id = p_cluster_id
    AND publish_claim_token = p_claim_token
    AND status <> 'published';
  RETURN FOUND;
END;
$$;

COMMENT ON COLUMN public.news_event_clusters.publish_claim_token IS
  'Short-lived idempotency claim held by the worker currently publishing this event.';
COMMENT ON COLUMN public.news_event_clusters.next_publish_eligible_at IS
  'Optional earliest time a collecting cluster should be reconsidered for publication.';
