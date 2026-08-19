import { createFileRoute } from "@tanstack/react-router";
import {
  isAllowedOfficialBillTextContentType,
  isAllowedOfficialBillTextUrl,
  officialHtmlToText,
  readResponseTextWithLimit,
} from "@/lib/official-bill-text";

const ERROR_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

export const Route = createFileRoute("/api/public/official-bill-text")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const sourceUrl = new URL(request.url).searchParams.get("url") ?? "";
        if (!isAllowedOfficialBillTextUrl(sourceUrl)) {
          return Response.json(
            { error: "Invalid official bill-text URL." },
            { status: 400, headers: ERROR_HEADERS },
          );
        }

        try {
          const response = await fetch(sourceUrl, {
            headers: {
              Accept: "text/html, text/plain;q=0.9, application/xhtml+xml;q=0.8",
              "User-Agent": "KeepTXRedBillTextViewer/2.0 (+https://keeptxred.com)",
            },
            redirect: "manual",
            signal: AbortSignal.timeout(15_000),
          });

          if (response.status >= 300 && response.status < 400) {
            return Response.json(
              { error: "The official source redirected unexpectedly. Open it directly instead." },
              { status: 502, headers: ERROR_HEADERS },
            );
          }
          if (!response.ok) {
            return Response.json(
              { error: "The official document is not currently available." },
              { status: 502, headers: ERROR_HEADERS },
            );
          }
          if (!isAllowedOfficialBillTextContentType(response.headers.get("content-type"))) {
            return Response.json(
              { error: "The official source returned an unsupported document type." },
              { status: 502, headers: ERROR_HEADERS },
            );
          }

          let html: string;
          try {
            html = await readResponseTextWithLimit(response);
          } catch (error) {
            if (error instanceof RangeError) {
              return Response.json(
                { error: "The official document is too large to display." },
                { status: 413, headers: ERROR_HEADERS },
              );
            }
            throw error;
          }

          const text = officialHtmlToText(html);
          if (!text) {
            return Response.json(
              { error: "The official document contained no readable text." },
              { status: 502, headers: ERROR_HEADERS },
            );
          }

          return Response.json(
            { text, sourceUrl, retrievedAt: new Date().toISOString() },
            {
              headers: {
                "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
                "X-Content-Type-Options": "nosniff",
              },
            },
          );
        } catch (error) {
          console.error("[official-bill-text] fetch failed", {
            sourceUrl,
            error: error instanceof Error ? error.message : String(error),
          });
          return Response.json(
            { error: "The official source is temporarily unavailable." },
            { status: 502, headers: ERROR_HEADERS },
          );
        }
      },
    },
  },
});
