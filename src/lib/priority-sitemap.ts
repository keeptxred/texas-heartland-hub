import priorityUrls from "../data/search-console-priority-sitemap-urls.json";

const SITE_ORIGIN = "https://keeptxred.com";
export const MAX_SEARCH_CONSOLE_PRIORITY_URLS = 30;

function normalizePriorityPath(value: string) {
  try {
    const url = new URL(value, SITE_ORIGIN);
    if (url.origin !== SITE_ORIGIN) return null;
    url.hash = "";
    url.search = "";
    return url.pathname.replace(/\/+$/, "") || "/";
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
