import { describe, expect, it } from "vitest";
import {
  extractReadableNewsroomHtml,
  isNewsroomSourceFetchCoolingDown,
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


  it("backs off unreadable publisher pages for 24h while keeping successful fetches at 6h", () => {
    const now = Date.parse("2026-10-15T12:00:00Z");
    const hour = 60 * 60 * 1000;
    const check = (hoursAgo: number, result: string) => isNewsroomSourceFetchCoolingDown(
      { last_attempt_at: new Date(now - hoursAgo * hour).toISOString(), last_result: result },
      now, 6 * hour, 24 * hour,
    );
    expect(check(12, "no_readable_body")).toBe(true);
    expect(check(25, "no_readable_body")).toBe(false);
    expect(check(4, "success")).toBe(true);
    expect(check(7, "success")).toBe(false);
    expect(check(4, "update_failed")).toBe(true);
    expect(isNewsroomSourceFetchCoolingDown(null, now, 6 * hour, 24 * hour)).toBe(false);
    expect(isNewsroomSourceFetchCoolingDown(
      { last_attempt_at: "invalid", last_result: "no_readable_body" }, now, 6 * hour, 24 * hour,
    )).toBe(false);
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
