import { createFileRoute } from "@tanstack/react-router";
import { allowsRealFulfillment } from "@/lib/payment-safety";
import { type StripeEnv, createStripeClient, verifyWebhook } from "@/lib/stripe.server";

type CompactCartItem = { p: string; v: number | null; q: number };

const ADMIN_NOTIFY_EMAIL = "admin@keeptxred.com";

type PrintifyAddress = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
};

async function createPrintifyOrder(
  cart: CompactCartItem[],
  address: PrintifyAddress,
  externalId: string,
): Promise<string | null> {
  const shopId = process.env.PRINTIFY_SHOP_ID;
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!shopId || !token) {
    console.error("Printify credentials missing — cannot create order", externalId);
    return null;
  }

  if (
    cart.some(
      (item) =>
        !item.p ||
        item.v == null ||
        !Number.isInteger(item.v) ||
        !Number.isInteger(item.q) ||
        item.q < 1,
    )
  ) {
    console.error("Malformed or unfulfillable cart — refusing partial Printify order", externalId, cart);
    return null;
  }

  const line_items = cart.map((item) => ({
    product_id: item.p,
    variant_id: item.v as number,
    quantity: item.q,
  }));

  if (line_items.length === 0) {
    console.error("No fulfillable line items for Printify order", externalId);
    return null;
  }

  const body = {
    external_id: externalId,
    label: `KTR-${externalId.slice(-8)}`,
    line_items,
    shipping_method: 1,
    is_printify_express: false,
    send_shipping_notification: true,
    address_to: address,
  };

  const res = await fetch(`https://api.printify.com/v1/shops/${shopId}/orders.json`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Printify order creation failed", res.status, text);
    return null;
  }
  const json = (await res.json().catch(() => ({}))) as { id?: string };
  console.log("Printify order created", externalId, json);
  return json?.id ?? null;
}

function splitName(name?: string | null): { first: string; last: string } {
  const parts = (name ?? "").trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return { first: "Customer", last: "Order" };
  if (parts.length === 1) return { first: parts[0], last: "-" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

async function handleCheckoutCompleted(sessionObj: any, env: StripeEnv) {
  const stripe = createStripeClient(env);
  const session = await stripe.checkout.sessions.retrieve(sessionObj.id, {
    expand: ["customer_details", "shipping_details", "line_items", "line_items.data.price.product"],
  });

  const cartJson =
    (session.metadata?.cart as string | undefined) ??
    (session.payment_intent && typeof session.payment_intent !== "string"
      ? (session.payment_intent.metadata?.cart as string | undefined)
      : undefined);

  if (!cartJson) {
    console.error("Checkout completed without cart metadata", session.id);
    return;
  }

  let cart: CompactCartItem[];
  try {
    cart = JSON.parse(cartJson);
  } catch {
    console.error("Malformed cart metadata", session.id, cartJson);
    return;
  }

  const ship =
    (session as any).shipping_details ??
    (session as any).collected_information?.shipping_details ??
    null;
  const shipAddress = ship?.address;
  const customer = session.customer_details;

  if (!shipAddress || !customer?.email) {
    console.error("Missing shipping address or email on session", session.id);
    return;
  }

  const { first, last } = splitName(ship?.name || customer.name);
  const address: PrintifyAddress = {
    first_name: first,
    last_name: last,
    email: customer.email,
    phone: customer.phone || "",
    country: shipAddress.country || "US",
    region: shipAddress.state || "",
    address1: shipAddress.line1 || "",
    ...(shipAddress.line2 ? { address2: shipAddress.line2 } : {}),
    city: shipAddress.city || "",
    zip: shipAddress.postal_code || "",
  };

  const printifyOrderId = await createPrintifyOrder(cart, address, session.id);

  try {
    const fullName = ship?.name || customer.name || `${first} ${last}`.trim();
    const lineItems = (session as any).line_items?.data ?? [];
    const items = lineItems.map((lineItem: any) => ({
      description: lineItem.description,
      quantity: lineItem.quantity,
      amount_subtotal: lineItem.amount_subtotal,
      amount_total: lineItem.amount_total,
      currency: lineItem.currency,
    }));

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: insertError } = await supabaseAdmin.from("orders").upsert(
      {
        stripe_session_id: session.id,
        stripe_payment_intent_id:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null,
        printify_order_id: printifyOrderId,
        customer_name: fullName,
        customer_email: customer.email,
        customer_phone: customer.phone || null,
        shipping_address: {
          name: fullName,
          line1: shipAddress.line1,
          line2: shipAddress.line2 ?? null,
          city: shipAddress.city,
          state: shipAddress.state,
          postal_code: shipAddress.postal_code,
          country: shipAddress.country,
        },
        items,
        subtotal_cents: session.amount_subtotal ?? 0,
        total_cents: session.amount_total ?? 0,
        currency: (session.currency || "usd").toUpperCase(),
        status: printifyOrderId ? "paid" : "fulfillment_failed",
        environment: env,
      },
      { onConflict: "stripe_session_id" },
    );
    if (insertError) console.error("Failed to persist order", session.id, insertError);
    if (!printifyOrderId) console.error("Paid order requires fulfillment attention", session.id);

    await sendOrderEmails({
      request: (globalThis as any).__ktrWebhookRequest as Request | undefined,
      sessionId: session.id,
      customerEmail: customer.email,
      customerName: fullName,
      items,
      totalCents: session.amount_total ?? 0,
      currency: (session.currency || "usd").toUpperCase(),
      shipping: {
        name: fullName,
        line1: shipAddress.line1 || "",
        line2: shipAddress.line2 || undefined,
        city: shipAddress.city || "",
        state: shipAddress.state || "",
        postal_code: shipAddress.postal_code || "",
        country: shipAddress.country || "US",
      },
      printifyOrderId,
    });
  } catch (err) {
    console.error("Order persistence/notify failed", session.id, err);
  }
}

type OrderEmailInput = {
  request: Request | undefined;
  sessionId: string;
  customerEmail: string;
  customerName: string;
  items: Array<{
    description?: string | null;
    quantity?: number | null;
    amount_total?: number | null;
    currency?: string | null;
  }>;
  totalCents: number;
  currency: string;
  shipping: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  printifyOrderId: string | null;
};

async function sendOrderEmails(input: OrderEmailInput) {
  const origin =
    (input.request && new URL(input.request.url).origin) ||
    process.env.PUBLIC_SITE_URL ||
    "https://keeptxred.com";
  const endpoint = `${origin}/api/email/transactional/send`;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    console.warn("No service role key; skipping order emails", input.sessionId);
    return;
  }

  const templateData = {
    orderId: input.sessionId,
    customerName: input.customerName,
    items: input.items.map((item) => ({
      description: item.description ?? "Item",
      quantity: item.quantity ?? 1,
      amount: ((item.amount_total ?? 0) / 100).toFixed(2),
      currency: (item.currency ?? input.currency).toUpperCase(),
    })),
    total: (input.totalCents / 100).toFixed(2),
    currency: input.currency,
    shipping: input.shipping,
    printifyOrderId: input.printifyOrderId,
  };

  async function send(templateName: string, to: string, extra: Record<string, unknown> = {}) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
          templateName,
          recipientEmail: to,
          idempotencyKey: `${templateName}-${input.sessionId}`,
          templateData: { ...templateData, ...extra },
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.warn(`Email ${templateName} failed`, res.status, text);
      }
    } catch (err) {
      console.warn(`Email ${templateName} error`, err);
    }
  }

  await Promise.all([
    send("order-confirmation", input.customerEmail),
    send("admin-order-notification", ADMIN_NOTIFY_EMAIL, {
      customerEmail: input.customerEmail,
    }),
  ]);
}

async function handleWebhook(req: Request, env: StripeEnv) {
  (globalThis as any).__ktrWebhookRequest = req;
  const event = await verifyWebhook(req, env);

  if (!allowsRealFulfillment(env)) {
    console.log("Sandbox payment event verified; real fulfillment suppressed", event.type);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
    case "transaction.completed":
      await handleCheckoutCompleted(event.data.object, env);
      break;
    default:
      console.log("Unhandled payment event", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook received with invalid env parameter:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        try {
          await handleWebhook(request, rawEnv as StripeEnv);
          return Response.json({ received: true });
        } catch (error) {
          console.error("Webhook error:", error);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
