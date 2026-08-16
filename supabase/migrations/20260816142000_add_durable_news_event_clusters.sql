-- Multi-source news synthesis Phases 1-2.
-- Persist event identity and preserve every contributing source instead of
-- treating related reports as disposable duplicates.

CREATE TABLE IF NOT EXISTS public.news_event_clusters (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  cluster_key text NOT NULL UNIQUE,
  canonical_headline text NOT NULL,
  status text NOT NULL DEFAULT 'collecting'
    CHECK (status IN ('collecting','ready','synthesized','published','archived')),
  match_score integer NOT NULL DEFAULT 0 CHECK (match_score BETWEEN 0 AND 100),
  source_count integer NOT NULL DEFAULT 1 CHECK (source_count >= 1),
  independent_source_count integer NOT NULL DEFAULT 1 CHECK (independent_source_count >= 1),
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  synthesized_at timestamptz,
  published_at timestamptz,
  published_article_id uuid REFERENCES public.daily_articles(id) ON DELETE SET NULL,
  published_slug text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (independent_source_count <= source_count)
);

ALTER TABLE public.texas_news_feed
  ADD COLUMN IF NOT EXISTS event_cluster_id uuid REFERENCES public.news_event_clusters(id) ON DELETE SET NULL;
ALTER TABLE public.texas_news_feed
  ADD COLUMN IF NOT EXISTS event_cluster_score integer CHECK (event_cluster_score IS NULL OR event_cluster_score BETWEEN 0 AND 100);
ALTER TABLE public.texas_news_feed
  ADD COLUMN IF NOT EXISTS event_cluster_reason text;

CREATE TABLE IF NOT EXISTS public.news_event_cluster_sources (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  cluster_id uuid NOT NULL REFERENCES public.news_event_clusters(id) ON DELETE CASCADE,
  feed_item_id bigint NOT NULL REFERENCES public.texas_news_feed(id) ON DELETE CASCADE,
  relationship_type text NOT NULL DEFAULT 'supporting'
    CHECK (relationship_type IN ('primary','supporting','confirmation','background')),
  source_name text NOT NULL,
  source_family text,
  source_url text NOT NULL,
  canonical_url text,
  headline text NOT NULL,
  published_at timestamptz,
  raw_text text,
  normalized_text text,
  is_primary_record boolean NOT NULL DEFAULT false,
  is_independent_source boolean NOT NULL DEFAULT true,
  match_score integer CHECK (match_score IS NULL OR match_score BETWEEN 0 AND 100),
  match_reason jsonb NOT NULL DEFAULT '{}'::jsonb,
  added_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cluster_id, feed_item_id),
  UNIQUE (feed_item_id)
);

CREATE INDEX IF NOT EXISTS idx_news_event_clusters_status_seen
  ON public.news_event_clusters(status, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_event_clusters_article
  ON public.news_event_clusters(published_article_id)
  WHERE published_article_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_news_event_cluster_sources_cluster
  ON public.news_event_cluster_sources(cluster_id, is_independent_source DESC, published_at ASC);
CREATE INDEX IF NOT EXISTS idx_news_event_cluster_sources_family
  ON public.news_event_cluster_sources(source_family, cluster_id);
CREATE INDEX IF NOT EXISTS idx_texas_news_feed_event_cluster
  ON public.texas_news_feed(event_cluster_id)
  WHERE event_cluster_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.news_event_cluster_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_news_event_clusters_updated_at ON public.news_event_clusters;
CREATE TRIGGER trg_news_event_clusters_updated_at
BEFORE UPDATE ON public.news_event_clusters
FOR EACH ROW EXECUTE FUNCTION public.news_event_cluster_set_updated_at();

COMMENT ON TABLE public.news_event_clusters IS
  'Durable identity for one underlying news event. Related feed reports attach here before rewrite/publish.';
COMMENT ON TABLE public.news_event_cluster_sources IS
  'Source-provenance ledger for event clusters. Related reports are preserved as evidence rather than discarded.';
COMMENT ON COLUMN public.texas_news_feed.event_cluster_reason IS
  'Human-readable clustering rationale for diagnostics and future admin review.';
