-- The July 6 legacy news URL and the surviving July 9 canonical article
-- cover the same Toyota $3.6B / 2,000-job San Antonio campus expansion.
-- Primary evidence: Toyota's July 6, 2026 release and Governor Abbott's
-- July 6, 2026 release. Preserve the original Google-visible URL via 301.
-- Do not redirect superficially similar stories without event-level evidence.
INSERT INTO public.article_slug_redirects (old_slug, new_slug)
SELECT
  'live-2026-07-06-toyota-increases-san-antonio-footprint-with-massive-three-billion-doll-z2yvzl',
  d.slug
FROM public.daily_articles AS d
WHERE d.slug = 'live-2026-07-09-toyota-bolsters-san-antonio-manufacturing-footprint-with-major-tacoma--6ik2im'
  AND d.source_url = 'https://pressroom.toyota.com/toyota-announces-3-6b-expansion-2000-new-jobs-at-its-san-antonio-plant/'
  AND EXISTS (
    SELECT 1 FROM public.article_url_registry AS r
    WHERE r.slug = 'live-2026-07-06-toyota-increases-san-antonio-footprint-with-massive-three-billion-doll-z2yvzl'
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.daily_articles AS old_article
    WHERE old_article.slug = 'live-2026-07-06-toyota-increases-san-antonio-footprint-with-massive-three-billion-doll-z2yvzl'
  )
ON CONFLICT (old_slug) DO NOTHING;
