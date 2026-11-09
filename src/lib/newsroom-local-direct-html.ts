/**
 * First-party local publisher index adapters.
 * Extract ORIGINAL publisher URLs and publisher-supplied dates, never crawl dates.
 * Outputs remain discovery candidates subject to all existing editorial gates.
 */
export interface DatedLocalStory {
  title: string;
  link: string;
  pub_date: string;
  source: string;
  description: string;
}

const DAY_MS = 86_400_000;

function cleanHeadline(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_whole, hex: string) =>
      String.fromCodePoint(Math.min(0x10ffff, parseInt(hex, 16))))
    .replace(/&#(\d+);/g, (_whole, num: string) =>
      String.fromCodePoint(Math.min(0x10ffff, parseInt(num, 10))))
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function datedAtNoonUtc(ymd: string, nowMs: number): string | null {
  if (!/^20\d{2}-\d{2}-\d{2}$/.test(ymd)) return null;
  const dt = new Date(ymd + "T12:00:00Z");
  if (Number.isNaN(dt.getTime()) || dt.toISOString().slice(0, 10) !== ymd) return null;
  const age = nowMs - dt.getTime();
  if (age > 14 * DAY_MS || age < -2 * DAY_MS) return null;
  return dt.toISOString();
}

function makeStory(
  rawTitle: string,
  relativePath: string,
  publishedDay: string,
  origin: string,
  source: string,
  nowMs: number,
): DatedLocalStory | null {
  const title = cleanHeadline(rawTitle);
  const pubDate = datedAtNoonUtc(publishedDay, nowMs);
  if (!pubDate || title.length < 18 || title.length > 240) return null;
  if (!/^\/news\/[a-z0-9][a-z0-9-]+\/?$/i.test(relativePath)) return null;
  const link = new URL(relativePath, origin).toString();
  if (new URL(link).hostname !== new URL(origin).hostname) return null;
  return { title, link, pub_date: pubDate, source, description: (source + ": " + title).slice(0, 1200) };
}

/** FOX 4 city listings carry an explicit datetime inside each article card. */
export function parseFox4DatedLocalHtml(html: string, source: string, nowMs = Date.now()): DatedLocalStory[] {
  const out: DatedLocalStory[] = [];
  const seen = new Set<string>();
  const cards = /<article\b[^>]*class=["'][^"']*\btag-article\b[^"']*["'][^>]*>[\s\S]*?<\/article>/gi;
  for (const match of html.matchAll(cards)) {
    const card = match[0];
    const headline = card.match(/<h3\b[^>]*class=["'][^"']*tag-article__title[^"']*["'][^>]*>\s*<a\b[^>]*href=["'](\/news\/[a-z0-9-]+\/?)["'][^>]*>([\s\S]*?)<\/a>/i);
    const dt = card.match(/<time\b[^>]*datetime=["'](20\d{2}-\d{2}-\d{2})T[^"']+["']/i);
    if (!headline || !dt) continue;
    const story = makeStory(headline[2], headline[1], dt[1], "https://www.fox4news.com", source, nowMs);
    if (!story || seen.has(story.link)) continue;
    seen.add(story.link);
    out.push(story);
    if (out.length >= 30) break;
  }
  return out;
}

/** KRGV /news contains server-rendered story dates inside individual cards. */
export function parseKrgvDatedLocalHtml(html: string, source: string, nowMs = Date.now()): DatedLocalStory[] {
  const out: DatedLocalStory[] = [];
  const seen = new Set<string>();
  const cards = /<article\b[^>]*class=["'][^"']*\bimage-grid-item\b[^"']*["'][^>]*>[\s\S]*?<\/article>/gi;
  for (const match of html.matchAll(cards)) {
    const card = match[0];
    const headline = card.match(/<div\b[^>]*class=["'][^"']*\btitle long-title\b[^"']*["'][^>]*>\s*<a\b[^>]*href=["'](\/news\/[a-z0-9-]+\/?)["'][^>]*>([\s\S]*?)<\/a>/i);
    const dt = card.match(/data-datetime=["']\{ts '(20\d{2}-\d{2}-\d{2})\s[^']+'\}["']/i);
    if (!headline || !dt) continue;
    const story = makeStory(headline[2], headline[1], dt[1], "https://www.krgv.com", source, nowMs);
    if (!story || seen.has(story.link)) continue;
    seen.add(story.link);
    out.push(story);
    if (out.length >= 30) break;
  }
  return out;
}
