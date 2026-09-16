import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { visibleArticleDates } from "./article-visible-dates";

describe("Google News pipeline contract", () => {
  it("keeps the News sitemap recent, canonical, bounded, and publication-name consistent", () => {
    const sitemap = readFileSync(new URL("../routes/sitemap-news[.]xml.ts", import.meta.url), "utf8");

    expect(sitemap).toContain("const WINDOW_MS = 48 * 60 * 60 * 1000");
    expect(sitemap).toContain("const MAX_NEWS_URLS = 1000");
    expect(sitemap).toContain('import { SITE_NAME } from "@/lib/seo"');
    expect(sitemap).toContain("<news:name>${xmlEscape(SITE_NAME)}</news:name>");
    expect(sitemap).toContain("t < cutoff");
    expect(sitemap).toContain("t > now");
    expect(sitemap).toContain("if (rows.length >= MAX_NEWS_URLS) break");
    expect(sitemap).toContain("canonicalize(it.loc)");
    expect(sitemap).toContain("!a.pillar");
  });

  it("includes current cloud news and sports kinds while excluding evergreen cloud content", () => {
    const sitemap = readFileSync(new URL("../routes/sitemap-news[.]xml.ts", import.meta.url), "utf8");

    expect(sitemap).toContain('kind === "ingested"');
    expect(sitemap).toContain('kind === "news"');
    expect(sitemap).toContain('kind.startsWith("sports-")');
    expect(sitemap).not.toContain('kind === "evergreen" ||');
  });

  it("uses the displayed cloud SEO headline when one exists", () => {
    const sitemap = readFileSync(new URL("../routes/sitemap-news[.]xml.ts", import.meta.url), "utf8");
    const headlineLookup = readFileSync(new URL("./news-sitemap.functions.ts", import.meta.url), "utf8");

    expect(sitemap).toContain("getNewsSitemapHeadlines");
    expect(sitemap).toContain("headlines[a.slug] ?? a.title");
    expect(headlineLookup).toContain('.select("slug,seo_headline")');
    expect(headlineLookup).toContain("display-consistency lookup only");
  });

  it("keeps visible and structured article dates logically ordered", () => {
    expect(
      visibleArticleDates("2026-07-17T12:00:00Z", "2026-07-16").updatedIso,
    ).toBeNull();
    expect(
      visibleArticleDates("2026-07-17T12:00:00Z", "2026-07-18T12:00:00Z").updatedIso,
    ).toBe("2026-07-18T12:00:00.000Z");

    const articleRoute = readFileSync(new URL("../routes/news.$slug.tsx", import.meta.url), "utf8");
    expect(articleRoute).toContain('"@type": "NewsArticle"');
    expect(articleRoute).toContain("datePublished: published");
    expect(articleRoute).toContain("dateModified: modified");
    expect(articleRoute).toContain("author: personJsonLd");
    expect(articleRoute).toContain("image: { ...articleImage");
    expect(articleRoute).toContain("thumbnailUrl: seo.image");
  });
});
