import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();
const discovery = join(ROOT, "src/lib/static-article-discovery.functions.ts");
const newsroom = join(ROOT, "src/routes/news.index.tsx");
const authorsIndex = join(ROOT, "src/routes/authors.index.tsx");
const authorProfile = join(ROOT, "src/routes/authors.$slug.tsx");
const authorSitemap = join(ROOT, "src/routes/sitemap-authors[.]xml.ts");
const imageSitemap = join(ROOT, "src/routes/sitemap-images[.]xml.ts");

describe("static article discovery alignment", () => {
  it("defines substantive static discovery at a server boundary", () => {
    const source = readFileSync(discovery, "utf8");
    expect(source).toContain('from "@/data/article-bodies"');
    expect(source).toContain("Boolean(ARTICLE_BODIES[article.slug])");
    expect(source).toContain("isStaticArticleIndexable(article)");
  });

  it("uses the lightweight server result on client-facing discovery surfaces", () => {
    for (const path of [newsroom, authorsIndex, authorProfile]) {
      const source = readFileSync(path, "utf8");
      expect(source).toContain("getDiscoverableStaticArticleSlugs");
      expect(source).not.toContain('from "@/data/article-bodies"');
    }
  });

  it("does not advertise fallback-only pages in remaining machine sitemaps", () => {
    for (const path of [authorSitemap, imageSitemap]) {
      const source = readFileSync(path, "utf8");
      expect(source).toContain("ARTICLE_BODIES");
      expect(source).toContain("isStaticArticleIndexable");
    }
  });
});
