import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ETSY_CHECKOUT_STORAGE_KEY, type CartItem, useCart } from "@/lib/cart-context";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/shop/etsy-checkout")({
  head: () => ({
    meta: [
      { title: "Etsy Checkout — Keep Texas Red" },
      { name: "description", content: "Review your Keep Texas Red bag and complete secure checkout on Etsy." },
      { name: "robots", content: "noindex,follow" },
      { property: "og:title", content: "Etsy Checkout — Keep Texas Red" },
      { property: "og:description", content: "Review your Keep Texas Red bag and complete secure checkout on Etsy." },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/shop/etsy-checkout` }],
  }),
  component: EtsyCheckoutPage,
});

function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
}

function restoreCheckoutItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw =
    window.sessionStorage.getItem(ETSY_CHECKOUT_STORAGE_KEY) ||
    window.localStorage.getItem(ETSY_CHECKOUT_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getEtsyCartUrl() {
  return "https://www.etsy.com/cart?ref=keeptxred_checkout&utm_source=keeptxred.com&utm_medium=shop_checkout_handoff";
}

function optionText(item: CartItem) {
  return [item.color, item.size].filter(Boolean).join(" · ");
}

function EtsyCheckoutPage() {
  const cart = useCart();
  const [storedItems, setStoredItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setStoredItems(restoreCheckoutItems());
  }, []);

  const items = cart.items.length > 0 ? cart.items : storedItems;
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.qty, 0), [items]);
  const currency = items[0]?.currency ?? "USD";

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-[1100px] px-6 py-12">
          <div className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-3">
            Keep TX Red Shop
          </div>
          <h1 className="font-display text-4xl md:text-5xl leading-tight">Complete your purchase on Etsy</h1>
          <p className="mt-4 max-w-3xl text-white/70">
            Your Keep Texas Red bag is preserved below. Review the items, then continue to Etsy for secure payment.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-12">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <div className="text-4xl mb-3">🛍</div>
            <h2 className="font-display text-2xl mb-2">No checkout items found</h2>
            <p className="text-muted-foreground mb-6">Add products to your bag first, then return to checkout.</p>
            <Link
              to="/shop"
              className="inline-flex rounded-lg bg-primary text-primary-foreground px-5 py-3 font-semibold hover:bg-primary/90"
            >
              Back to shop
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              {items.map((item, index) => (
                <article key={`${item.key}-${index}`} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-24 w-24 rounded-xl object-cover bg-muted shrink-0"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="font-display text-lg leading-tight">{item.title}</h2>
                          {optionText(item) && (
                            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                              {optionText(item)}
                            </p>
                          )}
                          <p className="mt-2 text-sm text-muted-foreground">
                            Quantity: <span className="font-semibold text-foreground">{item.qty}</span>
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-semibold">{formatMoney(item.price * item.qty, item.currency)}</p>
                          <p className="text-xs text-muted-foreground">{formatMoney(item.price, item.currency)} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="rounded-2xl border border-border bg-card p-6 h-fit lg:sticky lg:top-24">
              <h2 className="font-display text-2xl">Order handoff</h2>
              <div className="mt-5 space-y-3 border-b border-border pb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-semibold">{items.reduce((n, item) => n + item.qty, 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatMoney(subtotal, currency)}</span>
                </div>
              </div>
              <p className="mt-5 text-xs text-muted-foreground leading-relaxed">
                Etsy calculates final shipping, tax, discounts, and payment details. Your selected Keep Texas Red items
                remain listed here for review before payment.
              </p>
              <a
                href={getEtsyCartUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full rounded-lg bg-primary text-primary-foreground font-display font-semibold px-4 py-3 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
              >
                Check out on Etsy
              </a>
              <Link
                to="/shop"
                className="mt-3 block w-full rounded-lg border border-border bg-background px-4 py-3 text-center text-sm font-semibold hover:bg-muted transition-colors"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}