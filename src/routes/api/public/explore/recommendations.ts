import { createFileRoute } from "@tanstack/react-router";
import { tripPreferencesSchema } from "@/schemas/explore/public.schema";
import { generateExploreTrip } from "@/services/explore/public.functions";

export const Route = createFileRoute("/api/public/explore/recommendations")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const contentLength = Number(request.headers.get("content-length") ?? 0);
        if (contentLength > 16_384)
          return Response.json({ error: { code: "payload_too_large" } }, { status: 413 });
        const body = await request.json().catch(() => null);
        const parsed = tripPreferencesSchema.safeParse(body);
        if (!parsed.success)
          return Response.json(
            { error: { code: "invalid_preferences", issues: parsed.error.flatten() } },
            { status: 400 },
          );
        const trip = await generateExploreTrip({ data: parsed.data });
        return Response.json({ data: trip }, { headers: { "Cache-Control": "no-store" } });
      },
    },
  },
});
