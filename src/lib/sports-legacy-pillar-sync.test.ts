import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260917223000_preserve_sports_from_legacy_pillar_sync.sql",
  "utf8",
);

describe("legacy pillar sports protection", () => {
  it("refuses to rewrite rows already carrying strong sports markers", () => {
    expect(migration).toContain("lower(coalesce(d.discover_category, '')) = 'sports'");
    expect(migration).toContain("lower(coalesce(d.image_category, '')) = 'sports'");
    expect(migration).toContain("lower(coalesce(d.kind, '')) LIKE 'sports%'");
    expect((migration.match(/lower\(coalesce\(d\.discover_category, ''\)\) = 'sports'/g) ?? []).length).toBe(2);
    expect((migration.match(/lower\(coalesce\(d\.image_category, ''\)\) = 'sports'/g) ?? []).length).toBe(2);
    expect((migration.match(/lower\(coalesce\(d\.kind, ''\)\) LIKE 'sports%'/g) ?? []).length).toBe(2);
  });

  it("keeps existing review and TexasDefined guards", () => {
    expect(migration).toContain("classifier_version NOT LIKE '%texasdefined-excluded'");
    expect(migration).toContain("'taxonomy_locked' = ANY");
    expect(migration).toContain("'taxonomy_corrected_adsense_review' = ANY");
    expect(migration).toContain("-- BULK_CATEGORY_RECLASSIFICATION");
  });
});
