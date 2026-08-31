-- New sponsor rows normalize on insert. Keep one daily full-roster safety sweep
-- for unexpected TLO name variants instead of scanning the full sponsor set
-- after every enrichment batch.
do $$
declare
  v_job_id bigint;
begin
  select jobid into v_job_id
  from cron.job
  where jobname = 'ktr-tlo-post-enrichment-normalization'
  limit 1;

  if v_job_id is not null then
    perform cron.alter_job(v_job_id, schedule => '15 9 * * *');
  end if;
end;
$$;