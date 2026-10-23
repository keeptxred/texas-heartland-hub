import { printifyDescription } from "./printify-description";
import { parseProductVariantOptions } from "./product-variant-options";

type PrintifyImage = {
  src: string;
  is_default?: boolean;
  position?: string;
  variant_ids?: number[];
};
type PrintifyVariant = {
  id: number;
  title?: string;
  price: number;
  is_enabled: boolean;
  is_default?: boolean;
};
export type PrintifyProduct = {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  images?: PrintifyImage[];
  variants?: PrintifyVariant[];
  visible?: boolean;
  is_locked?: boolean;
  external?: { handle?: string };
};

export type WebsiteSettings = {
  is_active: boolean;
  category: string | null;
  collections: string[];
  is_featured: boolean;
  is_new: boolean;
  is_on_sale: boolean;
  publish_keeptxred: boolean;
  publish_texasdefined: boolean;
  keeptxred_category: string | null;
  texasdefined_category: string | null;
  keeptxred_collections: string[];
  texasdefined_collections: string[];
  keeptxred_featured: boolean;
  texasdefined_featured: boolean;
  keeptxred_display_order: number;
  texasdefined_display_order: number;
};

function variantIdFromSrc(src: string): number | null {
  const match = src.match(/\/mockup\/[^/]+\/(\d+)\//);
  return match ? Number(match[1]) : null;
}

function imagesForVariant(
  variantId: number,
  images: PrintifyImage[],
  visualOptionByVariantId: Map<number, string>,
): PrintifyImage[] {
  const exactMatches = images.filter((image) => variantIdFromSrc(image.src) === variantId);
  if (exactMatches.length > 0) return exactMatches;

  const desiredOption = visualOptionByVariantId.get(variantId);
  if (desiredOption) {
    const optionMatches = images.filter((image) => {
      const mockupVariantId = variantIdFromSrc(image.src);
      return (
        mockupVariantId != null && visualOptionByVariantId.get(mockupVariantId) === desiredOption
      );
    });
    if (optionMatches.length > 0) return optionMatches;
  }

  return images.filter((image) => (image.variant_ids ?? []).includes(variantId));
}

function extractColors(variants: PrintifyVariant[]): string[] {
  const colors = new Set<string>();
  for (const variant of variants) {
    const { color } = parseProductVariantOptions(variant.title);
    if (color) colors.add(color);
  }
  return Array.from(colors);
}

function pickPrimaryImage(images: PrintifyImage[]): string {
  if (images.length === 0) return "";
  return (
    images.find((image) => image.is_default)?.src ??
    images.find((image) => (image.position ?? "").toLowerCase() === "front")?.src ??
    images[0].src
  );
}

function buildVariants(
  variants: PrintifyVariant[],
  images: PrintifyImage[],
): Array<{
  id: number;
  title: string;
  price: number;
  image: string | null;
  images: string[];
  color: string;
  size?: string;
  is_enabled: boolean;
}> {
  const visualOptionByVariantId = new Map<number, string>();
  for (const variant of variants) {
    const parsed = parseProductVariantOptions(variant.title);
    const visualOption = parsed.color ?? parsed.size;
    if (visualOption) visualOptionByVariantId.set(variant.id, visualOption);
  }

  return variants
    .filter((variant) => variant.is_enabled && variant.title)
    .map((variant) => {
      const parsed = parseProductVariantOptions(variant.title);
      const matches = imagesForVariant(variant.id, images, visualOptionByVariantId);
      const variantImages = matches.map((image) => image.src);
      return {
        id: variant.id,
        title: variant.title!,
        price: Math.round(variant.price) / 100,
        image: variantImages[0] ?? null,
        images: variantImages,
        color: parsed.color ?? "",
        ...(parsed.size ? { size: parsed.size } : {}),
        is_enabled: variant.is_enabled,
      };
    });
}

export function mapProduct(product: PrintifyProduct, settings?: WebsiteSettings) {
  const enabledVariants = (product.variants ?? []).filter((variant) => variant.is_enabled);
  const chosenVariant = enabledVariants.find((variant) => variant.is_default) ?? enabledVariants[0];
  const image = pickPrimaryImage(product.images ?? []);
  const externalHandle = product.external?.handle;
  const productUrl = externalHandle
    ? externalHandle.startsWith("http")
      ? externalHandle
      : `https://${externalHandle}`
    : `https://printify.com/app/store/products/${product.id}`;

  return {
    id: product.id,
    printify_product_id: product.id,
    title: product.title,
    description: printifyDescription(product.description),
    price: Math.round(chosenVariant?.price ?? 0) / 100,
    currency: "USD",
    image_url: image,
    product_url: productUrl,
    tags: product.tags ?? [],
    colors: extractColors(enabledVariants),
    variants: buildVariants(product.variants ?? [], product.images ?? []),
    source: "printify",
    synced_at: new Date().toISOString(),

    is_active: settings?.is_active ?? false,
    category: settings?.category ?? null,
    collections: settings?.collections ?? [],
    is_featured: settings?.is_featured ?? false,
    is_new: settings?.is_new ?? false,
    is_on_sale: settings?.is_on_sale ?? false,

    publish_keeptxred: settings?.publish_keeptxred ?? false,
    publish_texasdefined: settings?.publish_texasdefined ?? false,
    keeptxred_category: settings?.keeptxred_category ?? null,
    texasdefined_category: settings?.texasdefined_category ?? null,
    keeptxred_collections: settings?.keeptxred_collections ?? [],
    texasdefined_collections: settings?.texasdefined_collections ?? [],
    keeptxred_featured: settings?.keeptxred_featured ?? false,
    texasdefined_featured: settings?.texasdefined_featured ?? false,
    keeptxred_display_order: settings?.keeptxred_display_order ?? 0,
    texasdefined_display_order: settings?.texasdefined_display_order ?? 0,
  };
}
