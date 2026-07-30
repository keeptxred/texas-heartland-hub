import { describe, expect, it } from "vitest";
import {
  ABSOLUTE_MIN_SOURCE_WORDS,
  assessRewritePreflight,
  countUsableSourceWords,
  preflightStatusLabel,
} from "@/lib/rewrite-preflight";
import { resolveRewriteSource } from "@/lib/rewrite-source";

function words(count: number): string {
  return Array.from({ length: count }, (_, index) => `word${index + 1}`).join(" ");
}

describe("rewrite source consistency", () => {
  it("uses a stored 163-word Reddit description when no fetched source is available", () => {
    const storedDescription = words(163);
    const resolved = resolveRewriteSource({ storedDescription });

    expect(resolved.primaryKind).toBe("stored-description");
    expect(resolved.wordCount).toBe(163);
    expect(resolved.meetsAbsoluteMinimum).toBe(true);
  });

  it("blocks a stored description below the absolute floor", () => {
    const resolved = resolveRewriteSource({
      storedDescription: words(ABSOLUTE_MIN_SOURCE_WORDS - 1),
    });

    expect(resolved.wordCount).toBe(149);
    expect(resolved.meetsAbsoluteMinimum).toBe(false);
  });

  it("uses cached extraction as the authoritative source", () => {
    const resolved = resolveRewriteSource({
      cachedExtraction: words(200),
      storedDescription: words(163),
      redditSelftext: words(80),
      linkedArticleText: words(300),
    });

    expect(resolved.primaryKind).toBe("cached-extraction");
    expect(resolved.includedKinds).toEqual(["cached-extraction"]);
    expect(resolved.wordCount).toBe(200);
  });

  it("deduplicates identical stored and Reddit text", () => {
    const source = words(170);
    const resolved = resolveRewriteSource({
      storedDescription: source,
      redditSelftext: source,
    });

    expect(resolved.includedKinds).toEqual(["stored-description"]);
    expect(resolved.wordCount).toBe(170);
  });

  it("counts normalized whitespace identically everywhere", () => {
    const source = "  one\n\n two\tthree   four  ";
    expect(countUsableSourceWords(source)).toBe(4);

    const preflight = assessRewritePreflight({
      title: "Texas officials announced a new law",
      description: source,
      link: "https://example.com/story",
    });

    expect(preflight.sourceWordCount).toBe(4);
  });

  it("renders the exact preflight count used by the gate", () => {
    const source = [
      "Governor Greg Abbott announced a Texas order on July 20, 2026.",
      "The order affects 1,000 residents and officials said implementation begins immediately.",
      words(150),
    ].join(" ");

    const preflight = assessRewritePreflight({
      title: "Texas governor announces new order",
      description: source,
      link: "https://example.com/texas-order",
    });

    expect(preflightStatusLabel(preflight)).toContain(
      `${preflight.sourceWordCount} extracted source words`,
    );
  });
});
