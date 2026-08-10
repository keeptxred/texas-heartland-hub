import { createFileRoute } from "@tanstack/react-router";

const canyonSourceUrl = "https://www.mysanantonio.com/lifestyle/outdoors/article/canyon-lake-water-levels-22374263.php";

export const Route = createFileRoute("/api/public/cross-site-publication-health")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const [collisionResult, canyonKtrResult, canyonTdResult] = await Promise.all([
          supabaseAdmin
            .from("cross_site_publication_collisions" as never)
            .select("slug", { count: "exact", head: true }),
          supabaseAdmin
            .from("daily_articles" as never)
            .select("slug", { count: "exact", head: true })
            .eq("source_url", canyonSourceUrl),
          supabaseAdmin
            .from("texasdefined_articles" as never)
            .select("slug,source_url,status")
            .eq("source_url", canyonSourceUrl)
            .eq("status", "published")
            .limit(1),
        ]);

        const errors = [collisionResult.error?.message, canyonKtrResult.error?.message, canyonTdResult.error?.message].filter(Boolean);
        if (errors.length > 0) {
          return new Response(JSON.stringify({ ok: false, errors }), {
            status: 503,
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
          });
        }

        const texasDefinedRows = (canyonTdResult.data ?? []) as unknown as Array<{ slug: string; source_url: string | null; status: string }>;
        const payload = {
          ok: (collisionResult.count ?? 0) === 0 && (canyonKtrResult.count ?? 0) === 0,
          collisionCount: collisionResult.count ?? 0,
          canyonKeepTxRedDuplicateCount: canyonKtrResult.count ?? 0,
          canyonTexasDefinedPublished: texasDefinedRows.length === 1,
          canyonTexasDefinedSlug: texasDefinedRows[0]?.slug ?? null,
          canyonSourceUrl,
          checkedAt: new Date().toISOString(),
        };

        return new Response(JSON.stringify(payload), {
          status: payload.ok ? 200 : 409,
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        });
      },
    },
  },
});
