import fs from "node:fs";
import { describe, expect, it } from "vitest";

const imageSitemap = fs.readFileSync(new URL("./sitemap-images[.]xml.ts", import.meta.url), "utf8");
const authorSitemap = fs.readFileSync(new URL("./sitemap-authors[.]xml.ts", import.meta.url), "utf8");

describe("secondary sitemap static article indexability", () => {
  it("keeps retired static articles out of the image sitemap", () => {
    expect(imageSitemap).toContain('import { isStaticArticleIndexable } from "@/lib/static-article-indexability"');
    expect(imageSitemap).toContain("isPublished(a) && isStaticArticleIndexable(a)");
  });

  it("does not count retired static articles toward author sitemap activity", () => {
    expect(authorSitemap).toContain('import { isStaticArticleIndexable } from "@/lib/static-article-indexability"');
    expect(authorSitemap).toContain("&& isStaticArticleIndexable(article)");
  });
});
