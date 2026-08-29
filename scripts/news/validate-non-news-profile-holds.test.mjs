import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260828224500_hold_non_news_event_and_player_profiles.sql', 'utf8');

test('non-news profile hold is narrow and preserves real recruiting news', () => {
  for (const token of [
    'guard_non_news_listing_profiles',
    "t = 'singo bingo'",
    "src ~ '247sports'",
    'wide receiver',
    'commits?',
    'player profile card',
    "'low_value_title', true",
    "'auto_publish_eligible', false",
    "'routing_lock', true",
  ]) expect(migration).toContain(token);
  expect(migration).toContain('new.internal_slug is not null or new.texasdefined_slug is not null');
});
