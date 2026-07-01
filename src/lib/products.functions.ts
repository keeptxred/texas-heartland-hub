import { createServerFn } from "@tanstack/react-start";

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
  },
  {
    id: "ktr-cap",
    title: "Lone Star Structured Cap",
    price: 29.0,
    currency: "USD",
    image: "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/shop",
    description: "Six-panel cap with embroidered Texas star. Adjustable strap.",
  },
  {
    id: "ktr-flag-print",
    title: "Texas Flag Poster Print",
    price: 18.0,
    currency: "USD",
    image: "https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/shop",
    description: "18x24 archival poster print of the Texas state flag.",
  },
  {
    id: "ktr-mug",
    title: "Don't Mess With Texas Mug",
    price: 15.0,
    currency: "USD",
    image: "https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/shop",
    description: "12oz ceramic mug. Dishwasher and microwave safe.",
  },
];

export const getProducts = createServerFn({ method: "GET" }).handler(async (): Promise<{
  products: Product[];
  error?: string;
}> => {
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return { products: MOCK_PRODUCTS };

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("products")
      .select("id,title,price,currency,image_url,product_url,description,tags,colors")
      .eq("is_active", true)
      .order("synced_at", { ascending: false })
      .limit(120);
    if (error || !data || (Array.isArray(data) && data.length === 0)) {
      return { products: MOCK_PRODUCTS };
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
    }>).map((r) => ({
      id: r.id,
      title: r.title,
      price: typeof r.price === "string" ? Number(r.price) : r.price,
      currency: r.currency || "USD",
      image: r.image_url,
      url: r.product_url,
      description: r.description ?? "",
      tags: r.tags ?? [],
    }));
    return { products };
  } catch {
    return { products: MOCK_PRODUCTS };
  }
});