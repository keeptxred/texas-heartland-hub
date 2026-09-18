import { useEffect } from "react";

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (...args: unknown[]) => void;
};

function emitShopEvent(eventName: string, detail: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const analyticsWindow = window as AnalyticsWindow;
  const payload = {
    event: eventName,
    ...detail,
    page_path: window.location.pathname,
    occurred_at: new Date().toISOString(),
  };

  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push(payload);

  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/shop-analytics",
      new Blob([body], { type: "application/json" }),
    );
  } else {
    void fetch("/api/shop-analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  }

  if (typeof analyticsWindow.gtag === "function") {
    analyticsWindow.gtag("event", eventName, detail);
  }

  window.dispatchEvent(new CustomEvent(`ktr:${eventName.replace(/_/g, "-")}`, { detail: payload }));
}

function shopPageKind(pathname: string) {
  if (pathname === "/shop") return "landing";
  if (pathname.startsWith("/shop/checkout")) return "checkout";
  if (pathname.startsWith("/shop/cart")) return "cart";
  return "product";
}

function shopProductId(pathname: string) {
  if (!pathname.startsWith("/shop/")) return undefined;
  if (pathname.startsWith("/shop/checkout") || pathname.startsWith("/shop/cart")) return undefined;
  const segment = pathname.slice("/shop/".length).split("/")[0];
  return segment ? decodeURIComponent(segment) : undefined;
}

export function ShopAnalyticsTracker() {
  useEffect(() => {
    let lastShopViewPath = "";

    const recordShopView = () => {
      const { pathname } = window.location;
      if (!pathname.startsWith("/shop")) {
        lastShopViewPath = "";
        return;
      }
      if (pathname === lastShopViewPath) return;
      lastShopViewPath = pathname;

      emitShopEvent("shop_page_view", {
        shop_page_type: shopPageKind(pathname),
        product_id: shopProductId(pathname),
      });
    };

    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      let clickedUrl: URL;
      try {
        clickedUrl = new URL(anchor.href, window.location.origin);
      } catch {
        return;
      }

      if (clickedUrl.origin === window.location.origin && clickedUrl.pathname.startsWith("/shop")) {
        const productId = shopProductId(clickedUrl.pathname);
        emitShopEvent(productId ? "shop_product_click" : "shop_navigation_click", {
          destination_path: `${clickedUrl.pathname}${clickedUrl.search}`,
          shop_page_type: shopPageKind(clickedUrl.pathname),
          product_id: productId,
          source_path: window.location.pathname,
        });
      }

      if (
        window.location.pathname.startsWith("/shop")
        && clickedUrl.protocol === "https:"
        && clickedUrl.origin !== window.location.origin
      ) {
        emitShopEvent("shop_outbound_click", {
          destination_url: clickedUrl.toString(),
          link_text: anchor.textContent?.trim().slice(0, 120) || "outbound-link",
          product_id: shopProductId(window.location.pathname),
        });
      }
    };

    const observer = new MutationObserver(recordShopView);
    document.addEventListener("click", handleClick);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    recordShopView();

    return () => {
      document.removeEventListener("click", handleClick);
      observer.disconnect();
    };
  }, []);

  return null;
}

export default ShopAnalyticsTracker;
