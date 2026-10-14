-- Preserve the intentional editorial retirement recorded in the archived article row.
-- The former 'restored' ledger state was stale: there is no active daily_articles
-- record for this slug and the archived item was ignored, off-topic and noindex.
UPDATE public.article_url_registry AS r
SET recovery_status = 'retired_low_value',
    retired_reason = 'Intentionally removed: original archived row carries editorial ignore, off-topic, and noindex quality flags.',
    notes = concat_ws(' | ', NULLIF(r.notes, ''), 'Reconciled against deletion archive 2026-10-14; not eligible for automatic republication.'),
    last_seen_at = now()
WHERE r.slug = '2026-08-09-canyon-lake-full-capacity-recovery'
  AND r.recovery_status = 'restored'
  AND NOT EXISTS (SELECT 1 FROM public.daily_articles d WHERE d.slug = r.slug)
  AND EXISTS (
    SELECT 1 FROM public.daily_article_archive a
    WHERE a.slug = r.slug
      AND a.row_data->'quality_flags' ? 'chatgpt-admin-ignored'
  );
