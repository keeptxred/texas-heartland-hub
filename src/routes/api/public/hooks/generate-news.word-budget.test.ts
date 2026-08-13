import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const sourcePath = fileURLToPath(new URL("./generate-news.ts", import.meta.url));
const source = readFileSync(sourcePath, "utf8");

describe("Daily Texas News qualifying prose contract", () => {
  it("keeps the 800-word floor and allocates AI output to counted prose", () => {
    expect(source).toContain("The hard publication floor is ${INGESTED_MIN_MAIN_WORDS} qualifying words");
    expect(source).toContain('"summary": exactly 55–75 words');
    expect(source).toContain('"sections": exactly 6 substantive H2-style sections');
    expect(source).toContain("EACH section must contain exactly 3 separate paragraphs");
    expect(source).toContain("Target 50–70 words per paragraph");
    expect(source).toContain("These 18 section paragraphs are the primary qualifying article body");
    expect(source).toContain("DO NOT count toward the ${INGESTED_MIN_MAIN_WORDS}-word publication floor");
  });

  it("keeps auxiliary output bounded and summary overshoot deterministic", () => {
    expect(source).toContain('minItems: 6');
    expect(source).toContain('maxItems: 6');
    expect(source).toContain('minItems: 3');
    expect(source).toContain('maxItems: 3');
    expect(source).toContain("normalizeOverlongSummary");
    expect(source).toContain("words.length <= 90");
    expect(source).toContain("words.slice(0, 90)");
  });
});
