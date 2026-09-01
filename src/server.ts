import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { installDirectAiFetch } from "./lib/direct-ai-fetch";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

const CANONICAL_HOST = "keeptxred.com";
const WWW_HOST = `www.${CANONICAL_HOST}`;
const ADS_TXT = "google.com, pub-1891256141359926, DIRECT, f08c47fec0942fa0\n";
const TEXAS_DEFINED_ORIGIN = "https://texasdefined.com";
const CITY_MIGRATION_REDIRECTS: Readonly<Record<string, string>> = {
  "/austin": "https://texasdefined.com/article/moving-to-austin-guide",
  "/dallas-fort-worth": "https://texasdefined.com/article/moving-to-dallas-fort-worth-guide",
  "/san-antonio": "https://texasdefined.com/article/moving-to-san-antonio-guide",
  "/el-paso": "https://texasdefined.com/article/moving-to-el-paso-guide",
};

export function canonicalHostRedirect(request: Request): Response | null {
  const url = new URL(request.url);

  // Google explicitly crawls ads.txt over both HTTP and HTTPS and may begin at
  // either the apex or www host. Keep this machine-readable file out of the
  // normal canonical-host redirect path so every KTR hostname the Worker owns
  // can answer it directly with HTTP 200.
  if (url.pathname === "/ads.txt") return null;

  const isSiteHost = url.hostname === CANONICAL_HOST || url.hostname === WWW_HOST;
  if (!isSiteHost) return null;
  if (url.hostname === CANONICAL_HOST && url.protocol === "https:") return null;

  url.protocol = "https:";
  url.hostname = CANONICAL_HOST;
  url.port = "";
  return Response.redirect(url.toString(), 308);
}

export function adsTxtResponse(request: Request): Response | null {
  const url = new URL(request.url);
  if (url.pathname !== "/ads.txt") return null;
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD" },
    });
  }

  return new Response(request.method === "HEAD" ? null : ADS_TXT, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function cityMigrationRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  const target = CITY_MIGRATION_REDIRECTS[url.pathname];
  if (!target) return null;

  const destination = new URL(target);
  destination.search = url.search;
  return Response.redirect(destination.toString(), 301);
}

export function exploreMigrationRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  if (url.pathname !== "/explore" && !url.pathname.startsWith("/explore/")) return null;

  const destination = new URL(TEXAS_DEFINED_ORIGIN);
  destination.pathname = url.pathname;
  destination.search = url.search;
  return Response.redirect(destination.toString(), 301);
}

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (module) => (module.default ?? module) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const canonicalRedirect = canonicalHostRedirect(request);
    if (canonicalRedirect) return canonicalRedirect;

    const adsTxt = adsTxtResponse(request);
    if (adsTxt) return adsTxt;

    const cityRedirect = cityMigrationRedirect(request);
    if (cityRedirect) return cityRedirect;

    const exploreRedirect = exploreMigrationRedirect(request);
    if (exploreRedirect) return exploreRedirect;

    try {
      installDirectAiFetch();
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
