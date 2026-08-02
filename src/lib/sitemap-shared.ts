/**
 * Shared helpers for XML sitemap generation. Keep pure — no side effects.
 * All sitemaps must:
 *  - be UTF-8, absolute canonical HTTPS URLs on keeptxred.com
 *  - include a valid <lastmod> for every entry
 *  - omit query strings, fragments, redirects, and duplicate canonicals
 *  - omit <priority>/<changefreq> (Google ignores them)
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
    u.pathname = pathname || "/";
    return u.toString();
  } catch {
    return "";
  }
}

export function toIsoDate(d: string | Date | null | undefined): string {
  if (!d) return "";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "";
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
  for (const entry of entries) {
    const loc = canonicalize(entry.loc);
    const lastmod = toIsoDate(entry.lastmod);
    if (!loc || !lastmod || seen.has(loc)) continue;
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

    rows.push(
      `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>${image}\n  </url>`,
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
