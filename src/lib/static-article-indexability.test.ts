import { describe, expect, it } from "vitest";
import { ARTICLES } from "@/data/articles";
import {
  isRetiredStaticNewsPath,
  isStaticArticleIndexable,
} from "@/lib/static-article-indexability";

function article(slug: string) {
  const found = ARTICLES.find((candidate) => candidate.slug === slug);
  expect(found, `missing static fixture ${slug}`).toBeTruthy();
  return found!;
}

describe("static article indexability", () => {
  it.each([
    "texas-mortgage-payment-guide",
    "texas-closing-costs-guide",
    "texas-utility-costs-guide",
    "texas-homeowners-insurance-guide",
    "moving-to-texas-guide",
    "cost-of-living-in-texas",
    "texas-stock-tank-plunge-pools-guide",
    "texas-food-cities-dominating-food-network",
    "texas-high-school-football-prospect-peyton-houser",
  ])("retires legacy off-topic static article %s", (slug) => {
    expect(isStaticArticleIndexable(article(slug))).toBe(false);
    expect(isRetiredStaticNewsPath(`/news/${slug}`)).toBe(true);
  });

  it.each([
    "texas-voting-guide-2026",
    "texas-property-tax-laws-explained",
    "texas-gun-culture-explained",
    "texas-water-future",
  ])("preserves civic or pillar article %s", (slug) => {
    expect(isStaticArticleIndexable(article(slug))).toBe(true);
    expect(isRetiredStaticNewsPath(`/news/${slug}`)).toBe(false);
  });

  it("retires legacy live-news paths even when the static fixture is gone", () => {
    expect(isRetiredStaticNewsPath("/news/live-2026-07-20-example-legacy-story-abc123")).toBe(true);
  });

  it("does not affect non-news paths", () => {
    expect(isRetiredStaticNewsPath("/laws")).toBe(false);
  });
});
