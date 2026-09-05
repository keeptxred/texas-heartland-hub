#!/usr/bin/env node
import { readFile } from 'node:fs/promises';

const migration = await readFile(new URL('../../supabase/migrations/20260905173000_structured_bill_effective_dates.sql', import.meta.url), 'utf8');
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

if (!/from\('bill_effective_date_provisions'\)/.test(component)) throw new Error('Public effective-date component must query the structured table.');
if (!/Effective-date schedule/.test(component)) throw new Error('Public effective-date component must render an explicit schedule heading.');
if (!/Condition status/.test(component)) throw new Error('Conditional provisions must expose their verification status.');
if (!/Official effective-date source/.test(component)) throw new Error('Structured dates must retain an official source link.');
if (!/BillEffectiveDates/.test(explanation)) throw new Error('Bill editorial surface must render structured effective dates.');

console.log('Structured bill effective-date validation passed.');
