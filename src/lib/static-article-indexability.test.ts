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
    "renting-vs-buying-in-texas",
    "texas-house-down-payment-guide",
    "true-cost-of-owning-a-home-in-texas",
    "should-you-refinance-texas-mortgage",
    "texas-home-equity-heloc-guide",
    "texas-mortgage-payment-guide",
    "texas-closing-costs-guide",
    "texas-utility-costs-guide",
    "texas-homeowners-insurance-guide",
    "salary-needed-to-buy-a-house-in-texas",
    "moving-to-houston-address-checklist",
    "moving-to-dallas-fort-worth-guide",
    "moving-to-san-antonio-guide",
    "moving-to-austin-guide",
    "moving-to-el-paso-guide",
    "moving-to-texas-guide",
    "2026-07-06-rangers-texas-rangers-prospect-guide-the-next-stars-of-arlington",
  ])("retires legacy off-topic static article %s", (slug) => {
    expect(isStaticArticleIndexable(article(slug))).toBe(false);
    expect(isRetiredStaticNewsPath(`/news/${slug}`)).toBe(true);
  });

  it.each([
    "texas-voting-guide-2026",
    "texas-property-tax-laws-explained",
    "texas-gun-laws-explained",
    "texas-water-rights-explained",
    "how-a-bill-becomes-texas-law",
  ])("preserves civic, legal, election or policy article %s", (slug) => {
    expect(isStaticArticleIndexable(article(slug))).toBe(true);
    expect(isRetiredStaticNewsPath(`/news/${slug}`)).toBe(false);
  });

  it("does not let the legacy pillar flag override topical retirement", () => {
    const mortgage = article("texas-mortgage-payment-guide");
    expect(mortgage.pillar).toBe(true);
    expect(isStaticArticleIndexable(mortgage)).toBe(false);
  });

  it("retires legacy live-news paths", () => {
    const live = article("live-2026-07-02-secretary-of-state-releases-july-3-texas-register-detailing-new-state--m0th5w");
    expect(isStaticArticleIndexable(live)).toBe(false);
    expect(isRetiredStaticNewsPath(`/news/${live.slug}`)).toBe(true);
  });

  it("keeps sitemap and page-level robots decisions synchronized for the full static registry", () => {
    for (const candidate of ARTICLES) {
      const retiredByInventory = !isStaticArticleIndexable(candidate);
      const retiredByPath = isRetiredStaticNewsPath(`/news/${candidate.slug}`);
      expect(retiredByPath, `robots mismatch for ${candidate.slug}`).toBe(retiredByInventory);
    }
  });

  it("does not affect non-news paths", () => {
    expect(isRetiredStaticNewsPath("/laws")).toBe(false);
  });
});
