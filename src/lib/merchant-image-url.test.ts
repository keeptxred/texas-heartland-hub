import { describe, expect, it } from "vitest";
import { merchantImageUrl } from "@/lib/merchant-image-url";

describe("merchantImageUrl", () => {
  it("proxies Printify mockups through the first-party Merchant image endpoint", () => {
    const source = "https://images.printify.com/mockup/6a6e00b6fde3f371680bc5f3/25459/98502/keep-texas-red-sunset-sweatshirt-texas-pride-crewneck-retro-state-gift.jpg?camera_label=front";
    const result = merchantImageUrl(source);
    const url = new URL(result);

    expect(url.origin).toBe("https://keeptxred.com");
    expect(url.pathname).toBe("/merchant-image");
    expect(url.searchParams.get("src")).toBe(source);
    expect(result).not.toContain("camera_label=front&");
  });

  it("leaves non-Printify absolute images on their original host", () => {
    const source = "https://cdn.example.com/products/example.jpg?width=1200";
    expect(merchantImageUrl(source)).toBe(source);
  });

  it("makes relative first-party image paths absolute without proxying them", () => {
    expect(merchantImageUrl("/images/products/example.jpg")).toBe(
      "https://keeptxred.com/images/products/example.jpg",
    );
  });

  it("rejects malformed image values", () => {
    expect(merchantImageUrl("http://[invalid")).toBe("");
    expect(merchantImageUrl(null)).toBe("");
  });
});
