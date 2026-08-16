-- Low-credit newsroom Phase 6: SKIP / SINGLE / MERGE / SYNTHESIS decisions.
-- Runs after editorial scoring and makes no AI provider calls.

SELECT cron.schedule(
  'keep-tx-red-decide-newsroom-packages',
  '13,28,43,58 * * * *',
  $$
    SELECT net.http_post(
      url := 'https://keeptxred.com/api/public/hooks/decide-newsroom-packages',
      headers := '{"Content-Type":"application/json","Accept":"application/json"}'::jsonb,
      body := '{"source":"pg_cron"}'::jsonb,
      timeout_milliseconds := 120000
    );
  $$
);
