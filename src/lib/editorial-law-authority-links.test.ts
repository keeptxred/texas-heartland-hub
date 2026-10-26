import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ARTICLES, type Article } from "@/data/articles";
import {
  lawAuthorityForArticle,
  shouldShowEditorialLawLibrary,
  publicEditorialArticlesForLawTopic,
} from "@/lib/editorial-law-authority-links";

const find = (slug: string) => ARTICLES.find((article) => article.slug === slug)!;

describe("bidirectional verified legal editorials", () => {
  it.each([
    ["texas-gun-laws-explained", "gun-carry-law"],
    ["texas-property-tax-laws-explained", "property-tax-law"],
    ["texas-election-laws-explained", "election-law"],
  ])("maps %s to statutory authority %s", (articleSlug, lawSlug) => {
    expect(lawAuthorityForArticle(find(articleSlug))?.slug).toBe(lawSlug);
  });

  it("recognizes future articles that intentionally carry laws content classification", () => {
    const future = { ...find("constitutional-carry-one-year-later"), slug: "new-law-article",
      topics: ["legislature"], subcategory: "state", contentCategory: "laws" } as Article;
    expect(shouldShowEditorialLawLibrary(future)).toBe(true);
    expect(lawAuthorityForArticle(future)).toBeNull();
  });

  it("avoids falsely assigning Open Meetings and school-board powers to unrelated statutory parents", () => {
    expect(lawAuthorityForArticle(find("texas-open-meetings-public-info"))).toBeNull();
    expect(lawAuthorityForArticle(find("texas-school-board-powers"))).toBeNull();
  });

  it("maps future articles with specific explicit topic tags, not loose headline keywords", () => {
    const base = find("constitutional-carry-one-year-later");
    expect(lawAuthorityForArticle({ ...base, slug: "new-law-article", topics: ["landlord-tenant"] })?.slug)
      .toBe("landlord-tenant-rentals-law");
    expect(lawAuthorityForArticle({ ...base, slug: "new-law-article", topics: ["unverified-topic"] })).toBeNull();
  });

  it("only links authority pages to published and indexable editorial stories", () => {
    for (const slug of ["gun-carry-law", "property-tax-law", "election-law", "open-records-public-information"]) {
      for (const item of publicEditorialArticlesForLawTopic(slug)) {
        expect(item.href).toBe("/news/" + item.slug);
        expect(item.title).toBeTruthy();
      }
    }
    expect(publicEditorialArticlesForLawTopic("no-authority-exists")).toEqual([]);
  });

  it("inherits reciprocal crosslinks across the shared law and article templates", () => {
    const news = readFileSync("src/routes/news.$slug.tsx", "utf8");
    const authority = readFileSync("src/components/law-topic-page.tsx", "utf8");
    expect(news).toContain("lawAuthorityForArticle(article)");
    expect(news).toContain("shouldShowEditorialLawLibrary(article)");
    expect(news).toContain('to="/laws/topic/$slug"');
    const server = readFileSync("src/lib/law-library-route.functions.ts", "utf8");
    expect(server).toContain("publicEditorialArticlesForLawTopic(topic.slug)");
    expect(authority).toContain("editorials.map");
    expect(authority).not.toContain("import { publicEditorialArticlesForLawTopic }");
    expect(authority).toContain("Related Texas law reporting and explainers");
  });
});
