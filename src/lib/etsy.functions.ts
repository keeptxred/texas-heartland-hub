import { createServerFn } from "@tanstack/react-start";

export type EtsyProduct = {
  id: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  url: string;
  description: string;
};

type EtsyListing = {
  listing_id: number;
  title: string;
  description: string;
  url: string;
  price: { amount: number; divisor: number; currency_code: string };
  state: string;
};

type EtsyImage = { listing_id: number; url_fullxfull: string; url_570xN?: string; rank: number };

export const getEtsyListings = createServerFn({ method: "GET" }).handler(async (): Promise<{
  products: EtsyProduct[];
  error?: string;
}> => {
  const apiKey = process.env.ETSY_API_KEY;
  const shopId = process.env.ETSY_SHOP_ID;

  if (!apiKey || !shopId) {
    return { products: [], error: "Missing ETSY_API_KEY or ETSY_SHOP_ID" };
  }

  const url = new URL(
    `https://openapi.etsy.com/v3/application/shops/${shopId}/listings/active`,
  );
  url.searchParams.set("limit", "60");
  url.searchParams.set("includes", "Images");

  try {
    const res = await fetch(url.toString(), {
      headers: { "x-api-key": apiKey, Accept: "application/json" },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[Etsy] listings fetch failed", res.status, body.slice(0, 300));
      return { products: [], error: `Etsy API ${res.status}` };
    }
    const json = (await res.json()) as {
      results: (EtsyListing & { images?: EtsyImage[] })[];
    };

    const products: EtsyProduct[] = (json.results ?? [])
      .filter((l) => l.state === "active")
      .map((l) => {
        const img = (l.images ?? []).sort((a, b) => a.rank - b.rank)[0];
        const amount = l.price?.amount ?? 0;
        const divisor = l.price?.divisor ?? 100;
        return {
          id: String(l.listing_id),
          title: l.title,
          price: amount / divisor,
          currency: l.price?.currency_code ?? "USD",
          image: img?.url_fullxfull ?? img?.url_570xN ?? "",
          url: l.url,
          description: (l.description ?? "").replace(/\s+/g, " ").slice(0, 400),
        };
      })
      .filter((p) => p.image);

    return { products };
  } catch (err) {
    console.error("[Etsy] fetch error", err);
    return { products: [], error: "Unable to load store" };
  }
});