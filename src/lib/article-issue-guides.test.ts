import { describe, expect, it } from "vitest";
import { issueGuideBySlug } from "@/data/issue-guides";
import { isIssueGuideIndexable } from "@/lib/issue-guide-indexability";
import { matchArticleIssueGuides } from "./article-issue-guides";

describe("matchArticleIssueGuides", () => {
  it("matches ERCOT and grid stories", () => {
    const matches = matchArticleIssueGuides({
      title: "ERCOT warns of tight power grid conditions this week",
      dek: "Texas regulators are watching generation and demand.",
      category: "Energy",
    });
    expect(matches[0]?.slug).toBe("ercot-grid-reliability");
  });

  it("matches Operation Lone Star and border stories", () => {
    const matches = matchArticleIssueGuides({
      title: "Texas expands Operation Lone Star border security deployment",
      category: "Politics",
    });
    expect(matches[0]?.slug).toBe("texas-border-security-operation-lone-star");
  });

  it("matches school choice and ESA stories", () => {
    const matches = matchArticleIssueGuides({
      title: "Texas school choice rollout sets education savings account timeline",
      category: "Education",
    });
    expect(matches[0]?.slug).toBe("texas-school-choice-esas");
  });

  it("matches property-tax stories", () => {
    const matches = matchArticleIssueGuides({
      title: "Lawmakers debate another property tax relief package",
      category: "Economy",
    });
    expect(matches[0]?.slug).toBe("texas-property-tax-relief");
  });

  it("matches election-law process stories", () => {
    const matches = matchArticleIssueGuides({
      title: "Texas mail ballot signature verification rules head back to court",
      category: "Elections",
    });
    expect(matches[0]?.slug).toBe("texas-election-law");
  });

  it("can use body text without letting a broad category create a false match", () => {
    const matches = matchArticleIssueGuides({
      title: "Lawmakers open hearing on state policy",
      dek: "The committee heard testimony Tuesday.",
      category: "Politics",
      text: "Witnesses focused on federal preemption and the Tenth Amendment.",
    });
    expect(matches[0]?.slug).toBe("texas-state-federal-power");
  });

  it("does not match unrelated sports coverage", () => {
    const matches = matchArticleIssueGuides({
      title: "Astros win extra-inning thriller in Houston",
      dek: "A late double brought home the winning run.",
      category: "Sports",
    });
    expect(matches).toEqual([]);
  });

  it("caps output at three and honors a smaller requested limit", () => {
    const matches = matchArticleIssueGuides({
      title: "Texas property tax, school choice, border security and ERCOT bills move",
      category: "Politics",
    }, 2);
    expect(matches).toHaveLength(2);
  });

  it("never routes an article to a quarantined issue guide", () => {
    const samples = [
      "ERCOT power grid border security school choice property tax election law",
      "Texas water rural hospital state income tax federal preemption gun law",
      "DEI SB 17 gender-affirming care parental rights oil and gas",
    ];

    for (const title of samples) {
      for (const match of matchArticleIssueGuides({ title, category: "Politics" })) {
        const guide = issueGuideBySlug[match.slug];
        expect(guide).toBeDefined();
        expect(isIssueGuideIndexable(guide)).toBe(true);
      }
    }
  });
});
