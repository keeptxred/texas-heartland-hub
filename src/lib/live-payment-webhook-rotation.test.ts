import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const route = readFileSync(
  "src/routes/api/public/ops/rotate-live-payment-webhook.ts",
  "utf8",
);
const workflow = readFileSync(
  ".github/workflows/deploy-cloudflare-after-verify.yml",
  "utf8",
);
const marker = readFileSync(
  ".github/rotate-live-payment-webhook-once",
  "utf8",
).trim();

describe("one-time live Stripe webhook rotation", () => {
  it("requires authenticated deployment access", () => {
    expect(route).toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(route).toContain('return Response.json({ ok: false, error: "Unauthorized" }');
  });

  it("only manages KTR live payment webhook URLs", () => {
    expect(route).toContain('url.pathname === "/api/public/payments/webhook"');
    expect(route).toContain('url.searchParams.get("env") === "live"');
    expect(route).toContain('url.hostname === "keeptxred.com"');
    expect(route).toContain('url.hostname === "www.keeptxred.com"');
  });

  it("creates the required checkout completion subscriptions", () => {
    expect(route).toContain('"checkout.session.completed"');
    expect(route).toContain('"checkout.session.async_payment_succeeded"');
    expect(route).toContain("stripe.webhookEndpoints.create");
  });

  it("uses a fulfillment-safe signed self-test", () => {
    expect(route).toContain('"ktr.payment.webhook.self_test"');
    expect(route).toContain('"Stripe-Signature"');
    expect(route).not.toContain('"checkout.session.completed",\n            data: { object: {} }');
  });

  it("stores the rotated secret and verifies propagation before health checks", () => {
    expect(marker).toBe("rotate-2026-09-20-a");
    expect(workflow).toContain("Rotate live Stripe webhook signing secret");
    expect(workflow).toContain('"PAYMENTS_LIVE_WEBHOOK_SECRET"');
    expect(workflow).toContain("rotate-live-payment-webhook?action=self-test");
    expect(workflow.indexOf("Rotate live Stripe webhook signing secret")).toBeLessThan(
      workflow.indexOf("Verify live payment runtime"),
    );
  });
});
