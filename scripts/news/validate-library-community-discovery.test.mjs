import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const relay = fs.readFileSync('supabase/functions/ktr-rss-relay/index.ts', 'utf8');
const migration = fs.readFileSync(
  'supabase/migrations/20260829151000_add_texas_state_library_direct_feed.sql',
  'utf8',
);

test('library and museum discovery query is broad enough for grants, gifts, expansions, and exhibits', () => {
  const marker = '"google-libraries-museums"';
  const start = relay.indexOf(marker);
  assert.ok(start >= 0, 'missing google-libraries-museums relay feed');
  const line = relay.slice(start, relay.indexOf('\n', start));
  for (const term of ['library', 'museum', 'community+foundation', 'grant', 'donation', 'gift', 'expansion', 'exhibit']) {
    assert.ok(line.includes(term), `missing library/community discovery term: ${term}`);
  }
  assert.ok(!line.includes('library+%22million%22+grant'), 'old million-only library grant restriction returned');
});

test('Texas State Library direct feed is first-party and review-only', () => {
  assert.ok(migration.includes("'Texas State Library — Library Developments'"));
  assert.ok(migration.includes("'https://www.tsl.texas.gov/ld/librarydevelopments/?feed=rss2'"));
  assert.match(migration, /source_reputation_score\s*=\s*60/);
  assert.match(migration, /below 65 automatic-source threshold/);
  assert.ok(!/source_reputation_score\s*=\s*(?:6[5-9]|[7-9]\d|100)\b/.test(migration));
});
