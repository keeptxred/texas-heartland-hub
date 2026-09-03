import { describe, expect, it } from "vitest";
import { duplicateParagraphOccurrences, isPublicArticleReady } from "@/lib/public-article-readiness";

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

  it("blocks off-topic sports and culture display categories from KTR search discovery", () => {
    expect(isPublicArticleReady({ ...base, category: "Sports" })).toBe(false);
    expect(isPublicArticleReady({ ...base, category: "Sports Culture" })).toBe(false);
    expect(isPublicArticleReady({ ...base, category: "Culture & Identity" })).toBe(false);
  });

  it("keeps material political and business classifications eligible", () => {
    expect(isPublicArticleReady({ ...base, discover_category: "Texas Government" })).toBe(true);
    expect(isPublicArticleReady({ ...base, category: "Business", discover_category: "Texas Business" })).toBe(true);
  });

  it("blocks content below the impression-recovery quality floor and allows the boundary score", () => {
    expect(isPublicArticleReady({ ...base, content_quality_score: 69 })).toBe(false);
    expect(isPublicArticleReady({ ...base, content_quality_score: 70 })).toBe(true);
  });

  it("blocks machine-like internal paragraph repetition", () => {
    const repeated = "This substantive paragraph is intentionally long enough to represent a real article paragraph and is duplicated several times to model machine generated filler during an AdSense quality review.";
    const body_json = {
      ...base.body_json,
      sections: [
        { heading: "One", paragraphs: [repeated, repeated, repeated] },
        { heading: "Two", paragraphs: [repeated] },
      ],
    };
    expect(duplicateParagraphOccurrences(body_json)).toBe(3);
    expect(isPublicArticleReady({ ...base, body_json })).toBe(false);
  });

  it("does not penalize one accidental repeated substantive paragraph", () => {
    const repeated = "This substantive paragraph is intentionally long enough to represent a real article paragraph and appears twice without turning the whole article into repetitive filler.";
    const body_json = {
      ...base.body_json,
      sections: [{ heading: "One", paragraphs: [repeated, repeated] }],
    };
    expect(duplicateParagraphOccurrences(body_json)).toBe(1);
    expect(isPublicArticleReady({ ...base, body_json })).toBe(true);
  });

  it("blocks source-less rows", () => {
    expect(isPublicArticleReady({ ...base, source_url: null, body_json: { updated: base.published_at, sources: [] } })).toBe(false);
  });

  it("blocks Reddit-only and Google-News-only provenance", () => {
    expect(isPublicArticleReady({
      ...base,
      source_name: "r/austin",
      source_url: "https://www.reddit.com/r/Austin/comments/example",
      body_json: {
        updated: base.published_at,
        sources: [{ label: "r/austin", url: "https://www.reddit.com/r/Austin/comments/example" }],
      },
    })).toBe(false);

    expect(isPublicArticleReady({
      ...base,
      source_name: "Texas Food Stories (Google News)",
      source_url: "https://news.google.com/rss/articles/example",
      body_json: {
        updated: base.published_at,
        sources: [{ label: "Texas Food Stories (Google News)", url: "https://news.google.com/rss/articles/example" }],
      },
    })).toBe(false);
  });

  it("allows a discovery link when primary or independent provenance is also present", () => {
    expect(isPublicArticleReady({
      ...base,
      source_name: "r/austin",
      source_url: "https://www.reddit.com/r/Austin/comments/example",
      body_json: {
        updated: base.published_at,
        sources: [
          { label: "r/austin", url: "https://www.reddit.com/r/Austin/comments/example" },
          { label: "Austin Police Department", url: "https://www.austintexas.gov/department/police" },
        ],
      },
    })).toBe(true);
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
