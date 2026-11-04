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
  quality_flags: ["evergreen_authority", "editorial_reviewed", "primary_sources"] as string[],
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

  it("does not automatically index AI-generated cloud evergreen drafts", () => {
    expect(shouldNoindexCloudArticle({
      ...readyRow, quality_flags: [], kind: "evergreen",
    }, true)).toBe(true);
    expect(shouldNoindexCloudArticle({
      ...readyRow,
      quality_flags: ["evergreen_authority", "editorial_reviewed", "primary_sources", "editorial_review_required"],
    }, true)).toBe(true);
    expect(shouldNoindexCloudArticle({
      ...readyRow,
      quality_flags: ["evergreen_authority", "editorial_reviewed", "primary_sources"],
    }, true)).toBe(false);
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

  it("requires editorial approval before a source-first article may become indexable", () => {
    const sourceFirstFlags = ["search_recovery_source_first"];
    const reviewedSourceFirst = [...sourceFirstFlags, "editorial_reviewed", "primary_sources"];
    expect(shouldNoindexCloudArticle({ ...readyRow, kind: "news", quality_flags: sourceFirstFlags }, true)).toBe(true);
    expect(shouldNoindexCloudArticle({ ...readyRow, kind: "news", quality_flags: reviewedSourceFirst }, true)).toBe(false);
    expect(shouldNoindexCloudArticle({ ...readyRow, kind: "news", content_quality_score: 59, quality_flags: sourceFirstFlags }, true)).toBe(true);
    expect(shouldNoindexCloudArticle({ ...readyRow, kind: "news", image_generation_status: "failed", quality_flags: reviewedSourceFirst }, true)).toBe(false);
    expect(shouldNoindexCloudArticle({ ...readyRow, kind: "news", quality_flags: ["search_recovery_source_first", "seo_duplicate"] }, true)).toBe(true);
  });

  it("enforces the same legacy live restoration rule as sitemap discovery", () => {
    const live = {
      ...readyRow,
      slug: "live-2026-07-01-unrestored",
      kind: "news",
      // Meet the independent >=500-word legacy restoration floor so this
      // test isolates the newly unified page/sitemap restoration flag.
      body_json: {
        ...readyRow.body_json,
        intro: ["An independently sourced historical public-policy explanation."],
        sections: [{
          heading: "Substantive context",
          paragraphs: [Array(550).fill("Verified historical context").join(" ")],
        }],
      },
      quality_flags: ["search_recovery_authority", "editorial_reviewed", "primary_sources"],
    };
    expect(shouldNoindexCloudArticle(live, true)).toBe(true);
    expect(shouldNoindexCloudArticle({
      ...live,
      quality_flags: [...live.quality_flags, "legacy_url_restored"],
    }, true)).toBe(false);
  });

  it("rejects stale source-first flags without an actual official source URL", () => {
    const sourceFirst = {
      ...readyRow,
      kind: "news",
      quality_flags: ["search_recovery_source_first", "editorial_reviewed", "primary_sources"],
    };
    expect(shouldNoindexCloudArticle(sourceFirst, true)).toBe(false);
    expect(shouldNoindexCloudArticle({
      ...sourceFirst,
      source_url: "https://example.com/article",
      body_json: {
        ...sourceFirst.body_json,
        sources: [{ label: "Secondary", url: "https://example.com/article" }],
      },
    }, true)).toBe(true);
  });

  it("allows image-deferred articles through editorial readiness while preserving quarantine", () => {
    expect(shouldNoindexCloudArticle({ ...readyRow, featured_image_url: null, image_url: null }, true)).toBe(false);
    expect(shouldNoindexCloudArticle({ ...readyRow, image_generation_status: "failed" }, true)).toBe(false);
    expect(shouldNoindexCloudArticle({ ...readyRow, featured_image_url: "/og/default.jpg", image_url: "/og/default.jpg" }, true)).toBe(false);
    expect(shouldNoindexCloudArticle({ ...readyRow, featured_image_url: null, image_url: null, quality_flags: ["seo_low_value_commodity"] }, true)).toBe(true);
  });
});