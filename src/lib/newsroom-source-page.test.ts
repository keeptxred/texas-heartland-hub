import { describe, expect, it } from "vitest";
import {
  extractReadableNewsroomHtml,
  looksSyntheticNewsroomText,
  shouldFetchNewsroomSourcePage,
} from "./newsroom-source-page.server";

describe("newsroom source-page enrichment", () => {
  it("targets thin publisher bodies and synthetic pollution", () => {
    expect(shouldFetchNewsroomSourcePage({
      url: "https://example.com/story",
      extractedBody: "short source text",
    })).toBe(true);
    expect(shouldFetchNewsroomSourcePage({
      url: "https://example.com/story",
      extractedBody: `MULTI-SOURCE STORY PACKET. ${"synthetic ".repeat(1000)}`,
    })).toBe(true);
  });

  it("does not refetch already-substantive clean source bodies", () => {
    expect(shouldFetchNewsroomSourcePage({
      url: "https://example.com/story",
      extractedBody: "Clean publisher evidence sentence. ".repeat(150),
    })).toBe(false);
  });

  it("skips Google News wrappers and non-http links", () => {
    expect(shouldFetchNewsroomSourcePage({
      url: "https://news.google.com/rss/articles/abc",
      extractedBody: "",
    })).toBe(false);
    expect(shouldFetchNewsroomSourcePage({ url: "mailto:test@example.com", extractedBody: "" })).toBe(false);
  });

  it("extracts readable article text without scripts or page chrome", () => {
    const html = `<html><body><header>Navigation</header><script>bad()</script><article><h1>Texas update</h1><p>${"Substantive verified publisher sentence. ".repeat(25)}</p></article><footer>Footer</footer></body></html>`;
    const text = extractReadableNewsroomHtml(html) ?? "";
    expect(text.length).toBeGreaterThan(500);
    expect(text).toContain("Texas update");
    expect(text).not.toContain("bad()");
    expect(text).not.toContain("Navigation");
  });

  it("rejects synthetic packet text even when it is long", () => {
    const html = `<article><p>MULTI-SOURCE STORY PACKET. ${"fake evidence sentence. ".repeat(100)}</p></article>`;
    expect(extractReadableNewsroomHtml(html)).toBeNull();
    expect(looksSyntheticNewsroomText("RAW SOURCE PACKET stuff")).toBe(true);
  });
});
