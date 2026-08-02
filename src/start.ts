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

// SEO URL cleanup: consolidate legacy URLs, remove tracking parameters, and
// noindex only recognized search/filter/sort states instead of every query URL.
const REDIRECT_PATHS = new Set(["/texas-news", "/texas-business"]);
const LEGACY_ELECTION_PATHS = new Map([
  ["/election", "/elections/2026"],
  ["/election-central", "/elections/2026"],
  ["/texas-elections", "/elections/2026"],
  ["/elections-2026", "/elections/2026"],
  ["/elections/2026/", "/elections/2026"],
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

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function isTrackingParam(name: string): boolean {
  const normalized = name.toLowerCase();
  return normalized.startsWith("utm_") || TRACKING_PARAMS.has(normalized);
}

function stripTrackingParams(url: URL): URL | null {
  const cleaned = new URL(url.toString());
  let changed = false;
  for (const key of Array.from(cleaned.searchParams.keys())) {
    if (!isTrackingParam(key)) continue;
    cleaned.searchParams.delete(key);
    changed = true;
  }
  return changed ? cleaned : null;
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

  // Consolidate every www URL into the non-www canonical host. Keep the full
  // path and query so old links transfer their signals to the matching page.
  if (canRedirect && requestHost === "www.keeptxred.com") {
    return new Response(null, {
      status: 301,
      headers: {
        location: `${CANONICAL_ORIGIN}${url.pathname}${url.search}`,
        "cache-control": "public, max-age=86400",
      },
    });
  }

  const normalizedElectionPath =
    url.pathname.startsWith("/elections/") && url.pathname.endsWith("/")
      ? url.pathname.slice(0, -1)
      : null;
  if (canRedirect && normalizedElectionPath) {
    return new Response(null, {
      status: 301,
      headers: {
        location: `${normalizedElectionPath}${url.search}`,
        "cache-control": "public, max-age=86400",
      },
    });
  }

  const legacyContentTarget = LEGACY_CONTENT_PATHS.get(url.pathname.toLowerCase());
  if (canRedirect && legacyContentTarget) {
    return new Response(null, {
      status: 301,
      headers: {
        location: `${legacyContentTarget}${url.search}`,
        "cache-control": "public, max-age=86400",
      },
    });
  }

  const legacyElectionTarget = LEGACY_ELECTION_PATHS.get(url.pathname.toLowerCase());
  if (canRedirect && legacyElectionTarget) {
    return new Response(null, {
      status: 301,
      headers: {
        location: `${legacyElectionTarget}${url.search}`,
        "cache-control": "public, max-age=86400",
      },
    });
  }

  if (url.pathname.startsWith("/lovable/") || url.pathname === "/email/unsubscribe") {
    return next();
  }

  const topic = url.searchParams.get("topic");
  if (canRedirect && topic && REDIRECT_PATHS.has(url.pathname)) {
    const slug = slugify(topic);
    if (slug) {
      const target = new URL(`${url.pathname}/${slug}`, CANONICAL_ORIGIN);
      for (const [key, value] of url.searchParams.entries()) {
        if (key.toLowerCase() !== "topic" && !isTrackingParam(key)) {
          target.searchParams.append(key, value);
        }
      }
      return new Response(null, {
        status: 301,
        headers: {
          location: `${target.pathname}${target.search}`,
          "cache-control": "public, max-age=86400",
        },
      });
    }
  }

  // Tracking parameters never change page content. Remove them in one hop
  // while preserving legitimate functional parameters such as shop category.
  const cleanedTrackingUrl = canRedirect ? stripTrackingParams(url) : null;
  if (cleanedTrackingUrl) {
    return new Response(null, {
      status: 301,
      headers: {
        location: `${cleanedTrackingUrl.pathname}${cleanedTrackingUrl.search}`,
        "cache-control": "public, max-age=86400",
      },
    });
  }

  const result = await next();

  // Shareable filters and UI states remain usable, but they should not compete
  // with their clean canonical route in search results. Unknown parameters are
  // no longer blanket-noindexed; route-level metadata can decide their policy.
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
