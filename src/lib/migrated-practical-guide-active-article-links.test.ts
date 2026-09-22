import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { ARTICLES } from "@/data/articles";
import { MIGRATED_PRACTICAL_GUIDE_CANONICALS } from "@/lib/migrated-practical-guide-canonical";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

function stringsIn(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(stringsIn);
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(stringsIn);
  }
  return [];
}

function internalMarkdownLinks(value: string): string[] {
  return Array.from(value.matchAll(/\]\((\/[^)]+)\)/g), (match) => match[1]);
}

const migratedPaths = new Set(Object.keys(MIGRATED_PRACTICAL_GUIDE_CANONICALS));
const migratedStaticSlugs = new Set(
  Array.from(migratedPaths)
    .filter((path) => path.startsWith("/news/"))
    .map((path) => path.slice("/news/".length)),
);

describe("migrated TexasDefined practical-guide ownership in active static articles", () => {
  it("keeps every migrated practical-guide static article non-indexable", () => {
    for (const slug of migratedStaticSlugs) {
      const article = ARTICLES.find((candidate) => candidate.slug === slug);
      if (!article) continue;
      expect(
        isStaticArticleIndexable(article),
        `Migrated practical guide ${slug} must never regain KTR indexability`,
      ).toBe(false);
    }
  });

  it("keeps every indexable KTR article source free of legacy practical-guide links", () => {
    const violations: string[] = [];

    for (const article of ARTICLES) {
      if (!isStaticArticleIndexable(article)) continue;
      const body = ARTICLE_BODIES[article.slug];
      if (!body) continue;

      const related = (body as { related?: string[] }).related ?? [];
      for (const relatedSlug of related) {
        if (migratedStaticSlugs.has(relatedSlug)) {
          violations.push(`${article.slug}: related article ${relatedSlug}`);
        }
      }

      for (const value of stringsIn(body)) {
        if (migratedPaths.has(value)) {
          violations.push(`${article.slug}: raw internal link ${value}`);
        }

        for (const href of internalMarkdownLinks(value)) {
          if (migratedPaths.has(href)) {
            violations.push(`${article.slug}: markdown link ${href}`);
          }
        }
      }
    }

    expect(
      violations,
      `Indexable KTR articles must link directly to TexasDefined for migrated practical guides. Legacy routes: ${Array.from(migratedPaths).join(", ")}`,
    ).toEqual([]);
  });
});
