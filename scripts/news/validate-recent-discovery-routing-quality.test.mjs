import { expect, test } from 'vitest';
import fs from 'node:fs';

const routing = fs.readFileSync('supabase/migrations/20260828154500_route_high_confidence_recent_discovery_gaps.sql', 'utf8');
const syndication = fs.readFileSync('supabase/migrations/20260828154600_dequeue_obvious_national_syndication_noise.sql', 'utf8');

test('high-confidence discovery recovery is narrow and non-destructive', () => {
  for (const token of [
    'council of governments',
    'loop [0-9]+.*shutdown',
    'thunderstorms?.*hail',
    'maternal health program',
    'health sciences center.*grant',
    'piercings?',
    'german store',
    '\\mbatmobile\\M',
    '\\mfest\\M',
    'leaves change colors',
    "new.target_site := 'texasdefined'",
    "new.target_site := 'keeptxred'",
  ]) expect(routing).toContain(token);

  expect(routing).toContain("created_at >= now() - interval '14 days'");
  expect(routing).toContain('internal_slug is null');
  expect(routing).toContain('texasdefined_slug is null');
  expect(routing).not.toContain('delete from public.texas_news_feed');
});

test('obvious national syndication noise is de-queued without deleting history', () => {
  for (const token of [
    'KRIS 6 — Corpus Christi Local',
    'KZTV Action 10 — Corpus Christi Local',
    'tennessee national guard',
    'fed chair',
    'foldable iphone',
    'national_syndication_noise',
    "new.routing_type := null",
    "new.ready_for_rewrite := false",
    "'auto_publish_eligible',false",
  ]) expect(syndication.toLowerCase()).toContain(token.toLowerCase());

  expect(syndication).toContain('internal_slug is null');
  expect(syndication).toContain('texasdefined_slug is null');
  expect(syndication).not.toContain('delete from public.texas_news_feed');
});
