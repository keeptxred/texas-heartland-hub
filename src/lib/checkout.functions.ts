import { createServerFn } from "@tanstack/react-start";
import {
  type StripeEnv,
  createStripeClient,
  getStripeErrorMessage,
} from "@/lib/stripe.server";

export const FREE_SHIPPING_THRESHOLD_CENTS = 3500;

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

type CompactCartItem = { p: string; v: number | null; q: number };

type CheckoutInput = {
  items: CheckoutCartItem[];
  currency?: string;
  returnUrl: string;
  environment: StripeEnv;
};

type CheckoutResult = { clientSecret: string } | { error: string };

type ShippingDetails = {
  name: string;
  address: {
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
};

type ShippingUpdateInput = {
  checkoutSessionId: string;
  shippingDetails: ShippingDetails;
  environment: StripeEnv;
};

type ShippingUpdateResult = { ok: true } | { error: string };

type PrintifyShippingQuote = {
  standard?: number;
};

export function qualifiesForFreeShipping(subtotalCents: number): boolean {
  return subtotalCents > FREE_SHIPPING_THRESHOLD_CENTS;
}

export function getStandardShippingCents(quote: PrintifyShippingQuote): number {
  const amount = Number(quote.standard);
  if (!Number.isInteger(amount) || amount < 0) {
    throw new Error("Printify did not return a valid standard shipping rate.");
  }
  return amount;
}

function parseCompactCart(value: string | null | undefined): CompactCartItem[] {
  if (!value) throw new Error("Checkout session is missing cart information.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error("Checkout session contains invalid cart information.");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Checkout session contains no shippable items.");
  }

  const cart = parsed as CompactCartItem[];
  for (const item of cart) {
    if (
      !item ||
      typeof item.p !== "string" ||
      !item.p ||
      !Number.isInteger(item.v) ||
      !Number.isInteger(item.q) ||
      item.q < 1
    ) {
      throw new Error("One or more cart items cannot be quoted for shipping.");
    }
  }

  return cart;
}

function validateShippingDetails(details: ShippingDetails): ShippingDetails {
  const address = details?.address;
  if (!details?.name?.trim()) throw new Error("Enter a name for the shipping address.");
  if (!address || address.country !== "US") {
    throw new Error("Keep Texas Red currently ships only to U.S. addresses.");
  }
  if (
    !address.line1?.trim() ||
    !address.city?.trim() ||
    !address.state?.trim() ||
    !address.postal_code?.trim()
  ) {
    throw new Error("Enter a complete U.S. shipping address.");
  }

  return {
    name: details.name.trim(),
    address: {
      line1: address.line1.trim(),
      ...(address.line2?.trim() ? { line2: address.line2.trim() } : {}),
      city: address.city.trim(),
      state: address.state.trim(),
      postal_code: address.postal_code.trim(),
      country: "US",
    },
  };
}

function splitName(name: string): { first: string; last: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return { first: parts[0], last: "-" };
  return {
    first: parts[0],
    last: parts.slice(1).join(" "),
  };
}

async function quotePrintifyStandardShipping(
  cart: CompactCartItem[],
  shippingDetails: ShippingDetails,
  customer?: { email?: string | null; phone?: string | null },
): Promise<number> {
  const shopId = process.env.PRINTIFY_SHOP_ID;
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!shopId || !token) {
    throw new Error("Shipping rates are temporarily unavailable.");
  }

  const { first, last } = splitName(shippingDetails.name);
  const address = shippingDetails.address;
  const addressTo = {
    first_name: first,
    last_name: last,
    country: "US",
    region: address.state,
    address1: address.line1,
    ...(address.line2 ? { address2: address.line2 } : {}),
    city: address.city,
    zip: address.postal_code,
    ...(customer?.email ? { email: customer.email } : {}),
    ...(customer?.phone ? { phone: customer.phone } : {}),
  };

  const response = await fetch(
    `https://api.printify.com/v1/shops/${shopId}/orders/shipping.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "KeepTXRed/1.0",
      },
      body: JSON.stringify({
        line_items: cart.map((item, index) => ({
          product_id: item.p,
          variant_id: item.v as number,
          quantity: item.q,
          external_id: `checkout-${index + 1}`,
        })),
        address_to: addressTo,
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error("Printify shipping quote failed", response.status, body);
    throw new Error("We could not calculate shipping for that address. Please verify the address and try again.");
  }

  const quote = (await response.json()) as PrintifyShippingQuote;
  return getStandardShippingCents(quote);
}

export const createCartCheckoutSession = createServerFn({ method: "POST" })
  .validator((data: CheckoutInput) => {
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
        permissions: { update_shipping_details: "server_only" },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: 0, currency },
              display_name: "Shipping calculated after address",
            },
          },
        ],
        payment_intent_data: {
          description: "Keep Texas Red — Shop Order",
          metadata: { cart: cartJson },
        },
        metadata: { cart: cartJson, source: "keeptxred_shop" },
      } as any);

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

export const updateCartCheckoutShipping = createServerFn({ method: "POST" })
  .validator((data: ShippingUpdateInput) => {
    if (!data.checkoutSessionId?.startsWith("cs_")) {
      throw new Error("Invalid checkout session.");
    }
    if (data.environment !== "sandbox" && data.environment !== "live") {
      throw new Error("Invalid checkout environment.");
    }
    validateShippingDetails(data.shippingDetails);
    return data;
  })
  .handler(async ({ data }): Promise<ShippingUpdateResult> => {
    try {
      const stripe = createStripeClient(data.environment);
      const shippingDetails = validateShippingDetails(data.shippingDetails);
      const session = await stripe.checkout.sessions.retrieve(data.checkoutSessionId);

      if (session.status !== "open" || session.metadata?.source !== "keeptxred_shop") {
        return { error: "This checkout session can no longer be updated." };
      }

      const cart = parseCompactCart(session.metadata?.cart);
      const subtotalCents = session.amount_subtotal;
      if (!Number.isInteger(subtotalCents) || (subtotalCents ?? -1) < 0) {
        return { error: "Unable to verify the order subtotal." };
      }

      const shippingCents = qualifiesForFreeShipping(subtotalCents as number)
        ? 0
        : await quotePrintifyStandardShipping(cart, shippingDetails, {
            email: session.customer_details?.email,
            phone: session.customer_details?.phone,
          });

      await stripe.checkout.sessions.update(
        data.checkoutSessionId,
        {
          collected_information: { shipping_details: shippingDetails },
          shipping_options: [
            {
              shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: {
                  amount: shippingCents,
                  currency: session.currency || "usd",
                },
                display_name:
                  shippingCents === 0
                    ? "Free standard shipping"
                    : "Printify standard shipping",
              },
            },
          ],
        } as any,
      );

      return { ok: true };
    } catch (error) {
      console.error("Checkout shipping update failed", error);
      return {
        error:
          error instanceof Error
            ? error.message
            : "Unable to calculate shipping for that address.",
      };
    }
  });
