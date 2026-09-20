import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./featured-image.functions.ts", import.meta.url), "utf8");

describe("featured image safe-subject validation", () => {
  it("validates generated images against the same safe subject used for generation", () => {
    const safeCalls = source.match(/validateImageMatchesArticle\(bytes, generationSubject\)/g) ?? [];
    expect(safeCalls).toHaveLength(2);
    expect(source).not.toContain("validateImageMatchesArticle(bytes, subject)");
  });
});
