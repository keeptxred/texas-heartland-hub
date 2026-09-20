import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260819183500_adsense_review_hold_routing.sql",
  "utf8",
);

describe("AdSense review-hold feed routing", () => {
  it("holds unmatched stories instead of defaulting them to KeepTXRed", () => {
    expect(migration).toContain("NEW.target_site := 'review';");
    expect(migration).toContain("NEW.target_section := 'Unclassified';");
    expect(migration).not.toContain("ELSE\n    NEW.target_site := 'keeptxred';\n    NEW.target_section := 'Texas News';");
  });

  it("backfills only unlinked generic KTR rows", () => {
    expect(migration).toContain("target_site = 'keeptxred'");
    expect(migration).toContain("target_section = 'Texas News'");
    expect(migration).toContain("internal_slug IS NULL");
    expect(migration).toContain("SET target_site = 'review', target_section = 'Unclassified'");
  });

  it("preserves explicit KTR and TexasDefined routing branches", () => {
    expect(migration).toContain("NEW.target_site := 'keeptxred';");
    expect(migration).toContain("NEW.target_site := 'texasdefined';");
    expect(migration).toContain("IF is_sports THEN");
    expect(migration).toContain("ELSIF is_hard_news THEN");
    expect(migration).toContain("ELSIF is_material_business THEN");
    expect(migration).toContain("ELSIF is_lifestyle THEN");
  });
});
