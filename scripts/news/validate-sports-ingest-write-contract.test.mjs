import { expect, test } from 'vitest';
import fs from 'node:fs';

test('sports ingestion preserves attribution and batches feed writes', () => {
  const text = fs.readFileSync('src/routes/api/public/hooks/ingest-sports.ts', 'utf8');
  expect(text).toContain('const SPORTS_UPSERT_BATCH_SIZE = 50;');
  expect(text).toContain('trend_source: source.name');
  expect(text).toContain('offset += SPORTS_UPSERT_BATCH_SIZE');
  expect(text).toContain('failedBatchOffset: offset');
});
