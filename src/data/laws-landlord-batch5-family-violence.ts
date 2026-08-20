import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_BATCH5_FAMILY_VIOLENCE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-family-violence-lease-termination-law": {
    slug: "texas-family-violence-lease-termination-law",
    title: "Texas Family Violence Lease Termination Law: When a Tenant Can Leave Early",
    dek: "Property Code Section 92.016 explained, including qualifying family violence, documentation, notice, vacating the dwelling, future-rent protection, and nonwaivable rights.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Property Code Section 92.016 gives qualifying tenants a statutory right to terminate a residential lease early and avoid future rent and specified lease-termination charges when the section's requirements are met.",
      "The statute requires qualifying documentation and contains notice and move-out requirements, with a special notice exception in specified circumstances involving a cotenant or occupant who committed the family violence.",
      "The right applies to a tenant who is a victim and, in specified circumstances, a tenant who is a parent or guardian of a victim residing with the tenant.",
      "Section 92.016 says the tenant's right to terminate under the section may not be waived.",
    ],
    intro: [
      "Texas law gives residential tenants a specific early-termination path when family violence creates the circumstances described by Property Code Section 92.016. This is a statutory right, not merely a request for a voluntary lease release.",
      "The protection is procedural. Documentation, written notice, timing, residency, and vacating requirements matter, so a tenant should use the current statutory text rather than a generic lease-cancellation form.",
    ],
    sections: [
      { heading: "Who the statute protects", paragraphs: ["Section 92.016 covers a qualifying tenant who is a victim of family violence and can also apply when the tenant is the parent or guardian of a qualifying victim who resides with the tenant. The statute incorporates the Family Code definition of family violence." ] },
      { heading: "Documentation matters", paragraphs: ["The section identifies forms of documentation that can establish the statutory right. A tenant should match the documentation to the current text of Section 92.016 rather than assume any informal report is sufficient." ] },
      { heading: "Notice and move-out requirements", paragraphs: ["The statute generally uses written termination notice and requires the tenant to vacate. It contains a special exception to the advance-notice requirement in specified circumstances when the family violence was committed by a cotenant or occupant and the statutory documentation conditions are satisfied." ] },
      { heading: "What the protection changes", paragraphs: ["When the statute is properly used, it allows the tenant to end the lease and avoid liability for future rent and specified sums due solely because of early termination. It does not automatically erase unrelated delinquent obligations that accrued before termination unless another provision applies." ] },
    ],
    faq: [
      { q: "Can a Texas tenant end a lease early because of family violence?", a: "Yes, when the requirements of Property Code Section 92.016 are satisfied, including the applicable documentation, notice, residency, and move-out conditions." },
      { q: "Is advance notice always required?", a: "No. Section 92.016 contains a specific exception to the advance-notice requirement in certain cases involving a cotenant or occupant who committed the family violence." },
      { q: "Can a lease waive this termination right?", a: "No. Section 92.016 provides that the tenant's right to terminate under the section may not be waived." },
    ],
    sources: [
      { label: "Texas Property Code § 92.016", url: "https://statutes.capitol.texas.gov/?artSec=92.016&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Family Code § 71.004 — Family Violence", url: "https://statutes.capitol.texas.gov/?artSec=71.004&chapter=FA.71&code=FA&tab=1" },
    ],
    related: [
      { label: "Texas Landlord & Tenant Laws", href: "/laws" },
      { label: "Breaking a Texas lease", href: "/guides/texas-breaking-lease-law" },
      { label: "Sex-offense and stalking lease termination", href: "/guides/texas-sex-offense-stalking-lease-termination-law" },
    ],
  },
};
