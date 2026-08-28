-- Keep syndicated/relay duplicates from entering the rewrite queue more than once.
-- Rows are preserved for audit/history; nothing is deleted or published.

CREATE OR REPLACE FUNCTION public.guard_pro_sports_duplicate_title()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.trend_source = 'Texas Pro Sports — Daily Discovery'
     AND NEW.internal_slug IS NULL
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
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_pro_sports_duplicate_title ON public.texas_news_feed;
CREATE TRIGGER trg_guard_pro_sports_duplicate_title
BEFORE INSERT OR UPDATE OF title, trend_source
ON public.texas_news_feed
FOR EACH ROW
EXECUTE FUNCTION public.guard_pro_sports_duplicate_title();

-- Quarantine existing duplicate-title rows while retaining the strongest routed row.
WITH ranked AS (
  SELECT id,
         row_number() OVER (
           PARTITION BY lower(btrim(title))
           ORDER BY
             CASE WHEN target_site = 'keeptxred' AND target_section = 'Sports' THEN 0 ELSE 1 END,
             viral_score DESC,
             pub_date DESC NULLS LAST,
             id DESC
         ) AS rn
  FROM public.texas_news_feed
  WHERE trend_source = 'Texas Pro Sports — Daily Discovery'
    AND internal_slug IS NULL
)
UPDATE public.texas_news_feed f
SET target_site = 'review',
    target_section = 'Unclassified',
    ready_for_rewrite = false
FROM ranked r
WHERE f.id = r.id
  AND r.rn > 1;
