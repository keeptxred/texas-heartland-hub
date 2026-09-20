import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const DRIVING_REGISTRATION_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-expired-registration-law": {
    slug: "texas-expired-registration-law",
    title: "Texas Expired Registration Law: Grace Period, Citations and Renewal",
    dek: "How Texas law treats expired vehicle registration, including the fifth-working-day rule, court dismissal provisions, and newer dealer plate procedures.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Transportation Code Section 502.407 addresses operation of a vehicle with expired registration and uses a fifth-working-day threshold after expiration.",
      "The statute contains a court-dismissal provision when the registration defect is corrected within the statutory time and the required fee is paid.",
      "Registration status, plate display, and title paperwork are related but separate requirements.",
      "Texas changed dealer temporary-tag procedures beginning July 1, 2025 under House Bill 718, replacing many paper temporary tags with metal-plate procedures.",
    ],
    intro: [
      "Vehicle registration is a routine Texas transportation requirement, but the legal rule is more specific than simply saying a sticker is expired. Transportation Code Section 502.407 identifies when operation with expired registration becomes an offense and includes a limited mechanism for dismissal after the defect is corrected.",
      "Texas also changed dealer plate procedures beginning July 1, 2025. Current TxDMV guidance should be used instead of older advice centered on the previous paper temporary-tag system.",
    ],
    sections: [
      { heading: "The fifth-working-day threshold", paragraphs: ["Section 502.407 addresses operation of a motor vehicle that was registered for the previous registration period when that registration has expired. The offense provision applies after the fifth working day after expiration, subject to the statute's terms." ] },
      { heading: "Correcting the defect can matter in court", paragraphs: ["Section 502.407 contains a dismissal provision when the registration is remedied within the time stated by statute and the required administrative fee is paid. A driver should verify the exact procedure with the court identified on the citation." ] },
      { heading: "Registration and plate display are separate", paragraphs: ["Chapter 502 addresses registration while Chapter 504 addresses license plates and display requirements. A vehicle can have more than one compliance issue at the same time, and correcting one does not automatically cure another." ] },
      { heading: "Dealer plate procedures changed in 2025", paragraphs: ["TxDMV implemented House Bill 718 beginning July 1, 2025. The change replaced many paper temporary tags with metal-plate procedures for dealer sales, so recent buyers should follow current TxDMV and dealer instructions." ] },
    ],
    faq: [
      { q: "Does Texas have a grace period after vehicle registration expires?", a: "Section 502.407 uses a fifth-working-day threshold in its offense provision. That is more precise than treating registration as indefinitely valid after expiration." },
      { q: "Can an expired-registration citation be dismissed after renewal?", a: "Section 502.407 contains a dismissal mechanism when the defect is remedied within the statutory time and the required fee is paid. The cited court controls the procedure." },
      { q: "Did Texas change temporary dealer tags?", a: "Yes. House Bill 718 changed dealer plate procedures beginning July 1, 2025 and replaced many paper temporary tags with metal-plate procedures." },
    ],
    sources: [
      { label: "Texas Transportation Code § 502.407", url: "https://statutes.capitol.texas.gov/?artSec=502.407&chapter=TN.502&code=TN&tab=1" },
      { label: "Texas Transportation Code § 502.472", url: "https://statutes.capitol.texas.gov/?artSec=502.472&chapter=TN.502&code=TN&tab=1" },
      { label: "TxDMV — HB 718 dealer plate changes", url: "https://www.txdmv.gov/dealers/HB718" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Texas front license plate law", href: "/guides/texas-front-license-plate-law" },
      { label: "Texas auto insurance requirements", href: "/guides/texas-auto-insurance-requirements" },
    ],
  },
};
