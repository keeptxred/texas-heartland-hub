import type { PolicyTracker } from "@/data/policy-trackers";

export const POLICY_TRACKERS_WAVE3: PolicyTracker[] = [
  {
    slug: "medical-freedom",
    shortTitle: "Medical Freedom",
    title: "Texas Medical Freedom Policy Tracker",
    description: "Track Texas informed-consent rules, vaccine exemptions, health-care employment policies, organ-transplant protections, patient choice, and medical-freedom legislation.",
    updated: "2026-08-19",
    quickAnswer: "Texas medical-freedom law is issue-specific rather than one blanket rule. Recent laws include conscience-based vaccine-exemption protections for covered workers at certain health-care facilities and limits on using vaccination status as the sole basis for adverse organ-transplant decisions, while other consent and vaccination rules remain governed by separate statutes.",
    currentStatus: "The 89th Legislature expanded several medical-freedom protections effective in 2025. The permanent policy question is how far Texas should protect individual consent and conscience while preserving physicians' ability to make individualized medical judgments and health facilities' obligations under other law.",
    keyFacts: [
      "SB 407 amended Health and Safety Code Section 224.002 so covered health-care facility vaccine policies must include conscience-based exemption procedures and may not reject those exemptions for the reasons specified by statute.",
      "HB 4076 added protections against adverse organ-transplant decisions based solely on vaccination status, while allowing vaccination status to be considered when a physician determines after individualized evaluation that it is medically significant to the transplant.",
      "HB 4076 took effect September 1, 2025 and directed HHSC to adopt necessary implementing rules by January 1, 2026.",
      "Texas medical-freedom disputes can involve different populations and statutes, so a rule affecting employees, schoolchildren, transplant patients, or minors should not be generalized to every health-care setting.",
    ],
    context: [
      "KTR's editorial emphasis is informed consent and protection from unnecessary coercion. The factual tracker keeps that principle separate from the precise scope of each statute and from individualized clinical judgments expressly preserved by law.",
      "This page is meant to connect health-policy news to enacted statutes, agency implementation, court challenges, and election debates without treating every medical-freedom question as legally identical.",
    ],
    watchFor: [
      "HHSC and licensing-agency implementation of 2025 laws",
      "Court challenges involving conscience, consent, or vaccination-status protections",
      "New legislation affecting minors, employment, schools, hospitals, or public-health powers",
      "Changes to informed-consent and exemption procedures",
    ],
    sources: [
      { label: "Texas Legislature Online — SB 407", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=SB407", primary: true },
      { label: "Texas Legislature Online — HB 4076", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=HB4076", primary: true },
      { label: "Texas Health and Safety Code", url: "https://statutes.capitol.texas.gov/?link=HS", primary: true },
      { label: "Texas Health and Human Services", url: "https://www.hhs.texas.gov/", primary: true },
    ],
    related: [
      { label: "Texas laws", href: "/texas-laws", kind: "law" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
      { label: "Election Central", href: "/elections", kind: "reference" },
      { label: "Texas political reference", href: "/texas-political-reference", kind: "reference" },
    ],
    keywords: ["medical freedom", "informed consent", "vaccine mandate", "vaccine exemption", "SB 407", "HB 4076", "organ transplant", "health care"],
  },
];
