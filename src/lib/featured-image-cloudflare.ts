import { parseVisionVerdict, type SubjectExtract } from "./featured-image-core";

// FLUX.2 Klein 4B remains the low-cost first-pass path for article photography.
// Strict-validator rejections escalate to FLUX.2 Dev, which is the higher-fidelity
// photorealistic path. Schnell remains an API-availability fallback for the cheap
// first pass only so a Klein outage cannot strand the pipeline.
export const CLOUDFLARE_IMAGE_MODEL = "@cf/black-forest-labs/flux-2-klein-4b";
export const CLOUDFLARE_IMAGE_QUALITY_MODEL = "@cf/black-forest-labs/flux-2-dev";
export const CLOUDFLARE_IMAGE_FALLBACK_MODEL = "@cf/black-forest-labs/flux-1-schnell";
export const CLOUDFLARE_CULTURE_IMAGE_MODEL = CLOUDFLARE_IMAGE_MODEL;
export const CLOUDFLARE_VISION_MODEL = "@cf/mistralai/mistral-small-3.1-24b-instruct";

export type CloudflareImageModel = typeof CLOUDFLARE_IMAGE_MODEL | typeof CLOUDFLARE_IMAGE_QUALITY_MODEL | typeof CLOUDFLARE_IMAGE_FALLBACK_MODEL;

type ImageGenerationProvenance = {
  model: CloudflareImageModel;
  usedFallback: boolean;
};

// Keep generation provenance attached to the exact in-memory byte object so the
// strict validator can record which model produced an accepted or rejected
// image without changing storage formats or weakening the generation API.
const generatedImageProvenance = new WeakMap<Uint8Array, ImageGenerationProvenance>();

function rememberGeneratedImage(bytes: Uint8Array, model: CloudflareImageModel, usedFallback: boolean): Uint8Array {
  generatedImageProvenance.set(bytes, { model, usedFallback });
  return bytes;
}

function generationProvenancePrefix(bytes: Uint8Array): string {
  const provenance = generatedImageProvenance.get(bytes);
  if (!provenance) return "";
  return `[image-model=${provenance.model}; fallback=${provenance.usedFallback ? "yes" : "no"}] `;
}

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
  // Keep the documentary-photo lock first and reserve explicit room for the
  // exclusions at the end. This targets the live failure cohort where otherwise
  // relevant generations drifted into posters, infographics, generic symbols,
  // text overlays, or vector art.
  const photographicLock = [
    "REAL CAMERA PHOTOGRAPH ONLY.",
    "Create one coherent documentary photojournalism scene with natural lighting, lifelike materials, realistic optics and depth of field.",
    "The concrete article subject must be visually obvious from physical objects, place, action, infrastructure, institution, sport, or event in the scene itself.",
    "No readable text, typography, poster, illustration, graphic design, vector art, iconography, collage, infographic, CGI, or synthetic promotional artwork.",
  ].join(" ");
  const essentialExclusions = negativePrompt
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 30)
    .join(", ");
  const core = prompt.replace(/\s+/g, " ").trim().slice(0, 1260);
  const exclusions = essentialExclusions.slice(0, 420);
  return `${photographicLock} EDITORIAL ASSIGNMENT: ${core} HARD EXCLUSIONS: ${exclusions}`.slice(0, 2048);
}

// Retain the proven Schnell request builder for the emergency fallback path.
// The live REST endpoint rejected seed for this model, so only send accepted
// fields even though some Cloudflare examples currently show a seed property.
export function buildFluxImageRequest(
  prompt: string,
  negativePrompt: string,
): { prompt: string; steps: number } {
  return {
    prompt: buildFluxImagePrompt(prompt, negativePrompt),
    steps: 8,
  };
}

export function buildFlux2ImageRequest(prompt: string, negativePrompt: string, model: CloudflareImageModel = CLOUDFLARE_IMAGE_MODEL): FormData {
  const form = new FormData();
  form.append("prompt", buildFluxImagePrompt(prompt, negativePrompt));
  form.append("guidance", "5.5");
  form.append("width", "1024");
  form.append("height", "768");
  if (model === CLOUDFLARE_IMAGE_QUALITY_MODEL) form.append("steps", "25");
  return form;
}

function isStrictValidatorRetry(prompt: string): boolean {
  return /^Correction from rejected attempt:\s*Validator rejection\s+\d+:/i.test(prompt.trim());
}

async function requestCloudflareImage(
  accountId: string,
  apiToken: string,
  prompt: string,
  negativePrompt: string,
  model: CloudflareImageModel,
): Promise<Response> {
  if (model === CLOUDFLARE_IMAGE_MODEL || model === CLOUDFLARE_IMAGE_QUALITY_MODEL) {
    // FLUX.2 models use multipart input even for prompt-only generation. Do not
    // set Content-Type manually: fetch must add the multipart boundary.
    return fetch(cloudflareEndpoint(accountId, model), {
      method: "POST",
      headers: { Authorization: `Bearer ${apiToken}` },
      body: buildFlux2ImageRequest(prompt, negativePrompt, model),
    });
  }

  return fetch(cloudflareEndpoint(accountId, model), {
    method: "POST",
    headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(buildFluxImageRequest(prompt, negativePrompt)),
  });
}

export async function generateImageBytes(
  prompt: string,
  negativePrompt: string,
  model: CloudflareImageModel = CLOUDFLARE_IMAGE_MODEL,
): Promise<Uint8Array> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) throw new Error("Missing Cloudflare Workers AI credentials: CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required");

  // Preserve the inexpensive Klein first attempt. Once the strict validator has
  // rejected an image, automatically spend the higher-quality FLUX.2 Dev call
  // on the retry rather than repeatedly asking the same distilled model to fix
  // a demonstrated photorealism/story-match failure.
  let activeModel = model === CLOUDFLARE_IMAGE_MODEL && isStrictValidatorRetry(prompt)
    ? CLOUDFLARE_IMAGE_QUALITY_MODEL
    : model;
  let usedFallback = false;
  let res = await requestCloudflareImage(accountId, apiToken, prompt, negativePrompt, activeModel);

  // Fail safely if the inexpensive primary model is temporarily unavailable.
  // Quality-escalated FLUX.2 Dev requests do not silently downgrade to Schnell:
  // a Dev API failure remains a failure so strict retries cannot lose quality.
  if (!res.ok && activeModel === CLOUDFLARE_IMAGE_MODEL) {
    activeModel = CLOUDFLARE_IMAGE_FALLBACK_MODEL;
    usedFallback = true;
    res = await requestCloudflareImage(accountId, apiToken, prompt, negativePrompt, activeModel);
  }

  if (!res.ok) {
    const raw = await res.text().catch(() => "");
    let detail = raw || `HTTP ${res.status}`;
    try {
      const json = raw ? JSON.parse(raw) as { errors?: { message?: string }[]; error?: { message?: string } } : {};
      detail = json.errors?.[0]?.message || json.error?.message || detail;
    } catch {
      // Keep the raw error body.
    }
    throw new Error(`Cloudflare Workers AI ${activeModel} ${res.status}: ${String(detail).slice(0, 400)}`);
  }

  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  if (contentType.startsWith("image/") || contentType.includes("application/octet-stream")) {
    const buffer = await res.arrayBuffer();
    if (!buffer.byteLength) throw new Error("Cloudflare Workers AI returned an empty image body");
    return rememberGeneratedImage(new Uint8Array(buffer), activeModel, usedFallback);
  }

  const raw = await res.text().catch(() => "");
  let json: { success?: boolean; result?: { image?: string } | string; image?: string; errors?: { message?: string }[]; error?: { message?: string } } = {};
  try { json = raw ? JSON.parse(raw) : {}; } catch { throw new Error(`Cloudflare Workers AI returned an unexpected non-image response: ${raw.slice(0, 400)}`); }
  if (json.success === false) throw new Error(`Cloudflare Workers AI ${res.status}: ${json.errors?.[0]?.message || json.error?.message || raw}`.slice(0, 440));
  const b64 = (typeof json.result === "object" && json.result ? json.result.image : undefined) || json.image || (typeof json.result === "string" ? json.result : undefined);
  if (!b64) throw new Error("Cloudflare Workers AI returned no image data");
  return rememberGeneratedImage(base64ToBytes(b64), activeModel, usedFallback);
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
// Markdown labels, 1/0 and N/A tokens, `label=value`, or a compact positive
// `matches, photorealistic, reason` form. Normalize only those known formats
// before using the existing strict parser. N/A and contradictory compact prose
// remain conservative rejections, never approvals.
export function normalizeCloudflareVisionVerdictOutput(value: unknown): unknown {
  if (typeof value !== "string") return value;

  const compactPositive = value.trim().match(/^matches\s*,\s*photorealistic\s*,\s*(.+)$/is);
  if (compactPositive) {
    const reason = compactPositive[1].replace(/\s+/g, " ").trim();
    const contradiction = /\b(?:does\s+not\s+match|doesn't\s+match|not\s+(?:a\s+)?match|mismatch(?:es|ed)?|not\s+photorealistic|non[-\s]?photorealistic|fails?\s+(?:the\s+)?(?:match|photorealism))\b/i;
    if (reason && !contradiction.test(reason)) {
      return { matches: true, photorealistic: true, reason };
    }
  }

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
  const provenancePrefix = generationProvenancePrefix(bytes);
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) return { matches: false, reason: `${provenancePrefix}Cloudflare vision validator unavailable: missing credentials` };
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
    try { json = raw ? JSON.parse(raw) : {}; } catch { return { matches: false, reason: `${provenancePrefix}Cloudflare vision returned non-JSON HTTP payload ${res.status}` }; }
    if (!res.ok || json.success === false) return { matches: false, reason: `${provenancePrefix}Cloudflare vision HTTP ${res.status}: ${json.errors?.[0]?.message || raw.slice(0, 180)}` };

    const { output, finishReason } = extractCloudflareVisionOutput(json.result);
    const normalizedOutput = normalizeCloudflareVisionVerdictOutput(output);
    const parsed = parseVisionVerdict(normalizedOutput);
    if (!parsed) {
      const previewValue = typeof normalizedOutput === "string" ? normalizedOutput : output;
      const preview = typeof previewValue === "string" ? previewValue.replace(/\s+/g, " ").trim().slice(0, 220) : JSON.stringify(previewValue ?? "").slice(0, 220);
      const finish = finishReason ? ` (finish_reason=${finishReason})` : "";
      return { matches: false, reason: `${provenancePrefix}Cloudflare vision validator returned no parseable verdict${finish}${preview ? `: ${preview}` : ""}` };
    }
    const ok = parsed.matches && parsed.photorealistic;
    const reason = String(parsed.reason || (ok ? "story match and photorealism passed" : "quality gate failed"));
    return { matches: ok, reason: `${provenancePrefix}${reason}`.slice(0, 300) };
  } catch (e) {
    return { matches: false, reason: `${provenancePrefix}Cloudflare vision validator error: ${(e as Error).message}` };
  }
}
