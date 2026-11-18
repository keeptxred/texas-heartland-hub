import { createFileRoute } from "@tanstack/react-router";
import { verifyGitHubActionsOidc } from "@/lib/github-actions-oidc";
import {
  TD_EDITORIAL_AI_AUDIENCE,
  TD_EDITORIAL_OIDC_WORKFLOWS,
  parseTexasDefinedEditorialAiRequest,
  type TdEditorialAiRequest,
} from "@/lib/texasdefined-editorial-ai-contract";

const REPOSITORY = "keeptxred/TexasDefined";
const MODEL_ORIGIN = "https://api.cloudflare.com/client/v4/accounts";
const MAX_BODY_CHARS = 38_000;
const MAX_IMAGE_BYTES = 12_000_000;
const MAX_TEXT_BYTES = 1_500_000;

function reply(body: Record<string, unknown>, status: number): Response {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

function bearerToken(request: Request): string {
  const value = request.headers.get("authorization") ?? "";
  return value.match(/^Bearer\s+(.+)$/i)?.[1]?.trim() ?? "";
}

/**
 * The caller repository is separate from KTR. Its signed GitHub token must
 * attest exact repo+workflow+main+event. No static, shared secrets in TD.
 * Successful verification also checks issuer, audience, expiry, RS256 JWKS
 * signature and refs/heads/main in the existing shared helper.
 */
async function isAuthorized(request: Request): Promise<boolean> {
  const token = bearerToken(request);
  if (!token || token.length > 10_000) return false;
  for (const workflow of TD_EDITORIAL_OIDC_WORKFLOWS) {
    try {
      await verifyGitHubActionsOidc({
        token,
        audience: TD_EDITORIAL_AI_AUDIENCE,
        repository: REPOSITORY,
        workflowPath: workflow.path,
        allowedEventNames: workflow.events,
      });
      return true;
    } catch {
      // Try only the next explicit same-owner workflow; never accept a
      // generic GitHub Actions token or fail open on JWKS transport errors.
    }
  }
  return false;
}

function cloudflareRequest(ai: TdEditorialAiRequest): RequestInit {
  if (ai.kind === "text") {
    return {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        messages: ai.messages,
        max_tokens: ai.maxTokens,
        temperature: ai.temperature,
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(125_000),
    };
  }
  // Cloudflare FLUX.2 Klein's API accepts form input. The previous TD
  // caller used the retired FLUX.1 Schnell JSON API and was not portable.
  const form = new FormData();
  form.append("prompt", ai.prompt);
  form.append("guidance", "5.5");
  form.append("width", "1280");
  form.append("height", "720");
  return {
    method: "POST",
    body: form,
    signal: AbortSignal.timeout(125_000),
  };
}

async function post({ request }: { request: Request }): Promise<Response> {
  if (!(await isAuthorized(request))) {
    return reply({ ok: false, error: "GitHub Actions OIDC authorization required" }, 401);
  }

  const declaredSize = Number(request.headers.get("content-length") || "0");
  if (declaredSize > MAX_BODY_CHARS) return reply({ ok: false, error: "Request too large" }, 413);
  let ai: TdEditorialAiRequest;
  try {
    const bodyText = await request.text();
    if (bodyText.length > MAX_BODY_CHARS) throw new Error("Request too large");
    ai = parseTexasDefinedEditorialAiRequest(JSON.parse(bodyText));
  } catch {
    return reply({ ok: false, error: "Invalid or oversized editorial AI request" }, 400);
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken || !/^[a-f0-9]{32}$/i.test(accountId)) {
    return reply({ ok: false, error: "Existing KTR AI service credentials unavailable" }, 503);
  }

  let upstream: Response;
  try {
    const options = cloudflareRequest(ai);
    upstream = await fetch(
      MODEL_ORIGIN + "/" + encodeURIComponent(accountId) + "/ai/run/" + ai.model,
      {
        ...options,
        headers: {
          ...options.headers,
          authorization: "Bearer " + apiToken,
        },
      },
    );
  } catch {
    return reply({ ok: false, error: "AI service connection unavailable" }, 502);
  }

  if (!upstream.ok) {
    // Keep provider response details and credentials off public surfaces;
    // GitHub sees only the safe HTTP status. No retries on 4xx, quota,
    // moderation, missing model or authentication failures.
    console.error("[texasdefined-editorial-ai] provider unavailable", ai.kind, upstream.status);
    return reply({ ok: false, error: "Provider request failed", status: upstream.status }, upstream.status === 429 ? 429 : 502);
  }
  const contentType = (upstream.headers.get("content-type") || "").toLowerCase();
  const limit = ai.kind === "image" ? MAX_IMAGE_BYTES : MAX_TEXT_BYTES;
  const sizeHint = Number(upstream.headers.get("content-length") || "0");
  if (sizeHint > limit) return reply({ ok: false, error: "AI response too large" }, 502);
  if (!contentType.startsWith("application/json")
      && !(ai.kind === "image" && (contentType.startsWith("image/") || contentType.startsWith("application/octet-stream")))) {
    return reply({ ok: false, error: "Unsupported AI response format" }, 502);
  }
  const bytes = await upstream.arrayBuffer();
  if (bytes.byteLength === 0 || bytes.byteLength > limit) {
    return reply({ ok: false, error: "AI response size validation failed" }, 502);
  }
  return new Response(bytes, {
    status: 200,
    headers: {
      "content-type": contentType || "application/json",
      "cache-control": "no-store",
      "x-texasdefined-ai-transport": "signed-github-oidc",
    },
  });
}

export const Route = createFileRoute("/api/public/hooks/texasdefined-editorial-ai")({
  server: { handlers: { POST: post } },
});
