/**
 * Strict, bounded upstream request contract for TexasDefined's signed GitHub
 * Actions only. No stored credentials, arbitrary models, open proxy URLs,
 * owner activation flags, publishing commands, or per-item approvals.
 */
export const TD_EDITORIAL_AI_AUDIENCE = "texasdefined-editorial-ai";
export const TD_EDITORIAL_TEXT_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";
// Bigger grounded article model for 750+ original, fact-checked words. Cloudflare-hosted, verified current model.
export const TD_EDITORIAL_AUTHORITY_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
export const TD_EDITORIAL_IMAGE_MODEL = "@cf/black-forest-labs/flux-2-klein-4b";

export const TD_EDITORIAL_OIDC_WORKFLOWS = [
  {
    path: ".github/workflows/texasdefined-auto-publication.yml",
    events: ["workflow_dispatch"],
  },
  {
    path: ".github/workflows/texasdefined-scheduled-authority-news.yml",
    events: ["schedule", "workflow_dispatch"],
  },
  {
    path: ".github/workflows/flyover-scheduled-publish-bridge.yml",
    events: ["issues"],
  },
] as const;

type AiMessage = { role: "system" | "user"; content: string };
export type TdEditorialAiRequest =
  | {
      kind: "text";
      model: typeof TD_EDITORIAL_TEXT_MODEL | typeof TD_EDITORIAL_AUTHORITY_MODEL;
      messages: AiMessage[];
      maxTokens: number;
      temperature: number;
    }
  | {
      kind: "image";
      model: typeof TD_EDITORIAL_IMAGE_MODEL;
      prompt: string;
    };

export function parseTexasDefinedEditorialAiRequest(input: unknown): TdEditorialAiRequest {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Request body must be a JSON object");
  }
  const value = input as Record<string, unknown>;
  const model = value.model;
  const payload = value.input;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("AI input must be a JSON object");
  }
  const data = payload as Record<string, unknown>;
  if (model === TD_EDITORIAL_TEXT_MODEL || model === TD_EDITORIAL_AUTHORITY_MODEL) {
    const messages = data.messages;
    if (!Array.isArray(messages) || messages.length !== 2) {
      throw new Error("Text input requires exactly one system and one user message");
    }
    const parsed: AiMessage[] = [];
    for (const item of messages) {
      if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error("Invalid text message");
      const entry = item as Record<string, unknown>;
      if ((entry.role !== "system" && entry.role !== "user")
        || typeof entry.content !== "string" || entry.content.trim().length < 10
        || entry.content.length > 32_000) {
        throw new Error("Invalid message role or size");
      }
      parsed.push({ role: entry.role, content: entry.content });
    }
    if (parsed[0].role !== "system" || parsed[1].role !== "user"
        || parsed[0].content.length + parsed[1].content.length > 35_000) {
      throw new Error("Unexpected text message sequence");
    }
    const maxTokens = data.max_tokens;
    const temperature = data.temperature;
    if (typeof maxTokens !== "number" || !Number.isInteger(maxTokens)
        || maxTokens < 256 || maxTokens > 5_000) {
      throw new Error("Text output budget must be 256-5000 tokens");
    }
    if (typeof temperature !== "number" || !Number.isFinite(temperature)
        || temperature < 0 || temperature > 0.4) {
      throw new Error("Text temperature outside permitted editorial bounds");
    }
    return { kind: "text", model, messages: parsed, maxTokens, temperature };
  }
  if (model === TD_EDITORIAL_IMAGE_MODEL) {
    if (typeof data.prompt !== "string" || data.prompt.trim().length < 40
        || data.prompt.length > 2_048) {
      throw new Error("Editorial image prompt must be 40-2048 characters");
    }
    if (data.steps !== 4) throw new Error("Image generation steps must be exactly four");
    return { kind: "image", model, prompt: data.prompt.trim() };
  }
  throw new Error("Model is not authorized for TexasDefined publishing");
}

export function isTexasDefinedEditorialAiWorkflow(path: string, event: string): boolean {
  return TD_EDITORIAL_OIDC_WORKFLOWS.some((entry) =>
    entry.path === path && (entry.events as readonly string[]).includes(event));
}
