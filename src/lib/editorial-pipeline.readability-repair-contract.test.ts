import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./editorial-pipeline.ts", import.meta.url), "utf8");

describe("editorial readability repair integration", () => {
  it("repairs both generated attempts before validation and return", () => {
    expect(source).toContain("const firstArticle = parsedFirst.article ? repairArticleReadability(parsedFirst.article) : null");
    expect(source).toContain("const secondArticle = parsedSecond.article ? repairArticleReadability(parsedSecond.article) : null");
    expect(source).toContain("article: firstArticle");
    expect(source).toContain("article: secondArticle");
  });
});
