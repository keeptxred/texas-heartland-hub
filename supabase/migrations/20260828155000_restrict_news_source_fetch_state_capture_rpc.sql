-- capture_news_source_fetch_state is an internal SECURITY DEFINER telemetry
-- collector used by database/cron/service-role workflows. It must not be an
-- anonymous or ordinary authenticated RPC surface.

revoke all on function public.capture_news_source_fetch_state() from public;
revoke all on function public.capture_news_source_fetch_state() from anon;
revoke all on function public.capture_news_source_fetch_state() from authenticated;
grant execute on function public.capture_news_source_fetch_state() to service_role;

comment on function public.capture_news_source_fetch_state() is
  'Internal newsroom telemetry capture. Callable only by service_role/database jobs; anonymous and ordinary authenticated RPC execution is revoked.';
