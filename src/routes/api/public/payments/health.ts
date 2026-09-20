import { createFileRoute } from "@tanstack/react-router";
import { createStripeClient } from "@/lib/stripe.server";

function configured(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

function productionOrigin(): string {
  return (process.env.PUBLIC_SITE_URL?.trim() || "https://keeptxred.com").replace(/\/$/, "");
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
          supabase_service_role_key: configured("SUPABASE_SERVICE_ROLE_KEY"),
        };

        let stripeApi: "ok" | "error" | "not_configured" = "not_configured";
        let stripeWebhook: "ok" | "error" | "not_configured" = "not_configured";
        let stripeError: { type?: string; code?: string; message?: string } | null = null;
        let stripeWebhookError: { message?: string } | null = null;

        if (bindings.stripe_live_secret_key) {
          try {
            const stripe = createStripeClient("live");
            await stripe.checkout.sessions.list({ limit: 1 });
            stripeApi = "ok";

            const expectedWebhookUrl = `${productionOrigin()}/api/public/payments/webhook?env=live`;
            const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
            const endpoint = endpoints.data.find(
              (candidate) =>
                candidate.url === expectedWebhookUrl &&
                candidate.status === "enabled",
            );
            const events = endpoint?.enabled_events ?? [];
            const receivesCheckoutCompletion =
              events.includes("*") || events.includes("checkout.session.completed");

            if (!endpoint) {
              stripeWebhook = "error";
              stripeWebhookError = {
                message: "Enabled live Stripe webhook endpoint is not registered for the production payments URL.",
              };
            } else if (!receivesCheckoutCompletion) {
              stripeWebhook = "error";
              stripeWebhookError = {
                message: "Live Stripe webhook does not subscribe to checkout.session.completed.",
              };
            } else {
              stripeWebhook = "ok";
            }
          } catch (error) {
            stripeApi = "error";
            stripeWebhook = "error";
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

        let printifyApi: "ok" | "error" | "not_configured" = "not_configured";
        let printifyError: { status?: number; message?: string } | null = null;

        if (bindings.printify_api_token && bindings.printify_shop_id) {
          try {
            const response = await fetch("https://api.printify.com/v1/shops.json", {
              headers: {
                Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
                "User-Agent": "KeepTXRed/1.0",
              },
            });

            if (!response.ok) {
              printifyApi = "error";
              printifyError = {
                status: response.status,
                message: "Printify authentication or shop lookup failed.",
              };
            } else {
              const shops = (await response.json()) as Array<{ id?: number | string }>;
              const configuredShopId = String(process.env.PRINTIFY_SHOP_ID);
              const shopExists =
                Array.isArray(shops) &&
                shops.some((shop) => String(shop?.id ?? "") === configuredShopId);

              if (!shopExists) {
                printifyApi = "error";
                printifyError = {
                  message: "Configured Printify shop ID is not available to this API token.",
                };
              } else {
                printifyApi = "ok";
              }
            }
          } catch {
            printifyApi = "error";
            printifyError = { message: "Printify request failed." };
          }
        }

        const bindingsReady = Object.values(bindings).every(Boolean);
        const status =
          bindingsReady &&
          stripeApi === "ok" &&
          stripeWebhook === "ok" &&
          printifyApi === "ok"
            ? "ok"
            : "degraded";

        return Response.json(
          {
            status,
            timestamp: new Date().toISOString(),
            bindings,
            stripe_api: stripeApi,
            stripe_webhook: stripeWebhook,
            stripe_error: stripeError,
            stripe_webhook_error: stripeWebhookError,
            printify_api: printifyApi,
            printify_error: printifyError,
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
