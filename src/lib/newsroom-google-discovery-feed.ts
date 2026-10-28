/**
 * A Google News RSS relay is a discovery index, even when its HTTPS host is
 * our own Supabase project. It cannot be treated as a direct publisher.
 *
 * In particular `ktr-rss-relay-priority` was omitted from the old regex,
 * causing four 30-item discovery feeds to be pinned in every core/direct
 * ingestion wave instead of using the bounded rotating discovery budget.
 */
export function isGoogleNewsDiscoveryFeed(rawUrl: string): boolean {
  let url: URL;
  try { url = new URL(rawUrl); } catch { return false; }
  if (url.protocol !== "https:") return false;
  const host = url.hostname.toLowerCase();
  if (host === "news.google.com") return url.pathname.startsWith("/rss/");
  if (host !== "ftkznprjljkhymknvhye.supabase.co") return false;
  if (!/^\/functions\/v1\/ktr-rss-relay(?:-priority)?\/?$/.test(url.pathname)) return false;
  return (url.searchParams.get("feed") ?? "").toLowerCase().startsWith("google-");
}
