-- Applied to shared Supabase production 2026-10-27 at 20:25:55 UTC.
-- Project ftkznprjljkhymknvhye.
--
-- Both importer staging tables were explicitly COUNT(*) = 0, had zero heap
-- pages, zero user triggers, and no inbound FK dependencies. They still
-- contained ~4.18 MB of stale index allocations from previous import batches.
--
-- This guarded, transactional reinitialization reduced pg_database_size
-- from 498,781,331 to 494,546,067 bytes (4,235,264 bytes freed).
-- Published texas_property_tax_rates, source data, change ledgers, parent
-- import run references, indexes/constraints, sequences and APIs are intact.
-- No cascade, no table drop, no RESTART IDENTITY. Abort if an importer is
-- currently using either table or if any row exists.
SET lock_timeout = '2500ms';
DO $$
BEGIN
  LOCK TABLE public.texas_tax_import_stage, public.texas_tax_import_raw_stage
    IN ACCESS EXCLUSIVE MODE NOWAIT;
  IF EXISTS (SELECT 1 FROM public.texas_tax_import_stage LIMIT 1)
    OR EXISTS (SELECT 1 FROM public.texas_tax_import_raw_stage LIMIT 1)
  THEN
    RAISE EXCEPTION 'Tax import staging is not empty; refusing to reclaim indexes';
  END IF;
  EXECUTE 'TRUNCATE TABLE ONLY public.texas_tax_import_stage, ONLY public.texas_tax_import_raw_stage CONTINUE IDENTITY RESTRICT';
END
$$;
RESET lock_timeout;
