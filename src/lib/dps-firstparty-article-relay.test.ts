import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dpsOfficialArticleRelayUrl } from "./dps-firstparty-article-relay";\nimport { fetchReadableNewsroomSource, isVerifiedDpsRelayHtml } from "./newsroom-source-page.server";\nimport { vi } from "vitest";

describe("bounded DPS article evidence egress", () => {
  it("accepts only exact DPS first-party article URLs", () => {
    expect(dpsOfficialArticleRelayUrl("https://www.dps.texas.gov/news/waco-repeat-offender-named-fugitive")).toBe(
      "https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?feed=official-texas-dps-article&slug=waco-repeat-offender-named-fugitive"
    );
    for (const bad of [
      "https://evil.test/news/valid-slug",
      "https://sub.www.dps.texas.gov/news/valid-slug",
      "http://www.dps.texas.gov/news/valid-slug",
      "https://www.dps.texas.gov/news/press-releases",
      "https://www.dps.texas.gov/news/most-wanted",
      "https://www.dps.texas.gov/news/valid-slug?url=https://evil.test",
      "https://www.dps.texas.gov/news/valid-slug#other",
      "https://user:pass@www.dps.texas.gov/news/valid-slug",
      "https://www.dps.texas.gov/news/a/b",
      "https://www.dps.texas.gov/news/%2f",
      "https://www.dps.texas.gov/news/" + "a".repeat(121),
      "javascript:alert(1)",
    ]) expect(dpsOfficialArticleRelayUrl(bad)).toBeNull();
  });

  it("keeps a same-host Supabase allowlist and retains original source attribution", () => {
    const proxy = readFileSync("supabase/functions/ktr-rss-relay/index.ts", "utf8");
    const hydration = readFileSync("src/lib/newsroom-source-page.server.ts", "utf8");
    expect(proxy).toContain('key === "official-texas-dps-article" && allowedDpsSlug');
    expect(proxy).toContain("https://www.dps.texas.gov/news/");
    expect(proxy).toContain('if (!upstreamUrl) return new Response("Unknown feed"');
    expect(proxy).toContain('trimSlash(final.pathname) !== trimSlash(requested.pathname)');
    expect(proxy).toContain("DPS article redirected away from the verified source");
    expect(proxy).toContain('key === "official-texas-dps-article"');
    expect(hydration).toContain("dpsOfficialArticleRelayUrl(url)");
    expect(hydration).toContain('/too many redirects/i.test(');
    expect(hydration).toContain("trimTdemPressReleaseArchive(url, extracted)");
    expect(hydration).toContain("extractReadableNewsroomHtml(body)");
    expect(hydration).toContain("isVerifiedDpsRelayHtml({");
    expect(hydration).not.toContain("return extracted ? trimTdemPressReleaseArchive(relay, extracted)");
  });
});

describe("original DPS HTML mislabeled text/plain", () => {
  const sourceUrl = "https://www.dps.texas.gov/news/waco-repeat-offender-named-featured-fugitive-november";
  const relayUrl = dpsOfficialArticleRelayUrl(sourceUrl)!;
  const release = Array.from({ length: 18 }, (_, index) =>
    `The Texas Department of Public Safety reports documented event number ${index + 1}; the verified agency release describes a distinct case fact, response and official action in the state of Texas.`
  ).join(" ");
  const dpsHtml = `<!DOCTYPE html><html><head><title>Agency news release | Department of Public Safety</title></head><body><main><article><h1>Waco Repeat Offender Named Featured Fugitive for November</h1><p>${release}</p></article></main></body></html>`;

  it("accepts only visibly official HTML at the exact fixed source relay", () => {
    expect(isVerifiedDpsRelayHtml({ sourceUrl, responseUrl: relayUrl, contentType: "text/plain; charset=utf-8", body: dpsHtml })).toBe(true);
    expect(isVerifiedDpsRelayHtml({ sourceUrl, responseUrl: relayUrl, contentType: "text/plain", body: "A plain text report ".repeat(100) })).toBe(false);
    expect(isVerifiedDpsRelayHtml({ sourceUrl, responseUrl: relayUrl, contentType: "text/plain", body: "<html><head><title>Unknown newsroom</title></head><body>Not DPS</body></html>" })).toBe(false);
    expect(isVerifiedDpsRelayHtml({ sourceUrl, responseUrl: "https://unrelated.example/relay", contentType: "text/plain", body: dpsHtml })).toBe(false);
    expect(isVerifiedDpsRelayHtml({ sourceUrl: "https://example.com/news/story", responseUrl: relayUrl, contentType: "text/plain", body: dpsHtml })).toBe(false);
    expect(isVerifiedDpsRelayHtml({ sourceUrl, responseUrl: relayUrl, contentType: "application/json", body: dpsHtml })).toBe(false);
    expect(isVerifiedDpsRelayHtml({ sourceUrl, responseUrl: relayUrl, contentType: "text/plain", body: "<html>checking your browser Department of Public Safety</html>" })).toBe(false);
  });

  it("hydrates genuine original release text after a redirect loop, never arbitrary plain text", async () => {
    let calls = 0;
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      calls++;
      if (url === sourceUrl) throw new TypeError("Too many redirects");
      if (url === relayUrl) {
        const response = new Response(dpsHtml, { status: 200, headers: { "Content-Type": "text/plain; charset=UTF-8" } });
        // A real fetch Response exposes its final URL. Synthetic Responses
        // constructed by Node do not unless we supply it explicitly.
        Object.defineProperty(response, "url", { value: relayUrl });
        return response;
      }
      throw new Error("Unexpected network request");
    }));
    try {
      const body = await fetchReadableNewsroomSource(sourceUrl);
      expect(calls).toBe(2);
      expect(body).toContain("The Texas Department of Public Safety reports documented event number 1");
      expect(body?.length).toBeGreaterThan(500);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
