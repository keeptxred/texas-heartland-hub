import { useEffect } from "react";
import type { ReviewOrder } from "@/lib/google-customer-reviews";

type ReviewApi = { load: (module: string, callback: () => void) => void; surveyoptin: { render: (order: ReviewOrder) => void } };
let platform: Promise<ReviewApi> | undefined;
const rendered = new Set<string>();

function loadReviewPlatform(): Promise<ReviewApi> {
  if (!platform) platform = new Promise<ReviewApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js?onload=googleCustomerReviewsReady";
    script.async = true;
    const reviewWindow = window as unknown as { gapi?: ReviewApi; googleCustomerReviewsReady?: () => void };
    reviewWindow.googleCustomerReviewsReady = () => {
      const api = reviewWindow.gapi;
      delete reviewWindow.googleCustomerReviewsReady;
      if (api) resolve(api); else { platform = undefined; reject(new Error("Review platform unavailable")); }
    };
    script.onerror = () => { script.remove(); platform = undefined; reject(new Error("Review platform unavailable")); };
    document.body.appendChild(script);
  });
  return platform;
}

export function GoogleCustomerReviews({ order }: { order: ReviewOrder }) {
  useEffect(() => {
    let active = true;
    // Google displays its own survey consent prompt. A declined survey never
    // changes payment, fulfillment, cart state, or access to the receipt.
    void loadReviewPlatform().then(api => {
      if (!active) return;
      api.load("surveyoptin", () => {
        if (!active || rendered.has(order.order_id)) return;
        api.surveyoptin.render(order);
        rendered.add(order.order_id);
      });
    }).catch(() => { /* An optional review must never interrupt a paid order. */ });
    return () => { active = false; };
  }, [order]);
  return null;
}
