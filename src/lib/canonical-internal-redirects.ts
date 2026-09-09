const INTERNAL_REDIRECT_CANONICALS: Readonly<Record<string, string>> = {
  "/about-keep-texas-red": "/about",
  "/candidate-guides": "/elections/2026",
  "/laws-to-know": "/laws",
  "/legislative-updates": "/bills",
  "/texas-laws": "/laws",
  "/texas-law-policy": "/laws",
  "/texas-news": "/news",
  "/elections": "/elections/2026",
  "/voting-locations": "/elections/voting",
  "/texas-government/texas-court-of-criminal-appeals-history": "/texas-government/court-of-criminal-appeals-history",
  "/find-my-dmv": "https://texasdefined.com/find-my-dmv",
  "/texas-property-tax-protest-guide": "https://texasdefined.com/do/property-tax-protest",
  "/living-in-texas": "https://texasdefined.com/texas-living",
  "/moving-to-texas": "https://texasdefined.com/moving-to-texas",
  "/texas-living": "https://texasdefined.com/texas-living",
  "/explore": "https://texasdefined.com/explore",
  "/tax-calculator": "https://texasdefined.com/decide/property-taxes",
};

const CANONICAL_HOST = "keeptxred.com";

function normalizedAliasPath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

function withSuffix(canonical: string, search: string, hash: string, absoluteInput: boolean) {
  if (/^https?:\/\//i.test(canonical)) return `${canonical}${search}${hash}`;
  return `${absoluteInput ? `https://${CANONICAL_HOST}` : ""}${canonical}${search}${hash}`;
}

export function canonicalInternalRedirectHref(href: string) {
  const raw = href.trim();
  if (!raw) return href;

  if (raw.startsWith("/")) {
    const parsed = new URL(raw, `https://${CANONICAL_HOST}`);
    const canonical = INTERNAL_REDIRECT_CANONICALS[normalizedAliasPath(parsed.pathname)];
    return canonical ? withSuffix(canonical, parsed.search, parsed.hash, false) : href;
  }

  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    if (host !== CANONICAL_HOST) return href;
    const canonical = INTERNAL_REDIRECT_CANONICALS[normalizedAliasPath(parsed.pathname)];
    return canonical ? withSuffix(canonical, parsed.search, parsed.hash, true) : href;
  } catch {
    return href;
  }
}

export function canonicalizeInternalRedirectMarkdownLinks(text: string) {
  return text.replace(/\]\(([^)\s]+)\)/g, (match, href: string) => {
    const canonical = canonicalInternalRedirectHref(href);
    return canonical === href ? match : `](${canonical})`;
  });
}
