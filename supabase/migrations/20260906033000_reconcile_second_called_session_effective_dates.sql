-- Reconcile lifecycle dates and structured effective-date schedules for the
-- 89th Legislature, Second Called Session (89(2)).
--
-- Texas Legislature Online records December 4, 2025 as the 91st-day effective
-- date for the simple measures below. HB 8, HB 16, and SB 16 require structured
-- provision-level schedules and are intentionally not flattened to one core
-- effective date where doing so would obscure materially different dates.

update public.bills
set effective_date = date '2025-12-04',
    current_status_code = 'effective',
    current_status_label = 'Effective',
    became_law = true,
    updated_at = now()
where legislature_number = 89
  and session_code = '2'
  and bill_identifier in (
    'HB 4', 'HB 7', 'HB 18', 'HB 20', 'HB 25', 'HB 26', 'HB 192',
    'SB 8', 'SB 11', 'SB 12', 'SB 16', 'SB 54'
  );

update public.bills
set current_status_code = 'effective',
    current_status_label = 'Effective',
    became_law = true,
    updated_at = now()
where legislature_number = 89
  and session_code = '2'
  and bill_identifier in ('HB 8', 'HB 16');

-- HB 8: general effective date plus the expressly delayed Section 4.020.
insert into public.bill_effective_date_provisions (
  bill_id, sequence, provision_scope, effect_kind, effective_date,
  condition_text, condition_status, source_url, source_note, created_at, updated_at
)
select
  b.id,
  v.sequence,
  v.provision_scope,
  'effective',
  v.effective_date,
  null,
  'not_applicable',
  'https://capitol.texas.gov/billlookup/History.aspx?Bill=HB8&LegSess=892',
  v.source_note,
  now(),
  now()
from public.bills b
cross join (values
  (1::smallint, 'Act generally'::text, date '2025-12-04', 'General effective date; major accountability changes generally apply beginning with the 2027-2028 school year.'::text),
  (2::smallint, 'Section 4.020'::text, date '2026-09-01', 'Texas Legislature Online expressly identifies Section 4.020 as effective September 1, 2026.'::text)
) as v(sequence, provision_scope, effective_date, source_note)
where b.legislature_number = 89
  and b.session_code = '2'
  and b.bill_identifier = 'HB 8'
on conflict (bill_id, sequence) do update
set provision_scope = excluded.provision_scope,
    effect_kind = excluded.effect_kind,
    effective_date = excluded.effective_date,
    condition_text = excluded.condition_text,
    condition_status = excluded.condition_status,
    source_url = excluded.source_url,
    source_note = excluded.source_note,
    updated_at = now();

-- HB 16: judicial omnibus with immediate, general, delayed, and no-effect groups.
insert into public.bill_effective_date_provisions (
  bill_id, sequence, provision_scope, effect_kind, effective_date,
  condition_text, condition_status, source_url, source_note, created_at, updated_at
)
select
  b.id,
  v.sequence,
  v.provision_scope,
  v.effect_kind,
  v.effective_date,
  v.condition_text,
  v.condition_status,
  'https://capitol.texas.gov/billlookup/History.aspx?Bill=HB16&LegSess=892',
  v.source_note,
  now(),
  now()
from public.bills b
cross join (values
  (1::smallint, 'Sections 2.11, 2.12, 9.10, 9.22, and Articles 4 and 11B'::text, 'effective'::text, date '2025-09-17', null::text, 'not_applicable'::text, 'These provisions took effect immediately on gubernatorial approval.'::text),
  (2::smallint, 'Sections 1.12, 1.13, 1.14, and 1.16'::text, 'effective'::text, date '2025-12-01', null::text, 'not_applicable'::text, 'Express delayed effective date.'::text),
  (3::smallint, 'Act generally, except otherwise specified'::text, 'effective'::text, date '2025-12-04', null::text, 'not_applicable'::text, 'General 91st-day effective date.'::text),
  (4::smallint, 'Sections 1.05, 1.06, 1.11, 1.27(b), 7.02, and 12.09'::text, 'effective'::text, date '2026-01-01', null::text, 'not_applicable'::text, 'Express delayed effective date.'::text),
  (5::smallint, 'Sections 1.09, 1.10, 1.15, 1.17, and 1.19'::text, 'effective'::text, date '2026-09-01', null::text, 'not_applicable'::text, 'Express delayed effective date.'::text),
  (6::smallint, 'Section 1.18'::text, 'effective'::text, date '2026-10-01', null::text, 'not_applicable'::text, 'Express delayed effective date.'::text),
  (7::smallint, 'Sections 1.01 and 1.02'::text, 'effective'::text, date '2027-01-01', null::text, 'not_applicable'::text, 'Express delayed effective date.'::text),
  (8::smallint, 'Section 1.22'::text, 'effective'::text, date '2028-09-01', null::text, 'not_applicable'::text, 'Express delayed effective date.'::text),
  (9::smallint, 'Sections 1.23, 1.24, 1.25, and 1.26'::text, 'effective'::text, date '2029-01-01', null::text, 'not_applicable'::text, 'Express delayed effective date.'::text),
  (10::smallint, 'Article 11A'::text, 'no_effect'::text, null::date, 'Second Called Session would have had to end before September 1, 2025, plus the required immediate-effect vote. The session ended on or after September 1, so Article 11A has no effect.'::text, 'failed'::text, 'Texas Legislature Online expressly states Article 11A has no effect.'::text)
) as v(sequence, provision_scope, effect_kind, effective_date, condition_text, condition_status, source_note)
where b.legislature_number = 89
  and b.session_code = '2'
  and b.bill_identifier = 'HB 16'
on conflict (bill_id, sequence) do update
set provision_scope = excluded.provision_scope,
    effect_kind = excluded.effect_kind,
    effective_date = excluded.effective_date,
    condition_text = excluded.condition_text,
    condition_status = excluded.condition_status,
    source_url = excluded.source_url,
    source_note = excluded.source_note,
    updated_at = now();

-- SB 16: general date plus the expressly delayed recording provision.
insert into public.bill_effective_date_provisions (
  bill_id, sequence, provision_scope, effect_kind, effective_date,
  condition_text, condition_status, source_url, source_note, created_at, updated_at
)
select
  b.id,
  v.sequence,
  v.provision_scope,
  'effective',
  v.effective_date,
  null,
  'not_applicable',
  'https://capitol.texas.gov/tlodocs/892/billtext/html/SB00016F.htm',
  v.source_note,
  now(),
  now()
from public.bills b
cross join (values
  (1::smallint, 'Act generally'::text, date '2025-12-04', 'General 91st-day effective date.'::text),
  (2::smallint, 'Section 51.901(g), Government Code'::text, date '2026-01-01', 'Express delayed effective date for this recording provision.'::text)
) as v(sequence, provision_scope, effective_date, source_note)
where b.legislature_number = 89
  and b.session_code = '2'
  and b.bill_identifier = 'SB 16'
on conflict (bill_id, sequence) do update
set provision_scope = excluded.provision_scope,
    effect_kind = excluded.effect_kind,
    effective_date = excluded.effective_date,
    condition_text = excluded.condition_text,
    condition_status = excluded.condition_status,
    source_url = excluded.source_url,
    source_note = excluded.source_note,
    updated_at = now();
