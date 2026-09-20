-- Low-credit newsroom Phase 4: deterministic story clustering.
-- Runs after Phase 3 normalization. No AI provider is invoked.

SELECT cron.schedule(
  'keep-tx-red-cluster-newsroom-stories',
  '9,24,39,54 * * * *',
  $$
    SELECT net.http_post(
      url := 'https://keeptxred.com/api/public/hooks/cluster-newsroom-stories',
      headers := '{"Content-Type":"application/json","Accept":"application/json"}'::jsonb,
      body := '{"source":"pg_cron"}'::jsonb,
      timeout_milliseconds := 120000
    );
  $$
);
