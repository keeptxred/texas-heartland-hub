import { describe, expect, it } from "vitest";
import { EMINENT_DOMAIN_PROPERTY_RIGHTS_LAW_TOPIC } from "@/data/law-topic-eminent-domain-authority";

describe("Texas eminent domain primary-source link repair", () => {
  const sources = EMINENT_DOMAIN_PROPERTY_RIGHTS_LAW_TOPIC.sources;
  it("does not display the verified-dead OAG Landowner's Bill of Rights landing page", () => {
    expect(sources.some(({ url }) => url === "https://www.texasattorneygeneral.gov/landowners-bill-rights")).toBe(false);
  });
  it("retains the direct current Attorney General notice and official TxDOT resource index", () => {
    expect(sources.some(({ url }) => url.includes("/landowners-bill-of-rights-25.pdf"))).toBe(true);
    expect(sources.some(({ url }) =>
      url === "https://www.txdot.gov/business/right-of-way/landowner-bill-of-rights.html"
    )).toBe(true);
  });
  it("does not manufacture a new reviewed date or change canonical identity", () => {
    expect(EMINENT_DOMAIN_PROPERTY_RIGHTS_LAW_TOPIC.slug).toBe("eminent-domain-property-rights");
    expect(EMINENT_DOMAIN_PROPERTY_RIGHTS_LAW_TOPIC.updated).toBe("2026-09-06");
  });
});
