import { describe, expect, it } from "vitest";
import {
  hasSeoDuplicateFlag,
  isFollowUpDevelopment,
  isSameEventRewrite,
  pickStrongestArticle,
  resolveRedirectChain,
  selectCanonicalArticles,
} from "./article-canonical";

describe("resolveRedirectChain", () => {
  it("resolves a single hop", () => {
    expect(resolveRedirectChain({ old: "new" }, "old")).toBe("new");
  });
  it("follows a short chain to its end", () => {
    expect(resolveRedirectChain({ a: "b", b: "c" }, "a")).toBe("c");
  });
  it("returns null for a missing mapping", () => {
    expect(resolveRedirectChain({ a: "b" }, "z")).toBeNull();
  });
  it("refuses a self redirect", () => {
    expect(resolveRedirectChain({ a: "a" }, "a")).toBeNull();
  });
  it("refuses a loop", () => {
    expect(resolveRedirectChain({ a: "b", b: "a" }, "a")).toBeNull();
  });
  it("refuses an overlong chain", () => {
    const map = { a: "b", b: "c", c: "d" };
    expect(resolveRedirectChain(map, "a", 2)).toBeNull();
  });
});

describe("hasSeoDuplicateFlag", () => {
  it("flags duplicate/noindex markers", () => {
    expect(hasSeoDuplicateFlag(["thin_body", "seo_duplicate"])).toBe(true);
    expect(hasSeoDuplicateFlag(["NOINDEX"])).toBe(true);
  });
  it("preserves legitimate articles", () => {
    expect(hasSeoDuplicateFlag(["missing_image", "weak_dek"])).toBe(false);
    expect(hasSeoDuplicateFlag(null)).toBe(false);
  });
});

const base = { content_quality_score: null, main_word_count: null };

describe("pickStrongestArticle", () => {
  it("prefers the higher quality score", () => {
    const best = pickStrongestArticle([
      { ...base, slug: "a", title: "t", published_at: "2026-08-07T00:00:00Z", content_quality_score: 60 },
      { ...base, slug: "b", title: "t", published_at: "2026-08-06T00:00:00Z", content_quality_score: 82 },
    ]);
    expect(best?.slug).toBe("b");
  });
  it("falls back to word count, then recency", () => {
    expect(
      pickStrongestArticle([
        { ...base, slug: "a", title: "t", published_at: "2026-08-07T00:00:00Z", content_quality_score: 70, main_word_count: 900 },
        { ...base, slug: "b", title: "t", published_at: "2026-08-01T00:00:00Z", content_quality_score: 70, main_word_count: 2400 },
      ])?.slug,
    ).toBe("b");
    expect(
      pickStrongestArticle([
        { ...base, slug: "a", title: "t", published_at: "2026-08-07T00:00:00Z", content_quality_score: 70, main_word_count: 900 },
        { ...base, slug: "b", title: "t", published_at: "2026-08-01T00:00:00Z", content_quality_score: 70, main_word_count: 900 },
      ])?.slug,
    ).toBe("a");
  });
});

const FLOOD_A =
  "Hill Country flooding destroys hundreds of Kerrville homes as rivers crest";
const FLOOD_REWRITE =
  "Kerrville homes destroyed as Hill Country flooding rivers crest, hundreds affected";
const FLOOD_FOLLOWUP =
  "Kerrville flooding recovery: Abbott declares disaster, evacuation orders lifted";

describe("same-event detection", () => {
  it("treats a cross-source rewrite as the same event", () => {
    expect(isSameEventRewrite(FLOOD_A, FLOOD_REWRITE)).toBe(true);
  });
  it("keeps a materially new follow-up development", () => {
    expect(isFollowUpDevelopment(FLOOD_A, FLOOD_FOLLOWUP)).toBe(true);
    expect(isSameEventRewrite(FLOOD_A, FLOOD_FOLLOWUP)).toBe(false);
  });
  it("does not collapse merely topical articles", () => {
    expect(
      isSameEventRewrite(FLOOD_A, "Texas property tax relief plan advances in the Senate"),
    ).toBe(false);
  });
});

describe("selectCanonicalArticles", () => {
  it("keeps the strongest cluster member and preserves follow-ups", () => {
    const items = [
      { ...base, slug: "weak", title: FLOOD_A, published_at: "2026-08-07T10:00:00Z", content_quality_score: 55, main_word_count: 820 },
      { ...base, slug: "strong", title: FLOOD_REWRITE, published_at: "2026-08-07T08:00:00Z", content_quality_score: 88, main_word_count: 2100 },
      { ...base, slug: "followup", title: FLOOD_FOLLOWUP, published_at: "2026-08-08T09:00:00Z", content_quality_score: 70, main_word_count: 1500 },
    ];
    const kept = selectCanonicalArticles(items).map((a) => a.slug);
    expect(kept).toContain("strong");
    expect(kept).toContain("followup");
    expect(kept).not.toContain("weak");
  });
});
