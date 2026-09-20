import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const endpoint = readFileSync("src/routes/api/public/payments/live-test.ts", "utf8");
const webhook = readFileSync("src/routes/api/public/payments/webhook.ts", "utf8");
const page = readFileSync("src/routes/shop.live-payment-test.tsx", "utf8");

describe("one-shot live payment verification", () => {
  it("charges exactly 50 cents in live Stripe", () => {
    expect(endpoint).toContain('unit_amount: 50');
    expect(endpoint).toContain('createStripeClient("live")');
  });

  it("keeps KTR and TexasDefined diagnostic runs distinct", () => {
    expect(endpoint).toContain('ktr_live_payment_test');
    expect(endpoint).toContain('texasdefined_live_payment_test');
    expect(endpoint).toContain('ktr-20260920-3f7a9d');
    expect(endpoint).toContain('td-20260920-8c2e41');
  });

  it("suppresses Printify fulfillment for diagnostic payments before session re-retrieval", () => {
    expect(webhook).toContain('diagnostic_only === "true"');
    expect(webhook).toContain('Live payment diagnostic webhook verified; fulfillment suppressed');
    expect(webhook.indexOf('isLivePaymentDiagnostic(sessionObj)')).toBeLessThan(
      webhook.indexOf('stripe.checkout.sessions.retrieve(sessionObj.id'),
    );
    expect(webhook.indexOf('diagnostic_only')).toBeLessThan(webhook.indexOf('const cartJson ='));
  });

  it("retrieves real checkout sessions without invalid Stripe expand fields", () => {
    expect(webhook).toContain('expand: ["line_items"]');
    expect(webhook).not.toContain('expand: ["customer_details"');
    expect(webhook).not.toContain('"shipping_details", "line_items"');
  });

  it("marks webhook receipt on the Stripe Checkout Session", () => {
    expect(webhook).toContain('live_test_webhook_received: "true"');
    expect(endpoint).toContain('webhookReceived: session.metadata?.live_test_webhook_received === "true"');
  });

  it("allows same-origin GET verification when the browser omits the Origin header", () => {
    expect(endpoint).toContain('allowSameOriginUrlFallback = false');
    expect(endpoint).toContain('new URL(request.url).origin');
    expect(endpoint).toContain('originAllowed(request, test.site, true)');
  });

  it("recovers an existing diagnostic session when the return-page session id is lost", () => {
    expect(endpoint).toContain('stripe.checkout.sessions.list({ limit: 100 })');
    expect(endpoint).toContain('found: false');
    expect(endpoint).toContain('found: true');
    expect(page).toContain('if (!validRun) return');
    expect(page).toContain('if (session_id) url.searchParams.set("session_id", session_id)');
    expect(page).toContain('No existing KTR diagnostic payment found');
  });

  it("exposes only safe Stripe event and endpoint diagnostics when explicitly requested", () => {
    expect(endpoint).toContain('url.searchParams.get("diagnostics") === "1"');
    expect(endpoint).toContain('stripe.events.list({ limit: 100 })');
    expect(endpoint).toContain('stripeEventPendingWebhooks');
    expect(endpoint).toContain('webhookEndpointReceivesCheckoutCompleted');
    expect(endpoint).not.toContain('webhookEndpoint.secret');
  });
});
