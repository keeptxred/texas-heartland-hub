import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { CART_STORAGE_KEY, ETSY_CHECKOUT_STORAGE_KEY, useCart } from "@/lib/cart-context";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/shop/checkout-sandbox-return")({
  head: () => ({
    meta: [
      { title: "Sandbox Payment Complete — Keep Texas Red" },
      { name: "description", content: "Stripe sandbox checkout completed." },
      { name: "robots", content: "noindex,follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/shop/checkout-sandbox-return` }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: SandboxCheckoutReturn,
});

function SandboxCheckoutReturn() {
  const { session_id: sessionId } = Route.useSearch();
  const cart = useCart();

  useEffect(() => {
    try {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      window.localStorage.removeItem(ETSY_CHECKOUT_STORAGE_KEY);
      window.sessionStorage.removeItem(ETSY_CHECKOUT_STORAGE_KEY);
    } catch {
      // ignore
    }
    cart.items.forEach((item) => cart.remove(item.key));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <div className="w-full border-b border-orange-300 bg-orange-100 px-4 py-3 text-center text-sm font-semibold text-orange-900">
        SANDBOX TEST ONLY — $0 real charge and no Printify fulfillment.
      </div>
      <section className="mx-auto max-w-[720px] px-6 py-20 text-center">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="font-display text-4xl md:text-5xl leading-tight">Sandbox payment completed</h1>
        <p className="mt-4 text-muted-foreground">
          Stripe accepted the test payment. The sandbox webhook can now be verified in Stripe. Real Printify fulfillment is intentionally disabled for this path.
        </p>
        {sessionId && (
          <p className="mt-3 text-xs text-muted-foreground font-mono break-all">
            Sandbox session: {sessionId}
          </p>
        )}
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/shop"
            search={{ category: undefined, collection: undefined, q: undefined, sort: undefined }}
            className="inline-flex rounded-lg bg-primary text-primary-foreground px-5 py-3 font-semibold hover:bg-primary/90"
          >
            Back to shop
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
