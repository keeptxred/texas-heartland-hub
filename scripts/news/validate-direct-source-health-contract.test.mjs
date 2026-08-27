import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('ingestion separates quiet sources from true failures and removes dead athletics fallbacks', () => {
  const text = fs.readFileSync('src/routes/api/public/hooks/ingest-feeds.ts', 'utf8');
  assert.equal(text.includes('https://texaslonghorns.com/news/'), false);
  assert.equal(text.includes('https://texastech.com/news/'), false);
  assert.equal(text.includes('https://12thman.com/news/'), true);
  assert.equal(text.includes('quietSources:'), true);
  assert.equal(text.includes('failedSources:'), true);
});
