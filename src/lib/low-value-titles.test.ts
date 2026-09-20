import { describe, expect, it } from "vitest";
import { isLowValueTitle } from "./low-value-titles";

describe("isLowValueTitle newsroom spam guards", () => {
  it("rejects observed live-stream affiliate spam and utility filler", () => {
    expect(isLowValueTitle("[WATCHLIVE]TV!] Dallas Cowboys vs New Orleans Saints Live TV Coverage 28 August 2026")).toBe(true);
    expect(isLowValueTitle("Dallas Cowboys vs New Orleans Saints Live TV Coverage")).toBe(true);
    expect(isLowValueTitle("Build a Button!")).toBe(true);
  });

  it("keeps legitimate sports and product/news headlines eligible", () => {
    expect(isLowValueTitle("Cowboys release final roster before Week 1")).toBe(false);
    expect(isLowValueTitle("Where to watch the Dallas Cowboys preseason game on local TV")).toBe(false);
    expect(isLowValueTitle("Austin startup builds a panic button for school safety")).toBe(false);
  });
});
