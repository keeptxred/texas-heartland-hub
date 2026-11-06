import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("src/routes/api/public/hooks/ingest-feeds.ts", "utf8");
const relay = readFileSync("supabase/functions/ktr-rss-relay/index.ts", "utf8");

describe("DPS first-party HTML egress recovery", () => {
  it("uses a fixed source key instead of allowing an arbitrary URL", () => {
    expect(relay).toContain('"official-texas-dps-press-index": "https://www.dps.texas.gov/news/press-releases"');
    expect(relay).toContain('const upstreamUrl = officialDpsArticle ?? (key === "official-texas-dps-article" ? undefined : FEEDS[key])');
    expect(relay).toContain('if (!upstreamUrl) return new Response("Unknown feed"');
    expect(relay).toContain('key === "official-texas-dps-press-index"');
    expect(relay).toContain('Accept: "text/html,application/xhtml+xml,*/*"');
    expect(relay).toContain('"X-KTR-RSS-Source": key');
  });

  it("requires the observed DPS loop and preserves actual dated source parsing", () => {
    expect(source).toContain("https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?feed=official-texas-dps-press-index");
    expect(source).toContain('source.name === "Texas DPS — Direct Press Releases"');
    expect(source).toContain('&& /too many redirects/i.test(fetched.error ?? "")');
    expect(source).toContain("dpsRelay?.text");
    expect(source).toContain("parseHtmlLinks(finalResult.text, source)");
    expect(source).toContain("datedDpsReleaseFromIndexTail(html, (match.index ?? 0) + match[0].length)");
    expect(source).toContain("if (!dated) continue;");
    expect(source).not.toContain("parseHtmlLinks(resolved.text, source)");
  });

  it("does not turn a relay into a new publisher or change publication gates", () => {
    expect(source).toContain("url: source.url");
    expect(source).toContain("source: source.name");
    expect(source).toContain("isTexasRelevant(item, result.source)");
    expect(source).toContain("if (seen.has(cleanLink)) continue;");
    expect(source).not.toContain("Date.now() // DPS");
  });
});
