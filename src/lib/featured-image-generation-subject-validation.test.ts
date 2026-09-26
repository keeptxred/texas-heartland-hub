import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./featured-image.functions.ts", import.meta.url), "utf8");

describe("featured image safe-subject validation", () => {
  it("validates generated images against the original article subject rather than the sanitized generation scene", () => {
    const originalSubjectCalls = source.match(/validateImageMatchesArticle\(bytes, subject\)/g) ?? [];
    expect(originalSubjectCalls).toHaveLength(2);
    expect(source).not.toContain("validateImageMatchesArticle(bytes, generationSubject)");
  });
});
