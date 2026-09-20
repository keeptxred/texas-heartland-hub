import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_REPAIR_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-landlord-repair-law": {
    slug: "texas-landlord-repair-law",
    title: "Texas Landlord Repair Law: Health, Safety, Notice and the Seven-Day Presumption",
    dek: "When a Texas residential landlord has a duty to repair, how tenants must give notice, what counts as a health-or-safety condition, and when remedies can become available.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Section 92.052 generally requires a landlord to make a diligent effort to repair a condition that materially affects an ordinary tenant's physical health or safety when statutory prerequisites are met.",
      "The tenant generally must be current on rent when required repair notices are given, and the condition generally cannot have been caused by the tenant, household, family, or guests except through normal wear and tear.",
      "Section 92.056 creates a rebuttable presumption that seven days is a reasonable time for repair, but severity, notice timing, and availability of labor, materials, and utilities can change the analysis.",
      "A written lease can require written repair notice; a properly delivered tracked-mail first notice can eliminate the need for a second notice under Section 92.056.",
    ],
    intro: [
      "Texas residential repair law does not make the landlord responsible for every inconvenience. Property Code Sections 92.052 and 92.056 focus on conditions that materially affect the physical health or safety of an ordinary tenant and set out notice, rent-status, timing, and causation requirements.",
      "That process matters. A tenant who skips the notice steps or withholds rent outside the statutory remedies can create a separate dispute, while a landlord who ignores a qualifying condition after proper notice can face statutory remedies.",
    ],
    sections: [
      { heading: "Which conditions trigger the duty", paragraphs: ["Section 92.052 generally requires a diligent repair effort when the tenant gives proper notice, is not delinquent in rent at the time of notice, and the condition materially affects ordinary physical health or safety or involves the landlord's failure to provide and maintain a hot-water device meeting the statutory standard." ] },
      { heading: "Notice must go to the right place", paragraphs: ["The tenant must notify the person to whom or the place where rent is normally paid. If the written lease requires written notice, the notice must be in writing. Section 92.056 then governs the additional notice and timing rules tied to remedies." ] },
      { heading: "Seven days is a presumption, not an absolute deadline", paragraphs: ["Section 92.056 creates a rebuttable presumption that seven days is a reasonable time. The law directs courts to consider when notice was received, the severity and nature of the condition, and the reasonable availability of labor, materials, and utilities." ] },
      { heading: "Remedies depend on following the statute", paragraphs: ["When the statutory requirements are satisfied and the landlord remains liable, Section 92.056 can permit lease termination, qualifying repair-and-deduct remedies under Section 92.0561, or judicial remedies under Section 92.0563. Those remedies have their own prerequisites and should not be treated as automatic permission to stop paying rent." ] },
    ],
    faq: [
      { q: "Does a Texas landlord have to fix every problem in a rental?", a: "Not under the health-and-safety statute. Section 92.052 focuses on conditions that materially affect an ordinary tenant's physical health or safety, plus the statutory hot-water requirement, subject to the other conditions in the law." },
      { q: "Does a landlord always have exactly seven days to repair?", a: "No. Section 92.056 creates a rebuttable presumption that seven days is reasonable, but the facts can support a shorter or longer period." },
      { q: "Can a tenant simply stop paying rent because repairs are needed?", a: "Texas repair remedies are procedural. Withholding rent outside the authorized remedies can create liability, so tenants should follow Sections 92.052, 92.056, and 92.0561 carefully." },
    ],
    sources: [
      { label: "Texas Property Code § 92.052", url: "https://statutes.capitol.texas.gov/?artSec=92.052&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code § 92.056", url: "https://statutes.capitol.texas.gov/?artSec=92.056&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas State Law Library — Landlord duty to repair", url: "https://sll.texas.gov/faqs/landlord-duty-to-repair/" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Texas repair-and-deduct law", href: "/guides/texas-repair-and-deduct-law" },
      { label: "Texas landlord retaliation law", href: "/guides/texas-landlord-retaliation-law" },
    ],
  },
};
