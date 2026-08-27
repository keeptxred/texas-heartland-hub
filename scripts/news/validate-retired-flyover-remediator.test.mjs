import { expect, test } from 'vitest';
import fs from 'node:fs';

const hook = fs.readFileSync('src/routes/api/public/hooks/remediate-aug10-flyover.ts', 'utf8');

test('legacy Aug 10 Flyover remediator is permanently read-only/retired', () => {
  expect(hook).toContain('status: 410');
  expect(hook).toContain('/api/public/flyover-aug10-health');
  expect(hook).toContain('durable keyed reconciliation ledger');
  expect(hook).not.toContain('publishSingleFeedItem');
  expect(hook).not.toContain('news.google.com');
  expect(hook).not.toContain('.upsert(');
  expect(hook).not.toContain('.insert(');
  expect(hook).not.toContain('daily_articles');
});
