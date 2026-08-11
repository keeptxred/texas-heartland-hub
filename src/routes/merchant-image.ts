import { createFileRoute } from "@tanstack/react-router";

function isAllowedPrintifyImage(url: URL): boolean {
  return url.protocol === "https:" &&
    (url.hostname === "printify.com" || url.hostname.endsWith(".printify.com"));
}

function errorResponse(message: string, status: number): Response {
  return new Response(message, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/**
 * First-party image endpoint for Google Merchant Center.
 *
 * Product mockups originate on Printify-owned hosts. Merchant Center can reject
 * a product when either the landing page OR its image is blocked by robots.txt.
 * Proxying only allowlisted Printify images through keeptxred.com makes the
 * image crawl policy ours instead of depending on a third-party robots file.
 */
export const Route = createFileRoute("/merchant-image")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const source = new URL(request.url).searchParams.get("src");
        if (!source) return errorResponse("Missing src", 400);

        let target: URL;
        try {
          target = new URL(source);
        } catch {
          return errorResponse("Invalid src", 400);
        }

        if (!isAllowedPrintifyImage(target)) {
          return errorResponse("Image host not allowed", 403);
        }

        try {
          const upstream = await fetch(target, {
            redirect: "error",
            headers: {
              Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
              "User-Agent": "KeepTXRed-Merchant-Image/1.0",
            },
          });

          if (!upstream.ok || !upstream.body) {
            return errorResponse("Image unavailable", 502);
          }

          const contentType = upstream.headers.get("content-type") ?? "";
          if (!contentType.toLowerCase().startsWith("image/")) {
            return errorResponse("Invalid image response", 502);
          }

          const headers = new Headers({
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
            "X-Content-Type-Options": "nosniff",
            "Access-Control-Allow-Origin": "*",
          });

          const contentLength = upstream.headers.get("content-length");
          if (contentLength) headers.set("Content-Length", contentLength);

          return new Response(upstream.body, { status: 200, headers });
        } catch {
          return errorResponse("Image unavailable", 502);
        }
      },
    },
  },
});
