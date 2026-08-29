import fs from 'node:fs';
import { expect, test } from 'vitest';

const relay = fs.readFileSync('supabase/functions/ktr-rss-relay/index.ts', 'utf8');
const migration = fs.readFileSync(
  'supabase/migrations/20260829161000_add_targeted_local_primary_discovery.sql',
  'utf8',
);

const expected = [
  ['google-primary-abc13-houston', 'ABC13 Houston — Site Discovery', 'site%3Aabc13.com', 'when%3A3d'],
  ['google-primary-kgns-laredo', 'KGNS Laredo — Site Discovery', 'site%3Akgns.tv', 'when%3A3d'],
  ['google-primary-messer-texas', 'Messer Texas Press Releases — Site Discovery', 'site%3Amesser-us.com', 'when%3A30d'],
  ['google-primary-ector-library', 'Ector County Library Press — Site Discovery', 'site%3Aector.lib.tx.us', 'when%3A30d'],
];

test('targeted local and first-party gaps use fixed Google relay keys', () => {
  for (const [key, sourceName, siteToken, windowToken] of expected) {
    const marker = `"${key}"`;
    const start = relay.indexOf(marker);
    expect(start).toBeGreaterThanOrEqual(0);
    const line = relay.slice(start, relay.indexOf('\n', start));
    expect(line).toContain(siteToken);
    expect(line).toContain(windowToken);
    expect(migration).toContain(sourceName);
    expect(migration).toContain(`feed=${key}`);
  }
});

test('new targeted sources remain review-only and do not bypass the relay', () => {
  expect(migration).toContain('source_reputation_score = 60');
  expect(migration).toContain('below 65 automatic-source threshold');
  expect(migration).toContain('/functions/v1/ktr-rss-relay?feed=');
  expect(migration).not.toContain('news.google.com');
  expect(migration).not.toContain('auto_publish_eligible');
});
