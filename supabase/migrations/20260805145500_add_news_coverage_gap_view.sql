-- Surface important Texas feed items that did not become native articles.
-- This is intentionally a view over existing ingestion fields: no new storage,
-- AI calls, or recurring cost. Admin/reporting clients can query it directly.

CREATE OR REPLACE VIEW public.news_coverage_gaps AS
SELECT
  id,
  title,
  source,
  link,
  pub_date,
  category,
  internal_slug,
  viral_score,
  classification_confidence,
  texas_relevance_score,
  source_reputation_score,
  routing_type,
  CASE
    WHEN internal_slug IS NOT NULL AND btrim(internal_slug) <> '' THEN 'covered'
    WHEN coalesce(texas_relevance_score, 0) < 40 THEN 'low_texas_relevance'
    WHEN coalesce(source_reputation_score, 0) < 55 THEN 'low_source_reputation'
    WHEN coalesce(classification_confidence, 0) < 0.60 THEN 'low_classification_confidence'
    WHEN coalesce(viral_score, 0) < 55 THEN 'below_article_score'
    WHEN routing_type IN ('FACEBOOK_ONLY', 'REEL_CANDIDATE') THEN 'routing_gate'
    ELSE 'article_generation_or_publish_gap'
  END AS gap_reason,
  GREATEST(
    coalesce(texas_relevance_score, 0),
    coalesce(viral_score, 0)
  ) AS coverage_priority
FROM public.texas_news_feed
WHERE (internal_slug IS NULL OR btrim(internal_slug) = '')
  AND pub_date >= now() - interval '7 days'
  AND (
    coalesce(texas_relevance_score, 0) >= 40
    OR coalesce(viral_score, 0) >= 55
    OR routing_type IN ('SEO_ARTICLE', 'BOTH')
  );

COMMENT ON VIEW public.news_coverage_gaps IS
  'Recent Texas-relevant feed items without a native article slug, with deterministic failure reasons.';

GRANT SELECT ON public.news_coverage_gaps TO authenticated;
GRANT SELECT ON public.news_coverage_gaps TO service_role;
