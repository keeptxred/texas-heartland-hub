import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const related = [{ label: "Texas Landlord & Tenant Laws", href: "/laws" }];

export const LANDLORD_BATCH5_ANIMALS_RENT_CONTROL_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-rental-pets-assistance-animals-law": {
    slug: "texas-rental-pets-assistance-animals-law",
    title: "Texas Rental Pet and Assistance Animal Laws: Pet Rules, ESAs and Fair Housing",
    dek: "How ordinary pet restrictions differ from disability-related assistance-animal accommodations in Texas housing, including HUD Fair Housing Act guidance and the Texas Fair Housing Act.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Ordinary pets are generally governed by the lease and the housing provider's pet rules, subject to other applicable law.",
      "An assistance animal is not treated as a pet under HUD's Fair Housing Act guidance when a qualifying disability-related reasonable accommodation is required.",
      "A person with a disability may request an exception to a no-pets rule or a pet fee/deposit rule when the Fair Housing Act accommodation requirements are satisfied.",
      "A housing provider may request reliable disability-related information when the disability and disability-related need are not apparent, but HUD recognizes limits and specific grounds on which an accommodation can be denied.",
    ],
    intro: [
      "Texas renters should distinguish an ordinary pet from an assistance animal used because of a disability. A lease can impose pet restrictions, but federal fair-housing law can require a reasonable accommodation to those restrictions in qualifying circumstances.",
      "HUD states that an assistance animal may perform tasks or provide disability-related emotional support and is not a pet. Texas also has a state fair-housing statute in Property Code Chapter 301, which prohibits specified housing discrimination.",
    ],
    sections: [
      { heading: "Ordinary pet rules start with the lease", paragraphs: ["For an ordinary pet, the lease may address whether pets are permitted, species or size restrictions, deposits, fees, pet rent, cleanup, damage, and other property rules. Those contract rules are different from disability-accommodation law." ] },
      { heading: "An assistance animal is not a pet", paragraphs: ["HUD defines an assistance animal as an animal that works, provides assistance, performs tasks, or provides disability-related emotional support. When Fair Housing Act requirements are met, the housing provider may need to make a reasonable accommodation to a pet restriction." ] },
      { heading: "Documentation can depend on what is apparent", paragraphs: ["HUD guidance allows a housing provider to request reliable disability-related information when the disability and the need for the animal are not apparent. The inquiry should focus on the information needed to evaluate the accommodation rather than treating the animal as an ordinary pet application." ] },
      { heading: "Accommodation is not unlimited", paragraphs: ["HUD identifies circumstances in which a housing provider may demonstrate that an accommodation would impose an undue financial and administrative burden, fundamentally alter operations, create a direct threat that cannot be reduced by another accommodation, or cause significant physical damage that cannot be reduced." ] },
    ],
    faq: [
      { q: "Is an emotional-support or assistance animal legally just a pet?", a: "No. HUD states that an assistance animal is not a pet when it meets the Fair Housing Act framework for a disability-related accommodation." },
      { q: "Can a no-pets apartment ever have to allow an assistance animal?", a: "Yes. A qualifying tenant may request a reasonable accommodation to a no-pets policy when the Fair Housing Act requirements are met." },
      { q: "Can a landlord always charge the normal pet deposit for an assistance animal?", a: "HUD lists waiver of a pet deposit or fee as an example of a reasonable accommodation involving an assistance animal. Liability for actual damage is a separate issue." },
    ],
    sources: [
      { label: "Texas Property Code Chapter 301 — Texas Fair Housing Act", url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.301.htm" },
      { label: "HUD — Assistance Animals", url: "https://www.hud.gov/helping-americans/assistance-animals" },
    ],
    related: [...related, { label: "Texas lease renewal law", href: "/guides/texas-lease-renewal-law" }, { label: "Texas landlord entry and privacy law", href: "/guides/texas-landlord-entry-privacy-law" }],
  },

  "texas-rent-control-law": {
    slug: "texas-rent-control-law",
    title: "Does Texas Have Rent Control? State Law and the Disaster Exception",
    dek: "Why ordinary municipal rent control is generally unavailable in Texas and the narrow disaster-related exception in Local Government Code Section 214.902.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas does not give municipalities ordinary open-ended authority to impose rent control on private residential property.",
      "Local Government Code Section 214.902 permits a municipality to establish rent control only when a housing emergency exists because of a disaster and the governor approves the ordinance.",
      "The statutory exception is tied to the disaster framework and is not the same as a permanent citywide rent-control program.",
      "The absence of ordinary rent control does not eliminate other restrictions on rent changes, including the existing lease, anti-retaliation rules, subsidized-housing requirements, and fair-housing law.",
    ],
    intro: [
      "Texas is often described as a state without rent control. The more precise legal answer is that Local Government Code Section 214.902 sharply limits municipal rent-control authority and creates a narrow exception for a housing emergency caused by a disaster when the governor approves the ordinance.",
      "That is different from saying every rent change is automatically lawful. A landlord still must comply with the existing lease and other applicable laws, and government-assisted housing can operate under separate program rules.",
    ],
    sections: [
      { heading: "The disaster exception is narrow", paragraphs: ["Section 214.902 authorizes municipal rent control when a housing emergency exists because of a disaster and the governor approves the ordinance. The authority is linked to the state-disaster period described by the statute." ] },
      { heading: "Ordinary local rent caps are different", paragraphs: ["Outside the statutory disaster framework, Section 214.902 does not provide ordinary municipal authority for a permanent local rent-control program. A proposal or introduced bill is not enough to change that rule unless it is enacted into law." ] },
      { heading: "A lease can still restrict mid-term rent changes", paragraphs: ["Rent-control law and contract law are separate. During a fixed lease term, the existing agreement governs rent unless a valid contractual or legal basis permits a change. A landlord may generally propose different rent for a new term, subject to other applicable laws." ] },
      { heading: "Other protections still matter", bullets: ["Property Code anti-retaliation protections can restrict a rent increase motivated by protected tenant activity.", "Fair-housing law prohibits specified discriminatory housing practices.", "Subsidized or program-based housing may have additional federal, state, or local requirements.", "A lease's renewal and notice provisions can affect when a new rent amount takes effect." ] },
    ],
    faq: [
      { q: "Can a Texas city create ordinary permanent rent control?", a: "Local Government Code Section 214.902 provides only a narrow disaster-related municipal rent-control authority requiring a housing emergency caused by a disaster and gubernatorial approval." },
      { q: "Can a landlord raise rent during a fixed lease whenever they want?", a: "Rent control is not the only issue. The existing lease remains the governing contract during its term unless a valid provision or other law permits a change." },
      { q: "Does the lack of ordinary rent control erase retaliation or discrimination protections?", a: "No. Anti-retaliation, fair-housing, lease, and program-specific rules can still apply." },
    ],
    sources: [
      { label: "Texas Local Government Code § 214.902", url: "https://statutes.capitol.texas.gov/Docs/LG/htm/LG.214.htm#214.902" },
      { label: "Texas Property Code § 92.331 — Retaliation", url: "https://statutes.capitol.texas.gov/?artSec=92.331&chapter=PR.92&code=PR&tab=1" },
    ],
    related: [...related, { label: "Texas rent increase law", href: "/guides/texas-rent-increase-law" }, { label: "Texas lease renewal law", href: "/guides/texas-lease-renewal-law" }],
  },
};
