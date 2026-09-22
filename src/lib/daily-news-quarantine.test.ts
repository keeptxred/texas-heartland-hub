import fs from "node:fs";
import { describe, expect, it } from "vitest";

const dailySource = fs.readFileSync(new URL("./daily-news.functions.ts", import.meta.url), "utf8");
const categorySource = fs.readFileSync(new URL("./category-feed.functions.ts", import.meta.url), "utf8");
const feedLinkMigration = fs.readFileSync(
  new URL("../../supabase/migrations/20260818042500_quarantine_news_feed_article_links.sql", import.meta.url),
  "utf8",
);

describe("public cloud article quarantine", () => {
  it("removes not-ready rows before homepage, newsroom, breaking, and author discovery", () => {
    expect(dailySource).toContain('import { isPublicArticleReady } from "@/lib/public-article-readiness"');
    expect(dailySource).toContain("body_json,quality_flags,content_quality_score");
    expect(dailySource).toContain("isPublicArticleReady(article)");
    expect(dailySource).toContain('import { isKeepTxRedSearchOwnedStory } from "@/lib/ktr-search-ownership"');
    expect(dailySource).toContain("isKeepTxRedSearchOwnedStory({");
  });

  it("removes not-ready rows from shared category and region feeds", () => {
    expect(categorySource).toContain('import { isPublicArticleReady } from "@/lib/public-article-readiness"');
    expect(categorySource).toContain("source_name,source_url");
    expect(categorySource).toContain("body_json,quality_flags,content_quality_score");
    expect(categorySource).toContain("isPublicArticleReady(row)");
    expect(categorySource).toContain('import { isKeepTxRedSearchOwnedStory } from "@/lib/ktr-search-ownership"');
    expect(categorySource).toContain("isKeepTxRedSearchOwnedStory({");
  });

  it("prevents feed cards from linking to quarantined internal articles", () => {
    expect(feedLinkMigration).toContain("UPDATE OF slug, source_url, quality_flags");
    expect(feedLinkMigration).toContain("SET internal_slug = NULL");
    expect(feedLinkMigration).toContain("seo_legacy_single_source");
    expect(feedLinkMigration).toContain("source_integrity_failure");
  });
});
