import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMemo, useState } from "react";
import { getStripe } from "@/lib/stripe";
import {
  createCartCheckoutSession,
  updateCartCheckoutShipping,
} from "@/lib/checkout.functions";
import type { CartItem } from "@/lib/cart-context";

type CheckoutEnvironment = "sandbox" | "live";

async function getSandboxStripe() {
  const response = await fetch("/api/public/payments/sandbox-config", {
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error || "Stripe sandbox is not configured.");
  }
  const body = await response.json() as { publishableKey?: string };
  if (!body.publishableKey?.startsWith("pk_test_")) {
    throw new Error("Stripe sandbox publishable key is invalid.");
  }
  return loadStripe(body.publishableKey);
}

export function StripeEmbeddedCartCheckout({
  items,
  returnUrl,
  environment,
}: {
  items: CartItem[];
  returnUrl: string;
  environment: CheckoutEnvironment;
}) {
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const stripePromise = useMemo(
    () => environment === "sandbox" ? getSandboxStripe() : getStripe(),
    [environment],
  );
  const checkoutInstanceKey = useMemo(
    () =>
      JSON.stringify({
        environment,
        returnUrl,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId ?? null,
          quantity: item.qty,
        })),
      }),
    [environment, items, returnUrl],
  );

  const options = useMemo(
    () => ({
      fetchClientSecret: async () => {
        setCheckoutError(null);
        try {
          const result = await createCartCheckoutSession({
            data: {
              environment,
              returnUrl,
              currency: items[0]?.currency ?? "USD",
              items: items.map((i) => ({
                productId: i.productId,
                variantId: i.variantId ?? null,
                quantity: i.qty,
                title: i.title,
                price: i.price,
                image: i.image,
                color: i.color,
                size: i.size,
              })),
            },
          });
          if ("error" in result) {
            setCheckoutError(result.error);
            throw new Error(result.error);
          }
          if (!result.clientSecret) {
            const message = "Stripe did not return a client secret";
            setCheckoutError(message);
            throw new Error(message);
          }
          return result.clientSecret;
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Checkout could not be initialized. Please try again.";
          setCheckoutError(message);
          throw error;
        }
      },
      onShippingDetailsChange: async (event: {
        checkoutSessionId: string;
        shippingDetails: {
          name: string;
          address: {
            line1: string;
            line2?: string | null;
            city: string;
            state: string;
            postal_code: string;
            country: string;
          };
        };
      }) => {
        const result = await updateCartCheckoutShipping({
          data: {
            environment,
            checkoutSessionId: event.checkoutSessionId,
            shippingDetails: event.shippingDetails,
          },
        });

        if ("error" in result) {
          return { type: "reject" as const, errorMessage: result.error };
        }
        return { type: "accept" as const };
      },
    }),
    [environment, items, returnUrl],
  );

  return (
    <div id="checkout">
      {checkoutError ? (
        <div
          role="alert"
          className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <p className="font-semibold">Checkout could not start</p>
          <p className="mt-1">{checkoutError}</p>
        </div>
      ) : null}
      <EmbeddedCheckoutProvider
        key={checkoutInstanceKey}
        stripe={stripePromise}
        options={options as any}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
