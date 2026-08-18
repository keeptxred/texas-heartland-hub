import { describe, expect, it } from "vitest";
import {
  assessArticleSourceIntegrity,
  distinctSourceFamilies,
  normalizedSourceUrlKey,
  sourceFamilyFromUrl,
} from "./article-source-integrity";

describe("sourceFamilyFromUrl", () => {
  it("collapses feed and canonical subdomains to one publisher family", () => {
    expect(sourceFamilyFromUrl("https://feeds.texastribune.org/link/123")).toBe("texastribune.org");
    expect(sourceFamilyFromUrl("https://www.texastribune.org/2026/08/17/story/")).toBe("texastribune.org");
  });

  it("keeps independent publishers distinct", () => {
    const families = distinctSourceFamilies([
      { url: "https://www.houstonpublicmedia.org/story" },
      { url: "https://www.texastribune.org/story" },
      { url: "https://www.ercot.com/news/release" },
    ]);
    expect(families).toEqual(["ercot.com", "houstonpublicmedia.org", "texastribune.org"]);
  });
});

describe("article source integrity", () => {
  it("flags a same-publisher feed URL plus canonical URL as false multi-source", () => {
    const result = assessArticleSourceIntegrity({
      sourceName: "Multiple independent sources",
      sourceUrl: "https://www.texastribune.org/2026/08/17/story/",
      sources: [
        { url: "https://www.texastribune.org/2026/08/17/story/" },
        { url: "https://feeds.texastribune.org/link/123/story" },
      ],
    });
    expect(result.distinctFamilies).toEqual(["texastribune.org"]);
    expect(result.falseMultiSourceClaim).toBe(true);
    expect(result.primarySourceRepresented).toBe(true);
  });

  it("accepts genuinely independent source families", () => {
    const result = assessArticleSourceIntegrity({
      sourceName: "Multiple independent sources",
      sourceUrl: "https://www.houstonpublicmedia.org/story?utm_source=rss",
      sources: [
        { url: "https://www.houstonpublicmedia.org/story" },
        { url: "https://www.texastribune.org/story" },
        { url: "https://www.ercot.com/news/release" },
      ],
    });
    expect(result.falseMultiSourceClaim).toBe(false);
    expect(result.primarySourceRepresented).toBe(true);
  });

  it("normalizes tracking parameters when matching the primary source", () => {
    expect(normalizedSourceUrlKey("https://example.com/story/?utm_source=rss#top")).toBe(
      "https://example.com/story",
    );
  });
});
