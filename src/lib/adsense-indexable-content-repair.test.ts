import fs from "node:fs";
import { describe, expect, it } from "vitest";

const migration = fs.readFileSync(
  new URL("../../supabase/migrations/20260818053000_strengthen_indexable_sports_articles.sql", import.meta.url),
  "utf8",
);

describe("AdSense indexable sports content repairs", () => {
  it("uses the scoped article-maintenance contract", () => {
    expect(migration).toMatch(/^-- BULK_ARTICLE_MAINTENANCE/m);
  });

  it("replaces the cross-country weak dek with useful Texas-specific context", () => {
    expect(migration).toContain("2026-08-18-texas-colleges-announce-2026-cross-country-schedules");
    expect(migration).toContain("Baylor, Houston, North Texas and Texas A&M released 2026 cross country schedules");
    expect(migration).toContain("array_remove(coalesce(article.quality_flags, ARRAY[]::text[]), 'weak_dek')");
  });

  it("adds concrete key takeaways and Why This Matters to the Ray Guy article", () => {
    expect(migration).toContain("2026-08-17-texas-college-football-players-named-to-2026-ray-guy-award-watch-list");
    expect(migration).toContain("Palmer Williams of Baylor, Tyler White of Texas A&M and John Hoyet Chance of TCU");
    expect(migration).toContain("'heading', 'Why This Matters'");
    expect(migration).toContain("array_remove(coalesce(article.quality_flags, ARRAY[]::text[]), 'missing_why_this_matters')");
  });

  it("does not alter stored quality scores to manufacture readiness", () => {
    expect(migration).not.toContain("content_quality_score");
  });
});
