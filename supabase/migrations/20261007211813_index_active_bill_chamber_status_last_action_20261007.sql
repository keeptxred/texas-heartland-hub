create index if not exists bills_active_chamber_status_last_action_idx
on public.bills (chamber, current_status_code, last_action_date desc nulls last, id)
where is_active = true;
