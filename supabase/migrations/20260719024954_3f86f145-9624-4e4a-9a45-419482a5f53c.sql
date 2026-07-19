CREATE TABLE public.content_sources (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  source_name text not null,
  source_url text,
  category text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT ALL ON public.content_sources TO service_role;

ALTER TABLE public.content_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role manages content_sources"
  ON public.content_sources FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE TRIGGER trg_content_sources_updated_at
  BEFORE UPDATE ON public.content_sources
  FOR EACH ROW EXECUTE FUNCTION public.set_content_packages_updated_at();

CREATE INDEX idx_content_sources_platform_name
  ON public.content_sources (lower(platform), lower(source_name));