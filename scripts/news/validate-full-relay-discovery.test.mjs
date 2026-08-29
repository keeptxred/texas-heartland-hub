import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260827215955_restore_full_relay_discovery_coverage.sql', 'utf8');
const ingest = fs.readFileSync('src/routes/api/public/hooks/ingest-feeds.ts', 'utf8');

test('relay-backed Google discovery is not throttled as raw Google transport', () => {
  expect(migration).toContain('?transport=relay&feed=\\1');
  expect(migration).toContain('ktr-rss-relay\\?feed=google-');
  expect(ingest).toContain('GOOGLE_FEEDS_PER_RUN = 10');
  expect(ingest).toContain('news\\.google\\.com');
  expect(ingest).toContain('ktr-rss-relay\\?feed=google-');
  expect(migration).toContain('transport=relay');
});
