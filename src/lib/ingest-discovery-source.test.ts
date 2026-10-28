import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { isGoogleNewsDiscoveryTransport } from "./ingest-discovery-source";

describe("Google discovery feed transport classification", () => {
  it("keeps priority/north/sports Google RSS in the rotating discovery lane", () => {
    const base = "https://ftkznprjljkhymknvhye.supabase.co/functions/v1/";
    for (const url of [
      "https://news.google.com/rss/search?q=Texas&hl=en-US",
      base+"ktr-rss-relay?feed=google-attorney-general&transport=relay",
      base+"ktr-rss-relay-priority?feed=google-primary-governor",
      base+"ktr-rss-relay-priority?transport=relay&feed=google-texas-business-longtail",
      base+"ktr-rss-relay-north?feed=dfw-cross-timbers",
      base+"ktr-rss-relay-sports?feed=football-expansion",
    ]) expect(isGoogleNewsDiscoveryTransport(url),url).toBe(true);
  });

  it("never demotes actual first-party publisher RSS or official egress failover to Google discovery", () => {
    const base = "https://ftkznprjljkhymknvhye.supabase.co/functions/v1/";
    for (const url of [
      "https://feeds.texastribune.org/feeds/main/",
      "https://gov.texas.gov/news/rss",
      "https://www.sos.state.tx.us/rss/press.xml",
      base+"ktr-rss-relay?feed=official-governor-rss",
      base+"ktr-rss-relay?feed=khou-local",
      "https://attacker.example/functions/v1/ktr-rss-relay?feed=google-texas",
      "https://news.google.com/rss/articles/encoded-discovery-pointer",
      "invalid url",
    ]) expect(isGoogleNewsDiscoveryTransport(url),url).toBe(false);
  });

  it("uses discovery classification on both source loading and the active ingestion fetch lane", () => {
    const script = readFileSync("src/routes/api/public/hooks/ingest-feeds.ts", "utf8");
    expect(script).toContain("isGoogleNewsDiscoveryTransport(source.url)");
    expect(script).toContain("const allGoogle = sources.filter((source) => isGoogleNewsDiscoveryTransport(source.url));");
    expect(script).toContain("const configuredDirect = sources.filter((source) => !isGoogleNewsDiscoveryTransport(source.url));");
    expect(script).toContain("rotateGoogleSources(allGoogle)");
    expect(script).not.toContain("GOOGLE_NEWS_RE");
  });
});
