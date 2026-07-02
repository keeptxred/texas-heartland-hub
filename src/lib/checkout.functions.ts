import { createServerFn } from "@tanstack/react-start";
import {
  type StripeEnv,
  createStripeClient,
  getStripeErrorMessage,
} from "@/lib/stripe.server";

// Compact cart shape we stamp onto Stripe session metadata. Kept small
// because Stripe caps each metadata value at 500 chars. Printify only
// needs product_id + variant_id + quantity to place an order.
type CheckoutCartItem = {
  productId: string;
  variantId: number | null;
  quantity: number;
  title: string;
  price: number;
  image?: string;
  color?: string | null;
  size?: string | null;
};

type CheckoutInput = {
  items: CheckoutCartItem[];
  currency?: string;
  returnUrl: string;
  environment: StripeEnv;
};

type CheckoutResult = { clientSecret: string } | { error: string };

export const createCartCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((data: CheckoutInput) => {
    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new Error("Cart is empty");
    }
    for (const item of data.items) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        throw new Error("Invalid cart item");
      }
      if (typeof item.price !== "number" || item.price <= 0) {
        throw new Error("Invalid cart item price");
      }
    }
    return data;
  })
  .handler(async ({ data }): Promise<CheckoutResult> => {
    try {
      const stripe = createStripeClient(data.environment);
      const currency = (data.currency || "usd").toLowerCase();

      // Compact cart for Printify fulfillment (500-char metadata limit).
      const compactCart = data.items.map((i) => ({
        p: i.productId,
        v: i.variantId,
        q: i.quantity,
      }));
      const cartJson = JSON.stringify(compactCart);
      if (cartJson.length > 480) {
        return {
          error:
            "Cart is too large for a single checkout. Please remove items and try again.",
        };
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        line_items: data.items.map((i) => ({
          quantity: i.quantity,
          price_data: {
            currency,
            product_data: {
              name: i.title,
              ...(i.image ? { images: [i.image] } : {}),
              ...(i.color || i.size
                ? {
                    description: [i.color, i.size].filter(Boolean).join(" / "),
                  }
                : {}),
            },
            unit_amount: Math.round(i.price * 100),
          },
        })),
        shipping_address_collection: { allowed_countries: ["US"] },
        phone_number_collection: { enabled: true },
        payment_intent_data: {
          description: "Keep Texas Red — Shop Order",
          metadata: { cart: cartJson },
        },
        metadata: { cart: cartJson, source: "keeptxred_shop" },
      });

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });