import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

const governmentHub = read("../routes/texas-government.tsx");
const governmentEntity = read("../routes/texas-government.$entitySlug.tsx");
const policyTrackerPage = read("../components/policy-tracker-page.tsx");
const electionErrorState = read("../components/elections/states/ElectionErrorState.tsx");

const LEGACY_LAW_ALIASES = [
  "/laws/texas-gun-laws-explained",
  "/laws/texas-property-tax-laws-explained",
  "/laws/texas-election-laws-explained",
  "/laws/texas-new-laws-2026",
  "/laws/texas-constitution",
] as const;

const CANONICAL_LAW_TARGETS = [
  "/news/texas-gun-laws-explained",
  "/news/texas-property-tax-laws-explained",
  "/news/texas-election-laws-explained",
  "/news/texas-new-laws-2026",
  "/laws",
] as const;

describe("direct canonical UI links", () => {
  it("links the government hub directly to the canonical laws page", () => {
    expect(governmentHub).not.toContain('href="/laws/texas-constitution"');
    expect(governmentHub).toContain('href="/laws"');
  });

  it("canonicalizes legacy law aliases before policy tracker links render", () => {
    expect(policyTrackerPage).toContain("const href = canonicalPermanentHref(item.href)");
    for (const legacy of LEGACY_LAW_ALIASES) expect(policyTrackerPage).toContain(`\"${legacy}\"`);
    for (const canonical of CANONICAL_LAW_TARGETS) expect(policyTrackerPage).toContain(`\"${canonical}\"`);
  });

  it("canonicalizes government authority links before they render", () => {
    expect(governmentEntity).toContain("const href = canonicalAuthorityHref(link.href)");
    expect(governmentEntity).toContain("href={canonicalAuthorityHref(link.href)}");
    for (const legacy of LEGACY_LAW_ALIASES) expect(governmentEntity).toContain(`\"${legacy}\"`);
    for (const canonical of CANONICAL_LAW_TARGETS) expect(governmentEntity).toContain(`\"${canonical}\"`);
  });

  it("does not route government fallback navigation through /politics", () => {
    expect(governmentEntity).not.toContain('href="/politics"');
    expect(governmentEntity).toContain('href="/texas-politics"');
  });

  it("does not route election recovery through the legacy election-law alias", () => {
    expect(electionErrorState).not.toContain('href: "/laws/texas-election-laws-explained"');
    expect(electionErrorState).toContain('href: "/news/texas-election-laws-explained"');
  });
});
