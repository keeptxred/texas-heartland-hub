import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const paymentFacingFiles = [
  "src/routes/shop.checkout.tsx",
  "src/routes/shop.checkout-return.tsx",
  "src/routes/shop.checkout-sandbox.tsx",
  "src/routes/shop.checkout-sandbox-return.tsx",
  "src/components/StripeEmbeddedCheckout.tsx",
  "src/routes/api/public/texasdefined-checkout.ts",
].map((path) => ({ path, source: readFileSync(path, "utf8") }));

const checkoutFunctions = readFileSync("src/lib/checkout.functions.ts", "utf8");
const header = readFileSync("src/components/site-header.tsx", "utf8");
const footer = readFileSync("src/components/site-footer.tsx", "utf8");

describe("shared checkout branding", () => {
  it("keeps payment-facing copy free of storefront identification", () => {
    for (const { path, source } of paymentFacingFiles) {
      expect(source, path).not.toMatch(/Keep (?:TX|Texas) Red/i);
      expect(source, path).not.toMatch(/Texas Defined/i);
    }
  });

  it("uses generic payment descriptions and shipping validation", () => {
    expect(checkoutFunctions).toContain('description: "Online Shop Order"');
    expect(checkoutFunctions).toContain('Orders currently ship only to U.S. addresses.');
    expect(checkoutFunctions).not.toContain('description: "Keep Texas Red');
    expect(checkoutFunctions).not.toContain('Keep Texas Red currently ships');
  });

  it("removes KTR site chrome from checkout and confirmation routes", () => {
    expect(header).toContain('pathname.startsWith("/shop/checkout")');
    expect(header).toContain("if (isPaymentRoute) return null");
    expect(footer).toContain('pathname.startsWith("/shop/checkout")');
    expect(footer).toContain("return null");
  });

  it("overrides hosted TexasDefined Checkout with neutral per-session branding", () => {
    const source = paymentFacingFiles.find(({ path }) =>
      path.endsWith("texasdefined-checkout.ts")
    )?.source ?? "";
    expect(source).toContain('display_name: "Secure Checkout"');
    expect(source).toContain('secure-checkout-icon.png');
    expect(source).toContain('description: "Online Shop Order"');
  });
});
