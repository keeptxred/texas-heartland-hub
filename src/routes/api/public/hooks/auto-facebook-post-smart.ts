import { createFileRoute } from "@tanstack/react-router";
import {
  publishKtrFacebookAttentionPost,
  shouldUseKtrFacebookAttentionSlot,
} from "@/lib/facebook-attention-publisher.server";
import type { RecentFacebookPost } from "@/lib/facebook-editorial-selection";
import {
  facebookPostingDecision,
  formatCentralMinute,
} from "@/lib/facebook-posting-schedule";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";

const OIDC_AUDIENCE = "keeptxred-facebook";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/auto-facebook-posts.yml";
const ARTICLE_ENDPOINT = "https://keeptxred.com/api/public/hooks/auto-facebook-post";
const DIVERSITY_WINDOW_HOURS = 30;

type RecentQueueRow = {
  content_package_id: string;
  published_time: string | null;
};

type RecentPackageRow = {
  id: string;
  source_title: string;
};

function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

async function loadRecentFacebookPosts(db: any): Promise<RecentFacebookPost[]> {
  const cutoff = new Date(Date.now() - DIVERSITY_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
  const { data: rawQueueRows, error: queueError } = await db
    .from("publishing_queue")
    .select("content_package_id,published_time")
    .ilike("platform", "facebook")
    .eq("status", "PUBLISHED")
    .gte("published_time", cutoff)
    .order("published_time", { ascending: false })
    .limit(30);
  if (queueError) throw new Error(queueError.message);

  const queueRows = (rawQueueRows ?? []) as RecentQueueRow[];
  const packageIds = [...new Set(queueRows.map((row) => row.content_package_id).filter(Boolean))];
  if (packageIds.length === 0) {
    return queueRows.map((row) => ({ title: "Facebook post", published_at: row.published_time }));
  }

  const { data: rawPackages, error: packageError } = await db
    .from("content_packages")
    .select("id,source_title")
    .in("id", packageIds);
  if (packageError) throw new Error(packageError.message);

  const titleByPackage = new Map<string, string>(
    ((rawPackages ?? []) as RecentPackageRow[]).map((row) => [row.id, row.source_title]),
  );
  return queueRows.map((row) => ({
    title: titleByPackage.get(row.content_package_id) ?? "Facebook post",
    published_at: row.published_time,
  }));
}

async function forwardArticlePost(token: string): Promise<Response> {
  const response = await fetch(ARTICLE_ENDPOINT, {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
      "X-KTR-Facebook-Mode": "manual",
    },
  });
  const text = await response.text();
  return new Response(text, {
    status: response.status,
    headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
  });
}

async function runSmartKtrFacebookPost(request: Request): Promise<Response> {
  const token = bearerToken(request);
  if (!token) {
    return Response.json({ ok: false, error: "Missing GitHub Actions OIDC token" }, { status: 401 });
  }

  try {
    await verifyGitHubActionsOidc({
      token,
      audience: OIDC_AUDIENCE,
      repository: REPOSITORY,
      workflowPath: WORKFLOW_PATH,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: "GitHub Actions OIDC verification failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 403 },
    );
  }

  const mode = request.headers.get("x-ktr-facebook-mode")?.trim().toLowerCase() || "scheduled";
  // Manual workflow dispatch retains the existing article/guide behavior. The
  // attention mix is only used by scheduled runs so manual publication remains
  // predictable for operators.
  if (mode === "manual") return forwardArticlePost(token);

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;
  const seed = process.env.ADMIN_PASSCODE ?? "keeptxred";

  let recentPosts: RecentFacebookPost[];
  try {
    recentPosts = await loadRecentFacebookPosts(db);
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: "Failed to load recent Facebook history",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }

  const decision = facebookPostingDecision({
    now: new Date(),
    seed,
    recentPosts,
  });
  if (!decision.shouldPost) {
    return Response.json({
      ok: true,
      posted: false,
      scheduled_wait: true,
      reason: decision.reason,
      schedule_date: decision.dateKey,
      posts_today: decision.postsToday,
      elapsed_slots: decision.elapsedSlots,
      next_target_local: formatCentralMinute(decision.nextTargetMinute),
      targets_local: decision.targets.map((target) => formatCentralMinute(target)),
    });
  }

  if (shouldUseKtrFacebookAttentionSlot(decision.postsToday)) {
    const attentionResponse = await publishKtrFacebookAttentionPost({
      db,
      seed,
      dateKey: decision.dateKey,
      slot: decision.postsToday,
      mode,
    });
    if (attentionResponse) return attentionResponse;
  }

  // Article slots keep the existing ranked recent-article publisher and its
  // production-indexable durable-guide fallback. Forward as manual so the
  // inner endpoint does not apply the schedule a second time.
  return forwardArticlePost(token);
}

export const Route = createFileRoute("/api/public/hooks/auto-facebook-post-smart")({
  server: {
    handlers: {
      POST: async ({ request }) => runSmartKtrFacebookPost(request),
    },
  },
});
