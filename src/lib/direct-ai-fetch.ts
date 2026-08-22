import { normalizeJsonContent } from "./ai-json-normalization";

type TextPart = { type?: "text"; text?: string };
type ImagePart = { type?: "image_url"; image_url?: { url?: string } };
type MessageContent = string | Array<TextPart | ImagePart>;
type Message = { role?: string; content?: MessageContent };
type ChatRequest = {
  model?: string;
  messages?: Message[];
  max_tokens?: number;
  response_format?: { type?: string; json_schema?: unknown };
};
type ImageRequest = {
  model?: string;
  messages?: Message[];
  prompt?: string;
};
type CloudflareResponse = {
  success?: boolean;
  result?: { response?: unknown; image?: string };
  errors?: Array<{ code?: number; message?: string }>;
};
type GeminiInteraction = {
  status?: string;
  steps?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string; data?: string; mime_type?: string }>;
    error?: { message?: string };
  }>;
};

export const INTERNAL_AI_ORIGIN = "https://ai.internal.keeptxred.local";
const INTERNAL_CHAT = `${INTERNAL_AI_ORIGIN}/v1/chat/completions`;
const INTERNAL_IMAGES = `${INTERNAL_AI_ORIGIN}/v1/images/generations`;
const GEMINI_INTERACTIONS = "https://generativelanguage.googleapis.com/v1beta/interactions";
const DEFAULT_CLOUDFLARE_TEXT_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";
const DEFAULT_CLOUDFLARE_IMAGE_MODEL = "@cf/black-forest-labs/flux-1-schnell";
const nativeFetch = globalThis.fetch.bind(globalThis);
let installed = false;

function geminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_API_KEY;
}

function cloudflareCredentials(): { accountId: string; apiToken: string } | null {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  return accountId && apiToken ? { accountId, apiToken } : null;
}

function textFromContent(content: MessageContent | undefined): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .filter((part): part is TextPart => part?.type === "text")
    .map((part) => part.text?.trim() || "")
    .filter(Boolean)
    .join("\n");
}

function geminiParts(content: MessageContent | undefined): Array<Record<string, unknown>> {
  if (typeof content === "string") return [{ text: content }];
  if (!Array.isArray(content)) return [];

  const parts: Array<Record<string, unknown>> = [];
  for (const part of content) {
    if (part?.type === "text" && part.text) {
      parts.push({ text: part.text });
      continue;
    }
    if (part?.type !== "image_url") continue;
    const match = (part.image_url?.url || "").match(/^data:([^;,]+);base64,([A-Za-z0-9+/=]+)$/);
    if (!match) continue;
    parts.push({ inline_data: { mime_type: match[1], data: match[2] } });
  }
  return parts;
}

function hasImageInput(body: ChatRequest): boolean {
  return (body.messages ?? []).some(
    (message) =>
      Array.isArray(message.content) &&
      message.content.some((part) => part?.type === "image_url"),
  );
}

function requestPrompt(body: ImageRequest): string {
  return (
    body.prompt?.trim() ||
    (body.messages ?? [])
      .map((message) => textFromContent(message.content))
      .filter(Boolean)
      .join("\n\n")
      .trim()
  );
}

async function generateGeminiImage(
  body: ImageRequest,
  apiKey: string,
  signal?: AbortSignal | null,
): Promise<Response> {
  const prompt = requestPrompt(body);
  if (!prompt) {
    return Response.json({ error: { message: "Image request contained no prompt" } }, { status: 400 });
  }

  const requested = body.model?.replace(/^google\//, "").trim();
  const model = process.env.AI_IMAGE_MODEL || requested || "gemini-3.1-flash-image";
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
        mime_type: "image/jpeg",
        aspect_ratio: "16:9",
        image_size: "1K",
      },
    }),
    signal: signal ?? undefined,
  });

  const raw = await response.text();
  if (!response.ok) {
    return new Response(raw, {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") || "application/json" },
    });
  }

  let payload: GeminiInteraction;
  try {
    payload = JSON.parse(raw) as GeminiInteraction;
  } catch {
    return Response.json({ error: { message: "Gemini image API returned invalid JSON" } }, { status: 502 });
  }

  const image = (payload.steps ?? [])
    .filter((step) => step.type === "model_output")
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

async function validateWithGemini(
  body: ChatRequest,
  apiKey: string,
  signal?: AbortSignal | null,
): Promise<Response> {
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const system = messages
    .filter((message) => message.role === "system")
    .map((message) => textFromContent(message.content).trim())
    .filter(Boolean)
    .join("\n\n");
  const contents = messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: geminiParts(message.content),
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
      contents,
      generationConfig: {
        responseMimeType: "application/json",
        ...(body.response_format?.type === "json_schema" && body.response_format.json_schema
          ? { responseJsonSchema: body.response_format.json_schema }
          : {}),
        maxOutputTokens: Math.min(Math.max(Number(body.max_tokens) || 1024, 256), 12000),
      },
    }),
    signal: signal ?? undefined,
  });

  const raw = await response.text();
  if (!response.ok) {
    return new Response(raw, {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") || "application/json" },
    });
  }

  let payload: { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  try {
    payload = JSON.parse(raw) as typeof payload;
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

async function generateCloudflareText(
  body: ChatRequest,
  credentials: { accountId: string; apiToken: string },
  signal?: AbortSignal | null,
): Promise<Response> {
  const messages = (body.messages ?? [])
    .map((message) => ({
      role:
        message.role === "assistant"
          ? "assistant"
          : message.role === "system"
            ? "system"
            : "user",
      content: textFromContent(message.content),
    }))
    .filter((message) => message.content.trim().length > 0);

  if (messages.length === 0) {
    return Response.json({ error: { message: "AI text request contained no prompt" } }, { status: 400 });
  }

  const model = process.env.AI_REWRITE_MODEL_CF || DEFAULT_CLOUDFLARE_TEXT_MODEL;
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(credentials.accountId)}/ai/run/${model}`;
  const maxTokens = Math.min(Math.max(Number(body.max_tokens) || 9000, 256), 12000);
  let lastFailure = "Cloudflare Workers AI returned invalid JSON";

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const retryInstruction =
      attempt === 1
        ? null
        : {
            role: "system" as const,
            content:
              "CRITICAL: Your previous attempt was malformed or truncated. Return one COMPLETE valid JSON object only. Close every string, array, and object. Do not include markdown fences or prose outside the JSON object.",
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

    const raw = await response.text();
    let payload: CloudflareResponse | null = null;
    try {
      payload = JSON.parse(raw) as CloudflareResponse;
    } catch {
      lastFailure = `Cloudflare Workers AI ${response.status}: provider envelope was invalid JSON`;
      continue;
    }

    if (!response.ok || payload?.success === false) {
      const detail =
        payload?.errors?.map((error) => error.message).filter(Boolean).join("; ") || raw.slice(0, 400);
      lastFailure = `Cloudflare Workers AI ${response.status}: ${detail}`;
      if (response.status === 429 && /daily free allocation|used up.*neurons/i.test(detail)) {
        return Response.json({ error: { message: lastFailure } }, { status: 429 });
      }
      if (
        response.status >= 400 &&
        response.status < 500 &&
        response.status !== 408 &&
        response.status !== 429
      ) {
        return Response.json({ error: { message: lastFailure } }, { status: response.status || 502 });
      }
      continue;
    }

    const content = normalizeJsonContent(payload?.result?.response);
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

async function generateCloudflareImage(
  body: ImageRequest,
  credentials: { accountId: string; apiToken: string },
  signal?: AbortSignal | null,
): Promise<Response> {
  const prompt = requestPrompt(body);
  if (!prompt) {
    return Response.json({ error: { message: "Image request contained no prompt" } }, { status: 400 });
  }

  const model = process.env.AI_IMAGE_MODEL_CF || DEFAULT_CLOUDFLARE_IMAGE_MODEL;
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(credentials.accountId)}/ai/run/${model}`;
  const response = await nativeFetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${credentials.apiToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ prompt: prompt.slice(0, 2048), steps: 4 }),
    signal: signal ?? undefined,
  });

  if (!response.ok) {
    return Response.json(
      { error: { message: `Cloudflare image generation failed (${response.status})` } },
      { status: response.status },
    );
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const payload = (await response.json()) as CloudflareResponse;
    const image = payload?.result?.image;
    if (!image) {
      return Response.json(
        { error: { message: "Cloudflare image generation returned no image" } },
        { status: 502 },
      );
    }
    return Response.json({
      data: [{ b64_json: image }],
      provider: "cloudflare-workers-ai",
      model,
    });
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return Response.json({
    data: [{ b64_json: btoa(binary) }],
    provider: "cloudflare-workers-ai",
    model,
  });
}

export function installDirectAiFetch(): void {
  if (installed) return;

  const cloudflare = cloudflareCredentials();
  const geminiKey = geminiApiKey();
  if (cloudflare || geminiKey) process.env.KTR_AI_PROVIDER_READY = "direct-provider";

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    if (!url.startsWith(INTERNAL_AI_ORIGIN)) return nativeFetch(input, init);

    if (url !== INTERNAL_CHAT && url !== INTERNAL_IMAGES) {
      return Response.json(
        { error: { message: `Unsupported internal AI endpoint: ${url}` } },
        { status: 501 },
      );
    }

    let body: ChatRequest | ImageRequest;
    try {
      body = JSON.parse(typeof init?.body === "string" ? init.body : "{}") as ChatRequest | ImageRequest;
    } catch {
      return Response.json({ error: { message: "Invalid AI request JSON" } }, { status: 400 });
    }

    if (url === INTERNAL_IMAGES) {
      if (cloudflare) return generateCloudflareImage(body as ImageRequest, cloudflare, init?.signal);
      if (geminiKey) return generateGeminiImage(body as ImageRequest, geminiKey, init?.signal);
      return Response.json({ error: { message: "Image AI provider is not configured" } }, { status: 503 });
    }

    const chatBody = body as ChatRequest;
    if (hasImageInput(chatBody)) {
      if (!geminiKey) {
        return Response.json(
          { error: { message: "Image validation provider is not configured" } },
          { status: 503 },
        );
      }
      return validateWithGemini(chatBody, geminiKey, init?.signal);
    }

    if (!cloudflare) {
      return Response.json(
        { error: { message: "Cloudflare Workers AI text provider is not configured" } },
        { status: 503 },
      );
    }
    return generateCloudflareText(chatBody, cloudflare, init?.signal);
  }) as typeof globalThis.fetch;

  installed = true;
  if (cloudflare) {
    console.info(
      `[AI] direct text provider = Cloudflare Workers AI (${process.env.AI_REWRITE_MODEL_CF || DEFAULT_CLOUDFLARE_TEXT_MODEL})`,
    );
  } else {
    console.warn("[AI] Cloudflare Workers AI credentials missing; text AI calls will fail closed");
  }
}
