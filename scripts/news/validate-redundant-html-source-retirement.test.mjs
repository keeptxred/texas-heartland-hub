import { expect, test } from 'vitest';
import fs from 'node:fs';

const ingest = fs.readFileSync('src/routes/api/public/hooks/ingest-feeds.ts', 'utf8');

test('redundant Dallas and Astros HTML fetches stay retired', () => {
  expect(ingest).not.toContain('https://www.dallascitynews.net/\", mode: \"html-links\"');
  expect(ingest).not.toContain('https://www.mlb.com/astros/news\", category: \"Sports\", mode: \"html-links\"');
  expect(ingest).toContain('Dallas Cowboys');
  expect(ingest).toContain('Houston Texans');
});
