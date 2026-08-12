import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

type OpenAiTextPart = { type?: "text"; text?: string };
type OpenAiImagePart = { type?: "image_url"; image_url?: { url?: string } };
type OpenAiContent = string | Array<OpenAiTextPart | OpenAiImagePart>;
type OpenAiMessage = { role?: string; content?: OpenAiContent };
type OpenAiCompatBody = {
  model?: string;
  messages?: OpenAiMessage[];
  max_tokens?: number;
  response_format?: { type?: string; json_schema?: unknown };
};
type OpenAiImageBody = {
  model?: string;
  messages?: OpenAiMessage[];
};

type GeminiInteraction = {
  status?: string;
  steps?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
      data?: string;
      mime_type?: string;
    }>;
    error?: { message?: string };
  }>;
};

type CloudflareAiResponse = {
  success?: boolean;
  result?: { response?: unknown };
  errors?: Array<{ code?: number; message?: string }>;
};

const LOVABLE_AI_GATEWAY_PREFIX = "https://ai.gateway.lovable.dev/";
const LOVABLE_CHAT_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const LOVABLE_IMAGE_GATEWAY = "https://ai.gateway.lovable.dev/v1/images/generations";
const GEMINI_INTERACTIONS = "https://generativelanguage.googleapis.com/v1beta/interactions";
const GEMINI_IMAGE_MIME_TYPE = "image/jpeg";
const CLOUDFLARE_TEXT_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const nativeFetch = globalThis.fetch.bind(globalThis);
let directAiFetchInstalled = false;

function directGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_API_KEY;
}

function cloudflareCredentials(): { accountId: string; apiToken: string } | null {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  return accountId && apiToken ? { accountId, apiToken } : null;
}

function textFromContent(content: OpenAiContent | undefined): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .filter((part): part is OpenAiTextPart => part?.type === "text")
    .map((part) => part.text?.trim() || "")
    .filter(Boolean)
    .join("\n");
}

function geminiPartsFromContent(content: OpenAiContent | undefined): Array<Record<string, unknown>> {
  if (typeof content === "string") return [{ text: content }];
  if (!Array.isArray(content)) return [];

  const parts: Array<Record<string, unknown>> = [];
  for (const part of content) {
    if (part?.type === "text" && part.text) {
      parts.push({ text: part.text });
      continue;
    }
    if (part?.type === "image_url") {
      const raw = part.image_url?.url || "";
      const match = raw.match(/^data:([^;,]+);base64,([A-Za-z0-9+/=]+)$/);
      if (match) {
        parts.push({
          inline_data: {
            mime_type: match[1],
            data: match[2],
          },
        });
      }
    }
  }
  return parts;
}

function requestedImageModel(body: OpenAiImageBody): string {
  const requested = body.model?.replace(/^google\//, "").trim();
  return process.env.AI_IMAGE_MODEL || requested || "gemini-3.1-flash-image";
}

function hasImageInput(body: OpenAiCompatBody): boolean {
  return (body.messages ?? []).some(
    (message) =>
      Array.isArray(message.content) &&
      message.content.some((part) => part?.type === "image_url"),
  );
}

async function directGeminiImageResponse(
  body: OpenAiImageBody,
  apiKey: string,
  signal?: AbortSignal | null,
): Promise<Response> {
  const prompt = (body.messages ?? [])
    .map((message) => textFromContent(message.content))
    .filter(Boolean)
    .join("\n\n")
    .trim();
  if (!prompt) {
    return Response.json({ error: { message: "Image request contained no prompt" } }, { status: 400 });
  }

  const model = requestedImageModel(body);
  const response = await nativeFetch(GEMINI_INTERACTIONS, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      model,
      input: prompt,
      response_format: {
        type: "image",
        mime_type: GEMINI_IMAGE_MIME_TYPE,
        aspect_ratio: "16:9",
        image_size: "1K",
      },
    }),
    signal: signal ?? undefined,
  });

  const text = await response.text();
  if (!response.ok) {
    return new Response(text, {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") || "application/json" },
    });
  }

  let payload: GeminiInteraction;
  try {
    payload = JSON.parse(text) as GeminiInteraction;
  } catch {
    return Response.json({ error: { message: "Gemini image API returned invalid JSON" } }, { status: 502 });
  }

  const modelOutputs = (payload.steps ?? []).filter((step) => step.type === "model_output");
  const image = modelOutputs
    .flatMap((step) => step.content ?? [])
    .reverse()
    .find((part) => part.type === "image" && typeof part.data === "string" && part.data.length > 0);

  if (!image?.data) {
    const failure = (payload.steps ?? []).find((step) => step.error?.message)?.error?.message;
    return Response.json(
      { error: { message: failure || `Gemini image API returned no image (${payload.status || "unknown status"})` } },
      { status: 502 },
    );
  }

  return Response.json({
    data: [{ b64_json: image.data }],
    provider: "google-gemini-direct",
    model,
  });
}

async function directGeminiVisionResponse(
  body: OpenAiCompatBody,
  apiKey: string,
  signal?: AbortSignal | null,
): Promise<Response> {
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const system = messages
    .filter((message) => message.role === "system")
    .map((message) => textFromContent(message.content).trim())
    .filter(Boolean)
    .join("\n\n");
  const conversational = messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: geminiPartsFromContent(message.content),
    }))
    .filter((message) => message.parts.length > 0);

  const model = process.env.AI_VALIDATION_MODEL || "gemini-3.5-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const response = await nativeFetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
      contents: conversational,
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: Math.min(Math.max(Number(body.max_tokens) || 1024, 256), 12000),
        temperature: 0.1,
      },
    }),
    signal: signal ?? undefined,
  });

  const text = await response.text();
  if (!response.ok) {
    return new Response(text, {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") || "application/json" },
    });
  }

  let payload: { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  try {
    payload = JSON.parse(text) as typeof payload;
  } catch {
    return Response.json({ error: { message: "Gemini returned invalid JSON" } }, { status: 502 });
  }

  const content = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();
  if (!content) {
    return Response.json({ error: { message: "Gemini returned an empty response" } }, { status: 502 });
  }

  return Response.json({
    choices: [{ message: { role: "assistant", content } }],
    provider: "google-gemini-direct",
    model,
  });
}

function normalizeCloudflareJsonContent(rawContent: unknown): string | null {
  if (rawContent && typeof rawContent === "object") return JSON.stringify(rawContent);
  if (typeof rawContent !== "string") return null;
  const content = rawContent.trim();
  if (!content) return null;
  try {
    return JSON.stringify(JSON.parse(content));
  } catch {
    return null;
  }
}

async function directCloudflareTextResponse(
  body: OpenAiCompatBody,
  credentials: { accountId: string; apiToken: string },
  signal?: AbortSignal | null,
): Promise<Response> {
  const messages = (body.messages ?? [])
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : message.role === "system" ? "system" : "user",
      content: textFromContent(message.content),
    }))
    .filter((message) => message.content.trim().length > 0);

  if (messages.length === 0) {
    return Response.json({ error: { message: "Cloudflare text request contained no prompt" } }, { status: 400 });
  }

  const model = process.env.AI_REWRITE_MODEL_CF || CLOUDFLARE_TEXT_MODEL;
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(credentials.accountId)}/ai/run/${model}`;
  const maxTokens = Math.min(Math.max(Number(body.max_tokens) || 9000, 256), 12000);
  let lastFailure = "Cloudflare Workers AI returned invalid JSON";

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const retryInstruction = attempt === 1 ? null : {
      role: "system" as const,
      content: "CRITICAL: Your previous attempt was malformed or truncated. Return one COMPLETE valid JSON object only. Close every string, array, and object. Do not include markdown fences or prose outside the JSON object.",
    };
    const response = await nativeFetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${credentials.apiToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        messages: retryInstruction ? [...messages, retryInstruction] : messages,
        response_format: body.response_format ?? { type: "json_object" },
        max_tokens: maxTokens,
        temperature: attempt === 1 ? 0.25 : 0.1,
      }),
      signal: signal ?? undefined,
    });

    const text = await response.text();
    let payload: CloudflareAiResponse | null = null;
    try {
      payload = JSON.parse(text) as CloudflareAiResponse;
    } catch {
      lastFailure = `Cloudflare Workers AI ${response.status}: provider envelope was invalid JSON`;
      continue;
    }

    if (!response.ok || payload?.success === false) {
      const detail = payload?.errors?.map((error) => error.message).filter(Boolean).join("; ") || text.slice(0, 400);
      lastFailure = `Cloudflare Workers AI ${response.status}: ${detail}`;
      if (response.status >= 400 && response.status < 500 && response.status !== 408 && response.status !== 429) {
        return Response.json({ error: { message: lastFailure } }, { status: response.status || 502 });
      }
      continue;
    }

    const content = normalizeCloudflareJsonContent(payload?.result?.response);
    if (content) {
      return Response.json({
        choices: [{ message: { role: "assistant", content } }],
        provider: "cloudflare-workers-ai",
        model,
        attempts: attempt,
      });
    }
    lastFailure = `Cloudflare Workers AI returned malformed or truncated JSON on attempt ${attempt}`;
  }

  return Response.json({ error: { message: lastFailure } }, { status: 502 });
}

function installDirectAiFetch(): void {
  if (directAiFetchInstalled) return;
  const geminiApiKey = directGeminiApiKey();
  const cf = cloudflareCredentials();

  // Compatibility only: legacy callers still check LOVABLE_API_KEY before
  // entering their AI paths. No request is allowed to reach Lovable.
  if ((cf || geminiApiKey) && !process.env.LOVABLE_API_KEY) {
    process.env.LOVABLE_API_KEY = "direct-provider";
  }

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

    if (!url.startsWith(LOVABLE_AI_GATEWAY_PREFIX)) return nativeFetch(input, init);
    if (url !== LOVABLE_CHAT_GATEWAY && url !== LOVABLE_IMAGE_GATEWAY) {
      return Response.json({ error: { message: `Unsupported legacy AI endpoint blocked from Lovable: ${url}` } }, { status: 501 });
    }

    let body: OpenAiCompatBody | OpenAiImageBody;
    try {
      body = JSON.parse(typeof init?.body === "string" ? init.body : "{}") as OpenAiCompatBody | OpenAiImageBody;
    } catch {
      return Response.json({ error: { message: "Invalid AI request JSON" } }, { status: 400 });
    }

    if (url === LOVABLE_IMAGE_GATEWAY) {
      if (!geminiApiKey) return Response.json({ error: { message: "Direct Gemini image AI is not configured. Lovable fallback is disabled." } }, { status: 503 });
      return directGeminiImageResponse(body as OpenAiImageBody, geminiApiKey, init?.signal);
    }

    const chatBody = body as OpenAiCompatBody;
    if (hasImageInput(chatBody)) {
      if (!geminiApiKey) return Response.json({ error: { message: "Direct Gemini image validation is not configured. Lovable fallback is disabled." } }, { status: 503 });
      return directGeminiVisionResponse(chatBody, geminiApiKey, init?.signal);
    }

    if (!cf) {
      return Response.json({ error: { message: "Cloudflare Workers AI text rewriting is not configured. CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required; Lovable and Gemini text fallbacks are disabled." } }, { status: 503 });
    }

    return directCloudflareTextResponse(chatBody, cf, init?.signal);
  }) as typeof globalThis.fetch;

  directAiFetchInstalled = true;
  if (cf) {
    console.info(`[AI] text rewrite provider = Cloudflare Workers AI (${process.env.AI_REWRITE_MODEL_CF || CLOUDFLARE_TEXT_MODEL}); Lovable and Gemini text routing disabled`);
  } else {
    console.warn("[AI] Cloudflare Workers AI text credentials missing; text rewrite calls will fail closed");
  }
}

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then((m) => (m.default ?? m) as ServerEntry);
  }
  return serverEntryPromise;
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      installDirectAiFetch();
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};