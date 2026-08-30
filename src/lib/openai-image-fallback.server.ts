const OPENAI_IMAGE_ENDPOINT = "https://api.openai.com/v1/images/generations";
export const OPENAI_IMAGE_FALLBACK_MODEL = "gpt-image-2";

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

export function buildFacebookPostImagePrompt(postText: string): string {
  return `Generate an image for this Facebook post.\n\n${postText.trim()}`;
}

export function buildArticleFallbackImagePrompt(input: {
  title: string;
  dek?: string | null;
  category?: string | null;
  region?: string | null;
  excerpt?: string | null;
  existingPrompt?: string | null;
}): string {
  const context = [
    `Headline: ${input.title.trim()}`,
    input.dek?.trim() ? `Summary: ${input.dek.trim()}` : "",
    input.category?.trim() ? `Category: ${input.category.trim()}` : "",
    input.region?.trim() ? `Location: ${input.region.trim()}` : "",
    input.excerpt?.trim() ? `Article context: ${input.excerpt.trim()}` : "",
    input.existingPrompt?.trim() ? `Editorial visual guidance: ${input.existingPrompt.trim()}` : "",
  ].filter(Boolean).join("\n");

  return [
    "Create a relevant editorial image for this article.",
    context,
    "Use a believable Texas setting and make the specific subject of the article visually obvious.",
    "For real news involving named people or events, do not fabricate a documentary-looking depiction of an event that did not occur; use a clearly representative editorial scene instead.",
    "No unrelated generic Texas stock scene, no repeated fallback motif, no collage, no infographic, no poster, no logo, no watermark, and no readable text overlay.",
    "Horizontal editorial composition suitable for an article hero and Facebook sharing.",
  ].join("\n").slice(0, 4000);
}

export async function generateOpenAiImageBytes(prompt: string): Promise<Uint8Array> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY for OpenAI image fallback");

  const response = await fetch(OPENAI_IMAGE_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_IMAGE_FALLBACK_MODEL,
      prompt: prompt.trim(),
      size: "1536x1024",
    }),
  });

  const raw = await response.text();
  let payload: { data?: Array<{ b64_json?: string }>; error?: { message?: string } } = {};
  try {
    payload = raw ? JSON.parse(raw) as typeof payload : {};
  } catch {
    throw new Error(`OpenAI image fallback returned invalid JSON (HTTP ${response.status})`);
  }

  if (!response.ok) {
    throw new Error(`OpenAI image fallback failed (${response.status}): ${payload.error?.message || raw.slice(0, 400)}`);
  }

  const encoded = payload.data?.[0]?.b64_json;
  if (!encoded) throw new Error("OpenAI image fallback returned no image data");
  const bytes = base64ToBytes(encoded);
  if (bytes.byteLength < 10_000) throw new Error(`OpenAI image fallback returned an unexpectedly small image (${bytes.byteLength} bytes)`);
  return bytes;
}

export function detectImageContentType(bytes: Uint8Array): "image/png" | "image/jpeg" | "image/webp" {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return "image/webp";
  throw new Error("Generated image format is not PNG, JPEG, or WebP");
}

export function extensionForImageContentType(contentType: "image/png" | "image/jpeg" | "image/webp"): "png" | "jpg" | "webp" {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}
