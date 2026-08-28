import { describe, expect, test } from 'vitest';
import fs from 'node:fs';

const lowValue = fs.readFileSync('src/lib/low-value-titles.ts', 'utf8');
const migration = fs.readFileSync('supabase/migrations/20260828144500_guard_newsroom_route_quality.sql', 'utf8');

describe('newsroom route quality guard', () => {
  test('filters obituary and death-notice listings', () => {
    expect(lowValue).toContain('\\bobituary\\b');
    expect(lowValue).toContain('^death notice\\b');
    expect(migration).toContain('Obituary/death-notice listing is not a newsroom story');
  });

  test('uses word-bounded sports league tokens so inflation cannot match nfl', () => {
    expect(migration).toContain("\\m(nfl|nba|mlb|nhl|mls|wnba)\\M");
    expect(migration).toContain('Sports route lacked a real sports signal');
    expect(migration).toContain('is_law_enforcement_rangers');
  });

  test('routes deterministic lifestyle/community classes to TexasDefined', () => {
    for (const token of ['new businesses? now open', 'placemaking through art', 'baby shower', "new.target_site := 'texasdefined'"]) {
      expect(migration).toContain(token);
    }
  });

  test('re-evaluates only recent unlinked rows', () => {
    expect(migration).toContain('internal_slug is null');
    expect(migration).toContain('texasdefined_slug is null');
    expect(migration).toContain("created_at >= now() - interval '14 days'");
  });
});
