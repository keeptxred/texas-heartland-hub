import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const ingest = readFileSync("src/routes/api/public/hooks/ingest-feeds.ts", "utf8");

describe("TDI official dated newsroom feed", () => {
  it("registers an original Texas agency RSS feed without changing publication gates", () => {
    expect(ingest).toContain(
      '{ name: "Texas Department of Insurance — Direct News Releases", url: "https://www.tdi.texas.gov/news/index.rss", category: "Politics", mode: "rss" }'
    );
    expect(ingest).toContain("source.mode === \"rss\" ? \"application/rss+xml");
    expect(ingest).toContain("parseFeed(resolved.text, source.name)");
    expect(ingest).toContain("resolvePublishTimestamp(rawDate || null)");
    expect(ingest).toContain("isTexasRelevant(item, result.source)");
  });
});
