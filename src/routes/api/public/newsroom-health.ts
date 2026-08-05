import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/newsroom-health")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const [gapResult, sourceResult] = await Promise.all([
          supabaseAdmin
            .from("news_coverage_gaps" as never)
            .select("id", { count: "exact", head: true }),
          supabaseAdmin
            .from("news_source_health" as never)
            .select("source_name,health_status,items_24h,items_7d,covered_7d"),
        ]);

        const errors = [gapResult.error?.message, sourceResult.error?.message].filter(Boolean);
        if (errors.length > 0) {
          return new Response(
            JSON.stringify({
              ok: false,
              databaseViewsReady: false,
              errors,
            }),
            {
              status: 503,
              headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
            },
          );
        }

        const sources = (sourceResult.data ?? []) as unknown as Array<{
          source_name: string;
          health_status: string;
          items_24h: number;
          items_7d: number;
          covered_7d: number;
        }>;
        const statusCounts = sources.reduce<Record<string, number>>((acc, row) => {
          acc[row.health_status] = (acc[row.health_status] ?? 0) + 1;
          return acc;
        }, {});

        return new Response(
          JSON.stringify({
            ok: true,
            databaseViewsReady: true,
            coverageGapCount: gapResult.count ?? 0,
            sourceCount: sources.length,
            sourceStatusCounts: statusCounts,
            items24h: sources.reduce((sum, row) => sum + Number(row.items_24h || 0), 0),
            items7d: sources.reduce((sum, row) => sum + Number(row.items_7d || 0), 0),
            covered7d: sources.reduce((sum, row) => sum + Number(row.covered_7d || 0), 0),
            checkedAt: new Date().toISOString(),
          }),
          {
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
          },
        );
      },
    },
  },
});
