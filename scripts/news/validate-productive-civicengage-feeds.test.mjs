import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync(
  'supabase/migrations/20260828141000_repair_productive_civicengage_feeds.sql',
  'utf8',
);

const expected = [
  ['Webster Municipal Agendas — CivicEngage', 'www.webstertx.gov/RSSFeed.aspx?CID=All-0&ModID=65'],
  ['Sinton Municipal Agendas — CivicEngage', 'www.sintontexas.org/RSSFeed.aspx?CID=All-0&ModID=65'],
  ['Paris Municipal News — CivicEngage', 'paristexas.gov/RSSFeed.aspx?CID=All-newsflash.xml&ModID=1'],
  ['Texas City Municipal News — CivicEngage', 'texascitytx.gov/RSSFeed.aspx?CID=All-newsflash.xml&ModID=1'],
  ['Galveston Municipal News — CivicEngage', 'www.galvestontx.gov/RSSFeed.aspx?CID=All-newsflash.xml&ModID=1'],
];

test('persistently empty CivicEngage feeds are replaced with verified productive official feeds', () => {
  for (const [name, url] of expected) {
    expect(migration).toContain(name);
    expect(migration).toContain(url);
  }
  expect(migration).not.toMatch(/ready_for_rewrite/i);
  expect(migration).not.toMatch(/auto_publish/i);
  expect(migration).not.toMatch(/daily_articles/i);
});
