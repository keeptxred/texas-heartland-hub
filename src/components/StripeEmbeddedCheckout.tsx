import {
  CheckoutElementsProvider,
  PaymentElement,
  useCheckout,
} from "@stripe/react-stripe-js/checkout";
import { loadStripe } from "@stripe/stripe-js";
import { type FormEvent, useMemo, useState } from "react";
import { getStripe } from "@/lib/stripe";
import { createCartCheckoutSession } from "@/lib/checkout.functions";
import type { CartItem } from "@/lib/cart-context";

type CheckoutEnvironment = "sandbox" | "live";

type ShippingForm = {
  email: string;
  phone: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
};

type PreparedCheckout = {
  clientSecret: string;
  sessionId: string;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  shippingLabel: string;
};

const INITIAL_SHIPPING: ShippingForm = {
  email: "",
  phone: "",
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
};

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

function money(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function PaymentStep({
  checkout,
  returnUrl,
}: {
  checkout: PreparedCheckout;
  returnUrl: string;
}) {
  const result = useCheckout();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPaymentError(null);

    if (result.type !== "success") return;

    setSubmitting(true);
    try {
      const confirmResult = await result.checkout.confirm({
        returnUrl: returnUrl.replace(
          "{CHECKOUT_SESSION_ID}",
          checkout.sessionId,
        ),
      });

      if (confirmResult.type === "error") {
        setPaymentError(confirmResult.error.message || "Payment could not be completed.");
      }
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Payment could not be completed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (result.type === "error") {
    return (
      <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {result.error.message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Merchandise</span>
          <span className="font-medium">{money(checkout.subtotalCents)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="text-muted-foreground">{checkout.shippingLabel}</span>
          <span className="font-medium">
            {checkout.shippingCents === 0 ? "Free" : money(checkout.shippingCents)}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-4 border-t border-border pt-3 text-base">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">{money(checkout.totalCents)}</span>
        </div>
      </div>

      <PaymentElement />

      {paymentError ? (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {paymentError}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={
          submitting ||
          result.type !== "success" ||
          !result.checkout.canConfirm
        }
        className="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Processing…" : `Pay ${money(checkout.totalCents)}`}
      </button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Payment details are handled securely by Stripe. Keep TX Red never receives your card number.
      </p>
    </form>
  );
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
  const [preparing, setPreparing] = useState(false);
  const [shipping, setShipping] = useState<ShippingForm>(INITIAL_SHIPPING);
  const [prepared, setPrepared] = useState<PreparedCheckout | null>(null);

  const stripePromise = useMemo(
    () => environment === "sandbox" ? getSandboxStripe() : getStripe(),
    [environment],
  );

  const updateShipping = (field: keyof ShippingForm, value: string) => {
    setShipping((current) => ({ ...current, [field]: value }));
  };

  const preparePayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCheckoutError(null);
    setPreparing(true);

    try {
      const result = await createCartCheckoutSession({
        data: {
          environment,
          returnUrl,
          currency: items[0]?.currency ?? "USD",
          customer: {
            email: shipping.email,
            phone: shipping.phone || null,
          },
          shippingDetails: {
            name: shipping.name,
            address: {
              line1: shipping.line1,
              ...(shipping.line2 ? { line2: shipping.line2 } : {}),
              city: shipping.city,
              state: shipping.state,
              postal_code: shipping.postalCode,
              country: "US",
            },
          },
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId ?? null,
            quantity: item.qty,
            title: item.title,
            price: item.price,
            image: item.image,
            color: item.color,
            size: item.size,
          })),
        },
      });

      if ("error" in result) {
        setCheckoutError(result.error);
        return;
      }

      setPrepared(result);
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Checkout could not be initialized. Please try again.",
      );
    } finally {
      setPreparing(false);
    }
  };

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

      {!prepared ? (
        <form onSubmit={preparePayment} className="space-y-5">
          <div>
            <h2 className="font-display text-2xl">Shipping information</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your delivery address so we can get the exact Printify shipping rate before payment.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5 text-sm font-medium">
              <span>Email</span>
              <input
                type="email"
                autoComplete="email"
                required
                value={shipping.email}
                onChange={(event) => updateShipping("email", event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-normal"
              />
            </label>

            <label className="space-y-1.5 text-sm font-medium">
              <span>Phone <span className="font-normal text-muted-foreground">(optional)</span></span>
              <input
                type="tel"
                autoComplete="tel"
                value={shipping.phone}
                onChange={(event) => updateShipping("phone", event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-normal"
              />
            </label>
          </div>

          <label className="block space-y-1.5 text-sm font-medium">
            <span>Full name</span>
            <input
              autoComplete="name"
              required
              value={shipping.name}
              onChange={(event) => updateShipping("name", event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-normal"
            />
          </label>

          <label className="block space-y-1.5 text-sm font-medium">
            <span>Street address</span>
            <input
              autoComplete="shipping address-line1"
              required
              value={shipping.line1}
              onChange={(event) => updateShipping("line1", event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-normal"
            />
          </label>

          <label className="block space-y-1.5 text-sm font-medium">
            <span>Apartment, suite, etc. <span className="font-normal text-muted-foreground">(optional)</span></span>
            <input
              autoComplete="shipping address-line2"
              value={shipping.line2}
              onChange={(event) => updateShipping("line2", event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-normal"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-[1fr_110px_140px]">
            <label className="space-y-1.5 text-sm font-medium">
              <span>City</span>
              <input
                autoComplete="shipping address-level2"
                required
                value={shipping.city}
                onChange={(event) => updateShipping("city", event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-normal"
              />
            </label>

            <label className="space-y-1.5 text-sm font-medium">
              <span>State</span>
              <input
                autoComplete="shipping address-level1"
                required
                maxLength={2}
                placeholder="TX"
                value={shipping.state}
                onChange={(event) =>
                  updateShipping("state", event.target.value.toUpperCase())
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-normal uppercase"
              />
            </label>

            <label className="space-y-1.5 text-sm font-medium">
              <span>ZIP code</span>
              <input
                autoComplete="shipping postal-code"
                inputMode="numeric"
                required
                value={shipping.postalCode}
                onChange={(event) => updateShipping("postalCode", event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-normal"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={preparing}
            className="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {preparing ? "Calculating shipping…" : "Continue to secure payment"}
          </button>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-muted/20 p-4 text-sm">
            <div>
              <div className="font-semibold">{shipping.name}</div>
              <div className="text-muted-foreground">
                {shipping.line1}
                {shipping.line2 ? `, ${shipping.line2}` : ""}
              </div>
              <div className="text-muted-foreground">
                {shipping.city}, {shipping.state} {shipping.postalCode}
              </div>
              <div className="mt-1 text-muted-foreground">{shipping.email}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setPrepared(null);
                setCheckoutError(null);
              }}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Edit shipping
            </button>
          </div>

          <CheckoutElementsProvider
            stripe={stripePromise}
            options={{
              clientSecret: prepared.clientSecret,
              elementsOptions: {
                appearance: { theme: "stripe" },
              },
            }}
          >
            <PaymentStep checkout={prepared} returnUrl={returnUrl} />
          </CheckoutElementsProvider>
        </div>
      )}
    </div>
  );
}
