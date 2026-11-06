import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dpsOfficialArticleRelayUrl } from "./dps-firstparty-article-relay";

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
    expect(hydration).toContain("extractReadableNewsroomHtml(await response.text())");
    expect(hydration).not.toContain("return extracted ? trimTdemPressReleaseArchive(relay, extracted)");
  });
});
