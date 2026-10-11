-- Deployed to shared Supabase project ftkznprjljkhymknvhye; keep source control consistent with applied migration.

select cron.schedule(
  'free-tier-successful-cron-history-retention',
  '19 * * * *',
  'SELECT private.prune_successful_cron_run_history(20000)'
);

