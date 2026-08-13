import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const DRIVING_INSURANCE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-auto-insurance-requirements": {
    slug: "texas-auto-insurance-requirements",
    title: "Texas Auto Insurance Requirements: Liability and Financial Responsibility",
    dek: "Texas financial-responsibility law explained, including the common minimum liability limits, proof of coverage, and what minimum liability does not cover.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas law requires motorists to establish financial responsibility for potential liability arising from vehicle use; liability insurance is the most common method.",
      "Texas Department of Insurance consumer guidance describes the standard minimum liability limits as 30/60/25.",
      "Minimum liability coverage is not the same thing as comprehensive or collision coverage for damage to the insured driver's own vehicle.",
      "A lapse, cancellation, vehicle change, or SR-22 requirement can create separate compliance issues that should be verified before driving.",
    ],
    intro: [
      "Texas Transportation Code Chapter 601 uses the term financial responsibility. Most motorists meet the requirement by maintaining an automobile liability policy that satisfies the statutory minimums.",
      "Texas Department of Insurance describes the familiar minimum as 30/60/25: $30,000 per injured person, up to $60,000 bodily injury per accident, and $25,000 property damage per accident. Those numbers are liability limits, not a description of every type of auto coverage.",
    ],
    sections: [
      { heading: "Financial responsibility is the legal requirement", paragraphs: ["Section 601.051 generally prohibits operating a motor vehicle unless financial responsibility is established as required by Chapter 601. Liability insurance is the ordinary method for most drivers." ] },
      { heading: "What the minimum limits mean", paragraphs: ["Texas Department of Insurance consumer guidance describes the standard minimum as $30,000 for injury to one person, up to $60,000 bodily injury per accident, and $25,000 property damage. Drivers may purchase higher limits." ] },
      { heading: "Minimum liability is not full coverage", bullets: ["Bodily-injury liability addresses covered liability for injury to others, subject to policy terms and limits.", "Property-damage liability addresses covered liability for damage to other property.", "Collision and comprehensive coverage address different risks involving the insured vehicle.", "Other optional coverages have separate rules and policy terms."] },
      { heading: "Proof and policy status matter", paragraphs: ["Chapter 601 also governs evidence of financial responsibility and consequences for noncompliance. Drivers who have experienced a lapse, cancellation, license action, or SR-22 requirement should verify current status with the insurer and, when applicable, DPS before driving." ] },
    ],
    faq: [
      { q: "What are the standard minimum Texas liability limits?", a: "Texas Department of Insurance describes them as 30/60/25: $30,000 per injured person, up to $60,000 bodily injury per accident, and $25,000 property damage per accident." },
      { q: "Does minimum liability pay for damage to my own car?", a: "Not simply because you have liability insurance. Collision and comprehensive coverage address different risks involving your own vehicle." },
      { q: "Is insurance the only possible method of financial responsibility?", a: "Chapter 601 recognizes specified alternatives, but they have legal requirements. Liability insurance is the most common method for ordinary motorists." },
    ],
    sources: [
      { label: "Texas Transportation Code Chapter 601", url: "https://statutes.capitol.texas.gov/Docs/TN/htm/TN.601.htm" },
      { label: "Texas Transportation Code § 601.051", url: "https://statutes.capitol.texas.gov/?artSec=601.051&chapter=TN.601&code=TN&tab=1" },
      { label: "Texas Department of Insurance — Auto insurance guide", url: "https://www.tdi.texas.gov/pubs/consumer/cb020.html" },
      { label: "Texas DPS — SR-22 information", url: "https://www.dps.texas.gov/section/driver-license/financial-responsibility-insurance-certificate-sr-22" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Texas registration law", href: "/guides/texas-expired-registration-law" },
      { label: "Texas DWI law guide", href: "/guides/texas-dwi-law-guide" },
    ],
  },
};
