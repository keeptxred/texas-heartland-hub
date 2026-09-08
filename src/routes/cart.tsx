import { createFileRoute, Link } from "@tanstack/react-router";
import { CartProvider, useCart } from "@/lib/cart-context";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Cart — Keep Texas Red" },
      {
        name: "description",
        content: "Review your Keep Texas Red shopping cart and continue to secure checkout.",
      },
      { name: "robots", content: "noindex,follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/cart` }],
  }),
  component: CartRoute,
});

function CartRoute() {
  return (
    <CartProvider>
      <CartPage />
    </CartProvider>
  );
}

function CartPage() {
  const { items, count, subtotal, updateQty, remove, checkout } = useCart();
  const currency = items[0]?.currency ?? "USD";
  const formatMoney = (value: number, itemCurrency = currency) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: itemCurrency,
    }).format(value);

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-[1100px] px-6 py-10">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
            Keep TX Red Shop
          </div>
          <h1 className="font-display text-3xl leading-tight md:text-4xl">Your Cart</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/90">
            Review your items, update quantities, and continue to secure checkout.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-10">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <div className="mb-3 text-4xl">🛍</div>
            <h2 className="mb-2 font-display text-2xl">Your cart is empty</h2>
            <p className="mb-6 text-muted-foreground">Add something from the Keep TX Red shop to get started.</p>
            <Link
              to="/shop"
              search={{ category: undefined, collection: undefined, q: undefined, sort: undefined }}
              className="inline-flex rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="rounded-2xl border border-border bg-card p-4 md:p-6">
              <div className="mb-5 flex items-center justify-between gap-4 border-b border-border pb-4">
                <h2 className="font-display text-2xl">Cart items</h2>
                <span className="text-sm text-muted-foreground">
                  {count} {count === 1 ? "item" : "items"}
                </span>
              </div>

              <ul className="space-y-5">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-4 border-b border-border pb-5 last:border-0 last:pb-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-24 w-24 shrink-0 rounded-xl bg-muted object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold leading-tight">{item.title}</h3>
                          {(item.color || item.size) && (
                            <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                              {[item.color, item.size].filter(Boolean).join(" · ")}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(item.key)}
                          className="text-xs font-semibold text-muted-foreground hover:text-destructive"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-md border border-border">
                          <button
                            type="button"
                            onClick={() => updateQty(item.key, item.qty - 1)}
                            className="h-9 w-9 text-sm hover:bg-muted"
                            aria-label={`Decrease quantity of ${item.title}`}
                          >
                            −
                          </button>
                          <span className="w-9 text-center text-sm" aria-label={`Quantity ${item.qty}`}>
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.key, item.qty + 1)}
                            className="h-9 w-9 text-sm hover:bg-muted"
                            aria-label={`Increase quantity of ${item.title}`}
                          >
                            +
                          </button>
                        </div>
                        <span className="font-semibold">{formatMoney(item.price * item.qty, item.currency)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
              <h2 className="font-display text-xl">Order summary</h2>
              <div className="mt-5 flex items-center justify-between border-b border-border pb-4">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-display text-xl font-semibold">{formatMoney(subtotal)}</span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Shipping, discounts, and applicable taxes are calculated during checkout.
              </p>
              <button
                type="button"
                onClick={checkout}
                className="mt-5 w-full rounded-lg bg-primary px-5 py-3 font-display font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
              >
                Proceed to Checkout
              </button>
              <Link
                to="/shop"
                search={{ category: undefined, collection: undefined, q: undefined, sort: undefined }}
                className="mt-3 block text-center text-sm font-semibold text-primary hover:underline"
              >
                Continue shopping
              </Link>
              <p className="mt-4 text-center text-[11px] text-muted-foreground">🔒 Secure payment powered by Stripe.</p>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
