import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/payments/sandbox-config")({
  server: {
    handlers: {
      GET: async () => {
        const publishableKey = process.env.STRIPE_SANDBOX_PUBLISHABLE_KEY?.trim();
        if (!publishableKey?.startsWith("pk_test_")) {
          return Response.json(
            { error: "Stripe sandbox publishable key is not configured." },
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
          { publishableKey },
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
