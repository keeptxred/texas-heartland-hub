-- AdSense Phase 6: persistent readiness audit views.
-- These internal diagnostics mirror the crawl/index quality rules used by the app.

CREATE OR REPLACE VIEW public.adsense_cloud_article_readiness
WITH (security_invoker = true)
AS
WITH article_state AS (
  SELECT
    article.id, article.slug, article.title, article.category, article.kind,
    article.author, article.source_name, article.source_url, article.published_at,
    article.content_quality_score,
    coalesce(article.quality_flags, ARRAY[]::text[]) AS quality_flags,
    CASE WHEN article.body_json IS NOT NULL AND jsonb_typeof(article.body_json)='object' AND jsonb_typeof(article.body_json->'sources')='array'
      THEN jsonb_array_length(article.body_json->'sources') ELSE 0 END AS source_reference_count,
    CASE WHEN article.body_json IS NOT NULL AND jsonb_typeof(article.body_json)='object'
      AND nullif(btrim(article.body_json->>'updated'),'') IS NOT NULL
      AND pg_input_is_valid(article.body_json->>'updated','timestamp with time zone')
      THEN (article.body_json->>'updated')::timestamptz ELSE NULL END AS body_updated_at,
    coalesce(article.quality_flags,ARRAY[]::text[]) && ARRAY[
      'seo_duplicate','duplicate','duplicate_story','duplicate_cluster','near_duplicate',
      'noindex','seo_noindex','canonical_duplicate','legacy_thin_content',
      'seo_legacy_single_source','seo_low_value_commodity','seo_false_multisource',
      'source_integrity_failure','seo_off_topic','site_boundary_violation'
    ]::text[] AS quarantined
  FROM public.daily_articles AS article
), assessed AS (
  SELECT state.*,
    array_remove(ARRAY[
      CASE WHEN state.quarantined THEN 'quarantined' END,
      CASE WHEN NOT state.quarantined AND state.category='Non-Political' THEN 'legacy_nonpolitical_taxonomy' END,
      CASE WHEN NOT state.quarantined AND state.source_name ~* '\mMultiple([[:space:]]+independent)?[[:space:]]+sources?\M' AND state.source_reference_count < 2 THEN 'multisource_label_without_two_references' END,
      CASE WHEN NOT state.quarantined AND coalesce(state.content_quality_score,0) < 60 THEN 'low_content_quality_score' END,
      CASE WHEN NOT state.quarantined AND state.source_url IS NULL AND state.source_reference_count=0 THEN 'missing_source_evidence' END,
      CASE WHEN state.body_updated_at IS NOT NULL AND state.body_updated_at < state.published_at THEN 'updated_before_published' END
    ]::text[],NULL) AS readiness_issues
  FROM article_state AS state
)
SELECT id,slug,title,category,kind,author,source_name,source_url,published_at,body_updated_at,
  content_quality_score,quality_flags,source_reference_count,quarantined,readiness_issues,
  NOT quarantined AND cardinality(readiness_issues)=0 AS adsense_ready
FROM assessed;

CREATE OR REPLACE VIEW public.adsense_readiness_summary
WITH (security_invoker = true)
AS
SELECT
  count(*)::bigint AS total_cloud_articles,
  count(*) FILTER (WHERE quarantined)::bigint AS quarantined_articles,
  count(*) FILTER (WHERE NOT quarantined)::bigint AS indexable_articles,
  count(*) FILTER (WHERE adsense_ready)::bigint AS ready_indexable_articles,
  count(*) FILTER (WHERE NOT quarantined AND cardinality(readiness_issues)>0)::bigint AS indexable_articles_with_blockers,
  count(*) FILTER (WHERE 'legacy_nonpolitical_taxonomy'=ANY(readiness_issues))::bigint AS legacy_taxonomy_blockers,
  count(*) FILTER (WHERE 'multisource_label_without_two_references'=ANY(readiness_issues))::bigint AS multisource_structure_blockers,
  count(*) FILTER (WHERE 'low_content_quality_score'=ANY(readiness_issues))::bigint AS low_quality_blockers,
  count(*) FILTER (WHERE 'missing_source_evidence'=ANY(readiness_issues))::bigint AS source_evidence_blockers,
  count(*) FILTER (WHERE 'updated_before_published'=ANY(readiness_issues))::bigint AS chronology_blockers,
  (SELECT count(*)::bigint FROM public.active_cross_site_publication_collisions) AS active_cross_site_collisions
FROM public.adsense_cloud_article_readiness;

COMMENT ON VIEW public.adsense_cloud_article_readiness IS 'Internal per-article AdSense readiness audit: quarantine state, source structure, taxonomy, chronology, quality score, and blockers.';
COMMENT ON VIEW public.adsense_readiness_summary IS 'Internal aggregate AdSense readiness counts for the cloud article inventory and active cross-site collision state.';
