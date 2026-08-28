import { expect, test } from 'vitest';
import fs from 'node:fs';

const source = fs.readFileSync('src/routes/api/public/newsroom-health.ts', 'utf8');

test('newsroom health uses authoritative Flyover reconciliation and transport health', () => {
  expect(source).toContain('flyover_aug10_reconciliation');
  expect(source).toContain('news_source_fetch_state');
  expect(source).toContain('flyoverDispositionCounts');
  expect(source).toContain('flyoverReviewReadyCount');
  expect(source).toContain('flyoverOutOfScopeCount');
  expect(source).toContain('flyoverSourceNeededCount');
  expect(source).toContain('classifyFetch');
  expect(source).toContain('stale_check');
  expect(source).toContain('never_checked');
  expect(source).not.toContain('const flyoverSpecs');
  expect(source).not.toContain('function matchesSpec');
});
