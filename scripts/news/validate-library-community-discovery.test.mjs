import fs from 'node:fs';
import { expect, test } from 'vitest';

const relay = fs.readFileSync('supabase/functions/ktr-rss-relay/index.ts', 'utf8');
const migration = fs.readFileSync(
  'supabase/migrations/20260829151000_add_texas_state_library_direct_feed.sql',
  'utf8',
);

test('library and museum discovery query is broad enough for grants, gifts, expansions, and exhibits', () => {
  const marker = '"google-libraries-museums"';
  const start = relay.indexOf(marker);
  expect(start).toBeGreaterThanOrEqual(0);
  const line = relay.slice(start, relay.indexOf('\n', start));
  for (const term of ['library', 'museum', 'community+foundation', 'grant', 'donation', 'gift', 'expansion', 'exhibit']) {
    expect(line).toContain(term);
  }
  expect(line).not.toContain('library+%22million%22+grant');
});

test('Texas State Library direct feed is first-party and review-only', () => {
  expect(migration).toContain("'Texas State Library — Library Developments'");
  expect(migration).toContain("'https://www.tsl.texas.gov/ld/librarydevelopments/?feed=rss2'");
  expect(migration).toMatch(/source_reputation_score\s*=\s*60/);
  expect(migration).toMatch(/below 65 automatic-source threshold/);
  expect(migration).not.toMatch(/source_reputation_score\s*=\s*(?:6[5-9]|[7-9]\d|100)\b/);
});
