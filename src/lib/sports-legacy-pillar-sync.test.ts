import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260917223000_preserve_sports_from_legacy_pillar_sync.sql",
  "utf8",
);
const reviewedTaxonomy = readFileSync(
  "supabase/migrations/20260912030000_lock_reviewed_taxonomy_drift.sql",
  "utf8",
);
const classifierHook = readFileSync(
  "src/routes/api/public/hooks/classify-article-pillars.ts",
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

  it("locks the reviewed Texas A&M football story to Sports and removes the legacy pillar assignment", () => {
    expect(reviewedTaxonomy).toContain(
      "2026-09-06-texas-a-m-dominates-missouri-state-in-season-opener",
    );
    expect(reviewedTaxonomy).toContain("category = 'Sports'");
    expect(reviewedTaxonomy).toContain("quality_flags");
    expect(reviewedTaxonomy).toContain("'taxonomy_locked'");
    expect(reviewedTaxonomy).toContain("pillar_slug = NULL");
    expect(reviewedTaxonomy).toContain("manual-taxonomy-review-20260912");
  });

  it("does not reclassify manually reviewed assignments on later pillar runs", () => {
    expect(classifierHook).toContain('version?.startsWith("manual-taxonomy-review")');
    expect(classifierHook).toContain("isSettledAssignmentVersion(row.classifier_version)");
  });

  it("keeps existing review and TexasDefined guards", () => {
    expect(migration).toContain("classifier_version NOT LIKE '%texasdefined-excluded'");
    expect(migration).toContain("'taxonomy_locked' = ANY");
    expect(migration).toContain("'taxonomy_corrected_adsense_review' = ANY");
    expect(migration).toContain("-- BULK_CATEGORY_RECLASSIFICATION");
  });
});
