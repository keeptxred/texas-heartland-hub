import { expect, test } from 'vitest';
import fs from 'node:fs';

const relay = fs.readFileSync('supabase/functions/ktr-rss-relay-sports/index.ts', 'utf8');
const migration = fs.readFileSync('supabase/migrations/20260829040000_expand_texas_pro_sports_discovery.sql', 'utf8');

test('expanded Texas pro sports discovery covers the canonical uncovered teams', () => {
  for (const team of ['Houston+Rockets', 'Dallas+Wings', 'Austin+FC', 'FC+Dallas', 'Houston+Dynamo+FC', 'Houston+Dash']) {
    expect(relay).toContain(team);
  }
  expect(relay).toContain('basketball-expansion');
  expect(relay).toContain('soccer-women');
  expect(migration).toContain('Texas Pro Basketball — Rockets and Wings Discovery');
  expect(migration).toContain('Texas Pro Soccer — Daily Discovery');
});

test('expanded pro sports lanes remain guarded and publication-ineligible on contamination', () => {
  expect(migration).toContain('guard_expanded_texas_pro_sports_discovery_row');
  expect(migration).toContain("'source_contamination',true");
  expect(migration).toContain("'auto_publish_eligible',false");
  expect(migration).toContain("'routing_lock',true");
  expect(migration).toContain("new.target_site := 'review'");
  expect(migration).toContain("new.target_section := 'Unclassified'");
  expect(migration).toContain("new.target_site := 'keeptxred'");
  expect(migration).toContain("new.target_section := 'Sports'");
  expect(migration).toContain('how to watch');
});
