import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260926184500_finalize_remaining_hero_identity_backlog.sql",
  "utf8",
);

describe("final hero identity backlog migration", () => {
  it("keeps the database guard exact-slug and exact-raster-path scoped", () => {
    expect(migration).toContain("article_hero_is_governed_exact_entity_graphic");
    expect(migration).toContain("exact-entity-graphic-v1 ok:%");
    expect(migration).toContain("/images/news/editorial/subject-identity/");
    expect(migration).not.toContain(".svg");
  });

  it("does not synthesize a documentary image for the allegations story", () => {
    expect(migration).toContain("not a likeness, reenactment, or depiction of alleged conduct");
  });

  it("removes image hold flags only when assigning an exact governed ready hero", () => {
    expect(migration).toContain("image_generation_status = 'ready'");
    expect(migration).toContain("'image_requires_visual_validation'");
    expect(migration).toContain("'missing_image'");
    expect(migration).toContain("image_url = fixes.hero_url");
    expect(migration).toContain("featured_image_url = fixes.hero_url");
  });
});
