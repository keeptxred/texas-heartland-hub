import { createFileRoute } from "@tanstack/react-router";
import { createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";

const LIVE_TESTS = {
  ktr: {
    run: "ktr-20260920-3f7a9d",
    source: "ktr_live_payment_test",
    label: "Keep TX Red",
    returnUrl: "https://keeptxred.com/shop/live-payment-test",
    allowedOrigins: new Set(["https://keeptxred.com", "https://www.keeptxred.com"]),
  },
  texasdefined: {
    run: "td-20260920-8c2e41",
    source: "texasdefined_live_payment_test",
    label: "Texas Defined",
    returnUrl: "https://texasdefined.com/shop/live-payment-test",
    allowedOrigins: new Set(["https://texasdefined.com", "https://www.texasdefined.com"]),
  },
} as const;

type LiveTestSite = keyof typeof LIVE_TESTS;

function testFor(site: string | null, run: string | null) {
  if (site === "ktr" && run === LIVE_TESTS.ktr.run) {
    return { site: "ktr" as const, ...LIVE_TESTS.ktr };
  }
  if (site === "texasdefined" && run === LIVE_TESTS.texasdefined.run) {
    return { site: "texasdefined" as const, ...LIVE_TESTS.texasdefined };
  }
  return null;
}

function corsHeaders(request: Request, site?: LiveTestSite) {
  const origin = request.headers.get("origin") ?? "";
  const allowed = site ? LIVE_TESTS[site].allowedOrigins : new Set<string>();
  return {
    "access-control-allow-origin": allowed.has(origin) ? origin : "null",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "cache-control": "no-store, max-age=0",
    "x-robots-tag": "noindex, nofollow",
    vary: "Origin",
  };
}

function originAllowed(request: Request, site: LiveTestSite, allowSameOriginUrlFallback = false) {
  const origin = request.headers.get("origin") ?? "";
  if (LIVE_TESTS[site].allowedOrigins.has(origin)) return true;
  if (!origin && allowSameOriginUrlFallback) {
    return LIVE_TESTS[site].allowedOrigins.has(new URL(request.url).origin);
  }
  return false;
}

export const Route = createFileRoute("/api/public/payments/live-test")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const url = new URL(request.url);
        const site = url.searchParams.get("site");
        const normalized = site === "ktr" || site === "texasdefined" ? site : undefined;
        return new Response(null, { status: 204, headers: corsHeaders(request, normalized) });
      },
      POST: async ({ request }) => {
        let body: { site?: string; run?: string };
        try {
          body = await request.json() as { site?: string; run?: string };
        } catch {
          return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
        }

        const test = testFor(body.site ?? null, body.run ?? null);
        if (!test) {
          return Response.json({ ok: false, error: "Live test link is invalid or expired" }, { status: 404 });
        }
        const headers = corsHeaders(request, test.site);
        if (!originAllowed(request, test.site)) {
          return Response.json({ ok: false, error: "Origin not allowed" }, { status: 403, headers });
        }

        try {
          const stripe = createStripeClient("live");
          const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
              {
                quantity: 1,
                price_data: {
                  currency: "usd",
                  unit_amount: 50,
                  product_data: {
                    name: `${test.label} — Live Payment Test`,
                    description: "One-time 50¢ diagnostic charge. No merchandise or fulfillment.",
                  },
                },
              },
            ],
            success_url: `${test.returnUrl}?run=${encodeURIComponent(test.run)}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${test.returnUrl}?run=${encodeURIComponent(test.run)}`,
            payment_intent_data: {
              description: `${test.label} — 50¢ live payment verification`,
              metadata: {
                source: test.source,
                live_test_run: test.run,
                diagnostic_only: "true",
              },
            },
            metadata: {
              source: test.source,
              live_test_run: test.run,
              diagnostic_only: "true",
            },
          });

          if (!session.url) {
            return Response.json({ ok: false, error: "Stripe did not return a checkout URL" }, { status: 502, headers });
          }
          return Response.json({ ok: true, url: session.url }, { headers });
        } catch (error) {
          return Response.json(
            { ok: false, error: getStripeErrorMessage(error) },
            { status: 500, headers },
          );
        }
      },
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const test = testFor(url.searchParams.get("site"), url.searchParams.get("run"));
        if (!test) {
          return Response.json({ ok: false, error: "Live test link is invalid or expired" }, { status: 404 });
        }
        const headers = corsHeaders(request, test.site);
        if (!originAllowed(request, test.site, true)) {
          return Response.json({ ok: false, error: "Origin not allowed" }, { status: 403, headers });
        }

        const sessionId = url.searchParams.get("session_id")?.trim() ?? "";
        if (!sessionId.startsWith("cs_") || sessionId.length > 255) {
          return Response.json({ ok: false, error: "Invalid checkout session" }, { status: 400, headers });
        }

        try {
          const stripe = createStripeClient("live");
          const session = await stripe.checkout.sessions.retrieve(sessionId);
          if (
            session.metadata?.source !== test.source ||
            session.metadata?.live_test_run !== test.run ||
            session.metadata?.diagnostic_only !== "true"
          ) {
            return Response.json({ ok: false, error: "Checkout session does not belong to this live test" }, { status: 404, headers });
          }

          return Response.json({
            ok: true,
            site: test.site,
            amountTotal: session.amount_total,
            currency: session.currency,
            status: session.status,
            paymentStatus: session.payment_status,
            paid: session.status === "complete" && session.payment_status === "paid",
            webhookReceived: session.metadata?.live_test_webhook_received === "true",
          }, { headers });
        } catch (error) {
          return Response.json(
            { ok: false, error: getStripeErrorMessage(error) },
            { status: 404, headers },
          );
        }
      },
    },
  },
});
