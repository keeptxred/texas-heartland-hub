import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260827191500_route_google_discovery_through_relay.sql', 'utf8');
const relay = fs.readFileSync('supabase/functions/ktr-rss-relay/index.ts', 'utf8');

const feedKeys = [
  'google-executive-actions',
  'google-attorney-general',
  'google-dps-wanted',
  'google-city-county-decisions',
  'google-police-fire',
  'google-courts-appointments',
  'google-higher-education',
  'google-corporate-expansions',
  'google-workforce-grants',
  'google-property-alerts',
  'google-wildlife',
  'google-libraries-museums',
  'google-awards-recognition',
  'google-sports-recruiting',
  'google-sports-records',
  'google-airports-travel',
  'google-local-oddities',
];

test('Google discovery uses the fixed allowlist RSS relay', () => {
  expect(migration).toContain('/functions/v1/ktr-rss-relay?feed=');
  expect(relay).toContain('const FEEDS: Record<string, string>');
  expect(relay).toContain('const upstreamUrl = FEEDS[key]');
  expect(relay).toContain('if (!upstreamUrl) return new Response("Unknown feed", { status: 404 });');
  for (const key of feedKeys) {
    expect(migration).toContain(key);
    expect(relay).toContain(`"${key}"`);
  }
  expect(feedKeys).toHaveLength(17);
});
