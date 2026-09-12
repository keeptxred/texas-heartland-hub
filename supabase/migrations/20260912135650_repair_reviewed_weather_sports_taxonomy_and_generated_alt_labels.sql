-- BULK_ARTICLE_MAINTENANCE
-- Preserve reviewed taxonomy discovered during the article-image semantic audit and
-- make generated-image alt text describe illustrations rather than photographs.

UPDATE public.daily_articles
SET category='Weather',
    discover_category='weather',
    quality_flags = ARRAY(
      SELECT DISTINCT flag
      FROM unnest(coalesce(quality_flags,'{}'::text[]) || ARRAY['taxonomy_locked']::text[]) AS flag
    )
WHERE slug IN (
  '2026-09-03-tropical-storm-edouard-makes-landfall-near-texas-louisiana-border',
  '2026-09-02-tropical-storm-edouard-makes-landfall-near-texas-louisiana-border',
  '2026-09-02-tropical-storm-edouard-makes-landfall-in-southeast-texas',
  '2026-09-01-tropical-storm-edouard-makes-landfall-near-texas-louisiana-border',
  '2026-09-01-tropical-storm-edouard-makes-landfall-in-southeast-texas',
  '2026-09-01-tropical-storm-edouard-expected-to-bring-flooding-and-gusty-wind-to-southeast-te',
  '2026-08-07-texas-hurricane-odds-drop-el-nino'
);

UPDATE public.article_pillar_assignments
SET pillar_slug = NULL,
    classifier_version = 'manual-taxonomy-review-20260912',
    classified_at = now()
WHERE article_slug IN (
  '2026-09-03-tropical-storm-edouard-makes-landfall-near-texas-louisiana-border',
  '2026-09-02-tropical-storm-edouard-makes-landfall-near-texas-louisiana-border',
  '2026-09-02-tropical-storm-edouard-makes-landfall-in-southeast-texas',
  '2026-09-01-tropical-storm-edouard-makes-landfall-near-texas-louisiana-border',
  '2026-09-01-tropical-storm-edouard-makes-landfall-in-southeast-texas',
  '2026-09-01-tropical-storm-edouard-expected-to-bring-flooding-and-gusty-wind-to-southeast-te',
  '2026-08-07-texas-hurricane-odds-drop-el-nino'
);

UPDATE public.daily_articles
SET category='College Sports',
    discover_category='Sports',
    kind='sports-general',
    image_category=coalesce(image_category,'sports'),
    quality_flags = ARRAY(
      SELECT DISTINCT flag
      FROM unnest(coalesce(quality_flags,'{}'::text[]) || ARRAY['taxonomy_locked']::text[]) AS flag
    )
WHERE slug='2026-08-18-texas-colleges-announce-2026-cross-country-schedules';

UPDATE public.article_pillar_assignments
SET pillar_slug = NULL,
    classifier_version = 'manual-taxonomy-review-20260912',
    classified_at = now()
WHERE article_slug='2026-08-18-texas-colleges-announce-2026-cross-country-schedules';

UPDATE public.daily_articles
SET image_alt_text = regexp_replace(image_alt_text, '^Editorial news photograph', 'Editorial illustration', 'i')
WHERE published_at IS NOT NULL
  AND image_generation_status='ready'
  AND image_validation_note ILIKE '%cloudflare-vision ok%'
  AND image_alt_text ILIKE 'Editorial news photograph%';
