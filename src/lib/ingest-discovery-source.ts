/** Distinguish the Google News discovery layer from direct publisher RSS.
 * Relay priority and North/Sports routes are still Google discovery, not
 * first-party verification. Do not charge direct-source egress slots to them.
 */
export function isGoogleNewsDiscoveryTransport(input: string): boolean {
  let url: URL;
  try { url = new URL(input); } catch { return false; }
  if (url.protocol !== "https:") return false;
  if (url.hostname === "news.google.com") return url.pathname.startsWith("/rss/search");
  if (url.hostname !== "ftkznprjljkhymknvhye.supabase.co") return false;
  const path = url.pathname;
  const key = url.searchParams.get("feed") ?? "";
  if (path === "/functions/v1/ktr-rss-relay" || path === "/functions/v1/ktr-rss-relay-priority") {
    return key.startsWith("google-");
  }
  return (path === "/functions/v1/ktr-rss-relay-north" || path === "/functions/v1/ktr-rss-relay-sports")
    && key.length > 0;
}
