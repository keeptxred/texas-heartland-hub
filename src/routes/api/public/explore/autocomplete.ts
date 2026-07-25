import { createFileRoute } from "@tanstack/react-router";
import { autocompleteExplore } from "@/services/explore/public.functions";

export const Route = createFileRoute("/api/public/explore/autocomplete")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
        if (q.length < 2 || q.length > 80) {
          return Response.json(
            { error: { code: "invalid_query", message: "Query must contain 2–80 characters." } },
            { status: 400 },
          );
        }
        const items = await autocompleteExplore({ data: { q, limit: 8 } });
        return Response.json(
          { data: items },
          { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } },
        );
      },
    },
  },
});
