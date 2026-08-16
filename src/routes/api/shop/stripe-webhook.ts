import { createFileRoute } from "@tanstack/react-router";
import { createStripeClient, verifyWebhook } from "@/lib/stripe.server";

async function handleSandboxWebhook(request: Request) {
  const event = await verifyWebhook(request, "sandbox");

  if (event.type !== "checkout.session.completed") {
    console.log("Sandbox payment event ignored", event.type);
    return;
  }

  const sessionId = event.data.object?.id;
  if (typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
    throw new Error("Sandbox checkout event is missing a valid session id.");
  }

  const stripe = createStripeClient("sandbox");
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.metadata?.source !== "keeptxred_shop") {
    throw new Error("Sandbox checkout session source is invalid.");
  }

  // SECURITY: Sandbox payments intentionally stop here. This endpoint must
  // never call Printify, send customer/admin order emails, or create a live
  // fulfillment record. Its purpose is to prove Stripe payment + signature +
  // server-side session retrieval end to end without spending real money.
  console.log("Sandbox checkout completed; real fulfillment suppressed", {
    sessionId: session.id,
    paymentStatus: session.payment_status,
    amountTotal: session.amount_total,
    currency: session.currency,
  });
}

export const Route = createFileRoute("/api/shop/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          await handleSandboxWebhook(request);
          return Response.json({
            received: true,
            environment: "sandbox",
            fulfillment: "suppressed",
          });
        } catch (error) {
          console.error("Sandbox webhook error", error);
          return new Response("Sandbox webhook error", { status: 400 });
        }
      },
    },
  },
});
