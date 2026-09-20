import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const endpoint = readFileSync("src/routes/api/public/payments/live-test.ts", "utf8");
const webhook = readFileSync("src/routes/api/public/payments/webhook.ts", "utf8");

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

  it("suppresses Printify fulfillment for diagnostic payments", () => {
    expect(webhook).toContain('session.metadata?.diagnostic_only === "true"');
    expect(webhook).toContain('Live payment diagnostic webhook verified; fulfillment suppressed');
    expect(webhook.indexOf('diagnostic_only')).toBeLessThan(webhook.indexOf('const cartJson ='));
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
});
