-- Low-credit newsroom Phase 2: story-cluster data model.
-- This adds a compatibility layer between texas_news_feed and the existing
-- rewrite/publish pipeline. It does not change current publishing behavior.

CREATE TABLE IF NOT EXISTS public.news_story_clusters (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  cluster_key text UNIQUE,
  canonical_subject text NOT NULL,
  canonical_headline text,
  cluster_type text NOT NULL DEFAULT 'SINGLE'
    CHECK (cluster_type IN ('SKIP','SINGLE','MERGE','SYNTHESIS')),
  status text NOT NULL DEFAULT 'DISCOVERED'
    CHECK (status IN ('DISCOVERED','READY','SELECTED','HELD','PUBLISHED','SKIPPED','ARCHIVED')),
  pillar_slug text,
  entities jsonb NOT NULL DEFAULT '[]'::jsonb,
  locations jsonb NOT NULL DEFAULT '[]'::jsonb,
  score integer NOT NULL DEFAULT 0,
  score_breakdown jsonb NOT NULL DEFAULT '{}'::jsonb,
  confidence real,
  source_count integer NOT NULL DEFAULT 0 CHECK (source_count >= 0),
  primary_source_count integer NOT NULL DEFAULT 0 CHECK (primary_source_count >= 0),
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  selected_at timestamptz,
  published_at timestamptz,
  published_article_id uuid REFERENCES public.daily_articles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  CHECK (primary_source_count <= source_count)
);

CREATE TABLE IF NOT EXISTS public.news_story_cluster_items (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  cluster_id uuid NOT NULL REFERENCES public.news_story_clusters(id) ON DELETE CASCADE,
  feed_item_id bigint NOT NULL REFERENCES public.texas_news_feed(id) ON DELETE CASCADE,
  relationship_type text NOT NULL DEFAULT 'supporting'
    CHECK (relationship_type IN ('primary','supporting','background','trend-signal')),
  weight real NOT NULL DEFAULT 1,
  is_primary_source boolean NOT NULL DEFAULT false,
  source_name text,
  source_url text,
  added_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cluster_id, feed_item_id),
  CHECK (weight >= 0 AND weight <= 1)
);

CREATE TABLE IF NOT EXISTS public.news_publish_candidates (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  cluster_id uuid NOT NULL UNIQUE REFERENCES public.news_story_clusters(id) ON DELETE CASCADE,
  editorial_score integer NOT NULL DEFAULT 0,
  score_breakdown jsonb NOT NULL DEFAULT '{}'::jsonb,
  recommended_format text NOT NULL DEFAULT 'SINGLE'
    CHECK (recommended_format IN ('SKIP','SINGLE','MERGE','SYNTHESIS','BRIEF_ITEM')),
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING','SELECTED','HELD','REJECTED','PUBLISHED')),
  selection_reason text,
  rejection_reason text,
  selected_at timestamptz,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_generation_budget (
  site text NOT NULL DEFAULT 'keeptxred',
  budget_date date NOT NULL DEFAULT current_date,
  normal_limit integer NOT NULL DEFAULT 8 CHECK (normal_limit >= 0),
  normal_used integer NOT NULL DEFAULT 0 CHECK (normal_used >= 0),
  normal_reserved integer NOT NULL DEFAULT 0 CHECK (normal_reserved >= 0),
  breaking_limit integer NOT NULL DEFAULT 2 CHECK (breaking_limit >= 0),
  breaking_used integer NOT NULL DEFAULT 0 CHECK (breaking_used >= 0),
  breaking_reserved integer NOT NULL DEFAULT 0 CHECK (breaking_reserved >= 0),
  briefing_limit integer NOT NULL DEFAULT 1 CHECK (briefing_limit >= 0),
  briefing_used integer NOT NULL DEFAULT 0 CHECK (briefing_used >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (site, budget_date),
  CHECK (normal_used + normal_reserved <= normal_limit),
  CHECK (breaking_used + breaking_reserved <= breaking_limit),
  CHECK (briefing_used <= briefing_limit)
);

CREATE INDEX IF NOT EXISTS idx_news_story_clusters_status_score
  ON public.news_story_clusters(status, score DESC, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_story_clusters_pillar
  ON public.news_story_clusters(pillar_slug, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_story_clusters_type
  ON public.news_story_clusters(cluster_type, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_story_clusters_article
  ON public.news_story_clusters(published_article_id)
  WHERE published_article_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_news_story_cluster_items_cluster
  ON public.news_story_cluster_items(cluster_id, is_primary_source DESC, weight DESC);
CREATE INDEX IF NOT EXISTS idx_news_story_cluster_items_feed_item
  ON public.news_story_cluster_items(feed_item_id);
CREATE INDEX IF NOT EXISTS idx_news_publish_candidates_status_score
  ON public.news_publish_candidates(status, editorial_score DESC, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_ai_generation_budget_date
  ON public.ai_generation_budget(budget_date DESC, site);

CREATE OR REPLACE FUNCTION public.newsroom_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_news_story_clusters_updated_at ON public.news_story_clusters;
CREATE TRIGGER trg_news_story_clusters_updated_at
BEFORE UPDATE ON public.news_story_clusters
FOR EACH ROW EXECUTE FUNCTION public.newsroom_set_updated_at();

DROP TRIGGER IF EXISTS trg_news_publish_candidates_updated_at ON public.news_publish_candidates;
CREATE TRIGGER trg_news_publish_candidates_updated_at
BEFORE UPDATE ON public.news_publish_candidates
FOR EACH ROW EXECUTE FUNCTION public.newsroom_set_updated_at();

DROP TRIGGER IF EXISTS trg_ai_generation_budget_updated_at ON public.ai_generation_budget;
CREATE TRIGGER trg_ai_generation_budget_updated_at
BEFORE UPDATE ON public.ai_generation_budget
FOR EACH ROW EXECUTE FUNCTION public.newsroom_set_updated_at();

COMMENT ON TABLE public.news_story_clusters IS
  'Groups one or more texas_news_feed items into an editorial story package before any paid rewrite call.';
COMMENT ON TABLE public.news_story_cluster_items IS
  'Membership/provenance rows linking raw feed discoveries to story clusters.';
COMMENT ON TABLE public.news_publish_candidates IS
  'Editorial selection state and scoring for clusters; does not itself trigger generation.';
COMMENT ON TABLE public.ai_generation_budget IS
  'Daily sitewide generation budget ledger. Enforcement is added in a later phase.';
