create index if not exists bills_active_filter_dimensions_idx
on public.bills (legislature_number desc, session_code asc, bill_type asc, chamber asc)
where is_active = true;
