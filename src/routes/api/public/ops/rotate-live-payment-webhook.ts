import { createFileRoute } from "@tanstack/react-router";
import { createStripeClient } from "@/lib/stripe.server";

const LIVE_WEBHOOK_PATH = "/api/public/payments/webhook?env=live";
const LIVE_WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
] as const;
const ROTATION_GENERATION = "2026-09-20-a";

function productionOrigin(): string {
  return (process.env.PUBLIC_SITE_URL?.trim() || "https://keeptxred.com").replace(/\/$/, "");
}

function authorized(request: Request): boolean {
  const expected = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!expected) return false;
  return request.headers.get("authorization") === `Bearer ${expected}`;
}

function isManagedLiveWebhook(urlValue: string): boolean {
  try {
    const url = new URL(urlValue);
    return (
      (url.hostname === "keeptxred.com" || url.hostname === "www.keeptxred.com") &&
      url.pathname === "/api/public/payments/webhook" &&
      url.searchParams.get("env") === "live"
    );
  } catch {
    return false;
  }
}

async function signWebhookPayload(secret: string, timestamp: string, body: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${body}`),
  );
  return Buffer.from(new Uint8Array(signed)).toString("hex");
}

export const Route = createFileRoute("/api/public/ops/rotate-live-payment-webhook")({
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

        const action = new URL(request.url).searchParams.get("action") || "rotate";

        if (action === "self-test") {
          const secret = process.env.PAYMENTS_LIVE_WEBHOOK_SECRET?.trim();
          if (!secret) {
            return Response.json(
              { ok: false, action, error: "Live webhook secret is not configured." },
              { status: 503, headers },
            );
          }

          const timestamp = String(Math.floor(Date.now() / 1000));
          const body = JSON.stringify({
            id: `evt_ktr_self_test_${ROTATION_GENERATION}`,
            object: "event",
            api_version: "2026-03-25.dahlia",
            created: Number(timestamp),
            data: { object: {} },
            livemode: true,
            pending_webhooks: 1,
            type: "ktr.payment.webhook.self_test",
          });
          const signature = await signWebhookPayload(secret, timestamp, body);
          const response = await fetch(`${productionOrigin()}${LIVE_WEBHOOK_PATH}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Stripe-Signature": `t=${timestamp},v1=${signature}`,
            },
            body,
          });

          return Response.json(
            {
              ok: response.ok,
              action,
              generation: ROTATION_GENERATION,
              webhook_status: response.status,
            },
            { status: response.ok ? 200 : 502, headers },
          );
        }

        if (action !== "rotate") {
          return Response.json({ ok: false, error: "Unknown action" }, { status: 400, headers });
        }

        try {
          const stripe = createStripeClient("live");
          const webhookUrl = `${productionOrigin()}${LIVE_WEBHOOK_PATH}`;
          const existing = await stripe.webhookEndpoints.list({ limit: 100 });
          let disabledCount = 0;

          for (const endpoint of existing.data) {
            if (isManagedLiveWebhook(endpoint.url) && endpoint.status !== "disabled") {
              await stripe.webhookEndpoints.update(endpoint.id, { disabled: true });
              disabledCount += 1;
            }
          }

          const endpoint = await stripe.webhookEndpoints.create({
            url: webhookUrl,
            enabled_events: [...LIVE_WEBHOOK_EVENTS],
            description: `KeepTXRed live checkout fulfillment ${ROTATION_GENERATION}`,
          });

          if (!endpoint.secret) {
            throw new Error("Stripe did not return a webhook signing secret.");
          }

          return Response.json(
            {
              ok: true,
              action,
              generation: ROTATION_GENERATION,
              disabled_count: disabledCount,
              endpoint_id: endpoint.id,
              secret: endpoint.secret,
            },
            { headers },
          );
        } catch (error) {
          console.error("Live Stripe webhook rotation failed", error);
          return Response.json(
            { ok: false, action, error: "Unable to rotate live payment webhook." },
            { status: 500, headers },
          );
        }
      },
    },
  },
});
