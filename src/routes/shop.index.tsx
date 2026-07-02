import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SITE_URL } from "@/lib/seo";
import { getProducts, type Product } from "@/lib/products.functions";
import { useCart } from "@/lib/cart-context";

const productsQuery = queryOptions({
  queryKey: ["products", "listings"],
  queryFn: () => getProducts(),
  staleTime: 5 * 60 * 1000,
});

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop — Keep Texas Red" },
      { name: "description", content: "Texas-made apparel, prints, and accessories from the Keep Texas Red shop." },
      { property: "og:title", content: "Shop — Keep Texas Red" },
      { property: "og:description", content: "Texas-made apparel, prints, and accessories from the Keep Texas Red shop." },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/shop` }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: ShopPage,
});

function formatPrice(p: Product) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: p.currency }).format(p.price);
}

function ProductCard({ p }: { p: Product }) {
  // Group variants by color (ignoring size suffix like "Red / S" -> "Red")
  const colorToImage = new Map<string, string>();
  for (const v of p.variants ?? []) {
    const color = (v.color || v.title?.split("/")[0] || "").trim();
    if (!color) continue;
    if (!colorToImage.has(color) && v.image) colorToImage.set(color, v.image);
  }
  const colorChips = colorToImage.size > 0
    ? Array.from(colorToImage.keys())
    : (p.colors ?? []);

  // Each card owns its own selected color/variant state.
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const displayImage =
    (selectedColor && colorToImage.get(selectedColor)) || p.image;

  return (
    <Link
      to="/shop/$productId"
      params={{ productId: p.id }}
      className="group text-left bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          key={displayImage}
          src={displayImage}
          alt={selectedColor ? `${p.title} in ${selectedColor}` : p.title}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <h3 className="font-display text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {p.title}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-semibold">{formatPrice(p)}</span>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">View</span>
        </div>
        {colorChips.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {colorChips.map((color) => {
              const isSelected = color === selectedColor;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedColor(isSelected ? null : color);
                  }}
                  aria-pressed={isSelected}
                  className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary text-secondary-foreground hover:border-primary/60"
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
}

function ShopPage() {
  const { data } = useSuspenseQuery(productsQuery);
  const products = data?.products ?? [];
  const loadError = data?.error;
  const { count, open } = useCart();

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-[1200px] px-6 py-14">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-3">Keep TX Red — Official Shop</div>
              <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight max-w-3xl">
                Texas-made goods. Built for patriots.
              </h1>
              <p className="mt-4 max-w-2xl text-white/70">
                Every order helps keep our newsroom independent. Add items to your cart and check out securely in one click.
              </p>
            </div>
            <button
              onClick={open}
              className="relative shrink-0 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
              aria-label={`Open cart, ${count} items`}
            >
              <span>🛍 Cart</span>
              {count > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-12">
        {(loadError || products.length === 0) && (
          <div className="text-center py-20">
            <h2 className="font-display text-2xl mb-2">Store is restocking</h2>
            <p className="text-muted-foreground">
              {loadError ? "We couldn't load live listings right now. Please check back soon." : "No active listings right now. Check back soon."}
            </p>
          </div>
        )}
        {products.length > 0 && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}