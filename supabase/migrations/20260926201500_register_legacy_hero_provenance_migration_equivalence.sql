-- Record the truthful connector-version equivalence for the legacy hero
-- provenance overload retirement migration.
-- Supabase apply_migration executed the exact repository SQL from logical
-- version 20260926200000 and recorded execution-time version 20260926201353.

insert into public.repo_migration_equivalences(expected_version, actual_version, actual_name, reason)
values (
  '20260926200000',
  '20260926201353',
  'retire_legacy_article_hero_provenance_overload',
  'The supported Supabase apply_migration connector applied the exact repository migration SQL from 20260926200000_retire_legacy_article_hero_provenance_overload.sql and Supabase recorded its execution-time version 20260926201353.'
)
on conflict (expected_version) do update
set actual_version = excluded.actual_version,
    actual_name = excluded.actual_name,
    reason = excluded.reason;
