-- Record the truthful connector-version equivalence for the final hero backlog migration.
-- Supabase apply_migration executed the exact repository SQL from logical version
-- 20260926184500 and recorded execution-time version 20260926184114.

insert into public.repo_migration_equivalences(expected_version, actual_version, actual_name, reason)
values (
  '20260926184500',
  '20260926184114',
  'finalize_remaining_hero_identity_backlog',
  'The supported Supabase apply_migration connector applied the exact repository migration SQL from 20260926184500_finalize_remaining_hero_identity_backlog.sql and Supabase recorded its execution-time version 20260926184114.'
)
on conflict (expected_version) do update
set actual_version = excluded.actual_version,
    actual_name = excluded.actual_name,
    reason = excluded.reason;
