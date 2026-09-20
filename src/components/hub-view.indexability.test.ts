import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(new URL("./hub-view.tsx", import.meta.url), "utf8");

describe("HubView static article indexability", () => {
  it("does not render retired static articles from hub slug lists", () => {
    expect(source).toContain('import { isStaticArticleIndexable } from "@/lib/static-article-indexability"');
    expect(source).toContain("&& isStaticArticleIndexable(a as Article)");
  });
});
