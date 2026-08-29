import { expect, test } from 'vitest';
import fs from 'node:fs';

const relay = fs.readFileSync('supabase/functions/ktr-rss-relay-priority/index.ts', 'utf8');
const migration = fs.readFileSync('supabase/migrations/20260829153000_route_high_value_discovery_through_priority_relay.sql', 'utf8');

test('priority RSS relay remains closed and bounded', () => {
  for (const key of [
    'google-airports-travel',
    'google-dps-wanted',
    'google-higher-education',
    'google-police-fire',
    'google-primary-workforce',
    'google-primary-governor',
    'google-workforce-grants',
  ]) {
    expect(relay).toContain(`"${key}"`);
  }
  expect(relay).toContain('if (!FEEDS.has(key))');
  expect(relay).toContain('attempt <= 2');
  expect(relay).toContain('TRANSIENT.has(upstream.status)');
  expect(relay).toContain('AbortSignal.timeout(20000)');
  expect(relay).toContain('X-KTR-RSS-Priority-Attempts');
});

test('observed high-value failures use the priority relay', () => {
  expect(migration).toContain("Texas Governor Primary Source — Google News");
  expect(migration).toContain('feed=google-primary-governor');
  expect(migration).toContain("Texas Grants and Workforce Investments — Google News");
  expect(migration).toContain('feed=google-workforce-grants');
  expect(migration).toContain('enabled = true');
});
