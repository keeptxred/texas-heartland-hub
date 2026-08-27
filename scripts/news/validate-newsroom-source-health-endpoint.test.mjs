import { expect, test } from 'vitest';
import fs from 'node:fs';

test('newsroom source health endpoint distinguishes transport states and reconciles aliases by feed URL', () => {
  const text = fs.readFileSync('src/routes/api/public/newsroom-source-health.ts', 'utf8');
  for (const required of [
    'healthy',
    'quiet',
    'broken',
    'stale_check',
    'never_checked',
    'consecutiveFailures',
    'brokenSources',
    'fetchByName',
    'fetchByUrl',
    'matchMode',
    'fetchStateSourceName',
    'activeUnregisteredSourceCount',
    'activeUnregisteredStatusCounts',
    'activeUnregisteredSources',
    'registryNames',
    'registryUrls',
    'ACTIVE_UNREGISTERED_LIMIT',
    'LATEST_INGESTION_COHORT_MS',
    'latestCheckedAt',
    'activeCohortCutoff',
  ]) {
    expect(text).toContain(required);
  }
  expect(text).toContain('const fetch = byName ?? byUrl');
  expect(text).toContain('checkedAt < now - TWO_HOURS_MS');
  expect(text).toContain('Math.max(now - TWO_HOURS_MS, latestCheckedAt - LATEST_INGESTION_COHORT_MS)');
  expect(text).toContain('checkedAt < activeCohortCutoff');
  expect(text).toContain('activeUnregisteredSources.slice(0, ACTIVE_UNREGISTERED_LIMIT)');
  expect(text).toContain('content_sources');
  expect(text).toContain('news_source_fetch_state');
  expect(text).toContain('Cache-Control');
});
