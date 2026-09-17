alter function public.has_role(uuid, public.app_role) security invoker;
alter function public.has_role(uuid, public.app_role) set search_path = pg_catalog, public;

comment on function public.has_role(uuid, public.app_role) is
  'Checks role membership under caller privileges. Intended for authenticated RLS policy evaluation; user_roles RLS restricts callers to their own role rows.';
