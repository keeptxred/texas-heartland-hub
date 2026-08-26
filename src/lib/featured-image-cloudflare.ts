import { parseVisionVerdict, type SubjectExtract } from "./featured-image-core";

// FLUX has proven materially more reliable for documentary/photojournalistic
// output than DreamShaper in the live KTR image pipeline. Use it as the default
// for every category so a published article is not routinely stranded without
// a featured image because the generator produced poster/cartoon artwork.
export const CLOUDFLARE_IMAGE_MODEL = "@cf/black-forest-labs/flux-1-schnell";
export const CLOUDFLARE_CULTURE_IMAGE_MODEL = CLOUDFLARE_IMAGE_MODEL;
export const CLOUDFLARE_VISION_MODEL = "@cf/mistralai/mistral-small-3.1-24b-instruct";

export type CloudflareImageModel = typeof CLOUDFLARE_IMAGE_MODEL;

function cloudflareEndpoint(accountId: string, model: string): string {
  return `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${model}`;
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(binary);
}

export function buildFluxImagePrompt(prompt: string, negativePrompt: string): string {
  // FLUX.1 Schnell has a compact prompt budget. Keep the hard photographic
  // constraints at the beginning and reserve explicit room for the exclusions
  // at the end instead of letting a long article-specific prompt truncate them.
  // This specifically targets the live failure cohort where otherwise relevant
  // generations drifted into posters, infographics, text overlays, or vector art.
  const photographicLock = [
    "REAL CAMERA PHOTOGRAPH ONLY.",
    "One coherent documentary photojournalism scene with natural lighting, lifelike materials, realistic optics and depth of field.",
    "No readable text, typography, poster, illustration, graphic design, vector art, iconography, collage, infographic, CGI, or synthetic promotional artwork.",
  ].join(" ");
  const essentialExclusions = negativePrompt
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 30)
    .join(", ");
  const core = prompt.replace(/\s+/g, " ").trim().slice(0, 1380);
  const exclusions = essentialExclusions.slice(0, 420);
  return `${photographicLock} ${core} HARD EXCLUSIONS: ${exclusions}`.slice(0, 2048);
}

export function buildFluxImageRequest(
  prompt: string,
  negativePrompt: string,
): { prompt: string; steps: number } {
  return {
    prompt: buildFluxImagePrompt(prompt, negativePrompt),
    steps: 8,
  };
}

export async function generateImageBytes(
  prompt: string,
  negativePrompt: string,
  model: CloudflareImageModel = CLOUDFLARE_IMAGE_MODEL,
): Promise<Uint8Array> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) throw new Error("Missing Cloudflare Workers AI credentials: CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required");

  // FLUX.1 Schnell uses its own compact Workers AI schema. Put negative
  // constraints into the prompt because this model does not accept the
  // DreamShaper negative_prompt parameter. The live Workers AI endpoint also
  // rejects a seed property for this model, so keep the request to fields the
  // deployed schema accepts and let retries vary through stronger prompt input.
  const requestBody = buildFluxImageRequest(prompt, negativePrompt);

  const res = await fetch(cloudflareEndpoint(accountId, model), {
    method: "POST",
    headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const raw = await res.text().catch(() => "");
    let detail = raw || `HTTP ${res.status}`;
    try {
      const json = raw ? JSON.parse(raw) as { errors?: { message?: string }[]; error?: { message?: string } } : {};
      detail = json.errors?.[0]?.message || json.error?.message || detail;
    } catch {
      // Keep the raw error body.
    }
    throw new Error(`Cloudflare Workers AI ${res.status}: ${String(detail).slice(0, 400)}`);
  }

  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  if (contentType.startsWith("image/") || contentType.includes("application/octet-stream")) {
    const buffer = await res.arrayBuffer();
    if (!buffer.byteLength) throw new Error("Cloudflare Workers AI returned an empty image body");
    return new Uint8Array(buffer);
  }

  const raw = await res.text().catch(() => "");
  let json: { success?: boolean; result?: { image?: string } | string; image?: string; errors?: { message?: string }[]; error?: { message?: string } } = {};
  try { json = raw ? JSON.parse(raw) : {}; } catch { throw new Error(`Cloudflare Workers AI returned an unexpected non-image response: ${raw.slice(0, 400)}`); }
  if (json.success === false) throw new Error(`Cloudflare Workers AI ${res.status}: ${json.errors?.[0]?.message || json.error?.message || raw}`.slice(0, 440));
  const b64 = (typeof json.result === "object" && json.result ? json.result.image : undefined) || json.image || (typeof json.result === "string" ? json.result : undefined);
  if (!b64) throw new Error("Cloudflare Workers AI returned no image data");
  return base64ToBytes(b64);
}

type VisionChatChoice = {
  finish_reason?: string | null;
  message?: {
    content?: unknown;
    reasoning_content?: unknown;
  };
};

type VisionApiResult = {
  response?: unknown;
  choices?: VisionChatChoice[];
};

export function extractCloudflareVisionOutput(result: unknown): { output: unknown; finishReason?: string | null } {
  if (!result || typeof result !== "object" || Array.isArray(result)) return { output: result };
  const typed = result as VisionApiResult;
  if ("response" in typed) return { output: typed.response };
  const first = Array.isArray(typed.choices) ? typed.choices[0] : undefined;
  if (first) return { output: first.message?.content, finishReason: first.finish_reason };
  return { output: result };
}

// Mistral occasionally follows the requested labels but changes presentation:
// Markdown labels, 1/0 and N/A tokens, or `label=value` rather than `label: value`.
// Normalize only that presentation layer before using the existing strict
// parser. N/A is conservatively treated as a negative, never as approval.
export function normalizeCloudflareVisionVerdictOutput(value: unknown): unknown {
  if (typeof value !== "string") return value;
  return value
    .replace(/\*\*\s*(Matches|Photorealistic|Reason)\s*:\s*\*\*/gi, "$1:")
    .replace(/\b(Matches|Photorealistic|Reason)\s*=\s*/gi, "$1: ")
    .replace(/\bMatches\s*:\s*1\b/gi, "Matches: yes")
    .replace(/\bMatches\s*:\s*0\b/gi, "Matches: no")
    .replace(/\bPhotorealistic\s*:\s*1\b/gi, "Photorealistic: yes")
    .replace(/\bPhotorealistic\s*:\s*0\b/gi, "Photorealistic: no")
    .replace(/\bPhotorealistic\s*:\s*N\/?A\b/gi, "Photorealistic: no");
}

export function imageValidationDomainGuidance(subject: SubjectExtract): string {
  if (subject.domain === "legal") {
    return "For a court-ruling story, a believable photorealistic courthouse exterior or courtroom interior IS a valid direct story match; it does not need to literally visualize the abstract legal wording. Reject maps, state outlines, politicians, capitol scenes, election graphics, cartoons, and illustrations.";
  }
  if (subject.domain === "politics") {
    return "For politics or public-policy stories, do NOT require a recognizable likeness of a named politician, the exact date, the exact venue, a specific broadcast or interview, a press conference, or any other historically exact scene. A believable photorealistic Texas government or policy-impact setting that directly represents one or more concrete issues in the story IS a valid direct story match. Prefer anonymous or non-identifiable people. Reject unrelated generic government imagery, fabricated readable text or logos, and recognizable faces presented as the named politician unless independently verified.";
  }
  if (subject.domain === "sports") {
    return "For sports schedules, watch lists, roster stories, previews, honors, and results, do NOT require a recognizable likeness of a named athlete, exact team uniform or logo, exact game, exact date, or exact venue. A believable photorealistic anonymous athlete or athletes performing the exact sport and relevant action in an appropriate real field, track, course, stadium, or practice setting IS a valid representative editorial match. The depicted sport and action must fit the story. Reject unrelated sports, generic non-athletic scenes, readable logos or invented named-player likenesses, posters, illustrations, cartoons, and promotional graphics.";
  }
  return "A valid match must depict the concrete real-world subject or setting, not generic symbolism.";
}

export async function validateImageMatchesArticle(bytes: Uint8Array, subject: SubjectExtract): Promise<{ matches: boolean; reason: string }> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) return { matches: false, reason: "Cloudflare vision validator unavailable: missing credentials" };
  try {
    const image = `data:image/jpeg;base64,${bytesToBase64(bytes)}`;
    const domainGuidance = imageValidationDomainGuidance(subject);
    const validationPrompt = [
      `Article title: "${subject.title}"`,
      `Article domain: ${subject.domain}`,
      `Primary visual subject: ${subject.concreteSubject}`,
      "Evaluate the supplied image as an editorial photograph.",
      domainGuidance,
      "Judge whether the image is a truthful representative editorial visual for the article topic. Do not require it to prove that it was captured at the exact historical event described in the article.",
      "photorealistic=false for illustration, vector art, cartoon, poster, icon, graphic design, collage, or synthetic placeholder imagery.",
      "Return only matches, photorealistic, and reason.",
    ].join("\n");

    const verdictSchema = {
      type: "object",
      properties: {
        matches: { type: "boolean" },
        photorealistic: { type: "boolean" },
        reason: { type: "string" },
      },
      required: ["matches", "photorealistic", "reason"],
    };

    const res = await fetch(cloudflareEndpoint(accountId, CLOUDFLARE_VISION_MODEL), {
      method: "POST",
      headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a strict editorial-photo quality reviewer. Judge topical relevance and photorealism, not whether a generated editorial image proves an exact historical moment. Return only the requested verdict." },
          { role: "user", content: validationPrompt },
        ],
        image,
        guided_json: verdictSchema,
        max_tokens: 256,
        temperature: 0,
      }),
    });

    const raw = await res.text().catch(() => "");
    let json: { success?: boolean; result?: unknown; errors?: { message?: string }[] } = {};
    try { json = raw ? JSON.parse(raw) : {}; } catch { return { matches: false, reason: `Cloudflare vision returned non-JSON HTTP payload ${res.status}` }; }
    if (!res.ok || json.success === false) return { matches: false, reason: `Cloudflare vision HTTP ${res.status}: ${json.errors?.[0]?.message || raw.slice(0, 180)}` };

    const { output, finishReason } = extractCloudflareVisionOutput(json.result);
    const normalizedOutput = normalizeCloudflareVisionVerdictOutput(output);
    const parsed = parseVisionVerdict(normalizedOutput);
    if (!parsed) {
      const previewValue = typeof normalizedOutput === "string" ? normalizedOutput : output;
      const preview = typeof previewValue === "string" ? previewValue.replace(/\s+/g, " ").trim().slice(0, 220) : JSON.stringify(previewValue ?? "").slice(0, 220);
      const finish = finishReason ? ` (finish_reason=${finishReason})` : "";
      return { matches: false, reason: `Cloudflare vision validator returned no parseable verdict${finish}${preview ? `: ${preview}` : ""}` };
    }
    const ok = parsed.matches && parsed.photorealistic;
    return { matches: ok, reason: String(parsed.reason || (ok ? "story match and photorealism passed" : "quality gate failed")).slice(0, 300) };
  } catch (e) {
    return { matches: false, reason: `Cloudflare vision validator error: ${(e as Error).message}` };
  }
}
