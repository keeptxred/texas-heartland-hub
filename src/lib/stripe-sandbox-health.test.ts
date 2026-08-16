import { describe, expect, it } from "vitest";
import { getStripeSandboxBindings } from "@/lib/stripe-sandbox-health";

describe("Stripe sandbox runtime health", () => {
  it("requires test-mode publishable and secret keys plus a webhook secret", () => {
    expect(
      getStripeSandboxBindings({
        STRIPE_SANDBOX_PUBLISHABLE_KEY: "pk_test_example",
        STRIPE_SANDBOX_SECRET_KEY: "sk_test_example",
        PAYMENTS_SANDBOX_WEBHOOK_SECRET: "whsec_example",
      }),
    ).toEqual({
      publishable_key: true,
      secret_key: true,
      webhook_secret: true,
    });
  });

  it("accepts restricted test-mode secret keys", () => {
    expect(
      getStripeSandboxBindings({
        STRIPE_SANDBOX_PUBLISHABLE_KEY: "pk_test_example",
        STRIPE_SANDBOX_SECRET_KEY: "rk_test_example",
        PAYMENTS_SANDBOX_WEBHOOK_SECRET: "whsec_example",
      }).secret_key,
    ).toBe(true);
  });

  it("reports live-mode Stripe keys as unhealthy without exposing values", () => {
    const health = getStripeSandboxBindings({
      STRIPE_SANDBOX_PUBLISHABLE_KEY: "pk_live_do_not_expose",
      STRIPE_SANDBOX_SECRET_KEY: "sk_live_do_not_expose",
      PAYMENTS_SANDBOX_WEBHOOK_SECRET: "whsec_example",
    });

    expect(health).toEqual({
      publishable_key: false,
      secret_key: false,
      webhook_secret: true,
    });
    expect(JSON.stringify(health)).not.toContain("do_not_expose");
  });

  it("reports missing sandbox bindings as false", () => {
    expect(getStripeSandboxBindings({})).toEqual({
      publishable_key: false,
      secret_key: false,
      webhook_secret: false,
    });
  });
});
