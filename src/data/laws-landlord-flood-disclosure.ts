import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_FLOOD_DISCLOSURE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-rental-flood-disclosure-law": {
    slug: "texas-rental-flood-disclosure-law",
    title: "Texas Rental Flood Disclosure Law: What Landlords Must Tell Tenants",
    dek: "Texas Property Code Section 92.0135 explained, including 100-year floodplain notice, prior flooding disclosure, the 2025 signature requirement, short-term exemptions, and tenant remedies.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Property Code Section 92.0135 requires specified written flood-risk disclosures for many residential leases.",
      "The statute addresses both whether the landlord is aware the dwelling is in a 100-year floodplain and whether the dwelling has flooded during the statutory lookback period.",
      "Senate Bill 2349, effective September 1, 2025, requires the document containing the applicable notice to be signed by both landlord and tenant and clarifies exemptions for certain short-term and temporary tenancies.",
      "The 2025 changes apply to leases entered into or renewed on or after September 1, 2025.",
    ],
    intro: ["Texas created a statewide residential flood-disclosure rule in Property Code Section 92.0135. The law is especially relevant in flood-prone communities because it requires disclosure before or when the lease is executed rather than after a flood occurs.", "The Legislature revised the rule in 2025 through Senate Bill 2349, so older forms and articles may omit the current signature requirement or short-term exemptions."],
    sections: [
      { heading: "Floodplain notice", paragraphs: ["Section 92.0135 requires a written notice addressing whether the landlord is aware the dwelling is located in a 100-year floodplain, subject to the statute's exceptions."] },
      { heading: "Prior flooding disclosure", paragraphs: ["The section also requires a separate written statement when the landlord knows flooding has damaged any portion of the dwelling during the statutory period before the lease takes effect."] },
      { heading: "What changed September 1, 2025", paragraphs: ["SB 2349 allows the notices to appear in the lease, an addendum, or a separate written document and requires landlord and tenant signatures to evidence provision and receipt. It also confirms exemptions for leases under 30 days and specified temporary sale-related occupancies."] },
      { heading: "Why the disclosure matters", paragraphs: ["Section 92.0135 provides a lease-termination remedy in specified circumstances when required notice was not given and flooding later causes substantial loss or damage to the tenant's personal property."] },
    ],
    faq: [
      { q: "Must a Texas landlord disclose flood risk?", a: "Section 92.0135 requires specified floodplain and prior-flooding disclosures for covered residential leases." },
      { q: "What changed in 2025?", a: "SB 2349 added a signature requirement for the document containing the notice and clarified exemptions for certain short-term and temporary tenancies, effective September 1, 2025." },
      { q: "Do the 2025 changes apply to older leases?", a: "SB 2349 applies the changes to leases entered into or renewed on or after September 1, 2025." },
    ],
    sources: [
      { label: "Texas Property Code § 92.0135", url: "https://statutes.capitol.texas.gov/?artSec=92.0135&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Legislature — SB 2349 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB02349F.HTM" },
    ],
    related: [{ label: "Texas Laws Explained", href: "/laws" }, { label: "Texas casualty-loss lease law", href: "/guides/texas-rental-casualty-loss-law" }, { label: "Texas landlord repair law", href: "/guides/texas-landlord-repair-law" }],
  },
};
