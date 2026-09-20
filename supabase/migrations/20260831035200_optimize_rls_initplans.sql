-- Avoid per-row auth function evaluation in hot RLS paths and remove the
-- deprecated auth.role() checks used for service-role-only access.

alter policy "Service role manages orders" on public.orders
  to service_role using (true) with check (true);

alter policy "Service role can read send log" on public.email_send_log
  to service_role using (true);
alter policy "Service role can insert send log" on public.email_send_log
  to service_role with check (true);
alter policy "Service role can update send log" on public.email_send_log
  to service_role using (true) with check (true);

alter policy "Service role can manage send state" on public.email_send_state
  to service_role using (true) with check (true);

alter policy "Service role can read suppressed emails" on public.suppressed_emails
  to service_role using (true);
alter policy "Service role can insert suppressed emails" on public.suppressed_emails
  to service_role with check (true);

alter policy "Service role can read tokens" on public.email_unsubscribe_tokens
  to service_role using (true);
alter policy "Service role can insert tokens" on public.email_unsubscribe_tokens
  to service_role with check (true);
alter policy "Service role can mark tokens as used" on public.email_unsubscribe_tokens
  to service_role using (true) with check (true);

alter policy "service role manages social connections" on public.social_connections
  to service_role using (true) with check (true);

alter policy "Users read own roles" on public.user_roles
  using (user_id = (select auth.uid()));

alter policy "Admins manage explore_import_sources" on public.explore_import_sources
  using (has_role((select auth.uid()), 'admin'::app_role))
  with check (has_role((select auth.uid()), 'admin'::app_role));
alter policy "Admins manage explore_import_jobs" on public.explore_import_jobs
  using (has_role((select auth.uid()), 'admin'::app_role))
  with check (has_role((select auth.uid()), 'admin'::app_role));
alter policy "Admins manage explore_import_records" on public.explore_import_records
  using (has_role((select auth.uid()), 'admin'::app_role))
  with check (has_role((select auth.uid()), 'admin'::app_role));
alter policy "Admins manage explore_import_revisions" on public.explore_import_revisions
  using (has_role((select auth.uid()), 'admin'::app_role))
  with check (has_role((select auth.uid()), 'admin'::app_role));
alter policy "Admins manage explore_import_rollbacks" on public.explore_import_rollbacks
  using (has_role((select auth.uid()), 'admin'::app_role))
  with check (has_role((select auth.uid()), 'admin'::app_role));

alter policy "Owners manage Explore trips" on public.explore_trips
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));