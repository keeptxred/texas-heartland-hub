import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(new URL("./news.$slug.tsx", import.meta.url), "utf8");

describe("direct article static indexability", () => {
  it("marks retired static articles noindex on the direct article route", () => {
    expect(source).toContain('import { isStaticArticleIndexable } from "@/lib/static-article-indexability"');
    expect(source).toContain("noindex: !isStaticArticleIndexable(article)");
  });

  it("does not use retired static articles as related content", () => {
    expect(source).toContain("x.category === ever.category && isPublished(x) && isStaticArticleIndexable(x)");
    expect(source).toContain("x.slug !== a.slug && isPublished(x) && isStaticArticleIndexable(x)");
    expect(source).toContain("isPublished(a as Article) && isStaticArticleIndexable(a as Article)");
  });
});
