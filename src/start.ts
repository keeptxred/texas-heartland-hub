import { createCsrfMiddleware, createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// SEO URL cleanup: resolve hostname, legacy paths, trailing slashes, topic
// routes, and tracking parameters into one final canonical redirect.
const TOPIC_REDIRECT_PATHS = new Set(["/texas-news", "/texas-business"]);
const LEGACY_ELECTION_PATHS = new Map([
  ["/election", "/elections/2026"],
  ["/election-central", "/elections/2026"],
  ["/texas-elections", "/elections/2026"],
  ["/elections-2026", "/elections/2026"],
  ["/elections/forecasts", "/elections/forecast"],
  ["/elections/statewide-races", "/elections/statewide"],
  ["/elections/legislative-races", "/elections/legislative"],
  ["/elections/district", "/elections/districts"],
  ["/elections/2026/races", "/elections/races"],
  ["/elections/2026/candidates", "/elections/candidates"],
  ["/elections/2026/polls", "/elections/polls"],
  ["/elections/2026/forecast", "/elections/forecast"],
  ["/elections/2026/forecasts", "/elections/forecast"],
  ["/elections/2026/results", "/elections/results"],
]);
const LEGACY_CONTENT_PATHS = new Map([
  ["/houston-news", "/houston"],
  ["/property-taxes", "/texas/property-taxes-2026"],
]);
const CANONICAL_ORIGIN = "https://keeptxred.com";

const TRACKING_PARAMS = new Set([
  "fbclid",
  "gclid",
  "dclid",
  "gbraid",
  "wbraid",
  "msclkid",
  "mc_cid",
  "mc_eid",
  "igshid",
  "ref",
  "referrer",
  "source",
]);

const NOINDEX_STATE_PARAMS = new Set([
  "category",
  "filter",
  "sort",
  "order",
  "q",
  "query",
  "search",
  "page",
  "view",
  "tab",
  "status",
  "region",
  "county",
  "district",
  "office",
  "party",
  "year",
]);

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function isTrackingParam(name: string): boolean {
  const normalized = name.toLowerCase();
  return normalized.startsWith("utm_") || TRACKING_PARAMS.has(normalized);
}

function isFileLikePath(pathname: string): boolean {
  const finalSegment = pathname.split("/").pop() ?? "";
  return finalSegment.includes(".");
}

function normalizePagePath(pathname: string): string {
  if (pathname === "/" || isFileLikePath(pathname)) return pathname;
  return pathname.endsWith("/") ? pathname.replace(/\/+$/, "") || "/" : pathname;
}

function resolveLegacyPath(pathname: string): string {
  const normalized = normalizePagePath(pathname);
  const lower = normalized.toLowerCase();
  return LEGACY_CONTENT_PATHS.get(lower) ?? LEGACY_ELECTION_PATHS.get(lower) ?? normalized;
}

function buildCanonicalTarget(url: URL): URL {
  const target = new URL(url.toString());
  target.pathname = resolveLegacyPath(target.pathname);

  const topic = target.searchParams.get("topic");
  if (topic && TOPIC_REDIRECT_PATHS.has(target.pathname)) {
    const slug = slugify(topic);
    if (slug) target.pathname = `${target.pathname}/${slug}`;
    target.searchParams.delete("topic");
  }

  for (const key of Array.from(target.searchParams.keys())) {
    if (isTrackingParam(key)) target.searchParams.delete(key);
  }

  return target;
}

function hasNoindexState(url: URL): boolean {
  for (const key of url.searchParams.keys()) {
    if (NOINDEX_STATE_PARAMS.has(key.toLowerCase())) return true;
  }
  return false;
}

const seoUrlCleanup = createMiddleware().server(async ({ next, request }) => {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const requestHost = (forwardedHost || url.host).toLowerCase();
  const canRedirect = request.method === "GET" || request.method === "HEAD";
  const excludedPath = url.pathname.startsWith("/lovable/") || url.pathname === "/email/unsubscribe";

  if (canRedirect && !excludedPath) {
    const target = buildCanonicalTarget(url);
    const hostChanged = requestHost === "www.keeptxred.com";
    const pathChanged = target.pathname !== url.pathname;
    const queryChanged = target.search !== url.search;

    if (hostChanged || pathChanged || queryChanged) {
      const location = hostChanged
        ? `${CANONICAL_ORIGIN}${target.pathname}${target.search}`
        : `${target.pathname}${target.search}`;
      return new Response(null, {
        status: 301,
        headers: {
          location,
          "cache-control": "public, max-age=86400",
        },
      });
    }
  }

  if (excludedPath) return next();

  const result = await next();

  // Shareable filters and UI states remain usable, but do not compete with
  // their clean canonical route in search results.
  if (hasNoindexState(url)) {
    try {
      result.response.headers.set("X-Robots-Tag", "noindex, follow");
    } catch {
      // Response headers may be immutable in some runtimes; ignore.
    }
  }
  return result;
});

const csrfMiddleware = createCsrfMiddleware({
  filter: (context) => context.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [csrfMiddleware, seoUrlCleanup, errorMiddleware],
}));
