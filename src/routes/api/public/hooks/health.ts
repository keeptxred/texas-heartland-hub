import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

function aiProviderState() {
  const ready = Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN,
  );
  const rewriteModel = process.env.AI_REWRITE_MODEL_CF || "@cf/meta/llama-3.1-8b-instruct-fast";
  return {
    ai_provider: ready ? "cloudflare-workers-ai" : "unconfigured",
    ai_provider_ready: ready,
    rewrite_provider: ready ? "cloudflare-workers-ai" : "unconfigured",
    rewrite_provider_ready: ready,
    rewrite_model: ready ? rewriteModel : null,
    image_provider: ready ? "cloudflare-workers-ai" : "unconfigured",
    image_provider_ready: ready,
    image_model: ready ? "@cf/lykon/dreamshaper-8-lcm" : null,
    image_validation_model: ready ? "@cf/meta/llama-3.2-11b-vision-instruct" : null,
    lovable_rewrite_bypassed: true,
    lovable_image_bypassed: true,
    lovable_ai_network_disabled: true,
    lovable_ai_fallback_allowed: false,
  };
}

export const Route = createFileRoute("/api/public/hooks/health")({
  server: {
    handlers: {
      GET: async () => {
        const timestamp = new Date().toISOString();
        const supabaseUrl = process.env.SUPABASE_URL;
        const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
        const ai = aiProviderState();

        if (!supabaseUrl || !publishableKey) {
          return Response.json({
            status: "degraded",
            timestamp,
            database: "error",
            articles_last_24h: null,
            latest_published_at: null,
            ...ai,
          });
        }

        const supabase = createClient(supabaseUrl, publishableKey, {
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
        });

        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const [countRes, latestRes] = await Promise.all([
          supabase
            .from("daily_articles")
            .select("*", { count: "exact", head: true })
            .gte("created_at", since),
          supabase
            .from("daily_articles")
            .select("published_at")
            .or("source_name.neq.Keep TX Red Reserve Desk,source_name.is.null")
            .order("published_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);

        const dbOk = !countRes.error && !latestRes.error;
        const latestPublishedAt = latestRes.data?.published_at ?? null;
        const publishingStalled =
          dbOk &&
          (!latestPublishedAt ||
            Date.now() - Date.parse(latestPublishedAt) >= 24 * 60 * 60 * 1000);

        return Response.json({
          status: dbOk && !publishingStalled && ai.ai_provider_ready ? "ok" : "degraded",
          timestamp,
          database: dbOk ? "ok" : "error",
          articles_last_24h: dbOk ? (countRes.count ?? 0) : null,
          latest_published_at: dbOk ? latestPublishedAt : null,
          publishing_stalled: dbOk ? publishingStalled : null,
          publishing_stall_threshold_hours: 24,
          ...ai,
        });
      },
    },
  },
});