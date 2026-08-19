import { describe, expect, it } from "vitest";
import { shouldNoindexCloudArticle } from "./article-indexability.functions";

const readyRow = {
  category: "Legislature",
  source_name: "Texas Legislature",
  source_url: "https://capitol.texas.gov/",
  published_at: "2026-08-19T12:00:00Z",
  content_quality_score: 80,
  body_json: {
    updated: "2026-08-19T12:00:00Z",
    sources: [{ label: "Texas Legislature", url: "https://capitol.texas.gov/" }],
  },
  quality_flags: [] as string[],
};

describe("shouldNoindexCloudArticle", () => {
  it("fails closed when the quality lookup is unavailable", () => {
    expect(shouldNoindexCloudArticle(null, false)).toBe(true);
    expect(shouldNoindexCloudArticle(["missing_image"], false)).toBe(true);
  });

  it("quarantines severe editorial findings after a successful lookup", () => {
    expect(shouldNoindexCloudArticle(["seo_legacy_single_source"], true)).toBe(true);
    expect(shouldNoindexCloudArticle(["legacy_thin_content"], true)).toBe(true);
    expect(shouldNoindexCloudArticle(["site_boundary_violation"], true)).toBe(true);
  });

  it("preserves flag-only compatibility for repairable flags", () => {
    expect(shouldNoindexCloudArticle(["missing_image", "weak_dek"], true)).toBe(false);
    expect(shouldNoindexCloudArticle(null, true)).toBe(false);
  });

  it("indexes only a full readiness-qualified cloud row", () => {
    expect(shouldNoindexCloudArticle(readyRow, true)).toBe(false);
    expect(shouldNoindexCloudArticle({ ...readyRow, category: "Non-Political" }, true)).toBe(true);
    expect(shouldNoindexCloudArticle({ ...readyRow, content_quality_score: 59 }, true)).toBe(true);
    expect(shouldNoindexCloudArticle({ ...readyRow, source_url: null, body_json: { updated: readyRow.published_at, sources: [] } }, true)).toBe(true);
  });
});
