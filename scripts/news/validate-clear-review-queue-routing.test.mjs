import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260827220500_route_clear_review_queue_topics.sql', 'utf8');

test('clear business topics route to KTR Business', () => {
  for (const term of ['nyse texas', 'txse', 'stock exchange', 'financially struggling']) {
    expect(migration).toContain(term);
  }
  expect(migration).toContain("'Business'");
});

test('municipal water topics route as hard news', () => {
  for (const term of ['water utilities', 'water demands', 'dam and spillway']) {
    expect(migration).toContain(term);
  }
  expect(migration).toContain("'Texas News'");
});

test('clear lifestyle and outdoors topics route to TexasDefined', () => {
  for (const term of ['clear the shelters', 'animal services', 'cultural center', 'watermelon capital', 'big bend', 'hunter education']) {
    expect(migration).toContain(term);
  }
  expect(migration).toContain("'Texas Life'");
  expect(migration).toContain("'Explore'");
});
