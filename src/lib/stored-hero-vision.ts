import {
  CLOUDFLARE_VISION_MODEL,
  normalizeCloudflareVisionVerdictOutput,
} from "./featured-image-cloudflare";
import { parseVisionVerdict, type SubjectExtract } from "./featured-image-core";

const VALIDATION_ATTEMPTS = 2;
const REQUEST_TIMEOUT_MS = 45_000;

function endpoint(accountId: string): string {
  return `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${CLOUDFLARE_VISION_MODEL}`;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunk));
  }
  return btoa(binary);
}

function extractOutput(result: unknown): { output: unknown; finishReason?: string } {
  if (typeof result === "string") return { output: result };
  if (!result || typeof result !== "object") return { output: result };
  const typed = result as {
    response?: unknown;
    result?: unknown;
    choices?: { message?: { content?: unknown }; finish_reason?: string }[];
  };
  if (typeof typed.response === "string") return { output: typed.response };
  if (typeof typed.result === "string") return { output: typed.result };
  const first = Array.isArray(typed.choices) ? typed.choices[0] : undefined;
  if (first) return { output: first.message?.content, finishReason: first.finish_reason };
  return { output: result };
}

function normalizeMime(value: string | null | undefined): string {
  const mime = (value ?? "").split(";", 1)[0].trim().toLowerCase();
  if (mime === "image/png" || mime === "image/webp" || mime === "image/gif" || mime === "image/jpeg") return mime;
  return "image/jpeg";
}

function isStrictDataCenterSubject(subject: SubjectExtract): boolean {
  return subject.title === "Texas data-center and electrical infrastructure"
    || /\bdata[- ]center\b/i.test(subject.title)
      && /plain brick|industrial cooling equipment|server campus|electrical substation/i.test(subject.concreteSubject);
}

/**
 * Stored editorial photography is governed differently from newly generated
 * imagery. A truthful archive photo of the exact named team, person, agency,
 * venue, product, institution, or affected infrastructure can be a strong hero
 * even when a camera cannot literally show an abstract vote, appointment,
 * investigation, roster decision, score, controversy, or policy change.
 *
 * Data-center coverage remains intentionally stricter because a generic boxy
 * building was the original failure mode: visible infrastructure must prove the
 * physical subject from the pixels themselves.
 */
export function storedHeroEditorialGuidance(subject: SubjectExtract): string {
  if (isStrictDataCenterSubject(subject)) {
    return [
      "STRICT DATA-CENTER STORED-HERO RULE:",
      "The image must visibly read as data-center or electrical-infrastructure photography from the pixels themselves.",
      "Require concrete cues such as industrial cooling equipment, server-facility structures, substations, transformers, transmission equipment, generator or utility infrastructure, or a clearly visible server-hall context.",
      "A plain brick, office-like, residential-looking, warehouse-like, or windowless building exterior with no visible data-center infrastructure must fail even if metadata, filename, caption, or editor knowledge identifies it as a data center.",
    ].join(" ");
  }

  if (subject.domain === "sports") {
    return [
      "STORED SPORTS PHOTO RULE:",
      "A real archive photograph is a direct representative match when it clearly depicts the named team or athlete, or unmistakably depicts the exact sport in a truthful team/game/practice context central to the story.",
      "Do not require the exact historical game, exact score, exact roster decision, exact date, or exact play to be visible.",
      "Reject unrelated sports, stadium-only or crowd-only association when the sport itself is absent, and generic stock scenes with no meaningful connection to the named team, athlete, or sport.",
    ].join(" ");
  }

  if (subject.domain === "politics" || subject.domain === "legal") {
    return [
      "STORED CIVIC PHOTO RULE:",
      "A real photograph of the named policymaker, court, public agency, governing institution, official venue, or concrete policy target is a direct representative match.",
      "Do not require an invisible appointment, vote, investigation, lawsuit, budget action, tax change, hearing outcome, or policy decision to be literally visible in the frame.",
      "Reject unrelated capitol/courthouse/government stock imagery when neither the named institution, person, place, nor concrete policy target is actually represented.",
    ].join(" ");
  }

  if (subject.domain === "culture") {
    return [
      "STORED CULTURE PHOTO RULE:",
      "A real photograph of the named artist, performer, restaurant, festival, venue, cultural object, or exact activity is a direct representative match.",
      "It need not document the exact moment described in the article.",
      "Reject generic city skylines, unrelated venues, instruments, food, or crowd scenes that omit the named or defining cultural subject.",
    ].join(" ");
  }

  if (subject.domain === "weather") {
    return [
      "STORED WEATHER PHOTO RULE:",
      "A current official weather graphic or a truthful photograph of the described weather phenomenon, impact, or affected physical environment is a representative match.",
      "Do not require the exact timestamp or exact event location when the physical phenomenon clearly matches.",
      "Reject dramatic historical-disaster imagery presented as current conditions when it is not representative of the story.",
    ].join(" ");
  }

  return [
    "STORED EDITORIAL PHOTO RULE:",
    "A real archive photograph is a direct representative match when it clearly depicts a named person, organization, agency, institution, team, venue, product, animal, infrastructure, place, or other concrete entity that is central to the article.",
    "A camera does not need to literally visualize an abstract appointment, vote, budget change, tax action, investigation, ranking, delay, dispute, controversy, statistic, business decision, or other invisible action when the central real-world entity or physical subject is truthfully shown.",
    "Reject loose topical association, generic symbolism, unrelated buildings, generic stock scenes, or location-only imagery when the article's central concrete entity or physical subject is absent.",
  ].join(" ");
}

/**
 * Validate an already-stored hero through a stored-photo-specific editorial
 * policy. This deliberately does not reuse the stricter generated-image gate:
 * generated scenes must synthesize the assignment itself, while licensed or
 * public-domain archive photography may truthfully represent the central real
 * entity without recreating an invisible decision or exact historical moment.
 */
export async function validateStoredHeroMatchesArticle(
  bytes: Uint8Array,
  contentType: string | null | undefined,
  subject: SubjectExtract,
): Promise<{ matches: boolean; reason: string }> {
  const mime = normalizeMime(contentType);
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    return { matches: false, reason: "Cloudflare vision validator unavailable: missing credentials" };
  }

  const image = `data:${mime};base64,${bytesToBase64(bytes)}`;
  const guidance = storedHeroEditorialGuidance(subject);
  const prompt = [
    `Article title: "${subject.title}"`,
    `Article domain: ${subject.domain}`,
    `Primary visual subject: ${subject.concreteSubject}`,
    "Evaluate the supplied STORED editorial photograph, not a newly generated illustration.",
    guidance,
    "Treat a clearly visible central named entity or concrete physical subject as primary-subject evidence even when the headline also describes an abstract action that cannot be photographed directly.",
    "Filename, source metadata, hidden captions, and editor knowledge do not count as visual evidence for what appears in the frame.",
    "Judge whether the image is a truthful representative editorial visual for the article. Do not require proof that it was captured at the exact historical event unless the story itself is specifically about a unique visual incident and the image claims to depict that incident.",
    "photorealistic=false for illustration, vector art, cartoon, poster, icon, graphic design, collage, infographic, or synthetic placeholder imagery unless the governed article policy explicitly allows editorial illustration. For ordinary news photography, require a real or convincingly photographic scene.",
    "Return exactly one JSON object with boolean matches, boolean photorealistic, and string reason. No Markdown or surrounding prose.",
  ].join("\n");

  const schema = {
    type: "object",
    properties: {
      matches: { type: "boolean" },
      photorealistic: { type: "boolean" },
      reason: { type: "string" },
    },
    required: ["matches", "photorealistic", "reason"],
  };

  let lastFailure = "Cloudflare vision validator returned no verdict";
  for (let attempt = 1; attempt <= VALIDATION_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(endpoint(accountId), {
        method: "POST",
        headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are an editorial-photo quality reviewer. For stored archive photography, accept truthful representative photos of the article's central real entity or concrete subject without demanding a literal depiction of an invisible decision. Apply any explicitly strict subject rule in the user prompt. Return only the requested JSON verdict.",
            },
            {
              role: "user",
              content: attempt === 1 ? prompt : `${prompt}\nThis is a retry because the prior response was unavailable or malformed. Follow the JSON format exactly.`,
            },
          ],
          image,
          guided_json: schema,
          max_tokens: 256,
          temperature: 0,
        }),
        signal: controller.signal,
      });

      const raw = await response.text().catch(() => "");
      let payload: { success?: boolean; result?: unknown; errors?: { message?: string }[] } = {};
      try {
        payload = raw ? JSON.parse(raw) : {};
      } catch {
        lastFailure = `Cloudflare vision returned non-JSON HTTP payload ${response.status}${raw ? `: ${raw.slice(0, 180)}` : ""}`;
        continue;
      }
      if (!response.ok || payload.success === false) {
        lastFailure = `Cloudflare vision HTTP ${response.status}: ${payload.errors?.[0]?.message || raw.slice(0, 180) || "empty response"}`;
        if (response.status === 429 || response.status >= 500) continue;
        return { matches: false, reason: lastFailure.slice(0, 360) };
      }

      const { output, finishReason } = extractOutput(payload.result);
      const normalized = normalizeCloudflareVisionVerdictOutput(output);
      const parsed = parseVisionVerdict(normalized);
      if (parsed) {
        const ok = parsed.matches && parsed.photorealistic;
        return {
          matches: ok,
          reason: String(parsed.reason || (ok ? "story match and photorealism passed" : "quality gate failed")).slice(0, 300),
        };
      }
      lastFailure = `Cloudflare vision validator returned no parseable verdict${finishReason ? ` (finish_reason=${finishReason})` : ""}`;
    } catch (error) {
      const err = error as Error;
      lastFailure = err?.name === "AbortError"
        ? `Cloudflare vision validator timed out after ${REQUEST_TIMEOUT_MS}ms`
        : `Cloudflare vision validator error: ${err?.message || String(error)}`;
    } finally {
      clearTimeout(timeout);
    }
  }

  return { matches: false, reason: `${lastFailure} after ${VALIDATION_ATTEMPTS} attempts`.slice(0, 360) };
}
