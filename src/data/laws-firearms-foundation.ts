import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const FIREARMS_FOUNDATION_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-permitless-carry-law": {
    slug: "texas-permitless-carry-law",
    title: "Texas Permitless Carry Law: What HB 1927 Allows and What It Does Not",
    dek: "A plain-English guide to Texas permitless handgun carry, eligibility, holster rules, prohibited places, private-property notice, and why an LTC still matters.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas's Firearm Carry Act of 2021 allows qualifying adults described by the statute to carry a handgun without first obtaining a License to Carry, but it does not eliminate eligibility restrictions or prohibited places.",
      "Texas DPS continues to describe the permitless-carry framework as applying to people age 21 or older who may legally possess a firearm.",
      "A handgun carried openly under Texas law generally must be in a holster; concealed carry does not require the handgun to be visible.",
      "Private-property notice, Penal Code Chapter 30, Penal Code Chapter 46, and federal law can still make carry unlawful in particular places or circumstances.",
    ],
    intro: [
      "Texas permitless carry is often summarized too broadly. HB 1927 removed the general requirement that every qualifying person obtain an LTC before carrying a handgun, but it did not create a right to carry everywhere or erase other firearm restrictions.",
      "A useful way to analyze a carry question is to separate four issues: whether the person may possess the firearm, whether the person qualifies for the carry method being used, whether the place is prohibited, and whether effective private-property notice has been given.",
    ],
    sections: [
      { heading: "What changed on September 1, 2021", paragraphs: ["House Bill 1927, the Firearm Carry Act of 2021, created a permitless-carry framework for qualifying people who may legally possess a firearm. DPS states that the law did not repeal the separate License to Carry program."] },
      { heading: "Permitless carry is not the same as LTC eligibility", paragraphs: ["DPS currently describes permitless carry under HB 1927 as a 21-and-older framework. Separately, DPS states that after a federal district-court ruling it no longer denies otherwise-qualified LTC applications solely because an applicant is age 18 to 20. Those are different legal questions and should not be collapsed into one age rule."] },
      { heading: "Location rules still apply", paragraphs: ["Penal Code Section 46.03 identifies places where weapons are prohibited, and Chapter 30 provides private-property notice rules. A person who can lawfully carry in many public settings may still be prohibited from carrying at a school, polling place, court, secured airport area, or another location covered by statute."] },
      { heading: "Why an LTC can still matter", paragraphs: ["DPS lists continuing LTC benefits involving university campus carry, reciprocity in other states, some airport protections, identification uses, and other statutory advantages. Permitless carry and licensed carry therefore overlap but are not identical."] },
    ],
    faq: [
      { q: "Did Texas eliminate the License to Carry program?", a: "No. DPS states that HB 1927 did not repeal the LTC program, and Texas continues to issue licenses under Government Code Chapter 411, Subchapter H." },
      { q: "Does permitless carry mean I can carry anywhere in Texas?", a: "No. Penal Code Chapter 46, private-property notice rules in Chapter 30, and other state and federal laws still restrict carry in particular places and circumstances." },
      { q: "Is permitless carry the same as having an LTC?", a: "No. An LTC carries additional legal benefits and is still required for some activities, including Texas campus carry under the applicable statutes." },
    ],
    sources: [
      { label: "Texas Penal Code Chapter 46", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=PE.46&code=PE&tab=1" },
      { label: "Texas DPS Firearm Carry Act", url: "https://www.dps.texas.gov/section/training-operations-tod/firearm-carry-act" },
      { label: "Texas Legislature HB 1927 (2021), enrolled", url: "https://capitol.texas.gov/tlodocs/87R/billtext/html/HB01927F.HTM" },
    ],
    related: [
      { label: "Texas License to Carry guide", href: "/guides/texas-license-to-carry-guide" },
      { label: "Texas prohibited carry locations", href: "/guides/texas-firearm-prohibited-places-law" },
      { label: "Texas handgun signs", href: "/guides/texas-30-05-30-06-30-07-signs-guide" },
    ],
  },

  "texas-license-to-carry-guide": {
    slug: "texas-license-to-carry-guide",
    title: "Texas License to Carry: Eligibility, Training and Benefits",
    dek: "How the Texas LTC works after permitless carry, including eligibility, training, age issues, campus carry, reciprocity and other continuing benefits.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas continues to operate the License to Carry program under Government Code Chapter 411, Subchapter H even though permitless carry became law in 2021.",
      "DPS requires an original applicant to satisfy statutory eligibility requirements, submit an application and fingerprints, complete required training, pass a written examination, and complete a handgun proficiency demonstration.",
      "DPS states that it no longer denies otherwise-qualified applications solely because an applicant is age 18 to 20 after the federal district-court ruling in Firearms Policy Coalition v. McCraw.",
      "An LTC can provide benefits that permitless carry does not, including campus carry where authorized, reciprocity or recognition in other states, and certain other statutory protections.",
    ],
    intro: [
      "Permitless carry did not make the Texas LTC obsolete. The license remains a separate legal status with its own eligibility requirements and benefits.",
      "Because license eligibility can turn on criminal history, pending charges, protective orders, federal firearm law and other individualized facts, applicants should use current DPS materials and the statute rather than relying on a simplified checklist alone.",
    ],
    sections: [
      { heading: "The LTC program remains in effect", paragraphs: ["Government Code Chapter 411, Subchapter H authorizes DPS to administer the handgun licensing program. DPS continues to process applications, conduct background checks, issue licenses, and certify instructors."] },
      { heading: "Original applicants have training and application requirements", paragraphs: ["DPS states that original applicants must apply, provide fingerprints and supporting materials, complete four to six hours of classroom instruction, pass a written examination, and pass the required proficiency demonstration."] },
      { heading: "The age issue is different from permitless carry", paragraphs: ["DPS's current eligibility FAQ states that a federal district court ruled the department may not apply the LTC age criterion to deny otherwise-qualified 18-to-20-year-olds solely because of age. DPS therefore accepts those applications under the court ruling. That does not rewrite every other Texas or federal age rule involving firearms."] },
      { heading: "Why people still obtain an LTC", paragraphs: ["DPS identifies continuing benefits such as concealed campus carry where legally permitted, reciprocity or recognition in other states, certain airport-related protections, and use of the license for specified identification and firearm-purchase purposes."] },
    ],
    faq: [
      { q: "Do I need an LTC to carry a handgun in Texas?", a: "Not in every circumstance. Texas has permitless carry for qualifying people, but an LTC remains required or advantageous in several settings and for several statutory benefits." },
      { q: "Can an otherwise-qualified 18-to-20-year-old apply for a Texas LTC?", a: "Yes. DPS states that it no longer denies otherwise-qualified applications solely because the applicant is 18 to 20 following a federal district-court ruling." },
      { q: "Is training still required for an LTC?", a: "Yes. DPS requires the applicable classroom instruction, examination, and proficiency demonstration for an original license application." },
    ],
    sources: [
      { label: "Texas Government Code Chapter 411, Subchapter H", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=GV.411&code=GV&tab=1" },
      { label: "Texas DPS Handgun Licensing Overview", url: "https://www.dps.texas.gov/section/handgun-licensing/overview" },
      { label: "Texas DPS Application FAQs", url: "https://www.dps.texas.gov/section/handgun-licensing/faq/application-faqs" },
      { label: "Texas DPS Eligibility FAQs", url: "https://www.dps.texas.gov/section/handgun-licensing/faq/eligibility-faqs" },
      { label: "Texas DPS LTC Benefits", url: "https://www.dps.texas.gov/section/handgun-licensing/ltc-benefits" },
    ],
    related: [
      { label: "Texas permitless carry", href: "/guides/texas-permitless-carry-law" },
      { label: "Texas campus carry", href: "/guides/texas-campus-carry-law" },
      { label: "Texas handgun reciprocity", href: "/guides/texas-ltc-reciprocity-guide" },
    ],
  },
};
