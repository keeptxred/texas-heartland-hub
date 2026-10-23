/** Private service-role storage. Never expose this module to a browser bundle. */
export type PublisherEnv = Record<string, string | undefined>;
export class PublisherError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function environment(raw: unknown): PublisherEnv {
  const result: PublisherEnv = {};
  for (const key of [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "ADMIN_PASSCODE",
    "PUBLISHER_LOGIN_SECRET",
    "PRINTIFY_API_TOKEN",
    "PRINTIFY_SHOP_ID",
  ]) {
    const value = raw && typeof raw === "object" ? Reflect.get(raw, key) : undefined;
    result[key] = typeof value === "string" ? value : process.env[key];
  }
  return result;
}
export function json(value: unknown, status = 200, extra: Record<string, string> = {}) {
  return Response.json(value, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
      ...extra,
    },
  });
}
export async function bounded(response: Response, limit: number): Promise<Uint8Array> {
  if (Number(response.headers.get("content-length")) > limit)
    throw new PublisherError("Payload too large", 413);
  const reader = response.body?.getReader();
  if (!reader) throw new PublisherError("Empty payload");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) throw new PublisherError("Payload too large", 413);
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return bytes;
}
export async function requestJson(request: Request, limit = 16384): Promise<unknown> {
  return JSON.parse(
    new TextDecoder().decode(
      await bounded(new Response(request.body, { headers: request.headers }), limit),
    ),
  );
}
export function randomToken() {
  return crypto.randomUUID() + crypto.randomUUID();
}
export async function digest(value: string | Uint8Array): Promise<string> {
  const input = typeof value === "string" ? new TextEncoder().encode(value) : value;
  const bytes = await crypto.subtle.digest("SHA-256", new Uint8Array(input));
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}
export async function equalSecret(a: string, b: string) {
  const [left, right] = await Promise.all([digest(a), digest(b)]);
  let diff = 0;
  for (let i = 0; i < left.length; i++) diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return diff === 0;
}
export type State<T> = { key: string; value: T; version: string; expires_at: string };
export class Store {
  constructor(public env: PublisherEnv) {}
  async rest<T>(
    path: string,
    method = "GET",
    body?: unknown,
    prefer = "return=representation",
  ): Promise<T> {
    const key = this.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key || !this.env.SUPABASE_URL)
      throw new PublisherError("Publisher storage unavailable", 503);
    const response = await fetch(`${this.env.SUPABASE_URL}/rest/v1/${path}`, {
      method,
      headers: {
        apikey: key,
        ...(!key.startsWith("sb_") ? { Authorization: `Bearer ${key}` } : {}),
        "Content-Type": "application/json",
        Prefer: prefer,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok)
      throw new PublisherError(
        `Publisher storage error (${response.status})`,
        response.status === 409 ? 409 : 503,
      );
    // PostgREST return=minimal succeeds with 204 and no response stream.
    if (response.status === 204) return null as T;
    const text = new TextDecoder().decode(await bounded(response, 4_000_000));
    return (text ? JSON.parse(text) : null) as T;
  }
  async get<T>(key: string): Promise<State<T> | undefined> {
    const rows = await this.rest<State<T>[]>(
      `publisher_state?key=eq.${encodeURIComponent(key)}&expires_at=gt.${encodeURIComponent(new Date().toISOString())}&limit=1`,
    );
    return rows[0];
  }
  async insert<T>(key: string, value: T, seconds: number): Promise<State<T>> {
    const rows = await this.rest<State<T>[]>("publisher_state", "POST", {
      key,
      value,
      version: crypto.randomUUID(),
      expires_at: new Date(Date.now() + seconds * 1000).toISOString(),
    });
    return rows[0];
  }
  async replace<T>(state: State<T>, value: T): Promise<State<T>> {
    const rows = await this.rest<State<T>[]>(
      `publisher_state?key=eq.${encodeURIComponent(state.key)}&version=eq.${state.version}`,
      "PATCH",
      { value, version: crypto.randomUUID() },
    );
    if (rows.length !== 1) throw new PublisherError("Concurrent request; retry status", 409);
    return rows[0];
  }
  async take<T>(key: string): Promise<State<T> | undefined> {
    const rows = await this.rest<State<T>[]>(
      `publisher_state?key=eq.${encodeURIComponent(key)}&expires_at=gt.${encodeURIComponent(new Date().toISOString())}`,
      "DELETE",
    );
    return rows[0];
  }
}
