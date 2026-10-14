-- Submit newly recovered source-licensed historical hero photos to the
-- existing guarded Commons metadata + Cloudflare visual audit.
-- Pending image_generation_status alone is NOT eligible for this audit.
-- Preserve the proposed URL and truthful alt text; the audit decides whether
-- any hero may receive the ready status and visual provenance.
UPDATE public.daily_articles
SET image_candidate_url = featured_image_url,
    image_candidate_alt_text = image_alt_text
WHERE slug IN (
  'live-2026-07-02-governor-abbott-selects-don-huffines-to-serve-as-new-texas-comptroller-whlu3f',
  'live-2026-07-07-governor-abbott-orders-prompt-investigation-into-birth-tourism-package-wf40tc'
)
  AND image_generation_status = 'pending'
  AND featured_image_url LIKE 'https://commons.wikimedia.org/wiki/Special:Redirect/file/%'
  AND NULLIF(BTRIM(COALESCE(image_alt_text,'')),'') IS NOT NULL
  AND NULLIF(BTRIM(COALESCE(image_validation_note,'')),'') IS NOT NULL
  AND image_candidate_url IS NULL;
