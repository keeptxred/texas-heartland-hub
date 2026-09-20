import { expect, test } from 'vitest';
import fs from 'node:fs';

const migration = fs.readFileSync(
  'supabase/migrations/20260828220500_add_kvia_el_paso_direct_source.sql',
  'utf8',
);

test('KVIA El Paso direct source stays enabled and local', () => {
  expect(migration).toContain('KVIA ABC-7 — El Paso Local');
  expect(migration).toContain('https://kvia.com/news/el-paso/feed/');
  expect(migration).toContain("category = 'Local'");
  expect(migration).toContain('enabled = true');
});
