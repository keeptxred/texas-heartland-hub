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
  expect(ingest).toContain('async function upsertFeedRowsAdaptive');
  expect(ingest).toContain('error.code === "57014"');
  expect(ingest).toContain('batch.slice(0, midpoint)');
  expect(ingest).toContain('batch.slice(midpoint)');
  expect(ingest).toContain('singletonRetry < 2');
  expect(ingest).not.toContain('.upsert(rows, { onConflict: "link"');
});


test('feed attribution backfill is bounded, sequential, and timeout-resilient', () => {
  expect(ingest).toContain('const ATTRIBUTION_BACKFILL_BATCH_SIZE = 20');
  expect(ingest).toContain('async function backfillTrendSourceAdaptive');
  expect(ingest).toContain('offset < links.length');
  expect(ingest).toContain('links.slice(offset, offset + ATTRIBUTION_BACKFILL_BATCH_SIZE)');
  expect(ingest).toContain('await backfillTrendSourceAdaptive(supabaseAdmin, trendSource, linkBatch)');
  expect(ingest).toContain('.select("link,trend_source")');
  expect(ingest).toContain('if (existingRow.trend_source == null) attributionNeededLinks.add(existingRow.link)');
  expect(ingest).toContain('const missingAttributionLinks = links.filter((link) => attributionNeededLinks.has(link))');
  expect(ingest).toContain('links.slice(0, midpoint)');
  expect(ingest).toContain('links.slice(midpoint)');
  expect(ingest).toContain('attributionFailures');
  expect(ingest).not.toContain('Promise.all([...attributionGroups.entries()]');
});
