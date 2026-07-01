// Content-optimization layer that runs BEFORE image selection and rendering.
// - Chooses the best display headline (AI-rewritten SEO headline > original)
// - Detects a Google Discover-style category from headline + dek
// - Feeds that category into the existing image system without changing it
//
// No AI calls happen in this file. Batch AI rewriting is done once per
// ingestion batch by the server hook and cached in daily_articles.seo_headline.

import { getArticleImage, type ArticleImageInput } from "@/lib/fallback-images";

export type DiscoverCategory =
  | "food"
  | "sports"
  | "politics"
  | "business"
  | "weather"
  | "technology"
  | "other";

const DISCOVER_KEYWORDS: Record<Exclude<DiscoverCategory, "other">, string[]> = {
  food: ["bbq", "barbecue", "recipe", "chef", "restaurant", "brisket", "taco", "grill", "kitchen", "cooking"],
  sports: ["nfl", "nba", "mlb", "cowboys", "texans", "astros", "rangers", "spurs", "mavericks", "rockets", "playoff", "coach", "quarterback", "game", "score", "team"],
  politics: ["senate", "congress", "vote", "election", "bill", "governor", "abbott", "paxton", "patrick", "legislature", "capitol", "campaign", "ballot", "primary", "law", "policy"],
  business: ["economy", "market", "stocks", "jobs", "company", "revenue", "earnings", "layoffs", "ceo", "investment", "startup", "tax", "energy", "oil"],
  weather: ["storm", "rain", "hurricane", "tornado", "flood", "heat", "freeze", "snow", "drought", "forecast"],
  technology: ["ai", "software", "iphone", "chip", "cyber", "data center", "semiconductor", "app", "tech"],
};

/**
 * Lightweight keyword detection over the SEO headline (preferred) or title.
 * Returns "other" when nothing matches so callers can fall back safely.
 */
export function detectDiscoverCategory(text: string | null | undefined): DiscoverCategory {
  const t = ` ${(text ?? "").toLowerCase()} `;
  if (!t.trim()) return "other";
  for (const [cat, words] of Object.entries(DISCOVER_KEYWORDS) as [Exclude<DiscoverCategory, "other">, string[]][]) {
    if (words.some((w) => t.includes(w))) return cat;
  }
  return "other";
}

export type ArticleLike = {
  slug: string;
  title: string;
  dek?: string | null;
  seo_headline?: string | null;
  discover_category?: string | null;
  image_url?: string | null;
  image_category?: string | null;
  category?: string | null;
  keywords?: string[] | null;
  seo_keywords?: string[] | null;
};

/**
 * Google Discover-facing headline. Prefers the AI-rewritten seo_headline
 * (cached in the DB) and falls back to the original title.
 */
export function getDisplayTitle(article: ArticleLike): string {
  const s = (article.seo_headline ?? "").trim();
  return s.length > 0 ? s : article.title;
}

/**
 * Image input builder: enriches the article payload with discover_category so
 * getArticleImage() picks the correct stock pool without any code change to
 * the image system itself.
 */
export function toImageInput(article: ArticleLike): ArticleImageInput {
  const headline = getDisplayTitle(article);
  const discover =
    (article.discover_category ?? "").trim() ||
    detectDiscoverCategory(`${headline} ${article.dek ?? ""}`);
  // Only forward mappable buckets; getArticleImage normalizes them.
  const bucket = discover === "other" ? null : discover;
  return {
    slug: article.slug,
    image_url: article.image_url,
    // AI-cached bucket wins; discover_category is used as a secondary hint.
    image_category: article.image_category ?? bucket,
    category: article.category,
    title: headline,
    dek: article.dek,
    keywords: article.seo_keywords ?? article.keywords ?? null,
  };
}

/**
 * Convenience: same output as getArticleImage(toImageInput(article)).
 */
export function resolveArticleImage(article: ArticleLike): string {
  return getArticleImage(toImageInput(article));
}