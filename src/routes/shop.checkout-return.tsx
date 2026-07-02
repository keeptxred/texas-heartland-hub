import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { CART_STORAGE_KEY, ETSY_CHECKOUT_STORAGE_KEY, useCart } from "@/lib/cart-context";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/shop/checkout-return")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — Keep Texas Red" },
      { name: "description", content: "Thanks for supporting Keep Texas Red." },
      { name: "robots", content: "noindex,follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/shop/checkout-return` }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: CheckoutReturn,
});

function CheckoutReturn() {
  const { session_id: sessionId } = Route.useSearch();
  const cart = useCart();

  useEffect(() => {
    // Clear the bag after successful checkout.
    try {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      window.localStorage.removeItem(ETSY_CHECKOUT_STORAGE_KEY);
      window.sessionStorage.removeItem(ETSY_CHECKOUT_STORAGE_KEY);
    } catch {
      // ignore
    }
    cart.items.forEach((i) => cart.remove(i.key));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <section className="mx-auto max-w-[720px] px-6 py-20 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="font-display text-4xl md:text-5xl leading-tight">Thank you!</h1>
        <p className="mt-4 text-muted-foreground">
          Your order is confirmed{sessionId ? "" : ""}. A receipt has been emailed to you, and
          your Keep Texas Red merch is heading to production.
        </p>
        {sessionId && (
          <p className="mt-2 text-xs text-muted-foreground font-mono break-all">
            Order reference: {sessionId}
          </p>
        )}
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/shop"
            className="inline-flex rounded-lg bg-primary text-primary-foreground px-5 py-3 font-semibold hover:bg-primary/90"
          >
            Keep shopping
          </Link>
          <Link
            to="/"
            className="inline-flex rounded-lg border border-border bg-background px-5 py-3 font-semibold hover:bg-muted"
          >
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}