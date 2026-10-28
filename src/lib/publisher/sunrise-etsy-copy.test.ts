import { afterEach, expect, it, vi } from "vitest";
import { advance, type Job } from "./printify.server";
import { approvedFishingTagRepairs } from "./fishing-etsy-tag-repairs";
import { fishingAiDisclosure } from "./fishing-etsy-description-repairs";
import { PublisherError, Store, type State } from "./store.server";

class TestStore extends Store {
  rows = new Map<string, State<unknown>>();
  constructor() { super({ PRINTIFY_API_TOKEN: "test-token", PRINTIFY_SHOP_ID: "28098650" }); }
  async get<T>(key: string) { const r = this.rows.get(key); return r ? structuredClone(r) as State<T> : undefined; }
  async insert<T>(key: string, value: T, seconds: number) {
    const row = { key, value: structuredClone(value), version: crypto.randomUUID(), expires_at: new Date(Date.now() + seconds * 1000).toISOString() };
    this.rows.set(key, structuredClone(row));
    return structuredClone(row);
  }
  async replace<T>(old: State<T>, value: T) {
    if (this.rows.get(old.key)?.version !== old.version) throw new PublisherError("conflict", 409);
    const row = { ...old, value: structuredClone(value), version: crypto.randomUUID() };
    this.rows.set(row.key, structuredClone(row));
    return structuredClone(row);
  }
  async rest<T>() { return [] as T; }
}
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

it("replaces double-escaped Sunrise entity with clear text on only existing Etsy ID, publishing description once", async () => {
  const plan = approvedFishingTagRepairs.find((p) => p.job === "TDFISH2026P1_05")!;
  const oldSentence = "The water is still, the sun is just clearing the trees and it&amp;amp;#39;s time for the first cast.";
  const newSentence = "The water is still, the sun is just clearing the trees, and the first cast is ready.";
  let product = {
    id: plan.printify, title: "Sunrise Cast Fishing T-Shirt",
    description: oldSentence + "\n\nA calm Texas fishing shirt.\n\n" + fishingAiDisclosure,
    tags: [...plan.tags], blueprint_id: 145, print_provider_id: 99,
    variants: [{ id: 38220, price: 2800, title: "XL / Black", is_enabled: true }],
    images: [{ src: "https://images.printify.com/mockup.jpg" }],
    visible: true, is_locked: false,
    external: { id: plan.etsy, handle: `https://www.etsy.com/listing/${plan.etsy}/sunrise-cast` },
  };
  const subject = "heartland-owner", store = new TestStore();
  const job: Job = {
    shop_id: "28098650", subject, fingerprint: "approved", artwork_hash: "hash",
    image_id: "already-existing-image", width: 3800, height: 3800,
    title: product.title, description: product.description, tags: plan.tags.slice(0,12),
    website: "texasdefined", configs: [{ kind: "shirt", config: {
      blueprint_id:145, print_provider_id:99, variants:[{id:38220,price:2800}],
      template_id:"existing", position:"front",width:3852,height:4398,
    } }], approval: "approved", approved: true, busy_until: 0, verified: false,
    results: [{ kind:"shirt",id:plan.printify,creation:"confirmed",publication:"submitted",
      tag_repair:"publish-submitted",description_repair:"publish-submitted" }],
  };
  await store.insert(`job:${subject}:${plan.job}`,job,86400);
  let putCount=0,publishCount=0,createCount=0;
  vi.stubGlobal("fetch",vi.fn(async (arg:string|URL|Request, init?:RequestInit) => {
    const u = new URL(String(arg));
    if (u.hostname==="www.etsy.com") return new Response("challenge",{status:403});
    if (u.hostname==="texasdefined.com") return new Response(`<html>${plan.printify}</html>`);
    if (!u.hostname.endsWith("printify.com")) throw Error("unexpected host");
    if (u.pathname.endsWith("/shops.json")) return Response.json([{id:28098650,title:"Shop",sales_channel:"etsy"}]);
    if (u.pathname.endsWith("/products.json")) {createCount++; throw Error("must not create");}
    if (u.pathname.endsWith("/publish.json")) {
      publishCount++;
      expect(JSON.parse(String(init?.body))).toEqual({title:false,description:true,images:false,variants:false,tags:false,keyFeatures:false,shipping_template:false});
      return Response.json({});
    }
    if (u.pathname.endsWith(`/products/${plan.printify}.json`)) {
      if (init?.method==="PUT") {
        putCount++;
        const body=JSON.parse(String(init.body));
        expect(Object.keys(body).sort()).toEqual(["description","title"]);
        expect(body.description.startsWith(newSentence)).toBe(true);
        expect(body.description).not.toMatch(/&amp;#39;|&amp;amp;#39;/);
        expect(body.description).toContain(fishingAiDisclosure);
        product={...product,description:body.description};
      }
      return Response.json(product);
    }
    throw Error("unexpected path "+u.pathname);
  }));
  const first=await advance(store,subject,plan.job);
  expect("results" in first && first.results?.[0]?.sunrise_copy_fix).toBe("publish-submitted");
  expect(product.description.startsWith(newSentence)).toBe(true);
  expect(product.variants[0].price).toBe(2800);
  expect(product.tags).toEqual(plan.tags);
  expect(product.external.id).toBe(plan.etsy);
  expect({putCount,publishCount,createCount}).toEqual({putCount:1,publishCount:1,createCount:0});
  const second=await advance(store,subject,plan.job);
  expect("results" in second && second.results?.[0]?.sunrise_copy_fix).toBe("publish-submitted");
  expect({putCount,publishCount,createCount}).toEqual({putCount:1,publishCount:1,createCount:0});
});
