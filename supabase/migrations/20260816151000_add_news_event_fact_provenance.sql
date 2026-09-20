-- Multi-source news synthesis Phase 3.
-- Store structured factual claims with source-level provenance so synthesis can
-- distinguish corroborated facts, primary-record support, quotations and conflicts.

CREATE TABLE IF NOT EXISTS public.news_event_facts (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  cluster_id uuid NOT NULL REFERENCES public.news_event_clusters(id) ON DELETE CASCADE,
  fact_key text NOT NULL,
  fact_type text NOT NULL
    CHECK (fact_type IN ('action','number','date','quote','next_step','context')),
  fact_text text NOT NULL,
  normalized_text text NOT NULL,
  confidence real NOT NULL DEFAULT 0.5
    CHECK (confidence >= 0 AND confidence <= 1),
  corroboration_count integer NOT NULL DEFAULT 1
    CHECK (corroboration_count >= 1),
  primary_record_support boolean NOT NULL DEFAULT false,
  source_feed_item_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  source_labels jsonb NOT NULL DEFAULT '[]'::jsonb,
  source_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  numeric_values jsonb NOT NULL DEFAULT '[]'::jsonb,
  conflict_group text,
  has_conflict boolean NOT NULL DEFAULT false,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cluster_id, fact_key)
);

CREATE INDEX IF NOT EXISTS idx_news_event_facts_cluster_type
  ON public.news_event_facts(cluster_id, fact_type, corroboration_count DESC);
CREATE INDEX IF NOT EXISTS idx_news_event_facts_conflict
  ON public.news_event_facts(cluster_id, has_conflict)
  WHERE has_conflict = true;
CREATE INDEX IF NOT EXISTS idx_news_event_facts_primary
  ON public.news_event_facts(cluster_id, primary_record_support, confidence DESC);

CREATE OR REPLACE FUNCTION public.news_event_fact_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_news_event_facts_updated_at ON public.news_event_facts;
CREATE TRIGGER trg_news_event_facts_updated_at
BEFORE UPDATE ON public.news_event_facts
FOR EACH ROW EXECUTE FUNCTION public.news_event_fact_set_updated_at();

COMMENT ON TABLE public.news_event_facts IS
  'Structured factual claim ledger for a news event, preserving corroboration and source provenance before article synthesis.';
COMMENT ON COLUMN public.news_event_facts.has_conflict IS
  'True when materially similar source statements contain incompatible numeric values and should be attributed rather than silently reconciled.';
