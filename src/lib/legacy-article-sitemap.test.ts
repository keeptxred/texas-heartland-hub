import { describe, expect, it } from "vitest";
import { isLegacyArticleAllowedInSitemap } from "@/lib/evergreen.functions";

describe("legacy article sitemap eligibility", () => {
  it("keeps ordinary legacy live URLs out of discovery feeds", () => {
    expect(isLegacyArticleAllowedInSitemap("live-2026-07-07-unreviewed-story", [])).toBe(false);
  });

  it("allows an editorially restored historical URL", () => {
    expect(
      isLegacyArticleAllowedInSitemap(
        "live-2026-07-07-reviewed-story",
        ["legacy_url_restored", "official_sources"],
      ),
    ).toBe(true);
  });

  it("does not affect current article slugs", () => {
    expect(isLegacyArticleAllowedInSitemap("2026-07-07-current-story", [])).toBe(true);
  });
});
