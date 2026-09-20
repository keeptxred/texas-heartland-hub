import type { Author } from "@/data/authors";

export const MIN_AUTHOR_ARTICLES_FOR_INDEXING = 3;

export function isCompleteAuthorProfile(author: Author | null | undefined): author is Author {
  if (!author) return false;
  const biography = author.bio.join(" ").trim();
  return Boolean(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(author.slug)
      && author.name.trim().length >= 3
      && author.role.trim().length >= 3
      && biography.length >= 100
      && author.beats.length > 0
      && author.beats.every((beat) => beat.trim().length >= 3),
  );
}

export function hasEnoughAuthorArticles(slugs: Iterable<string>): boolean {
  return new Set(Array.from(slugs).filter(Boolean)).size >= MIN_AUTHOR_ARTICLES_FOR_INDEXING;
}
