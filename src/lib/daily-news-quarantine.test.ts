import fs from "node:fs";
import { describe, expect, it } from "vitest";

const dailySource = fs.readFileSync(new URL("./daily-news.functions.ts", import.meta.url), "utf8");
const categorySource = fs.readFileSync(new URL("./category-feed.functions.ts", import.meta.url), "utf8");
const sportsSource = fs.readFileSync(new URL("./sports.functions.ts", import.meta.url), "utf8");
const feedLinkMigration = fs.readFileSync(
  new URL("../../supabase/migrations/20260818042500_quarantine_news_feed_article_links.sql", import.meta.url),
  "utf8",
);

describe("public cloud article quarantine", () => {
  it("removes not-ready rows before homepage, newsroom, breaking, and author discovery", () => {
    expect(dailySource).toContain('import { isPublicArticleReady } from "@/lib/public-article-readiness"');
    expect(dailySource).toContain("body_json,quality_flags,content_quality_score");
    expect(dailySource).toContain("isPublicArticleReady(article)");
    expect(dailySource).toContain("quality_flags: _qualityFlags");
    expect(dailySource).toContain("content_quality_score: _qualityScore");
  });

  it("removes quarantined rows from shared category and region feeds", () => {
    expect(categorySource).toContain('import { hasSeoDuplicateFlag } from "@/lib/article-canonical"');
    expect(categorySource).toContain("body_json,quality_flags");
    expect(categorySource).toContain("!hasSeoDuplicateFlag(row.quality_flags)");
    expect(categorySource).toContain("quality_flags: _qualityFlags");
  });

  it("removes quarantined rows from the direct sports team query", () => {
    expect(sportsSource).toContain('import { hasSeoDuplicateFlag } from "@/lib/article-canonical"');
    expect(sportsSource).toContain("body_json,quality_flags");
    expect(sportsSource).toContain("!hasSeoDuplicateFlag(row.quality_flags)");
    expect(sportsSource).toContain("quality_flags: _qualityFlags");
  });

  it("prevents feed cards from linking to quarantined internal articles", () => {
    expect(feedLinkMigration).toContain("UPDATE OF slug, source_url, quality_flags");
    expect(feedLinkMigration).toContain("SET internal_slug = NULL");
    expect(feedLinkMigration).toContain("seo_legacy_single_source");
    expect(feedLinkMigration).toContain("source_integrity_failure");
    expect(feedLinkMigration).toContain("NOT (");
  });
});
