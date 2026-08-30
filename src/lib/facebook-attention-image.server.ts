import type { KtrFacebookAttentionPost } from "@/lib/facebook-attention-posts";

const SITE_URL = "https://keeptxred.com";
const BUCKET = "article-images";
const IMAGE_MODEL = "@cf/black-forest-labs/flux-2-klein-4b";
const FALLBACK_MODEL = "@cf/black-forest-labs/flux-1-schnell";
const MAX_FACEBOOK_IMAGE_BYTES = 12 * 1024 * 1024;

function cloudflareEndpoint(accountId: string, model: string): string {
  return `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${model}`;
}

function sanitize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 72) || "attention-post";
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

export function buildKtrFacebookAttentionImagePrompt(postText: string): string {
  return [
    "Generate an image for this Facebook post.",
    postText.trim(),
    "Create a polished, magazine-ready social graphic made specifically for this exact post.",
    "Use a compelling realistic scene that directly represents the subject, plus strong editorial layout and clear visual hierarchy.",
    "When useful, incorporate the post question as large readable headline text and short answer choices or supporting labels in the design.",
    "Keep the look premium and credible rather than meme-like: strong photography, clean typography, balanced composition, and a Texas-forward editorial feel where relevant.",
    "Do not use a generic Texas background, generic logo card, unrelated stock-style scene, or placeholder artwork.",
    "The finished image should make sense to a Facebook user before they read the caption.",
  ].join("\n");
}

export function ktrFacebookAttentionImageFilename(post: KtrFacebookAttentionPost): string {
  return `facebook-attention-${sanitize(post.title)}.jpg`;
}

export function ktrFacebookAttentionImageUrl(post: KtrFacebookAttentionPost): string {
  return `${SITE_URL}/api/public/article-image/${ktrFacebookAttentionImageFilename(post)}`;
}

async function requestGeneratedImage(prompt: string, model: string): Promise<Response> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    throw new Error("Missing Cloudflare image-generation credentials");
  }

  if (model === FALLBACK_MODEL) {
    return fetch(cloudflareEndpoint(accountId, model), {
      method: "POST",
      headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt.slice(0, 2048), steps: 8 }),
    });
  }

  const body = new FormData();
  body.append("prompt", prompt.slice(0, 2048));
  body.append("guidance", "5.5");
  body.append("width", "1024");
  body.append("height", "768");
  return fetch(cloudflareEndpoint(accountId, model), {
    method: "POST",
    headers: { Authorization: `Bearer ${apiToken}` },
    body,
  });
}

async function responseToImageBytes(response: Response): Promise<Uint8Array> {
  if (!response.ok) {
    const raw = await response.text().catch(() => "");
    throw new Error(`Image generator returned HTTP ${response.status}: ${raw.slice(0, 300)}`);
  }

  const contentType = (response.headers.get("content-type") ?? "").toLowerCase();
  if (contentType.startsWith("image/") || contentType.includes("application/octet-stream")) {
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (!bytes.byteLength) throw new Error("Image generator returned an empty image");
    return bytes;
  }

  const raw = await response.text();
  const json = JSON.parse(raw) as {
    result?: { image?: string } | string;
    image?: string;
    errors?: Array<{ message?: string }>;
    error?: { message?: string };
  };
  const encoded = (typeof json.result === "object" && json.result ? json.result.image : undefined)
    ?? json.image
    ?? (typeof json.result === "string" ? json.result : undefined);
  if (!encoded) throw new Error(json.errors?.[0]?.message ?? json.error?.message ?? "Image generator returned no image data");
  return base64ToBytes(encoded);
}

async function generateAttentionImage(post: KtrFacebookAttentionPost): Promise<Uint8Array> {
  const prompt = buildKtrFacebookAttentionImagePrompt(post.message);
  let response = await requestGeneratedImage(prompt, IMAGE_MODEL);
  if (!response.ok) response = await requestGeneratedImage(prompt, FALLBACK_MODEL);
  const bytes = await responseToImageBytes(response);
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_FACEBOOK_IMAGE_BYTES) {
    throw new Error("Generated Facebook image is empty or too large");
  }
  return bytes;
}

export async function resolveKtrFacebookAttentionImage(args: {
  db: any;
  post: KtrFacebookAttentionPost;
}): Promise<{ bytes: Uint8Array; contentType: "image/jpeg"; url: string; generated: boolean; prompt: string }> {
  const filename = ktrFacebookAttentionImageFilename(args.post);
  const url = ktrFacebookAttentionImageUrl(args.post);
  const prompt = buildKtrFacebookAttentionImagePrompt(args.post.message);

  const existing = await args.db.storage.from(BUCKET).download(filename);
  if (!existing.error && existing.data) {
    const bytes = new Uint8Array(await existing.data.arrayBuffer());
    if (bytes.byteLength > 0 && bytes.byteLength <= MAX_FACEBOOK_IMAGE_BYTES) {
      return { bytes, contentType: "image/jpeg", url, generated: false, prompt };
    }
  }

  const bytes = await generateAttentionImage(args.post);
  const upload = await args.db.storage.from(BUCKET).upload(filename, bytes, {
    contentType: "image/jpeg",
    cacheControl: "public, max-age=31536000, immutable",
    upsert: true,
  });
  if (upload.error) throw new Error(`Generated Facebook image could not be stored: ${upload.error.message}`);

  return { bytes, contentType: "image/jpeg", url, generated: true, prompt };
}
