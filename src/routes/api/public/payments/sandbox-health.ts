import { createFileRoute } from "@tanstack/react-router";
import {
  getStripeSandboxBindings,
  probeStripeSandbox,
} from "@/lib/stripe-sandbox-health";

export const Route = createFileRoute("/api/public/payments/sandbox-health")({
  server: {
    handlers: {
      GET: async () => {
        const bindings = getStripeSandboxBindings();
        const bindingsReady = Object.values(bindings).every(Boolean);
        const stripe = bindings.secret_key
          ? await probeStripeSandbox()
          : { ok: false, error_type: "configuration_error", error_code: "secret_not_configured" };
        const status = bindingsReady && stripe.ok ? "ok" : "degraded";

        return Response.json(
          {
            status,
            timestamp: new Date().toISOString(),
            mode: "test",
            bindings,
            stripe_api: stripe.ok ? "ok" : "error",
            stripe_error: stripe.ok
              ? null
              : {
                  type: stripe.error_type,
                  code: stripe.error_code,
                },
            fulfillment: "suppressed",
          },
          {
            status: status === "ok" ? 200 : 503,
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
