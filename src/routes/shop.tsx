import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { SITE_URL } from "@/lib/seo";
import { getProducts, type Product } from "@/lib/products.functions";

const productsQuery = queryOptions({
  queryKey: ["products", "listings"],
  queryFn: () => getProducts(),
  staleTime: 5 * 60 * 1000,
});

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Keep Texas Red" },
      { name: "description", content: "Texas-made apparel, prints, and accessories from the Keep Texas Red shop. Ships from our Etsy storefront." },
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

type CartItem = { product: Product; qty: number };

function ShopPage() {
  const { data, isLoading, isError } = useQuery(productsQuery);
  const products = data?.products ?? [];
  const loadError = data?.error;
  const [active, setActive] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToBag = (p: Product) => {
    setCart((prev) => {
      const found = prev.find((i) => i.product.id === p.id);
      if (found) return prev.map((i) => (i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { product: p, qty: 1 }];
    });
    setActive(null);
    setCartOpen(true);
  };

  const updateQty = (id: string, qty: number) =>
    setCart((prev) => (qty <= 0 ? prev.filter((i) => i.product.id !== id) : prev.map((i) => (i.product.id === id ? { ...i, qty } : i))));

  const cartCount = cart.reduce((n, i) => n + i.qty, 0);
  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.product.price * i.qty, 0), [cart]);
  const subtotalFormatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(subtotal);

  const checkout = () => {
    // Open each item's secure checkout link in a new tab. Replace product.url
    // with the Etsy listing's checkout URL once the API is wired.
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
        {isLoading && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading && (isError || loadError || products.length === 0) && (
          <div className="text-center py-20">
            <h2 className="font-display text-2xl mb-2">Store is restocking</h2>
            <p className="text-muted-foreground">
              {loadError ? "We couldn't load live listings right now. Please check back soon." : "No active listings right now. Check back soon."}
            </p>
          </div>
        )}
        {!isLoading && products.length > 0 && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p)}
              className="group text-left bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={p.image}
                  alt={p.title}
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
                {p.colors && p.colors.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.colors.map((color) => (
                      <span key={color} className="inline-block rounded-full border border-border bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                        {color}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
        )}
      </section>

      {active && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <div
            className="bg-card rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl grid md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-square md:aspect-auto bg-muted">
              <img src={active.image} alt={active.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-6 md:p-8 flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-2xl leading-tight">{active.title}</h2>
                <button
                  onClick={() => setActive(null)}
                  aria-label="Close"
                  className="text-muted-foreground hover:text-foreground text-2xl leading-none -mt-1"
                >
                  ×
                </button>
              </div>
              <div className="mt-2 text-2xl font-semibold text-primary">{formatPrice(active)}</div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{active.description}</p>
              <button
                onClick={() => addToBag(active)}
                className="mt-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add to Bag
              </button>
              <p className="mt-3 text-[11px] text-muted-foreground text-center">
                Secure checkout. Free returns within 30 days.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over cart */}
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