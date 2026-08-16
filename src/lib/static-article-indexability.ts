import type { Article } from "@/data/articles";

const RETIRED_CONTENT_CATEGORIES = new Set([
  "relocation",
  "housing",
  "financial",
  "cost-of-living",
  "lifestyle",
]);

/**
 * Explicit path list for legacy static pages that should stay accessible but
 * leave Google's index. Keep this synchronized with RETIRED_CONTENT_CATEGORIES;
 * the regression test scans the full ARTICLES registry so a newly retired
 * static article cannot be omitted from page-level robots handling.
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
]);

/**
 * Static articles predate the current newsroom quality gate. Topical fit takes
 * precedence over the old `pillar` flag: several relocation/home-finance pages
 * were historically marked pillar but no longer belong in Keep TX Red's
 * politics, government, law, elections and public-policy search footprint.
 */
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
  return slug.startsWith("live-") || RETIRED_STATIC_SLUGS.has(slug);
}
