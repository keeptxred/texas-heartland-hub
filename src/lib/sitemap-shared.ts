/**
 * Shared helpers for XML sitemap generation. Keep pure — no side effects.
 * All sitemaps must:
 *  - be UTF-8, absolute HTTPS URLs
 *  - include <lastmod> for every entry
 *  - omit <priority>/<changefreq> (Google ignores them)
 *  - dedupe by canonical URL
 */
export const BASE_URL = "https://www.keeptxred.com";

export function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function absUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${BASE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/** Normalize to a canonical form for dedupe: lowercase host, no trailing slash (except root), no query. */
export function canonicalize(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    u.search = "";
    u.hostname = u.hostname.toLowerCase();
    let p = u.pathname;
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    u.pathname = p;
    return u.toString();
  } catch {
    return url;
  }
}

export function toIsoDate(d: string | Date | null | undefined): string {
  if (!d) return new Date().toISOString();
  const dt = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dt.getTime())) return new Date().toISOString();
  return dt.toISOString();
}

export type UrlEntry = {
  loc: string;
  lastmod: string;
  image?: { loc: string; title?: string };
};

export function renderUrlset(entries: UrlEntry[], opts?: { image?: boolean }): string {
  const seen = new Set<string>();
  const rows: string[] = [];
  for (const e of entries) {
    if (!e.loc) continue;
    const key = canonicalize(e.loc);
    if (seen.has(key)) continue;
    seen.add(key);
    const img = opts?.image && e.image?.loc
      ? `\n    <image:image><image:loc>${xmlEscape(e.image.loc)}</image:loc>${e.image.title ? `<image:title>${xmlEscape(e.image.title)}</image:title>` : ""}</image:image>`
      : "";
    rows.push(
      `  <url>\n    <loc>${xmlEscape(e.loc)}</loc>\n    <lastmod>${e.lastmod}</lastmod>${img}\n  </url>`,
    );
  }
  const ns = opts?.image
    ? ` xmlns:image="http://www.google.com/schemas/sitemap-image/0.9"`
    : "";
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${ns}>\n${rows.join("\n")}\n</urlset>`;
}

export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=3600",
    },
  });
}

/** Placeholder / bad image filter. */
export function isRealImage(url: string | null | undefined): url is string {
  if (!url) return false;
  const s = url.trim();
  if (!s) return false;
  if (/placeholder/i.test(s)) return false;
  if (s.startsWith("data:")) return false;
  return /^https?:\/\//i.test(s) || s.startsWith("/");
}