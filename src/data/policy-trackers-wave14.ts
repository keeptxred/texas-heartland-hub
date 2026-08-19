import type { PolicyTracker } from "@/data/policy-trackers";

const reviewed = "2026-08-19";

export const POLICY_TRACKERS_WAVE14: PolicyTracker[] = [
  {
    slug: "consumer-data-privacy",
    shortTitle: "Consumer Data Privacy",
    title: "Texas Consumer Data Privacy Policy Tracker",
    description: "Track the Texas Data Privacy and Security Act, consumer data rights, controller and processor duties, sensitive-data rules, targeted-advertising opt-outs, Attorney General enforcement, and privacy legislation.",
    updated: reviewed,
    quickAnswer: "The Texas Data Privacy and Security Act, enacted through HB 4, took effect July 1, 2024 and created Business & Commerce Code Chapter 541. It gives covered Texas consumers rights to access, correct, delete, and obtain personal data and to opt out of certain targeted advertising, sales, and profiling, while imposing privacy and security duties on covered businesses.",
    currentStatus: "Chapter 541 is in force. The Texas Attorney General has exclusive authority to enforce the act, which does not create a private right of action. Coverage must account for statutory exemptions, the general small-business exemption, and the separate rule requiring a small business to obtain consent before selling sensitive personal data.",
    keyFacts: [
      "HB 4 created the Texas Data Privacy and Security Act and Business & Commerce Code Chapter 541; most provisions took effect July 1, 2024.",
      "Consumer rights include knowing whether personal data is processed, accessing and correcting data, deleting data, obtaining portable data, and opting out of targeted advertising, sale, or specified profiling.",
      "Covered controllers must limit collection to data reasonably necessary for disclosed purposes, maintain reasonable security practices, provide required privacy notices, and obtain consent before processing sensitive data.",
      "The Attorney General has exclusive enforcement authority, the act does not provide a private right of action, and statutory entity and data exemptions materially limit the law's scope.",
    ],
    context: [
      "KTR's editorial perspective favors strong individual privacy and clear limits on unnecessary collection, sale, and profiling of Texans' data while avoiding compliance burdens that do not materially improve privacy or security. The factual tracker keeps those policy judgments separate from the act's exact coverage and exemptions.",
      "This tracker is broader than child-online-safety laws: it follows general consumer personal data, targeted advertising, profiling, sensitive data, data security, and enforcement across covered businesses.",
    ],
    watchFor: [
      "Texas Attorney General enforcement actions and privacy guidance",
      "Legislation changing consumer rights, business coverage, exemptions, cure procedures, or penalties",
      "Universal opt-out mechanism implementation and industry compliance",
      "Federal privacy legislation or court decisions affecting Texas's state framework",
    ],
    sources: [
      { label: "Texas Legislature Online — HB 4 enrolled summary", url: "https://capitol.texas.gov/billlookup/BillSummary.aspx?Bill=HB4&LegSess=88R", primary: true },
      { label: "HB 4 enrolled text", url: "https://capitol.texas.gov/tlodocs/88R/billtext/html/HB00004F.htm", primary: true },
      { label: "Texas Attorney General — Texas Data Privacy and Security Act", url: "https://www.texasattorneygeneral.gov/es/node/259071", primary: true },
      { label: "Texas Business & Commerce Code", url: "https://statutes.capitol.texas.gov/?link=BC", primary: true },
    ],
    related: [
      { label: "Parental Rights tracker", href: "/policy/parental-rights", kind: "reference" },
      { label: "App Store Parental Controls tracker", href: "/policy/app-store-parental-controls", kind: "reference" },
      { label: "Texas laws", href: "/laws", kind: "law" },
      { label: "Texas bills", href: "/bills", kind: "bill" },
    ],
    keywords: ["Texas data privacy", "TDPSA", "HB 4", "consumer privacy", "personal data", "targeted advertising", "data sale", "Chapter 541"],
  },
  {
    slug: "online-age-verification",
    shortTitle: "Online Age Verification",
    title: "Texas Online Pornography Age Verification Policy Tracker",
    description: "Track Texas HB 1181 and Civil Practice and Remedies Code Chapter 129B, pornography-site age verification, privacy restrictions, Attorney General enforcement, litigation, and constitutional rulings.",
    updated: reviewed,
    quickAnswer: "Texas Civil Practice and Remedies Code Chapter 129B requires a commercial entity that knowingly and intentionally publishes or distributes an Internet website more than one-third of which is sexual material harmful to minors to use reasonable age-verification methods to verify that a user seeking access is at least 18. The U.S. Supreme Court upheld Texas's age-verification requirement against the First Amendment challenge in 2025.",
    currentStatus: "The age-verification requirement remains enforceable. The statute applies to the defined category of commercial sites meeting the more-than-one-third harmful-to-minors threshold; it is not a requirement that every Texas website verify every visitor's age. The law also restricts retention of identifying information obtained for age verification and authorizes Attorney General civil enforcement.",
    keyFacts: [
      "HB 1181 took effect September 1, 2023 and added Civil Practice and Remedies Code Chapter 129B.",
      "The statutory trigger applies when a commercial entity knowingly and intentionally publishes or distributes a website more than one-third of which is sexual material harmful to minors.",
      "Reasonable verification can use digital identification, government-issued identification through a commercial system, or a commercially reasonable method relying on public or private transactional data.",
      "The U.S. Supreme Court ruled in 2025 that the Texas age-verification requirement does not violate the First Amendment; Attorney General enforcement has continued afterward.",
    ],
    context: [
      "KTR's editorial position favors shielding minors from commercial pornography while requiring age-verification systems to minimize unnecessary collection and retention of identifying data. The factual tracker follows the statute's threshold, privacy limits, enforcement, and constitutional rulings.",
      "This law is narrower than Texas's app-store and broader child-online-safety statutes because Chapter 129B targets commercial websites meeting a defined harmful-to-minors content threshold.",
    ],
    watchFor: [
      "Texas Attorney General enforcement actions and settlements",
      "Federal or state litigation over age-verification methods or privacy implementation",
      "Legislation altering the content threshold, verification methods, penalties, or data-retention limits",
      "Technology changes affecting privacy-preserving age-assurance methods",
    ],
    sources: [
      { label: "Texas Legislature Online — HB 1181 enrolled summary", url: "https://capitol.texas.gov/billlookup/BillSummary.aspx?Bill=HB1181&LegSess=88R", primary: true },
      { label: "HB 1181 enrolled text", url: "https://capitol.texas.gov/tlodocs/88R/billtext/html/HB01181F.htm", primary: true },
      { label: "Texas Attorney General — Supreme Court defense of HB 1181", url: "https://www.texasattorneygeneral.gov/news/releases/attorney-general-ken-paxton-successfully-defends-texas-law-requiring-age-verification-pornography", primary: true },
      { label: "Texas Civil Practice and Remedies Code", url: "https://statutes.capitol.texas.gov/?link=CP", primary: true },
    ],
    related: [
      { label: "Parental Rights tracker", href: "/policy/parental-rights", kind: "reference" },
      { label: "Consumer Data Privacy tracker", href: "/policy/consumer-data-privacy", kind: "reference" },
      { label: "App Store Parental Controls tracker", href: "/policy/app-store-parental-controls", kind: "reference" },
      { label: "Texas laws", href: "/laws", kind: "law" },
    ],
    keywords: ["Texas age verification", "HB 1181", "porn age verification", "Chapter 129B", "online child safety", "Free Speech Coalition v Paxton", "pornography Texas"],
  },
  {
    slug: "app-store-parental-controls",
    shortTitle: "App Store Parental Controls",
    title: "Texas App Store Accountability and Parental Controls Policy Tracker",
    description: "Track the Texas App Store Accountability Act, age verification, parental approval for minors' app downloads and purchases, developer duties, privacy requirements, enforcement, and constitutional litigation.",
    updated: reviewed,
    quickAnswer: "Texas SB 2420 created the App Store Accountability Act in Business & Commerce Code Chapter 121, effective January 1, 2026. It requires covered app stores to use commercially reasonable methods to identify users' age categories and links minor accounts to parent or guardian accounts for approval of covered downloads and purchases. The law is currently enforceable while constitutional litigation continues.",
    currentStatus: "A federal district court initially entered preliminary injunctions against SB 2420, but the Fifth Circuit stayed those injunctions pending appeal on June 4, 2026. The U.S. Supreme Court declined emergency requests to undo that stay on July 6. The Fifth Circuit heard merits arguments on August 4, 2026; as of this review date, the underlying appeal remains pending, so the stay is not a final ruling that every challenged provision is constitutional.",
    keyFacts: [
      "SB 2420 was signed May 27, 2025 and took statutory effect January 1, 2026, adding Business & Commerce Code Chapter 121.",
      "The act requires covered app stores to use commercially reasonable age-identification methods and creates age categories for users.",
      "For a minor, the statutory framework links the account to a parent or guardian and requires parental approval for covered app downloads, purchases, and specified transactions.",
      "The Fifth Circuit's June 2026 stay allows enforcement while appeal proceeds; the U.S. Supreme Court's July emergency order left that stay in place without resolving the ultimate constitutional merits.",
    ],
    context: [
      "KTR's editorial position favors meaningful parental control over minors' app downloads while taking seriously privacy, speech, compliance, and data-security concerns created by age-verification mandates. The factual tracker separates those tradeoffs from the current procedural status of the litigation.",
      "This tracker is distinct from pornography age verification because SB 2420 applies at the app-store and developer layer and is not triggered by a pornography-content threshold.",
    ],
    watchFor: [
      "Fifth Circuit merits decision after the August 4, 2026 oral argument",
      "Any renewed U.S. Supreme Court review or emergency applications",
      "Attorney General enforcement and app-store compliance guidance",
      "Legislation or court rulings changing age verification, parental consent, developer duties, or privacy safeguards",
    ],
    sources: [
      { label: "Texas Legislature Online — SB 2420 history", url: "https://capitol.texas.gov/billlookup/History.aspx?Bill=SB2420&LegSess=89R", primary: true },
      { label: "SB 2420 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB02420F.htm", primary: true },
      { label: "Texas Legislative Reference Library — SB 2420 court orders", url: "https://lrl.texas.gov/CurrentIssues/clips/resultsLinkclip.cfm?clipID=451211&headline=U.S.+Supreme+Court+declines+request+to+block+Texas%E2%80%99+app+age+verification+law", primary: true },
      { label: "Fifth Circuit — Court calendars and oral arguments", url: "https://www.ca5.uscourts.gov/court-calendars", primary: true },
    ],
    related: [
      { label: "Parental Rights tracker", href: "/policy/parental-rights", kind: "reference" },
      { label: "Consumer Data Privacy tracker", href: "/policy/consumer-data-privacy", kind: "reference" },
      { label: "Online Age Verification tracker", href: "/policy/online-age-verification", kind: "reference" },
      { label: "Campus Free Speech tracker", href: "/policy/campus-free-speech", kind: "reference" },
    ],
    keywords: ["Texas app store law", "SB 2420", "App Store Accountability Act", "parental consent apps", "age verification apps", "Chapter 121", "Apple Google Texas"],
  },
];
