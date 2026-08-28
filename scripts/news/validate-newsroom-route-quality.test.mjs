import { describe, expect, test } from 'vitest';
import fs from 'node:fs';

const lowValue = fs.readFileSync('src/lib/low-value-titles.ts', 'utf8');
const baseMigration = fs.readFileSync('supabase/migrations/20260828144500_guard_newsroom_route_quality.sql', 'utf8');
const sportsRefinement = fs.readFileSync('supabase/migrations/20260828145500_refine_newsroom_sports_quality_guard.sql', 'utf8');

describe('newsroom route quality guard', () => {
  test('filters obituary and death-notice listings', () => {
    expect(lowValue).toContain('\\bobituary\\b');
    expect(lowValue).toContain('^death notice\\b');
    expect(baseMigration).toContain('Obituary/death-notice listing is not a newsroom story');
  });

  test('uses word-bounded sports league tokens so inflation cannot match nfl', () => {
    expect(sportsRefinement).toContain("\\m(nfl|nba|mlb|nhl|mls|wnba)\\M");
    expect(sportsRefinement).toContain('Sports route lacked a real sports signal');
    expect(sportsRefinement).toContain('is_law_enforcement_rangers');
  });

  test('trusts known sports feeds while preserving the Rangers law-enforcement veto', () => {
    for (const token of ['is_known_sports_source', 'texas rangers|houston astros|houston texans', 'texas sports recruiting', 'department of public safety']) {
      expect(sportsRefinement).toContain(token);
    }
    expect(sportsRefinement).toContain("new.target_section := 'Sports'");
  });

  test('routes deterministic lifestyle/community classes to TexasDefined', () => {
    for (const token of ['new businesses? now open', 'placemaking through art', 'baby shower', "new.target_site := 'texasdefined'"]) {
      expect(sportsRefinement).toContain(token);
    }
  });

  test('re-evaluates only recent unlinked rows', () => {
    expect(sportsRefinement).toContain('internal_slug is null');
    expect(sportsRefinement).toContain('texasdefined_slug is null');
    expect(sportsRefinement).toContain("created_at >= now() - interval '14 days'");
  });
});
