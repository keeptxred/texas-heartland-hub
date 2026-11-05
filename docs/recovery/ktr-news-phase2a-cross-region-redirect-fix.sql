-- KTR Phase 2A, issue #3421. Manually applied only after protected PR passes.
-- The July 24 San Antonio legacy alias has no daily_articles row and was incorrectly
-- redirected to a geographically distinct August 9 Houston report.
-- Preserve historical provenance in the Phase 2A CSV ledger; delete only this alias.
-- Idempotent: safe to retry, does not delete any articles or change published_at.
BEGIN;
DO $guard$
BEGIN
  IF EXISTS (SELECT 1 FROM public.daily_articles WHERE slug = 'live-2026-07-24-san-antonio-residents-seek-organized-opposition-to-flock-safety-survei-hz11ng') THEN
    RAISE EXCEPTION 'Old San Antonio article exists: preserve and re-evaluate it before retirement';
  END IF;
  IF EXISTS (SELECT 1 FROM public.article_slug_redirects
             WHERE old_slug = 'live-2026-07-24-san-antonio-residents-seek-organized-opposition-to-flock-safety-survei-hz11ng'
               AND new_slug <> '2026-08-09-houston-flock-camera-backlash') THEN
    RAISE EXCEPTION 'Legacy alias destination changed: do not delete an unreviewed mapping';
  END IF;
END
$guard$;
DELETE FROM public.article_slug_redirects
WHERE old_slug = 'live-2026-07-24-san-antonio-residents-seek-organized-opposition-to-flock-safety-survei-hz11ng' AND new_slug = '2026-08-09-houston-flock-camera-backlash';
UPDATE public.daily_articles
SET body = replace(body,
  'Keep TX Red previously covered [organized opposition to Flock cameras in the San Antonio area](/news/live-2026-07-24-san-antonio-residents-seek-organized-opposition-to-flock-safety-survei-hz11ng).',
  'An August 4 local report documented [opposition to Flock cameras in Boerne and Kendall County](https://www.mysanantonio.com/news/hill-country/article/boerne-flock-camera-petition-22365179.php).'),
  internal_links = (
    SELECT COALESCE(jsonb_agg(link ORDER BY ordinal), '[]'::jsonb)
    FROM jsonb_array_elements(COALESCE(internal_links, '[]'::jsonb))
      WITH ORDINALITY AS links(link, ordinal)
    WHERE link->>'href' <> '/news/live-2026-07-24-san-antonio-residents-seek-organized-opposition-to-flock-safety-survei-hz11ng'
  ),
  updated_at = NOW()
WHERE slug = '2026-08-09-houston-flock-camera-backlash'
  AND (position('/news/live-2026-07-24-san-antonio-residents-seek-organized-opposition-to-flock-safety-survei-hz11ng' IN COALESCE(body, '')) > 0
       OR COALESCE(internal_links, '[]'::jsonb) @> '[{"href":"/news/live-2026-07-24-san-antonio-residents-seek-organized-opposition-to-flock-safety-survei-hz11ng"}]'::jsonb);
COMMIT;

-- Verification (read-only, run after applying):
-- SELECT count(*) FROM public.article_slug_redirects WHERE old_slug = 'live-2026-07-24-san-antonio-residents-seek-organized-opposition-to-flock-safety-survei-hz11ng'; -- 0
-- SELECT published_at, updated_at, body LIKE '%/news/live-2026-07-24-san-antonio-residents-seek-organized-opposition-to-flock-safety-survei-hz11ng%' AS has_stale_body_link,
--   internal_links::text LIKE '%/news/live-2026-07-24-san-antonio-residents-seek-organized-opposition-to-flock-safety-survei-hz11ng%' AS has_stale_internal_link
-- FROM public.daily_articles WHERE slug = '2026-08-09-houston-flock-camera-backlash';
