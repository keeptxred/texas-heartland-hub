-- Repair legacy ChatGPT-created news hero images that were stored as SVG.
-- Matching PNG files are committed from the same repository repair branch.
-- This intentionally leaves rows already remediated to verified raster/photo URLs unchanged.

UPDATE public.daily_articles
SET
  featured_image_url = regexp_replace(featured_image_url, '\.svg', '.png', 'i'),
  image_url = CASE
    WHEN image_url IS NOT NULL THEN regexp_replace(image_url, '\.svg', '.png', 'i')
    ELSE image_url
  END,
  image_generation_status = 'ready'
WHERE author = 'Keep TX Red Newsroom'
  AND published_at >= '2026-08-07T00:00:00Z'::timestamptz
  AND featured_image_url IS NOT NULL
  AND featured_image_url ~* '\.svg([?#].*)?$'
  AND (
    featured_image_url LIKE '/images/news/generated/%'
    OR featured_image_url LIKE 'https://raw.githubusercontent.com/keeptxred/texas-heartland-hub/%/public/images/news/generated/%'
  );

-- New ChatGPT newsroom rows may never point at SVG heroes again. NOT VALID
-- avoids rejecting unrelated historical rows while still enforcing the rule
-- for all new or updated rows immediately.
ALTER TABLE public.daily_articles
  ADD CONSTRAINT daily_articles_chatgpt_featured_image_not_svg
  CHECK (
    author <> 'Keep TX Red Newsroom'
    OR featured_image_url IS NULL
    OR featured_image_url !~* '\.svg([?#].*)?$'
  ) NOT VALID;
