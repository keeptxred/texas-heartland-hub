-- Ensure duplicate quarantine remains final after sports ownership/routing triggers.
-- Preserve rows; published/native rows remain untouched.

DROP TRIGGER IF EXISTS zzzzzzzzzzzzz_guard_pro_sports_duplicate_title ON public.texas_news_feed;
CREATE TRIGGER zzzzzzzzzzzzz_guard_pro_sports_duplicate_title
BEFORE INSERT OR UPDATE OF title, trend_source, target_site, target_section, viral_signals
ON public.texas_news_feed
FOR EACH ROW
EXECUTE FUNCTION public.guard_pro_sports_duplicate_title();

-- Touch title so the final duplicate guard executes after ownership triggers.
WITH ranked AS (
  SELECT id,
         row_number() OVER (
           PARTITION BY lower(btrim(title))
           ORDER BY
             CASE WHEN target_site = 'texasdefined' AND target_section = 'Sports'
                       AND coalesce((viral_signals->>'duplicate_title_quarantine')::boolean,false)=false THEN 0 ELSE 1 END,
             CASE WHEN texasdefined_slug IS NOT NULL THEN 0 ELSE 1 END,
             viral_score DESC,
             pub_date DESC NULLS LAST,
             id DESC
         ) AS rn
  FROM public.texas_news_feed
  WHERE trend_source = 'Texas Pro Sports — Daily Discovery'
    AND internal_slug IS NULL
    AND texasdefined_slug IS NULL
)
UPDATE public.texas_news_feed f
SET title = f.title
FROM ranked r
WHERE f.id = r.id
  AND r.rn > 1;
