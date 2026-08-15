import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useMemo } from "react";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import {
  createCartCheckoutSession,
  updateCartCheckoutShipping,
} from "@/lib/checkout.functions";
import type { CartItem } from "@/lib/cart-context";

export function StripeEmbeddedCartCheckout({
  items,
  returnUrl,
}: {
  items: CartItem[];
  returnUrl: string;
}) {
  const options = useMemo(
    () => ({
      fetchClientSecret: async () => {
        const result = await createCartCheckoutSession({
          data: {
            environment: getStripeEnvironment(),
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
        if ("error" in result) throw new Error(result.error);
        if (!result.clientSecret) throw new Error("Stripe did not return a client secret");
        return result.clientSecret;
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
            environment: getStripeEnvironment(),
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
    // The embedded session should be created only once for the mounted cart.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={options as any}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
