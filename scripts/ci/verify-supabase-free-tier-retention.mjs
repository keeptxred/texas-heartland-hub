import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const root = 'supabase/migrations/';
const migration = readFileSync(root + '20261011233913_cron_success_history_rollup_and_safe_retention.sql', 'utf8');
const schedule = readFileSync(root + '20261011234016_schedule_hourly_successful_cron_retention.sql', 'utf8');

function requirePattern(body, pattern, why) {
  assert.match(body, pattern, why);
}
requirePattern(migration, /private\.cron_success_history_daily/, 'Private daily rollup required');
requirePattern(migration, /enable row level security/i, 'Archive cannot be unprotected');
requirePattern(migration, /revoke all on private\.cron_success_history_daily from public, anon, authenticated/i, 'No public rollup access');
requirePattern(migration, /security definer[\s\S]*set search_path\s*=\s*''/i, 'Definer must have empty search_path');
requirePattern(migration, /revoke all on function private\.prune_successful_cron_run_history\(integer\) from public, anon, authenticated/i, 'No public prune permission');
requirePattern(migration, /d\.status\s*=\s*'succeeded'/i, 'Never prune failed/running runs');
requirePattern(migration, /d\.end_time\s*<\s*now\(\)\s*-\s*interval\s*'7 days'/i, 'Retain seven days');
requirePattern(migration, /limit p_batch_limit[\s\S]*for update skip locked/i, 'Bounded, lock-safe batches');
requirePattern(migration, /on conflict \(run_day, job_id, result_status\)[\s\S]*pruned_count\s*=\s*private\.cron_success_history_daily\.pruned_count\s*\+\s*excluded\.pruned_count/i, 'Rollups must accumulate');
assert.doesNotMatch(migration, /delete\s+from\s+public\./i, 'Never touch website content');
assert.doesNotMatch(migration, /truncate\s+/i, 'No table truncation');
requirePattern(schedule, /cron\.schedule\(/i, 'Automatic retention required');
requirePattern(schedule, /free-tier-successful-cron-history-retention/, 'Named retention job');
requirePattern(schedule, /private\.prune_successful_cron_run_history\(20000\)/, 'Bounded periodic pruning');
console.log('Free-tier retention migration checks passed.');

const deployedArchiveSchemas = [
  '20261011234405_create_private_legislative_editorial_cold_archive.sql',
  '20261011234848_create_private_newsroom_cold_archive.sql',
  '20261011235331_create_private_old_feed_cold_archive.sql',
];
for (const file of deployedArchiveSchemas) {
  const sql = readFileSync(root + file,'utf8');
  requirePattern(sql,/enable row level security/i,`Private archive RLS is mandatory: ${file}`);
  requirePattern(sql,/revoke all on private\./i,`Private archive cannot be exposed: ${file}`);
}
const monitor = readFileSync(root + '20261012000443_monitor_shared_free_tier_database_capacity.sql','utf8');
requirePattern(monitor,/500000000/,'Protect strict decimal quota');
requirePattern(monitor,/free-tier-database-capacity-monitor/,'Capacity cron must be active');
requirePattern(monitor,/private\.database_capacity_daily/,'Capacity samples stay private');
const exporter = readFileSync('scripts/data/export-supabase-cold-archives.mjs','utf8');
requirePattern(exporter,/bucketName = 'shared-postgres-cold-archives'/,'Use dedicated private bucket');
requirePattern(exporter,/public:\s*false/,'Backup bucket must be private');
requirePattern(exporter,/storage\.getBucket/,'Enforce bucket privacy');
requirePattern(exporter,/storage\.from\(bucketName\)/,'Use explicit bucket');
requirePattern(exporter,/\.download\(path\)/,'Require read-back');
requirePattern(exporter,/sha\(fetched\) !== sha\(bytes\)/,'Require byte-for-byte verification');
requirePattern(exporter,/record_checksum/,'Require row ID checksums');
assert.doesNotMatch(exporter,/delete\s+from\s+private\./i,'Exporter must not delete private archive tables');
assert.doesNotMatch(exporter,/truncate\s+/i,'Exporter must not truncate data');
const exportWorkflow = readFileSync('.github/workflows/export-supabase-cold-archives.yml','utf8');
requirePattern(exportWorkflow,/fix\/supabase-free-tier-retention-20261011/,'Secrets only on trusted branch push');
assert.doesNotMatch(exportWorkflow,/pull_request:/,'No DB secrets for pull request execution');
console.log('Cold archive safety and capacity monitoring checks passed.');
