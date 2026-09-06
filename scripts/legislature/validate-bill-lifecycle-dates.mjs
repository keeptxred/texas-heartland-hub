import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260905151000_reconcile_bill_lifecycle_dates_from_actions.sql', 'utf8');
const statusFix = fs.readFileSync('supabase/migrations/20260905190500_normalize_filed_without_signature_status.sql', 'utf8');
const commentFix = fs.readFileSync('supabase/migrations/20260906042500_normalize_tlo_effective_action_comments.sql', 'utf8');
const lineItemFix = fs.readFileSync('supabase/migrations/20260906192000_handle_line_item_veto_lifecycle.sql', 'utf8');
const temporalStatusFix = fs.readFileSync('supabase/migrations/20260906194000_normalize_temporal_bill_effective_status.sql', 'utf8');
const importer = fs.readFileSync('scripts/legislature/sync-texas-legislation.mjs', 'utf8');

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

const importerRequired = [
  'function normalizeActionText(part)',
  "'actionComment'",
  "'comment'",
  'formatMdy(isoDate(comment))',
  'Effective on ${effectiveDate}',
  'action_text: normalizeActionText(part)',
  "['vetoed', 'Vetoed', /vetoed by the governor/]",
];
for (const token of importerRequired) {
  if (!importer.includes(token)) throw new Error(`TLO importer is missing required safeguard: ${token}`);
}
if (importer.includes("['vetoed', 'Vetoed', /veto/]")) {
  throw new Error('TLO importer must not classify any generic occurrence of veto as a whole-bill veto.');
}

const commentFixRequired = [
  "bill_number = 2963",
  "date '2026-09-01'",
  "action_text = 'Effective on ' || to_char(b.effective_date, 'FMMM/FMDD/YYYY')",
  "a.action_text ~* '^Effective on\\s*(\\.\\s*)+$'",
];
for (const token of commentFixRequired) {
  if (!commentFix.includes(token)) throw new Error(`TLO dotted effective-action backfill is missing safeguard: ${token}`);
}

const lineItemRequired = [
  'Signed by the Governor(?:/line item veto)?',
  'line_item_veto',
  'preserve_line_item_veto_lifecycle',
  'bills_preserve_line_item_veto_lifecycle',
  "new.current_status_code := 'effective'",
  'new.vetoed_date := null',
  "bill_identifier = 'HB 500'",
  'revoke all on function public.preserve_line_item_veto_lifecycle() from public, anon, authenticated',
];
for (const token of lineItemRequired) {
  if (!lineItemFix.includes(token)) throw new Error(`Line-item veto lifecycle normalization is missing safeguard: ${token}`);
}

const temporalStatusRequired = [
  'preserve_temporal_bill_effective_status',
  'bills_preserve_temporal_effective_status',
  'refresh_bill_effective_statuses',
  'effective_date <= current_date',
  'effective_date > current_date',
  "current_status_code in ('signed','became-law')",
  "new.current_status_code := 'effective'",
  "new.current_status_code := 'signed'",
  'refresh-bill-effective-statuses',
  "'15 6 * * *'",
  'select public.refresh_bill_effective_statuses();',
  'revoke all on function public.preserve_temporal_bill_effective_status() from public, anon, authenticated',
  'revoke all on function public.refresh_bill_effective_statuses() from public, anon, authenticated',
];
for (const token of temporalStatusRequired) {
  if (!temporalStatusFix.includes(token)) throw new Error(`Temporal bill effective-status normalization is missing safeguard: ${token}`);
}

console.log('Bill lifecycle date, TLO action-comment, filed-without-signature, line-item-veto, and temporal effective-status reconciliation validation passed.');
