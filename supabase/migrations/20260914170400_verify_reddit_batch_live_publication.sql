-- Verify the September 14 curated Reddit-title publication batch through the
-- existing fail-closed daily-news production smoke after this migration lands.
--
-- The ten values below are intentionally machine-readable by
-- daily-news-publication-verification.yml. The only data correction is the
-- Ted Cruz article's internal-link set: the federal college-sports bill story
-- must not point readers to KTR's Texas state-bill directory.

WITH verification_targets(slug, verify_live) AS (
  VALUES
    ('2026-09-14-several-texas-republicans-condemn-bo-french-s-racist-posts-calling-asian-student', true),
    ('2026-09-14-texas-teacher-prep-programs-1619-project-tea-mandate', true),
    ('2026-09-14-aarp-poll-talarico-paxton-abbott-hinojosa-texas', true),
    ('2026-09-14-gina-hinojosa-first-latina-governor-texas-profile', true),
    ('2026-09-14-ectopic-pregnancy-deaths-texas-abortion-ban-analysis', true),
    ('2026-09-14-texas-uninsured-rate-16-7-census', true),
    ('2026-09-14-ted-cruz-booed-college-gameday-protect-college-sports-act', true),
    ('2026-09-14-austin-measles-unvaccinated-infant-exposure', true),
    ('2026-09-14-sand-branch-fire-running-water-hydrants', true),
    ('2026-09-14-ercot-november-2026-grid-outlook-winter-risk', true)
)
UPDATE public.daily_articles AS d
SET
  internal_links = jsonb_build_array(
    jsonb_build_object('href', '/texas-politics', 'kind', 'hub', 'label', 'Texas Politics'),
    jsonb_build_object('href', '/elections/2026', 'kind', 'hub', 'label', '2026 Election Central'),
    jsonb_build_object('href', '/news', 'kind', 'hub', 'label', 'Latest Texas News')
  ),
  -- Keep governed hero fields explicit so the publication migration contract
  -- continues to enforce raster-image readiness for this scoped article fix.
  featured_image_url = d.featured_image_url,
  image_alt_text = d.image_alt_text
FROM verification_targets AS v
WHERE d.slug = v.slug
  AND v.verify_live
  AND v.slug LIKE '%ted-cruz-booed-college-gameday-protect-college-sports-act'
  AND d.internal_links IS DISTINCT FROM jsonb_build_array(
    jsonb_build_object('href', '/texas-politics', 'kind', 'hub', 'label', 'Texas Politics'),
    jsonb_build_object('href', '/elections/2026', 'kind', 'hub', 'label', '2026 Election Central'),
    jsonb_build_object('href', '/news', 'kind', 'hub', 'label', 'Latest Texas News')
  );
