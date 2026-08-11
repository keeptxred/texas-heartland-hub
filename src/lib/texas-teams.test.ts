import { describe, expect, it } from "vitest";
import { canonicalTeamSlug, TEAM_SLUG_ALIASES } from "@/lib/texas-teams";

describe("Texas sports team URL canonicalization", () => {
  it("redirects the historical Aggies slug to the canonical Texas A&M slug", () => {
    expect(TEAM_SLUG_ALIASES.aggies).toBe("texas-am");
    expect(canonicalTeamSlug("aggies")).toBe("texas-am");
  });

  it("preserves canonical slugs and rejects unknown teams", () => {
    expect(canonicalTeamSlug("texas-am")).toBe("texas-am");
    expect(canonicalTeamSlug("not-a-team")).toBeNull();
  });
});
