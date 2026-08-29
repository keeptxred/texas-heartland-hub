import { expect, test } from 'vitest';
import fs from 'node:fs';

const relay = fs.readFileSync('supabase/functions/ktr-rss-relay-priority/index.ts', 'utf8');
const migration = fs.readFileSync('supabase/migrations/20260829041500_prioritize_stale_prone_google_sources.sql', 'utf8');

const priorityKeys = [
  'google-airports-travel',
  'google-dps-wanted',
  'google-higher-education',
  'google-police-fire',
  'google-primary-workforce',
];

test('priority relay is a fixed allowlist over the existing RSS relay', () => {
  expect(relay).toContain('new Set([');
  expect(relay).toContain('/functions/v1/ktr-rss-relay');
  expect(relay).toContain('Unknown feed');
  for (const key of priorityKeys) expect(relay).toContain(`"${key}"`);
});

test('stale-prone lanes move off the 35-feed rotation without changing editorial gates', () => {
  for (const key of priorityKeys) {
    expect(migration).toContain(`ktr-rss-relay-priority?feed=${key}`);
  }
  expect(migration).not.toMatch(/auto_publish|ready_for_rewrite|viral_score|target_site|target_section/i);
});
