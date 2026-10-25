-- KeepTXRed publishing-safety-net hourly request timeout recovery.
--
-- The 2026-07-25 cron registration omitted pg_net's timeout_milliseconds
-- argument, which defaults to 5000 ms in this project. The Worker needs
-- time to generate and independently vision-validate a real hero BEFORE the
-- durable article is inserted. A five-second client disconnect abandons that
-- guarded work and leaves the newsroom stalled.
--
-- Use the exact direct production Worker host (which accepts POST without
-- browser-facing Cloudflare challenges), consistent with the already-deployed
-- GitHub Actions publisher. Keep one job with the existing hourly cadence.
-- pg_net may time out sooner for a network/provider failure, but never mark
-- a missing/invalid image as a successful article.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'publishing-safety-net-hourly') THEN
    PERFORM cron.unschedule('publishing-safety-net-hourly');
  END IF;

  PERFORM cron.schedule(
    'publishing-safety-net-hourly',
    '17 * * * *',
    $job$
      SELECT net.http_post(
        url := 'https://keeptxred-site.freddy-coppola.workers.dev/api/public/hooks/publishing-safety-net',
        headers := '{"Content-Type":"application/json"}'::jsonb,
        body := '{"source":"pg_cron"}'::jsonb,
        timeout_milliseconds := 480000
      );
    $job$
  );
END
$$;
