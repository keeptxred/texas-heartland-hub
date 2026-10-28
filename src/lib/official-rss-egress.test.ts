import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { canFailoverTrustedRssStatus, trustedNewsroomRssRelayUrl } from "./official-rss-egress";

describe("KTR first-party RSS egress failover", () => {
  const ingest = readFileSync("src/routes/api/public/hooks/ingest-feeds.ts", "utf8");
  const relay = readFileSync("supabase/functions/ktr-rss-relay/index.ts", "utf8");

  it("only allows exact verified first-party feeds already registered on the fixed relay", () => {
    const trusted = [
      ["https://gov.texas.gov/news/rss", "official-governor-rss"],
      ["https://www.sos.state.tx.us/rss/press.xml", "official-secretary-of-state-press-rss"],
      ["https://www.sos.state.tx.us/texreg/texreg.xml", "official-texas-register-rss"],
      ["https://www.dps.texas.gov/rss/most-wanted.xml", "official-texas-dps-wanted-rss"],
      ["https://public.govdelivery.com/topics/TXCOMPT_1/feed.rss", "official-comptroller-rss"],
      ["https://www.khou.com/feeds/syndication/rss/news/local", "khou-local"],
      ["https://www.wfaa.com/feeds/syndication/rss/news/local", "wfaa-local"],
      ["https://www.kvue.com/feeds/syndication/rss/news/local", "kvue-local"],
    ] as const;
    for (const [url, key] of trusted) {
      expect(trustedNewsroomRssRelayUrl(url), url).toBe(
        `https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?feed=${key}`,
      );
      expect(relay).toContain(`"${key}": "${url}"`);
    }
    for (const url of [
      "http://gov.texas.gov/news/rss",
      "https://gov.texas.gov/news/rss?url=https://evil.example/",
      "https://evil.example/rss.xml",
      "https://news.google.com/rss/articles/CBMiABC",
      "https://www.sos.state.tx.us.evil.example/rss/press.xml",
    ]) expect(trustedNewsroomRssRelayUrl(url), url).toBeNull();
  });

  it("never circumvents 403, 404, or 429 upstream denials or rate limits", () => {
    for (const status of [0,408,425,500,502,503,504]) {
      expect(canFailoverTrustedRssStatus(status), String(status)).toBe(true);
    }
    for (const status of [200,301,400,401,403,404,409,422,429,451]) {
      expect(canFailoverTrustedRssStatus(status), String(status)).toBe(false);
    }
  });

  it("preserves direct source attribution and uses at most one alternate network request", () => {
    expect(ingest).toContain('const fixedRelayUrl = source.mode === "rss" ? trustedNewsroomRssRelayUrl(source.url) : null');
    expect(ingest).toContain("fixedRelayUrl && !direct.text && canFailoverTrustedRssStatus(direct.status)");
    expect(ingest).toContain("fetchText(fixedRelayUrl, accept, 1, 19000)");
    expect(ingest).toContain("fixedRelayUrl ? 7000");
    expect(ingest).toContain("const relayUsed = Boolean(relayed?.text)");
    expect(ingest).toContain('return { source: source.name, url: source.url');
    expect(ingest).toContain("trustedDirectRelayRecoveries:");
    expect(ingest).not.toContain("url: fixedRelayUrl, source:");
  });

  it("keeps hard failure threshold and valid source-only publishing gates in place", () => {
    const smoke = readFileSync("scripts/news/smoke-live-newsroom.mjs", "utf8");
    const generator = readFileSync("src/routes/api/public/hooks/generate-newsroom.ts", "utf8");
    expect(smoke).toContain("failureRatio > 0.10");
    expect(generator).toContain("newsroomHasPublisherDiversity(sources)");
    expect(generator).toContain("insufficient_independent_sources");
    expect(generator).toContain("await prepareFeaturedImageForUnpublishedNewsroomArticle");
    expect(generator).toContain('image_generation_status: "ready"');
  });
});
