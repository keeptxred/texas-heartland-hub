import { expect, test } from 'vitest';
import fs from 'node:fs';

const ingest = fs.readFileSync('src/routes/api/public/hooks/ingest-feeds.ts', 'utf8');

test('feed ingestion writes only new candidates in bounded database batches', () => {
  expect(ingest).toContain('const INGEST_UPSERT_BATCH_SIZE = 20');
  expect(ingest).toContain('.select("link")');
  expect(ingest).toContain('.in("link", linkBatch)');
  expect(ingest).toContain('const newRows = rows.filter((row) => !existingLinks.has(row.link))');
  expect(ingest).toContain('offset < newRows.length');
  expect(ingest).toContain('newRows.slice(offset, offset + INGEST_UPSERT_BATCH_SIZE)');
  expect(ingest).toContain('failedExistingLinkOffset: offset');
  expect(ingest).toContain('failedBatchOffset: offset');
  expect(ingest).not.toContain('.upsert(rows, { onConflict: "link"');
});
