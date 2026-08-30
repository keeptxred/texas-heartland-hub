export const PRIORITY_SITEMAP_PATHS = [
  "/",
  "/laws",
  "/news",
  "/texas-politics",
  "/texas-legislature",
  "/texas-legislature/current-session",
  "/texas-legislature/votes",
  "/bills",
  "/texas-government",
  "/representatives",
  "/register-to-vote",
  "/data",
  "/policy",
  "/texas-economy",
  "/elections/2026",
  "/elections/statewide",
  "/elections/legislative",
  "/elections/districts",
  "/elections/candidates",
  "/elections/races",
  "/elections/polls",
  "/elections/forecast",
  "/elections/results",
  "/elections/voting",
  "/elections/methodology",
  "/laws/constitutional-amendments",
  "/news/texas-gun-laws-explained",
  "/news/texas-property-tax-laws-explained",
  "/news/texas-election-laws-explained",
  "/news/texas-new-laws-2026",
] as const;

/**
 * This inventory is intentionally small and hand-curated. It exists to give
 * crawlers a stable discovery path to the site's strongest Texas government,
 * law, election, and newsroom authority pages without re-advertising bulk
 * programmatic/detail inventory that is deliberately excluded for crawl budget.
 */
export function isValidPrioritySitemapPath(path: string): boolean {
  if (!path.startsWith("/")) return false;
  if (path.length > 1 && path.endsWith("/")) return false;
  if (/[?#]/.test(path)) return false;
  if (/(?:^|\/)\$|%24/i.test(path)) return false;
  if (/\/(?:search|tag|tags|category|categories)(?:\/|$)/i.test(path)) return false;
  return true;
}
