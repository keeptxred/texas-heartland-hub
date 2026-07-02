import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  return await next().catch(handleMiddlewareError);
});

async function handleMiddlewareError(error: unknown): Promise<Response> {
  if (error != null && typeof error === "object" && "statusCode" in error) {
    throw error;
  }
  console.error(error);
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// Bypass all app-level middleware for /lovable/* internal routes
// (email queue processing, webhooks, previews). Each handler authenticates itself.
const bypassLovableRoutes = createMiddleware().server(async ({ next, request }) => {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/lovable/") || url.pathname === "/email/unsubscribe") {
    return next();
  }
  return next();
});

const errorMiddlewareLegacy = createMiddleware().server(async ({ next }) => {
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
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const seoUrlCleanup = createMiddleware().server(async ({ next, request }) => {
  const url = new URL(request.url);
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
