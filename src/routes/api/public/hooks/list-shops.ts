import { createFileRoute } from "@tanstack/react-router";
import { getShops } from "@/lib/printify.server";

export const Route = createFileRoute("/api/public/hooks/list-shops")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const shops = await getShops();
          return Response.json({ ok: true, shops });
        } catch (e) {
          return Response.json({ ok: false, error: (e as Error).message }, { status: 500 });
        }
      },
    },
  },
});