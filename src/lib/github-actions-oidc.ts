type JwtHeader = {
  alg?: string;
  kid?: string;
  typ?: string;
};

type GitHubActionsClaims = {
  iss?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  repository?: string;
  ref?: string;
  workflow_ref?: string;
  event_name?: string;
  [key: string]: unknown;
};

type Jwk = JsonWebKey & { kid?: string; alg?: string; use?: string };

type JwksResponse = { keys?: Jwk[] };

const ISSUER = "https://token.actions.githubusercontent.com";
const JWKS_URL = `${ISSUER}/.well-known/jwks`;
const DEFAULT_ALLOWED_EVENT_NAMES = ["schedule", "workflow_dispatch"] as const;

function decodeBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

function parseJsonSegment<T>(value: string): T {
  const bytes = decodeBase64Url(value);
  return JSON.parse(new TextDecoder().decode(bytes)) as T;
}

function audienceMatches(audience: string | string[] | undefined, expected: string): boolean {
  if (typeof audience === "string") return audience === expected;
  return Array.isArray(audience) && audience.includes(expected);
}

export function isAllowedGitHubActionsEvent(
  eventName: string | undefined,
  allowedEventNames: readonly string[] = DEFAULT_ALLOWED_EVENT_NAMES,
): boolean {
  return Boolean(eventName && allowedEventNames.includes(eventName));
}

export async function verifyGitHubActionsOidc(options: {
  token: string;
  audience: string;
  repository: string;
  workflowPath: string;
  allowedEventNames?: readonly string[];
}): Promise<GitHubActionsClaims> {
  const parts = options.token.split(".");
  if (parts.length !== 3) throw new Error("Malformed GitHub Actions OIDC token");

  const [encodedHeader, encodedClaims, encodedSignature] = parts;
  const header = parseJsonSegment<JwtHeader>(encodedHeader);
  const claims = parseJsonSegment<GitHubActionsClaims>(encodedClaims);

  if (header.alg !== "RS256" || !header.kid) {
    throw new Error("Unsupported GitHub Actions OIDC signing header");
  }

  const jwksResponse = await fetch(JWKS_URL, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!jwksResponse.ok) {
    throw new Error(`GitHub OIDC JWKS fetch failed (${jwksResponse.status})`);
  }
  const jwks = (await jwksResponse.json()) as JwksResponse;
  const jwk = jwks.keys?.find((key) => key.kid === header.kid);
  if (!jwk) throw new Error("GitHub OIDC signing key was not found");

  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const signingInput = toArrayBuffer(
    new TextEncoder().encode(`${encodedHeader}.${encodedClaims}`),
  );
  const signature = toArrayBuffer(decodeBase64Url(encodedSignature));
  const validSignature = await crypto.subtle.verify(
    { name: "RSASSA-PKCS1-v1_5" },
    key,
    signature,
    signingInput,
  );
  if (!validSignature) throw new Error("Invalid GitHub Actions OIDC signature");

  const now = Math.floor(Date.now() / 1000);
  if (claims.iss !== ISSUER) throw new Error("Unexpected GitHub Actions OIDC issuer");
  if (!audienceMatches(claims.aud, options.audience)) {
    throw new Error("Unexpected GitHub Actions OIDC audience");
  }
  if (typeof claims.exp !== "number" || claims.exp <= now) {
    throw new Error("Expired GitHub Actions OIDC token");
  }
  if (typeof claims.nbf === "number" && claims.nbf > now + 30) {
    throw new Error("GitHub Actions OIDC token is not active yet");
  }
  if (claims.repository !== options.repository) {
    throw new Error("Unexpected GitHub Actions repository claim");
  }
  if (claims.ref !== "refs/heads/main") {
    throw new Error("GitHub Actions caller is not running from main");
  }

  const expectedWorkflowRef = `${options.repository}/${options.workflowPath}@refs/heads/main`;
  if (claims.workflow_ref !== expectedWorkflowRef) {
    throw new Error("Unexpected GitHub Actions workflow claim");
  }
  if (!isAllowedGitHubActionsEvent(claims.event_name, options.allowedEventNames)) {
    throw new Error("Unexpected GitHub Actions event claim");
  }

  return claims;
}
