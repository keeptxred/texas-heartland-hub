import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const issuesHub = read("../routes/issues/index.tsx");
const issueDetail = read("../routes/issues/$slug.tsx");
const pillarNav = read("../components/pillar-relationship-nav.tsx");
const lawFinder = read("../routes/civic-tools.texas-law-finder.tsx");
const articleIssueRouting = read("./article-issue-guides.ts");

describe("issue-guide discovery readiness alignment", () => {
  it("filters the issues hub cards and ItemList schema to indexable guides", () => {
    expect(issuesHub).toContain('import { isIssueGuideIndexable } from "@/lib/issue-guide-indexability"');
    expect(issuesHub).toContain("const INDEXABLE_ISSUE_GUIDES = issueGuides.filter");
    expect(issuesHub).toContain("numberOfItems: INDEXABLE_ISSUE_GUIDES.length");
    expect(issuesHub).toContain("itemListElement: INDEXABLE_ISSUE_GUIDES.map");
    expect(issuesHub).toContain("getGuidesByCategory(category).filter");
    expect(issuesHub).not.toContain("numberOfItems: issueGuides.length");
    expect(issuesHub).not.toContain("itemListElement: issueGuides.map");
  });

  it("filters sibling issue-guide links on detail pages", () => {
    expect(issueDetail).toContain("if (!related || !isIssueGuideIndexable(related)) return null");
  });

  it("filters pillar relationship issue links to indexable guides", () => {
    expect(pillarNav).toContain('import { isIssueGuideIndexable } from "@/lib/issue-guide-indexability"');
    expect(pillarNav).toContain("Boolean(guide) && isIssueGuideIndexable(guide)");
  });

  it("keeps article-to-issue routing inside the indexable guide cohort", () => {
    expect(articleIssueRouting).toContain('import { issueGuideBySlug } from "@/data/issue-guides"');
    expect(articleIssueRouting).toContain('import { isIssueGuideIndexable } from "@/lib/issue-guide-indexability"');
    expect(articleIssueRouting).toContain("isIssueGuideIndexable(guide)");
  });

  it("keeps Texas Law Finder results inside the indexable law-topic cohort", () => {
    expect(lawFinder).toContain('import { isLawTopicIndexable } from "@/lib/law-topic-indexability"');
    expect(lawFinder).toContain("const INDEXABLE_LAW_TOPICS = LAW_TOPICS.filter");
    expect(lawFinder).toContain("return INDEXABLE_LAW_TOPICS.map");
    expect(lawFinder).not.toContain("return LAW_TOPICS.map");
  });
});
