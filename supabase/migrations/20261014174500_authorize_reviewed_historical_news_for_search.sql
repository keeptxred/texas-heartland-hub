-- Four manually reviewed, source-reconstructed historical KeepTXRed articles
-- passed official-source checks, 700+ editorial words, >=90 quality and
-- Cloudflare v4 visual-match validation. They remain noindex because the
-- *separate* emergency cloud-news search suppression requires explicit
-- editorial authority, review and primary-source provenance flags.
--
-- Grant ONLY the three existing manual-review lane flags to these exact
-- historical URLs. Do not relax the site's suppression rule globally, do not
-- permit unreviewed/live-stub headlines, and keep normal readiness/ownership
-- checks operative. Original historical copy is disclosed as unavailable.
WITH manually_reviewed AS (
  SELECT d.slug
  FROM public.daily_articles AS d
  WHERE d.slug IN (
    'live-2026-06-28-governor-abbott-announces-axiom-space-redomiciles-in-texas-gcfyg',
    'live-2026-07-02-governor-abbott-selects-don-huffines-to-serve-as-new-texas-comptroller-whlu3f',
    'live-2026-07-07-governor-abbott-orders-prompt-investigation-into-birth-tourism-package-wf40tc',
    'live-2026-07-12-governor-abbott-deploys-tactical-emergency-resources-as-flash-flood-th-dslu6i'
  )
    AND d.kind = 'news'
    AND d.content_quality_score >= 90
    AND d.source_url LIKE 'https://gov.texas.gov/%'
    AND d.image_generation_status = 'ready'
    AND d.image_validation_note LIKE 'stored-cloudflare-vision-v4 ok:%'
    AND d.featured_image_url LIKE 'https://commons.wikimedia.org/wiki/Special:Redirect/file/%'
    AND d.quality_flags @> ARRAY['legacy_url_restored','official_source_restored']::text[]
    AND NOT d.quality_flags && ARRAY[
      'legacy_thin_content','seo_noindex','seo_off_topic',
      'chatgpt-admin-ignored','site_boundary_violation','duplicate_canonical'
    ]::text[]
    AND jsonb_typeof(d.body_json->'intro') = 'array'
    AND jsonb_array_length(d.body_json->'intro') >= 2
    AND jsonb_typeof(d.body_json->'sections') = 'array'
    AND jsonb_array_length(d.body_json->'sections') >= 5
    AND jsonb_typeof(d.body_json->'sources') = 'array'
    AND jsonb_array_length(d.body_json->'sources') >= 3
    AND length(d.body_json::text) > 6000
)
UPDATE public.daily_articles AS d
SET quality_flags = ARRAY(
  SELECT DISTINCT flag
  FROM unnest(
    coalesce(d.quality_flags,'{}'::text[])
    || ARRAY['search_recovery_authority','editorial_reviewed','primary_sources']::text[]
  ) AS flags(flag)
  ORDER BY flag
)
FROM manually_reviewed AS m
WHERE d.slug = m.slug
  AND NOT d.quality_flags @> ARRAY[
    'search_recovery_authority','editorial_reviewed','primary_sources'
  ]::text[];
