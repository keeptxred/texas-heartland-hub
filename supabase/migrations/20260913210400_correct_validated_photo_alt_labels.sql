-- Cloudflare image generation is governed as physical-camera editorial photography,
-- and stored-hero v4 only accepts photorealistic images. The prior trigger rewrote
-- those validated photos from "Editorial news photograph" to "Editorial illustration",
-- which made the accessibility label contradict the governed visual result.

CREATE OR REPLACE FUNCTION public.normalize_generated_article_image_alt_text()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.image_generation_status = 'ready'
     AND (
       coalesce(NEW.image_validation_note, '') ILIKE '%cloudflare-vision ok:%'
       OR coalesce(NEW.image_validation_note, '') ~* 'stored-cloudflare-vision-v[0-9]+[[:space:]]+ok:'
     )
     AND coalesce(NEW.image_alt_text, '') ILIKE 'Editorial illustration%'
  THEN
    NEW.image_alt_text := regexp_replace(
      NEW.image_alt_text,
      '^Editorial illustration',
      'Editorial news photograph',
      'i'
    );
  END IF;
  RETURN NEW;
END;
$function$;

UPDATE public.daily_articles
SET image_alt_text = regexp_replace(
  image_alt_text,
  '^Editorial illustration',
  'Editorial news photograph',
  'i'
)
WHERE image_generation_status = 'ready'
  AND (
    coalesce(image_validation_note, '') ILIKE '%cloudflare-vision ok:%'
    OR coalesce(image_validation_note, '') ~* 'stored-cloudflare-vision-v[0-9]+[[:space:]]+ok:'
  )
  AND coalesce(image_alt_text, '') ILIKE 'Editorial illustration%';
