-- Publishing safety net
-- 1) Published URLs are immutable unless an operator explicitly enables the
--    emergency override in the current database transaction.
-- 2) Stalls and reserve publications are durable, auditable records.
-- 3) An hourly job checks the pipeline and releases at most one reserve story
--    after 24 hours without a publication.

CREATE OR REPLACE FUNCTION public.preserve_published_article_url()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF COALESCE(current_setting('app.allow_published_article_mutation', true), 'off') = 'on' THEN
    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION
      'Published article % is permanent. Set app.allow_published_article_mutation=on only for an approved emergency removal.',
      OLD.slug;
  END IF;

  IF NEW.slug IS DISTINCT FROM OLD.slug OR NEW.internal_url IS DISTINCT FROM OLD.internal_url THEN
    RAISE EXCEPTION
      'Published article URLs are immutable (%). Create a new article and an explicit redirect instead.',
      OLD.slug;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_preserve_published_article_url ON public.daily_articles;
CREATE TRIGGER trg_preserve_published_article_url
BEFORE DELETE OR UPDATE OF slug, internal_url ON public.daily_articles
FOR EACH ROW EXECUTE FUNCTION public.preserve_published_article_url();

CREATE TABLE IF NOT EXISTS public.publishing_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_key text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'resolved')),
  latest_published_at timestamptz,
  reserve_slug text,
  message text NOT NULL,
  opened_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  notification_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reserve_article_publications (
  reserve_key text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.publishing_alerts TO authenticated;
GRANT ALL ON public.publishing_alerts TO service_role;
GRANT SELECT ON public.reserve_article_publications TO authenticated;
GRANT ALL ON public.reserve_article_publications TO service_role;

ALTER TABLE public.publishing_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reserve_article_publications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated reads publishing alerts" ON public.publishing_alerts;
CREATE POLICY "authenticated reads publishing alerts"
  ON public.publishing_alerts FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "authenticated reads reserve publications" ON public.reserve_article_publications;
CREATE POLICY "authenticated reads reserve publications"
  ON public.reserve_article_publications FOR SELECT TO authenticated USING (true);

DO $$
DECLARE
  existing_job_id bigint;
BEGIN
  SELECT jobid INTO existing_job_id
  FROM cron.job
  WHERE jobname = 'publishing-safety-net-hourly'
  LIMIT 1;

  IF existing_job_id IS NOT NULL THEN
    PERFORM cron.unschedule(existing_job_id);
  END IF;
END
$$;

SELECT cron.schedule(
  'publishing-safety-net-hourly',
  '17 * * * *',
  $$
    SELECT net.http_post(
      url := 'https://keeptxred.com/api/public/hooks/publishing-safety-net',
      headers := '{"Content-Type":"application/json"}'::jsonb,
      body := '{"source":"pg_cron"}'::jsonb
    );
  $$
);
