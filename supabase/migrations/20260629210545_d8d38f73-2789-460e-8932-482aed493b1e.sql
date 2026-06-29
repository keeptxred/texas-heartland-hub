-- Add ingestion tracking fields to daily_articles
ALTER TABLE public.daily_articles
  ADD COLUMN IF NOT EXISTS internal_url text,
  ADD COLUMN IF NOT EXISTS is_ingested boolean NOT NULL DEFAULT false;

-- Backfill internal_url from slug for existing rows
UPDATE public.daily_articles
SET internal_url = '/news/' || slug
WHERE internal_url IS NULL;

-- Enforce internal_url presence and internal-only path going forward
ALTER TABLE public.daily_articles
  ALTER COLUMN internal_url SET NOT NULL;

-- Keep internal_url scoped to the site (relative path starting with /news/)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'daily_articles_internal_url_internal_only'
  ) THEN
    ALTER TABLE public.daily_articles
      ADD CONSTRAINT daily_articles_internal_url_internal_only
      CHECK (internal_url ~ '^/[A-Za-z0-9/_-]+$');
  END IF;
END $$;

-- Auto-maintain internal_url + is_ingested on insert/update
CREATE OR REPLACE FUNCTION public.daily_articles_sync_ingestion()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.internal_url IS NULL OR NEW.internal_url = '' THEN
    NEW.internal_url := '/news/' || NEW.slug;
  END IF;

  -- Mark items pulled from an external feed as pending ingestion until rewritten
  IF NEW.source_url IS NOT NULL AND NEW.source_url <> '' AND NEW.kind = 'ingested' THEN
    -- leave is_ingested as provided (defaults false on insert)
    NULL;
  ELSIF NEW.source_url IS NULL OR NEW.source_url = '' THEN
    NEW.is_ingested := true;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_daily_articles_sync_ingestion ON public.daily_articles;
CREATE TRIGGER trg_daily_articles_sync_ingestion
BEFORE INSERT OR UPDATE ON public.daily_articles
FOR EACH ROW EXECUTE FUNCTION public.daily_articles_sync_ingestion();