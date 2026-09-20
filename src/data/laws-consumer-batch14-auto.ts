import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const CONSUMER_BATCH14_AUTO_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-lemon-law-guide": {
    slug: "texas-lemon-law-guide",
    title: "Texas Lemon Law: Repair Attempts, Filing Deadline and Vehicle Relief",
    dek: "How the Texas Lemon Law administered by TxDMV works, including covered vehicles, repair-attempt tests, manufacturer notice, filing deadline, and possible repurchase, replacement, or repair relief.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Lemon Law relief is administered by TxDMV under Occupations Code Chapter 2301, Subchapter M for qualifying warranty defects and vehicles.",
      "TxDMV uses statutory presumptions including the four-times test, serious-safety-hazard test, and 30-day out-of-service test to evaluate whether a reasonable number of repair attempts occurred.",
      "The consumer must give the manufacturer written notice of the defect and at least one opportunity to cure before obtaining Lemon Law relief.",
      "A Lemon Law complaint generally must be filed within six months after the earliest of the express warranty's expiration, 24 months after purchase, or 24,000 miles after delivery, with special rules for some recreational vehicles.",
    ],
    intro: [
      "Texas Lemon Law is an administrative remedy for qualifying defective vehicles, not a label that automatically applies whenever a car needs repeated repairs. The defect, warranty, timing, repair history, and manufacturer notice all matter.",
      "TxDMV can order repair and, for qualifying new vehicles, repurchase or replacement. Used vehicles can sometimes receive warranty-performance assistance when the original manufacturer's warranty remains relevant, but the remedy is not identical to a new-vehicle repurchase case.",
    ],
    sections: [
      { heading: "The defect must be substantial and warranty-related", paragraphs: ["TxDMV explains that the vehicle generally must have a substantial manufacturing defect covered by the manufacturer's written warranty, timely reported to the dealer or manufacturer, and still unresolved after a reasonable opportunity to repair."] },
      { heading: "Texas uses three common repair-attempt presumptions", paragraphs: ["TxDMV describes a four-times test for the same defect, a two-attempt serious-safety-hazard test, and a 30-day out-of-service test, generally measured during the first 24 months or 24,000 miles, subject to the program's detailed rules and exceptions."] },
      { heading: "The manufacturer gets written notice and a final opportunity", paragraphs: ["Before relief, the owner must give the manufacturer written notice of the defect and at least one opportunity to cure. TxDMV recommends preserving repair orders, correspondence, and a defect log."] },
      { heading: "The filing deadline is unusually specific", paragraphs: ["TxDMV states that a complaint must be filed within six months after the earliest of three events: expiration of the express warranty term, 24 months after purchase, or 24,000 miles after delivery, except where special rules apply to towable recreational vehicles. Consumers should file promptly rather than wait for the outer edge of the deadline."] },
    ],
    faq: [
      { q: "How many repair attempts does Texas Lemon Law require?", a: "TxDMV uses several statutory presumptions, including four attempts for the same defect, two for a serious safety hazard, or 30 cumulative out-of-service days, subject to the program's detailed conditions." },
      { q: "Can a used car qualify?", a: "Some used vehicles can receive warranty-performance assistance if the manufacturer's original warranty still covers the problem or the defect began and was reported while that warranty applied, but new-vehicle refund or replacement rules are narrower." },
      { q: "How long do I have to file?", a: "TxDMV states that the complaint generally must be filed within six months after the earliest of warranty expiration, 24 months after purchase, or 24,000 miles after delivery, with specified exceptions." },
    ],
    sources: [
      { label: "Texas Occupations Code Chapter 2301", url: "https://statutes.capitol.texas.gov/Docs/OC/htm/OC.2301.htm" },
      { label: "Texas Department of Motor Vehicles — Lemon Law", url: "https://www.txdmv.gov/motorists/consumer-protection/lemon-law" },
      { label: "Texas Department of Motor Vehicles — Complaints", url: "https://www.txdmv.gov/complaints" },
    ],
    related: [
      { label: "Texas towing consumer rights", href: "/guides/texas-towing-consumer-rights-law" },
      { label: "Texas DTPA", href: "/guides/texas-deceptive-trade-practices-law" },
      { label: "Texas door-to-door cancellation", href: "/guides/texas-door-to-door-cancellation-law" },
    ],
  },

  "texas-towing-consumer-rights-law": {
    slug: "texas-towing-consumer-rights-law",
    title: "Texas Towing Rights: Private-Property Tows, Vehicle Access and the 14-Day Hearing",
    dek: "Texas consumer rights after a nonconsent or private-property tow, including drop fees, retrieving belongings, storage-facility access, required notices, and the deadline to request a tow hearing.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Occupations Code Chapter 2308 and TDLR rules regulate private-property and other nonconsent towing and vehicle-storage facilities.",
      "If a vehicle is not fully hooked up and ready to tow when the owner returns, TDLR says the owner can keep it without a charge; if fully hooked up but still on the parking lot, a statutory drop fee may apply.",
      "At a vehicle storage facility, qualifying owners or authorized users have rights to access the vehicle for ownership documents and to retrieve personal property without an access fee.",
      "A consumer who believes a nonconsent tow, storage, boot, or fee was improper generally must request a tow hearing in the appropriate justice court before the 14th day, excluding Saturdays, Sundays, and national holidays as described by TDLR guidance.",
    ],
    intro: [
      "A private-property tow can become expensive quickly, so Texas law gives vehicle owners specific rights before, during, and after a nonconsent tow. The most time-sensitive right is the tow-hearing deadline.",
      "Local ordinances can also regulate towing and fees. This guide explains the statewide baseline administered by the Texas Department of Licensing and Regulation.",
    ],
    sections: [
      { heading: "The owner's rights can begin before the truck leaves", paragraphs: ["TDLR explains that if the owner returns before the vehicle is fully hooked up and ready for towing, the vehicle must be released without a charge. If the vehicle is fully hooked up and ready but has not left the parking facility, the owner can recover it by paying the allowed drop fee."] },
      { heading: "Vehicle storage facilities must permit specified access", paragraphs: ["TDLR states that owners may access a stored vehicle to retrieve ownership documents or personal property without paying an access fee. Facilities also have release-hours and documentation obligations governed by statute and agency rules."] },
      { heading: "Consumers receive notice of the tow-hearing right", paragraphs: ["The towing or storage process includes notice explaining the right to a hearing, the court with jurisdiction, the filing information, and identifying details for the towing company, storage facility, and person or agency that authorized the tow."] },
      { heading: "The hearing request deadline is short", paragraphs: ["TDLR instructs consumers to file the tow-hearing request before the 14th day after the vehicle was placed in storage or booted, excluding Saturdays, Sundays, and national holidays under the agency's guidance. The hearing can address whether probable cause existed and whether charged fees were lawful."] },
    ],
    faq: [
      { q: "Can I get my car back if I arrive while it is being hooked up?", a: "TDLR says no charge is due if the vehicle is not yet fully hooked up and ready for towing. If it is fully hooked up but still on the parking lot, an allowed drop fee may be required." },
      { q: "Can I get personal belongings from a stored vehicle without paying the tow first?", a: "TDLR states that a vehicle storage facility must permit access to retrieve personal property without charging an access fee, subject to the facility's lawful procedures." },
      { q: "How long do I have to challenge a Texas nonconsent tow?", a: "TDLR guidance says the tow-hearing request generally must be filed before the 14th day, with Saturdays, Sundays, and national holidays excluded from that calculation." },
    ],
    sources: [
      { label: "Texas Occupations Code Chapter 2308", url: "https://statutes.capitol.texas.gov/Docs/OC/htm/OC.2308.htm" },
      { label: "Texas Department of Licensing and Regulation — Consumer Towing Information", url: "https://www.tdlr.texas.gov/towing/consumerinfo.htm" },
      { label: "Texas Department of Licensing and Regulation — Towing FAQs", url: "https://www.tdlr.texas.gov/towing/towingfaq.htm" },
    ],
    related: [
      { label: "Texas Lemon Law", href: "/guides/texas-lemon-law-guide" },
      { label: "Texas DTPA", href: "/guides/texas-deceptive-trade-practices-law" },
      { label: "Texas price gouging law", href: "/guides/texas-price-gouging-law" },
    ],
  },
};
