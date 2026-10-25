import { Buffer } from "node:buffer";
import { z } from "zod";
import { mapProduct, type PrintifyProduct } from "../printify-sync-product";
import { bounded, digest, PublisherError, Store } from "./store.server";
import { approvedFishingRepair, matchesTags } from "./fishing-etsy-tag-repairs";

export const kindSchema = z.enum(["shirt", "sticker"]);
export const websiteSchema = z.enum(["keeptxred", "texasdefined", "none"]);
export const fileSchema = z
  .object({
    download_url: z.string().url().max(8192),
    file_id: z.string().min(1).max(256),
    mime_type: z.string().optional(),
    file_name: z.string().optional(),
  })
  .strict();
export const prepareSchema = z
  .object({
    job_id: z.string().regex(/^[A-Za-z0-9_-]{8,64}$/),
    artwork: fileSchema,
    title: z.string().min(1).max(125),
    description: z.string().min(1).max(10000),
    tags: z.array(z.string().min(1).max(20)).max(13)
      .refine((tags) => new Set(tags.map((tag) => tag.trim().toLowerCase())).size === tags.length, "Etsy SEO tags must be unique")
      .default([]),
    products: z
      .array(kindSchema)
      .min(1)
      .max(2)
      .refine((v) => new Set(v).size === v.length),
    website: websiteSchema,
    artwork_approved: z.literal(true),
  })
  .strict();
type Kind = z.infer<typeof kindSchema>;
type Variant = { id: number; price: number; is_enabled: boolean; title?: string };
type Placeholder = { position: string; width: number; height: number };
type Catalog = { variants: { id: number; placeholders: Placeholder[] }[] };
type Product = PrintifyProduct & {
  blueprint_id: number;
  print_provider_id: number;
  variants: Variant[];
  print_areas?: { placeholders: { position: string; decoration_method?: string }[] }[];
  is_locked?: boolean;
  external?: { id?: string; handle?: string };
};
type Config = {
  blueprint_id: number;
  print_provider_id: number;
  variants: { id: number; price: number }[];
  position: string;
  decoration_method?: string;
  template_id: string;
  width: number;
  height: number;
};
type Result = {
  kind: Kind;
  id?: string;
  creation?: "attempted" | "confirmed";
  publication?: "attempted" | "submitted";
  etsy_url?: string;
  etsy_verified?: boolean;
  website_url?: string;
  website_verified?: boolean;
  issue?: string;
  /** Durable checkpoint for owner-approved existing-listing tag updates. */
  tag_repair?: "put-attempted" | "printify-updated" | "publish-attempted" | "publish-submitted";
};
export type Job = {
  shop_id: string;
  subject: string;
  fingerprint: string;
  artwork_hash: string;
  image_id: string;
  width: number;
  height: number;
  title: string;
  description: string;
  tags: string[];
  website: z.infer<typeof websiteSchema>;
  configs: { kind: Kind; config: Config }[];
  approval: string;
  approved: boolean;
  results: Result[];
  busy_until: number;
  verified: boolean;
};
const permanent = 10 * 365 * 86400;
export class Printify {
  constructor(public store: Store) {}
  async api<T>(path: string, method = "GET", body?: unknown): Promise<T> {
    const token = this.store.env.PRINTIFY_API_TOKEN;
    if (!token) throw new PublisherError("Printify is not configured", 503);
    const response = await fetch(`https://api.printify.com/v1${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "Heartland-Publisher/2.0",
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(45000),
    });
    if (!response.ok) {
      // Only expose bounded upstream error fields; never echo request data or credentials.
      const clean = (value: unknown) =>
        String(value ?? "")
          .replaceAll(token, "[redacted]")
          .replace(/https?:\/\/[^\s"<>]+/gi, "[url redacted]")
          .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
          .replace(/[^\u0020-\u007e]/g, " ")
          .slice(0, 400);
      let detail = "upstream error body unavailable";
      try {
        const raw = new TextDecoder().decode(await bounded(response, 16384));
        if (response.headers.get("content-type")?.includes("json")) {
          const error = JSON.parse(raw);
          detail = JSON.stringify({
            code: clean(error.code ?? error.error?.code),
            message: clean(error.message ?? error.error?.message ?? error.error),
          });
        } else {
          detail = /cloudflare|attention required|just a moment/i.test(raw)
            ? "non-JSON edge access/challenge response"
            : "non-JSON upstream response (body omitted)";
        }
      } catch {
        // A malformed/oversized error must not hide the endpoint and HTTP status.
      }
      throw new PublisherError(
        `Printify ${method} /v1${path.split("?")[0]} failed (${response.status}); content_type=${clean(response.headers.get("content-type"))}; request_id=${clean(response.headers.get("x-request-id"))}; cf_ray=${clean(response.headers.get("cf-ray"))}; ${detail}; no automatic mutation retry`,
        502,
      );
    }
    const text = new TextDecoder().decode(await bounded(response, 12_000_000));
    return (text ? JSON.parse(text) : null) as T;
  }
  get shop() {
    const shop = this.store.env.PRINTIFY_SHOP_ID;
    if (!shop || !/^\d+$/.test(shop))
      throw new PublisherError("Explicit Printify shop required", 503);
    return shop;
  }
  async channel() {
    const shops =
      await this.api<{ id: number; title: string; sales_channel: string }[]>("/shops.json");
    const shop = shops.find((s) => String(s.id) === this.shop);
    if (!shop) throw new PublisherError("Configured Printify shop is not accessible", 503);
    return shop;
  }
  async products(): Promise<Product[]> {
    const products: Product[] = [];
    for (let page = 1; page <= 400; page++) {
      const data = await this.api<{ data: Product[]; last_page?: number }>(
        `/shops/${this.shop}/products.json?limit=50&page=${page}`,
      );
      products.push(...data.data);
      if (data.data.length < 50 || (data.last_page && page >= data.last_page)) return products;
    }
    throw new PublisherError(
      "Catalog exceeds reconciliation limit; manual reconciliation required",
      409,
    );
  }
  product(id: string) {
    return this.api<Product>(`/shops/${this.shop}/products/${encodeURIComponent(id)}.json`);
  }
  async catalog(config: Config) {
    const catalog = await this.api<Catalog>(
      `/catalog/blueprints/${config.blueprint_id}/print_providers/${config.print_provider_id}/variants.json`,
    );
    const placeholders = config.variants.map((v) =>
      catalog.variants
        .find((c) => c.id === v.id)
        ?.placeholders.find((p) => p.position === config.position),
    );
    if (!placeholders.length || placeholders.some((p) => !p || !(p.width > 0) || !(p.height > 0)))
      throw new PublisherError(
        "Configured variants or print position unavailable; reconfigure product",
        409,
      );
    return {
      width: Math.max(...placeholders.map((p) => p!.width)),
      height: Math.max(...placeholders.map((p) => p!.height)),
    };
  }
  async configure(kind: Kind, templateId: string) {
    const product = await this.product(templateId);
    const blueprint = await this.api<{ title: string }>(
      `/catalog/blueprints/${product.blueprint_id}.json`,
    );
    if (
      !(kind === "shirt" ? /\b(?:t[- ]?shirt|shirt|tee)\b/i : /\bstickers?\b/i).test(
        blueprint.title,
      )
    )
      throw new PublisherError("Template blueprint does not match requested product kind");
    const placeholders = product.print_areas?.flatMap((a) => a.placeholders) ?? [];
    const position =
      placeholders.find((p) => p.position === "front") ??
      (kind === "sticker" ? placeholders[0] : undefined);
    if (!position)
      throw new PublisherError("Template requires an explicit supported print position");
    const variants = product.variants
      .filter((v) => v.is_enabled)
      .map((v) => ({ id: v.id, price: v.price }));
    if (
      !variants.length ||
      variants.some(
        (v) =>
          !Number.isInteger(v.price) ||
          v.price < 100 ||
          v.price > 100000 ||
          !Number.isInteger(v.id),
      )
    )
      throw new PublisherError("Invalid enabled template variants/prices");
    const config: Config = {
      blueprint_id: product.blueprint_id,
      print_provider_id: product.print_provider_id,
      variants,
      position: position.position,
      ...(position.decoration_method ? { decoration_method: position.decoration_method } : {}),
      template_id: templateId,
      width: 0,
      height: 0,
    };
    Object.assign(config, await this.catalog(config));
    const key = `config:${kind}`,
      existing = await this.store.get<Config>(key);
    if (existing) await this.store.replace(existing, config);
    else await this.store.insert(key, config, permanent);
    return { kind, ...config };
  }
  async overview() {
    const shop = await this.channel();
    const configs = await Promise.all(
      ["shirt", "sticker"].map(async (kind) => ({
        kind,
        config: (await this.store.get<Config>(`config:${kind}`))?.value ?? null,
      })),
    );
    const products = await this.products();
    return {
      shop,
      configurations: configs,
      templates: products
        .filter((p) => /shirt|tee|sticker/i.test(p.title))
        .map((p) => ({
          id: p.id,
          title: p.title,
          blueprint_id: p.blueprint_id,
          print_provider_id: p.print_provider_id,
          enabled_variants: p.variants.filter((v) => v.is_enabled).length,
        })),
      instructions:
        "Configure each kind from an existing approved product template. Prices and enabled variants are copied, then checked against the current provider catalog.",
    };
  }
}
export function artworkUrl(raw: string) {
  const url = new URL(raw);
  const openAiContent =
    url.hostname === "files.oaiusercontent.com" || url.hostname.endsWith(".oaiusercontent.com");
  // Observed from ChatGPT's resolved file-param transfer. Pin the storage account,
  // not Azure's shared domain, and require its signed read URL.
  const openAiSignedBlob =
    url.hostname === "oaisdmntprcentralus.blob.core.windows.net" &&
    Boolean(url.searchParams.get("sig"));
  if (
    url.protocol !== "https:" ||
    url.port ||
    url.username ||
    url.password ||
    url.hash ||
    !(openAiContent || openAiSignedBlob)
  )
    throw new PublisherError(
      `Artwork must use a temporary ChatGPT file URL (received scheme=${url.protocol.replace(/[^a-zA-Z:-]/g, "").slice(0, 32)}, host=${url.hostname.replace(/[^a-zA-Z0-9.:-]/g, "").slice(0, 253) || "none"}). Signed URLs and local paths are not included in diagnostics.`,
    );
  return url;
}
export function pngDimensions(bytes: Uint8Array) {
  if (bytes.length < 45 || ![137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v))
    throw new PublisherError("Print-ready PNG artwork required");
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const width = view.getUint32(16),
    height = view.getUint32(20);
  if (
    view.getUint32(8) !== 13 ||
    new TextDecoder().decode(bytes.slice(12, 16)) !== "IHDR" ||
    width < 300 ||
    height < 300 ||
    width * height > 40_000_000 ||
    width > 12000 ||
    height > 12000
  )
    throw new PublisherError("PNG dimensions outside supported range");
  let offset = 8,
    end = false;
  while (offset + 12 <= bytes.length) {
    const length = view.getUint32(offset),
      type = new TextDecoder().decode(bytes.slice(offset + 4, offset + 8));
    if (length > bytes.length - offset - 12) throw new PublisherError("Truncated PNG");
    let crc = 0xffffffff;
    for (let i = offset + 4; i < offset + 8 + length; i++) {
      crc ^= bytes[i];
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
    if ((crc ^ 0xffffffff) >>> 0 !== view.getUint32(offset + 8 + length))
      throw new PublisherError("Corrupt PNG chunk");
    offset += length + 12;
    if (type === "IEND") {
      if (length !== 0 || offset !== bytes.length) throw new PublisherError("Invalid PNG ending");
      end = true;
      break;
    }
  }
  if (!end) throw new PublisherError("PNG missing end chunk");
  return { width, height };
}
export function fitScale(width: number, height: number, areaWidth: number, areaHeight: number) {
  return Math.min(1, width / height / (areaWidth / areaHeight));
}
export async function prepare(store: Store, subject: string, raw: unknown) {
  const input = prepareSchema.parse(raw),
    api = new Printify(store);
  const response = await fetch(artworkUrl(input.artwork.download_url), {
    redirect: "manual",
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok)
    throw new PublisherError("Artwork download failed or expired; attach the approved PNG again");
  const bytes = await bounded(response, 20_000_000),
    dimensions = pngDimensions(bytes),
    hash = await digest(bytes);
  const fingerprint = await digest(
    JSON.stringify({
      ...input,
      shop_id: api.shop,
      products: [...input.products].sort(),
      artwork: hash,
    }),
  );
  const key = `job:${subject}:${input.job_id}`,
    existing = await store.get<Job>(key);
  if (existing) {
    if (existing.value.fingerprint !== fingerprint)
      throw new PublisherError("job_id already belongs to different artwork or settings", 409);
    return preview(input.job_id, existing.value);
  }
  const configs = await Promise.all(
    input.products.map(async (kind) => {
      const state = await store.get<Config>(`config:${kind}`);
      if (!state)
        throw new PublisherError(
          `Configure ${kind} from an approved template before preparing`,
          409,
        );
      const config = { ...state.value, ...(await api.catalog(state.value)) };
      const scale = fitScale(dimensions.width, dimensions.height, config.width, config.height);
      if (dimensions.width < config.width * scale * 0.5)
        throw new PublisherError(
          `Artwork is below 150 DPI at the planned ${kind} print size. Supply higher-resolution artwork.`,
        );
      return { kind, config };
    }),
  );
  const image = await api.api<{ id: string; width: number; height: number }>(
    "/uploads/images.json",
    "POST",
    { file_name: `${input.job_id}.png`, contents: Buffer.from(bytes).toString("base64") },
  );
  if (!image.id || image.width !== dimensions.width || image.height !== dimensions.height)
    throw new PublisherError("Printify did not validate the supplied PNG dimensions", 502);
  const job: Job = {
    shop_id: api.shop,
    subject,
    fingerprint,
    artwork_hash: hash,
    image_id: image.id,
    ...dimensions,
    title: input.title,
    description: input.description,
    tags: input.tags,
    website: input.website,
    configs,
    approval: await digest(crypto.randomUUID()),
    approved: false,
    results: configs.map(({ kind }) => ({ kind })),
    busy_until: 0,
    verified: false,
  };
  await store.insert(key, job, permanent);
  return preview(input.job_id, job);
}
function preview(id: string, job: Job) {
  return {
    job_id: id,
    shop_id: job.shop_id,
    approval_token: job.approval,
    artwork_hash: job.artwork_hash,
    dimensions: { width: job.width, height: job.height },
    website: job.website,
    products: job.configs.map(({ kind, config }) => ({
      kind,
      blueprint_id: config.blueprint_id,
      print_provider_id: config.print_provider_id,
      variants: config.variants,
      position: config.position,
      scale: fitScale(job.width, job.height, config.width, config.height),
    })),
    instructions:
      "Show the user the planned products, variant prices, placement, and destination. Call publish_products only after explicit approval. Preparation uploads artwork but creates no products or listings.",
  };
}
export function etsyUrl(product: Product): string | undefined {
  const raw = product.external?.handle;
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" &&
      ["etsy.com", "www.etsy.com"].includes(url.hostname) &&
      /^\/listing\/\d+(\/|$)/.test(url.pathname)
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}
export function etsyPageIsLive(html: string, expectedUrl: string): boolean {
  const expectedId = new URL(expectedUrl).pathname.match(/^\/listing\/(\d+)/)?.[1];
  if (
    !expectedId ||
    /\b(?:listing|item)\s+(?:is\s+)?(?:no longer available|unavailable|has been removed)\b/i.test(
      html,
    )
  )
    return false;
  const sameListing = (value: unknown) => {
    if (typeof value !== "string") return false;
    try {
      const url = new URL(value);
      return (
        ["etsy.com", "www.etsy.com"].includes(url.hostname) &&
        url.pathname.match(/^\/listing\/(\d+)/)?.[1] === expectedId
      );
    } catch {
      return false;
    }
  };
  const matches = (node: unknown): boolean => {
    if (Array.isArray(node)) return node.some(matches);
    if (!node || typeof node !== "object") return false;
    const object = node as Record<string, unknown>;
    const types = Array.isArray(object["@type"]) ? object["@type"] : [object["@type"]];
    if (types.some((type) => type === "Product" || type === "https://schema.org/Product")) {
      const offers = Array.isArray(object.offers) ? object.offers : [object.offers];
      if (
        typeof object.name === "string" &&
        object.name.trim() &&
        offers.some((offer) => {
          if (!offer || typeof offer !== "object") return false;
          const value = offer as Record<string, unknown>;
          return (
            Number(value.price ?? value.lowPrice) > 0 &&
            /(?:\/|^)(?:InStock|LimitedAvailability|PreOrder|BackOrder)$/.test(
              String(value.availability ?? ""),
            ) &&
            (sameListing(object.url) || sameListing(value.url))
          );
        })
      )
        return true;
    }
    return Object.values(object).some(matches);
  };
  for (const match of html.matchAll(
    /<script\b[^>]*\btype\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      if (matches(JSON.parse(match[1]))) return true;
    } catch {
      /* Invalid or challenge markup is not evidence of a live listing. */
    }
  }
  return false;
}
async function verifyPage(url: string, marker: string, isEtsy = false) {
  try {
    const response = await fetch(url, {
      redirect: "manual",
      headers: { "Cache-Control": "no-cache" },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return false;
    const html = new TextDecoder().decode(await bounded(response, 2_000_000));
    return isEtsy ? etsyPageIsLive(html, url) : html.includes(marker);
  } catch {
    return false;
  }
}
/**
 * Correct six existing Etsy listings via their original Printify sales channel.
 * The marker exists for recovering a lost CREATE; the confirmed product ID and
 * immutable job record remain durable after the public-facing tag correction.
 */
async function repairApprovedFishingTags(
  api: Printify,
  jobId: string,
  job: Job,
  result: Result,
  product: Product,
  marker: string,
  save: () => Promise<void>,
): Promise<Product> {
  if (!result.id || result.creation !== "confirmed") return product;
  const plan = approvedFishingRepair(jobId, result.id, job.shop_id, result.kind, job.website);
  if (!plan) return product;
  if (!Array.isArray(product.tags)) throw new PublisherError("Product has no tag data; no repair attempted", 409);
  const currentListing = product.external?.id ?? etsyUrl(product)?.match(/listing\/(\d+)/)?.[1];
  if (String(currentListing ?? "") !== plan.etsy)
    throw new PublisherError("Etsy listing ID mismatched approved repair; no mutation", 409);
  if (plan.tags.length !== 13 || new Set(plan.tags).size !== 13 ||
      plan.tags.some((tag) => tag.length > 20 || !/^[a-zA-Z0-9 '-]+$/.test(tag)))
    throw new PublisherError("Approved 13-tag plan invalid", 409);
  const updated = matchesTags(product.tags, plan.tags);
  if (!updated) {
    // Refuse drift: all twelve original SEO tags plus the expected recovery marker.
    const original = [...plan.tags.slice(0, 12), marker];
    if (!matchesTags(product.tags, original))
      throw new PublisherError("Product tag drift from original approved plan; no mutation", 409);
    if (product.is_locked) {
      result.issue = "Printify product locked; tag repair pending";
      await save();
      return product;
    }
    if (result.tag_repair === "put-attempted") {
      result.issue = "Previous Printify tag update uncertain; no blind retry";
      await save();
      return product;
    }
    result.tag_repair = "put-attempted";
    await save();
    const after = await api.api<Product>(`/shops/${api.shop}/products/${encodeURIComponent(result.id)}.json`, "PUT", {
      title: product.title, tags: plan.tags,
    });
    if (after.id !== product.id || !matchesTags(after.tags, plan.tags) ||
        after.blueprint_id !== product.blueprint_id ||
        after.print_provider_id !== product.print_provider_id ||
        after.variants.length !== product.variants.length ||
        product.variants.some((variant) => !after.variants.some((v) =>
          v.id === variant.id && v.price === variant.price && v.is_enabled === variant.is_enabled)))
      throw new PublisherError("Printify tag update altered product identity or variants", 409);
    product = after;
    result.tag_repair = "printify-updated";
    await save();
  } else if (result.tag_repair === "put-attempted") {
    // Lost PUT response reconciled by exact existing Printify tag state.
    result.tag_repair = "printify-updated";
    await save();
  }
  if (result.tag_repair === "publish-submitted") return product;
  if (result.tag_repair === "publish-attempted") {
    result.issue = "Etsy tag-only publish uncertain; no blind retry";
    await save();
    return product;
  }
  if (product.is_locked) {
    result.issue = "Printify locked after tag update; Etsy publish pending";
    await save();
    return product;
  }
  result.tag_repair = "publish-attempted";
  await save();
  await api.api(`/shops/${api.shop}/products/${encodeURIComponent(result.id)}/publish.json`, "POST", {
    title: false, description: false, images: false, variants: false,
    tags: true, keyFeatures: false, shipping_template: false,
  });
  result.tag_repair = "publish-submitted";
  await save();
  return api.product(result.id);
}

export async function advance(store: Store, subject: string, id: string, approval?: string) {
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(id)) throw new PublisherError("Invalid job_id");
  let state = await store.get<Job>(`job:${subject}:${id}`);
  if (!state) throw new PublisherError("Unknown job", 404);
  if (state.value.shop_id !== new Printify(store).shop)
    throw new PublisherError("Job belongs to another Printify shop; no mutations attempted", 409);
  if (approval !== undefined && approval !== state.value.approval)
    throw new PublisherError("Approval does not match plan", 403);
  if (!state.value.approved && approval === undefined) return preview(id, state.value);
  if (state.value.busy_until > Date.now())
    return { job_id: id, status: "processing", verified: false };
  state = await store.replace(state, {
    ...state.value,
    approved: true,
    busy_until: Date.now() + 180000,
  });
  const api = new Printify(store);
  const save = async () => {
    const value = state!.value;
    const saved = await store.replace(state!, value);
    // Keep references to in-progress per-product checkpoints while advancing CAS.
    state = { ...saved, value };
  };
  try {
    const shop = await api.channel();
    const etsy = shop.sales_channel.toLowerCase() === "etsy";
    for (const entry of state.value.configs) {
      const result = state.value.results.find((r) => r.kind === entry.kind)!;
      result.issue = undefined;
      const marker = `hp-${(await digest(`${subject}:${id}:${entry.kind}`)).slice(0, 16)}`;
      if (!result.id && result.creation === "attempted") {
        const matches = (await api.products()).filter((p) => p.tags?.includes(marker));
        if (matches.length === 1) {
          result.id = matches[0].id;
          result.creation = "confirmed";
          await save();
        } else {
          result.issue =
            matches.length > 1
              ? "Multiple tagged products found; administrator reconciliation required"
              : "Creation outcome uncertain; no duplicate create attempted. Check Printify and retry status.";
          continue;
        }
      }
      if (!result.id) {
        await api.catalog(entry.config);
        result.creation = "attempted";
        await save();
        const config = entry.config;
        const product = await api.api<Product>(`/shops/${api.shop}/products.json`, "POST", {
          title: `${state.value.title} – ${entry.kind === "shirt" ? "T-Shirt" : "Sticker"}`,
          description: state.value.description,
          tags: [...(state.value.tags.length === 13 ? state.value.tags.slice(0, 12) : state.value.tags), marker],
          blueprint_id: config.blueprint_id,
          print_provider_id: config.print_provider_id,
          variants: config.variants.map((v) => ({ ...v, is_enabled: true })),
          print_areas: [
            {
              variant_ids: config.variants.map((v) => v.id),
              placeholders: [
                {
                  position: config.position,
                  ...(config.decoration_method
                    ? { decoration_method: config.decoration_method }
                    : {}),
                  images: [
                    {
                      id: state.value.image_id,
                      x: 0.5,
                      y: 0.5,
                      angle: 0,
                      scale: fitScale(
                        state.value.width,
                        state.value.height,
                        config.width,
                        config.height,
                      ),
                    },
                  ],
                },
              ],
            },
          ],
        });
        if (typeof product.id !== "string" || !/^[A-Za-z0-9_-]{1,100}$/.test(product.id))
          throw new PublisherError(
            "Creation returned no valid product ID; reconcile before retrying",
            502,
          );
        result.id = product.id;
        result.creation = "confirmed";
        await save();
      }
      let product = await api.product(result.id);
      if (
        (!product.tags?.includes(marker) &&
          !(result.creation === "confirmed" && state.value.tags.length === 13 &&
            matchesTags(product.tags, state.value.tags)) &&
          !(approvedFishingRepair(id, result.id, state.value.shop_id, entry.kind, state.value.website) &&
            result.creation === "confirmed" &&
            matchesTags(product.tags, approvedFishingRepair(id, result.id, state.value.shop_id, entry.kind, state.value.website)!.tags))) ||
        product.blueprint_id !== entry.config.blueprint_id ||
        product.print_provider_id !== entry.config.print_provider_id ||
        entry.config.variants.some(
          (v) =>
            !product.variants.some((p) => p.id === v.id && p.is_enabled && p.price === v.price),
        )
      )
        throw new PublisherError("Created product does not match the approved plan", 409);
      if (etsy && result.publication && result.id) {
        product = await repairApprovedFishingTags(api, id, state.value, result, product, marker, save);
      }
      // New Etsy jobs expose exactly thirteen descriptive tags. The recovery
      // marker exists *only until* Printify confirms the product ID, so a lost
      // create response can still be reconciled without duplicate products.
      // Strip the marker before the very first Etsy publication.
      if (etsy && result.id && result.creation === "confirmed" &&
          !result.publication && state.value.tags.length === 13) {
        if (!matchesTags(product.tags, state.value.tags)) {
          const originalWithMarker = [...state.value.tags.slice(0, 12), marker];
          if (!matchesTags(product.tags, originalWithMarker))
            throw new PublisherError("New product tags drifted before Etsy publication", 409);
          if (product.is_locked)
            throw new PublisherError("Printify product locked before 13-tag conversion", 409);
          if (result.tag_repair === "put-attempted")
            throw new PublisherError("Previous 13-tag conversion PUT uncertain; do not retry", 409);
          result.tag_repair = "put-attempted";
          await save();
          const after = await api.api<Product>(`/shops/${api.shop}/products/${encodeURIComponent(result.id)}.json`, "PUT", {
            title: product.title,
            tags: state.value.tags,
          });
          if (after.id !== product.id || !matchesTags(after.tags, state.value.tags) ||
              after.blueprint_id !== product.blueprint_id ||
              after.print_provider_id !== product.print_provider_id ||
              after.variants.length !== product.variants.length ||
              product.variants.some((variant) => !after.variants.some((v) =>
                v.id === variant.id && v.price === variant.price && v.is_enabled === variant.is_enabled)))
            throw new PublisherError("Pre-publication 13-tag conversion changed product identity or variants", 409);
          product = after;
          result.tag_repair = "printify-updated";
          await save();
        } else if (result.tag_repair === "put-attempted") {
          result.tag_repair = "printify-updated";
          await save();
        }
      }
      if (etsy && !result.publication && !etsyUrl(product) && !product.is_locked) {
        result.publication = "attempted";
        await save();
        await api.api(`/shops/${api.shop}/products/${result.id}/publish.json`, "POST", {
          title: true,
          description: true,
          images: true,
          variants: true,
          tags: true,
          keyFeatures: true,
          shipping_template: true,
        });
        result.publication = "submitted";
        await save();
        product = await api.product(result.id);
      }
      result.etsy_url = etsy ? etsyUrl(product) : undefined;
      result.etsy_verified =
        !!result.etsy_url &&
        product.visible === true &&
        !product.is_locked &&
        (await verifyPage(
          result.etsy_url,
          product.external?.id ?? result.etsy_url.match(/listing\/(\d+)/)?.[1] ?? "",
          true,
        ));
      if (etsy && !result.etsy_verified)
        result.issue =
          "Etsy publication pending or public listing could not be verified; check status again.";
      if (!etsy) result.issue = `Etsy skipped: shop channel is ${shop.sales_channel}`;
      if (state.value.website !== "none") {
        if (!product.images?.length) {
          result.issue = "Printify mockups pending; website sync waits for images.";
          continue;
        }
        const site = state.value.website;
        const routeKey = `route:${result.id}`;
        const route = await store.get<{ website: string; kind: Kind }>(routeKey);
        const intent = { website: site, kind: entry.kind };
        if (route) await store.replace(route, intent);
        else await store.insert(routeKey, intent, permanent);
        const rows = await store.rest<Record<string, unknown>[]>(
          `products?id=eq.${encodeURIComponent(result.id)}`,
        );
        const mapped = mapProduct(product);
        // Preserve existing merchandising; shared sync always preserves these values afterwards.
        const row = {
          ...mapped,
          ...rows[0],
          ...Object.fromEntries(
            Object.entries(mapped).filter(([key]) =>
              [
                "title",
                "description",
                "price",
                "currency",
                "image_url",
                "product_url",
                "tags",
                "colors",
                "variants",
                "synced_at",
              ].includes(key),
            ),
          ),
          is_active: true,
          publish_keeptxred: site === "keeptxred",
          publish_texasdefined: site === "texasdefined",
          [`${site}_category`]: entry.kind === "shirt" ? "shirts" : "stickers",
        };
        await store.rest(
          "products?on_conflict=id",
          "POST",
          row,
          "resolution=merge-duplicates,return=representation",
        );
        const base = site === "keeptxred" ? "https://keeptxred.com" : "https://texasdefined.com";
        result.website_url = `${base}${site === "keeptxred" ? "/shop/" : "/shop/product/"}${result.id}`;
        result.website_verified = await verifyPage(result.website_url, result.id);
        if (!result.website_verified)
          result.issue = "Website assigned and synced; public page verification pending.";
      }
      await save();
    }
    state.value.verified = state.value.results.every(
      (r) =>
        !!r.id &&
        (!etsy || r.etsy_verified) &&
        (state!.value.website === "none" || r.website_verified),
    );
  } catch (error) {
    state.value.busy_until = 0;
    await save();
    throw error;
  }
  state.value.busy_until = 0;
  await save();
  return {
    job_id: id,
    status: state.value.verified ? "verified" : "pending",
    verified: state.value.verified,
    results: state.value.results,
  };
}
