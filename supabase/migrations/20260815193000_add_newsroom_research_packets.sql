-- Low-credit newsroom Phase 8: research packets assembled from stored source material.
-- Packets are internal inputs to later generation; this migration does not invoke AI.

CREATE TABLE IF NOT EXISTS public.news_research_packets (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  cluster_id uuid NOT NULL UNIQUE REFERENCES public.news_story_clusters(id) ON DELETE CASCADE,
  packet_version integer NOT NULL DEFAULT 1 CHECK (packet_version > 0),
  packet_json jsonb NOT NULL,
  source_count integer NOT NULL DEFAULT 0 CHECK (source_count >= 0),
  primary_source_count integer NOT NULL DEFAULT 0 CHECK (primary_source_count >= 0),
  built_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (primary_source_count <= source_count)
);

CREATE INDEX IF NOT EXISTS idx_news_research_packets_built
  ON public.news_research_packets(built_at DESC);

DROP TRIGGER IF EXISTS trg_news_research_packets_updated_at ON public.news_research_packets;
CREATE TRIGGER trg_news_research_packets_updated_at
BEFORE UPDATE ON public.news_research_packets
FOR EACH ROW EXECUTE FUNCTION public.newsroom_set_updated_at();

-- Newsroom working tables are server-only. Enable RLS with no anon/authenticated
-- policies so Data API clients cannot read or mutate internal editorial state.
ALTER TABLE public.news_story_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_story_cluster_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_publish_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generation_budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_feed_normalization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_research_packets ENABLE ROW LEVEL SECURITY;

SELECT cron.schedule(
  'keep-tx-red-build-newsroom-research-packets',
  '14,29,44,59 * * * *',
  $$
    SELECT net.http_post(
      url := 'https://keeptxred.com/api/public/hooks/build-newsroom-research-packets',
      headers := '{"Content-Type":"application/json","Accept":"application/json"}'::jsonb,
      body := '{"source":"pg_cron"}'::jsonb,
      timeout_milliseconds := 120000
    );
  $$
);

COMMENT ON TABLE public.news_research_packets IS
  'Internal source-grounded evidence packets for selected newsroom clusters; no generated facts or attribution are stored here.';
