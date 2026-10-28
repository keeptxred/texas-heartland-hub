import { expect, test } from 'vitest';
import fs from 'node:fs';

const ingest = fs.readFileSync('src/routes/api/public/hooks/ingest-feeds.ts', 'utf8');
const discovery = fs.readFileSync('src/lib/ingest-discovery-source.ts', 'utf8');

test('relayed Google discovery stays in the bounded Google rotation', () => {
  expect(discovery).toContain('ktr-rss-relay-priority');
  expect(discovery).toContain('ktr-rss-relay-north');
  expect(discovery).toContain('ktr-rss-relay-sports');
  expect(ingest).toContain('const GOOGLE_FEEDS_PER_RUN = 10');
  expect(ingest).toContain('const configuredDirect = sources.filter((source) => !isGoogleNewsDiscoveryTransport(source.url))');
  expect(ingest).toContain('const directWindow = selectRotatedSourceWindow(');
  expect(ingest).toContain('const direct = directWindow.selected');
  expect(ingest).toContain('const SUPPLEMENTAL_DIRECT_FEEDS_PER_RUN = 12');
  expect(ingest).toContain('directSourcesDeferred: directWindow.deferred');
  expect(ingest).toContain('const allGoogle = sources.filter((source) => isGoogleNewsDiscoveryTransport(source.url))');
  expect(ingest).toContain('const google = rotateGoogleSources(allGoogle)');
  expect(ingest).toContain('fixedRelayUrl ? 1 : isGoogle ? 2 : isHtmlLinks ? 1 : 2');
  expect(ingest).toContain('fixedRelayUrl ? 7000 : isGoogle ? 10000 : isHtmlLinks ? 12000 : 14000');
});
