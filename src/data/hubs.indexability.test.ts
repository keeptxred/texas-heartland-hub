import { describe, expect, it } from "vitest";
import { HUBS } from "@/data/hubs";
import { ARTICLES } from "@/data/articles";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

describe("hub article inventory", () => {
  it("contains no retired static article slugs", () => {
    const articleBySlug = new Map(ARTICLES.map((article) => [article.slug, article]));

    for (const hub of HUBS) {
      for (const slug of hub.articleSlugs) {
        const article = articleBySlug.get(slug);
        expect(article, `${hub.slug}: missing article ${slug}`).toBeTruthy();
        expect(isStaticArticleIndexable(article!), `${hub.slug}: retired article ${slug}`).toBe(true);
      }
    }
  });
});
