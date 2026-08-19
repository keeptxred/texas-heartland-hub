import { ARTICLES, type Article } from "@/data/articles";

const RETIRED_CONTENT_CATEGORIES = new Set([
  "relocation",
  "housing",
  "financial",
  "cost-of-living",
  "history",
  "culture",
  "lifestyle",
]);

/**
 * Explicit path list for legacy static pages that should stay accessible but
 * leave Google's index. Category-based retirement is handled from article
 * metadata; this slug list covers pages that need retirement independently of
 * their current metadata.
 *
 * The time-sensitive fixture-news entries below predate the current newsroom
 * sourcing/chronology gate and use stale relative framing such as "ahead of the
 * 2026 primary". They remain reachable for old links but are no longer promoted
 * as current/indexable reporting.
 */
const RETIRED_STATIC_SLUGS = new Set([
  "renting-vs-buying-in-texas",
  "texas-house-down-payment-guide",
  "true-cost-of-owning-a-home-in-texas",
  "should-you-refinance-texas-mortgage",
  "texas-home-equity-heloc-guide",
  "texas-mortgage-payment-guide",
  "texas-closing-costs-guide",
  "texas-utility-costs-guide",
  "texas-homeowners-insurance-guide",
  "salary-needed-to-buy-a-house-in-texas",
  "moving-to-houston-address-checklist",
  "moving-to-dallas-fort-worth-guide",
  "moving-to-san-antonio-guide",
  "moving-to-austin-guide",
  "moving-to-el-paso-guide",
  "moving-to-texas-guide",
  "2026-07-06-rangers-texas-rangers-prospect-guide-the-next-stars-of-arlington",
  "property-tax-relief-package",
  "operation-lone-star",
  "voter-id-surge",
  "school-board-elections",
  "speaker-special-session",
  "isd-tax-burdens",
  "permian-energy",
]);

export function isStaticArticleIndexable(article: Pick<Article, "slug" | "pillar" | "contentCategory">): boolean {
  if (article.slug.startsWith("live-")) return false;
  if (RETIRED_STATIC_SLUGS.has(article.slug)) return false;
  if (article.contentCategory && RETIRED_CONTENT_CATEGORIES.has(article.contentCategory)) return false;
  return true;
}

export function isRetiredStaticNewsPath(path: string): boolean {
  const match = path.match(/^\/news\/([^/?#]+)$/);
  if (!match) return false;
  const slug = decodeURIComponent(match[1]);
  const article = ARTICLES.find((candidate) => candidate.slug === slug);
  if (article) return !isStaticArticleIndexable(article);
  return slug.startsWith("live-") || RETIRED_STATIC_SLUGS.has(slug);
}
