import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const decision = readFileSync("src/routes/api/public/hooks/decide-newsroom-packages.ts", "utf8");
const publisher = readFileSync("src/routes/api/public/hooks/generate-newsroom.ts", "utf8");

describe("repeat newsroom decisions preserve prior HELD diagnostics", () => {
  it("does not erase a generation or publication failure when updating a HELD format", () => {
    expect(decision).toContain('.in("status", ["PENDING", "HELD"])');
    expect(decision).toContain('rejection_reason: result.decision === "SKIP"');
    expect(decision).toContain('candidate.status === "HELD" ? candidate.rejection_reason : null');
    expect(decision).not.toContain('rejection_reason: result.decision === "SKIP" ? result.reason : null');
  });

  it("does not silently retry failed candidates or bypass the publisher recovery gates", () => {
    expect(publisher).toContain('.is("rejection_reason", null)');
    expect(publisher).toContain('.eq("status", "HELD")');
    expect(publisher).toContain('status: "HELD"');
    expect(publisher).toContain('rejection_reason: failureDetails');
  });
});
