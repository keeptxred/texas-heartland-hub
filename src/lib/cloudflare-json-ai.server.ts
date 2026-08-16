type CloudflareEnvelope = {
  success?: boolean;
  result?: { response?: unknown };
  errors?: Array<{ message?: string }>;
};

export type CloudflareJsonResult<T> = {
  value: T;
  provider: "cloudflare-workers-ai";
  model: string;
  attempts: number;
};

function credentials(): { accountId: string; token: string } | null {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  return accountId && token ? { accountId, token } : null;
}

function parseObject<T>(raw: unknown): T | null {
  if (raw && typeof raw === "object") return raw as T;
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    const first = trimmed.indexOf("{");
    const last = trimmed.lastIndexOf("}");
    if (first < 0 || last <= first) return null;
    try {
      return JSON.parse(trimmed.slice(first, last + 1)) as T;
    } catch {
      return null;
    }
  }
}

export async function runCloudflareJson<T>(input: {
  system: string;
  user: string;
  maxTokens?: number;
  maxAttempts?: number;
}): Promise<CloudflareJsonResult<T>> {
  const cf = credentials();
  if (!cf) throw new Error("Cloudflare Workers AI credentials are not configured");

  const model = process.env.AI_REWRITE_MODEL_CF || "@cf/meta/llama-3.1-8b-instruct-fast";
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(cf.accountId)}/ai/run/${model}`;
  const maxAttempts = Math.min(Math.max(input.maxAttempts ?? 1, 1), 3);
  let lastFailure = "Cloudflare Workers AI returned malformed JSON";

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const retry = attempt === 1 ? "" : "\n\nYour previous response was malformed or truncated. Return exactly one complete JSON object with no markdown fences or prose outside it.";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cf.token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: input.system + retry },
          { role: "user", content: input.user },
        ],
        response_format: { type: "json_object" },
        max_tokens: Math.min(Math.max(input.maxTokens ?? 9000, 512), 12000),
        temperature: attempt === 1 ? 0.2 : 0.1,
      }),
    });

    const text = await response.text();
    let envelope: CloudflareEnvelope | null = null;
    try {
      envelope = JSON.parse(text) as CloudflareEnvelope;
    } catch {
      lastFailure = `Cloudflare Workers AI ${response.status}: invalid provider envelope`;
      continue;
    }

    if (!response.ok || envelope.success === false) {
      const detail = envelope.errors?.map((error) => error.message).filter(Boolean).join("; ") || text.slice(0, 400);
      lastFailure = `Cloudflare Workers AI ${response.status}: ${detail}`;
      if (response.status === 429 || (response.status >= 400 && response.status < 500 && response.status !== 408)) {
        throw new Error(lastFailure);
      }
      continue;
    }

    const parsed = parseObject<T>(envelope.result?.response);
    if (parsed) return { value: parsed, provider: "cloudflare-workers-ai", model, attempts: attempt };
    lastFailure = `Cloudflare Workers AI returned malformed JSON on attempt ${attempt}`;
  }

  throw new Error(lastFailure);
}
