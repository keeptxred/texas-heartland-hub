/**
 * First-party OAG press-release index parser.
 *
 * The agency's former /feeds/feeds.php?feed=pr URL now returns HTTP 404.
 * Parse its canonical HTML list instead, preserving each release's printed
 * date so an archival release is never labeled as newly published.
 */
export type TexasAgReleaseItem = {
  title: string;
  link: string;
  pub_date: string;
  source: string;
  description: string;
};

const OFFICIAL_HOST = "www.texasattorneygeneral.gov";
const OFFICIAL_URL = "https://" + OFFICIAL_HOST;
const MAX_RELEASE_AGE_MS = 21 * 86_400_000;
const MAX_FUTURE_SKEW_MS = 2 * 86_400_000;

function readableText(markup: string): string {
  return String(markup)
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, value: string) => String.fromCodePoint(parseInt(value, 16)))
    .replace(/&#(\d+);/g, (_, value: string) => String.fromCodePoint(parseInt(value, 10)))
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&rsquo;/gi, "’")
    .replace(/&ldquo;/gi, "“")
    .replace(/&rdquo;/gi, "”")
    .replace(/\u00ad/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseTexasAgPressReleaseIndex(html: string, nowMs = Date.now()): TexasAgReleaseItem[] {
  const results: TexasAgReleaseItem[] = [];
  const seen = new Set<string>();
  // Each Drupal release card has a heading/link, summary, and dated meta row.
  // Require the date in the same card; never fabricate today's date.
  const cards = String(html).matchAll(/<div\b[^>]*class=["'][^"']*\bm-b-3\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi);
  for (const card of cards) {
    const block = card[1];
    const heading = block.match(/<h4\b[^>]*>[\s\S]*?<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);
    const dated = block.match(/<p\b[^>]*class=["'][^"']*\bmeta\b[^"']*["'][^>]*>\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})\s*\|\s*Press Release/i);
    if (!heading || !dated) continue;
    let url: URL;
    try {
      url = new URL(heading[1], OFFICIAL_URL);
    } catch {
      continue;
    }
    if (url.protocol !== "https:" || url.hostname !== OFFICIAL_HOST || !url.pathname.startsWith("/news/releases/")) continue;
    const title = readableText(heading[2]);
    if (title.length < 18 || title.length > 240) continue;
    const publishedAtMs = Date.parse(dated[1] + " 12:00:00 GMT");
    if (!Number.isFinite(publishedAtMs) || publishedAtMs < nowMs - MAX_RELEASE_AGE_MS || publishedAtMs > nowMs + MAX_FUTURE_SKEW_MS) continue;
    const canonical = url.origin + url.pathname;
    if (seen.has(canonical)) continue;
    seen.add(canonical);
    const excerpt = block.match(/<p\b[^>]*class=["'][^"']*\bm-b-0\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
    results.push({
      title,
      link: canonical,
      pub_date: new Date(publishedAtMs).toISOString(),
      source: "Texas Attorney General — Direct News Releases",
      description: readableText(excerpt?.[1] || title).slice(0, 1200),
    });
    if (results.length >= 30) break;
  }
  return results;
}
