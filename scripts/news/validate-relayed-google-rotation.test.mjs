import { expect, test } from 'vitest';
import fs from 'node:fs';

const ingest = fs.readFileSync('src/routes/api/public/hooks/ingest-feeds.ts', 'utf8');

test('relayed Google discovery stays in the bounded Google rotation', () => {
  expect(ingest).toContain('ktr-rss-relay\\?feed=google-');
  expect(ingest).toContain('const GOOGLE_FEEDS_PER_RUN = 10');
  expect(ingest).toContain('const direct = sources.filter((source) => !GOOGLE_NEWS_RE.test(source.url))');
  expect(ingest).toContain('const allGoogle = sources.filter((source) => GOOGLE_NEWS_RE.test(source.url))');
  expect(ingest).toContain('const google = rotateGoogleSources(allGoogle)');
  expect(ingest).toContain('isGoogle ? 2 : isHtmlLinks ? 1 : 3');
  expect(ingest).toContain('isGoogle ? 10000 : isHtmlLinks ? 12000 : 25000');
});
