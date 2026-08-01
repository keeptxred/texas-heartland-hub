import { createFileRoute } from "@tanstack/react-router";
import { isAllowedOfficialBillTextUrl, officialHtmlToText } from "@/lib/official-bill-text";

const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024;

export const Route = createFileRoute("/api/public/official-bill-text")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const sourceUrl = new URL(request.url).searchParams.get("url") ?? "";
        if (!isAllowedOfficialBillTextUrl(sourceUrl))
          return Response.json({ error: "Invalid official bill-text URL." }, { status: 400 });
        try {
          const response = await fetch(sourceUrl, {
            headers: {
              Accept: "text/html, text/plain;q=0.9",
              "User-Agent": "KeepTXRedBillTextViewer/1.0 (+https://keeptxred.com)",
            },
            signal: AbortSignal.timeout(20_000),
          });
          if (!response.ok)
            return Response.json(
              { error: "The official document is not currently available." },
              { status: 502 },
            );
          const contentLength = Number(response.headers.get("content-length") ?? 0);
          if (contentLength > MAX_DOCUMENT_BYTES)
            return Response.json(
              { error: "The official document is too large to display." },
              { status: 413 },
            );
          const html = await response.text();
          if (html.length > MAX_DOCUMENT_BYTES)
            return Response.json(
              { error: "The official document is too large to display." },
              { status: 413 },
            );
          const text = officialHtmlToText(html);
          if (!text)
            return Response.json(
              { error: "The official document contained no readable text." },
              { status: 502 },
            );
          return Response.json(
            { text, sourceUrl, retrievedAt: new Date().toISOString() },
            {
              headers: {
                "Cache-Control":
                  "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
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
            { status: 502 },
          );
        }
      },
    },
  },
});
