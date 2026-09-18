import { describe, expect, it } from "vitest";

import { shopAnalyticsResponse } from "./shop-analytics.server";

type DataPoint = { blobs?: string[]; doubles?: number[]; indexes?: string[] };

function request(body: unknown, origin = "https://keeptxred.com") {
  return new Request("https://keeptxred.com/api/shop-analytics", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin,
    },
    body: JSON.stringify(body),
  });
}

function env(points: DataPoint[]) {
  return {
    KTR_SHOP_ANALYTICS: {
      writeDataPoint(point: DataPoint) {
        points.push(point);
      },
    },
  };
}

describe("shopAnalyticsResponse", () => {
  it("stores an allowlisted shop event without browser identity", async () => {
    const points: DataPoint[] = [];
    const result = await shopAnalyticsResponse(request({
      event: "shop_product_click",
      page_path: "/article/example?ignored=1",
      source_path: "/article/example",
      destination_path: "/shop/product-123?collection=shirts",
      product_id: "product-123",
      shop_page_type: "product",
      occurred_at: "2026-09-18T21:00:00.000Z",
      session_id: "must-not-persist",
    }), env(points));

    expect(result?.status).toBe(202);
    expect(points).toHaveLength(1);
    expect(points[0].blobs).toEqual([
      "shop_product_click",
      "/article/example",
      "/article/example",
      "/shop/product-123?collection=shirts",
      "product-123",
      "product",
      "",
      "2026-09-18T21:00:00.000Z",
    ]);
    expect(JSON.stringify(points[0])).not.toContain("must-not-persist");
  });

  it("rejects cross-origin submissions", async () => {
    const result = await shopAnalyticsResponse(
      request({ event: "shop_page_view", page_path: "/shop" }, "https://example.com"),
      env([]),
    );
    expect(result?.status).toBe(403);
  });

  it("rejects unknown event names", async () => {
    const result = await shopAnalyticsResponse(
      request({ event: "totally_not_allowed", page_path: "/shop" }),
      env([]),
    );
    expect(result?.status).toBe(400);
  });
});
