ALTER TABLE public.content_sources
  ADD COLUMN IF NOT EXISTS enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS rss_url text;

CREATE INDEX IF NOT EXISTS content_sources_enabled_rss_idx
  ON public.content_sources (enabled)
  WHERE rss_url IS NOT NULL;