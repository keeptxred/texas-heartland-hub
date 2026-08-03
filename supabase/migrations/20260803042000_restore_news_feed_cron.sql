-- Restore the scheduled news discovery pipeline.
-- The admin page can refresh feeds interactively, but the public ingestion
-- and Viral Radar scoring jobs must continue running even when no editor has
-- the dashboard open.

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

DO $$
DECLARE
  existing_job_id bigint;
BEGIN
  SELECT jobid INTO existing_job_id
  FROM cron.job
  WHERE jobname = 'keep-tx-red-ingest-feeds'
  LIMIT 1;

  IF existing_job_id IS NOT NULL THEN
    PERFORM cron.unschedule(existing_job_id);
  END IF;

  SELECT jobid INTO existing_job_id
  FROM cron.job
  WHERE jobname = 'keep-tx-red-score-viral'
  LIMIT 1;

  IF existing_job_id IS NOT NULL THEN
    PERFORM cron.unschedule(existing_job_id);
  END IF;
END
$$;

-- Fetch and store fresh RSS items every 30 minutes.
SELECT cron.schedule(
  'keep-tx-red-ingest-feeds',
  '7,37 * * * *',
  $$
    SELECT net.http_post(
      url := 'https://keeptxred.com/api/public/hooks/ingest-feeds',
      headers := '{"Content-Type":"application/json","Accept":"application/json"}'::jsonb,
      body := '{"source":"pg_cron"}'::jsonb,
      timeout_milliseconds := 120000
    );
  $$
);

-- Score newly ingested rows shortly after each feed refresh so Viral Radar
-- does not hide unscored rows behind the Texas/reputation review floor.
SELECT cron.schedule(
  'keep-tx-red-score-viral',
  '12,42 * * * *',
  $$
    SELECT net.http_post(
      url := 'https://keeptxred.com/api/public/hooks/score-viral',
      headers := '{"Content-Type":"application/json","Accept":"application/json"}'::jsonb,
      body := '{"source":"pg_cron"}'::jsonb,
      timeout_milliseconds := 120000
    );
  $$
);
