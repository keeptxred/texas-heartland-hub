import { expect, test } from 'vitest';
import fs from 'node:fs';
import { isGoogleNewsDiscoveryTransport } from '../../src/lib/ingest-discovery-source';

const migration = fs.readFileSync('supabase/migrations/20260827215955_restore_full_relay_discovery_coverage.sql', 'utf8');
const ingest = fs.readFileSync('src/routes/api/public/hooks/ingest-feeds.ts', 'utf8');

test('relay-backed Google discovery is not throttled as raw Google transport', () => {
  expect(migration).toContain('?transport=relay&feed=\\1');
  expect(migration).toContain('ktr-rss-relay\\?feed=google-');
  expect(ingest).toContain('GOOGLE_FEEDS_PER_RUN = 10');
  expect(ingest).toContain('news\\.google\\.com');
  expect(ingest).toContain('const allGoogle = sources.filter((source) => isGoogleNewsDiscoveryTransport(source.url));');
  expect(ingest).toContain('const configuredDirect = sources.filter((source) => !isGoogleNewsDiscoveryTransport(source.url));');
  expect(isGoogleNewsDiscoveryTransport('https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-priority?transport=relay&feed=google-texas-business-longtail')).toBe(true);
  expect(isGoogleNewsDiscoveryTransport('https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?feed=official-governor-rss')).toBe(false);
  expect(migration).toContain('transport=relay');
});
