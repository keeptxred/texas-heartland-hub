import { createServerFn } from "@tanstack/react-start";
import {
  type StripeEnv,
  createStripeClient,
  getStripeErrorMessage,
  normalizeStripeEnv,
} from "@/lib/stripe.server";

export const FREE_SHIPPING_THRESHOLD_CENTS = 3500;
export const STRIPE_CHECKOUT_UI_MODE = "elements" as const;

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

type CheckoutCustomer = {
  email: string;
  phone?: string | null;
};

type CheckoutInput = {
  items: CheckoutCartItem[];
  currency?: string;
  returnUrl: string;
  environment: StripeEnv;
  shippingDetails: ShippingDetails;
  customer: CheckoutCustomer;
};

type CheckoutResult =
  | {
      clientSecret: string;
      sessionId: string;
      subtotalCents: number;
      shippingCents: number;
      totalCents: number;
      shippingLabel: string;
    }
  | { error: string };

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

type FulfillmentMetadata = {
  n: string;
  l1: string;
  l2?: string;
  c: string;
  s: string;
  z: string;
  co: "US";
  e: string;
  p?: string;
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

const LIVE_CHECKOUT_REQUIRED_BINDINGS = [
  "PAYMENTS_LIVE_WEBHOOK_SECRET",
  "PRINTIFY_API_TOKEN",
  "PRINTIFY_SHOP_ID",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

type LiveCheckoutRuntime = Partial<Record<(typeof LIVE_CHECKOUT_REQUIRED_BINDINGS)[number], string>>;

export function assertCheckoutFulfillmentRuntimeReady(
  environment: StripeEnv,
  env: LiveCheckoutRuntime = process.env,
): void {
  if (environment !== "live") return;

  const missing = LIVE_CHECKOUT_REQUIRED_BINDINGS.filter(
    (name) => !env[name]?.trim(),
  );
  if (missing.length > 0) {
    console.error("Live checkout disabled: required fulfillment runtime is incomplete", missing);
    throw new Error("Checkout is temporarily unavailable. Please try again later.");
  }
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

function validateShippingDetails(details: ShippingDetails): ShippingDetails {
  const address = details?.address;
  if (!details?.name?.trim()) throw new Error("Enter a name for the shipping address.");
  if (!address || address.country !== "US") {
    throw new Error("Orders currently ship only to U.S. addresses.");
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
      state: address.state.trim().toUpperCase(),
      postal_code: address.postal_code.trim(),
      country: "US",
    },
  };
}

function validateCustomer(customer: CheckoutCustomer): CheckoutCustomer {
  const email = customer?.email?.trim().toLowerCase();
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }
  const phone = customer.phone?.trim() || null;
  return { email, phone };
}

function splitName(name: string): { first: string; last: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return { first: parts[0], last: "-" };
  return {
    first: parts[0],
    last: parts.slice(1).join(" "),
  };
}

function buildFulfillmentMetadata(
  shippingDetails: ShippingDetails,
  customer: CheckoutCustomer,
): string {
  const metadata: FulfillmentMetadata = {
    n: shippingDetails.name,
    l1: shippingDetails.address.line1,
    ...(shippingDetails.address.line2
      ? { l2: shippingDetails.address.line2 }
      : {}),
    c: shippingDetails.address.city,
    s: shippingDetails.address.state,
    z: shippingDetails.address.postal_code,
    co: "US",
    e: customer.email,
    ...(customer.phone ? { p: customer.phone } : {}),
  };
  const encoded = JSON.stringify(metadata);
  if (encoded.length > 480) {
    throw new Error("Shipping address is too long. Please shorten the address and try again.");
  }
  return encoded;
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
  customer: CheckoutCustomer,
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
    email: customer.email,
    ...(customer.phone ? { phone: customer.phone } : {}),
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
    throw new Error(
      "We could not calculate shipping for that address. Please verify the address and try again.",
    );
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

    return {
      ...data,
      environment,
      shippingDetails: validateShippingDetails(data.shippingDetails),
      customer: validateCustomer(data.customer),
    };
  })
  .handler(async ({ data }): Promise<CheckoutResult> => {
    try {
      assertCheckoutFulfillmentRuntimeReady(data.environment);
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

      const subtotalCents = validatedItems.reduce(
        (total, item) => total + item.unitAmount * item.quantity,
        0,
      );
      const shippingCents = qualifiesForFreeShipping(subtotalCents)
        ? 0
        : await quotePrintifyStandardShipping(
            compactCart,
            data.shippingDetails,
            data.customer,
          );
      const shippingLabel =
        shippingCents === 0
          ? "Free standard shipping"
          : "Printify standard shipping";
      const fulfillment = buildFulfillmentMetadata(
        data.shippingDetails,
        data.customer,
      );

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        ui_mode: STRIPE_CHECKOUT_UI_MODE,
        return_url: data.returnUrl,
        customer_email: data.customer.email,
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
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: shippingCents, currency },
              display_name: shippingLabel,
            },
          },
        ],
        payment_intent_data: {
          description: "Online Shop Order",
          metadata: {
            cart: cartJson,
            fulfillment,
            payment_environment: data.environment,
          },
        },
        metadata: {
          cart: cartJson,
          fulfillment,
          source: "keeptxred_shop",
          payment_environment: data.environment,
        },
      } as any);

      if (!session.client_secret) {
        return { error: "Stripe did not return a client secret." };
      }

      return {
        clientSecret: session.client_secret,
        sessionId: session.id,
        subtotalCents,
        shippingCents,
        totalCents: subtotalCents + shippingCents,
        shippingLabel,
      };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });
