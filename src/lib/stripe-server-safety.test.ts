import { describe, expect, it } from "vitest";
import {
  normalizeStripeEnv,
  validateStripeSecretKeyForEnvironment,
} from "@/lib/stripe.server";

describe("Stripe environment safety", () => {
  it("accepts only the two explicit checkout environments", () => {
    expect(normalizeStripeEnv("sandbox")).toBe("sandbox");
    expect(normalizeStripeEnv("live")).toBe("live");
    expect(() => normalizeStripeEnv(undefined)).toThrow("Invalid Stripe environment.");
    expect(() => normalizeStripeEnv("test")).toThrow("Invalid Stripe environment.");
  });

  it("accepts test-mode secret keys only for sandbox", () => {
    expect(validateStripeSecretKeyForEnvironment("sandbox", "sk_test_example")).toBe(
      "sk_test_example",
    );
    expect(validateStripeSecretKeyForEnvironment("sandbox", "rk_test_example")).toBe(
      "rk_test_example",
    );
    expect(() =>
      validateStripeSecretKeyForEnvironment("sandbox", "sk_live_example"),
    ).toThrow("STRIPE_SANDBOX_SECRET_KEY must contain a test-mode Stripe secret key.");
  });

  it("accepts live-mode secret keys only for live checkout", () => {
    expect(validateStripeSecretKeyForEnvironment("live", "sk_live_example")).toBe(
      "sk_live_example",
    );
    expect(validateStripeSecretKeyForEnvironment("live", "rk_live_example")).toBe(
      "rk_live_example",
    );
    expect(() =>
      validateStripeSecretKeyForEnvironment("live", "sk_test_example"),
    ).toThrow("STRIPE_LIVE_SECRET_KEY must contain a live-mode Stripe secret key.");
  });
});
