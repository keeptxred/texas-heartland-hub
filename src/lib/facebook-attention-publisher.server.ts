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

const GRAPH_VERSION = "v21.0";
const SITE_URL = "https://keeptxred.com";
const ATTENTION_SLOTS = new Set([1, 3]);
const MAX_FACEBOOK_IMAGE_BYTES = 12 * 1024 * 1024;
export const KTR_FACEBOOK_ATTENTION_IMAGE_URL = `${SITE_URL}/og/default.jpg`;

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

async function loadRequiredAttentionImage(): Promise<{ bytes: ArrayBuffer; contentType: string }> {
  const response = await fetch(KTR_FACEBOOK_ATTENTION_IMAGE_URL, {
    redirect: "follow",
    headers: {
      accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      "user-agent": "KeepTXRed-FacebookPublisher/1.0",
    },
  });
  const contentType = response.headers.get("content-type")?.split(";", 1)[0]?.trim() ?? "";
  const contentLength = Number(response.headers.get("content-length") ?? "0");
  if (!response.ok || !contentType.startsWith("image/")) {
    throw new Error(`Required Facebook attention image is unavailable (HTTP ${response.status})`);
  }
  if (Number.isFinite(contentLength) && contentLength > MAX_FACEBOOK_IMAGE_BYTES) {
    throw new Error("Required Facebook attention image is too large");
  }
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_FACEBOOK_IMAGE_BYTES) {
    throw new Error("Required Facebook attention image is empty or too large");
  }
  return { bytes, contentType };
}

async function recordAttentionPost(
  db: any,
  post: KtrFacebookAttentionPost,
  message: string,
  externalId: string | null,
): Promise<string> {
  const { data: inserted, error } = await db
    .from("content_packages")
    .insert({
      source_title: post.title,
      // Keep this null even when the social copy contains a KTR URL. Otherwise
      // the article/durable-guide history could incorrectly treat the linked
      // destination itself as having already received its dedicated post.
      source_url: null,
      category: post.category,
      facebook_hook: message,
      facebook_body: null,
      facebook_cta: null,
      status: "PUBLISHED",
      asset_type: "IMAGE",
      asset_url: KTR_FACEBOOK_ATTENTION_IMAGE_URL,
      workflow_status: "PUBLISHED",
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  const packageId = String(inserted.id);
  const { error: queueError } = await db.from("publishing_queue").insert({
    content_package_id: packageId,
    platform: "facebook",
    status: "PUBLISHED",
    published_time: new Date().toISOString(),
    notes: externalId
      ? `Facebook post ${externalId}; kind=attention-post; asset=image`
      : "KeepTXRed Facebook post; kind=attention-post; asset=image",
  });
  if (queueError) throw new Error(queueError.message);
  return packageId;
}

export async function publishKtrFacebookAttentionPost(args: {
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

  const message = formatKtrFacebookPublishedAttentionMessage(post);
  const trafficUrl = ktrFacebookAttentionTrafficUrl(post);

  let image: { bytes: ArrayBuffer; contentType: string };
  try {
    image = await loadRequiredAttentionImage();
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: "Facebook attention post blocked because its required image was unavailable",
        detail: error instanceof Error ? error.message : String(error),
        image_url: KTR_FACEBOOK_ATTENTION_IMAGE_URL,
      },
      { status: 503 },
    );
  }

  const graphUrl = `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(String(connection.account_id))}/photos`;
  const body = new FormData();
  body.set("access_token", String(connection.access_token));
  body.set("source", new Blob([image.bytes], { type: image.contentType }), "keep-tx-red-attention.jpg");
  body.set("caption", message);

  const graphResponse = await fetch(graphUrl, {
    method: "POST",
    body,
  });
  const graphJson = (await graphResponse.json().catch(() => ({}))) as {
    id?: string;
    post_id?: string;
    error?: { message?: string };
  };

  const externalId = graphJson.post_id ?? graphJson.id ?? null;
  if (!graphResponse.ok || !externalId) {
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

  let packageId: string | null = null;
  let recordWarning: string | null = null;
  try {
    packageId = await recordAttentionPost(args.db, post, message, externalId);
  } catch (error) {
    recordWarning = error instanceof Error ? error.message : String(error);
    console.error("[KeepTXRed Facebook] attention post succeeded but history recording failed", recordWarning);
  }

  return Response.json({
    ok: true,
    posted: true,
    site: "KeepTXRed",
    kind: "attention-post",
    title: post.title,
    category: post.category,
    article_url: null,
    traffic_url: trafficUrl,
    image_url: KTR_FACEBOOK_ATTENTION_IMAGE_URL,
    external_id: externalId,
    post_url: externalId ? `https://www.facebook.com/${externalId}` : null,
    package_id: packageId,
    record_warning: recordWarning,
    posted_at: new Date().toISOString(),
    mode: args.mode,
    attention_mode: args.slot === 1 ? "reach" : args.slot === 3 ? "traffic" : "mixed",
    content_mix: { article_or_guide_slots: 3, attention_slots: 2 },
  });
}
