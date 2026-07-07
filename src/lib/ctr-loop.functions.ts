import { createServerFn } from "@tanstack/react-start";
import { shouldGenerateNewVariant } from "@/lib/ctr-score";

/**
 * Manual/admin trigger: for every article whose on-site A/B CTR is
 * meaningfully below the site average, generate a fresh variant B using
 * the existing Lovable AI Gateway. Writes back into headline_variants.
 * Does NOT change URLs, titles, or slugs.
 *
 * Not scheduled — call from an admin action or add a cron later.
 */
export const refreshUnderperformingHeadlines = createServerFn({ method: "POST" }).handler(
  async () => {
    const lovableApiKey = process.env.LOVABLE_API_KEY;
    if (!lovableApiKey) return { ok: false, error: "LOVABLE_API_KEY missing" };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Pull recent rows with enough impressions to judge.
    const { data: rows, error } = await supabaseAdmin
      .from("daily_articles")
      .select(
        "slug,title,seo_headline,dek,headline_variants,variant_a_impressions,variant_b_impressions,variant_a_clicks,variant_b_clicks",
      )
      .gte("variant_a_impressions", 500)
      .order("published_at", { ascending: false })
      .limit(200);
    if (error) return { ok: false, error: error.message };

    // Compute site avg CTR from the same sample.
    const totals = (rows ?? []).reduce(
      (acc, r: any) => {
        const imp = (r.variant_a_impressions ?? 0) + (r.variant_b_impressions ?? 0);
        const clk = (r.variant_a_clicks ?? 0) + (r.variant_b_clicks ?? 0);
        acc.imp += imp;
        acc.clk += clk;
        return acc;
      },
      { imp: 0, clk: 0 },
    );
    const siteAvgCtr = totals.imp > 0 ? totals.clk / totals.imp : 0.02;

    const targets = (rows ?? []).filter((r: any) => shouldGenerateNewVariant(r, siteAvgCtr));
    if (targets.length === 0) return { ok: true, refreshed: 0, siteAvgCtr };

    let refreshed = 0;
    for (const row of targets as any[]) {
      try {
        const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Lovable-API-Key": lovableApiKey },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              {
                role: "system",
                content:
                  "Rewrite the headline for higher CTR on Google Discover. Rules: factual, 50–90 chars, no clickbait, must mention Texas or a Texas city where natural. Return JSON: {\"headline\":\"...\"}",
              },
              {
                role: "user",
                content: JSON.stringify({ title: row.seo_headline ?? row.title, dek: row.dek }),
              },
            ],
            response_format: { type: "json_object" },
          }),
          signal: AbortSignal.timeout(15000),
        });
        if (!r.ok) continue;
        const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
        const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as { headline?: string };
        const fresh = (parsed.headline ?? "").trim();
        if (fresh.length < 15 || fresh.length > 140) continue;

        const prev = (row.headline_variants ?? {}) as { a?: string; b?: string };
        const newVariants = { a: prev.a ?? row.seo_headline ?? row.title, b: fresh };

        const { error: upErr } = await supabaseAdmin
          .from("daily_articles")
          .update({
            headline_variants: newVariants,
            variant_b_impressions: 0,
            variant_b_clicks: 0,
          })
          .eq("slug", row.slug);
        if (!upErr) refreshed++;
      } catch {
        /* continue */
      }
    }
    return { ok: true, refreshed, siteAvgCtr };
  },
);