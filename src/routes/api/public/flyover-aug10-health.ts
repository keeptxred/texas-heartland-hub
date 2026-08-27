import { createFileRoute } from "@tanstack/react-router";

type FlyoverLedgerRow = {
  story_key: string;
  expected_site: "keeptxred" | "texasdefined";
  disposition: "published" | "review_ready" | "source_needed" | "out_of_scope";
  feed_id: number | null;
  feed_title: string | null;
  published_slug: string | null;
  evidence_note: string;
  last_verified_at: string;
};

export const Route = createFileRoute("/api/public/flyover-aug10-health")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const result = await supabaseAdmin
          .from("flyover_aug10_reconciliation" as never)
          .select("story_key,expected_site,disposition,feed_id,feed_title,published_slug,evidence_note,last_verified_at")
          .order("story_key", { ascending: true });

        if (result.error) {
          return new Response(JSON.stringify({ ok: false, ledgerReady: false, error: result.error.message }), {
            status: 503,
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
          });
        }

        const stories = (result.data ?? []) as unknown as FlyoverLedgerRow[];
        const counts = stories.reduce<Record<string, number>>((acc, row) => {
          acc[row.disposition] = (acc[row.disposition] ?? 0) + 1;
          return acc;
        }, {});
        const expectedSiteCounts = stories.reduce<Record<string, number>>((acc, row) => {
          acc[row.expected_site] = (acc[row.expected_site] ?? 0) + 1;
          return acc;
        }, {});

        return new Response(JSON.stringify({
          ok: stories.length === 23,
          ledgerReady: true,
          benchmarkSize: 23,
          storyCount: stories.length,
          completeBenchmark: stories.length === 23,
          counts: {
            published: counts.published ?? 0,
            reviewReady: counts.review_ready ?? 0,
            sourceNeeded: counts.source_needed ?? 0,
            outOfScope: counts.out_of_scope ?? 0,
          },
          expectedSiteCounts,
          unresolvedCount: (counts.review_ready ?? 0) + (counts.source_needed ?? 0),
          stories,
          checkedAt: new Date().toISOString(),
        }), {
          status: stories.length === 23 ? 200 : 503,
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        });
      },
    },
  },
});
