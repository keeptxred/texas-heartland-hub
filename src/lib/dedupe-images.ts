// Per project rule: no page may display the same image twice.
// This helper assigns a unique image to each item in a list. When the chosen
// image is already used on the same page, it swaps in the next available
// fallback from `pool`. Cheap, render-time only — no image regeneration.

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
 * Returns a Map of key -> unique image URL for the given list of items.
 * Duplicates are swapped for the next unused image in `pool`. If the pool is
 * exhausted, the original image is kept (fail-open, never blocks render).
 *
 * `getHash` is optional. When provided, the scanner dedupes by hash instead of
 * URL — so two different URL strings that point to the same underlying file
 * (same `image_hash` in the CMS) are still treated as duplicates.
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
    const initial = getImage(item) || pool[hashIndex(key, pool.length)];
    const initialHash = (getHash?.(item) ?? null) || fingerprint(initial);
    let pick = initial;
    let pickHash = initialHash;
    if (usedUrls.has(pick) || usedHashes.has(pickHash)) {
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
        pick = initial; // pool exhausted; keep original rather than blank
        pickHash = initialHash;
      }
    }
    usedUrls.add(pick);
    usedHashes.add(pickHash);
    out.set(key, pick);
  }
  return out;
}