-- BULK_ARTICLE_MAINTENANCE
-- Reconcile image readiness for two restored historical URLs that already carry
-- explicit Wikimedia Commons license provenance, a usable image URL, and alt text.
-- A later AI generation failure must not leave those vetted external assets in
-- a permanently failed readiness state.

UPDATE public.daily_articles
SET
  image_generation_status = 'ready',
  updated_at = now()
WHERE slug IN (
  'live-2026-07-08-new-omakase-concept-ichika-debuts-in-plano-dining-scene-pd6r0q',
  'live-2026-07-02-suburban-expansion-trends-transform-texas-economic-landscape-roszfh'
)
  AND nullif(btrim(coalesce(featured_image_url, '')), '') IS NOT NULL
  AND nullif(btrim(coalesce(image_alt_text, '')), '') IS NOT NULL
  AND image_validation_note ~* 'Wikimedia Commons'
  AND image_validation_note ~* '(CC0|CC BY|public domain)'
  AND coalesce(image_generation_status, '') <> 'ready';
