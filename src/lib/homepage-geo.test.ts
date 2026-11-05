import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const homepagePath = join(process.cwd(), "src/routes/index.tsx");

function homepageSource() {
  return readFileSync(homepagePath, "utf8");
}

describe("homepage GEO signals", () => {
  it("publishes visible FAQ content with matching FAQPage structured data", () => {
    const source = homepageSource();

    expect(source).toContain('"@type": "FAQPage"');
    expect(source).toContain("<HomepageFaqs />");
    expect(source).toContain("Questions about Keep TX Red");
    expect(source).toContain("What does Keep TX Red cover?");
    expect(source).toContain("Is Keep TX Red news, commentary, or both?");
    expect(source).not.toContain("Where can I follow the 2026 Texas elections?");
    expect(source).toContain("How does Keep TX Red source government and election information?");
    expect(source).toContain("How can I find my Texas representatives or track a bill?");
    expect(source).toContain("How can I request a correction or send Keep TX Red a tip?");
  });

  it("keeps homepage GEO signals while removing public Election Central promotions", () => {
    const source = homepageSource();

    expect(source).toContain("<ElectionSeasonSpotlight />");
    expect(source).toContain("if (!ELECTION_FEATURE_FLAGS.homepagePromotion) return null");
    expect(source).toContain('to="/elections/2026"');
    expect(source).toContain('to="/news"');
    expect(source).toContain("<HomepageFaqs />");
    expect(source).not.toContain("<ElectionHomePage");
    expect(source).toContain("Keep TX Red | Texas Politics, Government & Accountability");
    expect(source).toContain(">Keep Texas Red <");
    expect(source).toContain("Keep TX Red examines Texas government decisions");
  });
  it("keeps the current-news boundary while featuring substantive dated research", () => {
    const source = homepageSource();

    expect(source).toContain("Previous verified reporting");
    expect(source).toContain("Browse the dated news archive");
    expect(source).toContain("latest.length === 0 && <ResearchSpotlight />");
    expect(source).toContain("latest.length > 0 && <ResearchSpotlight />");
    expect(source).toContain("function ResearchSpotlight()");
    expect(source).toContain("/news/why-texas-has-no-income-tax");
    expect(source).toContain("Find Texas laws and official statutes");
    expect(source).toContain('href: "/laws"');
    expect(source).not.toContain('href: "/news/texas-new-laws-2026"');
    expect(source).toContain("Trace a bill through the Legislature");
  });

  it("does not offer a subscription when the newsletter feature is disabled", () => {
    const source = homepageSource();

    expect(source).not.toContain("<NewsletterSignup />");
    expect(source).not.toContain("Subscribe for important Texas updates");
    expect(source).toContain("Send a tip or correction");
    expect(source).toContain("Read editorial standards");
  });

});
