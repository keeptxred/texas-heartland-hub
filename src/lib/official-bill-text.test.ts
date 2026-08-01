import { describe, expect, it } from "vitest";
import {
  introducedBillTextUrl,
  isAllowedOfficialBillTextUrl,
  officialHtmlToText,
} from "./official-bill-text";

describe("official bill text helpers", () => {
  it("builds the official introduced-version URL", () => {
    expect(introducedBillTextUrl("89R", "hb", 12)).toBe(
      "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00012I.htm",
    );
  });
  it("allows only official bill-text documents", () => {
    expect(
      isAllowedOfficialBillTextUrl(
        "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00012I.htm",
      ),
    ).toBe(true);
    expect(
      isAllowedOfficialBillTextUrl("https://example.com/tlodocs/89R/billtext/html/HB00012I.htm"),
    ).toBe(false);
  });
  it("converts HTML to readable text without executable markup", () => {
    expect(
      officialHtmlToText(
        "<body><style>x</style><h1>HB&nbsp;12</h1><p>A &amp; B</p><script>alert(1)</script></body>",
      ),
    ).toBe("HB 12\nA & B");
  });
});
