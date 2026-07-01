import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SITE_URL } from "@/lib/seo";
import { getProducts, type Product } from "@/lib/products.functions";

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

type CartItem = { product: Product; qty: number };

function ShopPage() {
  const { data } = useSuspenseQuery(productsQuery);
  const products = data?.products ?? [];
  const loadError = data?.error;
  console.log("PRODUCT DATA:", products);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const updateQty = (id: string, qty: number) =>
    setCart((prev) => (qty <= 0 ? prev.filter((i) => i.product.id !== id) : prev.map((i) => (i.product.id === id ? { ...i, qty } : i))));

  const cartCount = cart.reduce((n, i) => n + i.qty, 0);
  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.product.price * i.qty, 0), [cart]);
  const subtotalFormatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(subtotal);

  const checkout = () => {
    cart.forEach((i) => window.open(i.product.url, "_blank", "noopener,noreferrer"));
  };

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
                Every order helps keep our newsroom independent. Add items to your bag and check out securely in one click.
              </p>
            </div>
            <button
              onClick={() => setCartOpen(true)}
              className="relative shrink-0 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
              aria-label={`Open bag, ${cartCount} items`}
            >
              <span>🛍 Bag</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold">
                  {cartCount}
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

      <div
        className={`fixed inset-0 z-[110] transition-opacity ${cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!cartOpen}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
        <aside
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl flex flex-col transition-transform duration-300 ease-out ${cartOpen ? "translate-x-0" : "translate-x-full"}`}
          role="dialog"
          aria-modal="true"
          aria-label="Shopping bag"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div>
              <h2 className="font-display text-xl leading-none">Your Bag</h2>
              <p className="text-xs text-muted-foreground mt-1">{cartCount} {cartCount === 1 ? "item" : "items"}</p>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              aria-label="Close bag"
              className="text-muted-foreground hover:text-foreground text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="text-4xl mb-3">🛍</div>
                <p className="font-semibold">Your bag is empty</p>
                <p className="text-sm text-muted-foreground mt-1">Add a piece of Texas to get started.</p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="mt-6 text-sm font-semibold text-primary hover:underline"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <ul className="space-y-4">
                {cart.map((i) => (
                  <li key={i.product.id} className="flex gap-3 pb-4 border-b border-border last:border-0">
                    <img src={i.product.image} alt={i.product.title} className="h-20 w-20 rounded-lg object-cover bg-muted shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold leading-tight line-clamp-2">{i.product.title}</h3>
                        <button
                          onClick={() => updateQty(i.product.id, 0)}
                          aria-label="Remove"
                          className="text-muted-foreground hover:text-destructive text-xs"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center border border-border rounded-md">
                          <button
                            onClick={() => updateQty(i.product.id, i.qty - 1)}
                            className="w-7 h-7 hover:bg-muted text-sm"
                            aria-label="Decrease"
                          >−</button>
                          <span className="w-7 text-center text-sm">{i.qty}</span>
                          <button
                            onClick={() => updateQty(i.product.id, i.qty + 1)}
                            className="w-7 h-7 hover:bg-muted text-sm"
                            aria-label="Increase"
                          >+</button>
                        </div>
                        <span className="font-semibold text-sm">
                          {new Intl.NumberFormat("en-US", { style: "currency", currency: i.product.currency }).format(i.product.price * i.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-border bg-secondary/30 px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-display text-xl font-semibold">{subtotalFormatted}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Shipping & tax calculated at checkout.</p>
              <button
                onClick={checkout}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold tracking-wide px-6 py-4 shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                Proceed to Secure Checkout
                <span aria-hidden>→</span>
              </button>
              <p className="text-[11px] text-center text-muted-foreground">
                🔒 256-bit SSL encrypted • Your payment info is never stored on our servers.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}