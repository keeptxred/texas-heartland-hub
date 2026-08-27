export const FACEBOOK_GRAPH_VERSION = "v21.0";
export const TEXASDEFINED_FACEBOOK_PLATFORM = "facebook_texasdefined";
export const TEXASDEFINED_REEL_CONFIRMATION = "PUBLISH TEXASDEFINED REEL";
export const MAX_REEL_BYTES = 100 * 1024 * 1024;

export type ReelSource =
  | { kind: "url"; url: string }
  | { kind: "file"; bytes: ArrayBuffer; size: number; contentType: string; filename: string };

export type PublishFacebookReelInput = {
  pageId: string;
  pageToken: string;
  source: ReelSource;
  title?: string;
  description?: string;
  graphVersion?: string;
};

export type PublishFacebookReelResult = {
  videoId: string;
  uploadUrl: string;
};

export function normalizeHostedReelUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function isSupportedReelContentType(contentType: string): boolean {
  const normalized = contentType.split(";", 1)[0]?.trim().toLowerCase();
  return normalized === "video/mp4" || normalized === "video/quicktime";
}

export function isSupportedReelFilename(filename: string): boolean {
  return /\.(mp4|mov)$/i.test(filename.trim());
}

export function validateReelFile(file: File): string | null {
  if (file.size <= 0) return "Reel file is empty.";
  if (file.size > MAX_REEL_BYTES) return `Reel file exceeds the ${MAX_REEL_BYTES / 1024 / 1024} MB publisher limit.`;
  if (!isSupportedReelContentType(file.type) && !isSupportedReelFilename(file.name)) {
    return "Reel must be an MP4 or MOV video.";
  }
  return null;
}

async function graphError(response: Response, fallback: string): Promise<Error> {
  let detail = "";
  try {
    const payload = (await response.json()) as { error?: { message?: string; code?: number }; message?: string };
    detail = payload.error?.message ?? payload.message ?? "";
  } catch {
    detail = await response.text().catch(() => "");
  }
  return new Error(detail ? `${fallback}: ${detail}` : `${fallback} (HTTP ${response.status})`);
}

export async function publishFacebookReel(input: PublishFacebookReelInput): Promise<PublishFacebookReelResult> {
  const graphVersion = input.graphVersion ?? FACEBOOK_GRAPH_VERSION;
  const graphBase = `https://graph.facebook.com/${graphVersion}`;
  const pagePath = `${graphBase}/${encodeURIComponent(input.pageId)}/video_reels`;

  const startBody = new URLSearchParams({
    access_token: input.pageToken,
    upload_phase: "start",
  });
  const startResponse = await fetch(pagePath, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: startBody,
  });
  if (!startResponse.ok) throw await graphError(startResponse, "Facebook Reel upload could not be initialized");

  const startPayload = (await startResponse.json()) as { video_id?: string; upload_url?: string };
  const videoId = startPayload.video_id?.trim();
  const uploadUrl = startPayload.upload_url?.trim();
  if (!videoId || !uploadUrl || !uploadUrl.startsWith("https://rupload.facebook.com/")) {
    throw new Error("Facebook Reel upload initialization returned an invalid upload session.");
  }

  const uploadHeaders: Record<string, string> = {
    Authorization: `OAuth ${input.pageToken}`,
  };
  let uploadBody: BodyInit | undefined;
  if (input.source.kind === "url") {
    uploadHeaders.file_url = input.source.url;
  } else {
    uploadHeaders.offset = "0";
    uploadHeaders.file_size = String(input.source.size);
    uploadHeaders["content-type"] = "application/octet-stream";
    uploadBody = input.source.bytes;
  }

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: uploadHeaders,
    body: uploadBody,
  });
  if (!uploadResponse.ok) throw await graphError(uploadResponse, "Facebook Reel video upload failed");

  const finishBody = new URLSearchParams({
    access_token: input.pageToken,
    video_id: videoId,
    upload_phase: "finish",
    video_state: "PUBLISHED",
  });
  if (input.title?.trim()) finishBody.set("title", input.title.trim());
  if (input.description?.trim()) finishBody.set("description", input.description.trim());

  const finishResponse = await fetch(pagePath, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: finishBody,
  });
  if (!finishResponse.ok) throw await graphError(finishResponse, "Facebook Reel could not be published");

  return { videoId, uploadUrl };
}
