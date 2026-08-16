import { createFileRoute } from "@tanstack/react-router";
import { getStripeSandboxBindings } from "@/lib/stripe-sandbox-health";

export const Route = createFileRoute("/api/public/payments/sandbox-config")({
  server: {
    handlers: {
      GET: async () => {
        const publishableKey = process.env.STRIPE_SANDBOX_PUBLISHABLE_KEY?.trim();
        const bindings = getStripeSandboxBindings();

        if (!Object.values(bindings).every(Boolean)) {
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
