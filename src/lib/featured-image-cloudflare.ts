import { parseVisionVerdict, type SubjectExtract } from "./featured-image-core";

// FLUX.2 Klein 4B remains the quota-safe production path for article photography.
// The enhanced-quality Klein 9B model is reserved for only the final strict-
// validator retry, bounding worst-case image cost while giving repeatedly rejected
// scenes one materially stronger generation attempt. Schnell remains an API-
// availability fallback for the cheap first-pass/retry path.
export const CLOUDFLARE_IMAGE_MODEL = "@cf/black-forest-labs/flux-2-klein-4b";
export const CLOUDFLARE_IMAGE_QUALITY_MODEL = "@cf/black-forest-labs/flux-2-klein-9b";
export const CLOUDFLARE_IMAGE_FALLBACK_MODEL = "@cf/black-forest-labs/flux-1-schnell";
export const CLOUDFLARE_CULTURE_IMAGE_MODEL = CLOUDFLARE_IMAGE_MODEL;
export const CLOUDFLARE_VISION_MODEL = "@cf/mistralai/mistral-small-3.1-24b-instruct";

export type CloudflareImageModel = typeof CLOUDFLARE_IMAGE_MODEL | typeof CLOUDFLARE_IMAGE_QUALITY_MODEL | typeof CLOUDFLARE_IMAGE_FALLBACK_MODEL;

type ImageGenerationProvenance = {
  model: CloudflareImageModel;
  usedFallback: boolean;
  usedSafetyRetry: boolean;
};

const generatedImageProvenance = new WeakMap<Uint8Array, ImageGenerationProvenance>();

function rememberGeneratedImage(
  bytes: Uint8Array,
  model: CloudflareImageModel,
  usedFallback: boolean,
  usedSafetyRetry = false,
): Uint8Array {
  generatedImageProvenance.set(bytes, { model, usedFallback, usedSafetyRetry });
  return bytes;
}

function generationProvenancePrefix(bytes: Uint8Array): string {
  const provenance = generatedImageProvenance.get(bytes);
  if (!provenance) return "";
  const safety = provenance.usedSafetyRetry ? "; safety-retry=yes" : "";
  return `[image-model=${provenance.model}; fallback=${provenance.usedFallback ? "yes" : "no"}${safety}] `;
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
  const photographicLock = [
    "REAL CAMERA PHOTOGRAPH ONLY.",
    "Create one coherent documentary photojournalism scene with natural lighting, lifelike materials, realistic optics and depth of field.",
    "The concrete article subject must be visually obvious from physical objects, place, action, infrastructure, institution, sport, or event in the scene itself.",
    "No readable text, typography, poster, illustration, graphic design, vector art, iconography, collage, infographic, CGI, or synthetic promotional artwork.",
  ].join(" ");
  const safeNegativePrompt = negativePrompt.replace(/(?:^|,\s*)rejected visual motif:.*$/is, "").trim();
  const essentialExclusions = safeNegativePrompt
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 30)
    .join(", ");
  const core = prompt.replace(/\s+/g, " ").trim().slice(0, 1260);
  const exclusions = essentialExclusions.slice(0, 420);
  return `${photographicLock} EDITORIAL ASSIGNMENT: ${core} HARD EXCLUSIONS: ${exclusions}`.slice(0, 2048);
}

export function buildFlux2ImagePrompt(prompt: string): string {
  const photographicLock = [
    "Create a physical-camera editorial news photograph.",
    "Show one coherent documentary photojournalism scene with natural lighting, true-to-life materials, realistic optics, and photographic depth of field.",
    "Make the concrete physical article subject visually dominant through the real place, infrastructure, institution, sport, or event in the frame.",
  ].join(" ");
  const core = prompt.replace(/\s+/g, " ").trim().slice(0, 1550);
  return `${photographicLock} EDITORIAL ASSIGNMENT: ${core}`.slice(0, 2048);
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

export function buildFlux2ImageRequest(prompt: string, _negativePrompt: string, _model: CloudflareImageModel = CLOUDFLARE_IMAGE_MODEL): FormData {
  const form = new FormData();
  form.append("prompt", buildFlux2ImagePrompt(prompt));
  form.append("guidance", "5.5");
  form.append("width", "1024");
  form.append("height", "768");
  return form;
}

function isFinalStrictValidatorRetry(prompt: string): boolean {
  const normalized = prompt.trim();
  return /^Correction from rejected attempt:\s*(?:Validator rejection\s+3:|Retry\s+3\.)/i.test(normalized);
}

async function requestCloudflareImage(
  accountId: string,
  apiToken: string,
  prompt: string,
  negativePrompt: string,
  model: CloudflareImageModel,
): Promise<Response> {
  if (model === CLOUDFLARE_IMAGE_MODEL || model === CLOUDFLARE_IMAGE_QUALITY_MODEL) {
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

type CloudflareImageFailure = { status: number; detail: string };

async function readCloudflareImageFailure(res: Response): Promise<CloudflareImageFailure> {
  const raw = await res.text().catch(() => "");
  let detail = raw || `HTTP ${res.status}`;
  try {
    const json = raw ? JSON.parse(raw) as { errors?: { message?: string }[]; error?: { message?: string } } : {};
    detail = json.errors?.[0]?.message || json.error?.message || detail;
  } catch {
  }
  return { status: res.status, detail: String(detail).slice(0, 400) };
}

function cloudflareImageFailureError(model: CloudflareImageModel, failure: CloudflareImageFailure): Error {
  return new Error(`Cloudflare Workers AI ${model} ${failure.status}: ${failure.detail}`);
}

export function isCloudflareImageSafetyRejection(status: number, detail: string): boolean {
  if (![400, 403, 422].includes(status)) return false;
  return /\b(?:output has been flagged|input has been flagged|flagged|content[- ]?filter(?:ed|ing)?|moderation|safety filter|unsafe|policy violation|blocked for policy)\b/i.test(detail);
}

function safetyRetryScene(prompt: string): string {
  const text = prompt.toLowerCase();
  if (/\b(broadcast|interview|television|tv|fcc|federal communications commission|radio|newsroom|media|studio)\b/.test(text)) {
    return "An empty professional broadcast studio and control-room area with camera tripods, microphones, studio lights, audio controls, cables, and blank neutral monitor screens. No people, program branding, logos, seals, or readable text.";
  }
  if (/\b(election|campaign|candidate|convention|vote|voter|ballot|polling)\b/.test(text)) {
    return "An empty Texas civic-event or election-administration setting with rows of chairs, a check-in table, generic microphone stands, sealed document boxes, and ordinary administrative equipment. No people, campaign branding, party logos, signs, flags, or readable text.";
  }
  if (/\b(court|courthouse|judge|lawsuit|ruling|appeal|legal|supreme court)\b/.test(text)) {
    return "A quiet Texas courthouse interior with counsel tables, paper case folders turned away from camera, wooden benches, and an empty judicial bench. No people, seals, logos, or readable text.";
  }
  if (/\b(football|basketball|baseball|soccer|hockey|nfl|nba|mlb|mls|athlete|sports?)\b/.test(text)) {
    return "A real Texas athletic practice setting showing the named sport through equipment, field or court markings, and distant anonymous participants whose faces are not identifiable. No team logos, player likenesses, uniforms with readable marks, or text.";
  }
  if (/\b(hurricane|storm|tornado|flood|weather|rain|drought|freeze|heat)\b/.test(text)) {
    return "A truthful Texas weather-documentation scene with storm clouds, rain, drainage or weather-monitoring equipment over a real landscape. No people, disaster reenactment, logos, maps, or readable text.";
  }
  if (/\b(school|classroom|student|teacher|university|college|education|isd)\b/.test(text)) {
    return "An empty Texas school or university setting with a classroom, hallway, campus entrance, desks, books, and ordinary educational equipment. No students, staff, school logos, signs, or readable text.";
  }
  if (/\b(data center|server farm|ercot|electric|grid|energy|pipeline|refinery|oil|gas)\b/.test(text)) {
    return "A Texas infrastructure scene with utility equipment, transformers, transmission lines, industrial cooling equipment, fenced facilities, and realistic service roads. No people, company logos, signs, or readable text.";
  }
  if (/\b(company|business|economy|jobs|budget|spending|finance|market|factory|workplace)\b/.test(text)) {
    return "A real Texas workplace or institutional office setting with desks, folders, computers with blank screens, filing materials, and ordinary operational equipment. No people, company branding, logos, or readable text.";
  }
  if (/\b(border|immigration|rio grande|migrant|asylum)\b/.test(text)) {
    return "A neutral Texas border landscape showing the Rio Grande, roadway, fencing or inspection infrastructure from a documentary distance. No people, confrontation, agency logos, flags, or readable text.";
  }
  if (/\b(wildlife|animal|bird|fish|turtle|deer|snake|alligator|species|habitat)\b/.test(text)) {
    return "A real Texas wildlife or habitat scene centered on the named animal or natural environment, photographed at documentary distance with no people, logos, signs, or readable text.";
  }
  if (/\b(road|roadway|traffic|interstate|highway|bridge|transit|transportation)\b/.test(text)) {
    return "An empty Texas transportation scene with roadway lanes, shoulder, overpass or bridge infrastructure, traffic-control equipment, and realistic daylight conditions. No people, vehicle branding, signs with readable text, or staged incident.";
  }
  return "A neutral Texas institutional or workplace setting directly tied to the article through physical equipment, infrastructure, documents, or environment. Keep the scene empty of people and free of logos, seals, flags, branded graphics, and readable text.";
}

export function buildImageSafetyRetryPrompt(prompt: string): string {
  const scene = safetyRetryScene(prompt);
  return [
    "PROVIDER-SAFETY REFRAME.",
    "Create a physical-camera editorial news photograph of a neutral, non-confrontational real-world setting.",
    "Show no named, recognizable, or identifiable person and do not recreate a specific historical confrontation or incident.",
    "Represent the article only through relevant physical setting, equipment, infrastructure, documents, sport, weather, or environment.",
    scene,
    "Natural documentary lighting, realistic materials, believable perspective and depth of field. No illustration, collage, infographic, typography, watermark, or promotional artwork.",
  ].join(" ").replace(/\s+/g, " ").trim().slice(0, 1800);
}

const SAFETY_RETRY_NEGATIVE_PROMPT = "recognizable person, public figure likeness, readable text, logos, seals, branded graphics, illustration, poster, collage, infographic, watermark";

export async function generateImageBytes(
  prompt: string,
  negativePrompt: string,
  model: CloudflareImageModel = CLOUDFLARE_IMAGE_MODEL,
): Promise<Uint8Array> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) throw new Error("Missing Cloudflare Workers AI credentials: CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required");

  let activeModel = model === CLOUDFLARE_IMAGE_MODEL && isFinalStrictValidatorRetry(prompt)
    ? CLOUDFLARE_IMAGE_QUALITY_MODEL
    : model;
  let activePrompt = prompt;
  let activeNegativePrompt = negativePrompt;
  let usedFallback = false;
  let usedSafetyRetry = false;

  const runSafetyRetry = async (): Promise<Response> => {
    usedSafetyRetry = true;
    usedFallback = false;
    activeModel = CLOUDFLARE_IMAGE_MODEL;
    activePrompt = buildImageSafetyRetryPrompt(prompt);
    activeNegativePrompt = SAFETY_RETRY_NEGATIVE_PROMPT;

    let retry = await requestCloudflareImage(accountId, apiToken, activePrompt, activeNegativePrompt, activeModel);
    if (retry.ok) return retry;
    const retryFailure = await readCloudflareImageFailure(retry);

    activeModel = CLOUDFLARE_IMAGE_FALLBACK_MODEL;
    usedFallback = true;
    retry = await requestCloudflareImage(accountId, apiToken, activePrompt, activeNegativePrompt, activeModel);
    if (retry.ok) return retry;
    const fallbackFailure = await readCloudflareImageFailure(retry);
    throw cloudflareImageFailureError(activeModel, fallbackFailure.status ? fallbackFailure : retryFailure);
  };

  let res = await requestCloudflareImage(accountId, apiToken, activePrompt, activeNegativePrompt, activeModel);

  if (!res.ok) {
    let failure = await readCloudflareImageFailure(res);
    if (isCloudflareImageSafetyRejection(failure.status, failure.detail)) {
      res = await runSafetyRetry();
    } else if (activeModel === CLOUDFLARE_IMAGE_MODEL) {
      activeModel = CLOUDFLARE_IMAGE_FALLBACK_MODEL;
      usedFallback = true;
      res = await requestCloudflareImage(accountId, apiToken, activePrompt, activeNegativePrompt, activeModel);
      if (!res.ok) {
        failure = await readCloudflareImageFailure(res);
        if (isCloudflareImageSafetyRejection(failure.status, failure.detail)) {
          res = await runSafetyRetry();
        } else {
          throw cloudflareImageFailureError(activeModel, failure);
        }
      }
    } else {
      throw cloudflareImageFailureError(activeModel, failure);
    }
  }

  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  if (contentType.startsWith("image/") || contentType.includes("application/octet-stream")) {
    const buffer = await res.arrayBuffer();
    if (!buffer.byteLength) throw new Error("Cloudflare Workers AI returned an empty image body");
    return rememberGeneratedImage(new Uint8Array(buffer), activeModel, usedFallback, usedSafetyRetry);
  }

  const raw = await res.text().catch(() => "");
  let json: { success?: boolean; result?: { image?: string } | string; image?: string; errors?: { message?: string }[]; error?: { message?: string } } = {};
  try { json = raw ? JSON.parse(raw) : {}; } catch { throw new Error(`Cloudflare Workers AI returned an unexpected non-image response: ${raw.slice(0, 400)}`); }
  if (json.success === false) throw new Error(`Cloudflare Workers AI ${res.status}: ${json.errors?.[0]?.message || json.error?.message || raw}`.slice(0, 440));
  const b64 = (typeof json.result === "object" && json.result ? json.result.image : undefined) || json.image || (typeof json.result === "string" ? json.result : undefined);
  if (!b64) throw new Error("Cloudflare Workers AI returned no image data");
  return rememberGeneratedImage(base64ToBytes(b64), activeModel, usedFallback, usedSafetyRetry);
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

const PRIMARY_SUBJECT_RULE = "PRIMARY-SUBJECT RULE: the image must show the headline's main person/entity OR the exact action, object, activity, infrastructure, institution, or event the story is actually about. Mere association by school, team, city, state, venue, category, logo, crowd, band, mascot, skyline, flag, or generic instrument is not enough when it omits the article's defining subject or activity.";

export function imageValidationDomainGuidance(subject: SubjectExtract): string {
  if (subject.domain === "legal") {
    return `${PRIMARY_SUBJECT_RULE} For a court-ruling story, a believable photorealistic courthouse exterior or courtroom interior IS a valid direct story match when the court process itself is the defining subject; it does not need to literally visualize abstract legal wording. When the dispute centers on a concrete object or practice (for example a Ten Commandments display), prefer that object/practice over a generic courthouse or school. Reject maps, state outlines, unrelated politicians, generic capitol scenes, election graphics, cartoons, and illustrations.`;
  }
  if (subject.domain === "politics") {
    return `${PRIMARY_SUBJECT_RULE} For politics or public-policy stories, do NOT require a recognizable likeness of a named politician, the exact date, the exact venue, a specific broadcast or interview, a press conference, or any other historically exact scene. A believable photorealistic government setting or policy-impact setting is valid only when it directly depicts the concrete policy target or action in the story. Prefer anonymous or non-identifiable people. Reject unrelated generic government imagery, location-only skylines, fabricated readable text or logos, and recognizable faces presented as the named politician unless independently verified.`;
  }
  if (subject.domain === "sports") {
    return `${PRIMARY_SUBJECT_RULE} For sports schedules, watch lists, roster stories, previews, honors, and results, do NOT require a recognizable likeness of a named athlete, exact team uniform or logo, exact game, exact date, or exact venue. A believable photorealistic anonymous athlete or athletes performing the exact sport and relevant action in an appropriate real field, track, course, stadium, or practice setting IS a valid representative editorial match. For a game result, preview, roster, schedule, or player-performance story, the sport/action itself must be visible: a marching band, crowd, mascot, cheerleaders, stadium exterior, or empty/stadium-only scene does NOT pass merely because it is associated with the same team or school. Reject unrelated sports, generic non-athletic scenes, readable logos or invented named-player likenesses, posters, illustrations, cartoons, and promotional graphics.`;
  }
  if (subject.domain === "culture") {
    return `${PRIMARY_SUBJECT_RULE} For named musicians, artists, festivals, restaurants, or cultural events, prefer a verified reusable image of the named subject when available. If it is unavailable, the representative image must depict the exact cultural activity, medium, cuisine, or event type. A generic city skyline, state flag, instrument, product-only close-up for an event story, or unrelated venue does not pass solely by association.`;
  }
  if (subject.domain === "weather") {
    return `${PRIMARY_SUBJECT_RULE} For current storms, use current official storm imagery or a truthful representative weather scene. For seasonal outlooks, climate probabilities, or El Nino-driven risk stories, prefer the relevant current official outlook/climate graphic or phenomenon; a dramatic image of a named historical disaster does not pass merely because it is also a hurricane.`;
  }
  return `${PRIMARY_SUBJECT_RULE} A valid match must depict the concrete real-world subject or setting, not generic symbolism. Do not require visible city names, landmarks, logos, signage, or other geographic proof merely because the article names a location; a believable representative local scene is sufficient only when its physical subject matches the assignment. Continue to reject images that omit the assignment's defining physical objects or activity.`;
}

const VISION_VALIDATION_ATTEMPTS = 2;
const VISION_REQUEST_TIMEOUT_MS = 45_000;

function isRetryableVisionStatus(status: number): boolean {
  return status === 408 || status === 409 || status === 425 || status === 429 || status >= 500;
}

function visionFailurePreview(value: unknown): string {
  if (typeof value === "string") return value.replace(/\s+/g, " ").trim().slice(0, 220);
  try {
    return JSON.stringify(value ?? "").slice(0, 220);
  } catch {
    return "unserializable validator output";
  }
}

export async function validateImageMatchesArticle(bytes: Uint8Array, subject: SubjectExtract): Promise<{ matches: boolean; reason: string }> {
  const provenancePrefix = generationProvenancePrefix(bytes);
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) return { matches: false, reason: `${provenancePrefix}Cloudflare vision validator unavailable: missing credentials` };

  const image = `data:image/jpeg;base64,${bytesToBase64(bytes)}`;
  const domainGuidance = imageValidationDomainGuidance(subject);
  const validationPrompt = [
    `Article title: "${subject.title}"`,
    `Article domain: ${subject.domain}`,
    `Primary visual subject: ${subject.concreteSubject}`,
    "Evaluate the supplied image as an editorial photograph.",
    domainGuidance,
    "Apply the primary-subject rule strictly before considering broad topical association. A high-quality image that is merely related to the team, school, city, state, industry, or category must fail if the defining subject/action is absent.",
    "Judge whether the image is a truthful representative editorial visual for the article topic. Do not require it to prove that it was captured at the exact historical event described in the article.",
    "photorealistic=false for illustration, vector art, cartoon, poster, icon, graphic design, collage, or synthetic placeholder imagery.",
    "Return exactly one JSON object with boolean matches, boolean photorealistic, and string reason. No Markdown or surrounding prose.",
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

  let lastFailure = "Cloudflare vision validator returned no verdict";

  for (let attempt = 1; attempt <= VISION_VALIDATION_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), VISION_REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(cloudflareEndpoint(accountId, CLOUDFLARE_VISION_MODEL), {
        method: "POST",
        headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a strict editorial-photo quality reviewer. Judge primary-subject relevance and photorealism, not loose topical association or whether a generated editorial image proves an exact historical moment. Return only the requested JSON verdict." },
            { role: "user", content: attempt === 1 ? validationPrompt : `${validationPrompt}\nThis is a validator retry because the prior response was unavailable or malformed. Follow the JSON format exactly.` },
          ],
          image,
          guided_json: verdictSchema,
          max_tokens: 256,
          temperature: 0,
        }),
        signal: controller.signal,
      });

      const raw = await res.text().catch(() => "");
      let json: { success?: boolean; result?: unknown; errors?: { message?: string }[] } = {};
      try {
        json = raw ? JSON.parse(raw) : {};
      } catch {
        lastFailure = `Cloudflare vision returned non-JSON HTTP payload ${res.status}${raw ? `: ${raw.slice(0, 180)}` : ""}`;
        if (attempt < VISION_VALIDATION_ATTEMPTS) continue;
        break;
      }

      if (!res.ok || json.success === false) {
        lastFailure = `Cloudflare vision HTTP ${res.status}: ${json.errors?.[0]?.message || raw.slice(0, 180) || "empty response"}`;
        if (attempt < VISION_VALIDATION_ATTEMPTS && isRetryableVisionStatus(res.status)) continue;
        return { matches: false, reason: `${provenancePrefix}${lastFailure}`.slice(0, 360) };
      }

      const { output, finishReason } = extractCloudflareVisionOutput(json.result);
      const normalizedOutput = normalizeCloudflareVisionVerdictOutput(output);
      const parsed = parseVisionVerdict(normalizedOutput);
      if (parsed) {
        const ok = parsed.matches && parsed.photorealistic;
        const reason = String(parsed.reason || (ok ? "story match and photorealism passed" : "quality gate failed"));
        return { matches: ok, reason: `${provenancePrefix}${reason}`.slice(0, 300) };
      }

      const preview = visionFailurePreview(typeof normalizedOutput === "string" ? normalizedOutput : output);
      const finish = finishReason ? ` (finish_reason=${finishReason})` : "";
      lastFailure = `Cloudflare vision validator returned no parseable verdict${finish}${preview ? `: ${preview}` : ""}`;
      if (attempt < VISION_VALIDATION_ATTEMPTS) continue;
    } catch (e) {
      const error = e as Error;
      const timedOut = error?.name === "AbortError";
      lastFailure = timedOut
        ? `Cloudflare vision validator timed out after ${VISION_REQUEST_TIMEOUT_MS}ms`
        : `Cloudflare vision validator error: ${error?.message || String(e)}`;
      if (attempt < VISION_VALIDATION_ATTEMPTS) continue;
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    matches: false,
    reason: `${provenancePrefix}${lastFailure} after ${VISION_VALIDATION_ATTEMPTS} attempts`.slice(0, 360),
  };
}
