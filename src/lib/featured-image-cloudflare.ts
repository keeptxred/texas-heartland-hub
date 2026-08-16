import { parseVisionVerdict, type SubjectExtract } from "./featured-image-core";

export const CLOUDFLARE_IMAGE_MODEL = "@cf/lykon/dreamshaper-8-lcm";
export const CLOUDFLARE_VISION_MODEL = "@cf/google/gemma-4-26b-a4b-it";

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

export async function generateImageBytes(prompt: string, negativePrompt: string): Promise<Uint8Array> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) throw new Error("Missing Cloudflare Workers AI credentials: CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required");

  const res = await fetch(cloudflareEndpoint(accountId, CLOUDFLARE_IMAGE_MODEL), {
    method: "POST",
    headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      negative_prompt: negativePrompt,
      width: 1024,
      height: 576,
      num_steps: 20,
      guidance: 7.5,
      seed: Math.floor(Math.random() * 2_147_483_646) + 1,
    }),
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

export async function validateImageMatchesArticle(bytes: Uint8Array, subject: SubjectExtract): Promise<{ matches: boolean; reason: string }> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) return { matches: false, reason: "Cloudflare vision validator unavailable: missing credentials" };
  try {
    const image = `data:image/jpeg;base64,${bytesToBase64(bytes)}`;
    const validationPrompt = [
      `Article title: "${subject.title}"`,
      `Article domain: ${subject.domain}`,
      `Primary visual subject: ${subject.concreteSubject}`,
      "Evaluate the supplied image as an editorial photograph.",
      subject.domain === "legal"
        ? "For a court-ruling story, a believable photorealistic courthouse exterior or courtroom interior IS a valid direct story match; it does not need to literally visualize the abstract legal wording. Reject maps, state outlines, politicians, capitol scenes, election graphics, cartoons, and illustrations."
        : "A valid match must depict the concrete real-world subject or setting, not generic symbolism.",
      "photorealistic=false for illustration, vector art, cartoon, poster, icon, graphic design, collage, or synthetic placeholder imagery.",
      "Return only matches, photorealistic, and reason.",
    ].join("\n");

    const res = await fetch(cloudflareEndpoint(accountId, CLOUDFLARE_VISION_MODEL), {
      method: "POST",
      headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a strict editorial-photo quality reviewer. Follow the response schema and keep reasoning minimal." },
          { role: "user", content: validationPrompt },
        ],
        image,
        response_format: {
          type: "json_schema",
          json_schema: {
            type: "object",
            properties: {
              matches: { type: "boolean" },
              photorealistic: { type: "boolean" },
              reason: { type: "string" },
            },
            required: ["matches", "photorealistic", "reason"],
          },
        },
        max_completion_tokens: 768,
        reasoning_effort: "low",
        temperature: 0,
      }),
    });

    const raw = await res.text().catch(() => "");
    let json: { success?: boolean; result?: unknown; errors?: { message?: string }[] } = {};
    try { json = raw ? JSON.parse(raw) : {}; } catch { return { matches: false, reason: `Cloudflare vision returned non-JSON HTTP payload ${res.status}` }; }
    if (!res.ok || json.success === false) return { matches: false, reason: `Cloudflare vision HTTP ${res.status}: ${json.errors?.[0]?.message || raw.slice(0, 180)}` };

    const { output, finishReason } = extractCloudflareVisionOutput(json.result);
    const parsed = parseVisionVerdict(output);
    if (!parsed) {
      const preview = typeof output === "string" ? output.replace(/\s+/g, " ").trim().slice(0, 220) : JSON.stringify(output ?? "").slice(0, 220);
      const finish = finishReason ? ` (finish_reason=${finishReason})` : "";
      return { matches: false, reason: `Cloudflare vision validator returned no parseable verdict${finish}${preview ? `: ${preview}` : ""}` };
    }
    const ok = parsed.matches && parsed.photorealistic;
    return { matches: ok, reason: String(parsed.reason || (ok ? "story match and photorealism passed" : "quality gate failed")).slice(0, 300) };
  } catch (e) {
    return { matches: false, reason: `Cloudflare vision validator error: ${(e as Error).message}` };
  }
}
