import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260926192804_tighten_article_hero_db_readiness_provenance.sql",
  "utf8",
);

describe("DB hero readiness provenance hardening", () => {
  it("binds authoritative exemptions to the hero URL and article slug", () => {
    expect(migration).toContain("note text,\n  article_slug text,\n  hero_url text");
    expect(migration).toContain("authoritative-image-exempt:%");
    expect(migration).toContain("www\\.nhc\\.noaa\\.gov/storm_graphics");
    expect(migration).toContain("2026-09-22-protesters-gather-at-texas-capitol-a-day-after-austin-ice-shooting");
    expect(migration).toContain("2026-09-22-ice-officer-shoots-man-in-north-austin");
    expect(migration).toContain("2026-09-21-man-injured-in-shooting-by-ice-officer-in-north-austin");
  });

  it("makes the trigger pass note, slug, and exact featured image URL", () => {
    expect(migration).toContain("old.image_validation_note,\n          old.slug,\n          old.featured_image_url");
    expect(migration).toContain("new.image_validation_note,\n        new.slug,\n        new.featured_image_url");
  });
});
