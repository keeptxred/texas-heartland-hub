-- Reconcile historical URL recovery ledger for existing static pages and one verified redirect.
-- No legacy_url_restored flag is added because these pages already exist and are not newly editorially restored.

UPDATE public.article_url_registry
SET recovery_status = 'restored',
    retired_reason = NULL,
    notes = concat_ws(
      ' | ',
      nullif(notes, ''),
      'Verified live static article route; recovery ledger reconciled without legacy_url_restored because no new editorial restoration was performed.'
    ),
    last_seen_at = now()
WHERE slug IN (
  'homestead-exemption-explained',
  'why-texas-has-no-income-tax',
  'texas-property-tax-guide',
  'texas-voting-guide-2026',
  'moving-to-texas-guide',
  'beginners-guide-texas-elections',
  'school-board-elections'
)
  AND recovery_status = 'pending';

UPDATE public.article_url_registry
SET recovery_status = 'redirected',
    redirect_target = 'https://texasdefined.com/article/texas-home-equity-heloc-guide',
    retired_reason = NULL,
    notes = concat_ws(
      ' | ',
      nullif(notes, ''),
      'Verified permanent redirect to the same-subject TexasDefined article; recovery ledger reconciled.'
    ),
    last_seen_at = now()
WHERE slug = 'texas-home-equity-heloc-guide'
  AND recovery_status = 'pending';
