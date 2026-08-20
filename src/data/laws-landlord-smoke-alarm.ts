import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_SMOKE_ALARM_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-rental-smoke-alarm-law": {
    slug: "texas-rental-smoke-alarm-law",
    title: "Texas Rental Smoke Alarm Law: Installation, Inspection and Repair",
    dek: "Texas residential smoke-alarm rules explained, including landlord installation duties, move-in testing, tenant repair notices, batteries, and statutory remedies.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Property Code Subchapter F requires smoke alarms in covered residential dwellings and regulates installation, inspection, and repair duties.",
      "Section 92.258 requires the landlord to determine that the smoke alarm is in good working order at the beginning of the tenant's possession.",
      "During the lease, the landlord generally has a duty to inspect and repair after the tenant gives notice of a malfunction or requests inspection or repair, subject to rules for tenant-caused damage.",
      "A landlord is generally not required to provide replacement batteries for a battery-operated alarm after possession begins if the alarm was working at move-in.",
    ],
    intro: [
      "Texas residential smoke-alarm law is more detailed than a simple requirement to have a detector somewhere in the unit. Property Code Subchapter F addresses where alarms must be installed, how they are tested at move-in, and what happens when a tenant reports a malfunction.",
      "Tenants should report malfunctioning alarms promptly, and landlords should keep records of installation, testing, and repair because the statute includes specific duties and remedies.",
    ],
    sections: [
      { heading: "The alarm must be working at move-in", paragraphs: ["Section 92.258 requires the landlord to determine that the smoke alarm is in good working order at the beginning of the tenant's possession by using one of the testing methods described by the statute." ] },
      { heading: "Tenant notice triggers the ongoing repair duty", paragraphs: ["During the lease term or renewal, Section 92.258 generally requires inspection and repair after the tenant gives notice of a malfunction or requests inspection or repair, subject to rules when the tenant, household, or guests caused the damage." ] },
      { heading: "Battery responsibility changes after possession", paragraphs: ["If a battery-operated smoke alarm was in good working order when the tenant took possession, the landlord is generally not obligated under Section 92.258 to provide replacement batteries afterward." ] },
      { heading: "The statute creates remedies for noncompliance", paragraphs: ["Section 92.259 addresses landlord liability and tenant remedies when required installation, inspection, or repair is not completed after the notices and time periods described by the statute." ] },
    ],
    faq: [
      { q: "Must a Texas landlord test smoke alarms before move-in?", a: "Section 92.258 requires the landlord to determine that the alarm is in good working order at the beginning of the tenant's possession." },
      { q: "Who replaces smoke-alarm batteries during the lease?", a: "When a battery-operated alarm was working at move-in, Section 92.258 generally does not require the landlord to provide replacement batteries after possession begins." },
      { q: "What if the smoke alarm stops working?", a: "The tenant should notify the landlord. Section 92.258 generally creates an inspection and repair duty after notice or a repair request." },
    ],
    sources: [
      { label: "Texas Property Code § 92.255", url: "https://statutes.capitol.texas.gov/?artSec=92.255&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code § 92.258", url: "https://statutes.capitol.texas.gov/?artSec=92.258&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code § 92.259", url: "https://statutes.capitol.texas.gov/?artSec=92.259&chapter=PR.92&code=PR&tab=1" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Texas landlord repair law", href: "/guides/texas-landlord-repair-law" },
      { label: "Texas landlord entry law", href: "/guides/texas-landlord-entry-privacy-law" },
    ],
  },
};
