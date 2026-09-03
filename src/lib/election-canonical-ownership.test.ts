import { describe, expect, it } from "vitest";
import { electionRouteHeadOwnsCanonical } from "@/components/elections/layout/ElectionLayout";

describe("Election Central canonical ownership", () => {
  it("keeps route-head ownership for the priority leaves that already declare canonicals", () => {
    for (const path of [
      "/elections/2026",
      "/elections/voting",
      "/elections/races",
      "/elections/statewide",
      "/elections/districts",
      "/elections/candidates",
      "/elections/methodology",
      "/elections/results",
    ]) {
      expect(electionRouteHeadOwnsCanonical(path), path).toBe(true);
    }
  });

  it("preserves layout ownership for the polls index because its parent route omits a canonical", () => {
    expect(electionRouteHeadOwnsCanonical("/elections/polls")).toBe(false);
  });

  it("defers dynamic detail canonicals to their route heads", () => {
    for (const path of [
      "/elections/candidates/example-candidate",
      "/elections/districts/congressional-district-7",
      "/elections/polls/example-poll",
      "/elections/results/example-result",
      "/elections/forecast/example-forecast",
      "/elections/races/example-race",
    ]) {
      expect(electionRouteHeadOwnsCanonical(path), path).toBe(true);
    }
  });

  it("normalizes a trailing slash before deciding ownership", () => {
    expect(electionRouteHeadOwnsCanonical("/elections/2026/")).toBe(true);
    expect(electionRouteHeadOwnsCanonical("/elections/polls/")).toBe(false);
  });
});
