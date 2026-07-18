// Client-side topical filters shared by category pages
// (Texas News, Texas Business, Houston, Texas Politics).
//
// Uses Article.topics / Article.subcategory when present, otherwise falls
// back to keyword matching on slug + title + dek so we can filter the
// existing static catalog without rewriting each article.

import { ARTICLES, isPublished, sortByDateDesc, type Article } from "@/data/articles";

const TOPIC_KEYWORDS: Record<string, string[]> = {
  // Texas News
  economy: ["economy", "income-tax", "energy-economy", "jobs", "wage"],
  housing: ["property-tax", "homestead", "appraisal", "housing", "isd"],
  migration: ["moving", "relocation", "growth", "migration", "border"],
  culture: ["culture", "carry", "water-rights", "open-meetings", "constitutional", "terminology"],
  education: ["school", "isd", "education", "esa"],
  "sports-culture": ["sport", "team", "friday-night"],
  // Texas Business
  energy: ["energy", "grid", "ercot", "permian", "oil", "wind", "gas"],
  jobs: ["job", "income-tax", "economy", "workforce"],
  relocations: ["moving", "relocation", "income-tax", "growth"],
  "real-estate": ["property-tax", "appraisal", "homestead", "housing", "isd", "county"],
  policy: ["policy", "governor", "legislature", "local-government", "regulation"],
  // Politics
  elections: ["election", "voting", "ballot", "primary", "voter", "candidate", "runoff"],
  legislature: ["legislature", "bill", "session", "law", "amendment", "rotunda"],
  "governor-leadership": ["governor", "attorney-general", "lt-governor", "leadership", "statewide"],
  "voting-policy": ["voter", "voting", "register", "ballot", "voter-id"],
  // Houston
  "property-taxes": ["property-tax", "appraisal", "homestead", "isd"],
  schools: ["school", "isd", "education", "esa"],
  growth: ["moving", "relocation", "growth", "migration"],
  border: ["border", "trooper", "immigration", "rio-grande"],
};

/** Returns true when the article matches the given topic id. */
export function matchesTopic(a: Article, topic: string): boolean {
  const t = topic.toLowerCase();
  if (a.topics?.some((x) => x.toLowerCase() === t)) return true;
  if (a.subcategory?.toLowerCase() === t) return true;
  const kws = TOPIC_KEYWORDS[t];
  if (!kws) return false;
  const hay = `${a.slug} ${a.title} ${a.dek}`.toLowerCase();
  return kws.some((k) => hay.includes(k));
}

/** Filter a list of articles by a category/topic id. */
export function filterArticlesByCategory(
  articles: Article[],
  topic?: string | null,
): Article[] {
  const list = articles.filter((a) => isPublished(a));
  const scoped = topic ? list.filter((a) => matchesTopic(a, topic)) : list;
  return scoped.slice().sort(sortByDateDesc);
}

/** Alias for finer-grained tags — same matcher for now. */
export function filterArticlesBySubcategory(
  articles: Article[],
  sub?: string | null,
): Article[] {
  return filterArticlesByCategory(articles, sub);
}

/** Related articles for a given slug, optionally within a topic. */
export function getRelatedArticles(
  slug: string,
  topic?: string | null,
  limit = 3,
): Article[] {
  const base = ARTICLES.filter((a) => isPublished(a)).filter((a) => a.slug !== slug);
  const scoped = topic ? base.filter((a) => matchesTopic(a, topic)) : base;
  return scoped.slice().sort(sortByDateDesc).slice(0, limit);
}