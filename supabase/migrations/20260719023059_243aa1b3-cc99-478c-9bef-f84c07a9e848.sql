CREATE TABLE public.content_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id uuid,
  source_title text NOT NULL,
  source_url text,
  category text,
  facebook_hook text,
  facebook_body text,
  facebook_cta text,
  facebook_hashtags text,
  instagram_hook text,
  instagram_script text,
  instagram_caption text,
  instagram_hashtags text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  status text NOT NULL DEFAULT 'DRAFT',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.content_packages TO service_role;

ALTER TABLE public.content_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role manages content packages"
  ON public.content_packages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.set_content_packages_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_content_packages_updated_at
BEFORE UPDATE ON public.content_packages
FOR EACH ROW EXECUTE FUNCTION public.set_content_packages_updated_at();

CREATE INDEX idx_content_packages_created_at ON public.content_packages (created_at DESC);