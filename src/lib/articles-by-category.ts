import { ARTICLES, isPublished, sortByDateDesc, type Article } from "@/data/articles";

/**
 * Canonical mapping from URL category slug to the display `category` field
 * stored on articles. ALL category pages must use this map so a page can
 * never accidentally surface articles from another category.
 */
export const CATEGORY_SLUG_TO_NAME = {
  legislature: "Legislature",
  border: "Border",
  elections: "Elections",
  "tax-spending": "Tax & Spending",
  energy: "Energy",
  education: "Education",
  "non-political": "Non-Political",
} as const;

export type CategorySlug = keyof typeof CATEGORY_SLUG_TO_NAME;
export type CategoryName = (typeof CATEGORY_SLUG_TO_NAME)[CategorySlug];

export const CATEGORY_NAME_TO_SLUG: Record<CategoryName, CategorySlug> = Object.fromEntries(
  Object.entries(CATEGORY_SLUG_TO_NAME).map(([slug, name]) => [name, slug]),
) as Record<CategoryName, CategorySlug>;

export function isCategorySlug(value: string): value is CategorySlug {
  return Object.prototype.hasOwnProperty.call(CATEGORY_SLUG_TO_NAME, value);
}

/**
 * Shared category filter. Every category/topic page MUST go through this
 * function so an article only appears on the page whose category_slug
 * exactly matches its own category. Returns published articles, newest first.
 */
export function getArticlesByCategory(categorySlug: string): Article[] {
  if (!isCategorySlug(categorySlug)) return [];
  const name = CATEGORY_SLUG_TO_NAME[categorySlug];
  return ARTICLES
    .filter((a) => a.category === name && isPublished(a))
    .sort(sortByDateDesc);
}

/**
 * Same contract, applied to any list of items that carry a `category`
 * display name (e.g. rows from `daily_articles`). Exact-match only.
 */
export function filterByCategorySlug<T extends { category: string }>(
  items: readonly T[],
  categorySlug: string,
): T[] {
  if (!isCategorySlug(categorySlug)) return [];
  const name = CATEGORY_SLUG_TO_NAME[categorySlug];
  return items.filter((i) => i.category === name);
}