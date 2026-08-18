-- KeepTXRed's public article taxonomy should describe its actual editorial beat.
-- `Non-Political` is a legacy catch-all from before lifestyle coverage moved to
-- TexasDefined. New KeepTXRed rows must resolve to a real KTR section instead.

CREATE OR REPLACE FUNCTION public.normalize_keeptxred_article_category()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  routed_site text;
  routed_section text;
BEGIN
  IF NEW.category IS DISTINCT FROM 'Non-Political' THEN
    RETURN NEW;
  END IF;

  IF NEW.kind LIKE 'sports-%' THEN
    NEW.category := 'Sports';
    RETURN NEW;
  END IF;

  IF NEW.source_url IS NOT NULL AND btrim(NEW.source_url) <> '' THEN
    SELECT feed.target_site, feed.target_section
      INTO routed_site, routed_section
      FROM public.texas_news_feed AS feed
     WHERE feed.link = NEW.source_url
     ORDER BY feed.pub_date DESC NULLS LAST, feed.id DESC
     LIMIT 1;
  END IF;

  -- TexasDefined-bound sources are rejected by the site-boundary trigger; do
  -- not disguise them as KeepTXRed content here.
  IF routed_site = 'texasdefined' THEN
    RETURN NEW;
  END IF;

  IF routed_site = 'keeptxred' AND routed_section IN (
    'Sports', 'Business', 'Politics', 'Elections', 'Texas News',
    'Energy', 'Education', 'Border', 'Tax & Spending', 'Government',
    'Legislature', 'Laws', 'Local Government'
  ) THEN
    NEW.category := routed_section;
  ELSE
    NEW.category := 'Texas News';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_normalize_keeptxred_article_category ON public.daily_articles;
CREATE TRIGGER trg_normalize_keeptxred_article_category
BEFORE INSERT OR UPDATE OF category, kind, source_url
ON public.daily_articles
FOR EACH ROW
EXECUTE FUNCTION public.normalize_keeptxred_article_category();

-- Repair only currently public-eligible legacy catch-all rows. Quarantined
-- historical rows stay untouched; they are no longer part of public discovery.
UPDATE public.daily_articles AS article
   SET category = CASE
     WHEN article.kind LIKE 'sports-%' THEN 'Sports'
     WHEN feed.target_site = 'keeptxred' AND feed.target_section IN (
       'Sports', 'Business', 'Politics', 'Elections', 'Texas News',
       'Energy', 'Education', 'Border', 'Tax & Spending', 'Government',
       'Legislature', 'Laws', 'Local Government'
     ) THEN feed.target_section
     ELSE 'Texas News'
   END
  FROM LATERAL (
    SELECT f.target_site, f.target_section
    FROM public.texas_news_feed AS f
    WHERE f.link = article.source_url
    ORDER BY f.pub_date DESC NULLS LAST, f.id DESC
    LIMIT 1
  ) AS feed
 WHERE article.category = 'Non-Political'
   AND NOT (
     coalesce(article.quality_flags, ARRAY[]::text[])
     && ARRAY[
       'seo_noindex', 'noindex', 'seo_off_topic', 'site_boundary_violation',
       'seo_false_multisource', 'source_integrity_failure', 'canonical_duplicate',
       'seo_duplicate'
     ]::text[]
   )
   AND coalesce(feed.target_site, 'keeptxred') = 'keeptxred';

COMMENT ON FUNCTION public.normalize_keeptxred_article_category() IS
  'Eliminates the legacy Non-Political catch-all from new KeepTXRed articles; uses sports kind or feed routing and otherwise falls back to Texas News.';
