
ALTER TABLE public.daily_articles ADD COLUMN IF NOT EXISTS image_hash text;

CREATE OR REPLACE FUNCTION public.daily_articles_set_image_hash()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.image_url IS NULL OR NEW.image_url = '' THEN
    NEW.image_hash := NULL;
  ELSE
    -- Lightweight fingerprint: md5 of the normalized URL. Same file -> same hash,
    -- which lets the render-time scanner flag and swap duplicates without AI.
    NEW.image_hash := md5(lower(trim(NEW.image_url)));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS daily_articles_image_hash ON public.daily_articles;
CREATE TRIGGER daily_articles_image_hash
BEFORE INSERT OR UPDATE OF image_url ON public.daily_articles
FOR EACH ROW EXECUTE FUNCTION public.daily_articles_set_image_hash();

-- Backfill hashes for existing rows.
UPDATE public.daily_articles
SET image_hash = md5(lower(trim(image_url)))
WHERE image_url IS NOT NULL AND image_url <> '' AND image_hash IS NULL;

CREATE INDEX IF NOT EXISTS daily_articles_image_hash_idx ON public.daily_articles(image_hash);
