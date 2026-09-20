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
  actual_target_site: string | null;
  actual_target_section: string | null;
  ready_for_rewrite: boolean | null;
  auto_publish_eligible: boolean;
  internal_slug: string | null;
  disposition_consistent: boolean;
  publication_hold_safe: boolean;
};

export const Route = createFileRoute("/api/public/flyover-aug10-health")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const result = await supabaseAdmin
          .from("flyover_aug10_reconciliation_health" as never)
          .select("story_key,expected_site,disposition,feed_id,feed_title,published_slug,evidence_note,last_verified_at,actual_target_site,actual_target_section,ready_for_rewrite,auto_publish_eligible,internal_slug,disposition_consistent,publication_hold_safe")
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
        const unsafeRows = stories.filter((row) => !row.disposition_consistent || !row.publication_hold_safe);
        const completeBenchmark = stories.length === 23;
        const safe = completeBenchmark && unsafeRows.length === 0;

        return new Response(JSON.stringify({
          ok: safe,
          ledgerReady: true,
          benchmarkSize: 23,
          storyCount: stories.length,
          completeBenchmark,
          safe,
          unsafeCount: unsafeRows.length,
          unsafeStoryKeys: unsafeRows.map((row) => row.story_key),
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
          status: safe ? 200 : 503,
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        });
      },
    },
  },
});
