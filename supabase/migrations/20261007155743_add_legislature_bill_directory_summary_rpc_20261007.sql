create or replace function public.get_legislature_bill_directory_summary(p_legislature integer)
returns table (
  bill_type text,
  chamber text,
  bill_count bigint,
  last_action_date date
)
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  select
    b.bill_type,
    b.chamber,
    count(*)::bigint as bill_count,
    max(b.last_action_date) as last_action_date
  from public.bills b
  where b.is_active = true
    and b.legislature_number = p_legislature
  group by b.bill_type, b.chamber
  order by b.chamber, b.bill_type
$$;

revoke all on function public.get_legislature_bill_directory_summary(integer) from public;
grant execute on function public.get_legislature_bill_directory_summary(integer) to anon, authenticated, service_role;

comment on function public.get_legislature_bill_directory_summary(integer) is
  'Returns aggregate bill-type counts and latest action dates for an active Texas legislature without transferring every bill row.';
