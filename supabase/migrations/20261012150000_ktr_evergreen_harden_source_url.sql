-- Defense in depth for service-role ingestion: reject URL userinfo, custom ports,
-- malformed authorities and lookalike hostnames. The application checker remains
-- responsible for DNS/network safety and content retrieval limits.
create or replace function public.ktr_evergreen_source_url_allowed(p_url text)
returns boolean language sql immutable set search_path = '' as $$
 select p_url is not null
   and length(p_url) between 12 and 2048
   and p_url !~ '[[:space:]@\\]'
   and p_url ~ '^https://(([a-zA-Z0-9-]+\\.)+[a-zA-Z0-9-]*gov|www\\.sos\\.state\\.tx\\.us)(/[^[:space:]#?]*|\\?[^[:space:]#]*|#[^[:space:]]*|)$'
$$;
revoke all on function public.ktr_evergreen_source_url_allowed(text) from public, anon, authenticated;
grant execute on function public.ktr_evergreen_source_url_allowed(text) to service_role;
