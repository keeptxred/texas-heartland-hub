-- Repair articles whose source feed supplied an implausible publish date.
-- The bad date leaked into published_at and into the slug (e.g. live-2001-...).
-- created_at is the real ingestion time, so use it as the corrected date.
WITH bad AS (
  SELECT id,
         slug,
         created_at,
         regexp_replace(slug, '^(live-)?[0-9]{4}-[0-9]{2}-[0-9]{2}-',
                        COALESCE((regexp_match(slug, '^(live-)'))[1], '') || to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') || '-') AS fixed_slug
  FROM public.daily_articles
  WHERE slug ~ '^(live-)?[0-9]{4}-[0-9]{2}-[0-9]{2}-'
    AND abs(EXTRACT(YEAR FROM published_at) - EXTRACT(YEAR FROM created_at)) >= 1
),
safe AS (
  SELECT b.* FROM bad b
  WHERE b.fixed_slug <> b.slug
    AND NOT EXISTS (SELECT 1 FROM public.daily_articles d WHERE d.slug = b.fixed_slug)
)
UPDATE public.daily_articles d
SET published_at = s.created_at,
    slug = s.fixed_slug,
    internal_url = '/news/' || s.fixed_slug
FROM safe s
WHERE d.id = s.id;

-- Any remaining implausible dates (slug collision cases): fix the date only.
UPDATE public.daily_articles
SET published_at = created_at
WHERE abs(EXTRACT(YEAR FROM published_at) - EXTRACT(YEAR FROM created_at)) >= 1;