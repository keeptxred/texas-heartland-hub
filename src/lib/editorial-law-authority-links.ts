import { ARTICLES, isPublished, type Article } from "@/data/articles";
import { getLawTopic } from "@/data/law-topics";
import { isLawTopicIndexable } from "@/lib/law-topic-indexability";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

/** Curated mappings for editorial explanations that have an unambiguous statutory parent. */
export const ARTICLE_LAW_AUTHORITY_BY_SLUG: Readonly<Record<string, string>> = {
  "texas-gun-laws-explained": "gun-carry-law",
  "constitutional-carry-one-year-later": "gun-carry-law",
  "texas-property-tax-laws-explained": "property-tax-law",
  "texas-property-tax-guide": "property-tax-law",
  "property-tax-relief-package": "property-tax-law",
  "texas-election-laws-explained": "election-law",
  "texas-voter-registration-guide": "election-law",
  "texas-open-meetings-public-info": "open-records-public-information",
  "texas-school-board-powers": "parental-rights-education-law",
};

/** Future articles inherit a topical legal parent when explicitly tagged. */
export const TOPIC_LAW_AUTHORITY_BY_TAG: Readonly<Record<string, string>> = {
  "property-tax": "property-tax-law",
  "property-taxes": "property-tax-law",
  "gun-laws": "gun-carry-law",
  "firearms": "gun-carry-law",
  "voting-laws": "election-law",
  "election-law": "election-law",
  "public-information": "open-records-public-information",
  "open-records": "open-records-public-information",
  "school-law": "parental-rights-education-law",
  "landlord-tenant": "landlord-tenant-rentals-law",
  "employment-law": "employment-wages-workplace-rights-law",
  "consumer-law": "consumer-protection-deceptive-trade-law",
  "family-law": "family-custody-child-support-law",
  "probate-law": "wills-probate-inheritance-law",
  "criminal-law": "criminal-offenses-penalties-law",
  "business-formation": "business-formation-llc-law",
};

export function lawAuthorityForArticle(article: Article) {
  const exact = ARTICLE_LAW_AUTHORITY_BY_SLUG[article.slug];
  const tagged = article.topics?.map((tag) => TOPIC_LAW_AUTHORITY_BY_TAG[tag]).find(Boolean);
  const authority = getLawTopic(exact ?? tagged ?? "");
  return isLawTopicIndexable(authority) ? authority : null;
}

export function shouldShowEditorialLawLibrary(article: Article) {
  return Boolean(lawAuthorityForArticle(article)) ||
    article.topics?.includes("laws") === true ||
    article.subcategory === "laws" ||
    article.contentCategory === "laws" ||
    ["how-a-bill-becomes-texas-law", "texas-new-laws-2026"].includes(article.slug);
}

/**
 * Only already-published, indexable editorial stories with a verified and
 * unambiguous legal-topic mapping receive backlinks from statutory authorities.
 */
export function publicEditorialArticlesForLawTopic(slug: string) {
  const topic = getLawTopic(slug);
  if (!isLawTopicIndexable(topic)) return [];
  return ARTICLES.filter((article) =>
    isPublished(article) &&
    isStaticArticleIndexable(article) &&
    lawAuthorityForArticle(article)?.slug === slug,
  )
    .slice(0, 6)
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      dek: article.dek,
      href: `/news/${article.slug}`,
    }));
}
