import { createServerFn } from "@tanstack/react-start";
import {
  type StripeEnv,
  createStripeClient,
  getStripeErrorMessage,
  normalizeStripeEnv,
} from "@/lib/stripe.server";

export const FREE_SHIPPING_THRESHOLD_CENTS = 3500;
export const STRIPE_CHECKOUT_UI_MODE = "embedded" as const;

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

type ProductVariantRow = {
  id: number;
  title?: string | null;
  price?: number | string | null;
  image?: string | null;
  color?: string | null;
  is_enabled?: boolean | null;
};

type ProductRow = {
  id: string;
  title: string;
  price: number | string;
  currency: string | null;
  image_url: string | null;
  variants: ProductVariantRow[] | null;
};

type ValidatedCheckoutItem = {
  productId: string;
  variantId: number;
  quantity: number;
  title: string;
  variantTitle: string | null;
  unitAmount: number;
  currency: string;
  image: string | null;
  color: string | null;
  size: string | null;
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

export function priceToCents(value: unknown): number {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("A product has an invalid server-side price.");
  }
  const cents = Math.round(amount * 100);
  if (!Number.isInteger(cents) || cents <= 0) {
    throw new Error("A product has an invalid server-side price.");
  }
  return cents;
}

export function assertCheckoutEnvironmentMatchesReturnUrl(
  environment: StripeEnv,
  returnUrl: string,
): void {
  if (typeof returnUrl !== "string" || !returnUrl.trim()) {
    throw new Error("Checkout return URL is invalid.");
  }

  let pathname: string;
  try {
    pathname = new URL(returnUrl).pathname.replace(/\/+$/, "") || "/";
  } catch {
    throw new Error("Checkout return URL is invalid.");
  }

  const expectedPath =
    environment === "sandbox"
      ? "/shop/checkout-sandbox-return"
      : "/shop/checkout-return";

  if (pathname !== expectedPath) {
    throw new Error(
      `Stripe ${environment} checkout cannot use the ${pathname} return route.`,
    );
  }
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

async function loadAuthoritativeCheckoutItems(
  requestedItems: CheckoutCartItem[],
): Promise<ValidatedCheckoutItem[]> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Product pricing is temporarily unavailable.");
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });

  const productIds = Array.from(new Set(requestedItems.map((item) => item.productId)));
  const { data, error } = await supabase
    .from("products")
    .select("id,title,price,currency,image_url,variants")
    .eq("publish_keeptxred", true)
    .in("id", productIds);

  if (error) {
    console.error("Checkout product lookup failed", error);
    throw new Error("Unable to verify current product prices.");
  }

  const products = (data ?? []) as ProductRow[];
  const byId = new Map(products.map((product) => [String(product.id), product]));

  return requestedItems.map((item) => {
    const product = byId.get(String(item.productId));
    if (!product) {
      throw new Error("One or more products are no longer available.");
    }
    if (!Number.isInteger(item.variantId)) {
      throw new Error(`${product.title} requires a valid product option.`);
    }

    const variants = Array.isArray(product.variants) ? product.variants : [];
    const variant = variants.find((candidate) => Number(candidate?.id) === item.variantId);
    if (!variant || variant.is_enabled === false) {
      throw new Error(`The selected option for ${product.title} is no longer available.`);
    }

    const unitAmount = priceToCents(variant.price ?? product.price);
    const currency = String(product.currency || "USD").toLowerCase();

    return {
      productId: String(product.id),
      variantId: item.variantId as number,
      quantity: item.quantity,
      title: String(product.title),
      variantTitle: variant.title ? String(variant.title) : null,
      unitAmount,
      currency,
      image: variant.image || product.image_url || null,
      color: variant.color ? String(variant.color) : item.color ?? null,
      size: item.size ?? null,
    };
  });
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
    const environment = normalizeStripeEnv(data.environment);
    assertCheckoutEnvironmentMatchesReturnUrl(environment, data.returnUrl);

    if (!Array.isArray(data.items) || data.items.length === 0 || data.items.length > 10) {
      throw new Error("Cart must contain between 1 and 10 items.");
    }
    for (const item of data.items) {
      if (
        !item.productId ||
        !Number.isInteger(item.variantId) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 10
      ) {
        throw new Error("Invalid cart item");
      }
    }
    return { ...data, environment };
  })
  .handler(async ({ data }): Promise<CheckoutResult> => {
    try {
      const stripe = createStripeClient(data.environment);
      const validatedItems = await loadAuthoritativeCheckoutItems(data.items);
      const currency = validatedItems[0]?.currency || "usd";
      if (validatedItems.some((item) => item.currency !== currency)) {
        return { error: "Cart items must use the same currency." };
      }

      const compactCart = validatedItems.map((item) => ({
        p: item.productId,
        v: item.variantId,
        q: item.quantity,
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
        ui_mode: STRIPE_CHECKOUT_UI_MODE,
        return_url: data.returnUrl,
        line_items: validatedItems.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency,
            product_data: {
              name: item.variantTitle
                ? `${item.title} — ${item.variantTitle}`
                : item.title,
              ...(item.image ? { images: [item.image] } : {}),
              ...(item.color || item.size
                ? {
                    description: [item.color, item.size].filter(Boolean).join(" / "),
                  }
                : {}),
            },
            unit_amount: item.unitAmount,
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
          metadata: {
            cart: cartJson,
            payment_environment: data.environment,
          },
        },
        metadata: {
          cart: cartJson,
          source: "keeptxred_shop",
          payment_environment: data.environment,
        },
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

      const sessionEnvironment = session.metadata?.payment_environment;
      if (sessionEnvironment && sessionEnvironment !== data.environment) {
        return { error: "Checkout environment mismatch. Please restart checkout." };
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
