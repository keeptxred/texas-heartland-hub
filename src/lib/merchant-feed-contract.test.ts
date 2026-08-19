import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  qualifiesForFreeShipping,
} from "@/lib/checkout.functions";

const feed = readFileSync("src/routes/google-merchant-feed[.]xml.ts", "utf8");
const robots = readFileSync("src/routes/robots[.]txt.ts", "utf8");

describe("Google Merchant feed contract", () => {
  it("matches the checkout rule that shipping is free only above $35", () => {
    expect(FREE_SHIPPING_THRESHOLD_CENTS).toBe(3500);
    expect(qualifiesForFreeShipping(3500)).toBe(false);
    expect(qualifiesForFreeShipping(3501)).toBe(true);
    // Google defines price_threshold as the order cost ABOVE which shipping is free.
    expect(feed).toContain("const FREE_SHIPPING_THRESHOLD_USD = 35;");
    expect(feed).toContain("<g:price_threshold>${FREE_SHIPPING_THRESHOLD_USD.toFixed(2)} USD</g:price_threshold>");
  });

  it("routes catalog images through the Merchant image URL normalizer", () => {
    expect(feed).toContain("merchantImageUrl(product.image)");
    expect(feed).toContain("merchantImageUrl(variant.image || variant.images?.[0] || product.image)");
  });

  it("keeps the first-party Merchant image endpoint crawlable", () => {
    expect(robots).not.toContain("Disallow: /merchant-image");
    expect(robots).toContain('"Allow: /"');
    expect(robots).toContain('"Googlebot-Image"');
    expect(robots).toContain('"Storebot-Google"');
  });
});
