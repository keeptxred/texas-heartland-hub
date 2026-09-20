import { expect, test } from 'vitest';
import fs from 'node:fs';

const ingest = fs.readFileSync('src/routes/api/public/hooks/ingest-feeds.ts', 'utf8');

test('feed ingestion writes candidates in bounded database batches', () => {
  expect(ingest).toContain('const INGEST_UPSERT_BATCH_SIZE = 200');
  expect(ingest).toContain('offset += INGEST_UPSERT_BATCH_SIZE');
  expect(ingest).toContain('rows.slice(offset, offset + INGEST_UPSERT_BATCH_SIZE)');
  expect(ingest).toContain('failedBatchOffset: offset');
  expect(ingest).not.toContain('.upsert(rows, { onConflict: "link"');
});
