-- Low-credit newsroom Phase 9: persist generated drafts for shadow review before publication.
-- This table does not schedule or trigger AI. Generation remains explicitly gated in application code.

CREATE TABLE IF NOT EXISTS public.newsroom_generation_drafts (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES public.news_publish_candidates(id) ON DELETE CASCADE,
  cluster_id uuid NOT NULL REFERENCES public.news_story_clusters(id) ON DELETE CASCADE,
  mode text NOT NULL DEFAULT 'shadow' CHECK (mode IN ('shadow','publish')),
  status text NOT NULL CHECK (status IN ('GENERATED','REJECTED','PUBLISHED')),
  draft_json jsonb NOT NULL,
  validation_reasons text[] NOT NULL DEFAULT '{}',
  main_word_count integer NOT NULL DEFAULT 0 CHECK (main_word_count >= 0),
  provider text NOT NULL,
  model text NOT NULL,
  provider_attempts integer NOT NULL DEFAULT 1 CHECK (provider_attempts > 0),
  published_article_id uuid REFERENCES public.daily_articles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsroom_generation_drafts_candidate
  ON public.newsroom_generation_drafts(candidate_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsroom_generation_drafts_cluster
  ON public.newsroom_generation_drafts(cluster_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsroom_generation_drafts_status
  ON public.newsroom_generation_drafts(status, created_at DESC);

DROP TRIGGER IF EXISTS trg_newsroom_generation_drafts_updated_at ON public.newsroom_generation_drafts;
CREATE TRIGGER trg_newsroom_generation_drafts_updated_at
BEFORE UPDATE ON public.newsroom_generation_drafts
FOR EACH ROW EXECUTE FUNCTION public.newsroom_set_updated_at();

ALTER TABLE public.newsroom_generation_drafts ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.newsroom_generation_drafts IS
  'Server-only Phase 9 ledger for source-grounded AI drafts and validation outcomes. No public RLS policies are granted.';
