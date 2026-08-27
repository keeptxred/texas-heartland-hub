import { expect, test } from 'vitest';
import fs from 'node:fs';

const ingest = fs.readFileSync('src/routes/api/public/hooks/ingest-feeds.ts', 'utf8');

test('zero-yield Mavericks and Spurs HTML scrapers stay retired after relayed replacement coverage', () => {
  expect(ingest).not.toContain('https://www.mavs.com/news/');
  expect(ingest).not.toContain('https://www.nba.com/spurs/news');
  expect(ingest).toContain('KSAT Spurs');
  expect(ingest).toContain('Dallas Cowboys');
  expect(ingest).toContain('Houston Texans');
});
