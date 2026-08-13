-- Keep the automated Daily Texas News publisher and the admin article feed
-- on the same provenance contract.
--
-- The generate-news writer historically left daily_articles.author NULL while
-- the ChatGPT Auto Articles admin panel expected "Keep TX Red Newsroom".
-- This migration repairs existing rows produced by that writer and ensures
-- future matching rows receive the newsroom author tag even if a writer omits it.

CREATE OR REPLACE FUNCTION public.stamp_generated_newsroom_author()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.author IS NULL
     AND NEW.is_ingested IS FALSE
     AND NEW.kind = 'news'
     AND COALESCE(NEW.body, '') LIKE '%Keep TX Red rewrote the coverage independently and links to the original for verification.%'
     AND COALESCE(NEW.body_json -> 'sections' -> -1 ->> 'heading', '') = 'Source attribution'
  THEN
    NEW.author := 'Keep TX Red Newsroom';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS stamp_generated_newsroom_author_before_write
  ON public.daily_articles;

CREATE TRIGGER stamp_generated_newsroom_author_before_write
BEFORE INSERT OR UPDATE ON public.daily_articles
FOR EACH ROW
EXECUTE FUNCTION public.stamp_generated_newsroom_author();

-- Repair already-published automated rows that match the same unique writer
-- signature. This intentionally does not touch unrelated NULL-author articles.
UPDATE public.daily_articles
SET author = 'Keep TX Red Newsroom'
WHERE author IS NULL
  AND is_ingested IS FALSE
  AND kind = 'news'
  AND COALESCE(body, '') LIKE '%Keep TX Red rewrote the coverage independently and links to the original for verification.%'
  AND COALESCE(body_json -> 'sections' -> -1 ->> 'heading', '') = 'Source attribution';

COMMENT ON FUNCTION public.stamp_generated_newsroom_author() IS
  'Stamps Keep TX Red Newsroom on automated Daily Texas News rows identified by the generate-news provenance signature.';
