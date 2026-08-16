-- Low-credit newsroom Phase 5: editorial scoring and pillar routing.
-- This ranks all candidates together. It does not enforce per-pillar quotas.

SELECT cron.schedule(
  'keep-tx-red-score-newsroom-stories',
  '11,26,41,56 * * * *',
  $$
    SELECT net.http_post(
      url := 'https://keeptxred.com/api/public/hooks/score-newsroom-stories',
      headers := '{"Content-Type":"application/json","Accept":"application/json"}'::jsonb,
      body := '{"source":"pg_cron"}'::jsonb,
      timeout_milliseconds := 120000
    );
  $$
);
