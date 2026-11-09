/**
 * Bing RSS is a discovery index, never an independently verified publisher.
 * Store only true article links and dates with a fixed low-trust provenance
 * label; never attach an article body or set publication eligibility.
 */
export const BING_DISCOVERY_SOURCE = "Texas Bing News discovery pointer";

export interface BingNewsDiscoveryItem {
  title: string;
  link: string;
  pub_date: string;
  source: string;
  description: string;
}

function plain(xml: string): string {
  return xml
    .replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/i, "$1")
    .replace(/&#x([0-9a-f]+);/gi, (m, code: string) => {
      const n = Number.parseInt(code, 16);
      return n >= 0 && n <= 0x10ffff && !(n >= 0xd800 && n <= 0xdfff) ? String.fromCodePoint(n) : m;
    })
    .replace(/&#(\d+);/g, (m, code: string) => {
      const n = Number.parseInt(code, 10);
      return n >= 0 && n <= 0x10ffff && !(n >= 0xd800 && n <= 0xdfff) ? String.fromCodePoint(n) : m;
    })
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function xmlField(card: string, tag: string): string {
  const match = card.match(new RegExp("<" + tag + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + tag + ">", "i"));
  return match ? plain(match[1]) : "";
}

function isPublicOriginalLink(link: string): boolean {
  try {
    const url = new URL(link);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return false;
    if (!url.hostname.includes(".") || url.hostname.length > 253) return false;
    if (url.hostname === "localhost" || url.hostname.endsWith(".localhost")) return false;
    if (/^\d+\.\d+\.\d+\.\d+$/.test(url.hostname) || url.hostname.includes(":")) return false;
    if (/(^|\.)bing\.com$/.test(url.hostname) || /(^|\.)news\.google\.com$/.test(url.hostname)) return false;
    return true;
  } catch {
    return false;
  }
}

function originalFromBingClick(raw: string): string | null {
  try {
    const indexUrl = new URL(raw);
    if (!["bing.com", "www.bing.com"].includes(indexUrl.hostname)) return null;
    if (indexUrl.pathname !== "/news/apiclick.aspx") return null;
    const original = indexUrl.searchParams.get("url");
    if (!original || !isPublicOriginalLink(original)) return null;
    const parsed = new URL(original);
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return null;
  }
}

export function isBingNewsDiscoveryRssSource(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:"
      && parsed.hostname === "www.bing.com"
      && parsed.pathname === "/news/search"
      && parsed.searchParams.get("format") === "rss"
      && parsed.searchParams.get("setmkt") === "en-US"
      && Boolean(parsed.searchParams.get("q"));
  } catch {
    return false;
  }
}

export function parseBingNewsDiscoveryRss(xml: string, nowMs = Date.now()): BingNewsDiscoveryItem[] {
  const items: BingNewsDiscoveryItem[] = [];
  const seen = new Set<string>();
  const cards = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];
  for (const card of cards.slice(0, 80)) {
    const title = xmlField(card, "title");
    const link = originalFromBingClick(xmlField(card, "link"));
    const ms = Date.parse(xmlField(card, "pubDate"));
    if (!title || title.length < 18 || title.length > 240 || !link || !Number.isFinite(ms)) continue;
    if (ms > nowMs + 86_400_000 || nowMs - ms > 14 * 86_400_000) continue;
    if (seen.has(link)) continue;
    seen.add(link);
    const reported = xmlField(card, "News:Source").slice(0, 100);
    const note = "Discovery index only; verify publisher and primary evidence before publication.";
    const description = (note + (reported ? " Indexed attribution: " + reported + "." : "")).slice(0, 1200);
    items.push({ title, link, pub_date: new Date(ms).toISOString(), source: BING_DISCOVERY_SOURCE, description });
    if (items.length >= 30) break;
  }
  return items;
}
