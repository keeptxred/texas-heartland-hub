grant select, insert, update, delete
on table
  public.explore_import_sources,
  public.explore_import_jobs,
  public.explore_import_records,
  public.explore_import_revisions,
  public.explore_import_rollbacks
to service_role;

revoke execute on function public.claim_explore_import_job() from public;
grant execute on function public.claim_explore_import_job() to service_role;
