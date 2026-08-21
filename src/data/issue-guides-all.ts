import {
  ISSUE_CATEGORIES,
  issueGuides as baseIssueGuides,
  type IssueGuide,
} from "@/data/issue-guides";
import { applyPriorityIssueGuideUpgrade } from "@/data/issue-guide-priority-upgrades";

export { ISSUE_CATEGORIES };
export type { IssueGuide };

export const issueGuides: IssueGuide[] = baseIssueGuides.map(applyPriorityIssueGuideUpgrade);

export const issueGuideBySlug = Object.fromEntries(
  issueGuides.map((guide) => [guide.slug, guide]),
) as Record<string, IssueGuide>;

export function getGuidesByCategory(category: string) {
  return issueGuides.filter((guide) => guide.category === category);
}
