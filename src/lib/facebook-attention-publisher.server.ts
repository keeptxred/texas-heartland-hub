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
import {
  buildFacebookPostImagePrompt,
  detectImageContentType,
  extensionForImageContentType,
  generateOpenAiImageBytes,
  OPENAI_IMAGE_FALLBACK_MODEL,
} from "@/lib/openai-image-fallback.server";

const GRAPH_VERSION = "v21.0";
const SITE_URL = "https://keeptxred.com";
const ATTENTION_SLOTS = new Set([1, 3]);
const MAX_FACEBOOK_IMAGE_BYTES = 12 * 1024 * 1024;
const GENERATED_IMAGE_BUCKET = "article-images";

// Attention/engagement posts intentionally use the simple post-text prompt.
// There is no generic default.jpg or stock-image fallback on this path.
export const KTR_FACEBOOK_ATTENTION_IMAGE_MODE = "openai-post-text" as const;

type SocialConnectionRow = {
  account_id: string | null;
  access_token: string | null;
  connection_status: string | null;
};

type GeneratedAttentionImage = {
  bytes: Uint8Array;
  contentType: "image/png" | "image/jpeg" | "image/webp";
  filename: string;
  publicUrl: string;
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

function imageStem(post: KtrFacebookAttentionPost, dateKey: string, slot: number): string {
  const title = campaignContent(post.title).slice(0, 48);
  const fingerprint = hash32(`${dateKey}:${slot}:${post.message}`).toString(16).padStart(8, "0");
  return `facebook-attention-${dateKey}-${slot}-${title}-${fingerprint}`.slice(0, 120);
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

async function generateAndStoreAttentionImage(args: {
  db: any;
  post: KtrFacebookAttentionPost;
  postText: string;
  dateKey: string;
  slot: number;
}): Promise<GeneratedAttentionImage> {
  const prompt = buildFacebookPostImagePrompt(args.postText);
  const bytes = await generateOpenAiImageBytes(prompt);
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_FACEBOOK_IMAGE_BYTES) {
    throw new Error("OpenAI Facebook image is empty or exceeds Facebook size limits");
  }

  const contentType = detectImageContentType(bytes);
  const extension = extensionForImageContentType(contentType);
  const filename = `${imageStem(args.post, args.dateKey, args.slot)}.${extension}`;
  const { error: uploadError } = await args.db.storage.from(GENERATED_IMAGE_BUCKET).upload(filename, bytes, {
    contentType,
    cacheControl: "public, max-age=31536000, immutable",
    upsert: true,
  });
  if (uploadError) throw new Error(`OpenAI Facebook image storage failed: ${uploadError.message}`);

  return {
    bytes,
    contentType,
    filename,
    publicUrl: `${SITE_URL}/api/public/article-image/${filename}`,
  };
}

async function recordAttentionPost(
  db: any,
  post: KtrFacebookAttentionPost,
  message: string,
  assetUrl: string,
  externalId: string | null,
): Promise<string> {
  const { data: inserted, error } = await db
    .from("content_packages")
    .insert({
      source_title: post.title,
      source_url: null,
      category: post.category,
      facebook_hook: message,
      facebook_body: null,
      facebook_cta: null,
      status: "PUBLISHED",
      asset_type: "IMAGE",
      asset_url: assetUrl,
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
      ? `Facebook post ${externalId}; kind=attention-post; asset=openai-generated-image; model=${OPENAI_IMAGE_FALLBACK_MODEL}`
      : `KeepTXRed Facebook post; kind=attention-post; asset=openai-generated-image; model=${OPENAI_IMAGE_FALLBACK_MODEL}`,
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

  let image: GeneratedAttentionImage;
  try {
    image = await generateAndStoreAttentionImage({
      db: args.db,
      post,
      postText: message,
      dateKey: args.dateKey,
      slot: args.slot,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: "Facebook attention post blocked because OpenAI image generation or storage failed",
        detail: error instanceof Error ? error.message : String(error),
        image_provider: "openai",
        image_model: OPENAI_IMAGE_FALLBACK_MODEL,
        generic_fallback_used: false,
      },
      { status: 503 },
    );
  }

  const graphUrl = `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(String(connection.account_id))}/photos`;
  const body = new FormData();
  body.set("access_token", String(connection.access_token));
  body.set("source", new Blob([image.bytes], { type: image.contentType }), image.filename);
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
        image_url: image.publicUrl,
      },
      { status: 502 },
    );
  }

  let packageId: string | null = null;
  let recordWarning: string | null = null;
  try {
    packageId = await recordAttentionPost(args.db, post, message, image.publicUrl, externalId);
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
    image_url: image.publicUrl,
    image_provider: "openai",
    image_model: OPENAI_IMAGE_FALLBACK_MODEL,
    generic_fallback_used: false,
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
