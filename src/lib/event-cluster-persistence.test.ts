import { describe, expect, it } from "vitest";
import { strongSupportingFeedIds } from "./event-cluster-persistence";
import type { StoryCluster } from "./story-clustering";

function clusterWithScores(scores: number[]): StoryCluster {
  const primary = {
    id: 100,
    title: "Governor Abbott Announces Education Grants For Open Educational Resources",
    source: "Office of the Governor",
    link: "https://gov.texas.gov/education-grants",
    description: "Education grants for open educational resources at Texas colleges.",
    pub_date: "2026-08-17T13:00:00Z",
  };
  const members = scores.map((combinationScore, index) => ({
    id: 200 + index,
    title: `Supporting report ${index}`,
    source: `Outlet ${index}`,
    link: `https://example.com/${index}`,
    description: "Supporting report",
    pub_date: "2026-08-17T14:00:00Z",
    combinationScore,
    overlapTerms: ["example"],
  }));
  return {
    primary,
    members,
    score: Math.max(0, ...scores),
    sourceCount: 1 + members.length,
    strongMerge: scores.some((score) => score >= 64),
  };
}

describe("durable event cluster inheritance", () => {
  it("does not allow weak context members to choose an existing cluster", () => {
    expect(strongSupportingFeedIds(clusterWithScores([45, 55, 63]))).toEqual([]);
  });

  it("allows only members clearing the primary strong-merge threshold", () => {
    expect(strongSupportingFeedIds(clusterWithScores([45, 64, 82]))).toEqual([201, 202]);
  });
});
