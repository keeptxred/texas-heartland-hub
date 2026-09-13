-- Governed-ready article heroes can be either reusable real photography or
-- photorealistic generated editorial imagery. Avoid labeling every validated
-- asset as either a literal photograph or an illustration. Use the neutral,
-- accurate "Editorial image" prefix while preserving the subject description.

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
     AND (
       coalesce(NEW.image_alt_text, '') ILIKE 'Editorial illustration%'
       OR coalesce(NEW.image_alt_text, '') ILIKE 'Editorial news photograph%'
     )
  THEN
    NEW.image_alt_text := regexp_replace(
      NEW.image_alt_text,
      '^Editorial (illustration|news photograph)',
      'Editorial image',
      'i'
    );
  END IF;
  RETURN NEW;
END;
$function$;

UPDATE public.daily_articles
SET image_alt_text = regexp_replace(
  image_alt_text,
  '^Editorial (illustration|news photograph)',
  'Editorial image',
  'i'
)
WHERE image_generation_status = 'ready'
  AND (
    coalesce(image_validation_note, '') ILIKE '%cloudflare-vision ok:%'
    OR coalesce(image_validation_note, '') ~* 'stored-cloudflare-vision-v[0-9]+[[:space:]]+ok:'
  )
  AND (
    coalesce(image_alt_text, '') ILIKE 'Editorial illustration%'
    OR coalesce(image_alt_text, '') ILIKE 'Editorial news photograph%'
  );