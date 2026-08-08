import { createFileRoute } from "@tanstack/react-router";
import { aggregateNewsroomMetrics, type NewsroomFeedRow } from "@/lib/newsroom-metrics";

const ALLOWED_WINDOWS = new Set([24, 72, 168]);

function isAuthorized(request: Request) {
  const supplied = request.headers.get("x-admin-passcode") ?? "";
  const expected = process.env.ADMIN_PASSCODE ?? process.env.VITE_ADMIN_PASSCODE ?? "keeptxred";
  return supplied.length > 0 && supplied === expected;
}

function windowHours(request: Request): number {
  const value = Number(new URL(request.url).searchParams.get("hours") ?? "72");
  return ALLOWED_WINDOWS.has(value) ? value : 72;
}

export const Route = createFileRoute("/api/admin/newsroom-metrics")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!isAuthorized(request)) {
          return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        }

        const hours = windowHours(request);
        const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("texas_news_feed")
          .select("id,pub_date,internal_slug,cluster_json,viral_signals")
          .gte("pub_date", since)
          .order("pub_date", { ascending: false })
          .limit(1500);

        if (error) {
          return Response.json({ ok: false, error: error.message }, { status: 500 });
        }

        const rows = (data ?? []) as NewsroomFeedRow[];
        return Response.json({
          ok: true,
          windowHours: hours,
          since,
          generatedAt: new Date().toISOString(),
          metrics: aggregateNewsroomMetrics(rows),
          definitions: {
            uniqueClusters: "Deduplicated multi-source cluster snapshots in the selected window.",
            confirmations: "New source coverage attached to an existing article without a new rewrite.",
            followUps: "Materially new developments routed as distinct follow-up coverage.",
            multiSourceSyntheses: "Multi-source clusters synthesized as one story rather than one story per source.",
            sourceRelationshipsAdded: "Additional independent source relationships beyond each cluster primary.",
            estimatedRewriteCallsAvoided: "Conservative estimate versus a one-rewrite-per-source baseline; confirmation reuse counts as one avoided rewrite.",
          },
        });
      },
    },
  },
});
