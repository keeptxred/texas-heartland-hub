import { expect, test } from 'vitest';
import fs from 'node:fs';

const source = fs.readFileSync('src/routes/api/public/hooks/hydrate-newsroom-source-pages.ts', 'utf8');

test('targeted hydration is bounded, database-addressed, zero-AI, and POST-only', () => {
  for (const token of [
    'const MAX_FEED_IDS = 40',
    'const CONCURRENCY = 4',
    'feedIds must contain 1-40 positive integer feed IDs',
    '.from("texas_news_feed")',
    '.select("id,link,extracted_body")',
    'fetchReadableNewsroomSource(row.link)',
    'shouldFetchNewsroomSourcePage',
    'aiCalls: 0',
    'POST required',
  ]) expect(source).toContain(token);
  expect(source).not.toContain('payload.url');
  expect(source).not.toContain('payload.link');
});
