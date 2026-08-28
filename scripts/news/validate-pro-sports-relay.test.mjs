import { expect, test } from 'vitest';
import fs from 'node:fs';

const relay = fs.readFileSync('supabase/functions/ktr-rss-relay/index.ts', 'utf8');
const migration = fs.readFileSync('supabase/migrations/20260827202000_enable_relayed_texas_pro_sports_discovery.sql', 'utf8');
const ingest = fs.readFileSync('src/routes/api/public/hooks/ingest-feeds.ts', 'utf8');

test('Texas pro sports discovery uses the fixed relay', () => {
  expect(relay).toContain('"google-pro-sports"');
  for (const team of ['Dallas Mavericks', 'Dallas Cowboys', 'Texas Rangers', 'Houston Astros', 'Houston Texans', 'San Antonio Spurs']) {
    const encodedExactPhrase = `%22${team.replaceAll(' ', '+')}%22`;
    expect(relay).toContain(encodedExactPhrase);
  }
  expect(migration).toContain('feed=google-pro-sports');
  expect(migration).toContain("enabled = true");
  expect(migration).toContain("Texas Pro Sports — Daily Discovery");
});

test('zero-yield Mavericks and Spurs HTML scrapers stay retired', () => {
  expect(ingest).not.toContain('https://www.mavs.com/news/');
  expect(ingest).not.toContain('https://www.nba.com/spurs/news');
  expect(ingest).toContain('KSAT Spurs');
});
