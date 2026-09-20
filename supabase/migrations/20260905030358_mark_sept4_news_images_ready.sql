-- BULK_ARTICLE_MAINTENANCE
-- Mark the September 4 current-news package as image-ready now that its raster JPEG heroes are deployed.
UPDATE public.daily_articles
SET image_generation_status = 'ready'
WHERE slug = '2026-09-04-paxton-financial-disclosures-ethics'
  AND featured_image_url IS NOT NULL;

UPDATE public.daily_articles
SET image_generation_status = 'ready'
WHERE slug = '2026-09-04-texas-sboe-social-studies-standards'
  AND featured_image_url IS NOT NULL;

UPDATE public.daily_articles
SET image_generation_status = 'ready'
WHERE slug = '2026-09-04-texas-am-core-curriculum-sb37'
  AND featured_image_url IS NOT NULL;

UPDATE public.daily_articles
SET image_generation_status = 'ready'
WHERE slug = '2026-09-04-texas-school-voucher-2b-request'
  AND featured_image_url IS NOT NULL;

UPDATE public.daily_articles
SET image_generation_status = 'ready'
WHERE slug = '2026-09-04-texas-food-insecurity-one-in-five'
  AND featured_image_url IS NOT NULL;

UPDATE public.daily_articles
SET image_generation_status = 'ready'
WHERE slug = '2026-09-04-tesla-cybercab-austin-launch'
  AND featured_image_url IS NOT NULL;

UPDATE public.daily_articles
SET image_generation_status = 'ready'
WHERE slug = '2026-09-04-trinity-county-deer-viral-video'
  AND featured_image_url IS NOT NULL;

UPDATE public.daily_articles
SET image_generation_status = 'ready'
WHERE slug = '2026-09-04-fort-worth-kindergartner-school-safety'
  AND featured_image_url IS NOT NULL;

UPDATE public.daily_articles
SET image_generation_status = 'ready'
WHERE slug = '2026-09-04-denton-191-turtles-shipment'
  AND featured_image_url IS NOT NULL;

UPDATE public.daily_articles
SET image_generation_status = 'ready'
WHERE slug = '2026-09-04-desoto-handshake-viral-backlash'
  AND featured_image_url IS NOT NULL;
