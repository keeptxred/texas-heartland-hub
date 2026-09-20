import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync(
  'supabase/migrations/20260828214000_canonicalize_google_relay_query_order.sql',
  'utf8',
);
const ingest = fs.readFileSync('src/routes/api/public/hooks/ingest-feeds.ts', 'utf8');

test('Google relay URLs keep the feed parameter first so rotation recognizes them', () => {
  expect(migration).toContain('?transport=relay&feed=(google-[^&]+)');
  expect(migration).toContain('?feed=\\1&transport=relay');
  expect(ingest).toContain('ktr-rss-relay\\?feed=google-');
  expect(ingest).toContain('GOOGLE_FEEDS_PER_RUN = 10');
});
