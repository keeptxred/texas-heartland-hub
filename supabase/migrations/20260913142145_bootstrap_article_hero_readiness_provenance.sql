-- BULK_ARTICLE_MAINTENANCE
-- Bootstrap the new visual-readiness contract with the known Abbott data-center
-- repair and authoritative NOAA/NHC graphic exemptions.

UPDATE public.daily_articles
SET featured_image_url='/api/public/article-image/2026-08-20-multiple-data-centers-commit-to-comply-with-governor-abbott-s-data-ce.jpg',
    image_url='/api/public/article-image/2026-08-20-multiple-data-centers-commit-to-comply-with-governor-abbott-s-data-ce.jpg',
    image_alt_text='Editorial image showing a large Texas data-center facility with cooling equipment, server infrastructure and power lines.',
    image_generation_status='ready',
    image_validation_note='verified-shared-hero: cloudflare-vision ok: reused the validated Texas data-center infrastructure hero from 2026-08-20; visible cooling towers, server facility context and power lines directly communicate the data-center/grid subject without relying on metadata or a caption.'
WHERE slug='2026-08-27-gov-abbott-orders-pause-on-data-center-approvals'
  AND featured_image_url IS DISTINCT FROM '/api/public/article-image/2026-08-20-multiple-data-centers-commit-to-comply-with-governor-abbott-s-data-ce.jpg';

UPDATE public.daily_articles
SET image_validation_note = 'authoritative-image-exempt: official NOAA/NHC storm or hurricane outlook graphic; exact authoritative source may bypass photorealism validation. ' || coalesce(image_validation_note,'')
WHERE published_at IS NOT NULL
  AND image_generation_status='ready'
  AND featured_image_url IS NOT NULL
  AND NOT public.article_hero_has_visual_readiness_provenance(image_validation_note)
  AND (
    featured_image_url LIKE 'https://www.nhc.noaa.gov/storm_graphics/%'
    OR (featured_image_url LIKE 'https://www.aoml.noaa.gov/%' AND featured_image_url ILIKE '%hurricane%outlook%')
  );
