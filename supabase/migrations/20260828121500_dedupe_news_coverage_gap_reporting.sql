-- De-duplicate coverage-gap reporting without deleting or mutating feed history.
-- Multiple discovery paths often ingest the same exact headline (for example,
-- Governor direct RSS plus a primary-source relay, or Tribune main plus topic
-- feeds). The newsroom should see one actionable gap per story, not one per
-- transport path.

CREATE OR REPLACE VIEW public.news_coverage_gaps AS
WITH eligible AS (
  SELECT
    id,
    title,
    source,
    link,
    pub_date,
    internal_slug,
    viral_score,
    classification_confidence,
    texas_relevance_score,
    source_reputation_score,
    routing_type,
    CASE
      WHEN internal_slug IS NOT NULL AND btrim(internal_slug) <> '' THEN 'covered'
      WHEN coalesce(cluster_json ->> 'publication_readiness', '') LIKE 'hold\_%' ESCAPE '\' THEN 'held_for_corroboration'
      WHEN coalesce(texas_relevance_score, 0) < 40 THEN 'low_texas_relevance'
      WHEN coalesce(source_reputation_score, 0) < 55 THEN 'low_source_reputation'
      WHEN coalesce(classification_confidence, 0) < 0.60 THEN 'low_classification_confidence'
      WHEN coalesce(viral_score, 0) < 55 THEN 'below_article_score'
      WHEN routing_type IN ('FACEBOOK_ONLY', 'REEL_CANDIDATE') THEN 'routing_gate'
      ELSE 'article_generation_or_publish_gap'
    END AS gap_reason,
    coalesce(viral_score, 0)::integer AS coverage_priority,
    pillar_slug,
    pillar_classified_at,
    lower(regexp_replace(btrim(title), '[^a-zA-Z0-9]+', ' ', 'g')) AS story_key
  FROM public.texas_news_feed
  WHERE target_site = 'keeptxred'
    AND (internal_slug IS NULL OR btrim(internal_slug) = '')
    AND pub_date >= now() - interval '7 days'
    AND (
      coalesce(texas_relevance_score, 0) >= 40
      OR coalesce(viral_score, 0) >= 55
      OR routing_type IN ('SEO_ARTICLE', 'BOTH')
    )
    AND coalesce((viral_signals ->> 'source_contamination')::boolean, false) = false
    AND coalesce(viral_signals ->> 'exclusion_reason', '') NOT ILIKE '%utility%'
    AND lower(btrim(title)) <> ALL (ARRAY[
      'map',
      'cameras',
      'incidents',
      'file viewing information',
      'contracting opportunities',
      '- texas workforce commission',
      'texas 10 most wanted - tx dps',
      'still wanted - tx dps'
    ])
    AND lower(btrim(title)) !~ '^(fugitive|captured|sex offender|criminal illegal immigrant) details id [0-9]+$'
), ranked AS (
  SELECT
    eligible.*,
    row_number() OVER (
      PARTITION BY story_key
      ORDER BY
        coverage_priority DESC,
        coalesce(source_reputation_score, 0) DESC,
        coalesce(classification_confidence, 0) DESC,
        pub_date ASC,
        id ASC
    ) AS story_rank
  FROM eligible
)
SELECT
  id,
  title,
  source,
  link,
  pub_date,
  internal_slug,
  viral_score,
  classification_confidence,
  texas_relevance_score,
  source_reputation_score,
  routing_type,
  gap_reason,
  coverage_priority,
  pillar_slug,
  pillar_classified_at
FROM ranked
WHERE story_rank = 1;

COMMENT ON VIEW public.news_coverage_gaps IS
  'Recent KTR-relevant feed stories without a native article slug, de-duplicated by normalized exact headline and represented by the strongest source/candidate row.';

GRANT SELECT ON public.news_coverage_gaps TO anon;
GRANT SELECT ON public.news_coverage_gaps TO authenticated;
GRANT SELECT ON public.news_coverage_gaps TO service_role;
