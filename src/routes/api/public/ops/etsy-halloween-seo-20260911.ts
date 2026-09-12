import { createFileRoute } from "@tanstack/react-router";

const PRINTIFY_BASE = "https://api.printify.com/v1";

type ListingUpdate = {
  id: string;
  title: string;
  tags: string[];
};

type PrintifyShop = { id: number; title?: string };
type PrintifyProduct = {
  id: string;
  title: string;
  tags?: string[];
  is_locked?: boolean;
};

const UPDATES: ListingUpdate[] = [
  {
    id: "6a6ec7148aec8d3bec05f72d",
    title:
      "Spooky Rodeo Shirt, Skeleton Cowboy Halloween Tee, Western Halloween Shirt, Haunted Rodeo Graphic Tee",
    tags: [
      "spooky rodeo shirt",
      "skeleton cowboy",
      "western halloween",
      "cowboy halloween",
      "haunted rodeo",
      "spooky cowboy tee",
      "western spooky tee",
      "halloween rodeo",
      "cowboy skeleton",
      "rodeo halloween",
      "country halloween",
      "western graphic tee",
      "halloween shirt",
    ],
  },
  {
    id: "6a6ec4637bc8ae47f60a6bd1",
    title:
      "Haunted Range Cowboy Shirt, Ghost Rider Skeleton Tee, Western Halloween Shirt, Spooky Cowboy Graphic Tee",
    tags: [
      "haunted range",
      "ghost rider shirt",
      "skeleton cowboy",
      "western halloween",
      "cowboy halloween",
      "spooky cowboy tee",
      "spooky western",
      "ghost cowboy shirt",
      "haunted cowboy",
      "country halloween",
      "western graphic tee",
      "vintage halloween",
      "halloween shirt",
    ],
  },
  {
    id: "6a6ec5c07bc8ae47f60a6d72",
    title:
      "Funny Tombstone Halloween Shirt, Skeleton Cowboy Tee, Western Halloween Graphic, Spooky Rodeo Shirt, Here Lies Jim",
    tags: [
      "tombstone shirt",
      "graveyard shirt",
      "halloween humor",
      "funny halloween tee",
      "spooky cemetery",
      "cemetery shirt",
      "vintage halloween",
      "graveyard halloween",
      "tombstone halloween",
      "funny spooky shirt",
      "western halloween",
      "skeleton cowboy",
      "here lies jim",
    ],
  },
  {
    id: "6a6ebef1b7f859f871032dd3",
    title:
      "Farm Halloween Shirt, Skeleton Farmer Tractor Tee, Spooky Country Graphic, Fright Farm Halloween Tee",
    tags: [
      "farm halloween",
      "spooky farm shirt",
      "country halloween",
      "fright farm tee",
      "farm halloween tee",
      "rustic halloween",
      "country spooky tee",
      "fall farm shirt",
      "tractor halloween",
      "skeleton farmer",
      "pumpkin patch tee",
      "vintage halloween",
      "halloween shirt",
    ],
  },
];

async function printifyJson<T>(url: string, token: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${init.method ?? "GET"} ${url} -> ${response.status}: ${text.slice(0, 400)}`);
  }
  return (text ? JSON.parse(text) : null) as T;
}

async function resolveShopId(token: string, requested: string): Promise<string> {
  if (/^\d+$/.test(requested)) return requested;
  const shops = await printifyJson<PrintifyShop[]>(`${PRINTIFY_BASE}/shops.json`, token);
  const requestedName = requested.toLowerCase();
  const match =
    shops.find((shop) => String(shop.title ?? "").toLowerCase().includes(requestedName)) ?? shops[0];
  if (!match) throw new Error("No Printify shop found");
  return String(match.id);
}

export const Route = createFileRoute("/api/public/ops/etsy-halloween-seo-20260911")({
  server: {
    handlers: {
      GET: async () => runUpdate(),
    },
  },
});

async function runUpdate(): Promise<Response> {
  const token = process.env.PRINTIFY_API_TOKEN;
  const requestedShop = process.env.PRINTIFY_SHOP_ID;
  if (!token || !requestedShop) {
    return Response.json({ ok: false, error: "Printify credentials unavailable" }, { status: 500 });
  }

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ids = UPDATES.map((item) => item.id);
    const { data: existingRows, error: existingError } = await supabaseAdmin
      .from("products")
      .select("id,title,tags")
      .in("id", ids);

    if (existingError) {
      return Response.json({ ok: false, error: existingError.message }, { status: 500 });
    }

    const targetById = new Map(UPDATES.map((item) => [item.id, item]));
    const alreadyApplied =
      (existingRows?.length ?? 0) === UPDATES.length &&
      (existingRows ?? []).every((row) => row.title === targetById.get(row.id)?.title);

    if (alreadyApplied) {
      return Response.json({ ok: true, alreadyApplied: true, updated: UPDATES.length });
    }

    const shopId = await resolveShopId(token, requestedShop);
    const results: Array<{ id: string; title: string; published: boolean }> = [];

    for (const item of UPDATES) {
      const productUrl = `${PRINTIFY_BASE}/shops/${shopId}/products/${item.id}.json`;
      const before = await printifyJson<PrintifyProduct>(productUrl, token);
      if (before.is_locked) {
        throw new Error(`Printify product ${item.id} is currently locked; retry later`);
      }

      const after = await printifyJson<PrintifyProduct>(productUrl, token, {
        method: "PUT",
        body: JSON.stringify({ title: item.title, tags: item.tags }),
      });

      if (after.title !== item.title) {
        throw new Error(`Printify title verification failed for ${item.id}`);
      }

      await printifyJson<unknown>(
        `${PRINTIFY_BASE}/shops/${shopId}/products/${item.id}/publish.json`,
        token,
        {
          method: "POST",
          body: JSON.stringify({
            title: true,
            description: false,
            images: false,
            variants: false,
            tags: true,
            keyFeatures: false,
            shipping_template: false,
          }),
        },
      );

      const { error: updateError } = await supabaseAdmin
        .from("products")
        .update({
          title: item.title,
          tags: item.tags,
          synced_at: new Date().toISOString(),
        })
        .eq("id", item.id);

      if (updateError) {
        throw new Error(`Supabase update failed for ${item.id}: ${updateError.message}`);
      }

      results.push({ id: item.id, title: item.title, published: true });
    }

    return Response.json({ ok: true, alreadyApplied: false, shopId, updated: results.length, results });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 503 },
    );
  }
}
