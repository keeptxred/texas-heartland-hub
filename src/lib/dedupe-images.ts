// Per project rule: no page may display the same image twice.
// This helper assigns a unique image to each item in a list. When the chosen
// image is already used on the same page, it swaps in the next available
// fallback from `pool`. Cheap, render-time only — no image regeneration.

import { CATEGORY_IMAGE_POOLS } from "@/lib/fallback-images";

// The dedupe swap pool draws from the same stock pools that `getArticleImage`
// selects from — one source of truth. No hard-coded political fallbacks.
export const DEFAULT_IMAGE_POOL: string[] = Object.values(CATEGORY_IMAGE_POOLS).flat();

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
  pool: string[] = DEFAULT_IMAGE_POOL,
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
  for (const item of items) {
    const key = getKey(item);
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