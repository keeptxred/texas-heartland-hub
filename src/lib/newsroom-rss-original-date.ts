import { isPlausiblePublishDate } from "./article-slug-integrity";

/**
 * Feed discovery is not publication. Never replace absent or stale original
 * publication timestamps with crawl time. The two verified state agency
 * permalink conventions encode their original release date, even when RSS
 * republishes a historical item or gives it a fresh updated timestamp.
 */
export function verifiedRssIngestTimestamp(raw: string | null | undefined, link: string, now = new Date()): string | null {
  let url: URL;
  try { url = new URL(link); } catch { return null; }
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  let date: string | undefined;
  if (host === "sos.state.tx.us" || host === "sos.texas.gov") {
    const m = /^\/about\/newsreleases\/(\d{4})\/(\d{2})(\d{2})(\d{2})\.shtml$/i.exec(url.pathname);
    if (m) {
      if (m[1].slice(2) !== m[4]) return null;
      date = `${m[1]}-${m[2]}-${m[3]}`;
    }
  } else if (host === "tdi.texas.gov") {
    const m = /^\/news\/(\d{4})\/tdi(\d{2})(\d{2})(\d{4})\.html$/i.exec(url.pathname);
    if (m) {
      if (m[1] !== m[4]) return null;
      date = `${m[1]}-${m[2]}-${m[3]}`;
    }
  }
  if (!raw || !isPlausiblePublishDate(raw, now)) return null;
  const parsed = new Date(raw);
  if (date) {
    const original = new Date(date + "T00:00:00Z");
    if (!Number.isFinite(original.getTime()) || original.toISOString().slice(0, 10) !== date
        || !isPlausiblePublishDate(original, now)) return null;
    // The path is an age guard, not an exact publication-clock witness.
    // Preserve a plausible RSS timestamp within one calendar day of the
    // release path (timezone/editorial scheduling can differ by a day).
    const day = Date.parse(parsed.toISOString().slice(0, 10) + "T00:00:00Z");
    if (Math.abs(day - original.getTime()) > 86_400_000) return null;
  }
  return parsed.toISOString();
}
