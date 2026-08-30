import type { KtrFacebookAttentionPost } from "@/lib/facebook-attention-posts";

const SITE_URL = "https://keeptxred.com";
const BUCKET = "article-images";
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function sanitize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 72) || "attention-post";
}

export function buildKtrFacebookChatGptImagePrompt(postText: string): string {
  return [
    "Generate an image for this Facebook post.",
    postText.trim(),
    "Create a polished, magazine-ready social graphic made specifically for this exact post.",
    "Use realistic, subject-specific imagery and strong editorial design.",
    "Incorporate the question as clear readable text when appropriate.",
    "Make it feel authentic, high-quality, and relevant to the topic.",
    "Do not use a generic Texas background, placeholder layout, unrelated imagery, or a generic Keep TX Red fallback graphic.",
  ].join("\n");
}

export function ktrFacebookChatGptImageFilename(post: KtrFacebookAttentionPost): string {
  return `facebook-attention-chatgpt-${sanitize(post.title)}.jpg`;
}

export function ktrFacebookChatGptImageUrl(post: KtrFacebookAttentionPost): string {
  return `${SITE_URL}/api/public/article-image/${ktrFacebookChatGptImageFilename(post)}`;
}

function decodeBase64(value: string): Uint8Array {
  const clean = value.replace(/^data:image\/(?:jpeg|png|webp);base64,/i, "").replace(/\s+/g, "");
  if (!clean) throw new Error("ChatGPT image payload is empty");
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

export async function storeSuppliedChatGptAttentionImage(args: {
  db: any;
  post: KtrFacebookAttentionPost;
  imageBase64: string;
  contentType: string;
}): Promise<{ bytes: Uint8Array; contentType: string; url: string }> {
  const contentType = args.contentType.toLowerCase().split(";", 1)[0].trim();
  if (!ALLOWED_TYPES.has(contentType)) throw new Error("ChatGPT image must be JPEG, PNG, or WebP");
  const bytes = decodeBase64(args.imageBase64);
  if (bytes.byteLength < 10_000 || bytes.byteLength > MAX_IMAGE_BYTES) {
    throw new Error("ChatGPT image payload is empty, implausibly small, or too large");
  }

  const filename = ktrFacebookChatGptImageFilename(args.post);
  const upload = await args.db.storage.from(BUCKET).upload(filename, bytes, {
    contentType,
    cacheControl: "public, max-age=31536000, immutable",
    upsert: true,
  });
  if (upload.error) throw new Error(`ChatGPT Facebook image could not be stored: ${upload.error.message}`);
  return { bytes, contentType, url: ktrFacebookChatGptImageUrl(args.post) };
}
