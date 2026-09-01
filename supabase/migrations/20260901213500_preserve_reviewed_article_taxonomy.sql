-- ADSENSE_TAXONOMY_SYNC_HARDENING
-- The historical pillar->category bridge predates the expanded newsroom category
-- vocabulary. Its hourly cron was still translating the broad
-- texas-politics-government pillar back to Legislature and could also translate
-- valid economy/public-safety coverage to Non-Political. That silently undoes
-- reviewed taxonomy and creates misleading public labels during AdSense review.

CREATE OR REPLACE FUNCTION public.legacy_article_category_for_pillar(pillar text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE pillar
    WHEN 'texas-politics-government' THEN 'Government'
    WHEN 'texas-elections' THEN 'Elections'
    WHEN 'texas-border-immigration' THEN 'Border'
    WHEN 'texas-energy-oil' THEN 'Energy'
    WHEN 'texas-economy-small-business' THEN 'Business'
    WHEN 'texas-agriculture-rural' THEN 'Texas News'
    WHEN 'texas-veterans-military' THEN 'Texas News'
    WHEN 'texas-law-enforcement-public-safety' THEN 'Government'
    WHEN 'texas-laws-legislature' THEN 'Legislature'
    ELSE 'Non-Political'
  END;
$$;

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
    AND d.category IS DISTINCT FROM public.legacy_article_category_for_pillar(a.pillar_slug)
  ON CONFLICT (article_slug) DO UPDATE SET
    old_category = EXCLUDED.old_category,
    new_category = EXCLUDED.new_category,
    pillar_slug = EXCLUDED.pillar_slug,
    reclassified_at = EXCLUDED.reclassified_at;

  UPDATE public.daily_articles d
  SET category = public.legacy_article_category_for_pillar(a.pillar_slug)
  FROM public.article_pillar_assignments a
  WHERE a.article_slug = d.slug
    AND a.classifier_version NOT LIKE '%texasdefined-excluded'
    AND NOT ('taxonomy_locked' = ANY(coalesce(d.quality_flags, '{}'::text[])))
    AND NOT ('taxonomy_corrected_adsense_review' = ANY(coalesce(d.quality_flags, '{}'::text[])))
    AND d.category IS DISTINCT FROM public.legacy_article_category_for_pillar(a.pillar_slug);

  GET DIAGNOSTICS changed_count = ROW_COUNT;
  RETURN changed_count;
END;
$$;

COMMENT ON FUNCTION public.sync_historical_article_categories_from_pillars() IS
  'Synchronizes legacy visible categories from canonical pillars without overwriting reviewed/locked taxonomy; uses the expanded newsroom category vocabulary.';

-- Restore the six AdSense-reviewed rows that the old hourly bridge reverted.
UPDATE public.daily_articles
SET
  category = CASE slug
    WHEN '2026-08-28-governor-abbott-names-new-leaders-across-texas-hvceej' THEN 'Government'
    WHEN '2026-08-26-abbott-asks-court-to-reject-minnesota-bid-to-force-extradition-of-ice-officer' THEN 'Government'
    WHEN 'live-2026-07-02-secretary-of-state-releases-july-3-texas-register-detailing-new-state--m0th5w' THEN 'Government'
    WHEN 'live-2026-07-02-denton-county-leader-selected-for-texas-woman-s-university-governing-b-4g0s76' THEN 'Education'
    WHEN 'live-2026-07-02-governor-greg-abbott-strengthens-executive-office-with-senior-leadersh-sy6o16' THEN 'Government'
    WHEN 'live-2026-06-29-governor-abbott-appoints-mason-as-director-of-the-office-of-state-fede-td5c1o' THEN 'Government'
    ELSE category
  END,
  quality_flags = ARRAY(
    SELECT DISTINCT flag
    FROM unnest(coalesce(quality_flags, '{}'::text[]) || ARRAY['taxonomy_corrected_adsense_review','taxonomy_locked']::text[]) AS flag
  )
WHERE slug IN (
  '2026-08-28-governor-abbott-names-new-leaders-across-texas-hvceej',
  '2026-08-26-abbott-asks-court-to-reject-minnesota-bid-to-force-extradition-of-ice-officer',
  'live-2026-07-02-secretary-of-state-releases-july-3-texas-register-detailing-new-state--m0th5w',
  'live-2026-07-02-denton-county-leader-selected-for-texas-woman-s-university-governing-b-4g0s76',
  'live-2026-07-02-governor-greg-abbott-strengthens-executive-office-with-senior-leadersh-sy6o16',
  'live-2026-06-29-governor-abbott-appoints-mason-as-director-of-the-office-of-state-fede-td5c1o'
);

-- Apply the modernized mapping to all other unlocked historical assignments now.
SELECT public.sync_historical_article_categories_from_pillars();
