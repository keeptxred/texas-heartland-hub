import type { KtrFacebookAttentionPost } from "@/lib/facebook-attention-posts";

const SITE_URL = "https://keeptxred.com";
const BUCKET = "article-images";
const MAX_FACEBOOK_IMAGE_BYTES = 12 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function sanitize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 72) || "attention-post";
}

function base64ToBytes(value: string): Uint8Array {
  const normalized = value.replace(/^data:image\/(?:jpeg|jpg|png|webp);base64,/i, "").replace(/\s+/g, "");
  const binary = atob(normalized);
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

export function decodeSuppliedKtrFacebookAttentionImage(args: {
  base64: string;
  contentType: string;
}): { bytes: Uint8Array; contentType: "image/jpeg" | "image/png" | "image/webp" } {
  const contentType = args.contentType.toLowerCase().split(";", 1)[0].trim();
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    throw new Error(`Unsupported ChatGPT image content type: ${contentType || "missing"}`);
  }
  const bytes = base64ToBytes(args.base64);
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_FACEBOOK_IMAGE_BYTES) {
    throw new Error("ChatGPT-generated Facebook image is empty or too large");
  }
  return { bytes, contentType: contentType as "image/jpeg" | "image/png" | "image/webp" };
}

export async function storeSuppliedKtrFacebookAttentionImage(args: {
  db: any;
  post: KtrFacebookAttentionPost;
  base64: string;
  contentType: string;
}): Promise<{ bytes: Uint8Array; contentType: "image/jpeg" | "image/png" | "image/webp"; url: string; prompt: string }> {
  const prompt = buildKtrFacebookAttentionImagePrompt(args.post.message);
  const decoded = decodeSuppliedKtrFacebookAttentionImage({ base64: args.base64, contentType: args.contentType });
  const filename = ktrFacebookAttentionImageFilename(args.post);
  const url = ktrFacebookAttentionImageUrl(args.post);
  const upload = await args.db.storage.from(BUCKET).upload(filename, decoded.bytes, {
    contentType: decoded.contentType,
    cacheControl: "public, max-age=31536000, immutable",
    upsert: true,
  });
  if (upload.error) throw new Error(`ChatGPT-generated Facebook image could not be stored: ${upload.error.message}`);
  return { ...decoded, url, prompt };
}
