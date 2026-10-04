import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");

describe("KTR authority ranking remediation", () => {
  it("keeps the Texas Legislature hub aligned to bill-search intent", () => {
    const route = read("src/routes/texas-legislature.index.tsx");
    expect(route).toContain('Texas Legislature: Bills, House, Senate & Current Session');
    expect(route).toContain('Texas Legislature bill search');
    expect(route).toContain('Texas bill search →');
    expect(route).toContain('https://capitol.texas.gov/');
  });

  it("funnels curated authority guides back to the core legislative hubs", () => {
    const page = read("src/components/search-recovery-authority-page.tsx");
    expect(page).toContain('to="/bills"');
    expect(page).toContain('to="/texas-legislature"');
    expect(page).toContain('to="/laws"');
  });

  it("keeps homeowner property-tax tasks on TexasDefined while KTR owns policy", () => {
    const patch = read("src/data/issue-guide-property-tax-policy-patch.ts");
    expect(patch).toContain('https://texasdefined.com/learn/property-taxes');
    expect(patch).toContain('https://texasdefined.com/decide/property-taxes');
    expect(patch).toContain('https://texasdefined.com/do/homestead-exemption');
    expect(patch).toContain('https://texasdefined.com/do/property-tax-protest');
    expect(patch).toContain('KTR covers policy; TexasDefined covers homeowner tasks');
  });
});