import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./auto-facebook-post-texasdefined.ts", import.meta.url), "utf8");

describe("TexasDefined Facebook article selection", () => {
  it("keeps a long article URL cooldown", () => {
    expect(source).toContain("const ARTICLE_HISTORY_DAYS = 45");
    expect(source).toContain(".limit(250)");
  });

  it("keeps durable sitemap content eligible regardless of original age", () => {
    // The production publisher draws from the live TexasDefined sitemap and only
    // removes URLs that were recently posted to Facebook. lastmod is ranking
    // metadata, not an expiration gate for evergreen/list/guide articles.
    expect(source).toContain("const SITEMAP_URL = `${SITE_URL}/sitemap.xml`");
    expect(source).toContain("const candidates = parseSitemap(sitemapText)");
    expect(source).toContain(".filter((candidate) => !postedUrls.has(candidate.url))");
    expect(source).toContain("if (candidate.path.startsWith(\"/article/\")) score += 10");
    expect(source).not.toContain("MAX_ARTICLE_AGE_DAYS");
    expect(source).not.toContain("ARTICLE_MAX_AGE_DAYS");
    expect(source).not.toContain("MIN_ARTICLE_PUBLISHED_AT");
  });

  it("uses lastmod only as a ranking signal, never as an eligibility cutoff", () => {
    expect(source).toContain("if (candidate.lastmod)");
    expect(source).toContain("score += Math.max(0, 14 - Math.floor(ageDays / 7))");
    expect(source).toContain("const aDate = a.lastmod ? Date.parse(a.lastmod) : 0");
    expect(source).toContain("const bDate = b.lastmod ? Date.parse(b.lastmod) : 0");
  });

  it("prioritizes list and gateway traffic drivers", () => {
    for (const term of ["things", "best", "before", "reasons", "facts", "road-trip", "guide", "places", "visit"]) {
      expect(source).toContain(`\"${term}\"`);
    }
    expect(source).toContain("candidateTrafficScore(b) - candidateTrafficScore(a)");
    expect(source).toContain("metadataTrafficScore(candidate, metadata)");
  });

  it("still enforces live Facebook duplicate and posting guards", () => {
    expect(source).toContain("fetchRecentFacebookPagePosts");
    expect(source).toContain("facebookPostMatchesArticle");
    expect(source).toContain("hardPostingGuard");
    expect(source).toContain("MAX_DAILY_POSTS = 2");
    expect(source).toContain("MIN_GAP_MINUTES = 180");
  });
});
