import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/payments/sandbox-config")({
  server: {
    handlers: {
      GET: async () => {
        const publishableKey = process.env.STRIPE_SANDBOX_PUBLISHABLE_KEY?.trim();
        const secretReady = Boolean(process.env.STRIPE_SANDBOX_SECRET_KEY?.trim().startsWith("sk_test_"));
        const webhookReady = Boolean(process.env.PAYMENTS_SANDBOX_WEBHOOK_SECRET?.trim().startsWith("whsec_"));
        const publishableReady = Boolean(publishableKey?.startsWith("pk_test_"));

        const bindings = {
          publishable_key: publishableReady,
          secret_key: secretReady,
          webhook_secret: webhookReady,
        };

        if (!publishableReady || !secretReady || !webhookReady) {
          return Response.json(
            {
              error: "Stripe sandbox is not fully configured.",
              bindings,
            },
            {
              status: 503,
              headers: {
                "Cache-Control": "no-store, max-age=0",
                "X-Robots-Tag": "noindex, nofollow",
              },
            },
          );
        }

        return Response.json(
          {
            publishableKey,
            bindings,
            fulfillment: "suppressed",
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
