import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

function aiProviderState() {
  const ready = Boolean(
    process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_API_KEY,
  );
  return {
    ai_provider: ready ? "google-gemini-direct" : "unconfigured",
    ai_provider_ready: ready,
    rewrite_provider: ready ? "google-gemini-direct" : "unconfigured",
    rewrite_provider_ready: ready,
    rewrite_model: ready ? "gemini-2.5-flash-lite" : null,
    image_provider: ready ? "google-gemini-direct" : "unconfigured",
    image_provider_ready: ready,
    image_model: ready ? (process.env.AI_IMAGE_MODEL || "gemini-3.1-flash-image") : null,
    image_validation_model: ready ? (process.env.AI_VALIDATION_MODEL || "gemini-3.5-flash") : null,
    lovable_rewrite_bypassed: ready,
    lovable_image_bypassed: ready,
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
          status: dbOk && !publishingStalled ? "ok" : "degraded",
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