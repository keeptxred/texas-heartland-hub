// Per project rule: no page may display the same image twice.
// This helper assigns a unique image to each item in a list. When the chosen
// image is already used on the same page, it swaps in the next available
// fallback from `pool`. Cheap, render-time only — no image regeneration.

import capitol from "@/assets/capitol.jpg";
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

export const DEFAULT_IMAGE_POOL: string[] = [
  capitol, border, ballot, suburb, podium, oil, classroom, rotunda, gavel,
  courthouse, rio, trooper, wind, grid, water, schoolbus, library, pollingplace,
  voterreg, ballot2, governor, ag, taxbill, salestax, boardroom, openmeeting, carry,
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
 */
export function assignUniqueImages<T>(
  items: T[],
  getKey: (item: T) => string,
  getImage: (item: T) => string | null | undefined,
  pool: string[] = DEFAULT_IMAGE_POOL,
): Map<string, string> {
  const used = new Set<string>();
  const out = new Map<string, string>();
  for (const item of items) {
    const key = getKey(item);
    const initial = getImage(item) || pool[hashIndex(key, pool.length)];
    let pick = initial;
    if (used.has(pick)) {
      const start = hashIndex(key, pool.length);
      let found = false;
      for (let i = 0; i < pool.length; i++) {
        const cand = pool[(start + i) % pool.length];
        if (!used.has(cand)) {
          pick = cand;
          found = true;
          break;
        }
      }
      if (!found) pick = initial; // pool exhausted; keep original rather than blank
    }
    used.add(pick);
    out.set(key, pick);
  }
  return out;
}