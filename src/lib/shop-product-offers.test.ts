import { describe, expect, it } from "vitest";
import type { Product } from "@/lib/products.functions";
import { availableProductVariants, initialProductVariant, productPriceRange, chooseVariant, variantOptions, variantPrice } from "@/lib/shop-product-offers";
import { readFileSync } from "node:fs";

const product: Product = {
  id: "test", title: "Test product", price: 34.98, currency: "USD", image: "/mockup.jpg",
  url: "/shop/test", description: "Test fixture", variants: [
    { id: 1, title: "3XL / White", color: "White", price: 28, image: "/white.jpg" },
    { id: 2, title: "M / Black", color: "Black", price: 34.98, image: "/black.jpg" },
    { id: 3, title: "5XL / Black", color: "Black", price: 41.98, image: "/black.jpg" },
    { id: 4, title: "S / White", color: "White", price: 1, image: null, is_enabled: false },
    { id: 5, title: "L / Black", color: "Black", price: 0, image: null },
  ],
};

describe("purchasable shop variants", () => {
  it("uses the exact enabled variant for initial price and excludes invalid offers", () => {
    expect(availableProductVariants(product).map(v => v.id)).toEqual([1, 2, 3]);
    expect(initialProductVariant(product)?.id).toBe(2);
    expect(productPriceRange(product)).toEqual({ min: 28, max: 41.98 });
    expect(variantPrice(product, chooseVariant(product, "Black", "5XL")!)).toBe(41.98);
    expect(chooseVariant(product, "White", "M")?.id).toBe(1);
    expect(chooseVariant(product, "Red", "S")).toBeUndefined();
  });
  it("normalizes literal escaped inch marks without treating dimensions as colors", () => {
    const sticker = { id: 6, title: '3\\" × 3\\" / White', color: "White", price: 5.99, image: null };
    expect(variantOptions(sticker)).toEqual({ color: "White", size: '3" × 3"' });
  });
  it("does not fabricate a purchasable option when all variants are disabled", () => {
    const unavailable = { ...product, variants: [product.variants![3]] };
    expect(initialProductVariant(unavailable)).toBeUndefined();
    expect(productPriceRange(unavailable)).toBeNull();
  });
  it("uses the same initial offer and selected-price calculation in the detail route", () => {
    const source = readFileSync("src/routes/shop.$productId.tsx", "utf8");
    expect(source).toContain("price: variantPrice(p, initial).toFixed(2)");
    expect(source).toContain("formatPrice(unitPrice, product.currency)");
    expect(source).toContain("price: unitPrice, qty, variant: selectedVariant");
    expect(source.match(/"@type": "Product"/g)).toHaveLength(1);
    expect(source).toContain("disabled={!selectedVariant}");
    expect(source).toContain("if (data.isFallback) throw");
    expect(readFileSync("src/routes/shop.index.tsx", "utf8")).toContain("data?.isFallback ? []");
  });
});
