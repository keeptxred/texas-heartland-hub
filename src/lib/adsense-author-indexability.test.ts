import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  MIN_AUTHOR_ARTICLES_FOR_INDEXING,
  hasEnoughAuthorArticles,
} from "@/lib/author-indexability";

const authorRoute = fs.readFileSync(new URL("../routes/authors.$slug.tsx", import.meta.url), "utf8");
const authorSitemap = fs.readFileSync(new URL("../routes/sitemap-authors[.]xml.ts", import.meta.url), "utf8");
const sitemapIndex = fs.readFileSync(new URL("../routes/sitemap[.]xml.ts", import.meta.url), "utf8");

describe("AdSense author profile indexability", () => {
  it("requires three unique published article slugs", () => {
    expect(MIN_AUTHOR_ARTICLES_FOR_INDEXING).toBe(3);
    expect(hasEnoughAuthorArticles(["one", "two"])).toBe(false);
    expect(hasEnoughAuthorArticles(["one", "one", "two", "three"])).toBe(true);
  });

  it("uses the same threshold for direct author route metadata", () => {
    expect(authorRoute).toContain("hasEnoughAuthorArticles(publishedSlugs)");
    expect(authorRoute).toContain("noindex: !hasEnoughPublishedArticles");
    expect(authorRoute).not.toContain("hasPublishedArticles: liveArticles.length > 0");
  });

  it("deduplicates static and cloud author articles by slug in the author sitemap", () => {
    expect(authorSitemap).toContain("const records = new Map<string, string>()");
    expect(authorSitemap).toContain("records.set(article.slug");
    expect(authorSitemap).toContain("hasEnoughAuthorArticles(records.map((record) => record.slug))");
  });

  it("advertises the author sitemap only when an author meets the same unique-slug threshold", () => {
    expect(sitemapIndex).toContain("const authorArticleSlugs = new Map<string, Set<string>>()");
    expect(sitemapIndex).toContain("hasEnoughAuthorArticles(authorArticleSlugs.get(author.slug) ?? [])");
  });
});
