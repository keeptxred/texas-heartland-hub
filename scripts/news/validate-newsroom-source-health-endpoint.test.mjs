import { expect, test } from 'vitest';
import fs from 'node:fs';

test('newsroom source health endpoint distinguishes quiet and broken sources', () => {
  const text = fs.readFileSync('src/routes/api/public/newsroom-source-health.ts', 'utf8');
  for (const required of ['healthy', 'quiet', 'broken', 'stale_check', 'never_checked', 'consecutiveFailures', 'brokenSources']) {
    expect(text).toContain(required);
  }
  expect(text).toContain('content_sources');
  expect(text).toContain('news_source_fetch_state');
  expect(text).toContain('Cache-Control');
});
