import { createFileRoute } from "@tanstack/react-router";
import { persistEventCluster } from "@/lib/event-cluster-persistence";
import {
  planHistoricalReconciliation,
  reconciliationSummary,
  type HistoricalFeedItem,
  type HistoricalReconciliationPlan,
} from "@/lib/historical-event-reconciliation";
import { buildStructuredFactLedger, persistStructuredFacts } from "@/lib/structured-fact-provenance";

const DEFAULT_DAYS = 30;
const MAX_DAYS = 90;
const DEFAULT_LIMIT = 500;
const MAX_LIMIT = 1500;

function numericParam(url: URL, name: string, fallback: number, min: number, max: number): number {
  const value = Number(url.searchParams.get(name) ?? fallback);
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(value)));
}

function isAuthorizedApply(request: Request): boolean {
  const expected = process.env.NEWSROOM_HOOK_TOKEN || process.env.ADMIN_PASSCODE;
  if (!expected) return false;
  return request.headers.get("x-newsroom-hook-token") === expected
    || request.headers.get("x-admin-passcode") === expected;
}

async function mergeReconciliationMetadata(db: any, clusterId: string, plan: HistoricalReconciliationPlan, applied: boolean) {
  const { data } = await db.from("news_event_clusters").select("metadata").eq("id", clusterId).maybeSingle();
  const previous = data?.metadata && typeof data.metadata === "object" ? data.metadata : {};
  const reconciliation = {
    version: 1,
    status: plan.kind === "safe" ? "backfilled" : "hold_multiple_published_slugs",
    canonical_slug: plan.canonicalSlug,
    published_slugs: plan.publishedSlugs,
    feed_item_ids: plan.feedItemIds,
    source_families: plan.sourceFamilies,
    reason: plan.reason,
    applied,
    reconciled_at: new Date().toISOString(),
  };
  const { error } = await db
    .from("news_event_clusters")
    .update({ metadata: { ...previous, historical_reconciliation: reconciliation } })
    .eq("id", clusterId);
  if (error) throw error;
}

async function existingArticleSlugs(db: any, slugs: string[]): Promise<Set<string>> {
  if (!slugs.length) return new Set();
  const { data, error } = await db.from("daily_articles").select("slug").in("slug", slugs);
  if (error) throw error;
  return new Set((data ?? []).map((row: { slug: string }) => row.slug));
}

async function reconcile(request: Request, apply: boolean) {
  if (apply && !isAuthorizedApply(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const days = numericParam(url, "days", DEFAULT_DAYS, 1, MAX_DAYS);
  const limit = numericParam(url, "limit", DEFAULT_LIMIT, 50, MAX_LIMIT);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Historical reconciliation intentionally leads generated Supabase types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabaseAdmin as any;

  const { data, error } = await db
    .from("texas_news_feed")
    .select("id,title,link,source,description,pub_date,extracted_body,internal_slug,event_cluster_id,event_cluster_score,target_site,created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });

  const rows = (data ?? []) as HistoricalFeedItem[];
  const plans = planHistoricalReconciliation(rows);
  const publishedSlugs = [...new Set(plans.flatMap((plan) => plan.publishedSlugs))];
  const knownSlugs = await existingArticleSlugs(db, publishedSlugs);

  const results: Array<Record<string, unknown>> = [];
  for (const plan of plans) {
    const missingSlugs = plan.publishedSlugs.filter((slug) => !knownSlugs.has(slug));
    if (missingSlugs.length) {
      results.push({
        status: "hold_missing_article",
        reason: `Feed rows reference article slug(s) that are not present in daily_articles: ${missingSlugs.join(", ")}`,
        feedItemIds: plan.feedItemIds,
        publishedSlugs: plan.publishedSlugs,
      });
      continue;
    }

    if (!apply) {
      results.push({
        status: plan.kind === "safe" ? "would_backfill" : "would_hold",
        canonicalSlug: plan.canonicalSlug,
        feedItemIds: plan.feedItemIds,
        publishedSlugs: plan.publishedSlugs,
        sourceFamilies: plan.sourceFamilies,
        reason: plan.reason,
      });
      continue;
    }

    const clusterId = await persistEventCluster(db, plan.cluster, {
      status: plan.kind === "safe" ? "published" : "ready",
      publishedSlug: plan.kind === "safe" ? plan.canonicalSlug ?? undefined : undefined,
    });
    if (!clusterId) {
      results.push({ status: "failed", reason: "Could not persist durable event cluster", feedItemIds: plan.feedItemIds });
      continue;
    }

    const ledger = buildStructuredFactLedger(plan.cluster);
    await persistStructuredFacts(db, clusterId, ledger);
    try {
      await mergeReconciliationMetadata(db, clusterId, plan, true);
    } catch (metadataError) {
      results.push({
        status: "failed_metadata",
        clusterId,
        reason: metadataError instanceof Error ? metadataError.message : String(metadataError),
        feedItemIds: plan.feedItemIds,
      });
      continue;
    }

    results.push({
      status: plan.kind === "safe" ? "backfilled" : "held_for_admin_review",
      clusterId,
      canonicalSlug: plan.canonicalSlug,
      publishedSlugs: plan.publishedSlugs,
      feedItemIds: plan.feedItemIds,
      factCount: ledger.facts.length,
      conflictCount: ledger.conflicts.length,
      reason: plan.reason,
    });
  }

  return Response.json({
    ok: true,
    mode: apply ? "apply" : "dry-run",
    days,
    scanned: rows.length,
    ...reconciliationSummary(plans),
    results,
    aiCalls: 0,
    articleWrites: 0,
    slugChanges: 0,
  });
}

export const Route = createFileRoute("/api/public/hooks/reconcile-news-history")({
  server: {
    handlers: {
      GET: ({ request }) => reconcile(request, false),
      POST: ({ request }) => reconcile(request, true),
    },
  },
});
