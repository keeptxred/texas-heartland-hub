-- BULK_ARTICLE_MAINTENANCE
-- Finalize the reviewed cross-country taxonomy and make generated-image alt labels
-- truthful for both existing and future Cloudflare-generated article images.

UPDATE public.daily_articles
SET category = 'Sports',
    discover_category = 'Sports',
    kind = 'sports-general',
    image_category = coalesce(image_category, 'sports'),
    quality_flags = ARRAY(
      SELECT DISTINCT flag
      FROM unnest(
        coalesce(quality_flags, '{}'::text[])
        || ARRAY['taxonomy_locked','taxonomy_corrected']::text[]
      ) AS flag
    )
WHERE slug = '2026-08-18-texas-colleges-announce-2026-cross-country-schedules';

CREATE OR REPLACE FUNCTION public.normalize_generated_article_image_alt_text()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.image_generation_status = 'ready'
     AND coalesce(NEW.image_validation_note, '') ILIKE '%cloudflare-vision ok%'
     AND coalesce(NEW.image_alt_text, '') ILIKE 'Editorial news photograph%'
  THEN
    NEW.image_alt_text := regexp_replace(
      NEW.image_alt_text,
      '^Editorial news photograph',
      'Editorial illustration',
      'i'
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_normalize_generated_article_image_alt_text ON public.daily_articles;
CREATE TRIGGER trg_normalize_generated_article_image_alt_text
BEFORE INSERT OR UPDATE OF image_alt_text, image_validation_note, image_generation_status
ON public.daily_articles
FOR EACH ROW
EXECUTE FUNCTION public.normalize_generated_article_image_alt_text();

UPDATE public.daily_articles
SET image_alt_text = regexp_replace(
  image_alt_text,
  '^Editorial news photograph',
  'Editorial illustration',
  'i'
)
WHERE published_at IS NOT NULL
  AND image_generation_status = 'ready'
  AND image_validation_note ILIKE '%cloudflare-vision ok%'
  AND image_alt_text ILIKE 'Editorial news photograph%';

COMMENT ON FUNCTION public.normalize_generated_article_image_alt_text() IS
  'Rewrites misleading photograph labels to editorial illustration for Cloudflare-generated article images while leaving verified real photographs unchanged.';
