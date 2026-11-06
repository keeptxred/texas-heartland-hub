/**
 * Same-agency source-hydration transport only. A valid DPS article URL
 * remains the publisher and primary evidence source, never the relay host.
 * Reject any arbitrary URL, query, fragment, port, credentials, or path.
 */
const RELAY_BASE = "https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay?feed=official-texas-dps-article&slug=";

export function dpsOfficialArticleRelayUrl(sourceUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(sourceUrl);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.hostname !== "www.dps.texas.gov") return null;
  if (url.port || url.username || url.password || url.search || url.hash) return null;
  const match = url.pathname.match(/^\/news\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/);
  const slug = match?.[1];
  if (!slug || slug.length > 120 || slug === "press-releases" || slug === "most-wanted") return null;
  return RELAY_BASE + encodeURIComponent(slug);
}
