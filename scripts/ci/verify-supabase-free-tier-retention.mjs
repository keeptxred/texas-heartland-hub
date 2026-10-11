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
