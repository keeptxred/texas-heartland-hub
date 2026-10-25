import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { deflateSync } from "node:zlib";
import { authenticated, CLIENT, ISSUER, oauth, RESOURCE, SCOPE } from "./auth.server";
import {
  advance,
  artworkUrl,
  etsyPageIsLive,
  fitScale,
  pngDimensions,
  prepare,
  Printify,
  type Job,
} from "./printify.server";
import { publisherResponse, tools } from "./mcp.server";
import { bounded, digest, PublisherError, Store, type State } from "./store.server";

class MemoryStore extends Store {
  rows = new Map<string, State<unknown>>();
  products: Record<string, unknown>[] = [];
  constructor() {
    super({
      ADMIN_PASSCODE: "a-private-long-owner-passcode",
      PRINTIFY_API_TOKEN: "test-token",
      PRINTIFY_SHOP_ID: "123",
    });
  }
  async get<T>(key: string) {
    const row = this.rows.get(key);
    return row && Date.parse(row.expires_at) > Date.now()
      ? (structuredClone(row) as State<T>)
      : undefined;
  }
  async insert<T>(key: string, value: T, seconds: number) {
    if (this.rows.has(key)) throw new PublisherError("duplicate", 409);
    const row = {
      key,
      value,
      version: crypto.randomUUID(),
      expires_at: new Date(Date.now() + seconds * 1000).toISOString(),
    };
    this.rows.set(key, structuredClone(row));
    return structuredClone(row);
  }
  async replace<T>(state: State<T>, value: T) {
    if (this.rows.get(state.key)?.version !== state.version)
      throw new PublisherError("conflict", 409);
    const next = { ...state, value, version: crypto.randomUUID() };
    this.rows.set(state.key, structuredClone(next));
    return structuredClone(next);
  }
  async take<T>(key: string) {
    const row = await this.get<T>(key);
    this.rows.delete(key);
    return row;
  }
  async rest<T>(path: string, method = "GET", body?: unknown): Promise<T> {
    if (path.startsWith("publisher_state?expires_at=")) return null as T;
    if (!path.startsWith("products")) throw new Error("unexpected storage path");
    if (method === "POST") this.products = [body as Record<string, unknown>];
    return structuredClone(this.products) as T;
  }
}
it("accepts PostgREST's empty successful cleanup response", async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
  vi.stubGlobal("fetch", fetchMock);
  const persistent = new Store({
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "test-service-key",
  });
  await expect(
    persistent.rest("publisher_state?expires_at=lt.now", "DELETE", undefined, "return=minimal"),
  ).resolves.toBeNull();
  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining("publisher_state?expires_at=lt.now"),
    expect.objectContaining({
      method: "DELETE",
      headers: expect.objectContaining({ Prefer: "return=minimal" }),
    }),
  );
});
function chunk(type: string, data: Buffer) {
  const payload = Buffer.concat([Buffer.from(type), data]);
  let crc = 0xffffffff;
  for (const byte of payload) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  const header = Buffer.alloc(4),
    footer = Buffer.alloc(4);
  header.writeUInt32BE(data.length);
  footer.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
  return Buffer.concat([header, payload, footer]);
}
function png(width = 1000, height = 1000) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(Buffer.alloc((width + 1) * height))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
let store: MemoryStore;
let catalogMissing: boolean,
  loseCreate: boolean,
  failPublish: boolean,
  publicBlocked: boolean,
  channel: string;
let creates: number, publications: number;
let created: Record<string, unknown>[];
const template = {
  id: "template",
  title: "Approved Shirt",
  blueprint_id: 1,
  print_provider_id: 2,
  variants: [{ id: 10, price: 2999, is_enabled: true, title: "Black / M" }],
  print_areas: [{ placeholders: [{ position: "front" }] }],
};
beforeEach(() => {
  store = new MemoryStore();
  catalogMissing = false;
  loseCreate = false;
  failPublish = false;
  publicBlocked = false;
  channel = "etsy";
  creates = 0;
  publications = 0;
  created = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = new URL(input instanceof Request ? input.url : String(input));
      if (url.href === CLIENT)
        return Response.json({
          client_id: CLIENT,
          redirect_uris: ["https://chatgpt.com/connector_platform_oauth_redirect"],
        });
      if (url.hostname.endsWith(".oaiusercontent.com")) return new Response(png());
      if (url.hostname === "www.etsy.com")
        return publicBlocked
          ? new Response("challenge", { status: 403 })
          : new Response(
              '<script type="application/ld+json">{"@type":"Product","name":"Texas design","url":"https://www.etsy.com/listing/999/test","offers":{"price":"29.99","availability":"https://schema.org/InStock"}}</script>',
            );
      if (url.hostname === "keeptxred.com" || url.hostname === "texasdefined.com")
        return new Response("<html>product1 product2</html>");
      const path = url.pathname;
      if (path.endsWith("/shops.json"))
        return Response.json([{ id: 123, title: "My shop", sales_channel: channel }]);
      if (path.endsWith("/blueprints/1.json")) return Response.json({ title: "Cotton T-Shirt" });
      if (path.endsWith("/blueprints/3.json")) return Response.json({ title: "Kiss-Cut Stickers" });
      if (path.endsWith("/variants.json"))
        return Response.json({
          variants: catalogMissing
            ? []
            : [{ id: 10, placeholders: [{ position: "front", width: 1800, height: 1800 }] }],
        });
      if (path.endsWith("/uploads/images.json"))
        return Response.json({ id: "image1", width: 1000, height: 1000 });
      if (path.endsWith("/products/template.json")) return Response.json(template);
      if (path.endsWith("/products/template-sticker.json"))
        return Response.json({ ...template, id: "template-sticker", blueprint_id: 3 });
      if (path.endsWith("/products.json") && init?.method === "POST") {
        creates++;
        const body = JSON.parse(String(init.body));
        const product = {
          ...body,
          id: `product${creates}`,
          images: [{ src: "https://images.printify.com/mockup.png" }],
          visible: false,
        };
        created.push(product);
        if (loseCreate) {
          loseCreate = false;
          throw new Error("response lost after creation");
        }
        return Response.json(product);
      }
      if (path.endsWith("/products.json")) return Response.json({ data: created });
      if (path.endsWith("/publish.json")) {
        publications++;
        if (failPublish) throw new Error("publish response lost");
        const id = path.split("/").at(-2),
          product = created.find((p) => p.id === id)!;
        Object.assign(product, {
          visible: true,
          external: { id: "999", handle: "https://www.etsy.com/listing/999/test" },
        });
        return Response.json({});
      }
      if (/\/products\/product\d+\.json$/.test(path) && init?.method === "PUT") {
        const item = created.find((p) => path.includes(String(p.id)))!;
        const input = JSON.parse(String(init.body));
        expect(input.title).toBe(item.title);
        Object.assign(item, { tags: input.tags });
        return Response.json(item);
      }
      if (/\/products\/product\d+\.json$/.test(path))
        return Response.json(created.find((p) => path.includes(String(p.id)))!);
      throw new Error(`Unexpected mock request: ${url}`);
    }),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
const input = () => ({
  job_id: "approved-art-001",
  artwork: {
    file_id: "file1",
    download_url: "https://files.oaiusercontent.com/art.png?temporary=secret",
    mime_type: "image/png",
  },
  title: "Texas design",
  description: "Approved artwork",
  products: ["shirt"],
  website: "keeptxred",
  artwork_approved: true,
});
async function plan() {
  await new Printify(store).configure("shirt", "template");
  return prepare(store, "owner", input());
}

describe("secure artwork and catalog", () => {
  it("identifies a denied endpoint and bounded upstream error without exposing credentials", async () => {
    const request = vi
      .fn()
      .mockResolvedValue(
        Response.json(
          {
            code: 403,
            message: "Missing scope test-token https://private.example/file?sig=secret",
          },
          { status: 403, headers: { "x-request-id": "upstream-123" } },
        ),
      );
    vi.stubGlobal("fetch", request);
    const api = new Printify(store);
    let message = "";
    try {
      await api.api("/uploads/images.json", "POST", { contents: "private-artwork" });
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toContain("POST /v1/uploads/images.json failed (403)");
    expect(message).toContain("Missing scope");
    expect(message).toContain("upstream-123");
    expect(message).not.toMatch(/test-token|sig=secret|private-artwork/);
    expect(request).toHaveBeenCalledTimes(1);
  });
  it.each([
    ["text/html", "<html>Cloudflare Attention Required</html>", "edge access/challenge"],
    ["application/json", "x".repeat(17000), "body unavailable"],
  ])("preserves endpoint diagnostics for %s errors", async (type, body, detail) => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(body, {
          status: 403,
          headers: { "content-type": type },
        }),
      ),
    );
    await expect(new Printify(store).api("/catalog/blueprints/145.json")).rejects.toThrow(
      new RegExp(`GET /v1/catalog/blueprints/145.json.*403.*${detail}`),
    );
  });
  it("accepts the observed ChatGPT signed storage account while rejecting other Azure accounts", () => {
    const host = "oaisdmntprcentralus.blob.core.windows.net";
    expect(artworkUrl(`https://${host}/private/file.png?sig=test-signature`).hostname).toBe(host);
    for (const url of [
      `https://${host}/private/file.png`,
      "https://untrusted.blob.core.windows.net/private/file.png?sig=test-signature",
      `https://${host}.evil.example/private/file.png?sig=test-signature`,
      `http://${host}/private/file.png?sig=test-signature`,
      `https://user:password@${host}/private/file.png?sig=test-signature`,
    ])
      expect(() => artworkUrl(url)).toThrow(PublisherError);
  });
  it("diagnoses unsupported artwork references without exposing signed queries or paths", () => {
    try {
      artworkUrl("https://example.com/private-artwork.png?signature=secret-value");
      throw new Error("expected artwork reference rejection");
    } catch (error) {
      expect(error).toBeInstanceOf(PublisherError);
      expect((error as Error).message).toContain("scheme=https:, host=example.com");
      expect((error as Error).message).not.toContain("private-artwork.png");
      expect((error as Error).message).not.toContain("secret-value");
    }
    expect(() => artworkUrl("sandbox:/mnt/data/private.png")).toThrow("scheme=sandbox:, host=none");
  });
  it("uses Printify's 50-product page maximum without truncating the catalog", async () => {
    const fetchMock = vi.fn(async (input: string | URL | Request) => {
      const url = new URL(String(input));
      const page = Number(url.searchParams.get("page"));
      expect(url.searchParams.get("limit")).toBe("50");
      expect(url.pathname).toBe("/v1/shops/123/products.json");
      return Response.json({
        data: Array.from({ length: page === 1 ? 50 : 1 }, (_, index) => ({
          id: `${page}-${index}`,
        })),
        last_page: 2,
      });
    });
    vi.stubGlobal("fetch", fetchMock);
    const products = await new Printify(store).products();
    expect(products).toHaveLength(51);
    expect(products[50].id).toBe("2-0");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it("requires available Product offer evidence for the exact Etsy listing", () => {
    const url = "https://www.etsy.com/listing/999/test";
    const page = (availability = "InStock", id = "999") =>
      `<script type="application/ld+json">${JSON.stringify({ "@type": "Product", name: "Texas design", url: `https://www.etsy.com/listing/${id}/test`, offers: { price: 29.99, availability: `https://schema.org/${availability}` } })}</script>`;
    expect(etsyPageIsLive(page(), url)).toBe(true);
    expect(etsyPageIsLive(page("OutOfStock"), url)).toBe(false);
    expect(etsyPageIsLive(page("InStock", "888"), url)).toBe(false);
    expect(etsyPageIsLive("schema.org Organization listing/999 og:type", url)).toBe(false);
    expect(etsyPageIsLive(page() + "This listing is no longer available", url)).toBe(false);
  });
  it.each([
    "http://files.oaiusercontent.com/x",
    "https://evil.example/x",
    "https://files.oaiusercontent.com.evil.example/x",
    "https://user:pass@files.oaiusercontent.com/x",
    "https://files.oaiusercontent.com:444/x",
    "https://127.0.0.1/x",
  ])("rejects unsafe file URL %s", (url) => expect(() => artworkUrl(url)).toThrow());
  it("validates PNG signature, CRC, dimensions and ending", () => {
    expect(pngDimensions(png())).toEqual({ width: 1000, height: 1000 });
    const bad = png();
    bad[25] ^= 1;
    expect(() => pngDimensions(bad)).toThrow("Corrupt");
    expect(() => pngDimensions(png().subarray(0, 40))).toThrow();
    expect(() => pngDimensions(Buffer.from("not a png"))).toThrow();
    expect(() => pngDimensions(png(10, 10))).toThrow("dimensions");
  });
  it("fits portrait and landscape art inside placeholder without cropping", () => {
    expect(fitScale(1000, 2000, 1000, 1000)).toBe(0.5);
    expect(fitScale(2000, 1000, 1000, 1000)).toBe(1);
  });
  it("enforces stream size without trusting content-length", async () => {
    await expect(bounded(new Response("123456"), 3)).rejects.toThrow("too large");
  });
  it("requires live provider variants before saving defaults", async () => {
    catalogMissing = true;
    await expect(new Printify(store).configure("shirt", "template")).rejects.toThrow("unavailable");
    expect(store.rows.size).toBe(0);
  });
  it("rejects kind mismatch and missing artwork approval", async () => {
    await expect(new Printify(store).configure("sticker", "template")).rejects.toThrow("kind");
    await expect(
      prepare(store, "owner", { ...input(), artwork_approved: false }),
    ).rejects.toThrow();
  });
});
describe("durable publication", () => {
  it("publishes exactly 13 SEO tags and removes the recovery marker before Etsy publication", async () => {
    await new Printify(store).configure("shirt", "template");
    const tags = Array.from({ length: 13 }, (_, i) => "texas fishing " + (i + 1));
    const preview = await prepare(store, "owner", { ...input(), tags });
    expect(preview.products).toHaveLength(1);
    expect(creates).toBe(0);
    const result = await advance(store, "owner", preview.job_id, preview.approval_token);
    expect(result).toMatchObject({ verified: true, results: [{ id: "product1" }] });
    expect(created[0].tags).toEqual(tags);
    expect((created[0].tags as string[]).some((tag) => tag.startsWith("hp-"))).toBe(false);
    expect(store.products[0].tags).toEqual(tags);
    await advance(store, "owner", preview.job_id);
    expect(creates).toBe(1);
    expect(publications).toBe(1);
  });
  it("publishes both requested kinds without duplicate products on retry", async () => {
    await new Printify(store).configure("shirt", "template");
    await new Printify(store).configure("sticker", "template-sticker");
    const preview = await prepare(store, "owner", { ...input(), products: ["shirt", "sticker"] });
    expect(await advance(store, "owner", preview.job_id, preview.approval_token)).toMatchObject({
      verified: true,
      results: [{ id: "product1" }, { id: "product2" }],
    });
    await advance(store, "owner", preview.job_id);
    expect(creates).toBe(2);
    expect(publications).toBe(2);
  });
  it("binds checkpoints to the original Printify shop", async () => {
    const preview = await plan();
    store.env.PRINTIFY_SHOP_ID = "999";
    await expect(advance(store, "owner", preview.job_id, preview.approval_token)).rejects.toThrow(
      "another Printify shop",
    );
    expect(creates).toBe(0);
  });
  it("prepares without product mutations and does not persist signed file URLs", async () => {
    const preview = await plan();
    expect(preview.products[0].variants).toEqual([{ id: 10, price: 2999 }]);
    expect(creates).toBe(0);
    expect(publications).toBe(0);
    expect(JSON.stringify([...store.rows.values()])).not.toContain("temporary=secret");
    expect(await prepare(store, "owner", input())).toEqual(preview);
    await expect(prepare(store, "owner", { ...input(), title: "Different" })).rejects.toThrow(
      "different",
    );
  });
  it("requires matching approval and isolates jobs by owner", async () => {
    await plan();
    await expect(advance(store, "other", "approved-art-001", "x")).rejects.toThrow("Unknown");
    await expect(advance(store, "owner", "approved-art-001", "wrong")).rejects.toThrow("Approval");
    await advance(store, "owner", "approved-art-001");
    expect(creates).toBe(0);
  });
  it("creates, publishes, syncs, verifies and returns the same IDs on repeated calls", async () => {
    const preview = await plan();
    const result = await advance(store, "owner", preview.job_id, preview.approval_token);
    expect(result).toMatchObject({
      verified: true,
      results: [{ id: "product1", etsy_verified: true, website_verified: true }],
    });
    expect(store.products[0]).toMatchObject({
      publish_keeptxred: true,
      publish_texasdefined: false,
      keeptxred_category: "shirts",
    });
    await advance(store, "owner", preview.job_id, preview.approval_token);
    expect(creates).toBe(1);
    expect(publications).toBe(1);
  });
  it("serializes concurrent requests before any external creation", async () => {
    const preview = await plan();
    const attempts = await Promise.allSettled([
      advance(store, "owner", preview.job_id, preview.approval_token),
      advance(store, "owner", preview.job_id, preview.approval_token),
    ]);
    expect(attempts.filter((r) => r.status === "fulfilled").length).toBeGreaterThan(0);
    expect(creates).toBe(1);
  });
  it("reconciles a create that succeeded before its response was lost", async () => {
    const preview = await plan();
    loseCreate = true;
    await expect(advance(store, "owner", preview.job_id, preview.approval_token)).rejects.toThrow();
    expect(creates).toBe(1);
    expect(await advance(store, "owner", preview.job_id)).toMatchObject({ verified: true });
    expect(creates).toBe(1);
  });
  it("never repeats a create with unresolved outcome", async () => {
    const preview = await plan();
    loseCreate = true;
    await expect(advance(store, "owner", preview.job_id, preview.approval_token)).rejects.toThrow();
    created = [];
    expect(await advance(store, "owner", preview.job_id)).toMatchObject({
      verified: false,
      results: [{ creation: "attempted" }],
    });
    expect(creates).toBe(1);
  });
  it("never repeats an uncertain publication request", async () => {
    const preview = await plan();
    failPublish = true;
    await expect(advance(store, "owner", preview.job_id, preview.approval_token)).rejects.toThrow();
    failPublish = false;
    expect(await advance(store, "owner", preview.job_id)).toMatchObject({ verified: false });
    expect(publications).toBe(1);
  });
  it("does not claim live for blocked public Etsy checks", async () => {
    const preview = await plan();
    publicBlocked = true;
    expect(await advance(store, "owner", preview.job_id, preview.approval_token)).toMatchObject({
      verified: false,
      results: [{ etsy_verified: false, website_verified: true }],
    });
  });
  it("skips Etsy for a shop on another channel and routes TexasDefined correctly", async () => {
    await new Printify(store).configure("shirt", "template");
    channel = "custom";
    const preview = await prepare(store, "owner", { ...input(), website: "texasdefined" });
    expect(await advance(store, "owner", preview.job_id, preview.approval_token)).toMatchObject({
      results: [{ website_url: "https://texasdefined.com/shop/product/product1" }],
    });
    expect(publications).toBe(0);
    expect(store.products[0]).toMatchObject({
      publish_keeptxred: false,
      publish_texasdefined: true,
    });
  });
  it("stops before product mutation when stock changes after preparation", async () => {
    const preview = await plan();
    catalogMissing = true;
    await expect(advance(store, "owner", preview.job_id, preview.approval_token)).rejects.toThrow(
      "unavailable",
    );
    expect(creates).toBe(0);
  });
});
describe("OAuth and MCP", () => {
  it("rejects revoked token families and rotates refresh tokens once", async () => {
    const credential = await digest(store.env.ADMIN_PASSCODE!);
    await store.insert("session:family1", { active: true }, 3600);
    const session = {
      session_id: "family1",
      subject: "owner",
      client_id: CLIENT,
      resource: RESOURCE,
      scope: SCOPE,
      credential,
    };
    await store.insert(`refresh:${await digest("old-refresh")}`, session, 3600);
    const refreshBody = new URLSearchParams({
      client_id: CLIENT,
      resource: RESOURCE,
      grant_type: "refresh_token",
      refresh_token: "old-refresh",
    });
    const response = await oauth(
      new Request(`${ISSUER}/token`, { method: "POST", body: refreshBody }),
      store,
    );
    const fresh = await response!.json();
    expect(
      await authenticated(
        new Request(RESOURCE, { headers: { Authorization: `Bearer ${fresh.access_token}` } }),
        store,
      ),
    ).toBe("owner");
    await expect(
      oauth(new Request(`${ISSUER}/token`, { method: "POST", body: refreshBody }), store),
    ).rejects.toThrow("invalid_grant");
    await oauth(
      new Request(`${ISSUER}/revoke`, {
        method: "POST",
        body: new URLSearchParams({ token: fresh.refresh_token }),
      }),
      store,
    );
    await expect(
      authenticated(
        new Request(RESOURCE, { headers: { Authorization: `Bearer ${fresh.access_token}` } }),
        store,
      ),
    ).rejects.toThrow();
  });
  it("implements authenticated stateless MCP initialization, discovery, notifications, and method errors", async () => {
    await store.insert("session:family2", { active: true }, 3600);
    await store.insert(
      `access:${await digest("bearer2")}`,
      {
        session_id: "family2",
        subject: "owner",
        client_id: CLIENT,
        resource: RESOURCE,
        scope: SCOPE,
        credential: await digest(store.env.ADMIN_PASSCODE!),
      },
      3600,
    );
    vi.spyOn(Store.prototype, "get").mockImplementation(async function <T>(key: string) {
      return store.get<T>(key);
    });
    const send = (body: unknown) =>
      publisherResponse(
        new Request(RESOURCE, {
          method: "POST",
          headers: {
            Authorization: "Bearer bearer2",
            "Content-Type": "application/json",
            Accept: "application/json, text/event-stream",
          },
          body: JSON.stringify(body),
        }),
        store.env,
      );
    const init = await send({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2025-11-25" },
    });
    expect(await init!.json()).toMatchObject({
      jsonrpc: "2.0",
      id: 1,
      result: { protocolVersion: "2025-11-25", capabilities: { tools: { listChanged: false } } },
    });
    const list = await send({ jsonrpc: "2.0", id: 2, method: "tools/list" });
    expect((await list!.json()).result.tools).toHaveLength(5);
    expect((await send({ jsonrpc: "2.0", method: "notifications/initialized" }))!.status).toBe(202);
    expect(await (await send({ jsonrpc: "2.0", id: 3, method: "missing" }))!.json()).toMatchObject({
      error: { code: -32601 },
    });
  });
  async function authorization() {
    const verifier = "a".repeat(43);
    const params = new URLSearchParams({
      client_id: CLIENT,
      resource: RESOURCE,
      response_type: "code",
      redirect_uri: "https://chatgpt.com/connector_platform_oauth_redirect",
      code_challenge_method: "S256",
      code_challenge: await digest(verifier),
      scope: SCOPE,
      state: "random-state",
    });
    const response = await oauth(new Request(`${ISSUER}/authorize?${params}`), store);
    const html = await response!.text(),
      nonce = html.match(/name="nonce" value="([^"]+)"/)![1];
    return { verifier, nonce, params };
  }
  it("uses a dedicated publisher credential without changing the website login", async () => {
    store.env.ADMIN_PASSCODE = "short-site-passcode";
    store.env.PUBLISHER_LOGIN_SECRET = "a-separate-long-publisher-passcode";
    const metadata = await oauth(
      new Request("https://keeptxred.com/.well-known/oauth-authorization-server/publisher/oauth"),
      store,
    );
    expect(await metadata!.json()).toMatchObject({ owner_authorization_ready: true });
    const { nonce } = await authorization();
    const response = await oauth(
      new Request(`${ISSUER}/authorize`, {
        method: "POST",
        headers: { Origin: "https://keeptxred.com" },
        body: new URLSearchParams({ nonce, passcode: store.env.PUBLISHER_LOGIN_SECRET }),
      }),
      store,
    );
    expect(response!.status).toBe(303);
    expect(store.env.ADMIN_PASSCODE).toBe("short-site-passcode");
  });
  it("publishes exact resource metadata and requires OAuth for MCP", async () => {
    const metadata = await publisherResponse(
      new Request("https://keeptxred.com/.well-known/oauth-protected-resource/api/publisher/mcp"),
      {},
    );
    expect(await metadata!.json()).toMatchObject({
      resource: RESOURCE,
      authorization_servers: [ISSUER],
    });
    const response = await publisherResponse(
      new Request(RESOURCE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      }),
      {},
    );
    expect(response!.status).toBe(401);
    expect(response!.headers.get("www-authenticate")).toContain("resource_metadata");
  });
  it("uses complete file input schema and marks writes honestly", () => {
    const upload = tools.find((t) => t.name === "prepare_products")!;
    expect(upload._meta).toMatchObject({ "openai/fileParams": ["artwork"] });
    expect(upload.annotations.readOnlyHint).toBe(false);
    expect(tools.find((t) => t.name === "check_publication")!.annotations.readOnlyHint).toBe(false);
  });
  it("binds code to PKCE, resource, client and single-use nonce", async () => {
    const { verifier, nonce } = await authorization();
    const consent = new Request(`${ISSUER}/authorize`, {
      method: "POST",
      headers: { Origin: "https://keeptxred.com" },
      body: new URLSearchParams({ nonce, passcode: store.env.ADMIN_PASSCODE! }),
    });
    const redirect = await oauth(consent, store),
      location = new URL(redirect!.headers.get("location")!);
    expect(location.searchParams.get("iss")).toBe(ISSUER);
    const tokenBody = new URLSearchParams({
      grant_type: "authorization_code",
      code: location.searchParams.get("code")!,
      client_id: CLIENT,
      resource: RESOURCE,
      redirect_uri: "https://chatgpt.com/connector_platform_oauth_redirect",
      code_verifier: verifier,
    });
    const response = await oauth(
      new Request(`${ISSUER}/token`, { method: "POST", body: tokenBody }),
      store,
    );
    const session = await response!.json();
    expect(
      await authenticated(
        new Request(RESOURCE, { headers: { Authorization: `Bearer ${session.access_token}` } }),
        store,
      ),
    ).toBe("heartland-owner");
    expect(JSON.stringify([...store.rows.values()])).not.toContain(session.access_token);
    await expect(
      oauth(new Request(`${ISSUER}/token`, { method: "POST", body: tokenBody }), store),
    ).rejects.toThrow("invalid_grant");
    store.env.ADMIN_PASSCODE = "changed-credential-123456789";
    await expect(
      authenticated(
        new Request(RESOURCE, { headers: { Authorization: `Bearer ${session.access_token}` } }),
        store,
      ),
    ).rejects.toThrow();
  });
  it("rejects unregistered redirect, wrong resource and cross-origin consent", async () => {
    const { params, nonce } = await authorization();
    params.set("redirect_uri", "https://evil.example/");
    await expect(oauth(new Request(`${ISSUER}/authorize?${params}`), store)).rejects.toThrow(
      "redirect",
    );
    params.set("resource", "https://evil.example/");
    await expect(oauth(new Request(`${ISSUER}/authorize?${params}`), store)).rejects.toThrow(
      "authorization",
    );
    await expect(
      oauth(
        new Request(`${ISSUER}/authorize`, {
          method: "POST",
          headers: { Origin: "https://evil.example" },
          body: new URLSearchParams({ nonce, passcode: store.env.ADMIN_PASSCODE! }),
        }),
        store,
      ),
    ).rejects.toThrow("origin");
  });
  it("keeps rejecting missing and opaque consent origins", async () => {
    for (const headers of [new Headers(), new Headers({ Origin: "null" })]) {
      await expect(
        oauth(
          new Request(`${ISSUER}/authorize`, {
            method: "POST",
            headers,
            body: "nonce=unused&passcode=unused",
          }),
          store,
        ),
      ).rejects.toThrow("Invalid origin");
    }
  });
  it("rejects expired and wrong-audience bearer tokens", async () => {
    const token = "random-token";
    const row = await store.insert(
      `access:${await digest(token)}`,
      {
        subject: "owner",
        client_id: CLIENT,
        resource: "https://wrong.example",
        scope: SCOPE,
        credential: await digest(store.env.ADMIN_PASSCODE!),
      },
      3600,
    );
    await expect(
      authenticated(
        new Request(RESOURCE, { headers: { Authorization: `Bearer ${token}` } }),
        store,
      ),
    ).rejects.toThrow();
    row.expires_at = new Date(0).toISOString();
    store.rows.set(row.key, row);
    await expect(
      authenticated(
        new Request(RESOURCE, { headers: { Authorization: `Bearer ${token}` } }),
        store,
      ),
    ).rejects.toThrow();
  });
});
