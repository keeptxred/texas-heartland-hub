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

// SEO URL cleanup: 301 redirect legacy URLs to their clean canonical paths,
// and mark remaining query-string URLs as noindex to avoid thin duplicates.
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
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const seoUrlCleanup = createMiddleware().server(async ({ next, request }) => {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const requestHost = (forwardedHost || url.host).toLowerCase();

  // Consolidate every www URL into the non-www canonical host. Keep the full
  // path and query so old links transfer their signals to the matching page.
  if (requestHost === "www.keeptxred.com") {
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
  if (normalizedElectionPath) {
    return new Response(null, {
      status: 301,
      headers: {
        location: `${normalizedElectionPath}${url.search}`,
        "cache-control": "public, max-age=86400",
      },
    });
  }

  const legacyContentTarget = LEGACY_CONTENT_PATHS.get(url.pathname.toLowerCase());
  if (legacyContentTarget) {
    return new Response(null, {
      status: 301,
      headers: {
        location: `${legacyContentTarget}${url.search}`,
        "cache-control": "public, max-age=86400",
      },
    });
  }

  const legacyElectionTarget = LEGACY_ELECTION_PATHS.get(url.pathname.toLowerCase());
  if (legacyElectionTarget) {
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
  if (topic && REDIRECT_PATHS.has(url.pathname)) {
    const slug = slugify(topic);
    if (slug) {
      return new Response(null, {
        status: 301,
        headers: { location: `${url.pathname}/${slug}` },
      });
    }
  }
  const result = await next();
  if (url.search) {
    try {
      result.response.headers.set("X-Robots-Tag", "noindex, follow");
    } catch {
      // response headers may be immutable in some runtimes; ignore.
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
