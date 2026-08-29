import { expect, test } from 'vitest';
import fs from 'node:fs';

const hook = fs.readFileSync('src/routes/api/public/hooks/enrich-newsroom-feed-items.ts', 'utf8');

test('manual source enrichment stays bounded and non-publishing', () => {
  expect(hook).toContain('const MAX_FEED_IDS = 20');
  expect(hook).toContain('fetchReadableNewsroomSource');
  expect(hook).toContain('.update({ extracted_body: text })');
  expect(hook).toContain('aiCalls: 0');
  expect(hook).toContain('publishes: 0');
  expect(hook).not.toContain('.from("daily_articles")');
  expect(hook).not.toContain('publishSingleFeedItem');
  expect(hook).not.toContain('generate');
});
