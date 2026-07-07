import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/public/hooks/health")({
  server: {
    handlers: {
      GET: async () => {
        const timestamp = new Date().toISOString();
        const supabaseUrl = process.env.SUPABASE_URL;
        const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

        if (!supabaseUrl || !publishableKey) {
          return Response.json({
            status: "degraded",
            timestamp,
            database: "error",
            articles_last_24h: null,
            latest_published_at: null,
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
            .order("published_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);

        const dbOk = !countRes.error && !latestRes.error;

        return Response.json({
          status: dbOk ? "ok" : "degraded",
          timestamp,
          database: dbOk ? "ok" : "error",
          articles_last_24h: dbOk ? (countRes.count ?? 0) : null,
          latest_published_at: dbOk ? (latestRes.data?.published_at ?? null) : null,
        });
      },
    },
  },
});