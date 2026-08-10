import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260731153000_correct_talarico_super_pac_us_senate_article.sql",
  "utf8",
);
const articleRoute = readFileSync("src/routes/news.$slug.tsx", "utf8");

describe("Talarico super PAC article correction", () => {
  it("replaces every contaminated article surface with federal-race authority data", () => {
    expect(migration).toContain(
      "live-2026-07-18-silicon-valley-injects-historic-10-million-into-texas-senate-race-to-s-tvf41v",
    );
    expect(migration).toContain("category = 'Elections'");
    expect(migration).toContain("FEC — Lone Star Rising PAC (C00918268)");
    expect(migration).toContain("FEC — James Talarico candidate record (S6TX00479)");
    expect(migration).toContain("an unauthorized super PAC supporting Talarico");
    expect(migration).toContain("not a race for the Texas Senate");
    expect(migration).toContain("headline_variants = jsonb_build_object");
    expect(migration).toContain("body_json = corrected_with_text.content");
    expect(migration).toContain("'identifier', 'race-2026-us-senate'");
    expect(migration).toContain(
      "'identifier', 'candidate-james-talarico-democratic-race-2026-us-senate'",
    );
  });

  it("keeps NewsArticle publication and correction dates separate", () => {
    expect(articleRoute).toContain("publishedTime: published");
    expect(articleRoute).toContain("modifiedTime: modified");
    expect(articleRoute).toContain("datePublished: published");
    expect(articleRoute).toContain("dateModified: modified");
    expect(articleRoute).toContain("about: body.entities?.map");
  });
});
