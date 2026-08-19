import { describe, expect, it } from "vitest";
import { getArticlesByCategory } from "@/lib/articles-by-category";

describe("static category discovery indexability", () => {
  it("does not re-promote retired stale election fixtures", () => {
    const slugs = new Set(getArticlesByCategory("elections").map((article) => article.slug));

    for (const retired of [
      "voter-id-surge",
      "school-board-elections",
      "speaker-special-session",
    ]) {
      expect(slugs.has(retired), retired).toBe(false);
    }
  });

  it("still returns indexable election coverage", () => {
    const articles = getArticlesByCategory("elections");
    expect(articles.length).toBeGreaterThan(0);
    expect(articles.every((article) => article.category === "Elections")).toBe(true);
  });
});
