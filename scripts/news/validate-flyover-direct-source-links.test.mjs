import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260828231500_reconcile_flyover_direct_source_links.sql', 'utf8');

test('legacy Flyover Google wrappers reconcile to direct publisher URLs only while unlinked', () => {
  for (const token of [
    'ksat.com/video/sports/2026/08/13/faith-speed-gold',
    'nbcdfw.com/news/local/3-alligators-shot-fort-worth-nature-center-reward-offered/4060038',
    'fox26houston.com/news/texas-appeals-court-upholds-state-fair-gun-ban.amp',
    'kristv.com/news/local-news/in-your-neighborhood/corpus-christi/michelle-and-bryan-hofmann-say-goodbye',
    'internal_slug is null',
    'texasdefined_slug is null',
  ]) expect(migration).toContain(token);
  expect(migration).not.toContain('where id =');
  expect(migration).not.toContain('news.google.com');
});
