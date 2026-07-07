
ALTER TABLE public.daily_articles
  ADD COLUMN IF NOT EXISTS image_score integer,
  ADD COLUMN IF NOT EXISTS internal_links jsonb,
  ADD COLUMN IF NOT EXISTS texas_impact_summary text,
  ADD COLUMN IF NOT EXISTS affected_regions text[],
  ADD COLUMN IF NOT EXISTS content_quality_score integer,
  ADD COLUMN IF NOT EXISTS quality_flags text[],
  ADD COLUMN IF NOT EXISTS affiliate_category text,
  ADD COLUMN IF NOT EXISTS gsc_impressions integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gsc_clicks integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gsc_ctr numeric,
  ADD COLUMN IF NOT EXISTS gsc_avg_position numeric,
  ADD COLUMN IF NOT EXISTS gsc_last_update timestamptz;

CREATE TABLE IF NOT EXISTS public.newsletter_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source_page text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_signups_email_lower_idx
  ON public.newsletter_signups (lower(email));

GRANT INSERT ON public.newsletter_signups TO anon, authenticated;
GRANT ALL ON public.newsletter_signups TO service_role;

ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_signups;
CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
