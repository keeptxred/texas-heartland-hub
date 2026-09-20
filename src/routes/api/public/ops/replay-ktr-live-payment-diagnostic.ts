import { createFileRoute } from "@tanstack/react-router";
import { createStripeClient } from "@/lib/stripe.server";

const LIVE_TEST_RUN = "ktr-20260920-3f7a9d";
const LIVE_TEST_SOURCE = "ktr_live_payment_test";
const LIVE_WEBHOOK_URL = "https://keeptxred.com/api/public/payments/webhook?env=live";
const EXPECTED_AMOUNT = 50;

function authorized(request: Request): boolean {
  const expected = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!expected) return false;
  return request.headers.get("authorization") === `Bearer ${expected}`;
}

async function signPayload(secret: string, timestamp: string, body: string) {
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

export const Route = createFileRoute("/api/public/ops/replay-ktr-live-payment-diagnostic")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const headers = {
          "cache-control": "no-store, max-age=0",
          "x-robots-tag": "noindex, nofollow",
        };

        if (!authorized(request)) {
          return Response.json({ ok: false, error: "Unauthorized" }, { status: 401, headers });
        }

        try {
          const stripe = createStripeClient("live");
          const sessions = await stripe.checkout.sessions.list({ limit: 100 });
          const session = sessions.data.find((candidate) =>
            candidate.metadata?.source === LIVE_TEST_SOURCE &&
            candidate.metadata?.live_test_run === LIVE_TEST_RUN &&
            candidate.metadata?.diagnostic_only === "true"
          );

          if (
            !session ||
            session.status !== "complete" ||
            session.payment_status !== "paid" ||
            session.amount_total !== EXPECTED_AMOUNT ||
            session.currency !== "usd"
          ) {
            return Response.json(
              { ok: false, error: "Expected paid KTR diagnostic session not found." },
              { status: 409, headers },
            );
          }

          const events = await stripe.events.list({ limit: 100 });
          const event = events.data.find((candidate) => {
            const object = candidate.data?.object as { id?: string } | undefined;
            return (
              (candidate.type === "checkout.session.completed" ||
                candidate.type === "checkout.session.async_payment_succeeded") &&
              object?.id === session.id
            );
          });

          if (!event) {
            return Response.json(
              { ok: false, error: "Matching live Stripe checkout event not found." },
              { status: 404, headers },
            );
          }

          const secret = process.env.PAYMENTS_LIVE_WEBHOOK_SECRET?.trim();
          if (!secret) {
            return Response.json(
              { ok: false, error: "Live webhook secret is unavailable." },
              { status: 503, headers },
            );
          }

          const timestamp = String(Math.floor(Date.now() / 1000));
          const body = JSON.stringify(event);
          const signature = await signPayload(secret, timestamp, body);
          const replay = await fetch(LIVE_WEBHOOK_URL, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "stripe-signature": `t=${timestamp},v1=${signature}`,
            },
            body,
          });

          const verifiedSession = await stripe.checkout.sessions.retrieve(session.id);
          const marker = verifiedSession.metadata?.live_test_webhook_received === "true";

          return Response.json(
            {
              ok: replay.ok && marker,
              replay_status: replay.status,
              paid: verifiedSession.payment_status === "paid",
              amount_total: verifiedSession.amount_total,
              currency: verifiedSession.currency,
              webhook_received: marker,
              event_type: event.type,
              event_livemode: event.livemode,
            },
            { status: replay.ok && marker ? 200 : 502, headers },
          );
        } catch (error) {
          console.error("KTR live diagnostic replay failed", error);
          return Response.json(
            { ok: false, error: "Unable to replay KTR live diagnostic event." },
            { status: 500, headers },
          );
        }
      },
    },
  },
});
