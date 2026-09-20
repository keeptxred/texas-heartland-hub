import { createFileRoute } from "@tanstack/react-router";
import { meetsArticleMainWordCount } from "@/lib/article-length";
import { publishDurableFacebookGuideFallback } from "@/lib/facebook-durable-guide-publisher.server";
import {
  rankFacebookCandidates,
  type RecentFacebookPost,
} from "@/lib/facebook-editorial-selection";
import {
  facebookPostMatchesArticle,
  fetchRecentFacebookPagePosts,
  type FacebookPagePost,
} from "@/lib/facebook-page-history";
import {
  facebookPostingDecision,
  formatCentralMinute,
} from "@/lib/facebook-posting-schedule";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";
import { quickPublishToFacebookFn } from "@/services/quickPublish.functions";

const OIDC_AUDIENCE = "keeptxred-facebook";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/auto-facebook-posts.yml";
const SITE_URL = "https://keeptxred.com";
const MAX_AUTO_FACEBOOK_ARTICLE_AGE_DAYS = 4;
const MAX_CANDIDATES = 160;
const MAX_ATTEMPTS = 12;
const DIVERSITY_WINDOW_HOURS = 30;

type ArticleRow = {
  slug: string;
  title: string;
  category: string | null;
  featured_image_url: string | null;
  published_at: string;
  source_name: string | null;
  source_url: string | null;
  kind: string;
  is_breaking: boolean | null;
  score: number | null;
  body_json: unknown;
};

type PackageRow = {
  id: string;
  source_url: string | null;
};

type RecentQueueRow = {
  content_package_id: string;
  published_time: string | null;
};

type RecentPackageRow = {
  id: string;
  source_title: string;
};

type SocialConnectionRow = {
  account_id: string | null;
  access_token: string | null;
  connection_status: string | null;
};

function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

function articleUrl(row: ArticleRow): string {
  return `${SITE_URL}/news/${encodeURIComponent(row.slug)}`;
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

async function loadLiveFacebookPagePosts(db: any): Promise<FacebookPagePost[]> {
  const { data: rawConnection, error } = await db
    .from("social_connections")
    .select("account_id,access_token,connection_status")
    .ilike("platform", "facebook")
    .maybeSingle();

  if (error) throw new Error(error.message);
  const connection = rawConnection as SocialConnectionRow | null;
  if (
    !connection ||
    connection.connection_status !== "CONNECTED" ||
    !connection.account_id ||
    !connection.access_token
  ) {
    throw new Error("Facebook Page connection is unavailable for duplicate verification");
  }

  return fetchRecentFacebookPagePosts({
    pageId: String(connection.account_id),
    pageToken: String(connection.access_token),
    limit: 100,
  });
}

async function runAutoFacebookPost(request: Request) {
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

  const adminToken = process.env.ADMIN_PASSCODE ?? "keeptxred";
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;

  let recentPosts: RecentFacebookPost[] = [];
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

  const mode = request.headers.get("x-ktr-facebook-mode")?.trim().toLowerCase() || "scheduled";
  const durableFallback = (fallbackReason: string) =>
    publishDurableFacebookGuideFallback({
      db,
      adminToken,
      recentPosts,
      mode,
      fallbackReason,
    });

  if (mode !== "manual") {
    const decision = facebookPostingDecision({
      now: new Date(),
      seed: adminToken,
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
  }

  const cutoff = new Date(
    Date.now() - MAX_AUTO_FACEBOOK_ARTICLE_AGE_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();
  const { data: rawArticles, error: articleError } = await db
    .from("daily_articles")
    .select("slug,title,category,featured_image_url,published_at,source_name,source_url,kind,is_breaking,score,body_json")
    .not("featured_image_url", "is", null)
    .gte("published_at", cutoff)
    .order("published_at", { ascending: false })
    .limit(MAX_CANDIDATES);

  if (articleError) {
    return Response.json({ ok: false, error: articleError.message }, { status: 500 });
  }

  const articles = ((rawArticles ?? []) as ArticleRow[]).filter(
    (row) =>
      Boolean(row.slug && row.title && row.featured_image_url) &&
      meetsArticleMainWordCount(row.kind, row.body_json as never),
  );

  if (articles.length === 0) {
    return durableFallback(`No eligible articles newer than ${MAX_AUTO_FACEBOOK_ARTICLE_AGE_DAYS} days`);
  }

  const urls = articles.map(articleUrl);
  const { data: rawPackages, error: packageError } = await db
    .from("content_packages")
    .select("id,source_url")
    .in("source_url", urls);

  if (packageError) {
    return Response.json({ ok: false, error: packageError.message }, { status: 500 });
  }

  const packages = (rawPackages ?? []) as PackageRow[];
  const packageIds = packages.map((row) => row.id);
  const postedPackageIds = new Set<string>();

  if (packageIds.length > 0) {
    const { data: publishedQueueRows, error: queueError } = await db
      .from("publishing_queue")
      .select("content_package_id")
      .in("content_package_id", packageIds)
      .ilike("platform", "facebook")
      .eq("status", "PUBLISHED");

    if (queueError) {
      return Response.json({ ok: false, error: queueError.message }, { status: 500 });
    }

    for (const row of publishedQueueRows ?? []) {
      if (typeof row.content_package_id === "string") postedPackageIds.add(row.content_package_id);
    }
  }

  const alreadyPosted = new Set<string>();
  for (const row of packages) {
    if (postedPackageIds.has(row.id) && row.source_url) alreadyPosted.add(row.source_url);
  }

  const databaseUniqueCandidates = articles.filter((row) => !alreadyPosted.has(articleUrl(row)));
  if (databaseUniqueCandidates.length === 0) {
    return durableFallback("All eligible recent articles were already posted");
  }

  let livePagePosts: FacebookPagePost[] = [];
  try {
    livePagePosts = await loadLiveFacebookPagePosts(db);
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: "Facebook automation stopped because live Page duplicate verification failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 503 },
    );
  }

  const candidates = databaseUniqueCandidates.filter((row) => {
    const identity = {
      title: row.title,
      url: articleUrl(row),
      alternateUrls: row.source_url ? [row.source_url] : [],
    };
    return !livePagePosts.some((post) => facebookPostMatchesArticle(post, identity));
  });
  const liveDuplicateCount = databaseUniqueCandidates.length - candidates.length;

  if (candidates.length === 0) {
    return durableFallback("All eligible recent articles were already found on the live Facebook Page");
  }

  const ranked = rankFacebookCandidates(candidates, recentPosts);
  if (ranked.length === 0) {
    return durableFallback("Only routine or low-value government appointment stories remain");
  }

  const attempts: Array<{
    slug: string;
    topic: string;
    editorial_score: number;
    ok: boolean;
    error?: string;
  }> = [];

  for (const rankedRow of ranked.slice(0, MAX_ATTEMPTS)) {
    const row = rankedRow.candidate;
    const url = articleUrl(row);
    const result = await quickPublishToFacebookFn({
      data: {
        token: adminToken,
        headline: row.title,
        source: row.source_name ?? "KeepTXRed",
        source_url: url,
        feed_item_id: null,
        caption: row.title,
        asset_url: row.featured_image_url,
        slug: row.slug,
      },
    });

    if (result.ok) {
      return Response.json({
        ok: true,
        posted: true,
        slug: row.slug,
        title: row.title,
        article_url: url,
        topic: rankedRow.topic,
        editorial_score: rankedRow.editorialScore,
        editorial_reasons: rankedRow.reasons,
        external_id: result.external_id,
        post_url: result.post_url,
        posted_at: result.posted_at,
        attempted: attempts.length + 1,
        mode,
        live_duplicates_filtered: liveDuplicateCount,
      });
    }

    attempts.push({
      slug: row.slug,
      topic: rankedRow.topic,
      editorial_score: rankedRow.editorialScore,
      ok: false,
      error: result.error,
    });

    if (result.requires_connection) {
      return Response.json(
        {
          ok: false,
          posted: false,
          error: result.error,
          requires_connection: true,
          attempts,
        },
        { status: 503 },
      );
    }
  }

  return Response.json(
    {
      ok: false,
      posted: false,
      error: "No editorially ranked article passed Facebook publishing checks",
      attempts,
    },
    { status: 422 },
  );
}

export const Route = createFileRoute("/api/public/hooks/auto-facebook-post")({
  server: {
    handlers: {
      POST: async ({ request }) => runAutoFacebookPost(request),
    },
  },
});