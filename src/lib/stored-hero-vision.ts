import {
  CLOUDFLARE_VISION_MODEL,
  imageValidationDomainGuidance,
  normalizeCloudflareVisionVerdictOutput,
  validateImageMatchesArticle,
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
  if (mime === "image/png" || mime === "image/webp" || mime === "image/gif") return mime;
  return "image/jpeg";
}

/**
 * Validate an already-stored hero with the same primary-subject guidance used
 * by generated-image validation. JPEGs use the existing production validator
 * directly. Other raster formats use the same Cloudflare vision model and
 * guidance while preserving the actual data-URI MIME type.
 */
export async function validateStoredHeroMatchesArticle(
  bytes: Uint8Array,
  contentType: string | null | undefined,
  subject: SubjectExtract,
): Promise<{ matches: boolean; reason: string }> {
  const mime = normalizeMime(contentType);
  if (mime === "image/jpeg") return validateImageMatchesArticle(bytes, subject);

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    return { matches: false, reason: "Cloudflare vision validator unavailable: missing credentials" };
  }

  const image = `data:${mime};base64,${bytesToBase64(bytes)}`;
  const guidance = imageValidationDomainGuidance(subject);
  const prompt = [
    `Article title: "${subject.title}"`,
    `Article domain: ${subject.domain}`,
    `Primary visual subject: ${subject.concreteSubject}`,
    "Evaluate the supplied stored hero as an editorial image.",
    guidance,
    "Apply the primary-subject rule strictly before considering broad topical association.",
    "The defining subject or activity must be visually understandable from the pixels themselves; filename, source metadata, hidden captions, and editor knowledge do not count as visual evidence.",
    "Judge whether the image is a truthful representative editorial visual for the article topic. Do not require proof that it was captured at the exact historical event.",
    "photorealistic=false for illustration, vector art, cartoon, poster, icon, graphic design, collage, or synthetic placeholder imagery unless the article's governed hero policy explicitly calls for an editorial illustration. For ordinary news photography, require a real or convincingly photographic scene.",
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
              content: "You are a strict editorial-image quality reviewer. Judge primary-subject relevance and whether a reasonable reader can understand the defining visual subject from the image itself. Return only the requested JSON verdict.",
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
