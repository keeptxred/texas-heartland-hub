-- Close the remaining 89(R) "See remarks for effective date" local-district cases.
-- Legislative Reference Library/TLO remarks establish September 1, 2025 as the Act date,
-- with the alternate no-eminent-domain provisions taking effect because the two-thirds threshold failed.

with target as (
  select id, bill_identifier
  from public.bills
  where legislature_number = 89 and session_code = 'R'
    and bill_identifier in ('HB 5651','HB 5655','HB 5658','HB 5677','HB 5680','HB 5682','SB 3037','SB 3047','SB 3048','SB 3056')
), rows(bill_identifier, sequence, provision_scope, effect_kind, effective_date, condition_text, condition_status, source_url, source_note) as (
  values
    ('HB 5651',1,'Act, including Section 9094.0306 added by Section 4(b)','effective',date '2025-09-01',null,'not_applicable','https://capitol.texas.gov/billlookup/History.aspx?Bill=HB5651&LegSess=89R','Official effective-date remarks: Act takes effect September 1, 2025, including the no-eminent-domain fallback section.'),
    ('HB 5651',2,'Section 9094.0306 added by Section 1 (eminent-domain authorization)','no_effect',null,'Two-thirds vote was not obtained; the original eminent-domain authorization has no effect.','failed','https://capitol.texas.gov/billlookup/History.aspx?Bill=HB5651&LegSess=89R','Official effective-date remarks and enrolled vote certification.'),
    ('HB 5655',1,'Act, including Section 9095.0306 added by Section 4(b)','effective',date '2025-09-01',null,'not_applicable','https://capitol.texas.gov/billlookup/History.aspx?Bill=HB5655&LegSess=89R','Official effective-date remarks: Act takes effect September 1, 2025, including the no-eminent-domain fallback section.'),
    ('HB 5655',2,'Section 9095.0306 added by Section 1 (eminent-domain authorization)','no_effect',null,'Two-thirds vote was not obtained; the original eminent-domain authorization has no effect.','failed','https://capitol.texas.gov/billlookup/History.aspx?Bill=HB5655&LegSess=89R','Official effective-date remarks.'),
    ('HB 5658',1,'Act, including Section 4020.0312 added by Section 4(b)','effective',date '2025-09-01',null,'not_applicable','https://capitol.texas.gov/billlookup/History.aspx?Bill=HB5658&LegSess=89R','Official Stage 7/remarks: Act takes effect September 1, 2025, including the no-eminent-domain fallback section.'),
    ('HB 5658',2,'Section 4020.0312 added by Section 1 (eminent-domain authorization)','no_effect',null,'Two-thirds vote was not obtained; the original eminent-domain authorization has no effect.','failed','https://capitol.texas.gov/billlookup/History.aspx?Bill=HB5658&LegSess=89R','Official Stage 7/remarks.'),
    ('HB 5677',1,'Act, including Section 4013.0311 added by Section 4(b)','effective',date '2025-09-01',null,'not_applicable','https://capitol.texas.gov/billlookup/History.aspx?Bill=HB5677&LegSess=89R','Official effective-date remarks: Act takes effect September 1, 2025, including the no-eminent-domain fallback section.'),
    ('HB 5677',2,'Section 4013.0311 added by Section 1 (eminent-domain authorization)','no_effect',null,'Two-thirds vote was not obtained; the original eminent-domain authorization has no effect.','failed','https://capitol.texas.gov/billlookup/History.aspx?Bill=HB5677&LegSess=89R','Official effective-date remarks and enrolled vote certification.'),
    ('HB 5680',1,'Act, including Section 4021.0311 added by Section 4(b)','effective',date '2025-09-01',null,'not_applicable','https://capitol.texas.gov/billlookup/History.aspx?Bill=HB5680&LegSess=89R','Official effective-date remarks: Act takes effect September 1, 2025, including the no-eminent-domain fallback section.'),
    ('HB 5680',2,'Section 4021.0311 added by Section 1 (eminent-domain authorization)','no_effect',null,'Two-thirds vote was not obtained; the original eminent-domain authorization has no effect.','failed','https://capitol.texas.gov/billlookup/History.aspx?Bill=HB5680&LegSess=89R','Official effective-date remarks and enrolled vote certification.'),
    ('HB 5682',1,'Act, including Section 4019.0313 added by Section 4(b)','effective',date '2025-09-01',null,'not_applicable','https://capitol.texas.gov/billlookup/History.aspx?Bill=HB5682&LegSess=89R','Official effective-date remarks: Act takes effect September 1, 2025, including the no-eminent-domain fallback section.'),
    ('HB 5682',2,'Section 4019.0313 added by Section 1 (eminent-domain authorization)','no_effect',null,'Two-thirds vote was not obtained; the original eminent-domain authorization has no effect.','failed','https://capitol.texas.gov/billlookup/History.aspx?Bill=HB5682&LegSess=89R','Official effective-date remarks and enrolled vote certification.'),
    ('SB 3037',1,'Act, including Section 4012.0311 added by Section 4(b)','effective',date '2025-09-01',null,'not_applicable','https://capitol.texas.gov/billlookup/History.aspx?Bill=SB3037&LegSess=89R','Official effective-date remarks: Act takes effect September 1, 2025, including the no-eminent-domain fallback section.'),
    ('SB 3037',2,'Section 4012.0311 added by Section 1 (eminent-domain authorization)','no_effect',null,'Two-thirds vote was not obtained; the original eminent-domain authorization has no effect.','failed','https://capitol.texas.gov/billlookup/History.aspx?Bill=SB3037&LegSess=89R','Official effective-date remarks.'),
    ('SB 3047',1,'Act, including Sections 4015.0311 and 4022.0309 added by fallback provisions','effective',date '2025-09-01',null,'not_applicable','https://capitol.texas.gov/billlookup/History.aspx?Bill=SB3047&LegSess=89R','Official Stage 7: Act takes effect September 1, 2025, including both no-eminent-domain fallback sections.'),
    ('SB 3047',2,'Sections 4015.0311 and 4022.0309 added by the original eminent-domain authorizations','no_effect',null,'Two-thirds vote was not obtained; the original eminent-domain authorizations have no effect.','failed','https://capitol.texas.gov/billlookup/History.aspx?Bill=SB3047&LegSess=89R','Official Stage 7 remarks.'),
    ('SB 3048',1,'Act, including Section 4016.0311 added by Section 4(b)','effective',date '2025-09-01',null,'not_applicable','https://capitol.texas.gov/billlookup/History.aspx?Bill=SB3048&LegSess=89R','Official effective-date remarks: Act takes effect September 1, 2025, including the no-eminent-domain fallback section.'),
    ('SB 3048',2,'Section 4016.0311 added by Section 1 (eminent-domain authorization)','no_effect',null,'Two-thirds vote was not obtained; the original eminent-domain authorization has no effect.','failed','https://capitol.texas.gov/billlookup/History.aspx?Bill=SB3048&LegSess=89R','Official effective-date remarks and enrolled vote certification.'),
    ('SB 3056',1,'Act, including Section 4014.0312 added by Section 4(b)','effective',date '2025-09-01',null,'not_applicable','https://capitol.texas.gov/billlookup/History.aspx?Bill=SB3056&LegSess=89R','Official effective-date remarks: Act takes effect September 1, 2025, including the no-eminent-domain fallback section.'),
    ('SB 3056',2,'Section 4014.0312 added by Section 1 (eminent-domain authorization)','no_effect',null,'Two-thirds vote was not obtained; the original eminent-domain authorization has no effect.','failed','https://capitol.texas.gov/billlookup/History.aspx?Bill=SB3056&LegSess=89R','Official effective-date remarks and enrolled vote certification.')
)
insert into public.bill_effective_date_provisions (
  bill_id, sequence, provision_scope, effect_kind, effective_date,
  condition_text, condition_status, source_url, source_note
)
select t.id, r.sequence, r.provision_scope, r.effect_kind, r.effective_date,
       r.condition_text, r.condition_status, r.source_url, r.source_note
from rows r join target t using (bill_identifier)
on conflict (bill_id, sequence) do update set
  provision_scope=excluded.provision_scope, effect_kind=excluded.effect_kind,
  effective_date=excluded.effective_date, condition_text=excluded.condition_text,
  condition_status=excluded.condition_status, source_url=excluded.source_url,
  source_note=excluded.source_note, updated_at=now();

update public.bills
set effective_date = date '2025-09-01'
where legislature_number=89 and session_code='R'
  and bill_identifier in ('HB 5651','HB 5655','HB 5658','HB 5677','HB 5680','HB 5682','SB 3037','SB 3047','SB 3048','SB 3056');
