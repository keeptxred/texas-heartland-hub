import { createFileRoute } from "@tanstack/react-router";
import { persistEventCluster } from "@/lib/event-cluster-persistence";
import {
  historicalArticleOwnershipCompatible,
  planHistoricalReconciliation,
  reconciliationSummary,
  type HistoricalFeedItem,
  type HistoricalReconciliationPlan,
} from "@/lib/historical-event-reconciliation";
import { buildStructuredFactLedger, persistStructuredFacts } from "@/lib/structured-fact-provenance";

const DEFAULT_DAYS = 30;
const MAX_DAYS = 90;
const DEFAULT_LIMIT = 500;
const MAX_LIMIT = 5000;
const PAGE_SIZE = 1000;

type ExistingArticle = {
  slug: string;
  title: string;
  published_at: string | null;
  body_json: unknown;
};

function numericParam(url: URL, name: string, fallback: number, min: number, max: number): number {
  const value = Number(url.searchParams.get(name) ?? fallback);
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(value)));
}

function isAuthorizedApply(request: Request): boolean {
  const newsroomToken = process.env.NEWSROOM_HOOK_TOKEN;
  const adminPasscode = process.env.ADMIN_PASSCODE;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(
    (newsroomToken && request.headers.get("x-newsroom-hook-token") === newsroomToken)
    || (adminPasscode && request.headers.get("x-admin-passcode") === adminPasscode)
    || (serviceRoleKey && request.headers.get("x-reconcile-service-role-key") === serviceRoleKey),
  );
}

function historicalBounds(plan: HistoricalReconciliationPlan) {
  const values = [plan.cluster.primary, ...plan.cluster.members]
    .map((row) => Date.parse(row.pub_date ?? ""))
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  return {
    firstSeenAt: values.length ? new Date(values[0]).toISOString() : null,
    lastSeenAt: values.length ? new Date(values[values.length - 1]).toISOString() : null,
  };
}

function articleEditorialEvidence(bodyJson: unknown): string {
  if (!bodyJson || typeof bodyJson !== "object" || Array.isArray(bodyJson)) return "";
  const { sources: _sources, authority: _authority, ...editorial } = bodyJson as Record<string, unknown>;
  return JSON.stringify(editorial);
}

function planRows(plan: HistoricalReconciliationPlan): HistoricalFeedItem[] {
  return [plan.cluster.primary, ...plan.cluster.members].filter(
    (row): row is HistoricalFeedItem => typeof row.id === "number",
  );
}

async function mergeReconciliationMetadata(db: any, clusterId: string, plan: HistoricalReconciliationPlan) {
  const { data } = await db.from("news_event_clusters").select("metadata").eq("id", clusterId).maybeSingle();
  const previous = data?.metadata && typeof data.metadata === "object" ? data.metadata : {};
  const reconciliation = {
    version: 1,
    status: "backfilled",
    canonical_slug: plan.canonicalSlug,
    published_slugs: plan.publishedSlugs,
    feed_item_ids: plan.feedItemIds,
    source_families: plan.sourceFamilies,
    reason: plan.reason,
    reconciled_at: new Date().toISOString(),
  };
  const { error } = await db
    .from("news_event_clusters")
    .update({ metadata: { ...previous, historical_reconciliation: reconciliation } })
    .eq("id", clusterId);
  if (error) throw error;
}

async function existingArticles(db: any, slugs: string[]): Promise<Map<string, ExistingArticle>> {
  if (!slugs.length) return new Map();
  const { data, error } = await db.from("daily_articles").select("slug,title,published_at,body_json").in("slug", slugs);
  if (error) throw error;
  return new Map((data ?? []).map((row: ExistingArticle) => [row.slug, row]));
}

async function fetchHistoricalFeedRows(db: any, since: string, limit: number): Promise<HistoricalFeedItem[]> {
  const rows: HistoricalFeedItem[] = [];
  for (let from = 0; from < limit; from += PAGE_SIZE) {
    const to = Math.min(from + PAGE_SIZE - 1, limit - 1);
    const expected = to - from + 1;
    const { data, error } = await db
      .from("texas_news_feed")
      .select("id,title,link,source,description,pub_date,extracted_body,internal_slug,event_cluster_id,event_cluster_score,target_site,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: true })
      .range(from, to);
    if (error) throw error;

    const batch = (data ?? []) as HistoricalFeedItem[];
    rows.push(...batch);
    if (batch.length < expected) break;
  }
  return rows;
}

async function recordHold(
  db: any,
  input: {
    groupKey: string;
    reason: string;
    feedItemIds: number[];
    publishedSlugs: string[];
    sourceFamilies: string[];
    details?: Record<string, unknown>;
  },
) {
  const now = new Date().toISOString();
  const { error } = await db.from("news_event_reconciliation_holds").upsert({
    group_key: input.groupKey,
    review_status: "pending",
    reason: input.reason,
    feed_item_ids: input.feedItemIds,
    published_slugs: input.publishedSlugs,
    source_families: input.sourceFamilies,
    details: input.details ?? {},
    last_seen_at: now,
  }, { onConflict: "group_key" });
  if (error) throw error;
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

  let rows: HistoricalFeedItem[];
  try {
    rows = await fetchHistoricalFeedRows(db, since, limit);
  } catch (error) {
    return Response.json({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }

  const plans = planHistoricalReconciliation(rows);
  const publishedSlugs = [...new Set(plans.flatMap((plan) => plan.publishedSlugs))];
  const articles = await existingArticles(db, publishedSlugs);

  const results: Array<Record<string, unknown>> = [];
  let holdsQueued = 0;
  let ownershipHolds = 0;
  for (const plan of plans) {
    if (plan.kind === "hold") {
      if (apply) {
        await recordHold(db, {
          groupKey: `multiple-slugs:${plan.feedItemIds[0]}`,
          reason: plan.reason,
          feedItemIds: plan.feedItemIds,
          publishedSlugs: plan.publishedSlugs,
          sourceFamilies: plan.sourceFamilies,
          details: { kind: "multiple_published_slugs" },
        });
        holdsQueued += 1;
      }
      results.push({
        status: apply ? "held_for_admin_review" : "would_hold",
        canonicalSlug: null,
        feedItemIds: plan.feedItemIds,
        publishedSlugs: plan.publishedSlugs,
        sourceFamilies: plan.sourceFamilies,
        reason: plan.reason,
      });
      continue;
    }

    const missingSlugs = plan.publishedSlugs.filter((slug) => !articles.has(slug));
    if (missingSlugs.length) {
      const reason = `Feed rows reference article slug(s) that are not present in daily_articles: ${missingSlugs.join(", ")}`;
      if (apply) {
        await recordHold(db, {
          groupKey: `missing-article:${plan.feedItemIds[0]}`,
          reason,
          feedItemIds: plan.feedItemIds,
          publishedSlugs: plan.publishedSlugs,
          sourceFamilies: plan.sourceFamilies,
          details: { kind: "missing_canonical_article", missingSlugs },
        });
        holdsQueued += 1;
      }
      results.push({ status: apply ? "held_for_admin_review" : "hold_missing_article", reason, feedItemIds: plan.feedItemIds, publishedSlugs: plan.publishedSlugs });
      continue;
    }

    const article = plan.canonicalSlug ? articles.get(plan.canonicalSlug) : undefined;
    const slugOwners = planRows(plan).filter((row) => row.internal_slug?.trim() === plan.canonicalSlug);
    const ownsCanonicalArticle = Boolean(article && slugOwners.some((row) => historicalArticleOwnershipCompatible(row, {
      title: article.title,
      bodyText: articleEditorialEvidence(article.body_json),
    })));

    if (!ownsCanonicalArticle) {
      const reason = `Legacy feed/article ownership is not supported by the published article's editorial evidence for slug: ${plan.canonicalSlug ?? "unknown"}`;
      ownershipHolds += 1;
      if (apply) {
        await recordHold(db, {
          groupKey: `canonical-identity:${plan.canonicalSlug ?? "unknown"}:${plan.feedItemIds[0]}`,
          reason,
          feedItemIds: plan.feedItemIds,
          publishedSlugs: plan.publishedSlugs,
          sourceFamilies: plan.sourceFamilies,
          details: {
            kind: "canonical_article_identity_mismatch",
            canonicalSlug: plan.canonicalSlug,
            slugOwnerFeedItemIds: slugOwners.map((row) => row.id),
          },
        });
        holdsQueued += 1;
      }
      results.push({
        status: apply ? "held_for_admin_review" : "hold_canonical_identity_mismatch",
        canonicalSlug: plan.canonicalSlug,
        feedItemIds: plan.feedItemIds,
        publishedSlugs: plan.publishedSlugs,
        sourceFamilies: plan.sourceFamilies,
        reason,
      });
      continue;
    }

    if (!apply) {
      results.push({
        status: "would_backfill",
        canonicalSlug: plan.canonicalSlug,
        feedItemIds: plan.feedItemIds,
        publishedSlugs: plan.publishedSlugs,
        sourceFamilies: plan.sourceFamilies,
        reason: plan.reason,
      });
      continue;
    }

    const clusterId = await persistEventCluster(db, plan.cluster, {
      status: "published",
      publishedSlug: plan.canonicalSlug ?? undefined,
    });
    if (!clusterId) {
      results.push({ status: "failed", reason: "Could not persist durable event cluster", feedItemIds: plan.feedItemIds });
      continue;
    }

    const bounds = historicalBounds(plan);
    const historicalTimestamps: Record<string, string> = {};
    if (bounds.firstSeenAt) historicalTimestamps.first_seen_at = bounds.firstSeenAt;
    if (bounds.lastSeenAt) historicalTimestamps.last_seen_at = bounds.lastSeenAt;
    if (article?.published_at) {
      historicalTimestamps.published_at = article.published_at;
      historicalTimestamps.synthesized_at = article.published_at;
    }
    if (Object.keys(historicalTimestamps).length) {
      const { error: timestampError } = await db.from("news_event_clusters").update(historicalTimestamps).eq("id", clusterId);
      if (timestampError) throw timestampError;
    }

    const ledger = buildStructuredFactLedger(plan.cluster);
    await persistStructuredFacts(db, clusterId, ledger);
    await mergeReconciliationMetadata(db, clusterId, plan);

    results.push({
      status: "backfilled",
      clusterId,
      canonicalSlug: plan.canonicalSlug,
      publishedSlugs: plan.publishedSlugs,
      feedItemIds: plan.feedItemIds,
      factCount: ledger.facts.length,
      conflictCount: ledger.conflicts.length,
      reason: plan.reason,
    });
  }

  const summary = reconciliationSummary(plans);
  return Response.json({
    ok: true,
    mode: apply ? "apply" : "dry-run",
    days,
    limit,
    scanned: rows.length,
    planned: summary.planned,
    safe: Math.max(0, summary.safe - ownershipHolds),
    held: summary.held + ownershipHolds,
    feedItems: summary.feedItems,
    holdsQueued,
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
