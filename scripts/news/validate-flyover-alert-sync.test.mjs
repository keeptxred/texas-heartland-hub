import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260827222000_sync_flyover_ledger_alerts.sql', 'utf8');

test('Flyover alerts derive from the durable ledger and preserve publication holds', () => {
  expect(migration).toContain("count(*) filter (where disposition='review_ready')");
  expect(migration).toContain("count(*) filter (where disposition='source_needed')");
  expect(migration).toContain('none should auto-publish');
  expect(migration).toContain('flyover-aug10-review-ready');
  expect(migration).toContain('flyover-aug10-source-needed');
  expect(migration).toContain('after insert or update or delete');
  expect(migration).not.toContain('daily_articles');
  expect(migration).not.toContain('publishSingleFeedItem');
});
