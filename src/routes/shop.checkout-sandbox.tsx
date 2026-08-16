import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CART_STORAGE_KEY, type CartItem, useCart } from "@/lib/cart-context";
import { StripeEmbeddedCartCheckout } from "@/components/StripeEmbeddedCheckout";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/shop/checkout-sandbox")({
  head: () => ({
    meta: [
      { title: "Sandbox Checkout — Keep Texas Red" },
      { name: "description", content: "Stripe sandbox checkout for Keep Texas Red payment testing." },
      { name: "robots", content: "noindex,follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/shop/checkout-sandbox` }],
  }),
  component: SandboxCheckoutPage,
});

function restoreCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function SandboxCheckoutPage() {
  const cart = useCart();
  const [restored, setRestored] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRestored(restoreCart());
    setReady(true);
  }, []);

  const items = cart.items.length > 0 ? cart.items : restored;
  const returnUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/shop/checkout-sandbox-return?session_id={CHECKOUT_SESSION_ID}`
      : "https://keeptxred.com/shop/checkout-sandbox-return?session_id={CHECKOUT_SESSION_ID}";

  return (
    <div className="bg-background min-h-screen">
      <div className="w-full border-b border-orange-300 bg-orange-100 px-4 py-3 text-center text-sm font-semibold text-orange-900">
        STRIPE SANDBOX — no real card will be charged and no Printify order will be created.
      </div>
      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-[1100px] px-6 py-10">
          <div className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-3">
            Keep TX Red Shop Test
          </div>
          <h1 className="font-display text-3xl md:text-4xl leading-tight">Sandbox Checkout</h1>
          <p className="mt-3 max-w-2xl text-white/90 text-sm">
            Use Stripe test card 4242 4242 4242 4242. Payment and webhook handling are tested, while real fulfillment is disabled.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-10">
        {!ready ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            Loading your bag…
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <h2 className="font-display text-2xl mb-2">Your bag is empty</h2>
            <p className="text-muted-foreground mb-6">Add a product to the bag before starting the sandbox test.</p>
            <Link
              to="/shop"
              search={{ category: undefined, collection: undefined, q: undefined, sort: undefined }}
              className="inline-flex rounded-lg bg-primary text-primary-foreground px-5 py-3 font-semibold hover:bg-primary/90"
            >
              Back to shop
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-orange-300 bg-card p-4 md:p-6">
            <StripeEmbeddedCartCheckout
              items={items}
              returnUrl={returnUrl}
              environment="sandbox"
            />
          </div>
        )}
      </section>
    </div>
  );
}
