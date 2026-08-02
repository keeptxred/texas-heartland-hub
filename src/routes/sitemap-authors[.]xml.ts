import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, renderUrlset, xmlResponse, toIsoDate, type UrlEntry } from "@/lib/sitemap-shared";
import { AUTHORS, authorSlug, type Author } from "@/data/authors";
import { ARTICLES, isPublished } from "@/data/articles";

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

function authorLastModified(author: Author): string {
  const latestArticleDate = ARTICLES.filter(
    (article) => isPublished(article) && authorSlug(article.author) === author.slug,
  )
    .map((article) => article.publishedAt)
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

  return toIsoDate(latestArticleDate ?? "2026-07-01T00:00:00.000Z");
}

export const Route = createFileRoute("/sitemap-authors.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: UrlEntry[] = AUTHORS.filter(isCompleteAuthor).map((author) => ({
          loc: `${BASE_URL}/authors/${author.slug}`,
          lastmod: authorLastModified(author),
        }));
        return xmlResponse(renderUrlset(entries));
      },
    },
  },
});