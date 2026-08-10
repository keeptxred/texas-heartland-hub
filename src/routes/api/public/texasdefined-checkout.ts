import { createFileRoute } from "@tanstack/react-router";
import { createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";

const ALLOWED_ORIGINS = new Set([
  "https://texasdefined.com",
  "https://www.texasdefined.com",
]);

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  return {
    "access-control-allow-origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://texasdefined.com",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "cache-control": "no-store",
    vary: "Origin",
  };
}

function originAllowed(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  return ALLOWED_ORIGINS.has(origin);
}

type CartInput = {
  productId: string;
  variantId?: number | null;
  quantity: number;
};

type StoredVariant = {
  id: number;
  title?: string;
  price?: number;
  image?: string | null;
  is_enabled?: boolean;
};

export const Route = createFileRoute("/api/public/texasdefined-checkout")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => new Response(null, { status: 204, headers: corsHeaders(request) }),
      GET: async ({ request }) => {
        const headers = corsHeaders(request);
        if (!originAllowed(request)) {
          return Response.json({ ok: false, error: "Origin not allowed" }, { status: 403, headers });
        }

        const sessionId = new URL(request.url).searchParams.get("session_id")?.trim() ?? "";
        if (!sessionId.startsWith("cs_") || sessionId.length > 255) {
          return Response.json({ ok: false, error: "Invalid checkout session" }, { status: 400, headers });
        }

        try {
          const stripe = createStripeClient("live");
          const session = await stripe.checkout.sessions.retrieve(sessionId);
          if (session.metadata?.source !== "texasdefined_shop") {
            return Response.json({ ok: false, error: "Checkout session not found" }, { status: 404, headers });
          }

          const paid = session.status === "complete" && session.payment_status === "paid";
          return Response.json({ ok: true, paid, status: session.status, paymentStatus: session.payment_status }, { headers });
        } catch (error) {
          return Response.json({ ok: false, error: getStripeErrorMessage(error) }, { status: 404, headers });
        }
      },
      POST: async ({ request }) => {
        const headers = corsHeaders(request);
        if (!originAllowed(request)) {
          return Response.json({ ok: false, error: "Origin not allowed" }, { status: 403, headers });
        }

        try {
          const body = await request.json() as { items?: CartInput[] };
          const items = Array.isArray(body.items) ? body.items : [];
          if (items.length === 0 || items.length > 30) {
            return Response.json({ ok: false, error: "Cart is empty or too large" }, { status: 400, headers });
          }
          if (items.some((item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20)) {
            return Response.json({ ok: false, error: "Invalid cart item" }, { status: 400, headers });
          }

          const ids = [...new Set(items.map((item) => item.productId))];
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin
            .from("products")
            .select("id,title,price,currency,image_url,variants,publish_texasdefined")
            .in("id", ids)
            .eq("source", "printify")
            .eq("publish_texasdefined", true);

          if (error) throw new Error(error.message);
          const rows = new Map((data ?? []).map((row) => [row.id, row]));
          if (rows.size !== ids.length) {
            return Response.json({ ok: false, error: "One or more products are unavailable" }, { status: 409, headers });
          }

          const resolved = items.map((item) => {
            const row = rows.get(item.productId)!;
            const variants = Array.isArray(row.variants) ? row.variants as StoredVariant[] : [];
            if (!Number.isInteger(item.variantId)) throw new Error(`Choose an available option for ${row.title}`);
            const variant = variants.find((entry) => Number(entry.id) === Number(item.variantId) && entry.is_enabled !== false);
            if (!variant) throw new Error(`Selected option is unavailable for ${row.title}`);
            const price = Number(variant.price ?? row.price);
            if (!Number.isFinite(price) || price <= 0) throw new Error(`Invalid price for ${row.title}`);
            return {
              productId: row.id as string,
              variantId: variant.id,
              quantity: item.quantity,
              title: row.title as string,
              variantTitle: variant.title ?? null,
              price,
              currency: String(row.currency || "USD").toLowerCase(),
              image: variant.image || row.image_url || undefined,
            };
          });

          const currency = resolved[0]?.currency ?? "usd";
          if (resolved.some((item) => item.currency !== currency)) {
            return Response.json({ ok: false, error: "All cart items must use the same currency" }, { status: 400, headers });
          }

          const compactCart = resolved.map((item) => ({ p: item.productId, v: item.variantId, q: item.quantity }));
          const cartJson = JSON.stringify(compactCart);
          if (cartJson.length > 480) {
            return Response.json({ ok: false, error: "Cart is too large for one checkout" }, { status: 400, headers });
          }

          const stripe = createStripeClient("live");
          const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: resolved.map((item) => ({
              quantity: item.quantity,
              price_data: {
                currency,
                unit_amount: Math.round(item.price * 100),
                product_data: {
                  name: item.title,
                  ...(item.variantTitle ? { description: item.variantTitle } : {}),
                  ...(item.image ? { images: [item.image] } : {}),
                },
              },
            })),
            shipping_address_collection: { allowed_countries: ["US"] },
            phone_number_collection: { enabled: true },
            success_url: "https://texasdefined.com/shop/checkout-return?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "https://texasdefined.com/shop/cart",
            payment_intent_data: {
              description: "Texas Defined — Shop Order",
              metadata: { cart: cartJson, source: "texasdefined_shop" },
            },
            metadata: { cart: cartJson, source: "texasdefined_shop" },
          });

          return Response.json({ ok: true, url: session.url }, { headers });
        } catch (error) {
          return Response.json({ ok: false, error: getStripeErrorMessage(error) }, { status: 500, headers });
        }
      },
    },
  },
});
