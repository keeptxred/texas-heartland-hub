import fs from "node:fs";
import { describe, expect, it } from "vitest";

const texasNews = fs.readFileSync(new URL("./texas-news-view.tsx", import.meta.url), "utf8");
const texasBusiness = fs.readFileSync(new URL("./texas-business-view.tsx", import.meta.url), "utf8");

describe("curated static article indexability", () => {
  it("gates Texas News curated cards with the shared static retirement policy", () => {
    expect(texasNews).toContain('import { isStaticArticleIndexable } from "@/lib/static-article-indexability"');
    expect(texasNews).toContain("&& isStaticArticleIndexable(a!)");
  });

  it("gates Texas Business curated and merged cards with the shared static retirement policy", () => {
    expect(texasBusiness).toContain('import { isStaticArticleIndexable } from "@/lib/static-article-indexability"');
    expect(texasBusiness).toContain("&& isStaticArticleIndexable(a!)");
    expect(texasBusiness).toContain(".filter(isStaticArticleIndexable)");
  });
});
