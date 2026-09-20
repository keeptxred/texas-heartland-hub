import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_CASUALTY_LOSS_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-rental-casualty-loss-law": {
    slug: "texas-rental-casualty-loss-law",
    title: "Texas Rental Casualty Loss Law: Fire, Storm Damage and Lease Termination",
    dek: "Texas Property Code Section 92.054 explained, including insured casualty losses, totally or partially unusable rental premises, lease termination, rent refunds, and rent reduction.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Section 92.054 addresses rental conditions caused by insured casualty losses such as fire, smoke, hail, explosion, or similar events.",
      "When premises are practically totally unusable for residential purposes and the casualty was not caused by the tenant, qualifying household members, or guests, either landlord or tenant may terminate before repairs are completed by giving written notice.",
      "If the lease is terminated under the section, the tenant is entitled to the rent and security-deposit treatment stated by the statute.",
      "When premises are only partially unusable, the statute addresses proportional rent reduction, subject to its court and lease provisions.",
    ],
    intro: ["A fire, major storm, explosion, or similar casualty can create a different legal situation from an ordinary maintenance problem. Texas Property Code Section 92.054 specifically addresses casualty-loss conditions in residential rentals.", "The statute distinguishes between premises that are practically totally unusable and those that remain partially usable."],
    sections: [
      { heading: "Insured casualty losses", paragraphs: ["Section 92.054 delays the ordinary repair period for an insured casualty loss until the landlord receives insurance proceeds, as provided by the statute."] },
      { heading: "When the dwelling is totally unusable", paragraphs: ["If the premises are practically totally unusable for residential purposes and the casualty was not caused by the tenant, specified household members, or guests, either landlord or tenant may terminate by written notice before repairs are completed."] },
      { heading: "Refunds after termination", paragraphs: ["When the lease is terminated under the section, the statute provides for a pro rata rent refund from the date the tenant moves out and the security-deposit refund otherwise required by law."] },
      { heading: "Partially unusable premises", paragraphs: ["If the casualty leaves the dwelling partially unusable, Section 92.054 addresses a proportional reduction in rent under the conditions stated by the statute, while allowing the written lease to provide otherwise in specified circumstances."] },
    ],
    faq: [
      { q: "Can a Texas tenant end a lease after a fire makes the rental unusable?", a: "Section 92.054 can allow termination when the premises are practically totally unusable, the casualty was not caused by the tenant or specified others, and the statutory procedure is followed." },
      { q: "What if only part of the rental is unusable?", a: "Section 92.054 addresses proportional rent reduction for qualifying partial unusability, subject to the statute and written lease." },
      { q: "Does a casualty automatically end the lease?", a: "No. The statute provides rights and procedures; the lease does not automatically disappear simply because damage occurred." },
    ],
    sources: [{ label: "Texas Property Code § 92.054", url: "https://statutes.capitol.texas.gov/?artSec=92.054&chapter=PR.92&code=PR&tab=1" }],
    related: [{ label: "Texas Laws Explained", href: "/laws" }, { label: "Texas rental flood disclosure law", href: "/guides/texas-rental-flood-disclosure-law" }, { label: "Texas landlord repair law", href: "/guides/texas-landlord-repair-law" }],
  },
};
