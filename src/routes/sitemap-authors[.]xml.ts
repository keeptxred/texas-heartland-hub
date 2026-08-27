import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, renderUrlset, xmlResponse, toIsoDate, type UrlEntry } from "@/lib/sitemap-shared";
import { AUTHORS, authorSlug, type Author } from "@/data/authors";
import { ARTICLES, isPublished } from "@/data/articles";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { getPublishedAuthorArticles, type DailyArticle } from "@/lib/daily-news.functions";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";
import { hasEnoughAuthorArticles, isCompleteAuthorProfile } from "@/lib/author-indexability";

type AuthorArticleRecord = { slug: string; publishedAt: string };

function authorArticleRecords(author: Author, liveArticles: DailyArticle[]): AuthorArticleRecord[] {
  const records = new Map<string, string>();

  for (const article of ARTICLES) {
    if (
      isPublished(article)
      && isStaticArticleIndexable(article)
      && Boolean(ARTICLE_BODIES[article.slug])
      && authorSlug(article.author) === author.slug
      && article.publishedAt
    ) {
      records.set(article.slug, article.publishedAt);
    }
  }

  for (const article of liveArticles) {
    if (article.slug && authorSlug(article.author) === author.slug && article.published_at) {
      const existing = records.get(article.slug);
      if (!existing || Date.parse(article.published_at) > Date.parse(existing)) {
        records.set(article.slug, article.published_at);
      }
    }
  }

  return Array.from(records, ([slug, publishedAt]) => ({ slug, publishedAt }));
}

function activeAuthorEntry(author: Author, liveArticles: DailyArticle[]): UrlEntry | null {
  if (!isCompleteAuthorProfile(author)) return null;
  const records = authorArticleRecords(author, liveArticles);
  if (!hasEnoughAuthorArticles(records.map((record) => record.slug))) return null;

  const latestArticleDate = records
    .map((record) => record.publishedAt)
    .sort((a, b) => Date.parse(b) - Date.parse(a))[0];

  return {
    loc: `${BASE_URL}/authors/${author.slug}`,
    lastmod: toIsoDate(latestArticleDate),
  };
}

export const Route = createFileRoute("/sitemap-authors.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { articles: liveArticles } = await getPublishedAuthorArticles();
        const entries = AUTHORS
          .map((author) => activeAuthorEntry(author, liveArticles))
          .filter((entry): entry is UrlEntry => entry !== null);
        return xmlResponse(renderUrlset(entries));
      },
    },
  },
});
