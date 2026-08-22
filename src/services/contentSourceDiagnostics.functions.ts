import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({ token: z.string().min(1) });

export type SourceDiagnosticRow = {
  source_name: string;
  category: string | null;
  rss_url: string | null;
  health_status: string;
  latest_item_at: string | null;
  items_7d: number | null;
};

type SourceHealthViewRow = {
  source_name: string;
  category: string | null;
  rss_url: string | null;
  latest_item_at: string | null;
  items_7d: number | null;
  health_status: string | null;
};

export type SourceDiagnostics = {
  enabled: number;
  rssConfigured: number;
  healthy: number;
  contributing7d: number;
  rows: SourceDiagnosticRow[];
};

export const getContentSourceDiagnosticsFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }): Promise<{ ok: true; diagnostics: SourceDiagnostics } | { ok: false; error: string }> => {
    const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
    if (data.token !== expected) return { ok: false, error: "Unauthorized" };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [sourcesRes, healthRes] = await Promise.all([
      supabaseAdmin
        .from("content_sources")
        .select("source_name,category,rss_url,enabled")
        .eq("enabled", true)
        .order("source_name", { ascending: true }),
      // news_source_health is a production SQL view that predates the generated
      // Supabase TypeScript view definitions. Keep this one view boundary
      // explicit instead of weakening the typed client globally.
      (supabaseAdmin as any)
        .from("news_source_health")
        .select("source_name,category,rss_url,latest_item_at,items_7d,health_status"),
    ]);

    if (sourcesRes.error) return { ok: false, error: sourcesRes.error.message };
    if (healthRes.error) return { ok: false, error: healthRes.error.message };

    const healthRows = (healthRes.data ?? []) as SourceHealthViewRow[];
    const healthByName = new Map(
      healthRows.map((row) => [String(row.source_name).trim().toLowerCase(), row]),
    );

    const rows: SourceDiagnosticRow[] = (sourcesRes.data ?? []).map((source) => {
      const health = healthByName.get(String(source.source_name).trim().toLowerCase());
      const rssUrl = typeof source.rss_url === "string" && source.rss_url.trim() ? source.rss_url.trim() : null;
      return {
        source_name: String(source.source_name),
        category: source.category ?? null,
        rss_url: rssUrl,
        health_status: rssUrl ? String(health?.health_status ?? "never_seen") : "no_rss",
        latest_item_at: health?.latest_item_at ?? null,
        items_7d: health?.items_7d == null ? null : Number(health.items_7d),
      };
    });

    const priority: Record<string, number> = {
      never_seen: 0,
      stale: 1,
      quiet: 2,
      no_rss: 3,
      healthy: 4,
    };
    rows.sort((a, b) => {
      const pa = priority[a.health_status] ?? 2;
      const pb = priority[b.health_status] ?? 2;
      if (pa !== pb) return pa - pb;
      return a.source_name.localeCompare(b.source_name);
    });

    return {
      ok: true,
      diagnostics: {
        enabled: rows.length,
        rssConfigured: rows.filter((row) => Boolean(row.rss_url)).length,
        healthy: rows.filter((row) => row.health_status === "healthy").length,
        contributing7d: rows.filter((row) => Number(row.items_7d ?? 0) > 0).length,
        rows,
      },
    };
  });
