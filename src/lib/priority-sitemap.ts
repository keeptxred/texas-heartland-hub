import priorityUrls from "../data/search-console-priority-sitemap-urls.json";

const SITE_ORIGIN = "https://keeptxred.com";
export const MAX_SEARCH_CONSOLE_PRIORITY_URLS = 30;

const DISALLOWED_PRIORITY_PATHS = new Set([
  "/elections",
  "/elections/polls/methodology",
  "/bills/capital-punishment",
  "/texas-legislature/cross-party-scorecard",
  "/fact-checks",
  "/fact-checks/federal",
  "/fact-checks/state",
]);

function isDisallowedPriorityPath(path: string) {
  return DISALLOWED_PRIORITY_PATHS.has(path)
    || path.startsWith("/texas-house/")
    || path.startsWith("/texas-senate/");
}

function normalizePriorityPath(value: string) {
  try {
    const url = new URL(value, SITE_ORIGIN);
    if (url.origin !== SITE_ORIGIN) return null;
    url.hash = "";
    url.search = "";
    const path = url.pathname.replace(/\/+$/, "") || "/";
    if (isDisallowedPriorityPath(path)) return null;
    return path;
  } catch {
    return null;
  }
}

export function getPrioritySitemapPaths() {
  const normalized = priorityUrls
    .map(normalizePriorityPath)
    .filter((value): value is string => Boolean(value));

  return [...new Set(normalized)].slice(0, MAX_SEARCH_CONSOLE_PRIORITY_URLS);
}
