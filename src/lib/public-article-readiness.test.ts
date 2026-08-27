import { describe, expect, it } from "vitest";
import { isPublicArticleReady } from "@/lib/public-article-readiness";

const base = {
  category: "Legislature",
  discover_category: "Texas Politics",
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

  it("blocks legacy TexasDefined culture and history classifications", () => {
    expect(isPublicArticleReady({ ...base, category: "Texas News", discover_category: "Texas Culture" })).toBe(false);
    expect(isPublicArticleReady({ ...base, category: "Texas News", discover_category: "Texas History" })).toBe(false);
  });

  it("keeps material political and business classifications eligible", () => {
    expect(isPublicArticleReady({ ...base, discover_category: "Texas Government" })).toBe(true);
    expect(isPublicArticleReady({ ...base, category: "Business", discover_category: "Texas Business" })).toBe(true);
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
