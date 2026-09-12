import { createFileRoute } from "@tanstack/react-router";
import {
  fetchRecentFacebookPagePosts,
  normalizeFacebookHeadline,
} from "@/lib/facebook-page-history";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";

const OIDC_AUDIENCE = "keeptxred-facebook";
const REPOSITORY = "keeptxred/TexasDefined";
const WORKFLOW_PATH = ".github/workflows/auto-facebook-engagement.yml";
const ONE_TIME_WORKFLOW_PATH = ".github/workflows/one-time-weird-town-facebook.yml";
const SOCIAL_PLATFORM = "facebook_texasdefined";
const GRAPH_VERSION = "v21.0";
const MAX_FACEBOOK_IMAGE_BYTES = 12 * 1024 * 1024;
const MAX_POST_TEXT_CHARS = 2_000;
const TEXASDEFINED_GITHUB_PATH = "/keeptxred/TexasDefined";
const TEXASDEFINED_IMAGE_ATTRIBUTION = "Brought to you by your friends at TexasDefined.com";
const SOURCE_POST_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)+$/;

const ONE_TIME_ARTICLE_URL =
  "https://texasdefined.com/article/weirdest-town-names-in-texas-and-how-they-got-them";
const ONE_TIME_IMAGE_URL =
  "https://texasdefined.com/images/social/weird-texas-town-names-facebook-2026-09-12.png";
const ONE_TIME_SOURCE_POST_ID = "weird-texas-town-names-20260912";
const ONE_TIME_POST_TEXT = `20 Weird Texas Town Names That Sound Made Up—but Aren’t

From Cut and Shoot and Dime Box to Bug Tussle, Nameless and Uncertain, Texas has place names that sound like punch lines. Their real stories involve post offices, cattle, dry creeks, railroads, family names—and a healthy amount of folklore.

${ONE_TIME_ARTICLE_URL}`;

type SocialConnectionRow = {
  account_id: string | null;
  access_token: string | null;
  connection_status: string | null;
};

type GitHubPublishProvenance = {
  artifactUrl: string;
  runUrl: string;
  runId: string;
};

type FacebookPublishResult = {
  externalId: string;
  postId: string | null;
  photoId: string | null;
  postUrl: string | null;
  postUrlSource: string;
};

function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

function parseTexasDefinedGitHubProvenance(
  artifactUrlValue: FormDataEntryValue | null,
  runUrlValue: FormDataEntryValue | null,
): GitHubPublishProvenance | null {
  if (typeof artifactUrlValue !== "string" || typeof runUrlValue !== "string") return null;

  try {
    const artifactUrl = new URL(artifactUrlValue);
    const runUrl = new URL(runUrlValue);
    if (
      artifactUrl.protocol !== "https:" ||
      runUrl.protocol !== "https:" ||
      artifactUrl.hostname !== "github.com" ||
      runUrl.hostname !== "github.com" ||
      artifactUrl.username ||
      artifactUrl.password ||
      runUrl.username ||
      runUrl.password ||
      artifactUrl.search ||
      artifactUrl.hash ||
      runUrl.search ||
      runUrl.hash
    ) {
      return null;
    }

    const runMatch = runUrl.pathname.match(
      new RegExp(`^${TEXASDEFINED_GITHUB_PATH}/actions/runs/(\\d+)$`),
    );
    const artifactMatch = artifactUrl.pathname.match(
      new RegExp(`^${TEXASDEFINED_GITHUB_PATH}/actions/runs/(\\d+)/artifacts/(\\d+)$`),
    );
    if (!runMatch || !artifactMatch || runMatch[1] !== artifactMatch[1]) return null;

    return {
      artifactUrl: artifactUrl.toString(),
      runUrl: runUrl.toString(),
      runId: runMatch[1],
    };
  } catch {
    return null;
  }
}

async function sha256Hex(bytes: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, "0")).join("");
}

function isPng(bytes: ArrayBuffer): boolean {
  const view = new Uint8Array(bytes);
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  return view.length >= signature.length && signature.every((value, index) => view[index] === value);
}

async function loadConnection(db: any): Promise<SocialConnectionRow> {
  const { data, error } = await db
    .from("social_connections")
    .select("account_id,access_token,connection_status")
    .eq("platform", SOCIAL_PLATFORM)
    .maybeSingle();
  if (error) throw new Error(error.message);

  const connection = data as SocialConnectionRow | null;
  if (!connection || connection.connection_status !== "CONNECTED" || !connection.account_id || !connection.access_token) {
    throw new Error("TexasDefined Facebook Page is not connected");
  }
  return connection;
}

async function recordPublishedPost(args: {
  db: any;
  postText: string;
  sourcePostId: string;
  imageSha256: string;
  artifactUrl: string;
  runUrl: string;
  externalId: string;
}): Promise<string> {
  const { data: inserted, error } = await args.db
    .from("content_packages")
    .insert({
      source_title: `TexasDefined engagement ${args.sourcePostId}`,
      source_url: args.runUrl,
      category: "TexasDefined",
      facebook_hook: args.postText,
      facebook_body: null,
      facebook_cta: null,
      status: "PUBLISHED",
      asset_type: "IMAGE",
      asset_url: args.artifactUrl,
      workflow_status: "PUBLISHED",
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  const packageId = String(inserted.id);
  const { error: queueError } = await args.db.from("publishing_queue").insert({
    content_package_id: packageId,
    platform: SOCIAL_PLATFORM,
    status: "PUBLISHED",
    published_time: new Date().toISOString(),
    notes: `Facebook generated-image post ${args.externalId}; source_post_id=${args.sourcePostId}; sha256=${args.imageSha256}`,
  });
  if (queueError) throw new Error(queueError.message);
  return packageId;
}

async function resolveFacebookPostUrl(args: {
  pageId: string;
  pageToken: string;
  graphPostId?: string;
  graphPhotoId?: string;
}): Promise<{ postUrl: string | null; postUrlSource: string }> {
  const postIdMatch = args.graphPostId?.match(/^(\d+)_(\d+)$/) ?? null;
  const constructedPostUrl =
    postIdMatch && postIdMatch[1] === args.pageId
      ? `https://www.facebook.com/permalink.php?story_fbid=${encodeURIComponent(postIdMatch[2])}&id=${encodeURIComponent(args.pageId)}`
      : args.graphPhotoId && /^\d+$/.test(args.graphPhotoId)
        ? `https://www.facebook.com/photo/?fbid=${encodeURIComponent(args.graphPhotoId)}`
        : null;
  let postUrl = constructedPostUrl;
  let postUrlSource = constructedPostUrl ? "constructed_fallback" : "unavailable";

  if (args.graphPostId) {
    try {
      const refreshedPosts = await fetchRecentFacebookPagePosts({
        pageId: args.pageId,
        pageToken: args.pageToken,
        limit: 25,
      });
      const publishedPost = refreshedPosts.find((post) => post.id === args.graphPostId);
      if (publishedPost?.permalink_url) {
        postUrl = publishedPost.permalink_url;
        postUrlSource = "meta_permalink_url";
      }
    } catch (error) {
      console.warn(
        "[TexasDefined Facebook] post succeeded but canonical permalink lookup failed; using constructed fallback",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  return { postUrl, postUrlSource };
}

async function publishFacebookImage(args: {
  connection: SocialConnectionRow;
  bytes: ArrayBuffer;
  postText: string;
  filename: string;
}): Promise<FacebookPublishResult> {
  const pageId = String(args.connection.account_id);
  const pageToken = String(args.connection.access_token);
  const graphUrl = `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(pageId)}/photos`;
  const body = new FormData();
  body.set("access_token", pageToken);
  body.set("caption", args.postText);
  body.set("source", new Blob([args.bytes], { type: "image/png" }), args.filename);

  const graphResponse = await fetch(graphUrl, { method: "POST", body });
  const graphJson = (await graphResponse.json().catch(() => ({}))) as {
    id?: string;
    post_id?: string;
    error?: { message?: string };
  };
  const externalId = graphJson.post_id ?? graphJson.id ?? null;
  if (!graphResponse.ok || !externalId) {
    throw new Error(graphJson.error?.message ?? `Facebook Graph API returned HTTP ${graphResponse.status}`);
  }

  const { postUrl, postUrlSource } = await resolveFacebookPostUrl({
    pageId,
    pageToken,
    graphPostId: graphJson.post_id,
    graphPhotoId: graphJson.id,
  });

  return {
    externalId,
    postId: graphJson.post_id ?? null,
    photoId: graphJson.id ?? null,
    postUrl,
    postUrlSource,
  };
}

async function publishOneTimeWeirdTownArticle(runId: string): Promise<Response> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;

  let connection: SocialConnectionRow;
  try {
    connection = await loadConnection(db);
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: error instanceof Error ? error.message : String(error),
        requires_connection: true,
      },
      { status: 503 },
    );
  }

  try {
    const livePosts = await fetchRecentFacebookPagePosts({
      pageId: String(connection.account_id),
      pageToken: String(connection.access_token),
      limit: 100,
    });
    const normalizedCandidate = normalizeFacebookHeadline(ONE_TIME_POST_TEXT);
    if (
      normalizedCandidate &&
      livePosts.some((post) => normalizeFacebookHeadline(post.message ?? "") === normalizedCandidate)
    ) {
      const duplicate = livePosts.find(
        (post) => normalizeFacebookHeadline(post.message ?? "") === normalizedCandidate,
      );
      return Response.json({
        ok: true,
        posted: false,
        duplicate: true,
        reason: "Exact weird-town article post is already present on the TexasDefined Facebook Page",
        source_post_id: ONE_TIME_SOURCE_POST_ID,
        article_url: ONE_TIME_ARTICLE_URL,
        post_url: duplicate?.permalink_url ?? null,
        github_run_id: runId,
      });
    }
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: "TexasDefined Facebook duplicate verification failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }

  let bytes: ArrayBuffer;
  try {
    const imageResponse = await fetch(ONE_TIME_IMAGE_URL, {
      headers: { accept: "image/png,image/*;q=0.8,*/*;q=0.1" },
      cache: "no-store",
    });
    if (!imageResponse.ok) throw new Error(`Approved image returned HTTP ${imageResponse.status}`);
    bytes = await imageResponse.arrayBuffer();
    if (bytes.byteLength <= 0 || bytes.byteLength > MAX_FACEBOOK_IMAGE_BYTES || !isPng(bytes)) {
      throw new Error("Approved weird-town image is empty, too large, or no longer a PNG");
    }
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: "Approved TexasDefined weird-town image could not be loaded",
        detail: error instanceof Error ? error.message : String(error),
        image_url: ONE_TIME_IMAGE_URL,
      },
      { status: 502 },
    );
  }

  const actualSha = await sha256Hex(bytes);
  let published: FacebookPublishResult;
  try {
    published = await publishFacebookImage({
      connection,
      bytes,
      postText: ONE_TIME_POST_TEXT,
      filename: "weird-texas-town-names-facebook-2026-09-12.png",
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: error instanceof Error ? error.message : String(error),
        source_post_id: ONE_TIME_SOURCE_POST_ID,
        article_url: ONE_TIME_ARTICLE_URL,
        image_url: ONE_TIME_IMAGE_URL,
        image_sha256: actualSha,
        github_run_id: runId,
      },
      { status: 502 },
    );
  }

  const runUrl = `https://github.com/${REPOSITORY}/actions/runs/${runId}`;
  let packageId: string | null = null;
  let recordWarning: string | null = null;
  try {
    packageId = await recordPublishedPost({
      db,
      postText: ONE_TIME_POST_TEXT,
      sourcePostId: ONE_TIME_SOURCE_POST_ID,
      imageSha256: actualSha,
      artifactUrl: ONE_TIME_IMAGE_URL,
      runUrl,
      externalId: published.externalId,
    });
  } catch (error) {
    recordWarning = error instanceof Error ? error.message : String(error);
    console.error("[TexasDefined Facebook] weird-town post succeeded but history recording failed", recordWarning);
  }

  return Response.json({
    ok: true,
    posted: true,
    site: "TexasDefined",
    kind: "article",
    source_post_id: ONE_TIME_SOURCE_POST_ID,
    article_url: ONE_TIME_ARTICLE_URL,
    external_id: published.externalId,
    facebook_post_id: published.postId,
    facebook_photo_id: published.photoId,
    post_url: published.postUrl,
    post_url_source: published.postUrlSource,
    package_id: packageId,
    record_warning: recordWarning,
    image_sha256: actualSha,
    image_storage_url: ONE_TIME_IMAGE_URL,
    github_run_url: runUrl,
    github_run_id: runId,
    text_only_fallback: false,
    generic_fallback: false,
    posted_at: new Date().toISOString(),
  });
}

async function publishTexasDefinedGeneratedImage(request: Request): Promise<Response> {
  const token = bearerToken(request);
  if (!token) {
    return Response.json({ ok: false, posted: false, error: "Missing GitHub Actions OIDC token" }, { status: 401 });
  }

  let oidcRunId: string;
  try {
    const claims = await verifyGitHubActionsOidc({
      token,
      audience: OIDC_AUDIENCE,
      repository: REPOSITORY,
      workflowPath: WORKFLOW_PATH,
    });
    if (typeof claims.run_id !== "string" || !/^\d+$/.test(claims.run_id)) {
      throw new Error("GitHub Actions OIDC token is missing a valid run ID");
    }
    oidcRunId = claims.run_id;
  } catch (error) {
    try {
      const oneTimeClaims = await verifyGitHubActionsOidc({
        token,
        audience: OIDC_AUDIENCE,
        repository: REPOSITORY,
        workflowPath: ONE_TIME_WORKFLOW_PATH,
        allowedEventNames: ["push"],
      });
      if (typeof oneTimeClaims.run_id !== "string" || !/^\d+$/.test(oneTimeClaims.run_id)) {
        throw new Error("One-time GitHub Actions OIDC token is missing a valid run ID");
      }
      return publishOneTimeWeirdTownArticle(oneTimeClaims.run_id);
    } catch (oneTimeError) {
      return Response.json(
        {
          ok: false,
          posted: false,
          error: "GitHub Actions OIDC verification failed",
          detail: error instanceof Error ? error.message : String(error),
          one_time_detail: oneTimeError instanceof Error ? oneTimeError.message : String(oneTimeError),
        },
        { status: 403 },
      );
    }
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: "Invalid multipart Facebook publish request",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 400 },
    );
  }

  const postTextValue = form.get("post_text");
  const imageValue = form.get("image");
  const expectedShaValue = form.get("image_sha256");
  const sourcePostIdValue = form.get("source_post_id");
  const attributionValue = form.get("attribution");
  const artifactUrlValue = form.get("artifact_url");
  const runUrlValue = form.get("github_run_url");

  if (
    typeof postTextValue !== "string" ||
    postTextValue.length === 0 ||
    postTextValue.length > MAX_POST_TEXT_CHARS
  ) {
    return Response.json({ ok: false, posted: false, error: "Facebook post text is required and must be within limits" }, { status: 400 });
  }
  if (!(imageValue instanceof File) || imageValue.size <= 0) {
    return Response.json({ ok: false, posted: false, error: "Generated Facebook image is required" }, { status: 400 });
  }
  if (imageValue.type !== "image/png" || !imageValue.name.toLowerCase().endsWith(".png")) {
    return Response.json({ ok: false, posted: false, error: "Generated Facebook asset must be the attributed PNG" }, { status: 400 });
  }
  if (imageValue.size > MAX_FACEBOOK_IMAGE_BYTES) {
    return Response.json({ ok: false, posted: false, error: "Generated Facebook image exceeds size limit" }, { status: 413 });
  }
  if (typeof expectedShaValue !== "string" || !/^[a-f0-9]{64}$/i.test(expectedShaValue)) {
    return Response.json({ ok: false, posted: false, error: "Generated Facebook image SHA-256 is required" }, { status: 400 });
  }
  if (
    typeof sourcePostIdValue !== "string" ||
    sourcePostIdValue.length > 64 ||
    !SOURCE_POST_ID_PATTERN.test(sourcePostIdValue)
  ) {
    return Response.json({ ok: false, posted: false, error: "Valid TexasDefined source post ID is required" }, { status: 400 });
  }
  if (typeof attributionValue !== "string" || attributionValue.trim() !== TEXASDEFINED_IMAGE_ATTRIBUTION) {
    return Response.json({ ok: false, posted: false, error: "Exact TexasDefined image attribution is required" }, { status: 400 });
  }

  const provenance = parseTexasDefinedGitHubProvenance(artifactUrlValue, runUrlValue);
  if (!provenance) {
    return Response.json(
      { ok: false, posted: false, error: "Matching TexasDefined GitHub artifact and workflow run URLs are required" },
      { status: 400 },
    );
  }
  if (provenance.runId !== oidcRunId) {
    return Response.json(
      { ok: false, posted: false, error: "TexasDefined GitHub run provenance does not match the signed OIDC run ID" },
      { status: 403 },
    );
  }

  const postText = postTextValue;
  const sourcePostId = sourcePostIdValue;
  const artifactUrl = provenance.artifactUrl;
  const runUrl = provenance.runUrl;
  const bytes = await imageValue.arrayBuffer();
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_FACEBOOK_IMAGE_BYTES) {
    return Response.json({ ok: false, posted: false, error: "Generated Facebook image is empty or too large" }, { status: 400 });
  }

  const actualSha = await sha256Hex(bytes);
  if (actualSha.toLowerCase() !== expectedShaValue.toLowerCase()) {
    return Response.json(
      { ok: false, posted: false, error: "Generated Facebook image changed after storage", expected_sha256: expectedShaValue, actual_sha256: actualSha },
      { status: 409 },
    );
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as any;

  let connection: SocialConnectionRow;
  try {
    connection = await loadConnection(db);
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: error instanceof Error ? error.message : String(error),
        requires_connection: true,
      },
      { status: 503 },
    );
  }

  try {
    const livePosts = await fetchRecentFacebookPagePosts({
      pageId: String(connection.account_id),
      pageToken: String(connection.access_token),
      limit: 100,
    });
    const normalizedCandidate = normalizeFacebookHeadline(postText);
    if (
      normalizedCandidate &&
      livePosts.some((post) => normalizeFacebookHeadline(post.message ?? "") === normalizedCandidate)
    ) {
      return Response.json({
        ok: true,
        posted: false,
        duplicate: true,
        reason: "Exact TexasDefined Facebook message is already present on the Page",
        source_post_id: sourcePostId,
        image_sha256: actualSha,
        github_run_id: provenance.runId,
      });
    }
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: "TexasDefined Facebook duplicate verification failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }

  let published: FacebookPublishResult;
  try {
    published = await publishFacebookImage({
      connection,
      bytes,
      postText,
      filename: imageValue.name,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        posted: false,
        error: error instanceof Error ? error.message : String(error),
        requires_connection: false,
        source_post_id: sourcePostId,
        image_sha256: actualSha,
        github_run_id: provenance.runId,
      },
      { status: 502 },
    );
  }

  const pageId = String(connection.account_id);
  const graphJson = {
    post_id: published.postId ?? undefined,
    id: published.photoId ?? undefined,
  };
  const postIdMatch = graphJson.post_id?.match(/^(\d+)_(\d+)$/) ?? null;
  const constructedPostUrl =
    postIdMatch && postIdMatch[1] === pageId
      ? `https://www.facebook.com/permalink.php?story_fbid=${encodeURIComponent(postIdMatch[2])}&id=${encodeURIComponent(pageId)}`
      : graphJson.id && /^\d+$/.test(graphJson.id)
        ? `https://www.facebook.com/photo/?fbid=${encodeURIComponent(graphJson.id)}`
        : null;
  let postUrl = constructedPostUrl;
  let postUrlSource = constructedPostUrl ? "constructed_fallback" : "unavailable";

  if (graphJson.post_id) {
    try {
      const refreshedPosts = await fetchRecentFacebookPagePosts({
        pageId,
        pageToken: String(connection.access_token),
        limit: 25,
      });
      const publishedPost = refreshedPosts.find((post) => post.id === graphJson.post_id);
      if (publishedPost?.permalink_url) {
        postUrl = publishedPost.permalink_url;
        postUrlSource = "meta_permalink_url";
      }
    } catch (error) {
      console.warn(
        "[TexasDefined Facebook] post succeeded but canonical permalink lookup failed; using constructed fallback",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  if (published.postUrl) {
    postUrl = published.postUrl;
    postUrlSource = published.postUrlSource;
  }

  let packageId: string | null = null;
  let recordWarning: string | null = null;
  try {
    packageId = await recordPublishedPost({
      db,
      postText,
      sourcePostId,
      imageSha256: actualSha,
      artifactUrl,
      runUrl,
      externalId: published.externalId,
    });
  } catch (error) {
    recordWarning = error instanceof Error ? error.message : String(error);
    console.error("[TexasDefined Facebook] generated image post succeeded but history recording failed", recordWarning);
  }

  return Response.json({
    ok: true,
    posted: true,
    site: "TexasDefined",
    kind: "engagement",
    source_post_id: sourcePostId,
    external_id: published.externalId,
    facebook_post_id: graphJson.post_id ?? null,
    facebook_photo_id: graphJson.id ?? null,
    post_url: postUrl,
    post_url_source: postUrlSource,
    package_id: packageId,
    record_warning: recordWarning,
    image_sha256: actualSha,
    image_storage_url: artifactUrl,
    github_run_url: runUrl,
    github_run_id: provenance.runId,
    text_only_fallback: false,
    generic_fallback: false,
    posted_at: new Date().toISOString(),
  });
}

export const Route = createFileRoute("/api/public/hooks/publish-texasdefined-generated-image")({
  server: { handlers: { POST: async ({ request }) => publishTexasDefinedGeneratedImage(request) } },
});
