import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./featured-image.functions.ts", import.meta.url), "utf8");

describe("featured image retry budget", () => {
  it("allows only the initial image plus one corrected composition", () => {
    expect(source).toContain("attempt <= 1");
    expect(source).not.toContain("attempt <= 3");
  });

  it("still validates both the initial and corrected image", () => {
    expect(source).toContain("let verdict = await validateImageMatchesArticle(bytes, subject)");
    expect(source).toContain("verdict = await validateImageMatchesArticle(bytes, subject)");
    expect(source).toContain("if (!verdict.matches) throw new Error");
  });
});
