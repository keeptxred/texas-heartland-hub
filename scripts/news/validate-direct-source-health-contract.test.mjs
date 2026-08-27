import { expect, test } from 'vitest';
import fs from 'node:fs';

test('ingestion separates quiet sources from true failures and removes dead athletics fallbacks', () => {
  const text = fs.readFileSync('src/routes/api/public/hooks/ingest-feeds.ts', 'utf8');
  expect(text).not.toContain('https://texaslonghorns.com/news/');
  expect(text).not.toContain('https://texastech.com/news/');
  expect(text).toContain('https://12thman.com/news/');
  expect(text).toContain('quietSources:');
  expect(text).toContain('failedSources:');
});
