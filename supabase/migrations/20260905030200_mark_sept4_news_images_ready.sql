-- Mark the September 4 current-news package as image-ready now that its raster JPEG heroes are deployed.
UPDATE public.daily_articles
SET image_generation_status = 'ready'
WHERE slug IN (
  '2026-09-04-paxton-financial-disclosures-ethics',
  '2026-09-04-texas-sboe-social-studies-standards',
  '2026-09-04-texas-am-core-curriculum-sb37',
  '2026-09-04-texas-school-voucher-2b-request',
  '2026-09-04-texas-food-insecurity-one-in-five',
  '2026-09-04-tesla-cybercab-austin-launch',
  '2026-09-04-trinity-county-deer-viral-video',
  '2026-09-04-fort-worth-kindergartner-school-safety',
  '2026-09-04-denton-191-turtles-shipment',
  '2026-09-04-desoto-handshake-viral-backlash'
)
AND featured_image_url IS NOT NULL
AND featured_image_url ~* '\\.(jpe?g|png|webp)(\\?.*)?$';
