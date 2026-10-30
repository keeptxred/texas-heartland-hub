const MONTHS: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

/**
 * The DPS press-release index uses undated /news/<slug> URLs and renders an
 * article's publication date immediately AFTER its linked heading. Reading the
 * first nearby date is safe only when it occurs before the next article link.
 *
 * Reject missing dates, malformed calendar dates and stale archive entries
 * instead of inventing a fresh publication time on every scheduled fetch.
 */
export function datedDpsReleaseFromIndexTail(html: string, afterAnchorIndex: number, nowMs = Date.now()): string | null {
  if (!Number.isSafeInteger(afterAnchorIndex) || afterAnchorIndex < 0) return null;
  const trailing = html.slice(afterAnchorIndex, afterAnchorIndex + 850);
  const beforeAnotherLink = trailing.split(/<a\b/i, 1)[0];
  const plain = beforeAnotherLink
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const found = plain.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(20\d{2})\b/i);
  if (!found) return null;
  const month = MONTHS[found[1].toLowerCase()];
  const day = Number(found[2]);
  const year = Number(found[3]);
  if (!month || day < 1 || day > 31) return null;
  const timestamp = Date.UTC(year, month - 1, day, 12);
  const date = new Date(timestamp);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) return null;
  if (nowMs - timestamp > 21 * 86_400_000 || timestamp - nowMs > 2 * 86_400_000) return null;
  return date.toISOString();
}
