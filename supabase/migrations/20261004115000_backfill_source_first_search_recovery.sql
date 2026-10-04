-- BULK_ARTICLE_MAINTENANCE
-- Re-advertise only the already-audited, source-first newsroom stories that
-- were stranded behind the emergency cloud-news search-recovery gate.
--
-- Future newsroom items receive this flag only through the post-publish
-- finalizer after its >=90 quality, source-integrity, repetition, image, and
-- official-primary-source checks. This migration is intentionally narrow and
-- idempotent; it does not reopen ordinary commodity/third-party rewrites.

update public.daily_articles
set
  quality_flags = case
    when 'search_recovery_source_first' = any(coalesce(quality_flags, array[]::text[]))
      then quality_flags
    else coalesce(quality_flags, array[]::text[]) || array['search_recovery_source_first']::text[]
  end,
  updated_at = now()
where slug = '2026-09-14-texas-election-countdown-key-dates-early-voting-2026'
  or slug in (
    '2026-09-14-ercot-november-2026-grid-outlook-winter-risk',
    '2026-09-14-texas-uninsured-rate-16-7-census',
    '2026-09-14-austin-measles-unvaccinated-infant-exposure'
  )
  and kind = 'news'
  and author = 'Keep TX Red Newsroom'
  and coalesce(content_quality_score, 0) >= 90
  and coalesce(image_generation_status, '') = 'ready'
  and source_url is not null
  and jsonb_typeof(coalesce(body_json->'sources', '[]'::jsonb)) = 'array'
  and jsonb_array_length(coalesce(body_json->'sources', '[]'::jsonb)) > 0
  and (
    lower(split_part(split_part(source_url, '://', 2), '/', 1)) ~ '\.gov$'
    or lower(split_part(split_part(source_url, '://', 2), '/', 1)) = 'ercot.com'
    or lower(split_part(split_part(source_url, '://', 2), '/', 1)) = 'www.ercot.com'
    or lower(split_part(split_part(source_url, '://', 2), '/', 1)) ~ '\.ercot\.com$'
  )
  and not (
    coalesce(quality_flags, array[]::text[]) && array[
      'seo_duplicate',
      'duplicate',
      'duplicate_story',
      'duplicate_cluster',
      'near_duplicate',
      'noindex',
      'seo_noindex',
      'canonical_duplicate',
      'legacy_thin_content',
      'seo_legacy_single_source',
      'seo_low_value_commodity',
      'seo_false_multisource',
      'source_integrity_failure',
      'seo_off_topic',
      'site_boundary_violation',
      'gsc_zero_impression_hold_2026_09_03'
    ]::text[]
  );
