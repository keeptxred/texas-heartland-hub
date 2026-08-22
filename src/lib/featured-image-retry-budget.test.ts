import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./featured-image.functions.ts", import.meta.url), "utf8");

describe("featured image retry budget", () => {
  it("allows the initial image plus three validator-steered corrected compositions", () => {
    expect(source).toContain("attempt <= 3");
    expect(source).not.toContain("attempt <= 4");
  });

  it("feeds prior and current rejection reasons back into generation without weakening validation", () => {
    expect(source).toContain("A prior production attempt was rejected by the strict validator");
    expect(source).toContain("Validator rejection ${attempt}: ${verdict.reason}");
    expect(source).toContain("buildNegativeImagePrompt(subject, verdict.reason)");
  });

  it("still validates every generated image before storage", () => {
    expect(source).toContain("let verdict = await validateImageMatchesArticle(bytes, subject)");
    expect(source).toContain("verdict = await validateImageMatchesArticle(bytes, subject)");
    expect(source).toContain("if (!verdict.matches) throw new Error");
  });
});
