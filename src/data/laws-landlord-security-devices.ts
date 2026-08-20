import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_SECURITY_DEVICE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-rental-security-device-law": {
    slug: "texas-rental-security-device-law",
    title: "Texas Rental Security Device Law: Locks, Rekeying and Tenant Requests",
    dek: "Texas residential lock and security-device requirements explained, including Property Code Sections 92.153, 92.156, tenant-requested devices, rekeying, and landlord duties.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Property Code Subchapter D requires specified security devices on Texas rental dwellings and places many installation duties on the landlord.",
      "Section 92.156 requires qualifying security devices to be rekeyed or changed at the landlord's expense within the statutory timing after tenant turnover.",
      "Tenants may request additional or changed security devices under Sections 92.157 and 92.158, with responsibility for cost depending on the request and circumstances.",
      "Special rekeying rights also interact with protections involving family violence and certain offenses.",
    ],
    intro: ["Texas Property Code Chapter 92 contains unusually specific residential security-device rules. The statute addresses required locks, door viewers, keyless bolting devices, sliding-door security, and rekeying.", "Because duties vary by device and circumstance, the current subchapter should be used rather than a generic statement that every lock request is handled the same way."],
    sections: [
      { heading: "Required security devices", paragraphs: ["Section 92.153 lists security devices that must be installed on qualifying exterior doors, sliding doors, windows, and other openings, subject to statutory exceptions and definitions."] },
      { heading: "Rekeying after turnover", paragraphs: ["Section 92.156 addresses when keyed security devices must be rekeyed or changed after a tenant takes possession and allocates the expense to the landlord in the circumstances described by the statute."] },
      { heading: "Tenant-requested changes", paragraphs: ["Sections 92.157 and 92.158 allow tenants to request certain installations, repairs, changes, or rekeying. Whether the landlord or tenant pays depends on the type of request and the facts."] },
      { heading: "Remedies and timing", paragraphs: ["Sections 92.164 through 92.166 describe remedies and procedures when required devices are not installed, repaired, changed, or rekeyed as required."] },
    ],
    faq: [
      { q: "Does a Texas landlord have to rekey a rental after tenant turnover?", a: "Section 92.156 requires rekeying or changing qualifying keyed security devices within the statutory timing and circumstances." },
      { q: "Can a tenant request additional security devices?", a: "Yes. Sections 92.157 and 92.158 provide rights to request specified devices or changes, with cost allocation depending on the request." },
      { q: "Are all rental doors treated the same?", a: "No. Subchapter D contains detailed definitions and separate requirements for different door, window, and security-device types." },
    ],
    sources: [
      { label: "Texas Property Code § 92.153", url: "https://statutes.capitol.texas.gov/?artSec=92.153&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code § 92.156", url: "https://statutes.capitol.texas.gov/?artSec=92.156&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code § 92.164", url: "https://statutes.capitol.texas.gov/?artSec=92.164&chapter=PR.92&code=PR&tab=1" },
    ],
    related: [{ label: "Texas Laws Explained", href: "/laws" }, { label: "Texas landlord lockout law", href: "/guides/texas-landlord-lockout-law" }, { label: "Texas rental smoke-alarm law", href: "/guides/texas-rental-smoke-alarm-law" }],
  },
};
