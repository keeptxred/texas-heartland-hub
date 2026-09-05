#!/usr/bin/env node
import { readFile } from 'node:fs/promises';

const migration = await readFile(new URL('../../supabase/migrations/20260905173000_structured_bill_effective_dates.sql', import.meta.url), 'utf8');
const expansion = await readFile(new URL('../../supabase/migrations/20260905174500_expand_structured_effective_date_coverage.sql', import.meta.url), 'utf8');
const permissions = await readFile(new URL('../../supabase/migrations/20260905175500_lock_structured_effective_date_permissions.sql', import.meta.url), 'utf8');
const reviewedComplex = await readFile(new URL('../../supabase/migrations/20260905181000_add_reviewed_complex_effective_dates.sql', import.meta.url), 'utf8');
const followup = await readFile(new URL('../../supabase/migrations/20260905184500_add_followup_complex_effective_dates.sql', import.meta.url), 'utf8');
const statewideFollowup = await readFile(new URL('../../supabase/migrations/20260905185500_add_statewide_followup_effective_dates.sql', import.meta.url), 'utf8');
const finalStatewide = await readFile(new URL('../../supabase/migrations/20260905191500_add_final_statewide_effective_dates.sql', import.meta.url), 'utf8');
const component = await readFile(new URL('../../src/components/bills/BillEffectiveDates.tsx', import.meta.url), 'utf8');
const explanation = await readFile(new URL('../../src/components/bills/BillEditorialExplanation.tsx', import.meta.url), 'utf8');

const requiredMigrationPatterns = [
  /create table if not exists public\.bill_effective_date_provisions/i,
  /enable row level security/i,
  /grant select on public\.bill_effective_date_provisions to anon, authenticated/i,
  /condition_status.*satisfied.*failed.*unknown/is,
  /'HB 2'/,
  /'HB 120'/,
  /'SB 7'/,
  /'SB 9'/,
  /'SB 38'/,
  /'SB 568'/,
  /'HB 1393'/,
  /'SB 5'/,
  /'HB 9'/,
  /'no_effect'/,
  /'conditional'/,
];
for (const pattern of requiredMigrationPatterns) {
  if (!pattern.test(migration)) throw new Error(`Structured effective-date migration is missing ${pattern}`);
}

for (const identifier of ['HB 247', 'HB 1399', 'HB 2508', 'SB 467', 'SB 2155']) {
  if (!expansion.includes(`'${identifier}'`)) throw new Error(`Structured effective-date expansion is missing ${identifier}.`);
}
if (!/when 'HB 9' then date '2026-01-01'/.test(expansion)) throw new Error('HB 9 satisfied-condition effective date must remain repaired.');
if (!/when 'SB 5' then date '2025-12-01'/.test(expansion)) throw new Error('SB 5 satisfied-condition effective date must remain repaired.');

for (const identifier of ['HB 140', 'HB 2789', 'HB 2844', 'SB 293', 'SB 1150']) {
  if (!reviewedComplex.includes(`'${identifier}'`)) throw new Error(`Reviewed complex effective-date coverage is missing ${identifier}.`);
}
if (!/date '2026-07-01'/.test(reviewedComplex)) throw new Error('HB 2844 July 1, 2026 general effective date must remain encoded.');
if (!/date '2027-09-01'/.test(reviewedComplex)) throw new Error('SB 1150 delayed September 1, 2027 provision must remain encoded.');

for (const identifier of ['HB 3810', 'SB 1738', 'SB 1786', 'SB 2361']) {
  if (!followup.includes(`'${identifier}'`)) throw new Error(`Follow-up structured effective-date coverage is missing ${identifier}.`);
}
if (!/date '2025-08-19'/.test(followup) || !/date '2025-08-20'/.test(followup)) throw new Error('HB 3810 derived 60th/61st-day dates must remain encoded.');
if (!/Sections 7 and 8'.*date '2025-09-01'/s.test(followup)) throw new Error('SB 1786 delayed sections must remain encoded.');
if (!/Section 7\(b\)\(1\)'.*date '2025-05-27'/s.test(followup)) throw new Error('SB 2361 immediate section must remain encoded.');

for (const identifier of ['HB 4488', 'HB 5033']) {
  if (!statewideFollowup.includes(`'${identifier}'`)) throw new Error(`Statewide follow-up effective-date coverage is missing ${identifier}.`);
}
if (!/Sections 13 through 15'.*date '2025-09-01'/s.test(statewideFollowup)) throw new Error('HB 4488 delayed statutory sections must remain encoded.');
if (!/HB 5033'.*'conditional'.*'pending'/s.test(statewideFollowup)) throw new Error('HB 5033 federal-trigger provision must remain conditional and pending.');

for (const identifier of ['HB 3250', 'HB 3689', 'SB 1036', 'SB 22']) {
  if (!finalStatewide.includes(`'${identifier}'`)) throw new Error(`Final statewide effective-date coverage is missing ${identifier}.`);
}
if (!/HB 3250'.*date '2025-06-20'.*HB 3250'.*date '2025-09-01'/s.test(finalStatewide)) throw new Error('HB 3250 immediate/general split must remain encoded.');
if (!/HB 3689'.*date '2027-09-01'/s.test(finalStatewide)) throw new Error('HB 3689 delayed 2027 provisions must remain encoded.');
if (!/SB 1036'.*date '2026-09-01'/s.test(finalStatewide)) throw new Error('SB 1036 delayed registration provisions must remain encoded.');
if (!/SB 22'.*'no_effect'.*null.*2035/s.test(finalStatewide) || !/SB 22'.*date '2035-09-01'/s.test(finalStatewide)) throw new Error('SB 22 2035 sunset transition must remain encoded without violating no_effect shape.');

if (!/revoke all on table public\.bill_effective_date_provisions from anon, authenticated/i.test(permissions)) throw new Error('Public roles must not retain broad table privileges.');
if (!/grant select on table public\.bill_effective_date_provisions to anon, authenticated/i.test(permissions)) throw new Error('Public roles must retain read-only effective-date access.');
if (/grant\s+(insert|update|delete).*anon/i.test(permissions) || /grant\s+(insert|update|delete).*authenticated/i.test(permissions)) throw new Error('Public roles must never receive structured effective-date write privileges.');

if (!/from\('bill_effective_date_provisions'\)/.test(component)) throw new Error('Public effective-date component must query the structured table.');
if (!/Effective-date schedule/.test(component)) throw new Error('Public effective-date component must render an explicit schedule heading.');
if (!/Condition status/.test(component)) throw new Error('Conditional provisions must expose their verification status.');
if (!/Official effective-date source/.test(component)) throw new Error('Structured dates must retain an official source link.');
if (!/BillEffectiveDates/.test(explanation)) throw new Error('Bill editorial surface must render structured effective dates.');

console.log('Structured bill effective-date validation passed.');
