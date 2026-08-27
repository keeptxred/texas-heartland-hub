import { expect, test } from 'vitest';
import fs from 'node:fs';

test('ingestion separates quiet sources from true failures and removes redundant fallbacks', () => {
  const text = fs.readFileSync('src/routes/api/public/hooks/ingest-feeds.ts', 'utf8');
  for (const retiredUrl of [
    'https://texaslonghorns.com/news/',
    'https://texastech.com/news/',
    'https://www.wfaa.com/',
    'https://www.mlb.com/rangers/news',
  ]) {
    expect(text).not.toContain(retiredUrl);
  }
  expect(text).toContain('https://12thman.com/news/');
  expect(text).toContain('quietSources:');
  expect(text).toContain('failedSources:');
});
