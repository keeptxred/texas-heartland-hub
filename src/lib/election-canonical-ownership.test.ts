import { describe, expect, it } from "vitest";
import {
  electionRouteHeadOwnsCanonical,
  electionRouteHeadOwnsMetadata,
} from "@/components/elections/layout/ElectionLayout";

const ROUTE_OWNED_LEAVES = [
  "/elections/2026",
  "/elections/voting",
  "/elections/races",
  "/elections/statewide",
  "/elections/legislative",
  "/elections/districts",
  "/elections/candidates",
  "/elections/methodology",
  "/elections/results",
  "/elections/forecast",
  "/elections/corrections",
] as const;

const ROUTE_OWNED_DETAILS = [
  "/elections/candidates/example-candidate",
  "/elections/districts/congressional-district-7",
  "/elections/polls/example-poll",
  "/elections/results/example-result",
  "/elections/forecast/example-forecast",
  "/elections/races/example-race",
] as const;

describe("Election Central canonical ownership", () => {
  it("keeps route-head ownership for leaves that already declare canonicals", () => {
    for (const path of ROUTE_OWNED_LEAVES) {
      expect(electionRouteHeadOwnsCanonical(path), path).toBe(true);
    }
  });

  it("preserves layout canonical ownership for the polls index", () => {
    expect(electionRouteHeadOwnsCanonical("/elections/polls")).toBe(false);
  });

  it("defers dynamic detail canonicals to their route heads", () => {
    for (const path of ROUTE_OWNED_DETAILS) {
      expect(electionRouteHeadOwnsCanonical(path), path).toBe(true);
    }
  });

  it("normalizes a trailing slash before deciding canonical ownership", () => {
    expect(electionRouteHeadOwnsCanonical("/elections/2026/")).toBe(true);
    expect(electionRouteHeadOwnsCanonical("/elections/polls/")).toBe(false);
  });
});

describe("Election Central metadata ownership", () => {
  it("treats every static route head, including polls, as the metadata owner", () => {
    for (const path of [...ROUTE_OWNED_LEAVES, "/elections/polls"] as const) {
      expect(electionRouteHeadOwnsMetadata(path), path).toBe(true);
    }
  });

  it("defers dynamic detail metadata to their route heads", () => {
    for (const path of ROUTE_OWNED_DETAILS) {
      expect(electionRouteHeadOwnsMetadata(path), path).toBe(true);
    }
  });

  it("keeps the polls canonical exception separate from metadata ownership", () => {
    expect(electionRouteHeadOwnsMetadata("/elections/polls")).toBe(true);
    expect(electionRouteHeadOwnsCanonical("/elections/polls")).toBe(false);
  });

  it("normalizes trailing slashes and leaves unknown election routes to the layout", () => {
    expect(electionRouteHeadOwnsMetadata("/elections/polls/")).toBe(true);
    expect(electionRouteHeadOwnsMetadata("/elections/future-section")).toBe(false);
    expect(electionRouteHeadOwnsMetadata("/")).toBe(false);
  });
});
