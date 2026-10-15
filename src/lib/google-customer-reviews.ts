export type ReviewOrder = {
  merchant_id: number;
  order_id: string;
  email: string;
  delivery_country: string;
  estimated_delivery_date: string;
};

type PaidSession = {
  id: string; livemode: boolean; status: string | null; payment_status: string;
  created: number; metadata?: Record<string, string> | null;
  customer_details?: { email?: string | null } | null;
  customer_email?: string | null;
  collected_information?: { shipping_details?: { address?: { country?: string | null } | null } | null } | null;
};

export function estimatedDeliveryDate(createdSeconds: number): string {
  const date = new Date(createdSeconds * 1000);
  // Upper end of the published 3–7 production + 2–5 transit business days.
  let days = 12;
  while (days > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    if (date.getUTCDay() !== 0 && date.getUTCDay() !== 6) days--;
  }
  return date.toISOString().slice(0, 10);
}

export function reviewOrderForPaidSession(session: PaidSession, brand: "keeptxred" | "texasdefined"): ReviewOrder | null {
  if (!session.livemode || session.status !== "complete" || session.payment_status !== "paid" || session.metadata?.source !== `${brand}_shop`) return null;
  const email = session.customer_details?.email || session.customer_email;
  let country = session.collected_information?.shipping_details?.address?.country;
  if (!country && brand === "keeptxred") {
    try { country = (JSON.parse(session.metadata?.fulfillment || "{}") as { co?: string }).co; } catch { return null; }
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || country !== "US" || !Number.isFinite(session.created) || session.created <= 0) return null;
  return {
    merchant_id: brand === "keeptxred" ? 5829731270 : 5843243953,
    order_id: session.id, email, delivery_country: country,
    estimated_delivery_date: estimatedDeliveryDate(session.created),
  };
}

export function reviewOrderFromResponse(value: unknown, merchantId: number): ReviewOrder | null {
  if (!value || typeof value !== "object") return null;
  const order = value as Partial<ReviewOrder>;
  if (order.merchant_id !== merchantId || typeof order.order_id !== "string" || !/^cs_live_[a-zA-Z0-9]+$/.test(order.order_id) || typeof order.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.email) || order.delivery_country !== "US" || typeof order.estimated_delivery_date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(order.estimated_delivery_date)) return null;
  return { merchant_id: merchantId, order_id: order.order_id, email: order.email, delivery_country: order.delivery_country, estimated_delivery_date: order.estimated_delivery_date };
}
