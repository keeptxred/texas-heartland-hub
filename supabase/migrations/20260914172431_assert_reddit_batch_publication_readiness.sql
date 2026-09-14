-- Assert that the curated September 14 Reddit-title news batch is still
-- publication-ready before the post-migration live HTTP/image audit runs.
-- The two-column VALUES tuples are intentionally machine-readable by the
-- existing daily-news live-publication slug extractor.

DO $batch_readiness$
DECLARE
  invalid_slugs text;
BEGIN
  WITH targets(slug, expected_path) AS (
    VALUES
      ('2026-09-14-several-texas-republicans-condemn-bo-french-s-racist-posts-calling-asian-student', '/news/2026-09-14-several-texas-republicans-condemn-bo-french-s-racist-posts-calling-asian-student'),
      ('2026-09-14-texas-teacher-prep-programs-1619-project-tea-mandate', '/news/2026-09-14-texas-teacher-prep-programs-1619-project-tea-mandate'),
      ('2026-09-14-aarp-poll-talarico-paxton-abbott-hinojosa-texas', '/news/2026-09-14-aarp-poll-talarico-paxton-abbott-hinojosa-texas'),
      ('2026-09-14-gina-hinojosa-first-latina-governor-texas-profile', '/news/2026-09-14-gina-hinojosa-first-latina-governor-texas-profile'),
      ('2026-09-14-ectopic-pregnancy-deaths-texas-abortion-ban-analysis', '/news/2026-09-14-ectopic-pregnancy-deaths-texas-abortion-ban-analysis'),
      ('2026-09-14-texas-uninsured-rate-16-7-census', '/news/2026-09-14-texas-uninsured-rate-16-7-census'),
      ('2026-09-14-ted-cruz-booed-college-gameday-protect-college-sports-act', '/news/2026-09-14-ted-cruz-booed-college-gameday-protect-college-sports-act'),
      ('2026-09-14-austin-measles-unvaccinated-infant-exposure', '/news/2026-09-14-austin-measles-unvaccinated-infant-exposure'),
      ('2026-09-14-sand-branch-fire-running-water-hydrants', '/news/2026-09-14-sand-branch-fire-running-water-hydrants'),
      ('2026-09-14-ercot-november-2026-grid-outlook-winter-risk', '/news/2026-09-14-ercot-november-2026-grid-outlook-winter-risk')
  )
  SELECT string_agg(t.slug, ', ' ORDER BY t.slug)
  INTO invalid_slugs
  FROM targets t
  LEFT JOIN public.daily_articles d ON d.slug = t.slug
  LEFT JOIN public.article_url_registry r ON r.slug = t.slug
  WHERE d.slug IS NULL
     OR d.published_at IS NULL
     OR coalesce(d.content_quality_score, 0) < 70
     OR lower(coalesce(d.image_generation_status, '')) <> 'ready'
     OR nullif(btrim(coalesce(d.featured_image_url, d.image_url, '')), '') IS NULL
     OR NOT public.article_hero_has_visual_readiness_provenance(d.image_validation_note)
     OR nullif(btrim(coalesce(d.source_url, '')), '') IS NULL
     OR lower(coalesce(d.source_url, '')) LIKE '%reddit.com%'
     OR jsonb_typeof(d.body_json->'sources') IS DISTINCT FROM 'array'
     OR coalesce(jsonb_array_length(d.body_json->'sources'), 0) < 1
     OR EXISTS (
       SELECT 1
       FROM unnest(coalesce(d.quality_flags, '{}'::text[])) flag
       WHERE lower(flag) LIKE '%seo_duplicate%'
          OR lower(flag) LIKE '%duplicate_seo%'
     )
     OR coalesce(r.canonical_path, '') <> t.expected_path
     OR coalesce(r.recovery_status, '') NOT IN ('active', 'restored');

  IF invalid_slugs IS NOT NULL THEN
    RAISE EXCEPTION 'Reddit batch publication readiness failed for: %', invalid_slugs;
  END IF;
END
$batch_readiness$;
