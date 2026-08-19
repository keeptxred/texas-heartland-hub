import { ARTICLES, isPublished, sortByDateDesc, type Article } from "@/data/articles";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

/**
 * Canonical mapping from URL category slug to the display `category` field
 * stored on articles. ALL category pages must use this map so a page can
 * never accidentally surface articles from another category.
 */
export const CATEGORY_SLUG_TO_NAME = {
  politics: "Politics",
  legislature: "Legislature",
  government: "Government",
  "local-government": "Local Government",
  laws: "Laws",
  border: "Border",
  elections: "Elections",
  "tax-spending": "Tax & Spending",
  energy: "Energy",
  education: "Education",
  business: "Business",
  sports: "Sports",
  "non-political": "Non-Political",
  economy: "Economy",
  housing: "Housing",
  migration: "Growth & Migration",
  culture: "Culture & Identity",
  "sports-culture": "Sports Culture",
} as const;

export type CategorySlug = keyof typeof CATEGORY_SLUG_TO_NAME;
export type CategoryName = (typeof CATEGORY_SLUG_TO_NAME)[CategorySlug];

export const CATEGORY_NAME_TO_SLUG: Record<CategoryName, CategorySlug> = Object.fromEntries(
  Object.entries(CATEGORY_SLUG_TO_NAME).map(([slug, name]) => [name, slug]),
) as Record<CategoryName, CategorySlug>;

const CATEGORY_NAMES = new Set<string>(Object.values(CATEGORY_SLUG_TO_NAME));

export function isCategorySlug(value: string): value is CategorySlug {
  return Object.prototype.hasOwnProperty.call(CATEGORY_SLUG_TO_NAME, value);
}

export function normalizeCategoryName(value: string | null | undefined): CategoryName {
  const normalized = value?.trim() ?? "";
  return CATEGORY_NAMES.has(normalized) ? (normalized as CategoryName) : "Non-Political";
}

/**
 * Shared static category discovery filter. Category pages, Election Central,
 * and any other static-article surface must not re-promote a legacy article
 * that the site's robots/sitemap policy has deliberately retired.
 */
export function getArticlesByCategory(categorySlug: string): Article[] {
  if (!isCategorySlug(categorySlug)) return [];
  const name = CATEGORY_SLUG_TO_NAME[categorySlug];
  return ARTICLES
    .filter((article) =>
      article.category === name
      && isPublished(article)
      && isStaticArticleIndexable(article),
    )
    .sort(sortByDateDesc);
}

/**
 * Same exact-category contract for caller-supplied lists such as cloud rows.
 * Cloud/article readiness is applied by those loaders before this helper.
 */
export function filterByCategorySlug<T extends { category: string }>(
  items: readonly T[],
  categorySlug: string,
): T[] {
  if (!isCategorySlug(categorySlug)) return [];
  const name = CATEGORY_SLUG_TO_NAME[categorySlug];
  return items.filter((item) => item.category === name);
}
