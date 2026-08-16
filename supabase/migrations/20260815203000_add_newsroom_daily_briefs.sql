-- Low-credit newsroom Phase 10: Texas Daily Brief draft/publication ledger.
-- No AI schedule is created here. The application endpoint remains explicitly gated.

CREATE TABLE IF NOT EXISTS public.newsroom_daily_briefs (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  brief_date date NOT NULL,
  mode text NOT NULL DEFAULT 'shadow' CHECK (mode IN ('shadow','publish')),
  status text NOT NULL CHECK (status IN ('GENERATED','REJECTED','PUBLISHED')),
  candidate_ids uuid[] NOT NULL DEFAULT '{}',
  cluster_ids uuid[] NOT NULL DEFAULT '{}',
  brief_json jsonb NOT NULL,
  validation_reasons text[] NOT NULL DEFAULT '{}',
  main_word_count integer NOT NULL DEFAULT 0 CHECK (main_word_count >= 0),
  provider text NOT NULL,
  model text NOT NULL,
  provider_attempts integer NOT NULL DEFAULT 1 CHECK (provider_attempts > 0),
  published_article_id uuid REFERENCES public.daily_articles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (cardinality(candidate_ids) = cardinality(cluster_ids)),
  CHECK (cardinality(cluster_ids) <= 10)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_newsroom_daily_briefs_one_success_per_mode_day
  ON public.newsroom_daily_briefs(brief_date, mode)
  WHERE status IN ('GENERATED','PUBLISHED');
CREATE INDEX IF NOT EXISTS idx_newsroom_daily_briefs_status
  ON public.newsroom_daily_briefs(status, created_at DESC);

DROP TRIGGER IF EXISTS trg_newsroom_daily_briefs_updated_at ON public.newsroom_daily_briefs;
CREATE TRIGGER trg_newsroom_daily_briefs_updated_at
BEFORE UPDATE ON public.newsroom_daily_briefs
FOR EACH ROW EXECUTE FUNCTION public.newsroom_set_updated_at();

ALTER TABLE public.newsroom_daily_briefs ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.newsroom_daily_briefs IS
  'Server-only Texas Daily Brief ledger. One briefing generation can cover several secondary statewide developments; no cron or public RLS policy is created here.';
