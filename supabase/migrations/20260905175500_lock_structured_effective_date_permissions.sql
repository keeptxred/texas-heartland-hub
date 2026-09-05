-- Public bill effective-date schedules are read-only through the Data API.
revoke all on table public.bill_effective_date_provisions from anon, authenticated;
grant select on table public.bill_effective_date_provisions to anon, authenticated;

revoke all on table public.bill_effective_date_provisions from service_role;
grant select, insert, update, delete on table public.bill_effective_date_provisions to service_role;
