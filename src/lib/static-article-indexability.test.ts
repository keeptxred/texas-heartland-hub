import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { ARTICLES, type Article } from "@/data/articles";
import { isRetiredStaticNewsPath, isStaticArticleIndexable } from "@/lib/static-article-indexability";

function article(slug: string) {
  const found = ARTICLES.find((candidate) => candidate.slug === slug);
  expect(found, `missing static fixture ${slug}`).toBeTruthy();
  return found!;
}

function topicalFixture(contentCategory: Article["contentCategory"]): Article {
  return {
    slug: `fixture-${contentCategory}`,
    category: "Non-Political",
    title: "Fixture",
    dek: "Fixture article for topical indexability policy.",
    author: "Staff Reporter",
    date: "Fixture",
    publishedAt: "2026-08-18T00:00:00Z",
    image: "/fixture.jpg",
    contentCategory,
  };
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
    "live-2026-07-07-texas-pitmasters-to-feature-in-new-food-network-competition-series-v3wglp",
    "live-2026-06-29-the-history-behind-the-texas-stock-tank-name-bxkvg7",
  ])("retires legacy off-topic static article %s", (slug) => {
    expect(isStaticArticleIndexable(article(slug))).toBe(false);
    expect(isRetiredStaticNewsPath(`/news/${slug}`)).toBe(true);
  });

  it.each([
    "property-tax-relief-package",
    "operation-lone-star",
    "voter-id-surge",
    "school-board-elections",
    "speaker-special-session",
    "isd-tax-burdens",
    "permian-energy",
  ])("retires stale pre-gate static fixture-news article %s", (slug) => {
    expect(isStaticArticleIndexable(article(slug))).toBe(false);
    expect(isRetiredStaticNewsPath(`/news/${slug}`)).toBe(true);
  });

  it.each(["relocation", "housing", "financial", "cost-of-living", "history", "culture", "lifestyle"] as const)(
    "retires %s static content from the Keep TX Red search footprint",
    (contentCategory) => expect(isStaticArticleIndexable(topicalFixture(contentCategory))).toBe(false),
  );

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
      expect(isRetiredStaticNewsPath(`/news/${candidate.slug}`), `robots mismatch for ${candidate.slug}`)
        .toBe(!isStaticArticleIndexable(candidate));
    }
  });

  it("lets a restored cloud article supersede its retired static placeholder", () => {
    const route = fs.readFileSync(new URL("../routes/news.$slug.tsx", import.meta.url), "utf8");

    expect(route.indexOf("article && isStaticArticleIndexable(article)")).toBeLessThan(
      route.indexOf("await getEvergreenBySlug"),
    );
    expect(route).toContain("return { article: { ...article, noindex: true }, body, ctr: null }");
  });

  it("removes retired and fallback-only static inventory from newsroom and author discovery", () => {
    const newsIndex = fs.readFileSync(new URL("../routes/news.index.tsx", import.meta.url), "utf8");
    const authorsIndex = fs.readFileSync(new URL("../routes/authors.index.tsx", import.meta.url), "utf8");
    const authorProfile = fs.readFileSync(new URL("../routes/authors.$slug.tsx", import.meta.url), "utf8");

    for (const source of [newsIndex, authorsIndex, authorProfile]) {
      expect(source).toContain("getDiscoverableStaticArticleSlugs");
      expect(source).toContain("isStaticArticleIndexable");
      expect(source).toContain("discoverableStatic.has(article.slug)");
    }
  });

  it("does not affect non-news paths", () => {
    expect(isRetiredStaticNewsPath("/laws")).toBe(false);
  });
});
