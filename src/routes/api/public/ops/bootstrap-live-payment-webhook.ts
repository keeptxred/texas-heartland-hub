import { createFileRoute } from "@tanstack/react-router";
import { createStripeClient } from "@/lib/stripe.server";

const LIVE_WEBHOOK_PATH = "/api/public/payments/webhook?env=live";
const LIVE_WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
] as const;

function productionOrigin(): string {
  return (process.env.PUBLIC_SITE_URL?.trim() || "https://keeptxred.com").replace(/\/$/, "");
}

function authorized(request: Request): boolean {
  const expected = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!expected) return false;
  const header = request.headers.get("authorization") || "";
  return header === `Bearer ${expected}`;
}

export const Route = createFileRoute("/api/public/ops/bootstrap-live-payment-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const headers = {
          "Cache-Control": "no-store, max-age=0",
          "X-Robots-Tag": "noindex, nofollow",
        };

        if (!authorized(request)) {
          return Response.json({ ok: false, error: "Unauthorized" }, { status: 401, headers });
        }

        if (process.env.PAYMENTS_LIVE_WEBHOOK_SECRET?.trim()) {
          return Response.json(
            { ok: true, created: false, already_configured: true },
            { headers },
          );
        }

        try {
          const stripe = createStripeClient("live");
          const webhookUrl = `${productionOrigin()}${LIVE_WEBHOOK_PATH}`;
          const existing = await stripe.webhookEndpoints.list({ limit: 100 });

          for (const endpoint of existing.data) {
            if (endpoint.url === webhookUrl) {
              await stripe.webhookEndpoints.del(endpoint.id);
            }
          }

          const endpoint = await stripe.webhookEndpoints.create({
            url: webhookUrl,
            enabled_events: [...LIVE_WEBHOOK_EVENTS],
            description: "KeepTXRed live checkout fulfillment",
          });

          if (!endpoint.secret) {
            throw new Error("Stripe did not return a webhook signing secret.");
          }

          return Response.json(
            {
              ok: true,
              created: true,
              endpoint_id: endpoint.id,
              secret: endpoint.secret,
            },
            { headers },
          );
        } catch (error) {
          console.error("Live payment webhook bootstrap failed", error);
          return Response.json(
            { ok: false, error: "Unable to bootstrap live payment webhook." },
            { status: 500, headers },
          );
        }
      },
    },
  },
});
