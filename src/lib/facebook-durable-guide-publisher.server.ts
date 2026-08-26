import {
  KTR_DURABLE_FACEBOOK_GUIDES,
  type DurableFacebookGuideCandidate,
} from "@/lib/facebook-durable-guides";
import {
  classifyFacebookTopic,
  type RecentFacebookPost,
} from "@/lib/facebook-editorial-selection";
import {
  facebookPostMatchesArticle,
  fetchRecentFacebookPagePosts,
  type FacebookPagePost,
} from "@/lib/facebook-page-history";
import { quickPublishToFacebookFn } from "@/services/quickPublish.functions";

const MAX_GUIDE_CANDIDATES = 160;
const MAX_GUIDE_ATTEMPTS = 12;

type PackageRow = {
  id: string;
  source_url: string | null;
};

type SocialConnectionRow = {
  account_id: string | null;
  access_token: string | null;
  connection_status: string | null;
};

function hash32(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

async function loadAlreadyPostedGuideUrls(db: any, urls: string[]): Promise<Set<string>> {
  if (urls.length === 0) return new Set();

  const { data: rawPackages, error: packageError } = await db
    .from("content_packages")
    .select("id,source_url")
    .in("source_url", urls);
  if (packageError) throw new Error(packageError.message);

  const packages = (rawPackages ?? []) as PackageRow[];
  const packageIds = packages.map((row) => row.id);
  if (packageIds.length === 0) return new Set();

  const { data: queueRows, error: queueError } = await db
    .from("publishing_queue")
    .select("content_package_id")
    .in("content_package_id", packageIds)
    .ilike("platform", "facebook")
    .eq("status", "PUBLISHED");
  if (queueError) throw new Error(queueError.message);

  const postedPackageIds = new Set<string>();
  for (const row of queueRows ?? []) {
    if (typeof row.content_package_id === "string") postedPackageIds.add(row.content_package_id);
  }

  return new Set(
    packages
      .filter((row) => postedPackageIds.has(row.id) && row.source_url)
      .map((row) => String(row.source_url)),
  );
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

function orderDurableGuides(
  guides: DurableFacebookGuideCandidate[],
  recentPosts: RecentFacebookPost[],
): DurableFacebookGuideCandidate[] {
  const recentTopicCounts = new Map<string, number>();
  for (const post of recentPosts) {
    const topic = classifyFacebookTopic({ title: post.title, category: null, kind: null });
    recentTopicCounts.set(topic, (recentTopicCounts.get(topic) ?? 0) + 1);
  }

  // Content age is intentionally absent from this score. These are durable,
  // production-indexable guides whose usefulness is not tied to publish date.
  const seed = new Date().toISOString().slice(0, 10);
  return [...guides].sort((left, right) => {
    const leftTopic = classifyFacebookTopic(left);
    const rightTopic = classifyFacebookTopic(right);
    const leftScore = left.score - (recentTopicCounts.get(leftTopic) ?? 0) * 18;
    const rightScore = right.score - (recentTopicCounts.get(rightTopic) ?? 0) * 18;
    if (leftScore !== rightScore) return rightScore - leftScore;
    return hash32(`${seed}:${left.slug}`) - hash32(`${seed}:${right.slug}`);
  });
}

export async function publishDurableFacebookGuideFallback(args: {
  db: any;
  adminToken: string;
  recentPosts: RecentFacebookPost[];
  mode: string;
  fallbackReason: string;
}): Promise<Response> {
  const pool = KTR_DURABLE_FACEBOOK_GUIDES.slice(0, MAX_GUIDE_CANDIDATES);
  if (pool.length === 0) {
    return Response.json({
      ok: true,
      posted: false,
      no_items: true,
      reason: args.fallbackReason,
      durable_guide_reason: "No production-indexable durable guides are available",
    });
  }

  let alreadyPosted: Set<string>;
  try {
    alreadyPosted = await loadAlreadyPostedGuideUrls(args.db, pool.map((guide) => guide.url));
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: "Failed to load durable-guide Facebook history",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }

  const databaseUnique = pool.filter((guide) => !alreadyPosted.has(guide.url));
  if (databaseUnique.length === 0) {
    return Response.json({
      ok: true,
      posted: false,
      no_items: true,
      reason: args.fallbackReason,
      durable_guide_reason: "All durable guides have already been posted",
    });
  }

  let livePagePosts: FacebookPagePost[];
  try {
    livePagePosts = await loadLiveFacebookPagePosts(args.db);
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: "Facebook durable-guide fallback stopped because live Page duplicate verification failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 503 },
    );
  }

  const liveUnique = databaseUnique.filter((guide) => {
    const identity = { title: guide.title, url: guide.url, alternateUrls: [] as string[] };
    return !livePagePosts.some((post) => facebookPostMatchesArticle(post, identity));
  });
  const liveDuplicateCount = databaseUnique.length - liveUnique.length;

  if (liveUnique.length === 0) {
    return Response.json({
      ok: true,
      posted: false,
      no_items: true,
      reason: args.fallbackReason,
      durable_guide_reason: "All remaining durable guides were found on the live Facebook Page",
      live_duplicates_filtered: liveDuplicateCount,
    });
  }

  const ordered = orderDurableGuides(liveUnique, args.recentPosts);
  const attempts: Array<{ slug: string; ok: boolean; error?: string }> = [];

  for (const guide of ordered.slice(0, MAX_GUIDE_ATTEMPTS)) {
    const result = await quickPublishToFacebookFn({
      data: {
        token: args.adminToken,
        headline: guide.title,
        source: "KeepTXRed",
        source_url: guide.url,
        feed_item_id: null,
        caption: guide.title,
        asset_url: guide.image_url,
        slug: null,
      },
    });

    if (result.ok) {
      return Response.json({
        ok: true,
        posted: true,
        kind: "evergreen-guide",
        source_pool: "durable-guides",
        slug: guide.slug,
        title: guide.title,
        article_url: guide.url,
        topic: classifyFacebookTopic(guide),
        external_id: result.external_id,
        post_url: result.post_url,
        posted_at: result.posted_at,
        attempted: attempts.length + 1,
        mode: args.mode,
        fallback_reason: args.fallbackReason,
        live_duplicates_filtered: liveDuplicateCount,
      });
    }

    attempts.push({ slug: guide.slug, ok: false, error: result.error });
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
      error: "No durable guide passed Facebook publishing checks",
      fallback_reason: args.fallbackReason,
      attempts,
    },
    { status: 422 },
  );
}
