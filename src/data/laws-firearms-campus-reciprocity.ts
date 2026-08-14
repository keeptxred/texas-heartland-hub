import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const FIREARMS_CAMPUS_RECIPROCITY_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-campus-carry-law": {
    slug: "texas-campus-carry-law",
    title: "Texas Campus Carry Law: LTC Rules for Colleges and Universities",
    dek: "How Texas campus carry works for License to Carry holders, including concealed carry, institutional exclusion zones, effective notice and the continuing ban on open carry on campus.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas campus carry is an LTC-based framework; permitless carry does not replace the license requirement for carrying under Government Code Section 411.2031.",
      "Campus carry is concealed carry. DPS states that open carry on a college campus remains prohibited.",
      "Institutions of higher education may establish lawful rules designating certain portions of campus where concealed handguns are prohibited, subject to the governing statute.",
      "Effective notice under Penal Code Section 30.06 can be used for campus locations where concealed carry is lawfully prohibited.",
    ],
    intro: [
      "Texas campus carry is narrower than Texas carry law generally. It applies through the License to Carry system and authorizes concealed—not open—carry on covered higher-education campuses subject to statutory and institutional rules.",
      "Students, employees and visitors should check both state law and the institution's current campus-carry policy because exclusion zones can differ by campus and building.",
    ],
    sections: [
      { heading: "An LTC is still required for campus carry", paragraphs: ["DPS lists university campus carry as a continuing benefit of the Texas LTC after permitless carry. Government Code Section 411.2031 provides the campus-carry framework for qualified license holders."] },
      { heading: "Campus carry means concealed carry", paragraphs: ["DPS states that a qualified license holder may carry a concealed handgun on covered campuses where not lawfully excluded, while open carry on a college campus remains prohibited."] },
      { heading: "Institutions may create lawful exclusion zones", paragraphs: ["The campus-carry statute allows institutions to adopt rules concerning the carrying of concealed handguns on campus, including rules designating certain premises where concealed carry is prohibited, subject to statutory limits and procedures."] },
      { heading: "Notice still matters", paragraphs: ["When an institution lawfully prohibits concealed carry in a particular campus location, effective notice must comply with the applicable Texas Penal Code requirements, including Section 30.06 where used."] },
    ],
    faq: [
      { q: "Can I use permitless carry on a Texas college campus?", a: "Campus carry is an LTC-based framework. DPS states that a license is still required for university campus carry." },
      { q: "Can I open carry on a college campus?", a: "No. DPS states that open carry on a college campus remains prohibited." },
      { q: "Can a university prohibit concealed carry in some buildings?", a: "Yes, institutions may establish lawful rules and exclusion zones under the campus-carry statute, subject to the statute's limits and notice requirements." },
    ],
    sources: [
      { label: "Texas Government Code § 411.2031", url: "https://statutes.capitol.texas.gov/?artSec=411.2031&chapter=GV.411&code=GV&tab=1" },
      { label: "Texas Penal Code § 30.06", url: "https://statutes.capitol.texas.gov/?artSec=30.06&chapter=PE.30&code=PE&tab=1" },
      { label: "Texas Penal Code § 46.03", url: "https://statutes.capitol.texas.gov/?artSec=46.03&chapter=PE.46&code=PE&tab=1" },
      { label: "Texas DPS Carrying a Handgun FAQs", url: "https://www.dps.texas.gov/section/handgun-licensing/faq/laws-relate-carrying-handgun-faqs" },
    ],
    related: [
      { label: "Texas License to Carry", href: "/guides/texas-license-to-carry-guide" },
      { label: "Texas prohibited carry locations", href: "/guides/texas-firearm-prohibited-places-law" },
      { label: "Texas handgun signs", href: "/guides/texas-30-05-30-06-30-07-signs-guide" },
    ],
  },

  "texas-ltc-reciprocity-guide": {
    slug: "texas-ltc-reciprocity-guide",
    title: "Texas LTC Reciprocity: Carrying in Other States and Visiting Texas",
    dek: "How handgun-license reciprocity and recognition work for Texas LTC holders traveling out of state and for visitors carrying in Texas.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "A Texas LTC may be recognized in another state through a reciprocity agreement or that state's own recognition law, but recognition is not the same as a nationwide carry license.",
      "DPS says a reciprocal agreement does not automatically authorize every form of carry; the traveler must follow the destination state's laws and any limitations in the agreement.",
      "Visitors carrying in Texas under an out-of-state license or permit remain subject to Texas carry laws while in Texas.",
      "Reciprocity arrangements can change, so travelers should check the current DPS reciprocity information and the destination state's official law before traveling.",
    ],
    intro: [
      "Texas handgun-license reciprocity is a travel rule, not a federal passport for carrying everywhere. Each state controls carry within its borders, and agreements can contain limitations.",
      "The safest legal approach is to confirm both that the Texas license is recognized and that the planned carry method and location are lawful in the destination state.",
    ],
    sections: [
      { heading: "Recognition depends on the other state", paragraphs: ["DPS explains that a Texas LTC can be recognized through a reciprocity agreement or another state's law. A reciprocal agreement by itself does not guarantee that every Texas carry rule follows the license holder across state lines."] },
      { heading: "The destination state's law controls there", paragraphs: ["DPS instructs Texas license holders traveling under reciprocity to follow the other state's laws. That includes the destination state's rules on open or concealed carry, prohibited places, notice, vehicle carry and any other restrictions."] },
      { heading: "Visitors in Texas must follow Texas law", paragraphs: ["DPS applies the same principle in reverse: a person from another state carrying in Texas under recognized authority must comply with Texas law while here."] },
      { heading: "Check reciprocity again before each trip", paragraphs: ["Because state laws and recognition arrangements can change, a reciprocity page should be treated as current-travel information rather than a permanent list. DPS maintains current state-recognition information for Texas license holders."] },
    ],
    faq: [
      { q: "Does a Texas LTC work in every state?", a: "No. Recognition depends on reciprocity agreements and the other state's law." },
      { q: "If another state recognizes my Texas LTC, do Texas carry rules apply there?", a: "No. DPS says you must follow the destination state's laws while carrying there." },
      { q: "Can someone with an out-of-state permit carry in Texas?", a: "It depends on Texas recognition of that permit or license and the person's circumstances. If recognized, the visitor must still follow Texas law while in Texas." },
    ],
    sources: [
      { label: "Texas Government Code Chapter 411, Subchapter H", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=GV.411&code=GV&tab=1" },
      { label: "Texas DPS Reciprocity FAQs", url: "https://www.dps.texas.gov/section/handgun-licensing/faq/reciprocity-faqs" },
      { label: "Texas DPS LTC Benefits", url: "https://www.dps.texas.gov/section/handgun-licensing/ltc-benefits" },
    ],
    related: [
      { label: "Texas License to Carry", href: "/guides/texas-license-to-carry-guide" },
      { label: "Texas permitless carry", href: "/guides/texas-permitless-carry-law" },
      { label: "Texas prohibited carry locations", href: "/guides/texas-firearm-prohibited-places-law" },
    ],
  },
};
