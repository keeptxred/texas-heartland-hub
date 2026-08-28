-- Keep the durable Aug. 10 Flyover alert state synchronized even if an
-- operator manually resolves an alert while review-ready stories remain.
-- This job only reconciles alert metadata; it never publishes or changes story
-- routing, scoring, rewrite readiness, or auto-publish eligibility.

DO $$
DECLARE
  existing_job bigint;
BEGIN
  SELECT jobid INTO existing_job
  FROM cron.job
  WHERE jobname = 'flyover-aug10-alert-self-heal-hourly'
  LIMIT 1;

  IF existing_job IS NOT NULL THEN
    PERFORM cron.unschedule(existing_job);
  END IF;

  PERFORM cron.schedule(
    'flyover-aug10-alert-self-heal-hourly',
    '28 * * * *',
    $cron$SELECT public.sync_flyover_aug10_publishing_alerts();$cron$
  );
END;
$$;

SELECT public.sync_flyover_aug10_publishing_alerts();
