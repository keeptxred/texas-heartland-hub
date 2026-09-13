// Preserve article-image relevance ahead of visual variety.
//
// This helper still assigns deterministic fallback images when an item has no
// image at all, but it MUST NOT replace an editorially selected/canonical image
// merely because the same image already appears elsewhere on the page. Two
// related stories can legitimately share one exact storm graphic, venue photo,
// court exhibit, or other primary-subject image. Replacing the second instance
// with generic category stock creates a more serious editorial error than the
// duplicate itself.

import {
  CATEGORY_IMAGE_POOLS,
  getCategoryFallbackPool,
  resolveImageCategory,
  type ImageCategory,
} from "@/lib/fallback-images";

// Kept exported for backward compat, but no longer used as a general swap
// pool — flattening every bucket allowed unrelated categories (e.g. weather /
// wildlife) to be assigned to politics cards. Prefer category-scoped pools.
export const DEFAULT_IMAGE_POOL: string[] = CATEGORY_IMAGE_POOLS.default;

// Stable index from a string so the same slug always falls back to the same
// pool image until a collision forces a swap.
function hashIndex(key: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h % Math.max(1, mod);
}

/**
 * Returns a Map of key -> image URL for the given list of items.
 *
 * Editorial/canonical images are immutable here: if `getImage()` returns a
 * non-empty URL, that exact URL is preserved even when another item already
 * uses it. Only image-less items may receive/rotate through a fallback pool.
 * This prevents a relevant image from being silently replaced by unrelated
 * stock solely to satisfy page-level uniqueness.
 *
 * `getHash` is optional. When provided, it is still used to keep fallback-only
 * items from accidentally reusing an image that is already visible.
 */
export function assignUniqueImages<T>(
  items: T[],
  getKey: (item: T) => string,
  getImage: (item: T) => string | null | undefined,
  poolOrGetCategory?:
    | string[]
    | ((item: T) => string | ImageCategory | null | undefined),
  getHash?: (item: T) => string | null | undefined,
): Map<string, string> {
  const usedUrls = new Set<string>();
  const usedHashes = new Set<string>();
  const out = new Map<string, string>();
  const fingerprint = (url: string): string => {
    // Stable URL fingerprint for assets coming from the pool (no DB hash).
    let h = 0;
    for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) >>> 0;
    return `u_${h.toString(16)}`;
  };
  const getCategory =
    typeof poolOrGetCategory === "function" ? poolOrGetCategory : undefined;
  const staticPool = Array.isArray(poolOrGetCategory) ? poolOrGetCategory : null;
  const poolFor = (item: T): string[] => {
    if (staticPool) return staticPool;
    if (getCategory) {
      const raw = getCategory(item);
      const cat = resolveImageCategory({ category: raw ?? null });
      return getCategoryFallbackPool(cat);
    }
    // No category hint provided: keep the default bucket only (never mix
    // unrelated topics like weather/wildlife into swap fallback).
    return CATEGORY_IMAGE_POOLS.default;
  };
  for (const item of items) {
    const key = getKey(item);
    const pool = poolFor(item);
    const suppliedImage = (getImage(item) ?? "").trim();
    const initial = suppliedImage || pool[hashIndex(key, pool.length)];
    const initialHash = (getHash?.(item) ?? null) || fingerprint(initial);
    let pick = initial;
    let pickHash = initialHash;

    // Never swap an explicit/canonical image for stock. Duplicate exact-subject
    // imagery is preferable to a unique but misleading image.
    if (!suppliedImage && (usedUrls.has(pick) || usedHashes.has(pickHash))) {
      const start = hashIndex(key, pool.length);
      let found = false;
      for (let i = 0; i < pool.length; i++) {
        const cand = pool[(start + i) % pool.length];
        const candHash = fingerprint(cand);
        if (!usedUrls.has(cand) && !usedHashes.has(candHash)) {
          pick = cand;
          pickHash = candHash;
          found = true;
          break;
        }
      }
      if (!found) {
        pick = initial; // pool exhausted; keep deterministic fallback rather than blank
        pickHash = initialHash;
      }
    }
    usedUrls.add(pick);
    usedHashes.add(pickHash);
    out.set(key, pick);
  }
  return out;
}
