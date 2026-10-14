import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CART_STORAGE_KEY, ETSY_CHECKOUT_STORAGE_KEY, useCart } from "@/lib/cart-context";
import { GoogleCustomerReviews } from "@/components/GoogleCustomerReviews";
import { reviewOrderFromResponse, type ReviewOrder } from "@/lib/google-customer-reviews";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/shop/checkout-return")({
  head: () => ({
    meta: [
      { title: "Order Confirmed" },
      { name: "description", content: "Your order has been confirmed." },
      { name: "robots", content: "noindex,follow" },
      { name: "referrer", content: "no-referrer" },
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

  const cartRef = useRef(cart);
  useEffect(() => { cartRef.current = cart; }, [cart]);
  const [state, setState] = useState<"checking" | "paid" | "unconfirmed">(sessionId ? "checking" : "unconfirmed");
  const [review, setReview] = useState<ReviewOrder | null>(null);
  useEffect(() => {
    let active = true;
    setReview(null);
    if (!sessionId) { setState("unconfirmed"); return; }
    setState("checking");
    void fetch(`/api/public/shop-checkout-status?session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store", headers: { accept: "application/json" } })
      .then(async response => {
        const result = await response.json() as { ok?: boolean; paid?: boolean; review?: ReviewOrder | null };
        if (!active) return;
        if (!response.ok || !result.ok || !result.paid) { setState("unconfirmed"); return; }
        setState("paid");
        setReview(reviewOrderFromResponse(result.review, 5829731270));
        try {
          window.localStorage.removeItem(CART_STORAGE_KEY);
          window.localStorage.removeItem(ETSY_CHECKOUT_STORAGE_KEY);
          window.sessionStorage.removeItem(ETSY_CHECKOUT_STORAGE_KEY);
        } catch { /* Storage may be unavailable. */ }
        cartRef.current.items.forEach(item => cartRef.current.remove(item.key));
      }).catch(() => { if (active) setState("unconfirmed"); });
    return () => { active = false; };
  }, [sessionId]);

  return (
    <div className="bg-background min-h-screen">
      {state === "paid" && review && <GoogleCustomerReviews order={review} />}
      <section className="mx-auto max-w-[720px] px-6 py-20 text-center">
        {state === "paid" && <div className="text-5xl mb-4">🎉</div>}
        <h1 className="font-display text-4xl md:text-5xl leading-tight">{state === "checking" ? "Confirming your order" : state === "paid" ? "Thank you!" : "Checkout not confirmed"}</h1>
        <p className="mt-4 text-muted-foreground">
          {state === "checking" ? "We’re checking your payment status." : state === "paid" ? "Your payment is confirmed. Your order can now move into production." : "We could not verify a paid order. Your bag has not been cleared. Check your payment status before trying again."}
        </p>
        {state === "paid" && sessionId && (
          <p className="mt-2 text-xs text-muted-foreground font-mono break-all">
            Order reference: {sessionId}
          </p>
        )}
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/shop"
            search={{ category: undefined, collection: undefined, q: undefined, sort: undefined }}
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
