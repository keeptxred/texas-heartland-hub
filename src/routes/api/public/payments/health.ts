import { createFileRoute } from "@tanstack/react-router";
import { createStripeClient } from "@/lib/stripe.server";

function configured(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

export const Route = createFileRoute("/api/public/payments/health")({
  server: {
    handlers: {
      GET: async () => {
        const bindings = {
          stripe_live_secret_key: configured("STRIPE_LIVE_SECRET_KEY"),
          printify_api_token: configured("PRINTIFY_API_TOKEN"),
          printify_shop_id: configured("PRINTIFY_SHOP_ID"),
          payments_live_webhook_secret: configured("PAYMENTS_LIVE_WEBHOOK_SECRET"),
          supabase_url: configured("SUPABASE_URL"),
          supabase_publishable_key: configured("SUPABASE_PUBLISHABLE_KEY"),
        };

        let stripeApi: "ok" | "error" | "not_configured" = "not_configured";
        let stripeError: { type?: string; code?: string; message?: string } | null = null;

        if (bindings.stripe_live_secret_key) {
          try {
            const stripe = createStripeClient("live");
            await stripe.checkout.sessions.list({ limit: 1 });
            stripeApi = "ok";
          } catch (error) {
            stripeApi = "error";
            if (error && typeof error === "object") {
              const candidate = error as {
                type?: string;
                code?: string;
                message?: string;
                raw?: { type?: string; code?: string; message?: string };
              };
              stripeError = {
                type: candidate.raw?.type ?? candidate.type,
                code: candidate.raw?.code ?? candidate.code,
                message: candidate.raw?.message ?? candidate.message,
              };
            } else {
              stripeError = { message: "Stripe request failed" };
            }
          }
        }

        const bindingsReady = Object.values(bindings).every(Boolean);
        const status = bindingsReady && stripeApi === "ok" ? "ok" : "degraded";

        return Response.json(
          {
            status,
            timestamp: new Date().toISOString(),
            bindings,
            stripe_api: stripeApi,
            stripe_error: stripeError,
          },
          {
            headers: {
              "Cache-Control": "no-store, max-age=0",
              "X-Robots-Tag": "noindex, nofollow",
            },
          },
        );
      },
    },
  },
});
