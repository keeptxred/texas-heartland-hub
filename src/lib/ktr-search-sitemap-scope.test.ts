import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const evergreenSitemap = readFileSync(new URL("../routes/sitemap-evergreen[.]xml.ts", import.meta.url), "utf8");
const newsSitemap = readFileSync(new URL("../routes/sitemap-news[.]xml.ts", import.meta.url), "utf8");
const imageSitemap = readFileSync(new URL("../routes/sitemap-images[.]xml.ts", import.meta.url), "utf8");
const cloudIndexability = readFileSync(new URL("./article-indexability.functions.ts", import.meta.url), "utf8");
const sitemapLoader = readFileSync(new URL("./evergreen.functions.ts", import.meta.url), "utf8");

describe("KTR cross-site search surface scope", () => {
  it("applies canonical brand ownership to cloud indexing and the central sitemap loader", () => {
    for (const source of [sitemapLoader, cloudIndexability]) {
      expect(source).toContain("isKeepTxRedSearchOwnedStory");
    }
  });

  it("passes the same story ownership context used by direct article indexability", () => {
    for (const source of [sitemapLoader, evergreenSitemap, newsSitemap]) {
      expect(source).toContain("description: a.dek");
      expect(source).toContain("category: a.category");
      expect(source).toContain("source: a.source_name");
      expect(source).toContain("kind: a.kind");
    }
  });

  it("keeps image sitemap cloud URLs behind the centrally owned sitemap loader", () => {
    expect(imageSitemap).toContain("listSitemapArticles");
    expect(imageSitemap).not.toContain(".from(\"daily_articles\")");
  });

  it("loads the same readiness fields that can noindex a direct article page", () => {
    expect(sitemapLoader).toContain("discover_category");
    expect(sitemapLoader).toContain("featured_image_url");
    expect(sitemapLoader).toContain("image_generation_status");
  });

  it("does not advertise sports article kinds in the KTR Google News sitemap", () => {
    expect(newsSitemap).not.toContain('kind.startsWith("sports-")');
  });
});
