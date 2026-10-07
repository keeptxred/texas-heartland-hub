create or replace function public.list_active_bill_filter_options()
returns table (
  legislature_number integer,
  session_code text,
  bill_type text,
  chamber text
)
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  select distinct
    b.legislature_number,
    b.session_code,
    b.bill_type,
    b.chamber
  from public.bills b
  where b.is_active = true
  order by b.legislature_number desc, b.session_code asc, b.bill_type asc, b.chamber asc
$$;

revoke all on function public.list_active_bill_filter_options() from public;
grant execute on function public.list_active_bill_filter_options() to anon, authenticated, service_role;

comment on function public.list_active_bill_filter_options() is
  'Returns the distinct active Texas bill directory filter combinations without transferring the full active bills table.';
