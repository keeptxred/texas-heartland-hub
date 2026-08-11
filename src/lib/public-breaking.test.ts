import { describe, expect, it } from "vitest";
import { isPublicBreaking, PUBLIC_BREAKING_WINDOW_MS } from "./public-breaking";

const now = Date.parse("2026-08-11T02:00:00Z");

function article(overrides: Partial<Parameters<typeof isPublicBreaking>[0]> = {}) {
  return {
    title: "Texas update",
    dek: "",
    category: "Texas News",
    source_name: "Keep TX Red Newsroom",
    published_at: new Date(now - 60 * 60 * 1000).toISOString(),
    is_breaking: true,
    ...overrides,
  };
}

describe("isPublicBreaking", () => {
  it("requires the broader newsroom breaking flag", () => {
    expect(isPublicBreaking(article({ title: "Tornado emergency issued for Texas county", is_breaking: false }), now)).toBe(false);
  });

  it("rejects priority stories without an urgent public-breaking signal", () => {
    expect(isPublicBreaking(article({ title: "Governor announces new Texas appointment" }), now)).toBe(false);
  });

  it("accepts urgent public-safety events", () => {
    expect(isPublicBreaking(article({ title: "Evacuations ordered as wildfire threatens Texas town" }), now)).toBe(true);
  });

  it("accepts decisive election events", () => {
    expect(isPublicBreaking(article({ title: "Texas runoff race called; winner projected" }), now)).toBe(true);
  });

  it("expires public-breaking status after 12 hours", () => {
    expect(isPublicBreaking(article({
      title: "Tornado emergency issued for Texas county",
      published_at: new Date(now - PUBLIC_BREAKING_WINDOW_MS - 1).toISOString(),
    }), now)).toBe(false);
  });
});
