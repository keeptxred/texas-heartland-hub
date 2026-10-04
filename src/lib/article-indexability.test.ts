import { describe, expect, it } from "vitest";
import { shouldNoindexCloudArticle } from "./article-indexability.functions";

const readyRow = {
  kind: "evergreen",
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
  image_url: "/api/public/article-image/legislature-example.jpg",
  featured_image_url: "/api/public/article-image/legislature-example.jpg",
  image_generation_status: "ready",
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

  it("suppresses ordinary cloud news during search recovery", () => {
    expect(shouldNoindexCloudArticle({ ...readyRow, kind: "news" }, true)).toBe(true);
    expect(shouldNoindexCloudArticle({ ...readyRow, kind: "ingested" }, true)).toBe(true);
    expect(shouldNoindexCloudArticle({ ...readyRow, kind: "evergreen" }, true)).toBe(false);
  });

  it("allows only explicitly reviewed primary-source authority news through manual recovery", () => {
    const authorityFlags = ["search_recovery_authority", "editorial_reviewed", "primary_sources"];
    expect(shouldNoindexCloudArticle({ ...readyRow, kind: "news", quality_flags: authorityFlags }, true)).toBe(false);
    expect(shouldNoindexCloudArticle({ ...readyRow, kind: "news", quality_flags: ["search_recovery_authority"] }, true)).toBe(true);
    expect(shouldNoindexCloudArticle({ ...readyRow, kind: "news", quality_flags: ["search_recovery_authority", "editorial_reviewed"] }, true)).toBe(true);
  });

  it("keeps the automated source-first recovery lane behind normal readiness gates", () => {
    const sourceFirstFlags = ["search_recovery_source_first"];
    expect(shouldNoindexCloudArticle({ ...readyRow, kind: "news", quality_flags: sourceFirstFlags }, true)).toBe(false);
    expect(shouldNoindexCloudArticle({ ...readyRow, kind: "news", content_quality_score: 59, quality_flags: sourceFirstFlags }, true)).toBe(true);
    expect(shouldNoindexCloudArticle({ ...readyRow, kind: "news", image_generation_status: "failed", quality_flags: sourceFirstFlags }, true)).toBe(true);
    expect(shouldNoindexCloudArticle({ ...readyRow, kind: "news", quality_flags: ["search_recovery_source_first", "seo_duplicate"] }, true)).toBe(true);
  });

  it("noindexes missing, failed, and branded-fallback article images", () => {
    expect(shouldNoindexCloudArticle({ ...readyRow, featured_image_url: null, image_url: null }, true)).toBe(true);
    expect(shouldNoindexCloudArticle({ ...readyRow, image_generation_status: "failed" }, true)).toBe(true);
    expect(shouldNoindexCloudArticle({ ...readyRow, featured_image_url: "/og/default.jpg", image_url: "/og/default.jpg" }, true)).toBe(true);
  });
});