import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(new URL("./laws.index.tsx", import.meta.url), "utf8");

describe("laws hub static article discovery", () => {
  it("requires the shared static indexability policy before linking an article", () => {
    expect(source).toContain('import { isStaticArticleIndexable } from "@/lib/static-article-indexability"');
    expect(source).toContain("!isPublished(a) || !isStaticArticleIndexable(a)");
  });
});
