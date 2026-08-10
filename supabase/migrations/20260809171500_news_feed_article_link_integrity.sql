-- Keep the newsroom import row and the published article row synchronized.
--
-- Why this exists:
-- 1. A daily_articles insert can succeed while the application-level
--    texas_news_feed.internal_slug writeback fails or times out. The next run
--    then treats the same source as unpublished and can spend another rewrite
--    attempt or create duplicate coverage.
-- 2. If an article is deliberately removed, an old internal_slug can leave the
--    feed card pointing at a missing /news/:slug URL forever.
--
-- The database is the final authority for both relationships, so enforce the
-- link at the database boundary in addition to the application writeback.

CREATE OR REPLACE FUNCTION public.sync_news_feed_article_link()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.source_url IS NOT NULL AND btrim(NEW.source_url) <> '' THEN
    UPDATE public.texas_news_feed
       SET internal_slug = NEW.slug
     WHERE link = NEW.source_url
       AND internal_slug IS DISTINCT FROM NEW.slug;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_news_feed_article_link ON public.daily_articles;
CREATE TRIGGER trg_sync_news_feed_article_link
AFTER INSERT OR UPDATE OF slug, source_url
ON public.daily_articles
FOR EACH ROW
EXECUTE FUNCTION public.sync_news_feed_article_link();

CREATE OR REPLACE FUNCTION public.clear_deleted_news_feed_article_link()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.texas_news_feed
     SET internal_slug = NULL
   WHERE internal_slug = OLD.slug;

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_clear_deleted_news_feed_article_link ON public.daily_articles;
CREATE TRIGGER trg_clear_deleted_news_feed_article_link
AFTER DELETE
ON public.daily_articles
FOR EACH ROW
EXECUTE FUNCTION public.clear_deleted_news_feed_article_link();

-- Repair stale pointers before backfilling missing ones.
UPDATE public.texas_news_feed AS feed
   SET internal_slug = NULL
 WHERE feed.internal_slug IS NOT NULL
   AND NOT EXISTS (
     SELECT 1
       FROM public.daily_articles AS article
      WHERE article.slug = feed.internal_slug
   );

-- Repair feed rows whose article already exists but whose application-level
-- writeback was lost. If historical duplicates share the same source URL, use
-- the most recently published surviving article.
WITH canonical_article AS (
  SELECT DISTINCT ON (source_url)
         source_url,
         slug
    FROM public.daily_articles
   WHERE source_url IS NOT NULL
     AND btrim(source_url) <> ''
   ORDER BY source_url, published_at DESC NULLS LAST, slug DESC
)
UPDATE public.texas_news_feed AS feed
   SET internal_slug = canonical.slug
  FROM canonical_article AS canonical
 WHERE feed.internal_slug IS NULL
   AND feed.link = canonical.source_url;

COMMENT ON FUNCTION public.sync_news_feed_article_link() IS
  'Ensures a successfully published daily_articles row immediately links its matching imported texas_news_feed source row.';

COMMENT ON FUNCTION public.clear_deleted_news_feed_article_link() IS
  'Clears texas_news_feed.internal_slug when the referenced article is deleted so stale feed cards cannot point at 404s.';
