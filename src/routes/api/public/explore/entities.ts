import { createFileRoute } from "@tanstack/react-router";
import { exploreSearchSchema } from "@/schemas/explore/public.schema";
import { searchExplore } from "@/services/explore/public.functions";

const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwarded || "unknown";
  const now = Date.now();
  const current = hits.get(key);
  if (!current || current.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + 60_000 });
    return null;
  }
  current.count += 1;
  if (current.count > 60) return Math.ceil((current.resetAt - now) / 1000);
  return null;
}

export const Route = createFileRoute("/api/public/explore/entities")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const retryAfter = rateLimit(request);
        const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
        if (retryAfter) {
          return Response.json(
            { error: { code: "rate_limited", message: "Too many requests.", requestId } },
            { status: 429, headers: { "Retry-After": String(retryAfter) } },
          );
        }
        const url = new URL(request.url);
        const input = Object.fromEntries(url.searchParams);
        const parsed = exploreSearchSchema.safeParse(input);
        if (!parsed.success) {
          return Response.json(
            {
              error: {
                code: "invalid_request",
                message: "Invalid Explore search parameters.",
                issues: parsed.error.flatten(),
                requestId,
              },
            },
            { status: 400 },
          );
        }
        try {
          const result = await searchExplore({ data: parsed.data });
          return Response.json(
            {
              data: result.items,
              pagination: { page: result.page, pageSize: result.pageSize, total: result.total },
              requestId,
            },
            {
              headers: {
                "Cache-Control": "public, max-age=60, s-maxage=300",
                "X-Request-Id": requestId,
              },
            },
          );
        } catch (error) {
          console.error("[explore-api] entity search failed", {
            requestId,
            error: error instanceof Error ? error.message : String(error),
          });
          return Response.json(
            {
              error: {
                code: "search_failed",
                message: "Explore search is temporarily unavailable.",
                requestId,
              },
            },
            { status: 503 },
          );
        }
      },
    },
  },
});
