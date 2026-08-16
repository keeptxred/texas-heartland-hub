import { createFileRoute } from "@tanstack/react-router";

const PRODUCT_ID = "6a45389b4a06e00a2f00683c";
const VARIANT_ID = 45748;

async function quote(includeContact: boolean) {
  const shopId = process.env.PRINTIFY_SHOP_ID;
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!shopId || !token) {
    return { ok: false, status: 0, body: "Printify runtime bindings are missing" };
  }

  const addressTo = {
    first_name: "Shipping",
    last_name: "Test",
    country: "US",
    region: "TX",
    address1: "100 Congress Ave",
    city: "Austin",
    zip: "78701",
    ...(includeContact
      ? { email: "shipping-test@keeptxred.com", phone: "5125550100" }
      : {}),
  };

  const response = await fetch(
    `https://api.printify.com/v1/shops/${shopId}/orders/shipping.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=utf-8",
        "User-Agent": "KeepTXRed/1.0",
      },
      body: JSON.stringify({
        line_items: [
          {
            product_id: PRODUCT_ID,
            variant_id: VARIANT_ID,
            quantity: 1,
            external_id: "shipping-diagnostic-1",
          },
        ],
        address_to: addressTo,
      }),
    },
  );

  const text = await response.text().catch(() => "");
  return {
    ok: response.ok,
    status: response.status,
    body: text.slice(0, 1000),
  };
}

export const Route = createFileRoute("/api/public/payments/printify-quote-health")({
  server: {
    handlers: {
      GET: async () => {
        const withoutContact = await quote(false);
        const withContact = await quote(true);

        return Response.json(
          {
            timestamp: new Date().toISOString(),
            product_id: PRODUCT_ID,
            variant_id: VARIANT_ID,
            without_contact: withoutContact,
            with_contact: withContact,
          },
          {
            headers: {
              "Cache-Control": "no-store, max-age=0",
              "X-Robots-Tag": "noindex, nofollow",
            },
          },
        );
      },
    },
  },
});
