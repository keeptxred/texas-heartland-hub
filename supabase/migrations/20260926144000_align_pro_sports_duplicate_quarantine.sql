-- Align pro-sports duplicate quarantine with current TexasDefined sports ownership.
-- Preserve all rows for audit/history; never delete or publish content.

CREATE OR REPLACE FUNCTION public.guard_pro_sports_duplicate_title()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF NEW.trend_source = 'Texas Pro Sports — Daily Discovery'
     AND NEW.internal_slug IS NULL
     AND NEW.texasdefined_slug IS NULL
     AND EXISTS (
       SELECT 1
       FROM public.texas_news_feed f
       WHERE f.trend_source = NEW.trend_source
         AND lower(btrim(f.title)) = lower(btrim(NEW.title))
         AND f.id IS DISTINCT FROM NEW.id
     ) THEN
    NEW.target_site := 'review';
    NEW.target_section := 'Unclassified';
    NEW.ready_for_rewrite := false;
    NEW.viral_score := 0;
    NEW.classification_confidence := greatest(coalesce(NEW.classification_confidence, 0), 1);
    NEW.viral_scored_at := coalesce(NEW.viral_scored_at, now());
    NEW.viral_signals := coalesce(NEW.viral_signals, '{}'::jsonb) || jsonb_build_object(
      'duplicate_title_quarantine', true,
      'auto_publish_eligible', false,
      'editorial_lane', 'REVIEW',
      'exclusion_reason', 'Duplicate Texas Pro Sports discovery title',
      'routing_lock', true,
      'routing_locked_site', 'review',
      'routing_locked_section', 'Unclassified'
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_pro_sports_duplicate_title ON public.texas_news_feed;
DROP TRIGGER IF EXISTS zzzzzzzzzzzzz_guard_pro_sports_duplicate_title ON public.texas_news_feed;
CREATE TRIGGER zzzzzzzzzzzzz_guard_pro_sports_duplicate_title
BEFORE INSERT OR UPDATE OF title, trend_source
ON public.texas_news_feed
FOR EACH ROW
EXECUTE FUNCTION public.guard_pro_sports_duplicate_title();

WITH ranked AS (
  SELECT id,
         row_number() OVER (
           PARTITION BY lower(btrim(title))
           ORDER BY
             CASE WHEN target_site = 'texasdefined' AND target_section = 'Sports' THEN 0 ELSE 1 END,
             CASE WHEN texasdefined_slug IS NOT NULL THEN 0 ELSE 1 END,
             viral_score DESC,
             pub_date DESC NULLS LAST,
             id DESC
         ) AS rn
  FROM public.texas_news_feed
  WHERE trend_source = 'Texas Pro Sports — Daily Discovery'
    AND internal_slug IS NULL
    AND texasdefined_slug IS NULL
), duplicates AS (
  SELECT id FROM ranked WHERE rn > 1
)
UPDATE public.texas_news_feed f
SET target_site = 'review',
    target_section = 'Unclassified',
    ready_for_rewrite = false,
    viral_score = 0,
    classification_confidence = greatest(coalesce(f.classification_confidence, 0), 1),
    viral_scored_at = coalesce(f.viral_scored_at, now()),
    viral_signals = coalesce(f.viral_signals, '{}'::jsonb) || jsonb_build_object(
      'duplicate_title_quarantine', true,
      'auto_publish_eligible', false,
      'editorial_lane', 'REVIEW',
      'exclusion_reason', 'Duplicate Texas Pro Sports discovery title',
      'routing_lock', true,
      'routing_locked_site', 'review',
      'routing_locked_section', 'Unclassified'
    )
FROM duplicates d
WHERE f.id = d.id;
