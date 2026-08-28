import { describe, expect, test } from 'vitest';
import fs from 'node:fs';

const lowValue = fs.readFileSync('src/lib/low-value-titles.ts', 'utf8');
const baseMigration = fs.readFileSync('supabase/migrations/20260828144500_guard_newsroom_route_quality.sql', 'utf8');
const finalMigration = fs.readFileSync('supabase/migrations/20260828150000_finalize_newsroom_sports_quality_guard.sql', 'utf8');

describe('newsroom route quality guard', () => {
  test('filters obituary and death-notice listings', () => {
    expect(lowValue).toContain('\\bobituary\\b');
    expect(lowValue).toContain('^death notice\\b');
    expect(baseMigration).toContain('Obituary/death-notice listing is not a newsroom story');
  });

  test('uses word-bounded sports league tokens so inflation cannot match nfl', () => {
    expect(finalMigration).toContain("\\m(nfl|nba|mlb|nhl|mls|wnba)\\M");
    expect(finalMigration).toContain('Sports route lacked a real sports signal');
    expect(finalMigration).toContain('is_law_enforcement_rangers');
  });

  test('trusts sports publishers while preserving the Rangers law-enforcement veto', () => {
    for (const token of ['is_known_sports_source', '\\msports\\M|athletics', 'texas rangers|houston astros|houston texans', 'department of public safety', 'series|rubber match']) {
      expect(finalMigration).toContain(token);
    }
    expect(finalMigration).toContain("new.target_section := 'Sports'");
  });

  test('routes deterministic lifestyle/community classes to TexasDefined', () => {
    for (const token of ['new businesses? now open', 'placemaking through art', 'baby shower', "new.target_site := 'texasdefined'"]) {
      expect(finalMigration).toContain(token);
    }
  });

  test('re-evaluates only recent unlinked rows', () => {
    expect(finalMigration).toContain('internal_slug is null');
    expect(finalMigration).toContain('texasdefined_slug is null');
    expect(finalMigration).toContain("created_at >= now() - interval '14 days'");
  });
});
