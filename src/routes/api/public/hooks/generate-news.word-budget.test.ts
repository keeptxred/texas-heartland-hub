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

  it("keeps auxiliary output bounded and normalizes summary length without another AI call", () => {
    expect(source).toContain('minItems: 6');
    expect(source).toContain('maxItems: 6');
    expect(source).toContain('minItems: 3');
    expect(source).toContain('maxItems: 3');
    expect(source).toContain("normalizeSummaryLength");
    expect(source).toContain("words.length > 90");
    expect(source).toContain("words.slice(0, 90)");
    expect(source).toContain("words.length >= 45");
    expect(source).toContain("firstBodyParagraph");
    expect(source).toContain("combinedWords >= 45");
    expect(source).toContain("a.summary = normalizeSummaryLength(a.summary, a.sections)");
  });

  it("requires enough verified source material before spending AI quota", () => {
    expect(source).toContain("const MIN_VERIFIED_SOURCE_WORDS = 900");
    expect(source).toContain("sourceWords >= MIN_VERIFIED_SOURCE_WORDS");
    expect(source).toContain("skipped thin verified source before AI rewrite");
    expect(source).toContain('reason: "insufficient_verified_source"');
    expect(source).toContain("min_verified_source_words: MIN_VERIFIED_SOURCE_WORDS");
    expect(source).toContain("source_word_counts: sourceWordCounts.slice(0, 10)");
  });

  it("uses the stronger Cloudflare rewrite model and one bounded underlength correction", () => {
    expect(source).toContain('model: "@cf/qwen/qwen3-30b-a3b-fp8"');
    expect(source).toContain("CORRECTIVE LONG-FORM PASS");
    expect(source).toContain("mainWords < INGESTED_MIN_MAIN_WORDS");
    expect(source).toContain("EACH of the 18 section paragraphs must be 65–80 words");
    expect(source).toContain("verified_source_words: sourceWordCount(story.sourceText || story.description)");
    expect(source).toContain('typeof article.verified_source_words === "number"');
  });

  it("removes vague unsupported attribution before editorial validation without another AI call", () => {
    expect(source).toContain("VAGUE_ATTRIBUTION_PATTERNS");
    expect(source).toContain("stripVagueAttributionSentences");
    expect(source).toContain("sanitizeVagueAttribution(a)");
    expect(source).toContain("experts (?:say|suggest|believe)");
    expect(source).toContain("Never use vague unsupported attribution");
  });
});
