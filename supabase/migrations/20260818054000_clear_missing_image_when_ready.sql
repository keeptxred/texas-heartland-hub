-- AdSense Phase 11: centralize image-quality flag cleanup.
-- Any image writer that successfully attaches a featured image should resolve
-- the `missing_image` finding automatically; failed/pending rows keep it.

CREATE OR REPLACE FUNCTION public.clear_missing_image_when_ready()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.featured_image_url IS NOT NULL AND btrim(NEW.featured_image_url) <> '' THEN
    NEW.quality_flags := array_remove(coalesce(NEW.quality_flags, ARRAY[]::text[]), 'missing_image');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_clear_missing_image_when_ready ON public.daily_articles;
CREATE TRIGGER trg_clear_missing_image_when_ready
BEFORE INSERT OR UPDATE OF featured_image_url
ON public.daily_articles
FOR EACH ROW
EXECUTE FUNCTION public.clear_missing_image_when_ready();

COMMENT ON FUNCTION public.clear_missing_image_when_ready() IS
  'Clears the missing_image quality flag whenever any pipeline successfully attaches featured_image_url.';
