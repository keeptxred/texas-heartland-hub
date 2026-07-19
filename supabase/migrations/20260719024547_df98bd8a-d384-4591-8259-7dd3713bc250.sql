CREATE TABLE public.reel_candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_platform TEXT NOT NULL,
  source_account TEXT NOT NULL,
  source_url TEXT NOT NULL,
  title TEXT,
  topic TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.reel_candidates TO service_role;

ALTER TABLE public.reel_candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reel_candidates service role only"
  ON public.reel_candidates
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX reel_candidates_status_created_idx
  ON public.reel_candidates (status, created_at DESC);