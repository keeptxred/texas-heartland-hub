import { expect, test } from 'vitest';
import fs from 'node:fs';
import { isGoogleNewsDiscoveryTransport } from '../../src/lib/ingest-discovery-source';

const migration = fs.readFileSync(
  'supabase/migrations/20260828214000_canonicalize_google_relay_query_order.sql',
  'utf8',
);
const ingest = fs.readFileSync('src/routes/api/public/hooks/ingest-feeds.ts', 'utf8');

test('Google relay URLs keep the feed parameter first so rotation recognizes them', () => {
  expect(migration).toContain('?transport=relay&feed=(google-[^&]+)');
  expect(migration).toContain('?feed=\\1&transport=relay');
  const base = 'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/';
  expect(isGoogleNewsDiscoveryTransport(base + 'ktr-rss-relay?feed=google-texas&transport=relay')).toBe(true);
  expect(isGoogleNewsDiscoveryTransport(base + 'ktr-rss-relay-priority?transport=relay&feed=google-texas')).toBe(true);
  expect(isGoogleNewsDiscoveryTransport(base + 'ktr-rss-relay?feed=official-governor-rss')).toBe(false);
  expect(ingest).toContain('rotateGoogleSources(allGoogle)');
  expect(ingest).toContain('GOOGLE_FEEDS_PER_RUN = 10');
});
