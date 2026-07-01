// Neutral, free-to-use stock image fallbacks (Pexels license: free for
// commercial use, no attribution required). Used when an article has no
// image_url, no scraped og:image, and no CATEGORY_IMAGES match. Never use a
// political image (e.g. the Texas Capitol) as a generic fallback — that
// mis-signals the story's topic when the article is about food, sports, tech,
// etc.
export const STOCK_FALLBACK_POOL: string[] = [
  "https://images.pexels.com/photos/518244/pexels-photo-518244.jpeg",
  "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg",
  "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg",
  "https://images.pexels.com/photos/21014/pexels-photo.jpg",
];

// Stable per-slug pick so the same article always shows the same fallback
// across refreshes. Falls back to the first image on empty input.
export function pickFallbackImage(key?: string | null): string {
  const k = (key || "").trim();
  if (!k) return STOCK_FALLBACK_POOL[0];
  let h = 0;
  for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) >>> 0;
  return STOCK_FALLBACK_POOL[h % STOCK_FALLBACK_POOL.length];
}