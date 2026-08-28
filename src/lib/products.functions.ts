import { createServerFn } from "@tanstack/react-start";
import { parseProductVariantOptions } from "@/lib/product-variant-options";

export type ProductVariant = {
  id: number;
  title: string;
  price: number;
  image: string | null;
  images?: string[];
  color: string;
  size?: string;
  is_enabled?: boolean;
};

export type Product = {
  id: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  url: string;
  description: string;
  tags?: string[];
  colors?: string[];
  variants?: ProductVariant[];
  category?: string | null;
  collections?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  syncedAt?: string | null;
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: "ktr-tee-red",
    title: "Keep Texas Red — Classic Tee",
    price: 24.99,
    currency: "USD",
    image: "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/shop",
    description: "Soft cotton tee with the Keep Texas Red mark. Printed in Texas.",
    category: "shirts",
    collections: ["texas", "patriotic", "conservative"],
    isFeatured: true,
    isNew: false,
    isOnSale: false,
  },
  {
    id: "ktr-cap",
    title: "Lone Star Structured Cap",
    price: 29.0,
    currency: "USD",
    image: "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/shop",
    description: "Six-panel cap with embroidered Texas star. Adjustable strap.",
    category: "hats",
    collections: ["texas"],
    isFeatured: false,
    isNew: false,
    isOnSale: false,
  },
  {
    id: "ktr-flag-print",
    title: "Texas Flag Poster Print",
    price: 18.0,
    currency: "USD",
    image: "https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/shop",
    description: "18x24 archival poster print of the Texas state flag.",
    category: "accessories",
    collections: ["texas", "patriotic"],
    isFeatured: false,
    isNew: false,
    isOnSale: false,
  },
  {
    id: "ktr-mug",
    title: "Don't Mess With Texas Mug",
    price: 15.0,
    currency: "USD",
    image: "https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/shop",
    description: "12oz ceramic mug. Dishwasher and microwave safe.",
    category: "drinkware",
    collections: ["texas"],
    isFeatured: false,
    isNew: false,
    isOnSale: false,
  },
];

type ProductsResult = {
  products: Product[];
  error?: string;
  /** True only when the local demo catalog was returned because live data was unavailable. */
  isFallback?: boolean;
};

function normalizeVariant(variant: ProductVariant): ProductVariant {
  const parsed = parseProductVariantOptions(variant.title, variant.color);
  return {
    ...variant,
    color: parsed.color ?? "",
    ...(parsed.size ? { size: parsed.size } : {}),
  };
}

export const getProducts = createServerFn({ method: "GET" }).handler(async (): Promise<ProductsResult> => {
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return { products: MOCK_PRODUCTS, isFallback: true };

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("products")
      // KeepTXRed shows only products assigned to KeepTXRed or Both, using its own
      // category/collections/featured/display-order columns.
      .select("id,title,price,currency,image_url,product_url,description,tags,colors,variants,keeptxred_category,keeptxred_collections,keeptxred_featured,keeptxred_display_order,is_new,is_on_sale,synced_at")
      .eq("publish_keeptxred", true)
      .order("keeptxred_featured", { ascending: false })
      .order("keeptxred_display_order", { ascending: true })
      .order("synced_at", { ascending: false })
      .limit(120);
    if (error || !data || (Array.isArray(data) && data.length === 0)) {
      return {
        products: MOCK_PRODUCTS,
        error: error?.message ?? "No active products were returned.",
        isFallback: true,
      };
    }
    const products: Product[] = (data as Array<{
      id: string;
      title: string;
      price: number | string;
      currency: string;
      image_url: string;
      product_url: string;
      description: string;
      tags: string[] | null;
      colors: string[] | null;
      variants: ProductVariant[] | null;
      keeptxred_category: string | null;
      keeptxred_collections: string[] | null;
      keeptxred_featured: boolean | null;
      is_new: boolean | null;
      is_on_sale: boolean | null;
      synced_at: string | null;
    }>).map((r) => {
      const variants = Array.isArray(r.variants) ? r.variants.map(normalizeVariant) : [];
      const normalizedColors = Array.from(new Set(variants.map((variant) => variant.color).filter(Boolean)));

      return {
        id: r.id,
        title: r.title,
        price: typeof r.price === "string" ? Number(r.price) : r.price,
        currency: r.currency || "USD",
        image: r.image_url,
        url: r.product_url,
        description: r.description ?? "",
        tags: r.tags ?? [],
        colors: normalizedColors,
        variants,
        category: r.keeptxred_category,
        collections: r.keeptxred_collections ?? [],
        isFeatured: Boolean(r.keeptxred_featured),
        isNew: Boolean(r.is_new),
        isOnSale: Boolean(r.is_on_sale),
        syncedAt: r.synced_at,
      };
    });
    return { products, isFallback: false };
  } catch (error) {
    return {
      products: MOCK_PRODUCTS,
      error: error instanceof Error ? error.message : "Unable to load products.",
      isFallback: true,
    };
  }
});
