import {
  KTR_FACEBOOK_ATTENTION_POSTS,
  formatKtrFacebookAttentionMessage,
  selectKtrFacebookAttentionPost,
  type KtrFacebookAttentionPost,
} from "@/lib/facebook-attention-posts";
import {
  fetchRecentFacebookPagePosts,
  type FacebookPagePost,
} from "@/lib/facebook-page-history";

const SITE_URL = "https://keeptxred.com";
const ATTENTION_SLOTS = new Set([1, 3]);

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

function normalize(value: string): string {
  return value.toLowerCase().replace(/https?:\/\/\S+/g, " ").replace(/[^a-z0-9]+/g, " ").trim();
}

function campaignContent(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "attention-post";
}

export function ktrFacebookAttentionTrafficUrl(post: KtrFacebookAttentionPost): string | null {
  if (!post.trafficPath) return null;
  const url = new URL(`${SITE_URL}${post.trafficPath}`);
  url.searchParams.set("utm_source", "facebook");
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", "ktr_attention");
  url.searchParams.set("utm_content", campaignContent(post.title));
  return url.toString();
}

export function formatKtrFacebookPublishedAttentionMessage(post: KtrFacebookAttentionPost): string {
  const trafficUrl = ktrFacebookAttentionTrafficUrl(post);
  if (!trafficUrl) return post.message;
  return `${post.message}\n\nRead more on Keep TX Red:\n${trafficUrl}`;
}

export function shouldUseKtrFacebookAttentionSlot(postsToday: number): boolean {
  return ATTENTION_SLOTS.has(postsToday);
}

export function ktrFacebookAttentionSourcePostId(post: KtrFacebookAttentionPost): string {
  return `ktr-attention-${campaignContent(post.title)}`;
}

export function findKtrFacebookAttentionPostBySourceId(sourcePostId: string): KtrFacebookAttentionPost | null {
  return KTR_FACEBOOK_ATTENTION_POSTS.find((post) => ktrFacebookAttentionSourcePostId(post) === sourcePostId) ?? null;
}

export function selectKtrFacebookAttentionPostForSlot(args: {
  seed: string;
  dateKey: string;
  slot: number;
  recentMessages: readonly string[];
}): KtrFacebookAttentionPost | null {
  const preferredPool = KTR_FACEBOOK_ATTENTION_POSTS.filter((post) =>
    args.slot === 1 ? !post.trafficPath : args.slot === 3 ? Boolean(post.trafficPath) : true,
  );
  const recentNormalized = new Set(args.recentMessages.map(normalize).filter(Boolean));
  const start = preferredPool.length
    ? hash32(`${args.seed}:${args.dateKey}:${args.slot}:ktr-attention-mode`) % preferredPool.length
    : 0;

  for (let offset = 0; offset < preferredPool.length; offset += 1) {
    const candidate = preferredPool[(start + offset) % preferredPool.length];
    const formatted = formatKtrFacebookAttentionMessage(candidate);
    if (recentNormalized.has(normalize(formatted)) || recentNormalized.has(normalize(candidate.message))) continue;
    if (
      candidate.trafficPath &&
      args.recentMessages.some((message) => message.includes(`${SITE_URL}${candidate.trafficPath}`))
    ) {
      continue;
    }
    return candidate;
  }

  // If a preferred pool is exhausted by live-page duplicate history, fall back
  // to the general selector rather than losing an otherwise valid scheduled slot.
  return selectKtrFacebookAttentionPost(args);
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

async function loadLiveFacebookPosts(connection: SocialConnectionRow): Promise<FacebookPagePost[]> {
  return fetchRecentFacebookPagePosts({
    pageId: String(connection.account_id),
    pageToken: String(connection.access_token),
    limit: 100,
  });
}

export async function prepareKtrFacebookAttentionPost(args: {
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
    livePosts = await loadLiveFacebookPosts(connection);
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: "Facebook attention post stopped because Page verification failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 503 },
    );
  }

  const post = selectKtrFacebookAttentionPostForSlot({
    seed: args.seed,
    dateKey: args.dateKey,
    slot: args.slot,
    recentMessages: livePosts.map((item) => item.message ?? ""),
  });
  if (!post) return null;

  const postText = formatKtrFacebookPublishedAttentionMessage(post);
  const trafficUrl = ktrFacebookAttentionTrafficUrl(post);

  return Response.json({
    ok: true,
    posted: false,
    site: "KeepTXRed",
    kind: "attention-post",
    title: post.title,
    category: post.category,
    article_url: null,
    traffic_url: trafficUrl,
    source_post_id: ktrFacebookAttentionSourcePostId(post),
    post_text: postText,
    image_generation_required: true,
    image_prompt_prefix: "Generate an image for this Facebook post.",
    text_only_fallback: false,
    generic_fallback: false,
    mode: args.mode,
    attention_mode: args.slot === 1 ? "reach" : args.slot === 3 ? "traffic" : "mixed",
    content_mix: { article_or_guide_slots: 3, attention_slots: 2 },
  });
}
