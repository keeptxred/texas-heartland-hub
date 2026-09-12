-- `featured_image_url` is the canonical article image used by article pages and
-- publication readiness. Legacy consumers still read `image_url`, so letting the
-- two diverge can resurrect a stale generated/stock image after an editorial
-- remediation. Keep the legacy field synchronized automatically whenever the
-- canonical featured image is attached or replaced.

CREATE OR REPLACE FUNCTION public.clear_missing_image_when_ready()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.featured_image_url IS NOT NULL AND btrim(NEW.featured_image_url) <> '' THEN
    NEW.quality_flags := array_remove(coalesce(NEW.quality_flags, ARRAY[]::text[]), 'missing_image');
    NEW.image_url := NEW.featured_image_url;
  END IF;
  RETURN NEW;
END;
$$;

-- BULK_IMAGE_FIELD_MAINTENANCE
-- Repair existing canonical/legacy URL drift and stale missing-image flags before
-- relying on the trigger for future writes. This is operational image metadata
-- maintenance, not an article publication migration.
UPDATE public.daily_articles
SET image_url = featured_image_url,
    quality_flags = array_remove(coalesce(quality_flags, ARRAY[]::text[]), 'missing_image')
WHERE featured_image_url IS NOT NULL
  AND btrim(featured_image_url) <> ''
  AND (
    image_url IS DISTINCT FROM featured_image_url
    OR 'missing_image' = ANY(coalesce(quality_flags, ARRAY[]::text[]))
  );

COMMENT ON FUNCTION public.clear_missing_image_when_ready() IS
  'Clears missing_image and synchronizes legacy image_url to the canonical featured_image_url whenever a featured image is attached or replaced.';
