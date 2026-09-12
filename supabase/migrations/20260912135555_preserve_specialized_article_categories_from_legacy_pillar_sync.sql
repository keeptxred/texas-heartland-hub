CREATE OR REPLACE FUNCTION public.sync_historical_article_categories_from_pillars()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  changed_count integer := 0;
BEGIN
  INSERT INTO public.article_category_reclassification_log (
    article_slug,
    old_category,
    new_category,
    pillar_slug,
    reclassified_at
  )
  SELECT
    d.slug,
    d.category,
    public.legacy_article_category_for_pillar(a.pillar_slug),
    a.pillar_slug,
    now()
  FROM public.daily_articles d
  JOIN public.article_pillar_assignments a ON a.article_slug = d.slug
  WHERE a.classifier_version NOT LIKE '%texasdefined-excluded'
    AND NOT ('taxonomy_locked' = ANY(coalesce(d.quality_flags, '{}'::text[])))
    AND NOT ('taxonomy_corrected_adsense_review' = ANY(coalesce(d.quality_flags, '{}'::text[])))
    AND (
      d.category IS NULL
      OR btrim(d.category) = ''
      OR lower(btrim(d.category)) IN (
        'government','elections','border','energy','business','texas news','legislature','non-political'
      )
    )
    AND d.category IS DISTINCT FROM public.legacy_article_category_for_pillar(a.pillar_slug)
  ON CONFLICT (article_slug) DO UPDATE SET
    old_category = EXCLUDED.old_category,
    new_category = EXCLUDED.new_category,
    pillar_slug = EXCLUDED.pillar_slug,
    reclassified_at = EXCLUDED.reclassified_at;

  UPDATE daily_articles d
  SET category = public.legacy_article_category_for_pillar(a.pillar_slug)
  FROM public.article_pillar_assignments a
  WHERE a.article_slug = d.slug
    AND a.classifier_version NOT LIKE '%texasdefined-excluded'
    AND NOT ('taxonomy_locked' = ANY(coalesce(d.quality_flags, '{}'::text[])))
    AND NOT ('taxonomy_corrected_adsense_review' = ANY(coalesce(d.quality_flags, '{}'::text[])))
    AND (
      d.category IS NULL
      OR btrim(d.category) = ''
      OR lower(btrim(d.category)) IN (
        'government','elections','border','energy','business','texas news','legislature','non-political'
      )
    )
    AND d.category IS DISTINCT FROM public.legacy_article_category_for_pillar(a.pillar_slug);

  GET DIAGNOSTICS changed_count = ROW_COUNT;
  RETURN changed_count;
END;
$$;

COMMENT ON FUNCTION public.sync_historical_article_categories_from_pillars() IS
  'Synchronizes only legacy newsroom categories from canonical pillars. Preserves newer specialized categories such as Sports, College Sports, Weather, Education, Laws, Politics, and other reviewed taxonomy unless explicitly reclassified by their owning classifier.';
