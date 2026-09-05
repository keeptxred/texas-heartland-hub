import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260905151000_reconcile_bill_lifecycle_dates_from_actions.sql', 'utf8');
const statusFix = fs.readFileSync('supabase/migrations/20260905190500_normalize_filed_without_signature_status.sql', 'utf8');

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

const statusRequired = [
  "Filed without (the Governor''s )?signature",
  "current_status_code not in ('vetoed','signed','became-law')",
  "then 'became-law'",
  "then 'Became law'",
  "Filed without the Governor''s signature",
  "became_law = b.became_law or coalesce(d.became_law, false)",
  'revoke all on function public.refresh_bill_lifecycle_dates_from_actions(uuid) from public, anon, authenticated',
];
for (const token of statusRequired) {
  if (!statusFix.includes(token)) throw new Error(`Filed-without-signature normalization is missing safeguard: ${token}`);
}

console.log('Bill lifecycle date and filed-without-signature reconciliation validation passed.');
