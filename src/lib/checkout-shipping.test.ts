import { describe, expect, it } from "vitest";
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  STRIPE_CHECKOUT_UI_MODE,
  assertCheckoutEnvironmentMatchesReturnUrl,
  getStandardShippingCents,
  priceToCents,
  qualifiesForFreeShipping,
} from "@/lib/checkout.functions";

describe("checkout shipping policy", () => {
  it("uses Stripe's current embedded Checkout UI mode", () => {
    expect(STRIPE_CHECKOUT_UI_MODE).toBe("embedded");
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
