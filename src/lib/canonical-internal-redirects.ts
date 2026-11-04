import { MIGRATED_PRACTICAL_GUIDE_CANONICALS } from "./migrated-practical-guide-canonical";
import { MIGRATED_TOOL_CANONICALS } from "./migrated-tool-canonical";
import { ELECTION_FEATURE_FLAGS } from "./elections/featureFlags";

const INTERNAL_REDIRECT_CANONICALS: Readonly<Record<string, string>> = {
  "/about-keep-texas-red": "/about",
  // Off-season destinations used only while public Election Central is disabled.
  "/candidate-guides": "/texas-politics",
  "/election": "/texas-politics",
  "/election-central": "/texas-politics",
  "/texas-elections": "/texas-politics",
  "/elections-2026": "/texas-politics",
  "/elections": "/texas-politics",
  "/elections/2026": "/texas-politics",
  "/elections/races": "/texas-politics",
  "/elections/candidates": "/representatives",
  "/elections/districts": "/districts",
  "/elections/legislative": "/texas-legislature",
  "/elections/statewide": "/texas-politics",
  "/elections/polls": "/texas-politics/texas-election-history",
  "/elections/forecast": "/texas-politics",
  "/elections/results": "/texas-politics",
  "/elections/voting": "/county-elections",
  "/elections/methodology": "/editorial-standards",
  "/elections/corrections": "/contact",
  "/laws-to-know": "/laws",
  "/legislative-updates": "/bills",
  "/texas-laws": "/laws",
  "/texas-law-policy": "/laws",
  "/texas-news": "/news",
  "/voting-locations": "/county-elections",
  "/news/texas-constitutional-amendments-guide": "/laws/constitutional-amendments",
  "/texas-government/texas-court-of-criminal-appeals-history": "/texas-government/court-of-criminal-appeals-history",
  "/find-my-dmv": "https://texasdefined.com/find-my-dmv",
  "/dmv": "https://texasdefined.com/texas-dmv",
  "/vehicles/registration": "https://texasdefined.com/texas-vehicle-registration",
  "/vehicles/new-residents": "https://texasdefined.com/find-my-dmv",
  "/vehicles/renewal": "https://texasdefined.com/texas-vehicle-registration-renewal",
  "/vehicles/registration-fees-taxes": "https://texasdefined.com/texas-vehicle-registration-fees-taxes",
  "/property-taxes": "https://texasdefined.com/learn/property-taxes",
  "/texas/property-taxes-2026": "https://texasdefined.com/learn/property-taxes",
  "/news/texas-property-tax-guide": "https://texasdefined.com/learn/property-taxes",
  "/news/homestead-exemption-explained": "https://texasdefined.com/do/homestead-exemption",
  "/news/appraisal-protest-playbook": "https://texasdefined.com/do/property-tax-protest",
  "/news/county-appraisal-districts-explained": "https://texasdefined.com/learn/appraisal-districts",
  "/texas-property-tax-protest-guide": "https://texasdefined.com/do/property-tax-protest",
  "/living-in-texas": "https://texasdefined.com/texas-living",
  "/moving-to-texas": "https://texasdefined.com/moving-to-texas",
  "/texas-living": "https://texasdefined.com/texas-living",
  "/texas-sports": "https://texasdefined.com/sports",
  "/explore": "https://texasdefined.com/explore",
  ...MIGRATED_TOOL_CANONICALS,
  ...MIGRATED_PRACTICAL_GUIDE_CANONICALS,
};

const ELECTION_CYCLE_ALIASES = new Set([
  "/candidate-guides",
  "/election",
  "/election-central",
  "/texas-elections",
  "/elections-2026",
]);

/**
 * During the off-season, article links are directed to permanent site resources.
 * When Election Central is enabled again, preserve live race/detail URLs rather
 * than permanently rewriting them to the general politics page.
 */
export function resolveInternalRedirectDestination(
  pathname: string,
  electionCentralEnabled = ELECTION_FEATURE_FLAGS.homepagePromotion,
): string | undefined {
  if (electionCentralEnabled) {
    if (pathname === "/elections" || ELECTION_CYCLE_ALIASES.has(pathname)) return "/elections/2026";
    if (pathname === "/voting-locations") return "/elections/voting";
    if (pathname.startsWith("/elections/")) return undefined;
  }
  return INTERNAL_REDIRECT_CANONICALS[pathname];
}

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
    const canonical = resolveInternalRedirectDestination(normalizedAliasPath(parsed.pathname));
    return canonical ? withSuffix(canonical, parsed.search, parsed.hash, false) : href;
  }

  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    if (host !== CANONICAL_HOST) return href;
    const canonical = resolveInternalRedirectDestination(normalizedAliasPath(parsed.pathname));
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
