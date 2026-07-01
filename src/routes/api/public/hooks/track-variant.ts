import { createFileRoute } from "@tanstack/react-router";

// Lightweight A/B variant analytics.
// POST /api/public/hooks/track-variant { slug, variant: "a"|"b", kind: "impression"|"click" }
// Never blocks the UI; the frontend calls it fire-and-forget from useEffect.
// Uses a SECURITY DEFINER RPC scoped to service_role so no one can inflate
// counters through the public Data API.
export const Route = createFileRoute("/api/public/hooks/track-variant")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            slug?: string;
            variant?: string;
            kind?: string;
          };
          const slug = String(body?.slug ?? "").slice(0, 120);
          const variant = String(body?.variant ?? "").toLowerCase();
          const kind = String(body?.kind ?? "").toLowerCase();
          if (!slug || (variant !== "a" && variant !== "b") || (kind !== "impression" && kind !== "click")) {
            return new Response(JSON.stringify({ ok: false, error: "bad_input" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin.rpc("increment_variant_metric", {
            _slug: slug,
            _variant: variant,
            _kind: kind,
          });
          return new Response(JSON.stringify({ ok: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          return new Response(JSON.stringify({ ok: false, error: String(e) }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});