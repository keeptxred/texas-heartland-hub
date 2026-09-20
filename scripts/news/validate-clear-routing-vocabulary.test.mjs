import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync('supabase/migrations/20260827215000_expand_clear_newsroom_routing_vocabulary.sql', 'utf8');

test('criminal justice vocabulary routes into hard news', () => {
  for (const term of ['charges filed', 'grand jury', 'sentenced', 'murder-for-hire', 'search warrant']) {
    expect(migration).toContain(term);
  }
  expect(migration).toContain("'Texas News'");
});

test('clear political title vocabulary routes to Politics', () => {
  for (const term of ['senator', 'president trump']) expect(migration).toContain(term);
  expect(migration).toContain("'Politics'");
});

test('clear lifestyle vocabulary routes to TexasDefined', () => {
  for (const term of ['chicken salad chick', 'hand roll bar', 'botanical garden']) {
    expect(migration).toContain(term);
  }
  expect(migration).toContain("'Food & Drink'");
  expect(migration).toContain("'Explore'");
});
