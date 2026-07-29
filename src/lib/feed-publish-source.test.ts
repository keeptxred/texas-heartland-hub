import { describe, expect, it } from "vitest";
import { resolveFeedPublishSource } from "@/lib/feed-publish-source";
import { ABSOLUTE_MIN_SOURCE_WORDS, assessRewritePreflight } from "@/lib/rewrite-preflight";

function words(count: number): string {
  return Array.from({ length: count }, (_, index) => `word${index + 1}`).join(" ");
}

describe("feed publishing source resolution", () => {
  it("allows a 163-word stored Reddit description without fetched text", () => {
    const source = resolveFeedPublishSource({ storedDescription: words(163) });

    expect(source.primaryKind).toBe("stored-description");
    expect(source.wordCount).toBe(163);
    expect(source.meetsAbsoluteMinimum).toBe(true);
  });

  it("blocks source text below the configured absolute minimum", () => {
    const source = resolveFeedPublishSource({
      storedDescription: words(ABSOLUTE_MIN_SOURCE_WORDS - 1),
    });

    expect(source.wordCount).toBe(ABSOLUTE_MIN_SOURCE_WORDS - 1);
    expect(source.meetsAbsoluteMinimum).toBe(false);
  });

  it("gives cached extraction precedence over every fetched candidate", () => {
    const source = resolveFeedPublishSource({
      cachedExtraction: words(180),
      storedDescription: words(163),
      redditSelftext: words(200),
      linkedArticleText: words(220),
      linkedArticleUrl: "https://example.com/linked",
    });

    expect(source.primaryKind).toBe("cached-extraction");
    expect(source.includedKinds).toEqual(["cached-extraction"]);
    expect(source.text).toBe(words(180));
  });

  it("uses Reddit selftext when it is available", () => {
    const selftext = words(170);
    const source = resolveFeedPublishSource({ redditSelftext: selftext });

    expect(source.primaryKind).toBe("reddit-selftext");
    expect(source.includedKinds).toEqual(["reddit-selftext"]);
    expect(source.text).toContain(selftext);
  });

  it("uses linked article text and preserves its source URL", () => {
    const linkedArticleText = words(170);
    const source = resolveFeedPublishSource({
      linkedArticleText,
      linkedArticleUrl: "https://example.com/linked",
    });

    expect(source.primaryKind).toBe("linked-article");
    expect(source.includedKinds).toEqual(["linked-article"]);
    expect(source.text).toContain("LINKED SOURCE (https://example.com/linked):");
    expect(source.text).toContain(linkedArticleText);
  });

  it("uses the same normalized word count as rewrite preflight", () => {
    const source = resolveFeedPublishSource({
      storedDescription: "  one\n two\tthree  ",
      redditSelftext: "four   five",
    });
    const preflight = assessRewritePreflight({
      title: "Texas officials announced an update",
      description: source.text,
      link: "https://reddit.com/r/texas/comments/example",
    });

    expect(preflight.sourceWordCount).toBe(source.wordCount);
  });

  it("does not count duplicate stored description and selftext twice", () => {
    const duplicate = words(163);
    const source = resolveFeedPublishSource({
      storedDescription: duplicate,
      redditSelftext: duplicate,
    });

    expect(source.includedKinds).toEqual(["stored-description"]);
    expect(source.wordCount).toBe(163);
  });
});
