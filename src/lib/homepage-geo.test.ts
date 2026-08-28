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
    expect(source).toContain("Where can I follow the 2026 Texas elections?");
    expect(source).toContain("How does Keep TX Red source government and election information?");
    expect(source).toContain("How can I find my Texas representatives or track a bill?");
    expect(source).toContain("How can I request a correction or send Keep TX Red a tip?");
  });

  it("keeps the FAQ visible when Election Central owns the homepage", () => {
    const source = homepageSource();
    const electionBranch = source.slice(
      source.indexOf("if (ELECTION_FEATURE_FLAGS.homepagePromotion)"),
      source.indexOf("return <PoliticalHomepage />"),
    );

    expect(electionBranch).toContain("<ElectionHomePage />");
    expect(electionBranch).toContain("<HomepageFaqs />");
  });
});