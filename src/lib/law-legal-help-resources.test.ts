import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const component = readFileSync("src/components/laws/legal-help-resources.tsx", "utf8");
const authority = readFileSync("src/components/law-topic-page.tsx", "utf8");
const supporting = readFileSync("src/components/cornerstone-guide-page.tsx", "utf8");

describe("accessible and neutral Texas legal assistance", () => {
  it("links to verified public service resources without selling referrals", () => {
    expect(component).toContain("https://www.sll.texas.gov/faqs/free-legal-help/");
    expect(component).toContain("https://texaslawhelp.org/");
    expect(component).toContain("https://www.texasbar.com/AM/Template.cfm?Section=Lawyer_Referral_Service_LRIS_");
    expect(component).toContain("not paid endorsements");
    expect(component).toContain("may involve fees");
    expect(component).toContain('aria-labelledby="texas-legal-help-heading"');
  });
  it("inherits into all law topics and only law-specific supporting guides", () => {
    expect(authority).toContain("<LegalHelpResources />");
    expect(supporting).toContain("{lawMeta ? <LegalHelpResources /> : null}");
  });
});
