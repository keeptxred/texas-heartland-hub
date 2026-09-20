import { describe, expect, it } from "vitest";
import {
  introducedBillTextUrl,
  isAllowedOfficialBillTextContentType,
  isAllowedOfficialBillTextUrl,
  officialHtmlToText,
  readResponseTextWithLimit,
} from "./official-bill-text";

describe("official bill text helpers", () => {
  it("builds the official introduced-version URL", () => {
    expect(introducedBillTextUrl("89R", "hb", 12)).toBe(
      "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00012I.htm",
    );
  });

  it("allows only exact HTTPS Texas Legislature bill-text URLs", () => {
    expect(
      isAllowedOfficialBillTextUrl(
        "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00012I.htm",
      ),
    ).toBe(true);
    expect(isAllowedOfficialBillTextUrl("http://capitol.texas.gov/tlodocs/89R/billtext/html/HB00012I.htm")).toBe(false);
    expect(isAllowedOfficialBillTextUrl("https://example.com/tlodocs/89R/billtext/html/HB00012I.htm")).toBe(false);
    expect(isAllowedOfficialBillTextUrl("https://capitol.texas.gov.evil.example/tlodocs/89R/billtext/html/HB00012I.htm")).toBe(false);
    expect(isAllowedOfficialBillTextUrl("https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00012I.htm?next=https://evil.example")).toBe(false);
  });

  it("accepts only readable text document content types", () => {
    expect(isAllowedOfficialBillTextContentType("text/html; charset=utf-8")).toBe(true);
    expect(isAllowedOfficialBillTextContentType("text/plain")).toBe(true);
    expect(isAllowedOfficialBillTextContentType("application/xhtml+xml")).toBe(true);
    expect(isAllowedOfficialBillTextContentType("application/octet-stream")).toBe(false);
  });

  it("enforces streamed response byte limits even without content-length", async () => {
    const response = new Response(new TextEncoder().encode("123456"));
    await expect(readResponseTextWithLimit(response, 5)).rejects.toThrow(RangeError);
  });

  it("converts HTML to readable text without executable markup", () => {
    expect(
      officialHtmlToText(
        "<body><style>x</style><h1>HB&nbsp;12</h1><p>A &amp; B</p><script>alert(1)</script></body>",
      ),
    ).toBe("HB 12\nA & B");
  });
});
