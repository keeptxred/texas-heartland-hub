import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(new URL("./happening-now.tsx", import.meta.url), "utf8");
const daily = fs.readFileSync(new URL("../lib/daily-news.functions.ts", import.meta.url), "utf8");
const categoryFeed = fs.readFileSync(new URL("../lib/category-feed.functions.ts", import.meta.url), "utf8");

describe("Happening Now rolling newsroom", () => {
  it("server renders only the shared current public-readiness-gated reports", () => {
    expect(source).toContain("loader: async () => currentReports((await getDailyArticles()).articles)");
    expect(source).toContain("Route.useLoaderData()");
    expect(source).toContain("articles.filter(isNewsroomReport)");
    expect(daily).toContain('.from("daily_articles")');
    expect(daily).toContain("isPublicArticleReady(article)");
    expect(daily).toContain("isKeepTxRedSearchOwnedStory({");
    expect(daily).toContain("meetsArticleMainWordCount(article.kind, article.body_json as never)");
    expect(daily).toContain("isCurrentNewsCandidate(article)");
    expect(daily).toContain("loadPublishedDailyArticles(80, true)");
  });

  it("is newest-first and bounded so new stories automatically displace older stories", () => {
    expect(source).toContain('const MAX_VISIBLE_STORIES = 24;');
    expect(daily).toContain('.order("published_at", { ascending: false })');
    expect(source).toContain('.slice(0, MAX_VISIBLE_STORIES)');
    expect(source).toContain('window.setInterval(() => void load(), REFRESH_MS)');
  });

  it("keeps aged-off stories in daily_articles so category feeds continue to own their permanent placement", () => {
    expect(source).not.toContain('.delete()');
    expect(source).not.toContain('.update({ category:');
    expect(categoryFeed).toContain('supabase.from("daily_articles").select(SELECT_COLS)');
    expect(categoryFeed).toContain('if (data.category) q = q.eq("category", data.category);');
    expect(categoryFeed).toContain("isPublicArticleReady(row)");
    expect(categoryFeed).toContain("isKeepTxRedSearchOwnedStory({");
  });
});
