import { afterEach, describe, expect, it, vi } from "vitest";
import { advance, type Job } from "./printify.server";
import { approvedFishingTagRepairs } from "./fishing-etsy-tag-repairs";
import { approvedFishingDescription, fishingAiDisclosure, requiredFishingDescription } from "./fishing-etsy-description-repairs";
import { PublisherError, Store, type State } from "./store.server";

class TestStore extends Store {
  rows = new Map<string, State<unknown>>();
  constructor() { super({ PRINTIFY_API_TOKEN: "test-token", PRINTIFY_SHOP_ID: "28098650" }); }
  async get<T>(key: string) { const item = this.rows.get(key); return item ? structuredClone(item) as State<T> : undefined; }
  async insert<T>(key: string, value: T, seconds: number) {
    const row = { key, value: structuredClone(value), version: crypto.randomUUID(), expires_at: new Date(Date.now() + seconds * 1000).toISOString() };
    this.rows.set(key, structuredClone(row));
    return structuredClone(row);
  }
  async replace<T>(old: State<T>, value: T) {
    if (this.rows.get(old.key)?.version !== old.version) throw new PublisherError("Stale checkpoint", 409);
    const next = { ...old, value: structuredClone(value), version: crypto.randomUUID() };
    this.rows.set(old.key, structuredClone(next));
    return structuredClone(next);
  }
  async rest<T>() { return [] as T; }
}

describe("existing fishing Etsy AI disclosure and copy repair", () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });
  it("blocks drift and duplicates; repairs only the known double-escaped apostrophe", () => {
    const plans = approvedFishingTagRepairs;
    expect(plans).toHaveLength(6);
    for (const p of plans) {
      const x = approvedFishingDescription(p.job, p.printify, p.etsy);
      expect(x?.lead).toBeTruthy();
      expect(approvedFishingDescription(p.job, "wrong-product", p.etsy)).toBeNull();
      expect(approvedFishingDescription(p.job, p.printify, "wrong-listing")).toBeNull();
      const text = x!.lead + " and the originally approved fishing copy ".repeat(6);
      const after = requiredFishingDescription(text, x!.lead)!;
      expect(after).toContain(fishingAiDisclosure);
      expect(after.split(fishingAiDisclosure)).toHaveLength(2);
      expect(requiredFishingDescription(after, x!.lead)).toBe(after);
      expect(requiredFishingDescription("Changed description not approved".repeat(10), x!.lead)).toBeNull();
    }
    expect(requiredFishingDescription(
      "The water is still, the sun is just clearing the trees and it&amp;#39;s time for the first cast." + " Fishing art.".repeat(8),
      plans[4] ? approvedFishingDescription(plans[4].job, plans[4].printify, plans[4].etsy)!.lead : "",
    )).toContain("it's time for the first cast");
  });

  it.each(approvedFishingTagRepairs)("publishes description only once for existing $job, never alters listing, tags, prices or variants", async (plan) => {
    const store = new TestStore();
    const subject = "heartland-owner";
    const lead = approvedFishingDescription(plan.job, plan.printify, plan.etsy)!.lead;
    let product = {
      id: plan.printify,
      title: "Existing approved fishing T-shirt",
      description: lead + " in the original listing description.".repeat(7),
      tags: [...plan.tags],
      blueprint_id: 145,
      print_provider_id: 99,
      images: [{ src: "https://images.printify.com/mockup.jpg" }],
      variants: [{ id: 38220, title: "XL / Black", price: 2800, is_enabled: true }],
      is_locked: false,
      visible: true,
      external: { id: plan.etsy, handle: `https://www.etsy.com/listing/${plan.etsy}/shirt` },
    };
    const job: Job = {
      shop_id: "28098650", subject, fingerprint: "approved", artwork_hash: "verified",
      image_id: "existing-image", width: 3800, height: 3800,
      title: product.title, description: product.description,
      tags: plan.tags.slice(0, 12), website: "texasdefined",
      configs: [{ kind: "shirt", config: {
        blueprint_id: 145, print_provider_id: 99, template_id: "template",
        variants: [{ id: 38220, price: 2800 }], position: "front", width: 3852, height: 4398,
      } }],
      approval: "approved", approved: true,
      results: [{ kind: "shirt", id: plan.printify, creation: "confirmed", publication: "submitted", tag_repair: "publish-submitted" }],
      busy_until: 0, verified: false,
    };
    await store.insert(`job:${subject}:${plan.job}`, job, 86400);
    let puts = 0, publish = 0, creates = 0;
    vi.stubGlobal("fetch", vi.fn(async (arg: string | URL | Request, init?: RequestInit) => {
      const url = new URL(String(arg));
      if (url.hostname === "www.etsy.com") return new Response("edge challenge", { status: 403 });
      if (url.hostname === "texasdefined.com") return new Response(`<html>${plan.printify}</html>`);
      if (!url.hostname.endsWith("printify.com")) throw new Error("Unexpected domain " + url.hostname);
      if (url.pathname.endsWith("/shops.json"))
        return Response.json([{ id: 28098650, title: "Printify", sales_channel: "etsy" }]);
      if (url.pathname.endsWith("/products.json")) {
        creates++;
        throw new Error("Duplicate product creation prohibited");
      }
      if (url.pathname.endsWith("/publish.json")) {
        publish++;
        expect(JSON.parse(String(init?.body))).toEqual({
          title: false, description: true, images: false, variants: false,
          tags: false, keyFeatures: false, shipping_template: false,
        });
        return Response.json({});
      }
      if (url.pathname.endsWith(`/products/${plan.printify}.json`)) {
        if (init?.method === "PUT") {
          puts++;
          const body = JSON.parse(String(init.body));
          expect(Object.keys(body).sort()).toEqual(["description", "title"]);
          expect(body.title).toBe(product.title);
          expect(body.description).toContain(fishingAiDisclosure);
          product = { ...product, description: body.description };
        }
        return Response.json(product);
      }
      throw new Error("Unexpected Printify path " + url.pathname);
    }));
    const once = await advance(store, subject, plan.job);
    expect("results" in once && once.results?.[0]?.description_repair).toBe("publish-submitted");
    expect(product.description).toContain(fishingAiDisclosure);
    expect(product.tags).toEqual(plan.tags);
    expect(product.variants[0].price).toBe(2800);
    expect(product.external.id).toBe(plan.etsy);
    expect(puts).toBe(1);
    expect(publish).toBe(1);
    expect(creates).toBe(0);
    const twice = await advance(store, subject, plan.job);
    expect("results" in twice && twice.results?.[0]?.description_repair).toBe("publish-submitted");
    expect(puts).toBe(1);
    expect(publish).toBe(1);
    expect(creates).toBe(0);
  });
});
