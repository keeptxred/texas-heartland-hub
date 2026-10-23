import {
  bounded,
  digest,
  equalSecret,
  json,
  PublisherError,
  randomToken,
  Store,
} from "./store.server";

export const ORIGIN = "https://keeptxred.com";
export const ISSUER = `${ORIGIN}/publisher/oauth`;
export const RESOURCE = `${ORIGIN}/api/publisher/mcp`;
export const CLIENT = "https://chatgpt.com/oauth/client.json";
export const SCOPE = "products:publish";
function ownerCredential(store: Store) {
  return store.env.PUBLISHER_LOGIN_SECRET || store.env.ADMIN_PASSCODE;
}
type Grant = {
  client_id: string;
  redirect_uri: string;
  challenge: string;
  resource: string;
  state: string;
  scope: string;
};
type Session = {
  session_id: string;
  subject: string;
  client_id: string;
  resource: string;
  scope: string;
  credential: string;
};

export async function authenticated(request: Request, store: Store): Promise<string> {
  const token = request.headers.get("authorization")?.match(/^Bearer (\S+)$/i)?.[1];
  if (!token || token.length > 512) throw new PublisherError("Authentication required", 401);
  const session = await store.get<Session>(`access:${await digest(token)}`);
  if (
    !session ||
    session.value.client_id !== CLIENT ||
    session.value.resource !== RESOURCE ||
    session.value.scope !== SCOPE ||
    !ownerCredential(store) ||
    session.value.credential !== (await digest(ownerCredential(store)!))
  ) {
    throw new PublisherError("Authentication required", 401);
  }
  if (!(await store.get(`session:${session.value.session_id}`)))
    throw new PublisherError("Authentication required", 401);
  return session.value.subject;
}
async function tokens(store: Store, session: Session) {
  const access = randomToken(),
    refresh = randomToken();
  await store.insert(`access:${await digest(access)}`, session, 3600);
  await store.insert(`refresh:${await digest(refresh)}`, session, 2592000);
  return json({
    access_token: access,
    token_type: "Bearer",
    expires_in: 3600,
    refresh_token: refresh,
    scope: SCOPE,
  });
}
async function form(request: Request) {
  const text = new TextDecoder().decode(
    await bounded(new Response(request.body, { headers: request.headers }), 8192),
  );
  return new URLSearchParams(text);
}
const htmlHeaders = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  // Preserve Origin on this same-origin HTML form POST; suppress cross-site referrers.
  "Referrer-Policy": "same-origin",
  "Content-Security-Policy":
    "default-src 'none'; form-action 'self' https://chatgpt.com/connector_platform_oauth_redirect; frame-ancestors 'none'; base-uri 'none'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-Robots-Tag": "noindex",
};
async function budget(request: Request, store: Store, purpose: string, count: number) {
  const source = await digest(request.headers.get("cf-connecting-ip") ?? "unknown");
  for (let slot = 0; slot < count; slot++) {
    try {
      await store.insert(
        `${purpose}:${source}:${Math.floor(Date.now() / 900000)}:${slot}`,
        {},
        1800,
      );
      return;
    } catch (error) {
      if (!(error instanceof PublisherError) || error.status !== 409) throw error;
    }
  }
  throw new PublisherError("Too many authorization attempts. Try again in 15 minutes.", 429);
}
async function validateGrant(params: URLSearchParams): Promise<Grant> {
  const grant = {
    client_id: params.get("client_id") ?? "",
    redirect_uri: params.get("redirect_uri") ?? "",
    challenge: params.get("code_challenge") ?? "",
    resource: params.get("resource") ?? "",
    state: params.get("state") ?? "",
    scope: params.get("scope") ?? "",
  };
  if (
    params.get("response_type") !== "code" ||
    params.get("code_challenge_method") !== "S256" ||
    grant.client_id !== CLIENT ||
    grant.resource !== RESOURCE ||
    grant.scope !== SCOPE ||
    !/^[A-Za-z0-9_-]{43}$/.test(grant.challenge) ||
    !grant.state ||
    grant.state.length > 1024
  )
    throw new PublisherError("Invalid authorization request");
  // Fetch only the pinned ChatGPT CIMD URL; caller-controlled URLs are never fetched.
  const response = await fetch(CLIENT, { redirect: "manual", signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new PublisherError("ChatGPT client metadata unavailable", 503);
  const metadata = JSON.parse(new TextDecoder().decode(await bounded(response, 32768))) as {
    client_id?: string;
    redirect_uris?: string[];
  };
  if (
    metadata.client_id !== CLIENT ||
    !metadata.redirect_uris?.includes(grant.redirect_uri) ||
    ![
      "https://chatgpt.com/connector_platform_oauth_redirect",
      "https://chatgpt.com/connector/oauth/",
    ].some(
      (value) =>
        grant.redirect_uri === value ||
        (value.endsWith("/") && grant.redirect_uri.startsWith(value)),
    )
  )
    throw new PublisherError("Unregistered redirect URI");
  return grant;
}
export async function oauth(request: Request, store: Store): Promise<Response | null> {
  const url = new URL(request.url),
    path = url.pathname;
  if (
    path === "/.well-known/oauth-protected-resource/api/publisher/mcp" ||
    path === "/.well-known/oauth-protected-resource"
  ) {
    return json({
      resource: RESOURCE,
      authorization_servers: [ISSUER],
      scopes_supported: [SCOPE],
      bearer_methods_supported: ["header"],
    });
  }
  if (
    path === "/.well-known/oauth-authorization-server/publisher/oauth" ||
    path === "/publisher/oauth/.well-known/oauth-authorization-server"
  ) {
    return json({
      issuer: ISSUER,
      authorization_endpoint: `${ISSUER}/authorize`,
      token_endpoint: `${ISSUER}/token`,
      revocation_endpoint: `${ISSUER}/revoke`,
      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code", "refresh_token"],
      code_challenge_methods_supported: ["S256"],
      token_endpoint_auth_methods_supported: ["none"],
      scopes_supported: [SCOPE],
      client_id_metadata_document_supported: true,
      authorization_response_iss_parameter_supported: true,
      owner_authorization_ready: Boolean(
        ownerCredential(store) && ownerCredential(store)!.length >= 16,
      ),
    });
  }
  if (!path.startsWith("/publisher/oauth/")) return null;
  const credential = ownerCredential(store);
  if (!credential || credential.length < 16)
    throw new PublisherError(
      "Publisher sign-in needs a dedicated passcode of at least 16 characters",
      503,
    );
  if (path === "/publisher/oauth/authorize" && request.method === "GET") {
    await budget(request, store, "authorize", 20);
    await store.rest(
      `publisher_state?expires_at=lt.${encodeURIComponent(new Date().toISOString())}`,
      "DELETE",
      undefined,
      "return=minimal",
    );
    const grant = await validateGrant(url.searchParams);
    const nonce = randomToken();
    await store.insert(`consent:${await digest(nonce)}`, grant, 600);
    return new Response(
      `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Connect Heartland Publisher</title><main><h1>Connect Heartland Publisher to ChatGPT</h1><p>This private connection can upload approved artwork, create Printify products, publish eligible Etsy listings, and assign your website store. Publishing requires your explicit approval in the conversation.</p><form method="post" action="/publisher/oauth/authorize"><input type="hidden" name="nonce" value="${nonce}"><label>Publisher passcode <input type="password" name="passcode" autocomplete="current-password" required maxlength="512"></label><button type="submit">Authorize ChatGPT</button></form><p>Close this page to cancel. Credentials stay on KeepTXRed.com.</p></main></html>`,
      { headers: htmlHeaders },
    );
  }
  if (path === "/publisher/oauth/authorize" && request.method === "POST") {
    if (request.headers.get("origin") !== ORIGIN) throw new PublisherError("Invalid origin", 403);
    const data = await form(request);
    const nonce = data.get("nonce") ?? "";
    const grant = await store.take<Grant>(`consent:${await digest(nonce)}`);
    if (!grant) throw new PublisherError("Authorization expired; start connection again");
    // Persistent, race-safe five-attempt budget per source IP and 15-minute window.
    await budget(request, store, "login", 5);
    if (!(await equalSecret(data.get("passcode") ?? "", credential)))
      throw new PublisherError("Invalid publisher passcode", 403);
    const code = randomToken();
    await store.insert(`code:${await digest(code)}`, grant.value, 120);
    const redirect = new URL(grant.value.redirect_uri);
    redirect.searchParams.set("code", code);
    redirect.searchParams.set("state", grant.value.state);
    redirect.searchParams.set("iss", ISSUER);
    return new Response(null, {
      status: 303,
      headers: {
        Location: redirect.toString(),
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
      },
    });
  }
  if (path === "/publisher/oauth/token" && request.method === "POST") {
    const data = await form(request);
    if (data.get("client_id") !== CLIENT || data.get("resource") !== RESOURCE)
      throw new PublisherError("Invalid client or resource");
    if (data.get("grant_type") === "refresh_token") {
      const session = await store.take<Session>(
        `refresh:${await digest(data.get("refresh_token") ?? "")}`,
      );
      if (
        !session ||
        session.value.credential !== (await digest(credential)) ||
        !(await store.get(`session:${session.value.session_id}`))
      )
        throw new PublisherError("invalid_grant");
      return tokens(store, session.value);
    }
    if (data.get("grant_type") !== "authorization_code")
      throw new PublisherError("unsupported_grant_type");
    const grant = await store.take<Grant>(`code:${await digest(data.get("code") ?? "")}`);
    const verifier = data.get("code_verifier") ?? "";
    if (
      !grant ||
      !/^[A-Za-z0-9._~-]{43,128}$/.test(verifier) ||
      grant.value.challenge !== (await digest(verifier)) ||
      grant.value.redirect_uri !== data.get("redirect_uri")
    )
      throw new PublisherError("invalid_grant");
    const sessionId = crypto.randomUUID();
    await store.insert(`session:${sessionId}`, { active: true }, 2592000);
    return tokens(store, {
      session_id: sessionId,
      subject: "heartland-owner",
      client_id: CLIENT,
      resource: RESOURCE,
      scope: SCOPE,
      credential: await digest(credential),
    });
  }
  if (path === "/publisher/oauth/revoke" && request.method === "POST") {
    const data = await form(request),
      hash = await digest(data.get("token") ?? "");
    const session =
      (await store.take<Session>(`access:${hash}`)) ??
      (await store.take<Session>(`refresh:${hash}`));
    if (session) await store.take(`session:${session.value.session_id}`);
    return json({});
  }
  return json({ error: "Method or endpoint not supported" }, 405);
}
