import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../routes/happening-now.tsx", import.meta.url), "utf8");

describe("Happening Now rolling newsroom contract", () => {
  it("does not whitelist sources or depend on raw discovery feed rows", () => {
    expect(source).not.toContain("OFFICIAL_SOURCE_PATTERNS");
    expect(source).not.toContain("isOfficialGovernmentSource");
    expect(source).not.toContain('.from("texas_news_feed")');
    expect(source).toContain('.from("daily_articles")');
  });

  it("has no user-facing source, topic, keyword, or time-window filters", () => {
    expect(source).not.toContain("SOURCE_FILTERS");
    expect(source).not.toContain("sourceFilter");
    expect(source).not.toContain("quickFilters");
    expect(source).not.toContain("PRIMARY_WINDOW_MS");
    expect(source).not.toContain("FALLBACK_WINDOW_MS");
    expect(source).not.toContain("type=\"search\"");
  });

  it("links every visible item to the native Keep TX Red article", () => {
    expect(source).toContain('href={`/news/${article.slug}`}');
    expect(source).toContain('href={`/news/${lead.slug}`}');
    expect(source).not.toContain("pendingArticle");
    expect(source).not.toContain("View official source ↗");
  });
});
