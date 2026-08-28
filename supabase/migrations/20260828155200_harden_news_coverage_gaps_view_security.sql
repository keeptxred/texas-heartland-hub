-- news_coverage_gaps is read-only reporting over texas_news_feed. The base
-- table already grants RLS-protected SELECT to authenticated users, so use
-- SECURITY INVOKER and remove unnecessary DML-style grants on the view.

alter view public.news_coverage_gaps set (security_invoker = true);

revoke insert, update, delete, truncate, references, trigger on public.news_coverage_gaps from anon;
revoke insert, update, delete, truncate, references, trigger on public.news_coverage_gaps from authenticated;
revoke insert, update, delete, truncate, references, trigger on public.news_coverage_gaps from service_role;

grant select on public.news_coverage_gaps to authenticated;
grant select on public.news_coverage_gaps to service_role;

comment on view public.news_coverage_gaps is
  'Coverage-gap reporting over texas_news_feed. SECURITY INVOKER preserves underlying RLS; client access is read-only.';
