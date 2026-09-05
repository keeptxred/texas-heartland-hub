import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260905151000_reconcile_bill_lifecycle_dates_from_actions.sql', 'utf8');

const required = [
  'tlo_explicit_effective_date',
  "^Effective immediately\\s*$",
  "^Effective on\\s+",
  'refresh_bill_lifecycle_dates_from_actions',
  "action_text ~* '^Sent to the Governor\\s*$'",
  "action_text ~* '^Signed by the Governor\\s*$'",
  'See remarks for effective date',
  'after insert or update or delete',
  "if tg_op = 'DELETE'",
  "old.bill_id is distinct from new.bill_id",
  'revoke all on function public.refresh_bill_lifecycle_dates_from_actions(uuid) from public, anon, authenticated',
];

for (const token of required) {
  if (!migration.includes(token)) {
    throw new Error(`Bill lifecycle migration is missing required safeguard: ${token}`);
  }
}

if (/See remarks for effective date[^\n]*to_date/i.test(migration)) {
  throw new Error('Complex see-remarks effective dates must not be coerced into a single date.');
}

console.log('Bill lifecycle date reconciliation validation passed.');
