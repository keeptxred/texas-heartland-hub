import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  SCJC_2025_REFORMS,
  SCJC_COMPLAINT_STEPS,
  SCJC_CURRENT_MEMBERS,
  SCJC_FAQS,
  SCJC_JURISDICTION,
  SCJC_LIMITS,
  SCJC_SOURCES,
  SCJC_TIMELINE,
} from "./texas-judicial-conduct-authority";

describe("Texas State Commission on Judicial Conduct authority", () => {
  it("preserves the current 13-member six-judge seven-citizen structure", () => {
    expect(SCJC_CURRENT_MEMBERS).toHaveLength(13);
    expect(SCJC_CURRENT_MEMBERS.filter((member) => member.role === "Judge member")).toHaveLength(6);
    expect(SCJC_CURRENT_MEMBERS.filter((member) => member.role === "Public member")).toHaveLength(7);
    expect(new Set(SCJC_CURRENT_MEMBERS.map((member) => member.name)).size).toBe(13);

    const chair = SCJC_CURRENT_MEMBERS.find((member) => member.officer === "Chair");
    expect(chair?.name).toBe("Ken Wise");
    expect(chair?.appointedBy).toBe("Supreme Court of Texas");
  });

  it("keeps every major 2025 Proposition 12 reform", () => {
    expect(SCJC_2025_REFORMS).toHaveLength(6);
    const text = SCJC_2025_REFORMS.map((reform) => `${reform.title} ${reform.text}`).join(" ");
    expect(text).toContain("six judges");
    expect(text).toContain("seven citizens");
    expect(text).toContain("private reprimand");
    expect(text).toContain("public admonition");
    expect(text).toContain("suspension without pay");
    expect(text).toContain("Review Tribunal");
    expect(text).toContain("January 1, 2026");
  });

  it("tracks judicial discipline from creation through the current structure", () => {
    const years = SCJC_TIMELINE.map((item) => item.year);
    expect(years).toContain("1965");
    expect(years).toContain("1987");
    expect(years).toContain("2022");
    expect(years).toContain("2025");
    expect(years).toContain("2026");
  });

  it("preserves the official mail-only complaint instructions", () => {
    const text = SCJC_COMPLAINT_STEPS.map((step) => `${step.title} ${step.text}`).join(" ").toLowerCase();
    expect(text).toContain("signed");
    expect(text).toContain("sworn");
    expect(text).toContain("mail");
    expect(text).toContain("p.o. box 12265");
    expect(text).toContain("online form");
    expect(text).toContain("telephone");
    expect(text).toContain("email");
    expect(text).toContain("fax");
  });

  it("keeps judicial jurisdiction distinct from non-SCJC complaints", () => {
    expect(SCJC_JURISDICTION.covers).toContain("Municipal judges");
    expect(SCJC_JURISDICTION.covers).toContain("Justices of the peace");
    expect(SCJC_JURISDICTION.covers).toContain("District judges");
    expect(SCJC_JURISDICTION.covers).toContain("Appellate judges and justices");
    expect(SCJC_JURISDICTION.doesNotCover).toContain("Federal judges and federal magistrate judges");
    expect(SCJC_JURISDICTION.doesNotCover).toContain("Attorneys acting as attorneys, including prosecutors");

    const limits = SCJC_LIMITS.join(" ").toLowerCase();
    expect(limits).toContain("cannot exercise appellate review");
    expect(limits).toContain("change a judge's ruling or sentence");
    expect(limits).toContain("cannot award damages");
  });

  it("retains voter-facing FAQs and a primary-source stack", () => {
    expect(SCJC_FAQS.length).toBeGreaterThanOrEqual(8);
    expect(SCJC_SOURCES.length).toBeGreaterThanOrEqual(12);

    const allowedHosts = new Set([
      "scjc.texas.gov",
      "www.scjc.texas.gov",
      "statutes.capitol.texas.gov",
      "capitol.texas.gov",
      "www.sos.texas.gov",
    ]);
    for (const source of SCJC_SOURCES) {
      expect(allowedHosts.has(new URL(source.href).hostname), source.href).toBe(true);
    }
  });

  it("wires the canonical route into the government hub and sitemap", () => {
    const route = readFileSync("src/routes/texas-government.state-commission-on-judicial-conduct.tsx", "utf8");
    const component = readFileSync("src/components/texas-judicial-conduct-authority-page.tsx", "utf8");
    const hub = readFileSync("src/routes/texas-government.index.tsx", "utf8");
    const sitemap = readFileSync("src/routes/sitemap-government[.]xml.ts", "utf8");
    const path = "/texas-government/state-commission-on-judicial-conduct";

    expect(route).toContain(`createFileRoute(\"${path}\")`);
    expect(route).toContain("TexasJudicialConductAuthorityPage");
    expect(route).toContain("texasJudicialConductAuthorityHead");
    expect(component).toContain(`const CANONICAL = \`\${SITE_URL}${path}\``);
    expect(component).toContain('name: "robots", content: "index, follow, max-image-preview:large"');
    expect(hub).toContain(`href=\"${path}\"`);
    expect(sitemap).toContain(`${path}\`, lastmod: toIsoDate(SCJC_REVIEWED)`);
  });
});
