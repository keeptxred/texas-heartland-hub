-- Enforce the KeepTXRed/TexasDefined publication boundary at the database layer.
-- A feed item routed to TexasDefined must never become a KeepTXRed daily article,
-- even if an older publisher path does not yet filter on target_site.

CREATE OR REPLACE FUNCTION public.enforce_daily_article_site_boundary()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.source_url IS NOT NULL AND EXISTS (
    SELECT 1
    FROM public.texas_news_feed f
    WHERE f.link = NEW.source_url
      AND f.target_site = 'texasdefined'
  ) THEN
    RAISE EXCEPTION 'Cross-site publication blocked: source % is routed to TexasDefined', NEW.source_url
      USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_daily_article_site_boundary ON public.daily_articles;
CREATE TRIGGER trg_enforce_daily_article_site_boundary
BEFORE INSERT OR UPDATE OF source_url
ON public.daily_articles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_daily_article_site_boundary();

-- Surface any existing collisions for admin/QA without deleting historical rows.
CREATE OR REPLACE VIEW public.cross_site_publication_collisions AS
SELECT
  a.slug,
  a.title,
  a.source_url,
  a.published_at,
  f.id AS feed_item_id,
  f.target_site,
  f.target_section
FROM public.daily_articles a
JOIN public.texas_news_feed f ON f.link = a.source_url
WHERE f.target_site = 'texasdefined';
