import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { advance, type Job } from "./printify.server";
import { approvedFishingTagRepairs, approvedFishingRepair, matchesTags } from "./fishing-etsy-tag-repairs";
import { digest, PublisherError, Store, type State } from "./store.server";

class TestStore extends Store {
  rows = new Map<string, State<unknown>>();
  writes: unknown[] = [];
  constructor() {
    super({ PRINTIFY_API_TOKEN: "test-token", PRINTIFY_SHOP_ID: "28098650" });
  }
  async get<T>(key: string) {
    const row = this.rows.get(key);
    return row ? structuredClone(row) as State<T> : undefined;
  }
  async insert<T>(key: string, value: T, seconds: number) {
    const row = { key, value: structuredClone(value), version: crypto.randomUUID(), expires_at: new Date(Date.now() + seconds * 1000).toISOString() };
    this.rows.set(key, structuredClone(row));
    return structuredClone(row);
  }
  async replace<T>(state: State<T>, value: T) {
    if (this.rows.get(state.key)?.version !== state.version) throw new PublisherError("conflict", 409);
    const next = { ...state, value: structuredClone(value), version: crypto.randomUUID() };
    this.rows.set(state.key, structuredClone(next));
    return structuredClone(next);
  }
  async rest<T>(path: string, method = "GET", body?: unknown): Promise<T> {
    if (method === "POST") this.writes.push(body);
    return [] as T;
  }
}

describe("one-time owner-approved six-shirt Etsy SEO repair", () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });
  it("locks the allowlist to six unique existing listing/product IDs and exact 13 tags", () => {
    expect(approvedFishingTagRepairs).toHaveLength(6);
    expect(new Set(approvedFishingTagRepairs.map(x => x.etsy)).size).toBe(6);
    expect(new Set(approvedFishingTagRepairs.map(x => x.printify)).size).toBe(6);
    for (const item of approvedFishingTagRepairs) {
      expect(item.tags).toHaveLength(13);
      expect(new Set(item.tags).size).toBe(13);
      expect(item.tags.every(t => t.length >= 1 && t.length <= 20 && !t.startsWith("hp-"))).toBe(true);
      expect(approvedFishingRepair(item.job, item.printify, "28098650", "shirt", "texasdefined")).toBe(item);
      expect(approvedFishingRepair(item.job, "another-product", "28098650", "shirt", "texasdefined")).toBeNull();
      expect(approvedFishingRepair(item.job, item.printify, "another-shop", "shirt", "texasdefined")).toBeNull();
      expect(approvedFishingRepair(item.job, item.printify, "28098650", "sticker", "texasdefined")).toBeNull();
      expect(approvedFishingRepair(item.job, item.printify, "28098650", "shirt", "keeptxred")).toBeNull();
    }
    expect(matchesTags(["one", "two"], ["one", "two"])).toBe(true);
    expect(matchesTags(["two", "one"], ["one", "two"])).toBe(true);
    expect(matchesTags(["two", "extra"], ["one", "two"])).toBe(false);
  });

  it.each(approvedFishingTagRepairs)("repairs existing $job tags without creating products or changing inventory, idempotently", async (plan) => {
    const store = new TestStore();
    const subject = "heartland-owner";
    const marker = "hp-" + (await digest(`${subject}:${plan.job}:shirt`)).slice(0, 16);
    const originalTags = [...plan.tags.slice(0, 12), marker];
    let product = {
      id: plan.printify,
      title: "Approved Fishing Shirt",
      description: "Original approved description",
      blueprint_id: 145,
      print_provider_id: 99,
      images: [{ src: "https://images.printify.com/real-mockup.jpg" }],
      variants: [{ id: 38220, title: "2XL / Black", price: 2800, is_enabled: true }],
      visible: true,
      is_locked: false,
      tags: originalTags,
      external: { id: plan.etsy, handle: `https://www.etsy.com/listing/${plan.etsy}/approved-fishing-shirt` },
    };
    const job: Job = {
      shop_id: "28098650", subject, fingerprint: "approved", artwork_hash: "hash",
      image_id: "existing-image", width: 3800, height: 3800,
      title: "Approved Fishing Shirt", description: product.description,
      tags: plan.tags.slice(0, 12), website: "texasdefined",
      configs: [{
        kind: "shirt",
        config: { blueprint_id: 145, print_provider_id: 99, template_id: "template", variants: [{ id: 38220, price: 2800 }], position: "front", width: 3852, height: 4398 },
      }],
      approval: "approved", approved: true,
      results: [{ kind: "shirt", id: plan.printify, creation: "confirmed", publication: "submitted" }],
      busy_until: 0, verified: false,
    };
    await store.insert(`job:${subject}:${plan.job}`, job, 86400);
    let putCount = 0;
    let publishCount = 0;
    let createCount = 0;
    vi.stubGlobal("fetch", vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = new URL(String(input));
      if (url.hostname === "www.etsy.com") return new Response("not available", { status: 403 });
      if (url.hostname === "texasdefined.com") return new Response(`<html>${plan.printify}</html>`);
      if (!url.hostname.endsWith("printify.com")) throw Error("unexpected host " + url.hostname);
      if (url.pathname.endsWith("/shops.json")) return Response.json([{ id: 28098650, title: "shop", sales_channel: "etsy" }]);
      if (url.pathname.endsWith("/products.json") && init?.method === "POST") { createCount++; throw Error("Must not create"); }
      if (url.pathname.endsWith("/publish.json")) {
        publishCount++;
        const body = JSON.parse(String(init?.body));
        expect(body).toEqual({ title: false, description: false, images: false, variants: false, tags: true, keyFeatures: false, shipping_template: false });
        return Response.json({});
      }
      if (url.pathname.endsWith(`/products/${plan.printify}.json`)) {
        if (init?.method === "PUT") {
          putCount++;
          const body = JSON.parse(String(init.body));
          expect(body).toEqual({ title: product.title, tags: plan.tags });
          product = { ...product, tags: body.tags };
        }
        return Response.json(product);
      }
      throw Error("unexpected Printify URL " + url.pathname);
    }));
    const first = await advance(store, subject, plan.job);
    if (!("results" in first)) throw Error("Expected publication results, not preview/processing");
    if (!first.results) throw Error("Expected nonempty results");
    expect(first.results[0].tag_repair).toBe("publish-submitted");
    expect(product.tags).toEqual(plan.tags);
    expect(product.external.id).toBe(plan.etsy);
    expect(putCount).toBe(1);
    expect(publishCount).toBe(1);
    expect(createCount).toBe(0);
    const second = await advance(store, subject, plan.job);
    if (!("results" in second)) throw Error("Expected publication results, not preview/processing");
    if (!second.results) throw Error("Expected nonempty results");
    expect(second.results[0].tag_repair).toBe("publish-submitted");
    expect(putCount).toBe(1);
    expect(publishCount).toBe(1);
    expect(createCount).toBe(0);
  });
});
