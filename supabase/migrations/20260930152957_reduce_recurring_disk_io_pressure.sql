-- Reduce recurring Supabase Disk IO pressure without disabling newsroom or legislative freshness.
-- Heavy deterministic newsroom stages remain frequent, while expensive packet rebuilds and
-- legislative backfills/enrichment are moved to cadences appropriate to their change rate.

do $$
declare
  v_job_id bigint;
begin
  select jobid into v_job_id from cron.job where jobname = 'keep-tx-red-normalize-newsroom-feed';
  if v_job_id is not null then perform cron.alter_job(v_job_id, schedule => '7,37 * * * *'); end if;

  select jobid into v_job_id from cron.job where jobname = 'keep-tx-red-cluster-newsroom-stories';
  if v_job_id is not null then perform cron.alter_job(v_job_id, schedule => '9,39 * * * *'); end if;

  select jobid into v_job_id from cron.job where jobname = 'keep-tx-red-score-newsroom-stories';
  if v_job_id is not null then perform cron.alter_job(v_job_id, schedule => '11,41 * * * *'); end if;

  select jobid into v_job_id from cron.job where jobname = 'keep-tx-red-decide-newsroom-packages';
  if v_job_id is not null then perform cron.alter_job(v_job_id, schedule => '13,43 * * * *'); end if;

  select jobid into v_job_id from cron.job where jobname = 'keep-tx-red-build-newsroom-research-packets';
  if v_job_id is not null then perform cron.alter_job(v_job_id, schedule => '29 * * * *'); end if;

  select jobid into v_job_id from cron.job where jobname = 'ktr-tlo-bill-event-sync';
  if v_job_id is not null then perform cron.alter_job(v_job_id, schedule => '42 * * * *'); end if;

  select jobid into v_job_id from cron.job where jobname = 'ktr-tlo-missing-bill-backfill';
  if v_job_id is not null then perform cron.alter_job(v_job_id, schedule => '9 */6 * * *'); end if;

  select jobid into v_job_id from cron.job where jobname = 'ktr-tlo-seed-bill-enrichment';
  if v_job_id is not null then perform cron.alter_job(v_job_id, schedule => '25 1,7,13,19 * * *'); end if;
end $$;
