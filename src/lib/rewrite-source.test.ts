import { describe, expect, it } from "vitest";
import {
  ABSOLUTE_MIN_SOURCE_WORDS,
  assessRewritePreflight,
  countUsableSourceWords,
} from "./rewrite-preflight";
import { resolveRewriteSource } from "./rewrite-source";

function words(count: number): string {
  return Array.from({ length: count }, (_, index) => `word${index + 1}`).join(" ");
}

describe("rewrite source consistency", () => {
  it("uses a stored Reddit description when it alone clears the absolute floor", () => {
    const resolved = resolveRewriteSource({ storedDescription: words(163) });
    expect(resolved.primaryKind).toBe("stored-description");
    expect(resolved.wordCount).toBe(163);
    expect(resolved.meetsAbsoluteMinimum).toBe(true);
  });

  it("gives cached extraction precedence over fetched candidates", () => {
    const resolved = resolveRewriteSource({
      cachedExtraction: words(180),
      storedDescription: words(163),
      redditSelftext: words(220),
      linkedArticleText: words(300),
    });
    expect(resolved.primaryKind).toBe("cached-extraction");
    expect(resolved.includedKinds).toEqual(["cached-extraction"]);
    expect(resolved.wordCount).toBe(180);
  });

  it("deduplicates identical stored description and selftext", () => {
    const duplicate = words(ABSOLUTE_MIN_SOURCE_WORDS + 5);
    const resolved = resolveRewriteSource({ storedDescription: duplicate, redditSelftext: duplicate });
    expect(resolved.includedKinds).toEqual(["stored-description"]);
    expect(resolved.wordCount).toBe(ABSOLUTE_MIN_SOURCE_WORDS + 5);
  });

  it("preserves a linked article URL in the rewrite source", () => {
    const resolved = resolveRewriteSource({
      linkedArticleText: words(170),
      linkedArticleUrl: "https://example.com/report",
    });
    expect(resolved.text).toContain("LINKED SOURCE (https://example.com/report):");
  });

  it("uses the same normalized count as preflight", () => {
    const source = resolveRewriteSource({ storedDescription: words(165) });
    const preflight = assessRewritePreflight({
      title: "Texas officials announced an update",
      description: source.text,
      link: "https://example.com/story",
    });
    expect(preflight.sourceWordCount).toBe(source.wordCount);
    expect(countUsableSourceWords(source.text)).toBe(source.wordCount);
  });
});
