import { createFileRoute } from "@tanstack/react-router";
import { createStripeClient } from "@/lib/stripe.server";
import { reviewOrderForPaidSession } from "@/lib/google-customer-reviews";

export const Route = createFileRoute("/api/public/shop-checkout-status")({
  server: { handlers: { GET: async ({ request }) => {
    const headers = { "cache-control": "private, no-store", "referrer-policy": "no-referrer" };
    const sessionId = new URL(request.url).searchParams.get("session_id") || "";
    if (!/^cs_live_[a-zA-Z0-9]+$/.test(sessionId) || sessionId.length > 255) return Response.json({ ok: false }, { status: 400, headers });
    try {
      const session = await createStripeClient("live").checkout.sessions.retrieve(sessionId);
      if (!session.livemode || session.metadata?.source !== "keeptxred_shop") return Response.json({ ok: false }, { status: 404, headers });
      const paid = session.status === "complete" && session.payment_status === "paid";
      // The random Checkout session ID is the receipt capability. Never return
      // addresses, phone numbers, payment credentials, or another brand's order.
      return Response.json({ ok: true, paid, review: reviewOrderForPaidSession(session, "keeptxred") }, { headers });
    } catch { return Response.json({ ok: false }, { status: 404, headers }); }
  } } },
});
