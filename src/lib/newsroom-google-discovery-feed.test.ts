import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { isGoogleNewsDiscoveryFeed } from "./newsroom-google-discovery-feed";

const ingestion = readFileSync("src/routes/api/public/hooks/ingest-feeds.ts", "utf8");

describe("Google News priority relay classification in KTR ingestion", () => {
  it("classifies all four project-hosted priority discovery relays as Google, never direct", () => {
    for (const kind of ["business", "campus", "community", "sports"]) {
      const url = `https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-priority?feed=google-texas-${kind}-longtail`;
      expect(isGoogleNewsDiscoveryFeed(url), kind).toBe(true);
      expect(ingestion).toContain(url);
    }
  });
  it("preserves legacy Google RSS and relay discovery classes", () => {
    expect(isGoogleNewsDiscoveryFeed("https://news.google.com/rss/search?q=Texas")).toBe(true);
    expect(isGoogleNewsDiscoveryFeed("https://news.google.com/rss/articles/abc")).toBe(true);
    expect(isGoogleNewsDiscoveryFeed("https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?feed=google-texas")).toBe(true);
    expect(isGoogleNewsDiscoveryFeed("https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-priority?feed=local-news")).toBe(false);
  });
  it("never reclassifies actual direct publisher or arbitrary URL as Google", () => {
    for (const url of [
      "https://www.sos.state.tx.us/rss/press.xml",
      "https://feeds.texastribune.org/feeds/main/",
      "https://www.houstonpublicmedia.org/feed/",
      "https://ftkznprjljkhymknvhye.supabase.co/functions/v1/another?feed=google-texas",
      "https://other.supabase.co/functions/v1/ktr-rss-relay-priority?feed=google-texas",
      "not-a-url",
    ]) expect(isGoogleNewsDiscoveryFeed(url), url).toBe(false);
  });
  it("keeps primary sources in core and rotates all discovery through one limited budget", () => {
    expect(ingestion).toContain("const DIRECT_CORE_URLS = new Set(");
    expect(ingestion).toContain("!isGoogleNewsDiscoveryFeed(source.url)");
    expect(ingestion).toContain("const allGoogle = sources.filter((source) => isGoogleNewsDiscoveryFeed(source.url))");
    expect(ingestion).toContain("const google = rotateGoogleSources(allGoogle)");
    expect(ingestion).toContain("const GOOGLE_FEEDS_PER_RUN = 10");
    expect(ingestion).toContain("const SUPPLEMENTAL_DIRECT_FEEDS_PER_RUN = 12");
    expect(ingestion).not.toContain("GOOGLE_NEWS_RE");
  });
});
