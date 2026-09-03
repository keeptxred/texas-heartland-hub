-- Keep the persistent AdSense readiness ledger aligned with the application-level
-- public/indexability gate in src/lib/public-article-readiness.ts.
--
-- The previous audit still used a 65 quality floor and did not account for
-- retired KTR taxonomy, TexasDefined discovery categories, discovery-only source
-- hosts, or repeated-body suppression. That could label a URL AdSense-ready while
-- the public route correctly emitted noindex.

CREATE OR REPLACE VIEW public.adsense_cloud_article_readiness
WITH (security_invoker = true)
AS
WITH article_state AS (
  SELECT
    article.id,
    article.slug,
    article.title,
    article.category,
    article.discover_category,
    article.kind,
    article.author,
    article.source_name,
    article.source_url,
    article.published_at,
    article.body_json,
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
), public_parity AS (
  SELECT
    state.*,
    coalesce(source_stats.qualifying_source_count, 0) AS qualifying_source_count,
    coalesce(repetition.duplicate_paragraph_occurrences, 0) AS duplicate_paragraph_occurrences
  FROM article_state AS state
  LEFT JOIN LATERAL (
    SELECT count(DISTINCT candidate.url)::integer AS qualifying_source_count
    FROM (
      SELECT nullif(btrim(state.source_url), '') AS url
      UNION ALL
      SELECT nullif(btrim(source.value->>'url'), '') AS url
      FROM jsonb_array_elements(
        CASE
          WHEN state.body_json IS NOT NULL
            AND jsonb_typeof(state.body_json) = 'object'
            AND jsonb_typeof(state.body_json->'sources') = 'array'
          THEN state.body_json->'sources'
          ELSE '[]'::jsonb
        END
      ) AS source(value)
    ) AS candidate
    WHERE candidate.url IS NOT NULL
      AND NOT (
        lower(regexp_replace(candidate.url, '^https?://([^/:]+).*$', '\1', 'i')) IN (
          'news.google.com', 'reddit.com', 'www.reddit.com', 'old.reddit.com'
        )
        OR lower(regexp_replace(candidate.url, '^https?://([^/:]+).*$', '\1', 'i')) LIKE '%.reddit.com'
      )
  ) AS source_stats ON true
  LEFT JOIN LATERAL (
    SELECT coalesce(sum(greatest(grouped.occurrences - 1, 0)), 0)::integer AS duplicate_paragraph_occurrences
    FROM (
      SELECT normalized, count(*)::integer AS occurrences
      FROM (
        SELECT lower(regexp_replace(btrim(paragraph.value), '[[:space:]]+', ' ', 'g')) AS normalized
        FROM jsonb_array_elements(
          CASE
            WHEN state.body_json IS NOT NULL
              AND jsonb_typeof(state.body_json) = 'object'
              AND jsonb_typeof(state.body_json->'sections') = 'array'
            THEN state.body_json->'sections'
            ELSE '[]'::jsonb
          END
        ) AS section(value)
        CROSS JOIN LATERAL jsonb_array_elements_text(
          CASE
            WHEN jsonb_typeof(section.value->'paragraphs') = 'array'
            THEN section.value->'paragraphs'
            ELSE '[]'::jsonb
          END
        ) AS paragraph(value)
      ) AS normalized_paragraphs
      WHERE length(normalized) >= 120
      GROUP BY normalized
    ) AS grouped
  ) AS repetition ON true
), assessed AS (
  SELECT
    state.*,
    array_remove(ARRAY[
      CASE WHEN state.quarantined THEN 'quarantined' END,
      CASE
        WHEN NOT state.quarantined AND lower(btrim(coalesce(state.category, ''))) = 'non-political'
        THEN 'legacy_nonpolitical_taxonomy'
      END,
      CASE
        WHEN NOT state.quarantined
          AND lower(btrim(coalesce(state.category, ''))) IN ('sports', 'sports culture', 'culture & identity')
        THEN 'retired_ktr_taxonomy'
      END,
      CASE
        WHEN NOT state.quarantined
          AND lower(btrim(coalesce(state.discover_category, ''))) IN ('texas culture', 'texas history')
        THEN 'texasdefined_discovery_taxonomy'
      END,
      CASE
        WHEN NOT state.quarantined
          AND state.source_name ~* '\mMultiple([[:space:]]+independent)?[[:space:]]+sources?\M'
          AND state.source_reference_count < 2
        THEN 'multisource_label_without_two_references'
      END,
      CASE
        WHEN NOT state.quarantined AND coalesce(state.content_quality_score, 0) < 70
        THEN 'low_content_quality_score'
      END,
      CASE
        WHEN NOT state.quarantined
          AND state.source_url IS NULL
          AND state.source_reference_count = 0
        THEN 'missing_source_evidence'
      END,
      CASE
        WHEN NOT state.quarantined AND state.qualifying_source_count = 0
        THEN 'discovery_only_source_evidence'
      END,
      CASE
        WHEN NOT state.quarantined AND state.duplicate_paragraph_occurrences > 2
        THEN 'repeated_body_paragraphs'
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
  FROM public_parity AS state
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
  'Internal per-article AdSense audit aligned with the public article readiness gate: KTR taxonomy, quality floor 70, source provenance, repetition, chronology, quarantine, and image readiness.';
