-- AdSense Phase 36: KTR publication-gap operations must only see KTR-routed feed rows.
CREATE OR REPLACE VIEW public.news_coverage_gaps AS
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
    WHEN COALESCE(cluster_json ->> 'publication_readiness', '') LIKE 'hold\_%' ESCAPE '\' THEN 'held_for_corroboration'
    WHEN COALESCE(texas_relevance_score::integer, 0) < 40 THEN 'low_texas_relevance'
    WHEN COALESCE(source_reputation_score::integer, 0) < 55 THEN 'low_source_reputation'
    WHEN COALESCE(classification_confidence, 0::real) < 0.60 THEN 'low_classification_confidence'
    WHEN COALESCE(viral_score::integer, 0) < 55 THEN 'below_article_score'
    WHEN routing_type = ANY (ARRAY['FACEBOOK_ONLY'::text, 'REEL_CANDIDATE'::text]) THEN 'routing_gate'
    ELSE 'article_generation_or_publish_gap'
  END AS gap_reason,
  GREATEST(COALESCE(texas_relevance_score::integer, 0), COALESCE(viral_score::integer, 0)) AS coverage_priority,
  pillar_slug,
  pillar_classified_at
FROM public.texas_news_feed
WHERE target_site = 'keeptxred'
  AND (internal_slug IS NULL OR btrim(internal_slug) = '')
  AND pub_date >= (now() - interval '7 days')
  AND (
    COALESCE(texas_relevance_score::integer, 0) >= 40
    OR COALESCE(viral_score::integer, 0) >= 55
    OR routing_type = ANY (ARRAY['SEO_ARTICLE'::text, 'BOTH'::text])
  );

ALTER VIEW public.news_coverage_gaps SET (security_invoker = true);

COMMENT ON VIEW public.news_coverage_gaps IS
  'KeepTXRed-only feed coverage gaps. Review-held and TexasDefined-routed rows are excluded from KTR retry and health operations.';
