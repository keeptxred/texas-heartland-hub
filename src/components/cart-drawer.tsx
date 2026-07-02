import { useCart } from "@/lib/cart-context";

export function CartButton() {
  const { count, open } = useCart();
  return (
    <button
      onClick={open}
      className="fixed bottom-6 right-6 z-[100] inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 shadow-xl shadow-primary/30 hover:bg-primary/90 transition-colors font-semibold"
      aria-label={`Open bag, ${count} items`}
    >
      <span>🛍 Bag</span>
      <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-white/20 text-[11px] font-bold">
        {count}
      </span>
    </button>
  );
}

export function CartDrawer() {
  const { items, isOpen, close, updateQty, remove, subtotal, count, checkout } = useCart();

  const subtotalFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: items[0]?.currency ?? "USD",
  }).format(subtotal);

  return (
    <div
      className={`fixed inset-0 z-[110] transition-opacity ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-display text-xl leading-none">Your Cart</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {count} {count === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={close}
            aria-label="Close bag"
            className="text-muted-foreground hover:text-foreground text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="text-4xl mb-3">🛍</div>
              <p className="font-semibold">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Add a piece of Texas to get started.</p>
              <button onClick={close} className="mt-6 text-sm font-semibold text-primary hover:underline">
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={i.key} className="flex gap-3 pb-4 border-b border-border last:border-0">
                  <img
                    src={i.image}
                    alt={i.title}
                    className="h-20 w-20 rounded-lg object-cover bg-muted shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold leading-tight line-clamp-2">{i.title}</h3>
                      <button
                        onClick={() => remove(i.key)}
                        aria-label="Remove"
                        className="text-muted-foreground hover:text-destructive text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    {(i.color || i.size) && (
                      <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                        {[i.color, i.size].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center border border-border rounded-md">
                        <button
                          onClick={() => updateQty(i.key, i.qty - 1)}
                          className="w-7 h-7 hover:bg-muted text-sm"
                          aria-label="Decrease"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-sm">{i.qty}</span>
                        <button
                          onClick={() => updateQty(i.key, i.qty + 1)}
                          className="w-7 h-7 hover:bg-muted text-sm"
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-semibold text-sm">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: i.currency,
                        }).format(i.price * i.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border bg-secondary/30 px-6 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-display text-xl font-semibold">{subtotalFormatted}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              We keep every item in your bag and hand you off to the matching Etsy listings for secure purchase.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={close}
                className="rounded-lg border border-border bg-background font-semibold px-4 py-3 text-sm hover:bg-muted transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={checkout}
                className="rounded-lg bg-primary text-primary-foreground font-display font-semibold px-4 py-3 text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
              >
                Check out on Etsy
              </button>
            </div>
            <p className="text-[11px] text-center text-muted-foreground">
              🔒 Secure checkout handled by Etsy.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}