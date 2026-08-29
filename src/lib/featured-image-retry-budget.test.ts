import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./featured-image.functions.ts", import.meta.url), "utf8");

describe("featured image retry budget", () => {
  it("allows the initial image plus three validator-steered corrected compositions", () => {
    expect(source).toContain("attempt <= 3");
    expect(source).not.toContain("attempt <= 4");
  });

  it("uses prior and current rejection reasons as negative constraints on the sanitized generation subject without contaminating positive prompts", () => {
    expect(source).toContain("buildNegativeImagePrompt(generationSubject, previousFailure)");
    expect(source).toContain("buildNegativeImagePrompt(generationSubject, verdict.reason)");
    expect(source).not.toContain("buildNegativeImagePrompt(subject, previousFailure)");
    expect(source).not.toContain("buildNegativeImagePrompt(subject, verdict.reason)");
    expect(source).toContain("Discard the prior composition entirely");
    expect(source).toContain("Discard the prior composition completely");
    expect(source).not.toContain("A prior production attempt was rejected by the strict validator: ${previousFailure}");
    expect(source).not.toContain("Validator rejection ${attempt}: ${verdict.reason}");
  });

  it("still validates every generated image against the original factual story before storage", () => {
    expect(source).toContain("let verdict = await validateImageMatchesArticle(bytes, subject)");
    expect(source).toContain("verdict = await validateImageMatchesArticle(bytes, subject)");
    expect(source).toContain("if (!verdict.matches) throw new Error");
  });
});
