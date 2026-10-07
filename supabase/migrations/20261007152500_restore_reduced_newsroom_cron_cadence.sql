-- Restore the reduced newsroom pipeline cadence after the Oct. 7 load-stabilization
-- migration accidentally re-expanded all five stages to twice hourly.
-- Resolve jobs by stable names so this remains safe if pg_cron job IDs differ.

do $$
declare
  v_job_id bigint;
begin
  select jobid into v_job_id from cron.job where jobname = 'keep-tx-red-normalize-newsroom-feed' limit 1;
  if v_job_id is not null then
    perform cron.alter_job(v_job_id, schedule => '7,37 * * * *');
  end if;

  select jobid into v_job_id from cron.job where jobname = 'keep-tx-red-cluster-newsroom-stories' limit 1;
  if v_job_id is not null then
    perform cron.alter_job(v_job_id, schedule => '9,39 * * * *');
  end if;

  select jobid into v_job_id from cron.job where jobname = 'keep-tx-red-score-newsroom-stories' limit 1;
  if v_job_id is not null then
    perform cron.alter_job(v_job_id, schedule => '11,41 * * * *');
  end if;

  select jobid into v_job_id from cron.job where jobname = 'keep-tx-red-decide-newsroom-packages' limit 1;
  if v_job_id is not null then
    perform cron.alter_job(v_job_id, schedule => '13,43 * * * *');
  end if;

  select jobid into v_job_id from cron.job where jobname = 'keep-tx-red-build-newsroom-research-packets' limit 1;
  if v_job_id is not null then
    perform cron.alter_job(v_job_id, schedule => '29 * * * *');
  end if;
end
$$;
