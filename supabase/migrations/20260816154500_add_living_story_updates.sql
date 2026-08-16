-- Living-story updates keep one canonical URL per event while preserving an
-- auditable history of material changes. Update claims deliberately reuse the
-- event publication claim columns introduced in Phase 6 so publication and
-- canonical updates can never race on the same event.

CREATE TABLE IF NOT EXISTS public.news_event_article_updates (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  cluster_id uuid NOT NULL REFERENCES public.news_event_clusters(id) ON DELETE CASCADE,
  article_id uuid NOT NULL REFERENCES public.daily_articles(id) ON DELETE CASCADE,
  feed_item_id bigint REFERENCES public.texas_news_feed(id) ON DELETE SET NULL,
  canonical_slug text NOT NULL,
  novelty_score integer NOT NULL DEFAULT 0 CHECK (novelty_score >= 0),
  new_actions jsonb NOT NULL DEFAULT '[]'::jsonb,
  new_numbers jsonb NOT NULL DEFAULT '[]'::jsonb,
  new_dates jsonb NOT NULL DEFAULT '[]'::jsonb,
  has_new_primary_document boolean NOT NULL DEFAULT false,
  prior_title text,
  new_title text,
  title_changed boolean NOT NULL DEFAULT false,
  provider text,
  model text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_event_article_updates_cluster_created
  ON public.news_event_article_updates(cluster_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_event_article_updates_article_created
  ON public.news_event_article_updates(article_id, created_at DESC);

-- A published event may be re-synthesized while an in-place update is prepared,
-- but it must never lose its published lifecycle identity or canonical URL.
CREATE OR REPLACE FUNCTION public.news_event_cluster_preserve_published_status()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.status = 'published'
     AND OLD.published_slug IS NOT NULL
     AND NEW.status <> 'archived' THEN
    NEW.status = 'published';
    NEW.published_slug = COALESCE(NEW.published_slug, OLD.published_slug);
    NEW.published_article_id = COALESCE(NEW.published_article_id, OLD.published_article_id);
    NEW.published_at = COALESCE(NEW.published_at, OLD.published_at);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_news_event_clusters_preserve_published_status ON public.news_event_clusters;
CREATE TRIGGER trg_news_event_clusters_preserve_published_status
BEFORE UPDATE ON public.news_event_clusters
FOR EACH ROW EXECUTE FUNCTION public.news_event_cluster_preserve_published_status();

CREATE OR REPLACE FUNCTION public.claim_news_event_cluster_update(
  p_cluster_id uuid,
  p_claim_token uuid,
  p_claim_ttl_seconds integer DEFAULT 1200
)
RETURNS TABLE(acquired boolean, published_slug text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_slug text;
BEGIN
  UPDATE public.news_event_clusters
  SET publish_claim_token = p_claim_token,
      publish_claimed_at = now(),
      publish_attempt_count = COALESCE(publish_attempt_count, 0) + 1
  WHERE id = p_cluster_id
    AND status = 'published'
    AND published_slug IS NOT NULL
    AND (
      publish_claim_token IS NULL
      OR publish_claimed_at IS NULL
      OR publish_claimed_at < now() - make_interval(secs => GREATEST(p_claim_ttl_seconds, 60))
    )
  RETURNING news_event_clusters.published_slug INTO v_slug;

  IF FOUND THEN
    RETURN QUERY SELECT true, v_slug;
    RETURN;
  END IF;

  SELECT c.published_slug INTO v_slug
  FROM public.news_event_clusters c
  WHERE c.id = p_cluster_id;
  RETURN QUERY SELECT false, v_slug;
END;
$$;

COMMENT ON TABLE public.news_event_article_updates IS
  'Audit history for material updates applied in place to an already-published canonical event article.';
COMMENT ON FUNCTION public.claim_news_event_cluster_update(uuid, uuid, integer) IS
  'Atomically claims an already-published event for an in-place canonical article update with stale-claim recovery.';
