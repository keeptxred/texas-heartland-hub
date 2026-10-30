/**
 * TDEM's first-party press-release permalinks use /press-release/MM-DD-YY.
 * Use the source's actual dated permalink, not a crawl timestamp, so a
 * republished index never makes an old release appear to be current news.
 */
export function datedTdemReleasePublishedAt(pathname: string, nowMs = Date.now()): string | null {
  const match = pathname.match(/^\/press-release\/(\d{1,2})-(\d{1,2})-(\d{2})\/?$/i);
  if (!match) return null;
  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = 2000 + Number(match[3]);
  if (year < 2020 || year > 2099 || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const published = new Date(Date.UTC(year, month - 1, day, 12));
  if (published.getUTCFullYear() !== year || published.getUTCMonth() + 1 !== month
    || published.getUTCDate() !== day) return null;
  if (!Number.isFinite(nowMs)) return null;
  const ageMs = nowMs - published.getTime();
  if (ageMs > 21 * 86_400_000 || ageMs < -2 * 86_400_000) return null;
  return published.toISOString();
}
