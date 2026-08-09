import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

type OpenAiMessage = { role?: string; content?: string };
type OpenAiCompatBody = {
  messages?: OpenAiMessage[];
  max_tokens?: number;
};

const LOVABLE_AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const nativeFetch = globalThis.fetch.bind(globalThis);
let directAiFetchInstalled = false;

function directGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_API_KEY;
}

function installDirectAiFetch(): void {
  if (directAiFetchInstalled) return;
  const apiKey = directGeminiApiKey();
  if (!apiKey) return;

  // Compatibility only: the older newsroom publisher checks this variable
  // before entering the rewrite pipeline. No request is sent to Lovable; the
  // matching gateway call below is intercepted and sent directly to Google.
  if (!process.env.LOVABLE_API_KEY) process.env.LOVABLE_API_KEY = "direct-gemini";

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

    if (url !== LOVABLE_AI_GATEWAY) return nativeFetch(input, init);

    let body: OpenAiCompatBody;
    try {
      body = JSON.parse(typeof init?.body === "string" ? init.body : "{}") as OpenAiCompatBody;
    } catch {
      return Response.json({ error: { message: "Invalid rewrite request JSON" } }, { status: 400 });
    }

    const messages = Array.isArray(body.messages) ? body.messages : [];
    const system = messages
      .filter((message) => message.role === "system" && typeof message.content === "string")
      .map((message) => message.content!.trim())
      .filter(Boolean)
      .join("\n\n");
    const conversational = messages
      .filter((message) => message.role !== "system" && typeof message.content === "string")
      .map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content! }],
      }));

    const model = process.env.AI_REWRITE_MODEL || "gemini-3.5-flash";
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
          maxOutputTokens: Math.min(Math.max(Number(body.max_tokens) || 9000, 512), 12000),
          temperature: 0.25,
        },
      }),
      signal: init?.signal,
    });

    const text = await response.text();
    if (!response.ok) {
      return new Response(text, {
        status: response.status,
        headers: { "content-type": response.headers.get("content-type") || "application/json" },
      });
    }

    let payload: {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
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
      return Response.json({ error: { message: "Gemini returned an empty rewrite" } }, { status: 502 });
    }

    return Response.json({
      choices: [{ message: { role: "assistant", content } }],
      provider: "google-gemini-direct",
      model,
    });
  }) as typeof globalThis.fetch;

  directAiFetchInstalled = true;
  console.info("[AI rewrite] direct Gemini provider enabled; Lovable gateway bypassed");
}

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

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
