create or replace function public.ktr_evergreen_source_url_allowed(p_url text) returns boolean language sql immutable set search_path = '' as $$ select p_url ~ '^https://([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]*gov(/|:443/|\?|#|$)' or p_url ~ '^https://www\.sos\.state\.tx\.us(/|\?|#|$)' $$;
revoke all on function public.ktr_evergreen_source_url_allowed(text) from public, anon, authenticated;
grant execute on function public.ktr_evergreen_source_url_allowed(text) to service_role;
