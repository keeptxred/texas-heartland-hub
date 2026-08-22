import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(new URL("./happening-now.tsx", import.meta.url), "utf8");
const categoryFeed = fs.readFileSync(new URL("../lib/category-feed.functions.ts", import.meta.url), "utf8");

describe("Happening Now rolling newsroom", () => {
  it("loads published Keep TX Red articles directly with the shared public readiness gates", () => {
    expect(source).toContain('import { isPublicArticleReady, type PublicArticleCandidate } from "@/lib/public-article-readiness"');
    expect(source).toContain('import { meetsArticleMainWordCount } from "@/lib/article-length"');
    expect(source).toContain('.from("daily_articles")');
    expect(source).toContain("content_quality_score,body_json,quality_flags");
    expect(source).toContain("isPublicArticleReady(article)");
    expect(source).toContain("meetsArticleMainWordCount(article.kind, article.body_json as never)");
  });

  it("is newest-first and bounded so new stories automatically displace older stories", () => {
    expect(source).toContain('const MAX_VISIBLE_STORIES = 24;');
    expect(source).toContain('.order("published_at", { ascending: false })');
    expect(source).toContain('.slice(0, MAX_VISIBLE_STORIES)');
    expect(source).toContain('window.setInterval(() => void load(), REFRESH_MS)');
  });

  it("keeps aged-off stories in daily_articles so category feeds continue to own their permanent placement", () => {
    expect(source).not.toContain('.delete()');
    expect(source).not.toContain('.update({ category:');
    expect(categoryFeed).toContain('supabase.from("daily_articles").select(SELECT_COLS)');
    expect(categoryFeed).toContain('if (data.category) q = q.eq("category", data.category);');
    expect(categoryFeed).toContain("isPublicArticleReady(row)");
  });
});
