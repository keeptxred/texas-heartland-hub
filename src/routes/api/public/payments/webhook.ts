import { createFileRoute } from "@tanstack/react-router";
import { type StripeEnv, createStripeClient, verifyWebhook } from "@/lib/stripe.server";

type CompactCartItem = { p: string; v: number | null; q: number };

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
) {
  const shopId = process.env.PRINTIFY_SHOP_ID;
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!shopId || !token) {
    console.error("Printify credentials missing — cannot create order", externalId);
    return;
  }
  const line_items = cart
    .filter((i) => i.v != null)
    .map((i) => ({
      product_id: i.p,
      variant_id: i.v,
      quantity: i.q,
    }));

  if (line_items.length === 0) {
    console.error("No fulfillable line items for Printify order", externalId);
    return;
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
    return;
  }
  const json = await res.json().catch(() => ({}));
  console.log("Printify order created", externalId, json);
}

function splitName(name?: string | null): { first: string; last: string } {
  const parts = (name ?? "").trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return { first: "Customer", last: "Order" };
  if (parts.length === 1) return { first: parts[0], last: "-" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

async function handleCheckoutCompleted(sessionObj: any, env: StripeEnv) {
  const stripe = createStripeClient(env);
  // Retrieve full session to guarantee shipping_details is present.
  const session = await stripe.checkout.sessions.retrieve(sessionObj.id, {
    expand: ["customer_details", "shipping_details"],
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

  await createPrintifyOrder(cart, address, session.id);
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);
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
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});