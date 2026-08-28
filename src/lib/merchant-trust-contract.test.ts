import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const contact = readFileSync("src/routes/contact.tsx", "utf8");
const about = readFileSync("src/routes/about.tsx", "utf8");
const navigation = readFileSync("src/lib/site-navigation.ts", "utf8");

describe("Merchant trust and transparency contract", () => {
  it("uses real contact channels instead of a client-only success acknowledgement", () => {
    expect(contact).not.toContain("setSent(");
    expect(contact).not.toContain("Message received.");
    expect(contact).toContain("mailto:admin@keeptxred.com");
    expect(contact).toContain("Email is our primary customer-service");
  });

  it("explains the storefront business and fulfillment model", () => {
    expect(about).toContain('id="store-business-information"');
    expect(about).toContain("ordinary retail merchandise purchases");
    expect(about).toContain("third-party print-on-demand production partners");
    expect(about).toContain("processed securely through Stripe");
    expect(about).toContain("not a government entity");
  });

  it("keeps store identity information visible from shop policy navigation", () => {
    expect(navigation).toContain('{ to: "/about", label: "Store & Business Info" }');
  });
});
