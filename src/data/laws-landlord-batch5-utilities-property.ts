import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const related = [{ label: "Texas Landlord & Tenant Laws", href: "/laws" }];

export const LANDLORD_BATCH5_UTILITIES_PROPERTY_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-landlord-utility-shutoff-law": {
    slug: "texas-landlord-utility-shutoff-law",
    title: "Texas Landlord Utility Shutoff Law: Water, Gas and Electricity Protections",
    dek: "When a Texas landlord may and may not interrupt residential utility service, including direct-pay utilities, landlord-furnished service, electric submeter procedures, and tenant remedies.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Property Code Section 92.008 generally prohibits a landlord from interrupting utility service paid directly by the tenant to the utility company except for bona fide repairs, construction, or an emergency.",
      "The statute also restricts interruption of water, wastewater, gas, and electric service furnished to a tenant by the landlord, with narrow procedures for certain submetered electric-service nonpayment situations.",
      "Section 92.0091 provides a court process for restoration of utilities after an unlawful disconnection.",
      "Section 92.301 addresses a different problem: utility cutoff caused by a landlord's failure to pay a utility company and gives qualifying tenants notice and remedy options.",
    ],
    intro: [
      "A Texas landlord cannot generally use loss of essential utilities as an informal eviction tool. Property Code Section 92.008 contains detailed rules governing residential utility interruptions, and the permitted exceptions are narrower than a general right to shut service off when there is a dispute.",
      "The correct remedy depends on who pays the utility and why service stopped. A landlord-caused interruption, a utility-company cutoff because the landlord failed to pay, and a bona fide repair are treated differently under Chapter 92.",
    ],
    sections: [
      { heading: "Utilities the tenant pays directly", paragraphs: ["Section 92.008 generally bars a landlord or the landlord's agent from interrupting utility service paid directly to the utility company by a tenant unless the interruption results from bona fide repairs, construction, or an emergency." ] },
      { heading: "Landlord-furnished utility service", paragraphs: ["The same section restricts interruption of landlord-furnished water, wastewater, gas, and electric service. The statute contains a detailed, limited process for certain submetered electric-service nonpayment situations, including notice and timing safeguards." ] },
      { heading: "Restoration after an unlawful shutoff", paragraphs: ["Section 92.0091 creates a justice-court procedure through which a residential tenant may seek restoration when the landlord has unlawfully interrupted utility service under Section 92.008." ] },
      { heading: "When the utility company cuts service because the landlord did not pay", paragraphs: ["Section 92.301 separately addresses situations in which a landlord is responsible for utility payments but fails to pay the utility company. The statute provides tenant notice and remedy provisions, which can include payment arrangements and lease-termination rights when its conditions are met." ] },
    ],
    faq: [
      { q: "Can a Texas landlord turn off utilities to make a tenant leave?", a: "Not as a general eviction method. Section 92.008 restricts residential utility interruptions and permits only specified circumstances and procedures." },
      { q: "What if the landlord illegally turns off my utilities?", a: "Section 92.0091 provides a justice-court restoration process, and Chapter 92 provides additional remedies depending on the violation." },
      { q: "What if the utility company shuts service off because the landlord failed to pay?", a: "Section 92.301 addresses that separate situation and provides tenant notice and remedy provisions when its requirements are met." },
    ],
    sources: [
      { label: "Texas Property Code § 92.008", url: "https://statutes.capitol.texas.gov/?artSec=92.008&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code § 92.0091", url: "https://statutes.capitol.texas.gov/?artSec=92.0091&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code § 92.301", url: "https://statutes.capitol.texas.gov/?artSec=92.301&chapter=PR.92&code=PR&tab=1" },
    ],
    related: [...related, { label: "Texas landlord lockout law", href: "/guides/texas-landlord-lockout-law" }, { label: "Texas eviction process", href: "/guides/texas-eviction-process-guide" }, { label: "Texas landlord repair law", href: "/guides/texas-landlord-repair-law" }],
  },

  "texas-tenant-property-left-behind-law": {
    slug: "texas-tenant-property-left-behind-law",
    title: "Texas Tenant Property Left Behind: Eviction, Death and Abandonment Rules",
    dek: "What Texas law says about a renter's belongings left at a dwelling, and why the answer differs after eviction, the death of a sole tenant, or an ordinary move-out or abandonment.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas does not have one universal residential rule that gives every landlord the same disposal deadline for all property a tenant leaves behind.",
      "After a court-ordered eviction, the writ-of-possession process under Property Code Chapter 24 and Texas Rule of Civil Procedure 510 governs removal of the tenant and personal property.",
      "When a sole tenant dies, Property Code Section 92.014 provides a specific process involving a designated contact person, access to the premises, removal of property, and the security deposit.",
      "For an ordinary move-out or alleged abandonment, the lease, any applicable landlord lien, the circumstances of possession, and other statutes can matter; landlords and tenants should not assume the eviction or deceased-tenant rules automatically apply.",
    ],
    intro: [
      "Questions about belongings left in a rental are highly fact-dependent in Texas. The law has specific procedures for property removed through eviction and for the property of a deceased sole tenant, but those procedures are not a universal disposal schedule for every abandoned apartment.",
      "A careful guide therefore starts by identifying why the tenant is no longer in possession: court-ordered eviction, death, a completed surrender, or a disputed abandonment can lead to different legal rules.",
    ],
    sections: [
      { heading: "Property removed through an eviction", paragraphs: ["A landlord must use the formal eviction process rather than simply treating an occupied dwelling as abandoned. After final judgment and the required waiting period, a writ of possession authorizes the officer executing the writ to remove the tenant and personal property according to the eviction rules." ] },
      { heading: "Property of a deceased sole tenant", paragraphs: ["Section 92.014 allows a landlord to request a tenant's designated emergency contact and authorization concerning access, removal of property, and the security deposit after the tenant's death. The statute contains detailed conditions and protections for that process." ] },
      { heading: "Ordinary move-out or claimed abandonment", paragraphs: ["There is not a single Chapter 92 deadline that safely answers every ordinary property-left-behind scenario. The lease, whether possession was actually surrendered, any applicable statutory or contractual lien rights, and the type of property can affect what happens next." ] },
      { heading: "Avoid self-help assumptions", paragraphs: ["A landlord should not use a property-left-behind theory as a shortcut around eviction when the tenant still has a right to possession. A tenant who has been denied access may also have remedies that depend on the circumstances, including procedures in Property Code Chapter 24A for retrieval of certain personal property." ] },
    ],
    faq: [
      { q: "Can a Texas landlord throw away everything after a fixed number of days?", a: "There is no single universal residential deadline that applies to every property-left-behind situation. Eviction, death, surrender, abandonment, lease terms, and other rights can change the analysis." },
      { q: "What happens to belongings after an eviction?", a: "The formal writ-of-possession process governs removal after an eviction judgment. A landlord should not substitute informal self-help for that court process." },
      { q: "Is there a special rule if the tenant dies?", a: "Yes. Property Code Section 92.014 contains a specific process for personal property and the security deposit of a deceased tenant." },
    ],
    sources: [
      { label: "Texas Property Code § 92.014", url: "https://statutes.capitol.texas.gov/?artSec=92.014&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code Chapter 24 — Forcible Entry and Detainer", url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.24.htm" },
      { label: "Texas Property Code Chapter 24A — Access to Personal Property", url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.24A.htm" },
      { label: "Texas State Law Library — Eviction Process", url: "https://sll.texas.gov/faqs/eviction-process/" },
    ],
    related: [...related, { label: "Texas eviction process", href: "/guides/texas-eviction-process-guide" }, { label: "Lease termination after tenant death", href: "/guides/texas-tenant-death-lease-termination-law" }, { label: "Texas security deposit law", href: "/guides/texas-security-deposit-law" }],
  },
};
