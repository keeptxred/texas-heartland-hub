import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, renderUrlset, xmlResponse, toIsoDate, type UrlEntry } from "@/lib/sitemap-shared";
import { AUTHORS, authorSlug, type Author } from "@/data/authors";
import { ARTICLES, isPublished } from "@/data/articles";
import { getDailyArticles, type DailyArticle } from "@/lib/daily-news.functions";

function isCompleteAuthor(author: Author): boolean {
  const biography = author.bio.join(" ").trim();
  return Boolean(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(author.slug) &&
      author.name.trim().length >= 3 &&
      author.role.trim().length >= 3 &&
      biography.length >= 100 &&
      author.beats.length > 0 &&
      author.beats.every((beat) => beat.trim().length >= 3),
  );
}

function authorArticleDates(author: Author, liveArticles: DailyArticle[]): string[] {
  return [
    ...ARTICLES.filter(
      (article) => isPublished(article) && authorSlug(article.author) === author.slug,
    )
      .map((article) => article.publishedAt)
      .filter((value): value is string => Boolean(value)),
    ...liveArticles
      .filter((article) => article.slug && authorSlug(article.author) === author.slug)
      .map((article) => article.published_at)
      .filter(Boolean),
  ];
}

function activeAuthorEntry(author: Author, liveArticles: DailyArticle[]): UrlEntry | null {
  if (!isCompleteAuthor(author)) return null;
  const dates = authorArticleDates(author, liveArticles);
  if (dates.length === 0) return null;

  const latestArticleDate = dates
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

  return {
    loc: `${BASE_URL}/authors/${author.slug}`,
    lastmod: toIsoDate(latestArticleDate),
  };
}

export const Route = createFileRoute("/sitemap-authors.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { articles: liveArticles } = await getDailyArticles();
        const entries = AUTHORS
          .map((author) => activeAuthorEntry(author, liveArticles))
          .filter((entry): entry is UrlEntry => entry !== null);
        return xmlResponse(renderUrlset(entries));
      },
    },
  },
});
