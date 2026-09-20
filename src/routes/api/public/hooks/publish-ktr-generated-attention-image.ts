import { createFileRoute } from "@tanstack/react-router";
import {
  findKtrFacebookAttentionPostBySourceId,
  formatKtrFacebookPublishedAttentionMessage,
  ktrFacebookAttentionTrafficUrl,
} from "@/lib/facebook-attention-publisher.server";
import {
  fetchRecentFacebookPagePosts,
  normalizeFacebookHeadline,
} from "@/lib/facebook-page-history";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";

const OIDC_AUDIENCE = "keeptxred-facebook";
const REPOSITORY = "keeptxred/texas-heartland-hub";
const WORKFLOW_PATH = ".github/workflows/auto-facebook-posts.yml";
const GRAPH_VERSION = "v21.0";
const MAX_FACEBOOK_IMAGE_BYTES = 12 * 1024 * 1024;
const MAX_POST_TEXT_CHARS = 2_000;
const KTR_GITHUB_PATH = "/keeptxred/texas-heartland-hub";
const SOURCE_POST_ID_PATTERN = /^ktr-attention-[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

function parseKtrGitHubProvenance(
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

    const runMatch = runUrl.pathname.match(new RegExp(`^${KTR_GITHUB_PATH}/actions/runs/(\\d+)$`));
    const artifactMatch = artifactUrl.pathname.match(
      new RegExp(`^${KTR_GITHUB_PATH}/actions/runs/(\\d+)/artifacts/(\\d+)$`),
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

async function loadConnection(db: any): Promise<SocialConnectionRow> {
  const { data, error } = await db
    .from("social_connections")
    .select("account_id,access_token,connection_status")
    .ilike("platform", "facebook")
    .maybeSingle();
  if (error) throw new Error(error.message);

  const connection = data as SocialConnectionRow | null;
  if (!connection || connection.connection_status !== "CONNECTED" || !connection.account_id || !connection.access_token) {
    throw new Error("Keep TX Red Facebook Page is not connected");
  }
  return connection;
}

async function recordPublishedPost(args: {
  db: any;
  title: string;
  category: string;
  postText: string;
  sourcePostId: string;
  imageSha256: string;
  artifactUrl: string;
  externalId: string;
}): Promise<string> {
  const { data: inserted, error } = await args.db
    .from("content_packages")
    .insert({
      source_title: args.title,
      // Attention posts are social-native. Keep source_url null so article and
      // durable-guide history cannot mistake the engagement post for a guide post.
      source_url: null,
      category: args.category,
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
    platform: "facebook",
    status: "PUBLISHED",
    published_time: new Date().toISOString(),
    notes: `Facebook generated attention image ${args.externalId}; source_post_id=${args.sourcePostId}; sha256=${args.imageSha256}`,
  });
  if (queueError) throw new Error(queueError.message);
  return packageId;
}

async function publishKtrGeneratedAttentionImage(request: Request): Promise<Response> {
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
    return Response.json(
      {
        ok: false,
        posted: false,
        error: "GitHub Actions OIDC verification failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 403 },
    );
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
    return Response.json({ ok: false, posted: false, error: "Generated Facebook asset must be a PNG" }, { status: 400 });
  }
  if (imageValue.size > MAX_FACEBOOK_IMAGE_BYTES) {
    return Response.json({ ok: false, posted: false, error: "Generated Facebook image exceeds size limit" }, { status: 413 });
  }
  if (typeof expectedShaValue !== "string" || !/^[a-f0-9]{64}$/i.test(expectedShaValue)) {
    return Response.json({ ok: false, posted: false, error: "Generated Facebook image SHA-256 is required" }, { status: 400 });
  }
  if (
    typeof sourcePostIdValue !== "string" ||
    sourcePostIdValue.length > 100 ||
    !SOURCE_POST_ID_PATTERN.test(sourcePostIdValue)
  ) {
    return Response.json({ ok: false, posted: false, error: "Valid KTR attention source post ID is required" }, { status: 400 });
  }

  const sourcePostId = sourcePostIdValue;
  const sourcePost = findKtrFacebookAttentionPostBySourceId(sourcePostId);
  if (!sourcePost) {
    return Response.json({ ok: false, posted: false, error: "Unknown KTR attention source post ID" }, { status: 400 });
  }

  const expectedPostText = formatKtrFacebookPublishedAttentionMessage(sourcePost);
  if (postTextValue !== expectedPostText) {
    return Response.json(
      { ok: false, posted: false, error: "Facebook post text does not match the registered KTR attention post" },
      { status: 409 },
    );
  }

  const provenance = parseKtrGitHubProvenance(artifactUrlValue, runUrlValue);
  if (!provenance) {
    return Response.json(
      { ok: false, posted: false, error: "Matching KTR GitHub artifact and workflow run URLs are required" },
      { status: 400 },
    );
  }
  if (provenance.runId !== oidcRunId) {
    return Response.json(
      { ok: false, posted: false, error: "KTR GitHub run provenance does not match the signed OIDC run ID" },
      { status: 403 },
    );
  }

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
    const normalizedCandidate = normalizeFacebookHeadline(postTextValue);
    if (
      normalizedCandidate &&
      livePosts.some((post) => normalizeFacebookHeadline(post.message ?? "") === normalizedCandidate)
    ) {
      return Response.json({
        ok: true,
        posted: false,
        duplicate: true,
        reason: "Exact KTR attention message is already present on the Page",
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
        error: "Keep TX Red Facebook duplicate verification failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }

  const graphUrl = `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(String(connection.account_id))}/photos`;
  const body = new FormData();
  body.set("access_token", String(connection.access_token));
  body.set("caption", postTextValue);
  body.set("source", new Blob([bytes], { type: "image/png" }), imageValue.name);

  const graphResponse = await fetch(graphUrl, { method: "POST", body });
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
        source_post_id: sourcePostId,
        image_sha256: actualSha,
        github_run_id: provenance.runId,
      },
      { status: 502 },
    );
  }

  let packageId: string | null = null;
  let recordWarning: string | null = null;
  try {
    packageId = await recordPublishedPost({
      db,
      title: sourcePost.title,
      category: sourcePost.category,
      postText: postTextValue,
      sourcePostId,
      imageSha256: actualSha,
      artifactUrl: provenance.artifactUrl,
      externalId,
    });
  } catch (error) {
    recordWarning = error instanceof Error ? error.message : String(error);
    console.error("[KeepTXRed Facebook] generated attention image post succeeded but history recording failed", recordWarning);
  }

  return Response.json({
    ok: true,
    posted: true,
    site: "KeepTXRed",
    kind: "attention-post",
    title: sourcePost.title,
    category: sourcePost.category,
    article_url: null,
    traffic_url: ktrFacebookAttentionTrafficUrl(sourcePost),
    source_post_id: sourcePostId,
    external_id: externalId,
    post_url: `https://www.facebook.com/${externalId}`,
    package_id: packageId,
    record_warning: recordWarning,
    image_sha256: actualSha,
    image_storage_url: provenance.artifactUrl,
    github_run_url: provenance.runUrl,
    github_run_id: provenance.runId,
    text_only_fallback: false,
    generic_fallback: false,
    posted_at: new Date().toISOString(),
  });
}

export const Route = createFileRoute("/api/public/hooks/publish-ktr-generated-attention-image")({
  server: { handlers: { POST: async ({ request }) => publishKtrGeneratedAttentionImage(request) } },
});
