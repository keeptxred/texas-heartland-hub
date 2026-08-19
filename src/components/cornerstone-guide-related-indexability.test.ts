import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(new URL("./cornerstone-guide-page.tsx", import.meta.url), "utf8");

describe("cornerstone guide related-link indexability", () => {
  it("checks static /news links against the retirement policy", () => {
    expect(source).toContain('import { isStaticArticleIndexable } from "@/lib/static-article-indexability"');
    expect(source).toContain("function isRelatedGuideLinkPublic(href: string): boolean");
    expect(source).toContain("return !article || isStaticArticleIndexable(article);");
  });

  it("renders only public related links", () => {
    expect(source).toContain("const publicRelated = guide.related.filter((item) => isRelatedGuideLinkPublic(item.href));");
    expect(source).toContain("publicRelated.map((item)");
  });
});
