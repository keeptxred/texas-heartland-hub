-- Prevent public texas_news_feed surfaces from linking to articles that the
-- newsroom has deliberately removed from the search/discovery footprint.
--
-- Quarantined articles remain directly reachable, but feed cards must fall
-- back to the original source URL instead of advertising an internal noindex
-- or low-value article. Re-run the same centralized editorial markers used by
-- the application because this database trigger is the final link authority.

CREATE OR REPLACE FUNCTION public.sync_news_feed_article_link()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  quarantine_flags constant text[] := ARRAY[
    'seo_duplicate',
    'duplicate',
    'duplicate_story',
    'duplicate_cluster',
    'near_duplicate',
    'noindex',
    'seo_noindex',
    'canonical_duplicate',
    'legacy_thin_content',
    'seo_legacy_single_source',
    'seo_low_value_commodity',
    'seo_false_multisource',
    'source_integrity_failure',
    'seo_off_topic'
  ]::text[];
  is_quarantined boolean := coalesce(NEW.quality_flags, ARRAY[]::text[]) && quarantine_flags;
BEGIN
  IF is_quarantined THEN
    UPDATE public.texas_news_feed
       SET internal_slug = NULL
     WHERE internal_slug = NEW.slug;
    RETURN NEW;
  END IF;

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
AFTER INSERT OR UPDATE OF slug, source_url, quality_flags
ON public.daily_articles
FOR EACH ROW
EXECUTE FUNCTION public.sync_news_feed_article_link();

-- Remove existing pointers to any article that now belongs to the quarantine.
UPDATE public.texas_news_feed AS feed
   SET internal_slug = NULL
 WHERE feed.internal_slug IS NOT NULL
   AND EXISTS (
     SELECT 1
       FROM public.daily_articles AS article
      WHERE article.slug = feed.internal_slug
        AND coalesce(article.quality_flags, ARRAY[]::text[]) && ARRAY[
          'seo_duplicate',
          'duplicate',
          'duplicate_story',
          'duplicate_cluster',
          'near_duplicate',
          'noindex',
          'seo_noindex',
          'canonical_duplicate',
          'legacy_thin_content',
          'seo_legacy_single_source',
          'seo_low_value_commodity',
          'seo_false_multisource',
          'source_integrity_failure',
          'seo_off_topic'
        ]::text[]
   );

-- Restore exact source-URL links only for non-quarantined surviving articles.
-- If historical duplicates share a source URL, prefer the newest eligible row.
WITH eligible_article AS (
  SELECT DISTINCT ON (source_url)
         source_url,
         slug
    FROM public.daily_articles
   WHERE source_url IS NOT NULL
     AND btrim(source_url) <> ''
     AND NOT (
       coalesce(quality_flags, ARRAY[]::text[]) && ARRAY[
         'seo_duplicate',
         'duplicate',
         'duplicate_story',
         'duplicate_cluster',
         'near_duplicate',
         'noindex',
         'seo_noindex',
         'canonical_duplicate',
         'legacy_thin_content',
         'seo_legacy_single_source',
         'seo_low_value_commodity',
         'seo_false_multisource',
         'source_integrity_failure',
         'seo_off_topic'
       ]::text[]
     )
   ORDER BY source_url, published_at DESC NULLS LAST, slug DESC
)
UPDATE public.texas_news_feed AS feed
   SET internal_slug = eligible.slug
  FROM eligible_article AS eligible
 WHERE feed.internal_slug IS NULL
   AND feed.link = eligible.source_url;

COMMENT ON FUNCTION public.sync_news_feed_article_link() IS
  'Links imported feed rows only to search-eligible daily_articles and automatically clears pointers when an article becomes SEO quarantined.';
