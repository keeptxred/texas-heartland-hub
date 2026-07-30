import { createFileRoute } from "@tanstack/react-router";
import { exploreSearchSchema } from "@/schemas/explore/public.schema";
import { searchExplore } from "@/services/explore/public.functions";

export const Route = createFileRoute("/api/public/explore/map")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const parsed = exploreSearchSchema.safeParse({
          ...Object.fromEntries(url.searchParams),
          page: 1,
          pageSize: 48,
        });
        if (!parsed.success)
          return Response.json(
            { error: { code: "invalid_bounds", issues: parsed.error.flatten() } },
            { status: 400 },
          );
        const result = await searchExplore({ data: parsed.data });
        return Response.json(
          {
            data: result.items
              .filter((item) => item.latitude != null && item.longitude != null)
              .map((item) => ({
                id: item.id,
                name: item.name,
                slug: item.slug,
                entityType: item.entityType,
                latitude: item.latitude,
                longitude: item.longitude,
              })),
          },
          { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } },
        );
      },
    },
  },
});
