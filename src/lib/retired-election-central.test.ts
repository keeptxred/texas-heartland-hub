import { describe, expect, it } from "vitest";
import { isRetiredElectionCentralPath } from "./retired-election-central";

describe("public Election Central retirement", () => {
  it.each([
    "/elections",
    "/elections/",
    "/elections/2026",
    "/elections/candidates/example",
    "/elections/races/example",
    "/elections/reference.json",
    "/election-central",
    "/texas-elections",
    "/elections-2026",
    "/candidate-guides",
    "/texas-news/elections",
  ])("retires %s", (path) => {
    expect(isRetiredElectionCentralPath(path)).toBe(true);
  });

  it.each([
    "/",
    "/news/texas-election-coverage",
    "/texas-politics",
    "/county-elections",
    "/admin/elections",
    "/api/elections/district-lookup",
    "/register-to-vote",
    "/voting-locations",
    "/elections-results",
  ])("preserves non-central route %s", (path) => {
    expect(isRetiredElectionCentralPath(path)).toBe(false);
  });
});
