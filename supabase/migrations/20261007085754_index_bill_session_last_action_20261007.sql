create index if not exists bills_legislature_session_last_action_idx
on public.bills (legislature_number, session_code, last_action_date desc);
