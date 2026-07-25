DO $$
DECLARE
  existing_job_id bigint;
BEGIN
  SELECT jobid
  INTO existing_job_id
  FROM cron.job
  WHERE jobname = 'generate-evergreen-daily'
  LIMIT 1;

  IF existing_job_id IS NOT NULL THEN
    PERFORM cron.unschedule(existing_job_id);
  END IF;
END
$$;

SELECT cron.schedule(
  'generate-evergreen-am',
  '30 8 * * *',
  $$select net.http_post(
    url := 'https://project--eabc624d-53f7-4564-8bf9-613c4b63a016.lovable.app/api/public/hooks/generate-evergreen',
    headers := '{"Content-Type": "application/json", "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFod3dtZHN6amdrc2NxeGdtZW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NjM5OTQsImV4cCI6MjA5ODAzOTk5NH0.d4ENOxxtnO9ci-8AhpiF81gsObsKxM2Rb2hvD92DAOU"}'::jsonb,
    body := '{}'::jsonb
  );$$
);

SELECT cron.schedule(
  'generate-evergreen-pm',
  '0 18 * * *',
  $$select net.http_post(
    url := 'https://project--eabc624d-53f7-4564-8bf9-613c4b63a016.lovable.app/api/public/hooks/generate-evergreen',
    headers := '{"Content-Type": "application/json", "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFod3dtZHN6amdrc2NxeGdtZW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NjM5OTQsImV4cCI6MjA5ODAzOTk5NH0.d4ENOxxtnO9ci-8AhpiF81gsObsKxM2Rb2hvD92DAOU"}'::jsonb,
    body := '{}'::jsonb
  );$$
);