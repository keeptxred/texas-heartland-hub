-- AdSense low-value-content cleanup: align the persistent readiness audit
-- with the stricter public/indexability floor used by the application.

CREATE OR REPLACE VIEW public.adsense_cloud_article_readiness
WITH (security_invoker = true)
AS
WITH article_state AS (
  SELECT
    article.id,
    article.slug,
    article.title,
    article.category,
    article.kind,
    article.author,
    article.source_name,
    article.source_url,
    article.published_at,
    article.content_quality_score,
    coalesce(article.quality_flags, ARRAY[]::text[]) AS quality_flags,
    CASE
      WHEN article.body_json IS NOT NULL
        AND jsonb_typeof(article.body_json) = 'object'
        AND jsonb_typeof(article.body_json->'sources') = 'array'
      THEN jsonb_array_length(article.body_json->'sources')
      ELSE 0
    END AS source_reference_count,
    CASE
      WHEN article.body_json IS NOT NULL
        AND jsonb_typeof(article.body_json) = 'object'
        AND nullif(btrim(article.body_json->>'updated'), '') IS NOT NULL
        AND pg_input_is_valid(article.body_json->>'updated', 'timestamp with time zone')
      THEN (article.body_json->>'updated')::timestamptz
      ELSE NULL
    END AS body_updated_at,
    coalesce(article.quality_flags, ARRAY[]::text[]) && ARRAY[
      'seo_duplicate', 'duplicate', 'duplicate_story', 'duplicate_cluster',
      'near_duplicate', 'noindex', 'seo_noindex', 'canonical_duplicate',
      'legacy_thin_content', 'seo_legacy_single_source',
      'seo_low_value_commodity', 'seo_false_multisource',
      'source_integrity_failure', 'seo_off_topic', 'site_boundary_violation'
    ]::text[] AS quarantined,
    article.featured_image_url,
    article.image_alt_text,
    article.image_generation_status
  FROM public.daily_articles AS article
), assessed AS (
  SELECT
    state.*,
    array_remove(ARRAY[
      CASE WHEN state.quarantined THEN 'quarantined' END,
      CASE
        WHEN NOT state.quarantined AND state.category = 'Non-Political'
        THEN 'legacy_nonpolitical_taxonomy'
      END,
      CASE
        WHEN NOT state.quarantined
          AND state.source_name ~* '\mMultiple([[:space:]]+independent)?[[:space:]]+sources?\M'
          AND state.source_reference_count < 2
        THEN 'multisource_label_without_two_references'
      END,
      CASE
        WHEN NOT state.quarantined AND coalesce(state.content_quality_score, 0) < 65
        THEN 'low_content_quality_score'
      END,
      CASE
        WHEN NOT state.quarantined
          AND state.source_url IS NULL
          AND state.source_reference_count = 0
        THEN 'missing_source_evidence'
      END,
      CASE
        WHEN state.body_updated_at IS NOT NULL AND state.body_updated_at < state.published_at
        THEN 'updated_before_published'
      END
    ]::text[], NULL) AS readiness_issues,
    (
      nullif(btrim(coalesce(state.featured_image_url, '')), '') IS NOT NULL
      AND nullif(btrim(coalesce(state.image_alt_text, '')), '') IS NOT NULL
      AND coalesce(state.image_generation_status, '') = 'ready'
    ) AS image_ready
  FROM article_state AS state
)
SELECT
  id,
  slug,
  title,
  category,
  kind,
  author,
  source_name,
  source_url,
  published_at,
  body_updated_at,
  content_quality_score,
  quality_flags,
  source_reference_count,
  quarantined,
  readiness_issues,
  NOT quarantined AND cardinality(readiness_issues) = 0 AS adsense_ready,
  featured_image_url,
  image_alt_text,
  image_generation_status,
  image_ready,
  NOT quarantined AND cardinality(readiness_issues) = 0 AND image_ready AS adsense_fully_ready
FROM assessed;

COMMENT ON VIEW public.adsense_cloud_article_readiness IS
  'Internal per-article AdSense audit separating content/indexability readiness from featured-image/Discover readiness; public content quality floor is 65.';
