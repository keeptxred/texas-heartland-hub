import { createFileRoute } from "@tanstack/react-router";
import { meetsArticleMainWordCount } from "@/lib/article-length";
import {
  rankFacebookCandidates,
  type RecentFacebookPost,
} from "@/lib/facebook-editorial-selection";
import {
  facebookPostMatchesArticle,
  fetchRecentFacebookPagePosts,
  normalizeFacebookHeadline,
  type FacebookPagePost,
} from "@/lib/facebook-page-history";
import {
  facebookPostingDecision,
  formatCentralMinute,
} from "@/lib/facebook-posting-schedule";
import { KTR_EVERGREEN_FACEBOOK_POSTS, type KtrEvergreenFacebookPost } from "@/lib/ktr-facebook-evergreen";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";
import { quickPublishToFacebookFn } from "@/services/quickPublish.functions";

const OIDC_AUDIENCE = "keeptxred-facebook";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/auto-facebook-posts.yml";
const SITE_URL = "https://keeptxred.com";
const GRAPH_VERSION = "v21.0";
const MAX_AUTO_FACEBOOK_ARTICLE_AGE_DAYS = 4;
const MAX_CANDIDATES = 160;
const MAX_ATTEMPTS = 12;
const DIVERSITY_WINDOW_HOURS = 30;

// Keep the existing five-post KTR schedule, but reserve roughly two of those
// slots for discussion-first posts that do not require an article link.
const EVERGREEN_TEXT_SLOTS = new Set([1, 3]);

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

function hash32(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function shouldUseEvergreenTextPost(postsToday: number): boolean {
  return EVERGREEN_TEXT_SLOTS.has(postsToday);
}

function chooseEvergreenTextPost(args: {
  seed: string;
  dateKey: string;
  slot: number;
  livePosts: FacebookPagePost[];
}): KtrEvergreenFacebookPost | null {
  const recent = new Set(
    args.livePosts
      .map((post) => normalizeFacebookHeadline(post.message ?? ""))
      .filter(Boolean),
  );
  if (KTR_EVERGREEN_FACEBOOK_POSTS.length === 0) return null;

  const start = hash32(`${args.seed}:ktr-evergreen:${args.dateKey}:${args.slot}`) % KTR_EVERGREEN_FACEBOOK_POSTS.length;
  for (let offset = 0; offset < KTR_EVERGREEN_FACEBOOK_POSTS.length; offset += 1) {
    const post = KTR_EVERGREEN_FACEBOOK_POSTS[(start + offset) % KTR_EVERGREEN_FACEBOOK_POSTS.length];
    if (!recent.has(normalizeFacebookHeadline(post.message))) return post;
  }
  return null;
}

async function loadFacebookConnection(db: any): Promise<SocialConnectionRow> {
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
    throw new Error("Facebook Page connection is unavailable");
  }
  return connection;
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
  const connection = await loadFacebookConnection(db);
  return fetchRecentFacebookPagePosts({
    pageId: String(connection.account_id),
    pageToken: String(connection.access_token),
    limit: 100,
  });
}

async function recordEvergreenTextPost(
  db: any,
  post: KtrEvergreenFacebookPost,
  externalId: string | null,
): Promise<string | null> {
  const { data: inserted, error } = await db
    .from("content_packages")
    .insert({
      source_title: post.title,
      source_url: null,
      category: post.category,
      facebook_hook: post.message,
      facebook_body: null,
      facebook_cta: null,
      status: "PUBLISHED",
      asset_type: "TEXT",
      asset_url: null,
      workflow_status: "PUBLISHED",
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  const packageId = inserted.id as string;
  const { error: queueError } = await db.from("publishing_queue").insert({
    content_package_id: packageId,
    platform: "facebook",
    status: "PUBLISHED",
    published_time: new Date().toISOString(),
    notes: externalId
      ? `Facebook post ${externalId}; kind=evergreen-discussion`
      : "KeepTXRed Facebook post; kind=evergreen-discussion",
  });
  if (queueError) throw new Error(queueError.message);
  return packageId;
}

async function publishEvergreenTextPost(args: {
  db: any;
  seed: string;
  dateKey: string;
  slot: number;
  mode: string;
}): Promise<Response | null> {
  let connection: SocialConnectionRow;
  let livePosts: FacebookPagePost[];
  try {
    connection = await loadFacebookConnection(args.db);
    livePosts = await fetchRecentFacebookPagePosts({
      pageId: String(connection.account_id),
      pageToken: String(connection.access_token),
      limit: 100,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: "Facebook evergreen post stopped because Page verification failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 503 },
    );
  }

  const post = chooseEvergreenTextPost({
    seed: args.seed,
    dateKey: args.dateKey,
    slot: args.slot,
    livePosts,
  });
  if (!post) return null;

  const graphUrl = `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(String(connection.account_id))}/feed`;
  const graphResponse = await fetch(graphUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      message: post.message,
      access_token: String(connection.access_token),
    }),
  });
  const graphJson = (await graphResponse.json().catch(() => ({}))) as {
    id?: string;
    error?: { message?: string };
  };

  if (!graphResponse.ok || !graphJson.id) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: graphJson.error?.message ?? `Facebook Graph API returned HTTP ${graphResponse.status}`,
        requires_connection: graphResponse.status === 401 || graphResponse.status === 403,
      },
      { status: 502 },
    );
  }

  const externalId = graphJson.id ?? null;
  let packageId: string | null = null;
  let recordWarning: string | null = null;
  try {
    packageId = await recordEvergreenTextPost(args.db, post, externalId);
  } catch (error) {
    recordWarning = error instanceof Error ? error.message : String(error);
    console.error("[KeepTXRed Facebook] text post succeeded but history recording failed", recordWarning);
  }

  return Response.json({
    ok: true,
    posted: true,
    site: "KeepTXRed",
    kind: "evergreen-discussion",
    title: post.title,
    category: post.category,
    article_url: null,
    external_id: externalId,
    post_url: externalId ? `https://www.facebook.com/${externalId}` : null,
    package_id: packageId,
    record_warning: recordWarning,
    posted_at: new Date().toISOString(),
    mode: args.mode,
    content_mix: { article_slots: 3, evergreen_discussion_slots: 2 },
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
  const decision = facebookPostingDecision({
    now: new Date(),
    seed: adminToken,
    recentPosts,
  });

  if (mode !== "manual" && !decision.shouldPost) {
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

  if (shouldUseEvergreenTextPost(decision.postsToday)) {
    const response = await publishEvergreenTextPost({
      db,
      seed: adminToken,
      dateKey: decision.dateKey,
      slot: decision.postsToday,
      mode,
    });
    if (response) return response;
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
    return Response.json({
      ok: true,
      posted: false,
      no_items: true,
      reason: `No eligible articles newer than ${MAX_AUTO_FACEBOOK_ARTICLE_AGE_DAYS} days`,
    });
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
    return Response.json({ ok: true, posted: false, no_items: true, reason: "All eligible recent articles were already posted" });
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
    return Response.json({
      ok: true,
      posted: false,
      no_items: true,
      reason: "All eligible recent articles were already found on the live Facebook Page",
      live_duplicates_filtered: liveDuplicateCount,
    });
  }

  const ranked = rankFacebookCandidates(candidates, recentPosts);
  if (ranked.length === 0) {
    return Response.json({
      ok: true,
      posted: false,
      no_items: true,
      reason: "Only routine or low-value government appointment stories remain",
      live_duplicates_filtered: liveDuplicateCount,
    });
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
        content_mix: { article_slots: 3, evergreen_discussion_slots: 2 },
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
