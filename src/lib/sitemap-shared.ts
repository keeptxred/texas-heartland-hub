/**
 * Shared helpers for XML sitemap generation. Keep pure — no side effects.
 * All sitemaps must:
 *  - be UTF-8, absolute HTTPS URLs
 *  - include <lastmod> for every entry
 *  - omit <priority>/<changefreq> (Google ignores them)
 *  - dedupe by canonical URL
 */
export const BASE_URL = "https://keeptxred.com";
const CANONICAL_HOST = "keeptxred.com";
const SITE_HOSTS = new Set([CANONICAL_HOST, `www.${CANONICAL_HOST}`]);
const INVALID_IMAGE_PATTERN =
  /(?:placeholder|spacer|blank(?:[-_.]?image)?|transparent(?:[-_.]?pixel)?|pixel\.gif|1x1)/i;

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
  try {
    const u = new URL(pathOrUrl, BASE_URL);
    if (SITE_HOSTS.has(u.hostname.toLowerCase())) {
      u.protocol = "https:";
      u.hostname = CANONICAL_HOST;
      u.port = "";
    }
    return u.toString();
  } catch {
    return "";
  }
}

/** Normalize to a canonical form for dedupe: lowercase host, no trailing slash (except root), no query. */
export function canonicalize(url: string): string {
  try {
    const u = new URL(url, BASE_URL);
    u.hash = "";
    u.search = "";
    u.hostname = u.hostname.toLowerCase();
    if (SITE_HOSTS.has(u.hostname)) {
      u.protocol = "https:";
      u.hostname = CANONICAL_HOST;
      u.port = "";
    }
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
  image?: { loc: string; title?: string; caption?: string };
};

export function renderUrlset(entries: UrlEntry[], opts?: { image?: boolean }): string {
  const seen = new Set<string>();
  const rows: string[] = [];
  for (const e of entries) {
    if (!e.loc) continue;
    const key = canonicalize(e.loc);
    if (seen.has(key)) continue;
    seen.add(key);
    const imageTitle = e.image?.title
      ? `<image:title>${xmlEscape(e.image.title)}</image:title>`
      : "";
    const imageCaption = e.image?.caption
      ? `<image:caption>${xmlEscape(e.image.caption)}</image:caption>`
      : "";
    const img = opts?.image && e.image?.loc
      ? `\n    <image:image><image:loc>${xmlEscape(e.image.loc)}</image:loc>${imageTitle}${imageCaption}</image:image>`
      : "";
    rows.push(
      `  <url>\n    <loc>${xmlEscape(e.loc)}</loc>\n    <lastmod>${e.lastmod}</lastmod>${img}\n  </url>`,
    );
  }
  const ns = opts?.image
    ? ` xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`
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
  if (!s || s.startsWith("data:") || s.startsWith("blob:")) return false;
  if (INVALID_IMAGE_PATTERN.test(s)) return false;
  try {
    const parsed = new URL(s, BASE_URL);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}
