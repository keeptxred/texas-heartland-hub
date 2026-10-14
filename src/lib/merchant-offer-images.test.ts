import { describe, expect, it } from "vitest";
import { additionalMerchantImages } from "./merchant-offer-images";

describe("Merchant variant photos", () => {
  it("exports the existing variant gallery without primary duplicates or invalid links", () => {
    const normalize = (value: string | null | undefined) => value?.startsWith("https://") ? value : "";
    expect(additionalMerchantImages("https://front", [null, "invalid", "https://front", "https://back", "https://back"], normalize)).toEqual(["https://back"]);
    expect(additionalMerchantImages("https://front", [], normalize)).toEqual([]);
    expect(additionalMerchantImages("https://front", Array.from({ length: 15 }, (_, i) => `https://detail-${i}`), normalize)).toHaveLength(10);
  });
});
