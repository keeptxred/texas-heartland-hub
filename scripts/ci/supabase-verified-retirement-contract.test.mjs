import { readFileSync } from 'node:fs';
import { describe, it } from 'vitest';
import { strict as assert } from 'node:assert';
const runner = readFileSync('scripts/ops/retire-verified-supabase-cold-records.mjs', 'utf8');
const exporter = readFileSync('scripts/data/export-supabase-cold-archives.mjs', 'utf8');
const workflow = readFileSync('.github/workflows/retire-verified-supabase-cold-records.yml', 'utf8');
describe('verified Free Plan retirement invariants', () => {
  it('retains default read-only behavior and never directly deletes rows', () => {
    assert.match(runner,/ENABLE_VERIFIED_COLD_RETIREMENT === '1'/);
    assert.match(runner,/if \(!active\)/);
    assert.ok(runner.indexOf('const existing = await stagedMetadata();') <
      runner.indexOf('if (!existing.length && STRICT_LIMIT - before < MIN_HEADROOM)'),
      'Previously staged backups must be resumable during capacity pressure');
    assert.doesNotMatch(runner,/\.from\(['"](?:texas_news_feed|news_story_clusters)['"]\)\.delete\(/);
    assert.doesNotMatch(runner,/\b(?:DELETE FROM|TRUNCATE TABLE)\b/i);
  });
  it('backs up and reads the exact archive before protected retirement', () => {
    assert.match(runner,/verifyColdArchiveProof\(receipt, metadata\)/);
    assert.match(runner,/retire_verified_expired_free_tier_newsroom/);
    assert.match(runner,/retire_verified_expired_free_tier_feed/);
    assert.match(runner,/p_expected_clusters: metrics.parentRows/);
    assert.match(runner,/p_expected_feed_rows: metrics.parentRows/);
    assert.match(runner,/const PRESSURE_CYCLES = 4/);
    assert.match(runner,/const PRESSURE_THRESHOLD_BYTES = 490_000_000/);
    assert.match(runner,/const cycles = initial >= PRESSURE_THRESHOLD_BYTES \? PRESSURE_CYCLES : BASE_CYCLES/);
    assert.match(runner,/cycle % 2 === 1 \? 'newsroom' : 'feed'/);
    assert.ok(runner.includes("cycle % 2 === 1 ? 'newsroom' : 'feed'"));
    assert.ok(runner.includes("await stage(kind, kind === 'newsroom' ? MAX_STAGE_NEWSROOM : MAX_STAGE_FEED)"));
    assert.ok(!runner.includes("await stage('newsroom', MAX_STAGE_NEWSROOM);\\n    await stage('feed', MAX_STAGE_FEED);"));
    assert.match(runner,/Resuming previously staged archive batch without restaging/);
    assert.match(runner,/actual !== metrics.parentRows/);
    assert.match(exporter,/VERIFIED_COLD_ARCHIVE_RECEIPT=/);
    assert.match(exporter,/verifyArchiveBlob\(downloaded,slice\)/);
    assert.match(exporter,/storeAndReadBack\(manifestName, manifestBytes/);
  });
  it('serializes runs, refuses cancellation and preserves daily article backup', () => {
    assert.match(workflow,/shared-supabase-verified-cold-retention/);
    assert.ok(workflow.includes("cron: '27 */2 * * *'"), '2-hour protected archival cadence required while backlog is high');
    assert.match(workflow,/cancel-in-progress: false/);
    assert.match(workflow,/SUPABASE_SERVICE_ROLE_KEY:/);
    assert.ok(workflow.includes('failure()'));
    assert.match(workflow,/issues: write/);
    assert.match(workflow,/gh issue comment 2762/);
    assert.match(workflow,/GITHUB_RUN_ID/);
    assert.match(exporter,/await snapshotPublishedArticles\(\)/);
    assert.match(exporter,/VERIFIED_COLD_RETENTION_JOB !== '1'/);
  });
});
