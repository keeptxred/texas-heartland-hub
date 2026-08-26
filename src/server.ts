import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { installDirectAiFetch } from "./lib/direct-ai-fetch";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

const CANONICAL_HOST = "keeptxred.com";
const WWW_HOST = `www.${CANONICAL_HOST}`;
const CITY_MIGRATION_REDIRECTS: Readonly<Record<string, string>> = {
  "/austin": "https://texasdefined.com/article/moving-to-austin-guide",
  "/dallas-fort-worth": "https://texasdefined.com/article/moving-to-dallas-fort-worth-guide",
  "/san-antonio": "https://texasdefined.com/article/moving-to-san-antonio-guide",
  "/el-paso": "https://texasdefined.com/article/moving-to-el-paso-guide",
};

export function canonicalHostRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  const isSiteHost = url.hostname === CANONICAL_HOST || url.hostname === WWW_HOST;
  if (!isSiteHost) return null;
  if (url.hostname === CANONICAL_HOST && url.protocol === "https:") return null;

  url.protocol = "https:";
  url.hostname = CANONICAL_HOST;
  url.port = "";
  return Response.redirect(url.toString(), 308);
}

export function cityMigrationRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  const target = CITY_MIGRATION_REDIRECTS[url.pathname];
  if (!target) return null;

  const destination = new URL(target);
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

    const cityRedirect = cityMigrationRedirect(request);
    if (cityRedirect) return cityRedirect;

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
