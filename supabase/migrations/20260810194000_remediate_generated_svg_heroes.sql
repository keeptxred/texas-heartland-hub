-- Repository-wide remediation for generated SVG news heroes.
-- The previous repair was scoped to author='Keep TX Red Newsroom', but several
-- ChatGPT-created rows inherited a different/default author and escaped it.
-- Matching PNG assets were committed alongside the legacy SVG assets.

UPDATE public.daily_articles
SET
  featured_image_url = regexp_replace(featured_image_url, '\.svg([?#].*)?$', '.png', 'i'),
  image_url = CASE
    WHEN image_url ~* '^(/images/news/generated/|https://raw\.githubusercontent\.com/keeptxred/texas-heartland-hub/.*/public/images/news/generated/).*\.svg([?#].*)?$'
      THEN regexp_replace(image_url, '\.svg([?#].*)?$', '.png', 'i')
    ELSE image_url
  END,
  image_generation_status = 'ready',
  image_validation_note = COALESCE(image_validation_note, 'bulk remediation: legacy generated SVG replaced by raster asset')
WHERE featured_image_url ~* '^(/images/news/generated/|https://raw\.githubusercontent\.com/keeptxred/texas-heartland-hub/.*/public/images/news/generated/).*\.svg([?#].*)?$';

-- Prevent recurrence regardless of author/source. Limit the guard to the
-- generated-news directory so legitimate subject-specific SVG assets remain allowed.
ALTER TABLE public.daily_articles
  DROP CONSTRAINT IF EXISTS daily_articles_generated_news_featured_image_not_svg;

ALTER TABLE public.daily_articles
  ADD CONSTRAINT daily_articles_generated_news_featured_image_not_svg
  CHECK (
    featured_image_url IS NULL
    OR featured_image_url !~* '^(/images/news/generated/|https://raw\.githubusercontent\.com/keeptxred/texas-heartland-hub/.*/public/images/news/generated/).*\.svg([?#].*)?$'
  ) NOT VALID;
