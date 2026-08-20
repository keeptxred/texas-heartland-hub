import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_LATE_FEE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-rent-late-fee-law": {
    slug: "texas-rent-late-fee-law",
    title: "Texas Rent Late-Fee Law: Grace Periods and Fee Limits",
    dek: "When a Texas residential landlord may collect a late fee, how the two-full-day rule works, and the statutory standards for reasonable late fees.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "A residential late fee must be disclosed in a written lease and must be reasonable under Property Code Section 92.019.",
      "A landlord may not collect the late fee unless some portion of the rent has remained unpaid two full days after the date the rent was originally due.",
      "Section 92.019 provides statutory percentage benchmarks for what is considered reasonable, based on the number of dwelling units in the structure.",
      "A tenant may request a written statement showing whether a late fee is owed and its amount under Section 92.0191.",
    ],
    intro: [
      "Texas regulates residential rent late fees. Property Code Section 92.019 requires written-lease disclosure, reasonableness, and a two-full-day period after the original due date before a landlord may collect a late fee.",
      "The statute also supplies percentage benchmarks for reasonableness. Those benchmarks do not replace the lease itself, because the fee must still be part of the written agreement.",
    ],
    sections: [
      { heading: "The fee must be written into the lease", paragraphs: ["Section 92.019 requires notice of the late fee in a written lease and requires the fee to be reasonable." ] },
      { heading: "Two full days must pass", paragraphs: ["A landlord may not collect the late fee unless some portion of the rent has remained unpaid two full days after the date rent was originally due." ] },
      { heading: "What the statute treats as reasonable", paragraphs: ["Section 92.019 treats a fee as reasonable when it is not more than 12 percent of the rent for a dwelling in a structure with no more than four units or 10 percent for a dwelling in a structure with more than four units. The statute also addresses higher fees tied to uncertain damages related to late-payment collection." ] },
      { heading: "A tenant can request a written statement", paragraphs: ["Section 92.0191 allows a tenant to request a written statement of whether a late fee is owed and, if so, the amount. The landlord must provide it through an established means of written communication used between the parties." ] },
    ],
    faq: [
      { q: "Can a Texas landlord charge a late fee the day after rent is due?", a: "Section 92.019 says the fee may not be collected unless rent has remained unpaid two full days after the original due date." },
      { q: "Does the late fee have to be written in the lease?", a: "Yes. Section 92.019 requires notice of the fee in a written lease." },
      { q: "Can a tenant ask for a written late-fee statement?", a: "Yes. Section 92.0191 allows a tenant to request a written statement showing whether a late fee is owed and the amount." },
    ],
    sources: [
      { label: "Texas Property Code § 92.019", url: "https://statutes.capitol.texas.gov/?artSec=92.019&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code § 92.0191", url: "https://statutes.capitol.texas.gov/?artSec=92.0191&chapter=PR.92&code=PR&tab=1" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Texas security deposit law", href: "/guides/texas-security-deposit-law" },
      { label: "Texas eviction process", href: "/guides/texas-eviction-process-guide" },
    ],
  },
};
