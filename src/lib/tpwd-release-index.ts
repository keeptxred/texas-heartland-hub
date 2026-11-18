/**
 * Official TPWD release-index adapter. The index wraps a headline AND the
 * first paragraph inside one link. Neither the paragraph nor crawl time is
 * a trustworthy article headline / original publication date.
 *
 * Source-only discovery; this function never changes editorial approval.
 */
export type TpwdReleaseItem = {
  title: string;
  link: string;
  pub_date: string;
  source: string;
  description: string;
};

const BASE = "https://tpwd.texas.gov/newsmedia/releases/";
const SOURCE = "Texas Parks & Wildlife";

function plainText(html: string): string {
  const entity: Record<string, string> = {
    amp: "&", nbsp: " ", quot: '"', apos: "'", lt: "<", gt: ">",
    ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”",
    aacute: "á", eacute: "é", iacute: "í", oacute: "ó", uacute: "ú", ntilde: "ñ",
  };
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (whole, key: string) => entity[key.toLowerCase()] ?? whole)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ").trim();
}

function exactReleaseLink(href: string): { link: string; publishDate: string } | null {
  try {
    const parsed = new URL(href.replace(/&amp;/gi, "&"), BASE);
    if (parsed.protocol !== "https:" || parsed.hostname !== "tpwd.texas.gov"
      || parsed.username || parsed.password || parsed.port
      || parsed.pathname !== "/newsmedia/releases/"
      || parsed.searchParams.size !== 1 || parsed.hash) return null;
    const req = parsed.searchParams.get("req");
    if (!req || !/^20\d{6}[a-z]$/i.test(req)) return null;
    const ymd = req.slice(0, 8);
    const y = Number(ymd.slice(0, 4));
    const m = Number(ymd.slice(4, 6));
    const d = Number(ymd.slice(6, 8));
    // A date-only index ID is not evidence of an exact publish hour. Midnight
    // UTC conservatively represents the indexed calendar day in the feed.
    const date = new Date(Date.UTC(y, m - 1, d));
    if (date.getUTCFullYear() !== y || date.getUTCMonth() + 1 !== m || date.getUTCDate() !== d) return null;
    return { link: BASE + "?req=" + req.toLowerCase(), publishDate: date.toISOString() };
  } catch { return null; }
}

export function parseTpwdReleaseIndex(html: string, nowMs = Date.now()): TpwdReleaseItem[] {
  const out: TpwdReleaseItem[] = [];
  const seen = new Set<string>();
  const re = /<a\b[^>]*href=["']([^"']*\?req=[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(re)) {
    const release = exactReleaseLink(match[1]);
    if (!release || seen.has(release.link)) continue;
    const published = Date.parse(release.publishDate);
    if (!Number.isFinite(nowMs) || published > nowMs + 24 * 3600_000
      || nowMs - published > 21 * 24 * 3600_000) continue;
    const text = plainText(match[2]);
    // TPWD currently renders "Headline AUSTIN – First paragraph" within
    // one <a>. Never publish the entire linked excerpt as the headline.
    const dateline = text.match(/^(.+?)\s+AUSTIN\s*[–—-]\s+(.+)$/i);
    const title = (dateline ? dateline[1] : text).trim();
    if (title.length < 16 || title.length > 180 || /&[a-z]+;/i.test(title)) continue;
    const description = dateline ? dateline[2].slice(0, 1200) : title;
    seen.add(release.link);
    out.push({ title, link: release.link, pub_date: release.publishDate,
      source: SOURCE, description });
    if (out.length >= 25) break;
  }
  return out;
}
