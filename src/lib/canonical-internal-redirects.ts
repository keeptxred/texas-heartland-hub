const INTERNAL_REDIRECT_CANONICALS: Readonly<Record<string, string>> = {
  "/texas-news": "/news",
  "/elections": "/elections/2026",
  "/texas-law-policy": "/laws",
  "/texas-laws": "/laws",
  "/laws-to-know": "/laws",
  "/legislative-updates": "/bills",
};

const CANONICAL_HOST = "keeptxred.com";

function normalizedAliasPath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

export function canonicalInternalRedirectHref(href: string) {
  const raw = href.trim();
  if (!raw) return href;

  if (raw.startsWith("/")) {
    const parsed = new URL(raw, `https://${CANONICAL_HOST}`);
    const canonical = INTERNAL_REDIRECT_CANONICALS[normalizedAliasPath(parsed.pathname)];
    return canonical ? `${canonical}${parsed.search}${parsed.hash}` : href;
  }

  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    if (host !== CANONICAL_HOST) return href;
    const canonical = INTERNAL_REDIRECT_CANONICALS[normalizedAliasPath(parsed.pathname)];
    return canonical ? `https://${CANONICAL_HOST}${canonical}${parsed.search}${parsed.hash}` : href;
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
