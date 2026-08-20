import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_REPAIR_DEDUCT_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-repair-and-deduct-law": {
    slug: "texas-repair-and-deduct-law",
    title: "Texas Repair-and-Deduct Law: When Tenants Can Arrange Repairs",
    dek: "Texas repair-and-deduct rules explained, including notice, eligible conditions, deduction limits, contractor requirements, and the September 2025 HB 2037 update.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Repair-and-deduct is a limited statutory remedy under Property Code Section 92.0561, not a general right to subtract any repair bill from rent.",
      "The landlord must first be liable under Section 92.056, and the tenant must satisfy the notice and qualifying-condition rules in Section 92.0561.",
      "The deduction generally may not exceed one month's rent or $500, whichever is greater, subject to the statute's additional rules.",
      "HB 2037 changed the contractor rule for leases entered into or renewed on or after September 1, 2025: qualifying repairs must be made by an independent company, contractor, or repairman, with local licensing compliance where required.",
    ],
    intro: [
      "Texas repair-and-deduct law is highly procedural. Section 92.0561 allows the remedy only after the landlord has become liable under Section 92.056 and only for the conditions and notice steps the statute specifies.",
      "HB 2037 changed the contractor-selection language effective September 1, 2025 for leases entered into or renewed on or after that date, replacing the former phone-book and classified-ad language with an independent-contractor standard.",
    ],
    sections: [
      { heading: "The landlord must first be liable under the repair statute", paragraphs: ["A tenant cannot jump directly to repair-and-deduct. Section 92.0561 begins with landlord liability under Section 92.056, which depends on notice, timing, rent status, and the nature and cause of the condition." ] },
      { heading: "Only specified conditions qualify", paragraphs: ["Section 92.0561 identifies categories such as certain sewage backups or flooding, loss of potable water when the landlord agreed to furnish it, inadequate heating or cooling after specified official notice, and other health-or-safety conditions after the required official notice." ] },
      { heading: "The deduction is capped", paragraphs: ["The statute generally caps the repair deduction at one month's rent or $500, whichever is greater, with additional rules for subsidized housing and repeated repairs." ] },
      { heading: "HB 2037 changed who may perform the repair", paragraphs: ["For leases entered into or renewed on or after September 1, 2025, HB 2037 requires repair work under this remedy to be performed by an independent company, contractor, or repairman. If local law requires licensing, the person or entity must comply with that requirement." ] },
    ],
    faq: [
      { q: "Can a Texas tenant deduct any repair bill from rent?", a: "No. Section 92.0561 is a limited remedy with specific notice, condition, timing, contractor, and deduction requirements." },
      { q: "What changed on September 1, 2025?", a: "HB 2037 replaced the former phone-book/classified-ad contractor language with an independent-contractor requirement and local licensing compliance where applicable." },
      { q: "How much can usually be deducted?", a: "Section 92.0561 generally uses a cap of one month's rent or $500, whichever is greater, subject to the statute's additional rules." },
    ],
    sources: [
      { label: "Texas Property Code § 92.0561", url: "https://statutes.capitol.texas.gov/?artSec=92.0561&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Legislature — HB 2037 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB02037F.HTM" },
      { label: "Texas Property Code § 92.056", url: "https://statutes.capitol.texas.gov/?artSec=92.056&chapter=PR.92&code=PR&tab=1" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Texas landlord repair law", href: "/guides/texas-landlord-repair-law" },
      { label: "Texas landlord retaliation law", href: "/guides/texas-landlord-retaliation-law" },
    ],
  },
};
