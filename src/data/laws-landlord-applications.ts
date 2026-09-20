import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_APPLICATION_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-rental-application-fee-law": {
    slug: "texas-rental-application-fee-law",
    title: "Texas Rental Application Fees and Deposits: Screening Criteria and Refund Rules",
    dek: "Texas rental-application rules explained, including application fees, application deposits, tenant-selection criteria, rejection timing, and refund obligations.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas law distinguishes a nonrefundable application fee from a refundable application deposit.",
      "Section 92.3515 requires a landlord who wants the statutory protection to make tenant-selection criteria and denial grounds available when the application is provided.",
      "If required selection-criteria notice was not made available and the applicant is rejected, Section 92.3515 requires return of the application fee and any application deposit.",
      "Section 92.352 contains a seven-day deemed-rejection rule for certain completed applications or accepted application deposits.",
    ],
    intro: [
      "Texas Property Code Subchapter I regulates residential rental applications. It defines application fees and deposits differently and establishes rules for selection criteria, rejection, notice, refunds, and bad-faith retention.",
      "Applicants should keep copies of the application, selection criteria, payment receipt, and communications because the legal treatment can depend on whether a payment was a fee or a refundable deposit and what notice the landlord provided.",
    ],
    sections: [
      { heading: "Fee and deposit are not the same thing", paragraphs: ["Section 92.351 defines an application fee as a nonrefundable payment used to offset screening costs, while an application deposit is refundable if the applicant is rejected, subject to the subchapter." ] },
      { heading: "Selection criteria should be made available", paragraphs: ["Section 92.3515 addresses notice of tenant-selection criteria and grounds for denial, including criminal history, rental history, income, credit history, and incomplete or inaccurate information." ] },
      { heading: "Missing notice can trigger a refund", paragraphs: ["If the landlord rejects the applicant and did not make the required criteria notice available, Section 92.3515 requires return of the application fee and application deposit." ] },
      { heading: "The statute has a deemed-rejection rule", paragraphs: ["Section 92.352 generally treats an applicant as rejected if notice of acceptance is not given by the seventh day after the completed application is submitted, or after an application deposit is accepted when no application form is furnished." ] },
    ],
    faq: [
      { q: "Are Texas rental application fees refundable?", a: "An application fee is defined as nonrefundable, but Section 92.3515 can require its return when an applicant is rejected and the landlord failed to make required selection criteria available." },
      { q: "Is an application deposit different?", a: "Yes. Section 92.351 defines an application deposit separately as money that is refundable if the applicant is rejected, subject to the statutory rules." },
      { q: "How long can an application remain undecided?", a: "Section 92.352 contains a seven-day deemed-rejection rule in the circumstances described by that section." },
    ],
    sources: [
      { label: "Texas Property Code § 92.351", url: "https://statutes.capitol.texas.gov/?artSec=92.351&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code § 92.3515", url: "https://statutes.capitol.texas.gov/?artSec=92.3515&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code § 92.352", url: "https://statutes.capitol.texas.gov/?artSec=92.352&chapter=PR.92&code=PR&tab=1" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Texas security deposit law", href: "/guides/texas-security-deposit-law" },
      { label: "Texas landlord entry law", href: "/guides/texas-landlord-entry-privacy-law" },
    ],
  },
};
