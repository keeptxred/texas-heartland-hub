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
requirePattern(exporter,/sha256\(verifiedBytes\) !== sha256\(bytes\)/,'Require byte-for-byte verification');
requirePattern(exporter,/record_checksum/,'Require row ID checksums');
assert.doesNotMatch(exporter,/delete\s+from\s+private\./i,'Exporter must not delete private archive tables');
assert.doesNotMatch(exporter,/truncate\s+/i,'Exporter must not truncate data');
const exportWorkflow = readFileSync('.github/workflows/export-supabase-cold-archives.yml','utf8');
requirePattern(exportWorkflow,/fix\/supabase-free-tier-followup-20261012/,'Secrets only on trusted branch push');
assert.doesNotMatch(exportWorkflow,/pull_request:/,'No DB secrets for pull request execution');
console.log('Cold archive safety and capacity monitoring checks passed.');

const rpcSql = readFileSync(root+'20261012002800_service_role_only_cold_archive_export_rpc.sql','utf8');
requirePattern(rpcSql,/revoke all on function public\.list_private_cold_archive_batches\(integer,integer\) from public,anon,authenticated/i,'Archive list RPC cannot be public');
requirePattern(rpcSql,/revoke all on function public\.read_private_cold_archive_batch\(text,text\) from public,anon,authenticated/i,'Archive read RPC cannot be public');
requirePattern(rpcSql,/grant execute on function public\.read_private_cold_archive_batch\(text,text\) to service_role/i,'Service role must have archive read privilege');
requirePattern(exporter,/list_private_cold_archive_batches/,'Exporter must use restricted RPC metadata list');
requirePattern(exporter,/read_private_cold_archive_batch/,'Exporter must use restricted batch reader');
assert.doesNotMatch(exportWorkflow,/SUPABASE_DB_URL/,'Exporter must not require a separate Postgres secret');
requirePattern(exportWorkflow,/bun install --frozen-lockfile/,'Use repository-supported locked Bun installation');

const capacityProbe = readFileSync(root+'20261012122533_service_only_capacity_alert_probe.sql','utf8');
requirePattern(capacityProbe,/revoke all on function public\.read_shared_free_tier_database_capacity\(\) from public,anon,authenticated/i,'Capacity query must be inaccessible to public users');
requirePattern(capacityProbe,/grant execute on function public\.read_shared_free_tier_database_capacity\(\) to service_role/i,'Only service role may check database quota');
for(const threshold of ['375000000','400000000','450000000','475000000','500000000']){
  requirePattern(capacityProbe,new RegExp(threshold),'Missing capacity threshold: '+threshold);
}
const notifier=readFileSync('scripts/ops/monitor-supabase-free-tier.mjs','utf8');
requirePattern(notifier,/read_shared_free_tier_database_capacity/,'Notifier must use exact database measurement');
requirePattern(notifier,/const title='Shared Supabase Free Tier Capacity Alert'/,'Notifier must reuse a single issue');
requirePattern(notifier,/if\(actual==='ok'\)/,'Notifier must close resolved alerts');
const notifyWorkflow=readFileSync('.github/workflows/supabase-free-tier-capacity-alert.yml','utf8');
requirePattern(notifyWorkflow,/issues: write/,'Issue permissions required');
requirePattern(notifyWorkflow,/cron: '9 1,7,13,19 \* \* \*'/,'Recurring alert schedule required');
console.log('Supabase owner-alert safeguards verified.');

const stageSql=readFileSync(root+'20261012123032_stage_21day_unpublished_feed_for_verified_private_archive.sql','utf8');
const retireSql=readFileSync(root+'20261012123541_guard_verified_stale_feed_retirement_by_storage_manifest.sql','utf8');
requirePattern(stageSql,/interval '21 days'/,'Aged source material must be held at least 21 days');
requirePattern(stageSql,/stage_expired_free_tier_feed/,'Bounded cold-archive staging is required');
requirePattern(stageSql,/p_limit NOT BETWEEN 1 AND 2000/i,'Archive staging must be bounded');
requirePattern(stageSql,/internal_slug IS NULL AND f\.texasdefined_slug IS NULL/i,'Never retire already published slugs');
requirePattern(stageSql,/public\.news_event_facts/,'Preserve soft event-source references');
requirePattern(stageSql,/public\.texasdefined_articles/,'Preserve TD article citations');
requirePattern(stageSql,/public\.daily_articles/,'Preserve KTR article sources');
assert.doesNotMatch(stageSql,/DELETE FROM public\.|TRUNCATE TABLE public\./i,'Staging cannot retire live content');
requirePattern(retireSql,/storage\.objects/,'Retirement requires a Storage manifest');
requirePattern(retireSql,/to_jsonb\(f\)=a\.payload/i,'Live feed content must match archived record');
requirePattern(retireSql,/news_feed_normalization/,'Verify normalization rows');
requirePattern(retireSql,/newsroom_source_page_fetch_state/,'Verify page-fetch rows');
requirePattern(retireSql,/RAISE EXCEPTION 'Feed changed or gained protected references/i,'Drift must fail closed');
requirePattern(retireSql,/REVOKE ALL ON FUNCTION public\.retire_verified_expired_free_tier_feed/i,'No untrusted retirement access');
requirePattern(retireSql,/TO service_role/i,'Privileged role only');
requirePattern(exporter,/maintenanceMode==='canary'\?1:2000/,'Use one-row canary and bounded daily batches');
requirePattern(exporter,/storeAndReadBack\(immutableManifestName,manifestBytes/,'Manifest must be copied/read back');
requirePattern(exporter,/retire_verified_expired_free_tier_feed/,'Guarded retirement must follow successful export');
if(exporter.indexOf('storeAndReadBack(immutableManifestName,manifestBytes')>exporter.indexOf("retire_verified_expired_free_tier_feed")){
  throw new Error('Retirement attempted before manifest verification');
}
requirePattern(exportWorkflow,/cron: '33 7 \* \* \*'/,'Daily archive maintenance required');
requirePattern(exportWorkflow,/SUPABASE_COLD_MAINTENANCE:/,'Daily live mode with pre-merge canary required');
console.log('Nightly feed archiving and fail-closed retirement safety checks passed.');
