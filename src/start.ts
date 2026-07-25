import { createStart, createMiddleware } from "@tanstack/react-start";

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

// SEO URL cleanup: 301 redirect legacy /texas-news?topic=X style URLs to
// clean path-based /texas-news/X, and mark any remaining query-string URL
// as noindex so Google doesn't index thin duplicate pages.
const REDIRECT_PATHS = new Set(["/texas-news", "/texas-business"]);
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

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [seoUrlCleanup, errorMiddleware],
}));
