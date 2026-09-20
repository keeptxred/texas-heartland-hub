import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  STRIPE_CHECKOUT_UI_MODE,
  assertCheckoutEnvironmentMatchesReturnUrl,
  assertCheckoutFulfillmentRuntimeReady,
  getStandardShippingCents,
  priceToCents,
  qualifiesForFreeShipping,
} from "@/lib/checkout.functions";

const checkoutSource = readFileSync("src/lib/checkout.functions.ts", "utf8");

describe("checkout shipping policy", () => {
  it("uses Stripe's supported Checkout Sessions + Elements UI mode", () => {
    expect(STRIPE_CHECKOUT_UI_MODE).toBe("elements");
  });

  it("does not use the deprecated Embedded Checkout shipping permission", () => {
    expect(checkoutSource).not.toContain("update_shipping_details");
    expect(checkoutSource).not.toContain("Shipping calculated after address");
    expect(checkoutSource).toContain("quotePrintifyStandardShipping");
    expect(checkoutSource).toContain("shipping_options");
  });

  it("charges shipping at exactly $35", () => {
    expect(FREE_SHIPPING_THRESHOLD_CENTS).toBe(3500);
    expect(qualifiesForFreeShipping(3500)).toBe(false);
  });

  it("makes shipping free only above $35", () => {
    expect(qualifiesForFreeShipping(3501)).toBe(true);
    expect(qualifiesForFreeShipping(5000)).toBe(true);
  });

  it("uses Printify's standard quote in cents", () => {
    expect(getStandardShippingCents({ standard: 699 })).toBe(699);
    expect(getStandardShippingCents({ standard: 0 })).toBe(0);
  });

  it("rejects a missing or malformed Printify standard quote", () => {
    expect(() => getStandardShippingCents({})).toThrow(
      "Printify did not return a valid standard shipping rate.",
    );
    expect(() => getStandardShippingCents({ standard: -1 })).toThrow();
    expect(() => getStandardShippingCents({ standard: 4.5 })).toThrow();
  });

  it("converts authoritative product prices to Stripe cents", () => {
    expect(priceToCents(24.99)).toBe(2499);
    expect(priceToCents("43.89")).toBe(4389);
  });

  it("rejects invalid authoritative prices", () => {
    expect(() => priceToCents(0)).toThrow();
    expect(() => priceToCents(-1)).toThrow();
    expect(() => priceToCents("not-a-price")).toThrow();
  });

  it("allows each Stripe environment only on its matching return route", () => {
    expect(() =>
      assertCheckoutEnvironmentMatchesReturnUrl(
        "sandbox",
        "https://keeptxred.com/shop/checkout-sandbox-return?session_id={CHECKOUT_SESSION_ID}",
      ),
    ).not.toThrow();
    expect(() =>
      assertCheckoutEnvironmentMatchesReturnUrl(
        "live",
        "https://keeptxred.com/shop/checkout-return?session_id={CHECKOUT_SESSION_ID}",
      ),
    ).not.toThrow();
  });

  it("fails live checkout closed when fulfillment runtime is incomplete", () => {
    expect(() =>
      assertCheckoutFulfillmentRuntimeReady("live", {
        PRINTIFY_API_TOKEN: "token",
        PRINTIFY_SHOP_ID: "shop",
        SUPABASE_SERVICE_ROLE_KEY: "service",
      }),
    ).toThrow("Checkout is temporarily unavailable. Please try again later.");
  });

  it("allows live checkout only when webhook and fulfillment bindings are present", () => {
    expect(() =>
      assertCheckoutFulfillmentRuntimeReady("live", {
        PAYMENTS_LIVE_WEBHOOK_SECRET: "whsec_example",
        PRINTIFY_API_TOKEN: "token",
        PRINTIFY_SHOP_ID: "shop",
        SUPABASE_SERVICE_ROLE_KEY: "service",
      }),
    ).not.toThrow();
  });

  it("does not require live fulfillment bindings for sandbox checkout", () => {
    expect(() => assertCheckoutFulfillmentRuntimeReady("sandbox", {})).not.toThrow();
  });

  it("blocks live/sandbox return-route crossover before creating a Stripe session", () => {
    expect(() =>
      assertCheckoutEnvironmentMatchesReturnUrl(
        "live",
        "https://keeptxred.com/shop/checkout-sandbox-return?session_id={CHECKOUT_SESSION_ID}",
      ),
    ).toThrow("Stripe live checkout cannot use the /shop/checkout-sandbox-return return route.");
    expect(() =>
      assertCheckoutEnvironmentMatchesReturnUrl(
        "sandbox",
        "https://keeptxred.com/shop/checkout-return?session_id={CHECKOUT_SESSION_ID}",
      ),
    ).toThrow("Stripe sandbox checkout cannot use the /shop/checkout-return return route.");
  });
});
