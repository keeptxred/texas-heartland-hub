type SearchSite = "keeptxred" | "texasdefined";
type SearchChangeKind = "published" | "updated" | "deleted" | "redirected";

type SearchDistributionInput = {
  site: SearchSite;
  kind: SearchChangeKind;
  urls: Array<string | null | undefined>;
  canonicalUrl?: string | null;
};

type SiteConfig = {
  origin: string;
  host: string;
  key: string;
};

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_BATCH_SIZE = 1000;

const SITE_CONFIG: Record<SearchSite, SiteConfig> = {
  keeptxred: {
    origin: "https://keeptxred.com",
    host: "keeptxred.com",
    key: "f2877f4619069ed6765e12380d28d9e0",
  },
  texasdefined: {
    origin: "https://texasdefined.com",
    host: "texasdefined.com",
    key: "0c2b08423ce5be707dd931f57239acf1",
  },
};

const BLOCKED_PREFIXES = [
  "/admin",
  "/api",
  "/search",
  "/preview",
  "/draft",
  "/private",
  "/email",
  "/cart",
  "/shop/checkout",
];

export function canonicalSearchUrl(site: SearchSite, value: string | null | undefined): string | null {
  if (!value) return null;
  const config = SITE_CONFIG[site];
  try {
    const url = new URL(value, config.origin);
    if (url.protocol !== "https:" || url.origin !== config.origin) return null;
    if (url.search || url.hash || url.username || url.password) return null;
    const path = url.pathname.replace(/\/{2,}/g, "/");
    if (BLOCKED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) return null;
    return `${config.origin}${path}`;
  } catch {
    return null;
  }
}

/**
 * Notify IndexNow about a public URL lifecycle event.
 *
 * Publication is deliberately fail-open: network errors, ownership problems, or
 * IndexNow outages are logged and returned, never thrown into the publishing
 * transaction. Callers should pass only substantive content/data events. Deleted
 * and redirected former URLs are valid lifecycle notifications so engines can
 * recrawl them and observe their 404/410/301 state; redirect targets should be
 * included separately only when they are canonical/indexable.
 */
export async function notifySearchDistribution(input: SearchDistributionInput): Promise<{
  ok: boolean;
  submitted: number;
  error?: string;
}> {
  const config = SITE_CONFIG[input.site];
  const candidates = [...input.urls, input.canonicalUrl];
  const urls = [...new Set(candidates.map((value) => canonicalSearchUrl(input.site, value)).filter((value): value is string => Boolean(value)))];
  if (!urls.length) return { ok: true, submitted: 0 };

  try {
    for (let i = 0; i < urls.length; i += INDEXNOW_BATCH_SIZE) {
      const urlList = urls.slice(i, i + INDEXNOW_BATCH_SIZE);
      const response = await fetch(INDEXNOW_ENDPOINT, {
        method: "POST",
        headers: {
          "content-type": "application/json; charset=utf-8",
          "user-agent": "TexasSearchDistribution/2.0",
        },
        body: JSON.stringify({
          host: config.host,
          key: config.key,
          keyLocation: `${config.origin}/${config.key}.txt`,
          urlList,
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (![200, 202].includes(response.status)) {
        const detail = (await response.text()).slice(0, 500);
        throw new Error(`HTTP ${response.status}${detail ? `: ${detail}` : ""}`);
      }
    }
    console.info("[search-distribution] IndexNow accepted canonical URL lifecycle event", {
      site: input.site,
      kind: input.kind,
      submitted: urls.length,
    });
    return { ok: true, submitted: urls.length };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.warn("[search-distribution] IndexNow notification failed without blocking publication", {
      site: input.site,
      kind: input.kind,
      urls,
      detail,
    });
    return { ok: false, submitted: 0, error: detail };
  }
}

export function newsCanonicalUrl(site: SearchSite, slug: string): string | null {
  const cleanSlug = slug.trim().replace(/^\/+|\/+$/g, "");
  if (!cleanSlug) return null;
  return canonicalSearchUrl(site, `${SITE_CONFIG[site].origin}/news/${cleanSlug}`);
}
