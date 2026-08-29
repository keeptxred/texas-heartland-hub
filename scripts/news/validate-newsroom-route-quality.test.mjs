import { describe, expect, test } from 'vitest';
import fs from 'node:fs';

const lowValue = fs.readFileSync('src/lib/low-value-titles.ts', 'utf8');
const baseMigration = fs.readFileSync('supabase/migrations/20260828144500_guard_newsroom_route_quality.sql', 'utf8');
const finalMigration = fs.readFileSync('supabase/migrations/20260828151000_finalize_trusted_sports_and_rangers_news_routing.sql', 'utf8');
const educationUtilityMigration = fs.readFileSync('supabase/migrations/20260829152500_filter_education_utility_pages.sql', 'utf8');

describe('newsroom route quality guard', () => {
  test('filters obituary and death-notice listings', () => {
    expect(lowValue).toContain('\\bobituary\\b');
    expect(lowValue).toContain('^death notice\\b');
    expect(baseMigration).toContain('Obituary/death-notice listing is not a newsroom story');
  });

  test('filters static TEA and TPRS utility landing pages', () => {
    expect(lowValue).toContain('^tea$');
    expect(lowValue).toContain('texas performance reporting system');
    expect(educationUtilityMigration).toContain("trend_source = 'Texas Education Primary Sources — Google News'");
    expect(educationUtilityMigration).toContain("internal_slug is null");
    expect(educationUtilityMigration).toContain("texasdefined_slug is null");
    expect(educationUtilityMigration).toContain("auto_publish_eligible");
  });

  test('uses word-bounded sports league tokens so inflation cannot match nfl', () => {
    expect(finalMigration).toContain("\\m(nfl|nba|mlb|nhl|mls|wnba)\\M");
    expect(finalMigration).toContain('Sports route lacked a real sports signal');
  });

  test('trusts dedicated sports publishers and feeds', () => {
    for (const token of ['is_known_sports_source', '\\msports\\M|athletics', 'texags', 'burnt orange nation', 'blogging the boys']) {
      expect(finalMigration).toContain(token);
    }
    expect(finalMigration).toContain("new.target_section := 'Sports'");
  });

  test('routes Texas Rangers law-enforcement stories to KTR Texas News', () => {
    expect(finalMigration).toContain('is_law_enforcement_rangers');
    expect(finalMigration).toContain('department of public safety');
    expect(finalMigration).toContain("new.target_section := 'Texas News'");
    expect(finalMigration).toContain('Texas Rangers law-enforcement story routed to Texas News');
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
