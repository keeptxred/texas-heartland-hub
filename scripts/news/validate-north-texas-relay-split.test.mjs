import { expect, test } from 'vitest';
import fs from 'node:fs';

const relay = fs.readFileSync('supabase/functions/ktr-rss-relay-north/index.ts', 'utf8');
const migration = fs.readFileSync('supabase/migrations/20260829025000_split_north_texas_regional_discovery_relay.sql', 'utf8');

test('North Texas discovery uses two bounded fixed relay feeds', () => {
  for (const token of ['"dfw-cross-timbers"', '"western-north-texas"', '%22Fort+Worth%22', '%22Wichita+Falls%22']) {
    expect(relay).toContain(token);
  }
  expect(relay).not.toContain('Fort+Worth+OR+Arlington+OR+Denton+OR+Weatherford+OR+Mineral+Wells+OR+Graham+OR+Jacksboro+OR+Wichita+Falls');
  expect(migration).toContain('North Texas and Cross Timbers — Regional Discovery');
  expect(migration).toContain('Western North Texas and Red River — Regional Discovery');
  expect(migration).toContain('ktr-rss-relay-north?feed=dfw-cross-timbers');
  expect(migration).toContain('ktr-rss-relay-north?feed=western-north-texas');
});
