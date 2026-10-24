import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const header = readFileSync("src/components/site-header.tsx", "utf8");
const browserWorkflow = readFileSync(".github/workflows/verify-laws-ui.yml", "utf8");

describe("keyboard-accessible, mobile-sized publisher navigation controls", () => {
  it("does not allow the tiny ticker or brand link to be a 17px-high touch target", () => {
    expect(header).toContain("flex min-h-8 max-w-[320px] items-center");
    expect(header).toContain('className="hidden min-h-8 shrink-0 items-center');
    expect(header).toContain('className="group flex min-h-11 shrink-0 flex-col justify-center"');
  });
  it("keeps 44px minimum interactive navigation and mobile menu hit targets", () => {
    expect(header).toContain("inline-flex min-h-11 items-center gap-1 rounded-md px-3");
    expect(header).toContain("ml-1 inline-flex min-h-11 items-center rounded-md");
    expect(header).toContain("inline-flex min-h-11 min-w-11 flex-col items-start justify-center");
    expect(header).toContain("flex min-h-11 items-center rounded py-2 text-xs");
  });
  it("runs real responsive layout checks when the global header changes", () => {
    expect(browserWorkflow).toContain('"src/components/site-header.tsx"');
    expect(browserWorkflow).toContain("playwright");
  });
});
