// Free-to-use stock image pools per topic bucket (Pexels license: free for
// commercial use, no attribution required). Never uses copyrighted publisher
// photos or political imagery as a generic fallback — that mis-signals the
// story's topic when the article is about food, sports, tech, etc.

export type ImageCategory =
  | "food"
  | "sports"
  | "politics"
  | "business"
  | "finance"
  | "relocation"
  | "weather"
  | "technology"
  | "default";

export const CATEGORY_IMAGE_POOLS: Record<ImageCategory, string[]> = {
  food: [
    "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg",
    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
  ],
  sports: [
    "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg",
    "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg",
  ],
  politics: [
    "https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg",
    "https://images.pexels.com/photos/2872418/pexels-photo-2872418.jpeg",
  ],
  business: [
    "https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg",
    "https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg",
  ],
  finance: [
    "https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg",
    "https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg",
  ],
  relocation: [
    "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
    "https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg",
  ],
  weather: [
    "https://images.pexels.com/photos/1118869/pexels-photo-1118869.jpeg",
    "https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg",
  ],
  technology: [
    "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
    "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
  ],
  default: [
    "https://images.pexels.com/photos/518244/pexels-photo-518244.jpeg",
    "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg",
  ],
};

const KEYWORD_MAP: Record<Exclude<ImageCategory, "default">, string[]> = {
  food: ["bbq", "barbecue", "chicken", "recipe", "grill", "food", "restaurant", "chef", "brisket", "taco"],
  sports: ["game", "team", "score", "nfl", "nba", "mlb", "cowboys", "texans", "astros", "rangers", "spurs", "mavericks", "rockets", "playoff", "coach", "quarterback"],
  politics: ["senate", "congress", "vote", "election", "bill", "governor", "abbott", "paxton", "patrick", "legislature", "capitol", "campaign", "ballot", "primary", "law"],
  business: ["stocks", "market", "economy", "jobs", "company", "revenue", "earnings", "layoffs", "ceo", "investment", "startup"],
  finance: ["tax", "mortgage", "insurance", "budget", "spending", "deficit", "inflation", "wages", "salary", "cost of living", "affordability"],
  relocation: ["move", "moving", "relocate", "relocation", "houston", "dallas", "austin", "san antonio", "fort worth", "suburb", "housing", "home price", "neighborhood"],
  weather: ["storm", "rain", "hurricane", "tornado", "flood", "heat", "freeze", "snow", "drought", "forecast"],
  technology: ["ai", " app ", "software", "iphone", "chip", "tech", "startup", "cyber", "data center", "semiconductor"],
};

// Stable per-slug pick so the same article always shows the same image.
function pickFromPool(key: string, pool: string[]): string {
  if (pool.length === 0) return CATEGORY_IMAGE_POOLS.default[0];
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return pool[h % pool.length];
}

function keywordCategory(text: string): ImageCategory | null {
  const t = ` ${text.toLowerCase()} `;
  for (const [cat, words] of Object.entries(KEYWORD_MAP) as [Exclude<ImageCategory, "default">, string[]][]) {
    if (words.some((w) => t.includes(w))) return cat;
  }
  return null;
}

function normalizeCategory(raw?: string | null): ImageCategory | null {
  if (!raw) return null;
  const c = raw.toLowerCase().trim();
  if (c in CATEGORY_IMAGE_POOLS) return c as ImageCategory;
  // Map site taxonomy -> image bucket.
  if (["politics", "elections", "laws", "legislature", "law"].includes(c)) return "politics";
  if (["business", "economy", "energy"].includes(c)) return "business";
  if (["finance", "tax & spending", "taxes", "money"].includes(c)) return "finance";
  if (["relocation", "move to texas", "housing", "real estate"].includes(c)) return "relocation";
  if (["sports"].includes(c)) return "sports";
  if (["education"].includes(c)) return "politics"; // school policy is politics-adjacent
  if (["non-political"].includes(c)) return "default";
  return null;
}

// Related-category chain used by the dedupe swap. When the primary pool is
// exhausted we fall back to logically related buckets — never to unrelated
// topics (a politics article must never swap to weather/wildlife).
const RELATED_CATEGORIES: Record<ImageCategory, ImageCategory[]> = {
  politics: ["politics"],
  business: ["business", "finance"],
  finance: ["finance", "business"],
  relocation: ["relocation"],
  weather: ["weather"],
  sports: ["sports"],
  technology: ["technology", "business"],
  food: ["food"],
  default: ["default"],
};

export function resolveImageCategory(input: {
  image_category?: string | null;
  category?: string | null;
  title?: string | null;
  dek?: string | null;
  keywords?: string[] | null;
}): ImageCategory {
  const ai = normalizeCategory(input.image_category);
  if (ai) return ai;
  const site = normalizeCategory(input.category);
  if (site) return site;
  const haystack = [input.title, input.dek, (input.keywords ?? []).join(" "), input.category]
    .filter(Boolean)
    .join(" ");
  const kw = keywordCategory(haystack);
  if (kw) return kw;
  return "default";
}

/**
 * Ordered pool of candidate images for a given category, primary bucket
 * first, then related buckets. Never mixes unrelated topics — a politics
 * article will not fall back into weather/wildlife.
 */
export function getCategoryFallbackPool(category: ImageCategory): string[] {
  const chain = RELATED_CATEGORIES[category] ?? [category];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const c of chain) {
    for (const url of CATEGORY_IMAGE_POOLS[c] ?? []) {
      if (!seen.has(url)) {
        seen.add(url);
        out.push(url);
      }
    }
  }
  return out;
}

export type ArticleImageInput = {
  slug: string;
  image_url?: string | null;
  image_category?: string | null; // AI-classified bucket, cached in the CMS
  category?: string | null; // site taxonomy
  title?: string | null;
  dek?: string | null;
  keywords?: string[] | null;
};

/**
 * Single source of truth for article images.
 * Priority:
 *  1. article.image_url (publisher / scraped / hand-set)
 *  2. AI-classified image_category (one Gemini call per ingestion batch)
 *  3. keyword detection on title + dek + keywords + site category
 *  4. default stock pool
 * Deterministic per slug so the image is stable across refreshes.
 */
export function getArticleImage(article: ArticleImageInput): string {
  if (article.image_url && article.image_url.trim()) return article.image_url;

  const aiCat = normalizeCategory(article.image_category);
  if (aiCat) return pickFromPool(article.slug, CATEGORY_IMAGE_POOLS[aiCat]);

  const haystack = [article.title, article.dek, (article.keywords ?? []).join(" "), article.category]
    .filter(Boolean)
    .join(" ");
  const kw = keywordCategory(haystack);
  if (kw) return pickFromPool(article.slug, CATEGORY_IMAGE_POOLS[kw]);

  const siteCat = normalizeCategory(article.category);
  if (siteCat) return pickFromPool(article.slug, CATEGORY_IMAGE_POOLS[siteCat]);

  return pickFromPool(article.slug, CATEGORY_IMAGE_POOLS.default);
}