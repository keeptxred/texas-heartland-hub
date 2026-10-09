-- Reconcile the shared production Supabase schema with version control.
-- Applied in production on 2026-10-09 as bill_sponsors_slug_date_added_lookup_20261009.
-- This supports sponsor directory pages ordered by date_added DESC while
-- allowing index-only retrieval of bill IDs for the initial page.
CREATE INDEX IF NOT EXISTS bill_sponsors_slug_date_added_idx
  ON public.bill_sponsors (sponsor_slug, date_added DESC)
  INCLUDE (bill_id)
  WHERE sponsor_slug IS NOT NULL;
