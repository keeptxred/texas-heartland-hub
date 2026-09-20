/**
 * Shared helpers for XML sitemap generation. Keep pure — no side effects.
 * All sitemaps must:
 *  - be UTF-8, absolute canonical HTTPS URLs on keeptxred.com
 *  - include <lastmod> only when a trustworthy modification date is known
 *  - omit query strings, fragments, redirects, and duplicate canonicals
 *  - omit <priority>/<changefreq> (Google ignores them)
 */
export const BASE_URL = "https://keeptxred.com";
const CANONICAL_HOST = "keeptxred.com";
const SITE_HOSTS = new Set([CANONICAL_HOST, `www.${CANONICAL_HOST}`]);
const INVALID_IMAGE_PATTERN =
  /(?:placeholder|spacer|blank(?:[-_.]?image)?|transparent(?:[-_.]?pixel)?|pixel\.gif|1x1)/i;
const LIVE_SLUG_DATE = /^live-(\d{4})-(\d{2})-(\d{2})-/i;
const UNRESOLVED_ROUTE_TOKEN = /(?:^|\/)(?:\$[a-z][a-z0-9_-]*|%24[a-z][a-z0-9_-]*)(?:\/|$)/i;
const SEARCH_SCOPE_EXCLUDED_PATH_PREFIXES = ["/texas-sports"] as const;

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

/** Return a canonical, indexable site URL or an empty string when invalid. */
export function canonicalize(url: string): string {
  try {
    const u = new URL(url, BASE_URL);
    const host = u.hostname.toLowerCase();
    if (!SITE_HOSTS.has(host)) return "";
    if (u.protocol !== "http:" && u.protocol !== "https:") return "";
    u.protocol = "https:";
    u.hostname = CANONICAL_HOST;
    u.port = "";
    u.hash = "";
    u.search = "";
    let pathname = u.pathname.replace(/\/{2,}/g, "/");
    if (pathname.length > 1 && pathname.endsWith("/")) pathname = pathname.slice(0, -1);
    if (UNRESOLVED_ROUTE_TOKEN.test(pathname)) return "";
    u.pathname = pathname || "/";
    return u.toString();
  } catch {
    return "";
  }
}

function isSearchScopeExcludedUrl(url: string): boolean {
  try {
    const pathname = new URL(url).pathname;
    return SEARCH_SCOPE_EXCLUDED_PATH_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
  } catch {
    return false;
  }
}

export function toIsoDate(d: string | Date | null | undefined): string {
  if (!d) return "";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toISOString();
}

/** Return the newest valid timestamp from trustworthy content dates. */
export function latestIsoDate(
  ...values: Array<string | Date | null | undefined>
): string {
  let newest = "";
  let newestTime = Number.NEGATIVE_INFINITY;
  for (const value of values) {
    const iso = toIsoDate(value);
    if (!iso) continue;
    const time = Date.parse(iso);
    if (time > newestTime) {
      newest = iso;
      newestTime = time;
    }
  }
  return newest;
}

/**
 * Guard against the historical ingestion bug that created URLs such as
 * live-2001-... for articles actually published in 2026. A dated live slug is
 * only sitemap-worthy when the date encoded in the slug agrees with the
 * article's publication date. Non-live slugs are unaffected.
 */
export function isArticleSlugDateConsistent(
  slug: string | null | undefined,
  publishedAt: string | Date | null | undefined,
): boolean {
  if (!slug) return false;
  const match = slug.match(LIVE_SLUG_DATE);
  if (!match) return true;
  if (!publishedAt) return false;
  const published = typeof publishedAt === "string" ? new Date(publishedAt) : publishedAt;
  if (Number.isNaN(published.getTime())) return false;
  const slugDate = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00Z`);
  if (Number.isNaN(slugDate.getTime())) return false;
  const diffDays = Math.abs(slugDate.getTime() - published.getTime()) / 86_400_000;
  return diffDays <= 2;
}

export type UrlEntry = {
  loc: string;
  lastmod?: string;
  image?: { loc: string; title?: string; caption?: string };
};

export function renderUrlset(entries: UrlEntry[], opts?: { image?: boolean }): string {
  const seen = new Set<string>();
  const rows: string[] = [];
  for (const entry of entries) {
    const loc = canonicalize(entry.loc);
    const lastmod = toIsoDate(entry.lastmod);
    if (!loc || isSearchScopeExcludedUrl(loc) || seen.has(loc)) continue;
    seen.add(loc);

    const imageLoc = opts?.image && isRealImage(entry.image?.loc)
      ? absUrl(entry.image!.loc)
      : "";
    const imageTitle = imageLoc && entry.image?.title
      ? `<image:title>${xmlEscape(entry.image.title)}</image:title>`
      : "";
    const imageCaption = imageLoc && entry.image?.caption
      ? `<image:caption>${xmlEscape(entry.image.caption)}</image:caption>`
      : "";
    const image = imageLoc
      ? `\n    <image:image><image:loc>${xmlEscape(imageLoc)}</image:loc>${imageTitle}${imageCaption}</image:image>`
      : "";
    const lastmodXml = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";

    rows.push(
      `  <url>\n    <loc>${xmlEscape(loc)}</loc>${lastmodXml}${image}\n  </url>`,
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
      "X-Robots-Tag": "noindex, follow",
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
