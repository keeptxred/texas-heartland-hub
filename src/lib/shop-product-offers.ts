import type { Product, ProductVariant } from "@/lib/products.functions";
import { parseProductVariantOptions } from "@/lib/product-variant-options";

export function variantPrice(product: Product, variant: ProductVariant): number {
  return Number(variant.price ?? product.price);
}

export function availableProductVariants(product: Product): ProductVariant[] {
  return (product.variants ?? []).filter((variant) =>
    variant.is_enabled !== false &&
    Number.isInteger(variant.id) &&
    Number.isFinite(variantPrice(product, variant)) &&
    variantPrice(product, variant) > 0
  );
}

export function variantOptions(variant: ProductVariant) {
  return parseProductVariantOptions(variant.title, variant.color);
}

export function initialProductVariant(product: Product): ProductVariant | undefined {
  const variants = availableProductVariants(product);
  return variants.find((variant) => variantPrice(product, variant) === product.price) ?? variants[0];
}

export function productPriceRange(product: Product): { min: number; max: number } | null {
  const prices = availableProductVariants(product).map((variant) => variantPrice(product, variant));
  return prices.length ? { min: Math.min(...prices), max: Math.max(...prices) } : null;
}

export function productOfferImage(product: Product, variant: ProductVariant): string {
  return variant.image || variant.images?.[0] || product.image;
}

export function chooseVariant(product: Product, color: string | null, size: string | null): ProductVariant | undefined {
  const matchingColor = availableProductVariants(product).filter((variant) => variantOptions(variant).color === color);
  return matchingColor.find((variant) => variantOptions(variant).size === size) ?? matchingColor[0];
}
