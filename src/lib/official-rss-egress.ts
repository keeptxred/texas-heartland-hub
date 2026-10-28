/**
 * Fixed egress alternatives for first-party Texas RSS feeds.
 *
 * Cloudflare periodically times out to official .gov and some local publisher
 * feed hosts even when the same fixed upstream is reachable from Supabase.
 * This map is the entire allowlist. Never turn ?feed= into an arbitrary URL
 * proxy, never treat a relay as an additional publisher or primary source.
 */
const RELAY_BASE = "https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?feed=";

const SOURCE_KEYS: Record<string, string> = {
  "https://gov.texas.gov/news/rss": "official-governor-rss",
  "https://www.sos.state.tx.us/rss/press.xml": "official-secretary-of-state-press-rss",
  "https://www.sos.state.tx.us/texreg/texreg.xml": "official-texas-register-rss",
  "https://www.dps.texas.gov/rss/most-wanted.xml": "official-texas-dps-wanted-rss",
  "https://public.govdelivery.com/topics/TXCOMPT_1/feed.rss": "official-comptroller-rss",
  "https://www.khou.com/feeds/syndication/rss/news/local": "khou-local",
  "https://www.khou.com/feeds/syndication/rss/sports/": "khou-sports",
  "https://www.wfaa.com/feeds/syndication/rss/news/local": "wfaa-local",
  "https://www.kvue.com/feeds/syndication/rss/news/local": "kvue-local",
  "https://www.kens5.com/feeds/syndication/rss/news/local": "kens-local",
  "https://www.kcentv.com/feeds/syndication/rss/news/local": "kcen-local",
  "https://www.lmtonline.com/default/feed/news-rss-1512.php": "lmt-local",
};

/** Never route upstream 403/404 or 429 rate limits through another egress. */
export function canFailoverTrustedRssStatus(status: number): boolean {
  return status === 0 || status === 408 || status === 425
    || status === 500 || status === 502 || status === 503 || status === 504;
}

export function trustedNewsroomRssRelayUrl(sourceUrl: string): string | null {
  const key = SOURCE_KEYS[sourceUrl];
  return key ? RELAY_BASE + encodeURIComponent(key) : null;
}
