import { describe, expect, it } from "vitest";
import { isPublicArticleReady } from "@/lib/public-article-readiness";

const base = {
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

describe("public article readiness floor", () => {
  it("allows a sourced, substantive, non-quarantined article", () => {
    expect(isPublicArticleReady(base)).toBe(true);
  });

  it("blocks Non-Political taxonomy until it is corrected", () => {
    expect(isPublicArticleReady({ ...base, category: "Non-Political" })).toBe(false);
  });

  it("blocks low-quality and source-less rows", () => {
    expect(isPublicArticleReady({ ...base, content_quality_score: 59 })).toBe(false);
    expect(isPublicArticleReady({ ...base, source_url: null, body_json: { updated: base.published_at, sources: [] } })).toBe(false);
  });

  it("blocks false multi-source labeling", () => {
    expect(isPublicArticleReady({
      ...base,
      source_name: "Multiple independent sources",
      body_json: { updated: base.published_at, sources: [{ label: "One", url: "https://example.com/one" }] },
    })).toBe(false);
  });

  it("blocks chronology regressions and quarantine flags", () => {
    expect(isPublicArticleReady({ ...base, body_json: { updated: "2026-08-18T12:00:00Z", sources: base.body_json.sources } })).toBe(false);
    expect(isPublicArticleReady({ ...base, quality_flags: ["site_boundary_violation"] })).toBe(false);
  });
});
