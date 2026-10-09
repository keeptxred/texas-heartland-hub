-- Reconcile repository migration versions with Supabase execution-time versions.
-- Schema effects were verified against the live database before recording these mappings.
-- This migration is bookkeeping only and does not reapply table, constraint, or index DDL.

insert into public.repo_migration_equivalences(expected_version, actual_version, actual_name, reason)
values
(
  '20261007150500',
  '20261007183743',
  'add_partner_referral_acquisition_source',
  'Repository migration 20261007150500_add_partner_referral_acquisition_source.sql is the version-controlled equivalent of the live migration recorded by Supabase as execution-time version 20261007183743; current column, primary key, check, default, comment, and supporting index definitions match the repository migration.'
),
(
  '20261009050500',
  '20261009044821',
  'allow_texasdefined_gsc_sitewide_storage',
  'Repository migration 20261009050500_allow_texasdefined_gsc_sitewide_storage.sql is the version-controlled equivalent of the live migration recorded by Supabase as execution-time version 20261009044821; both current GSC URL check constraints match the repository migration.'
),
(
  '20261009180000',
  '20261009132622',
  'bill_sponsors_slug_date_added_lookup_20261009',
  'Repository migration 20261009180000_bill_sponsors_slug_date_added_lookup.sql is the version-controlled equivalent of the live migration recorded by Supabase as execution-time version 20261009132622; the current partial covering index definition matches the repository migration.'
)
on conflict (expected_version) do update
set actual_version = excluded.actual_version,
    actual_name = excluded.actual_name,
    reason = excluded.reason;
