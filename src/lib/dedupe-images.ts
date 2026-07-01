// Per project rule: no page may display the same image twice.
// This helper assigns a unique image to each item in a list. When the chosen
// image is already used on the same page, it swaps in the next available
// fallback from `pool`. Cheap, render-time only — no image regeneration.

import border from "@/assets/border.jpg";
import ballot from "@/assets/ballot.jpg";
import suburb from "@/assets/suburb.jpg";
import podium from "@/assets/podium.jpg";
import oil from "@/assets/article-oil.jpg";
import classroom from "@/assets/article-classroom.jpg";
import rotunda from "@/assets/article-rotunda.jpg";
import gavel from "@/assets/article-gavel.jpg";
import courthouse from "@/assets/article-courthouse.jpg";
import rio from "@/assets/article-riogrande.jpg";
import trooper from "@/assets/article-trooper.jpg";
import wind from "@/assets/article-wind.jpg";
import grid from "@/assets/article-grid.jpg";
import water from "@/assets/article-water.jpg";
import schoolbus from "@/assets/article-schoolbus.jpg";
import library from "@/assets/article-library.jpg";
import pollingplace from "@/assets/article-pollingplace.jpg";
import voterreg from "@/assets/article-voterreg.jpg";
import ballot2 from "@/assets/article-ballot2.jpg";
import governor from "@/assets/article-governor.jpg";
import ag from "@/assets/article-ag.jpg";
import taxbill from "@/assets/article-taxbill.jpg";
import salestax from "@/assets/article-salestax.jpg";
import boardroom from "@/assets/article-boardroom.jpg";
import openmeeting from "@/assets/article-openmeeting.jpg";
import carry from "@/assets/article-carry.jpg";
import { STOCK_FALLBACK_POOL } from "@/lib/fallback-images";

export const DEFAULT_IMAGE_POOL: string[] = [
  border, ballot, suburb, podium, oil, classroom, rotunda, gavel,
  courthouse, rio, trooper, wind, grid, water, schoolbus, library, pollingplace,
  voterreg, ballot2, governor, ag, taxbill, salestax, boardroom, openmeeting, carry,
  ...STOCK_FALLBACK_POOL,
];

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