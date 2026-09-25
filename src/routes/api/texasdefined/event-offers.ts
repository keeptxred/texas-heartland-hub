import { createFileRoute } from "@tanstack/react-router";
import {
  TEXASDEFINED_EVENT_OFFER_SEED,
  buildTexasDefinedOfferDashboard,
  filtersFromUrl,
  searchTexasDefinedEventOffers,
  type TexasDefinedEventOffer,
} from "@/lib/texasdefined-event-offers";

function coerceOffer(row: Record<string, unknown>): TexasDefinedEventOffer {
  const tags = Array.isArray(row.tags) ? row.tags.filter((tag): tag is string => typeof tag === "string") : [];
  return {
    id: String(row.id),
    title: String(row.title ?? "Untitled offer"),
    description: String(row.description ?? ""),
    kind: (row.kind as TexasDefinedEventOffer["kind"]) ?? "offer",
    category: (row.category as TexasDefinedEventOffer["category"]) ?? "attractions",
    network: (row.network as TexasDefinedEventOffer["network"]) ?? "direct",
    advertiser: String(row.advertiser ?? "Partner"),
    city: String(row.city ?? "Texas"),
    region: String(row.region ?? "Texas"),
    county: typeof row.county === "string" ? row.county : undefined,
    venue: typeof row.venue === "string" ? row.venue : undefined,
    startDate: typeof row.start_date === "string" ? row.start_date : typeof row.startDate === "string" ? row.startDate : undefined,
    endDate: typeof row.end_date === "string" ? row.end_date : typeof row.endDate === "string" ? row.endDate : undefined,
    priceLabel: typeof row.price_label === "string" ? row.price_label : typeof row.priceLabel === "string" ? row.priceLabel : undefined,
    offerLabel: typeof row.offer_label === "string" ? row.offer_label : typeof row.offerLabel === "string" ? row.offerLabel : undefined,
    promoCode: typeof row.promo_code === "string" ? row.promo_code : typeof row.promoCode === "string" ? row.promoCode : undefined,
    affiliateUrl: String(row.affiliate_url ?? row.affiliateUrl ?? "https://texasdefined.com/"),
    imageUrl: typeof row.image_url === "string" ? row.image_url : typeof row.imageUrl === "string" ? row.imageUrl : undefined,
    commissionStatus: (row.commission_status as TexasDefinedEventOffer["commissionStatus"]) ?? "unknown",
    discountPreservesCommission:
      typeof row.discount_preserves_commission === "boolean"
        ? row.discount_preserves_commission
        : typeof row.discountPreservesCommission === "boolean"
          ? row.discountPreservesCommission
          : null,
    isDiscount: Boolean(row.is_discount ?? row.isDiscount),
    isEditorialOnly: Boolean(row.is_editorial_only ?? row.isEditorialOnly),
    sourceUrl: typeof row.source_url === "string" ? row.source_url : typeof row.sourceUrl === "string" ? row.sourceUrl : undefined,
    expiresAt: typeof row.expires_at === "string" ? row.expires_at : typeof row.expiresAt === "string" ? row.expiresAt : undefined,
    lastVerifiedAt:
      typeof row.last_verified_at === "string" ? row.last_verified_at : typeof row.lastVerifiedAt === "string" ? row.lastVerifiedAt : undefined,
    tags,
  };
}

async function loadOffers(): Promise<{ offers: TexasDefinedEventOffer[]; source: "database" | "seed" }> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as any;
    const { data, error } = await db
      .from("texasdefined_event_offers")
      .select("*")
      .eq("is_active", true)
      .order("start_date", { ascending: true, nullsFirst: false })
      .limit(500);

    if (error) throw error;
    const offers = Array.isArray(data) ? data.map((row) => coerceOffer(row as Record<string, unknown>)) : [];
    return { offers: offers.length ? offers : [...TEXASDEFINED_EVENT_OFFER_SEED], source: offers.length ? "database" : "seed" };
  } catch {
    return { offers: [...TEXASDEFINED_EVENT_OFFER_SEED], source: "seed" };
  }
}

export const Route = createFileRoute("/api/texasdefined/event-offers")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const filters = filtersFromUrl(url);
        const { offers, source } = await loadOffers();
        const results = searchTexasDefinedEventOffers(offers, filters);
        return Response.json({
          ok: true,
          source,
          generatedAt: new Date().toISOString(),
          filters,
          summary: buildTexasDefinedOfferDashboard(offers),
          results,
        });
      },
    },
  },
});
