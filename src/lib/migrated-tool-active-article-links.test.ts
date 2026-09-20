import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { ARTICLES } from "@/data/articles";
import {
  MIGRATED_TOOL_CANONICALS,
  canonicalMigratedToolHref,
} from "@/lib/migrated-tool-canonical";
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

describe("migrated TexasDefined tool ownership in active static articles", () => {
  it("keeps every indexable KTR article source free of legacy migrated-tool links", () => {
    const violations: string[] = [];

    for (const article of ARTICLES) {
      if (!isStaticArticleIndexable(article)) continue;
      const body = ARTICLE_BODIES[article.slug];
      if (!body) continue;

      for (const value of stringsIn(body)) {
        if (value.startsWith("/") && canonicalMigratedToolHref(value) !== value) {
          violations.push(`${article.slug}: raw internal link ${value}`);
        }

        for (const href of internalMarkdownLinks(value)) {
          if (canonicalMigratedToolHref(href) !== href) {
            violations.push(`${article.slug}: markdown link ${href}`);
          }
        }
      }
    }

    expect(
      violations,
      `Indexable KTR articles must link directly to TexasDefined for migrated tools. Legacy routes: ${Object.keys(MIGRATED_TOOL_CANONICALS).join(", ")}`,
    ).toEqual([]);
  });
});
