import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();
const sitemapIndex = join(ROOT, "src/routes/sitemap[.]xml.ts");
const evergreenSitemap = join(ROOT, "src/routes/sitemap-evergreen[.]xml.ts");
const newsSitemap = join(ROOT, "src/routes/sitemap-news[.]xml.ts");

describe("article sitemap indexability alignment", () => {
  it("does not advertise static fallback articles without substantive bodies", () => {
    for (const path of [sitemapIndex, evergreenSitemap, newsSitemap]) {
      const source = readFileSync(path, "utf8");
      expect(source).toContain('from "@/data/article-bodies"');
      expect(source).toContain("ARTICLE_BODIES");
    }
  });

  it("requires substantive static bodies before evergreen and news sitemap inclusion", () => {
    const evergreen = readFileSync(evergreenSitemap, "utf8");
    const news = readFileSync(newsSitemap, "utf8");
    expect(evergreen).toContain("hasSubstantiveStaticBody(a.slug)");
    expect(news).toContain("hasSubstantiveStaticBody(a.slug)");
  });

  it("uses the same body requirement when computing sitemap index counts", () => {
    const index = readFileSync(sitemapIndex, "utf8");
    expect(index).toContain("Boolean(ARTICLE_BODIES[article.slug])");
  });
});