import { createSign } from "node:crypto";

const INDEXING_ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const INDEXING_SCOPE = "https://www.googleapis.com/auth/indexing";
const ALLOWED_ORIGIN = "https://keeptxred.com";
const ALLOWED_TYPES = new Set(["URL_UPDATED", "URL_DELETED"]);

function base64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function parseArguments(argv) {
  const args = [...argv];
  const dryRunIndex = args.indexOf("--dry-run");
  const dryRun = dryRunIndex !== -1;
  if (dryRun) args.splice(dryRunIndex, 1);

  const [url, type = "URL_UPDATED"] = args;
  if (!url) {
    throw new Error(
      "Usage: node scripts/seo/submit-google-job-url.mjs <url> [URL_UPDATED|URL_DELETED] [--dry-run]",
    );
  }
  if (!ALLOWED_TYPES.has(type)) {
    throw new Error(`Unsupported notification type: ${type}`);
  }

  const parsed = new URL(url);
  if (parsed.origin !== ALLOWED_ORIGIN || parsed.username || parsed.password || parsed.hash) {
    throw new Error(`Only valid ${ALLOWED_ORIGIN} URLs may be submitted`);
  }
  return { url: parsed.href, type, dryRun };
}

function readCredentials() {
  const raw = process.env.GOOGLE_SEARCH_CONSOLE_CREDENTIALS_JSON;
  if (!raw) {
    throw new Error("GOOGLE_SEARCH_CONSOLE_CREDENTIALS_JSON is not configured");
  }

  let credentials;
  try {
    credentials = JSON.parse(raw);
  } catch {
    throw new Error("GOOGLE_SEARCH_CONSOLE_CREDENTIALS_JSON is not valid JSON");
  }

  if (
    credentials.type !== "service_account" ||
    credentials.project_id !== "keeptxred" ||
    credentials.client_email !== "seo-indexing@keeptxred.iam.gserviceaccount.com" ||
    !credentials.private_key
  ) {
    throw new Error("The configured credential is not the KeepTXRed indexing service account");
  }
  return credentials;
}

async function createAccessToken(credentials) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64Url(
    JSON.stringify({
      iss: credentials.client_email,
      scope: INDEXING_SCOPE,
      aud: TOKEN_ENDPOINT,
      iat: issuedAt,
      exp: issuedAt + 3600,
    }),
  );
  const unsignedToken = `${header}.${claims}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();
  const assertion = `${unsignedToken}.${signer.sign(credentials.private_key, "base64url")}`;

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!response.ok) {
    throw new Error(`Google OAuth token exchange failed with HTTP ${response.status}`);
  }

  const body = await response.json();
  if (!body.access_token) throw new Error("Google OAuth returned no access token");
  return body.access_token;
}

async function main() {
  const request = parseArguments(process.argv.slice(2));
  if (request.dryRun) {
    console.log(
      JSON.stringify({
        dryRun: true,
        endpoint: INDEXING_ENDPOINT,
        url: request.url,
        type: request.type,
      }),
    );
    return;
  }

  const accessToken = await createAccessToken(readCredentials());
  const response = await fetch(INDEXING_ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ url: request.url, type: request.type }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body?.error?.message || "Google returned no error message";
    throw new Error(`Indexing API request failed with HTTP ${response.status}: ${message}`);
  }

  console.log(
    JSON.stringify({
      submitted: true,
      url: request.url,
      type: request.type,
      notifyTime: body?.urlNotificationMetadata?.latestUpdate?.notifyTime ?? null,
    }),
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
