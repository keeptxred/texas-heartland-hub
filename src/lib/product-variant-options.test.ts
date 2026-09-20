import { describe, expect, it } from "vitest";
import { parseProductVariantOptions } from "@/lib/product-variant-options";

describe("parseProductVariantOptions", () => {
  it.each([
    ["Black / M", "Black", "M"],
    ["2XL / Navy", "Navy", "2XL"],
    ["One size / Black", "Black", "One size"],
    ["White / One size", "White", "One size"],
    ["11oz", null, "11oz"],
    ["Black / 20oz", "Black", "20oz"],
    ['3" × 3" / White', "White", '3" × 3"'],
    ['Natural / 15" x 16"', "Natural", '15" x 16"'],
  ])("parses %s", (title, color, size) => {
    expect(parseProductVariantOptions(title)).toEqual({ color, size });
  });

  it("uses a legacy color only when it is actually color-like", () => {
    expect(parseProductVariantOptions("11oz", "11oz")).toEqual({ color: null, size: "11oz" });
    expect(parseProductVariantOptions("M", "Navy")).toEqual({ color: "Navy", size: "M" });
  });
});
