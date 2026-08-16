type UpgradeableSection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  [key: string]: unknown;
};

type UpgradeableFaq = { q?: string; a?: string };
type UpgradeableSource = { label?: string; url?: string };

type UpgradeableArticleBody = {
  updated?: string;
  editorNote?: string;
  intro?: string[];
  sections?: UpgradeableSection[];
  faq?: UpgradeableFaq[];
  sources?: UpgradeableSource[];
  related?: string[];
  cta?: { label: string; href: string };
  keyTakeaways?: string[];
  [key: string]: unknown;
};

const HOMESTEAD_LEGACY_EDITOR_NOTE =
  "The homestead exemption removes a portion of your home's value from taxation.";

const HOMESTEAD_2026_BODY: UpgradeableArticleBody = {
  updated: "2026-08-16",
  editorNote:
    "Reviewed against current Texas Comptroller guidance and the Texas Tax Code for the 2026 tax year. Exemption eligibility and local-option relief can vary by property and taxing unit, so homeowners should confirm their account with the appraisal district that appraises the property.",
  keyTakeaways: [
    "For 2026, every qualifying Texas residence homestead receives a $140,000 exemption from school-district taxable value.",
    "A qualifying homeowner who is age 65 or older or disabled receives an additional $60,000 school-district residence-homestead exemption.",
    "A buyer who acquires a home after January 1 can qualify for the general residence-homestead exemption for the applicable portion of that tax year if the previous owner did not receive the same exemption for that year.",
    "The ordinary filing deadline is April 30, but Texas law permits a late general residence-homestead application in qualifying circumstances up to two years after the taxes become delinquent.",
    "The 10% residence-homestead appraisal limitation begins January 1 of the tax year after the owner first qualifies the property and does not prevent the appraisal district from adding the market value of qualifying new improvements.",
  ],
  intro: [
    "The Texas residence homestead exemption lowers the taxable value of a home that a qualifying owner uses as a principal residence. For the 2026 tax year, school districts must exempt $140,000 of appraised value. That means a qualifying home appraised at $400,000 is generally taxed by the school district as though its value were $260,000 before any other applicable exemptions, limitations, or adjustments. The exemption reduces taxable value; it does not promise the same dollar savings for every homeowner because tax rates and local exemptions differ by taxing unit.",
    "The most important practical rule is simple: the exemption is not something to assume has been applied just because the property is your home. Confirm the exemption on your appraisal-district account and file the current [Form 50-114](https://comptroller.texas.gov/forms/50-114.pdf) with the appraisal district if you qualify and it is missing. Texas also provides additional relief for qualifying homeowners age 65 or older, disabled homeowners, disabled veterans, and some surviving spouses.",
  ],
  sections: [
    {
      heading: "Who qualifies for the Texas residence homestead exemption?",
      paragraphs: [
        "The general residence-homestead exemption is tied to the person and the property. The Texas Comptroller explains that an individual must have an ownership interest in the home and use it as the individual's principal residence. The application also requires the owner to state that the owner does not claim a residence-homestead exemption on another property in Texas or elsewhere. A house can therefore be a residence without automatically being the owner's qualifying residence homestead for property-tax purposes.",
        "Ownership situations can be more complicated than a deed held by one person. The Comptroller provides separate guidance for heir property and other ownership arrangements, and appraisal districts may request documents needed to establish eligibility. If title, inheritance, a trust, divorce, or another ownership issue makes the application unclear, use the appraisal district's instructions rather than guessing from a neighbor's filing.",
      ],
    },
    {
      heading: "How much is the Texas homestead exemption in 2026?",
      paragraphs: [
        "Texas voters approved an increase in the state-mandated school-district residence-homestead exemption to $140,000, effective for the current rules reflected by the Comptroller and Texas Tax Code. This is an exemption from the home's appraised value for school-district taxation; it is not a $140,000 reduction in the home's market value and it is not a $140,000 tax credit.",
        "Other taxing units can provide additional relief. A taxing unit may adopt a local-option residence-homestead exemption of up to 20% of appraised value, with a statutory minimum exemption amount when that option is adopted. Texas also provides a $3,000 county exemption for the county purposes authorized by the Constitution for farm-to-market roads or flood control. Because local options differ, two homeowners with the same appraised value can have different taxable values depending on where the homes are located.",
        "For a broader explanation of how appraisal value, exemptions, tax rates, and taxing units fit together, use the [Texas Property Tax Guide](/texas/property-taxes-2026) and the [Texas property-tax laws explainer](/news/texas-property-tax-laws-explained).",
      ],
    },
    {
      heading: "What happens when you buy a Texas home after January 1?",
      paragraphs: [
        "Older Texas advice often says a buyer must wait until the next January 1 to receive a general homestead exemption. That is no longer a safe rule to follow. Current Comptroller guidance says that when a property owner acquires the property after January 1, the owner may receive the general residence-homestead exemption for the applicable portion of that same tax year immediately on qualification if the previous owner did not receive the same exemption for that tax year.",
        "The previous owner's exemption status matters, so a mid-year buyer should not assume either that the exemption automatically transfers or that no current-year relief is available. Check the account with the appraisal district and file the residence-homestead application after you qualify. The appraisal district can determine the applicable effective date and whether the preceding owner's exemption affects the current tax year.",
      ],
    },
    {
      heading: "Extra relief for homeowners age 65 or older or disabled",
      paragraphs: [
        "A qualifying homeowner who is age 65 or older or disabled receives an additional $60,000 school-district residence-homestead exemption under current Texas law. Combined with the $140,000 general school-district exemption, that can remove $200,000 of appraised value from school-district taxation for a homeowner who qualifies for the additional exemption.",
        "Texas law also provides school-tax limitations for qualifying age-65-or-older and disabled homeowners, commonly called tax ceilings or freezes. The detailed calculation can change when statutes adjust exemptions or tax-rate compression, and new improvements can affect the limitation. Homeowners should use the appraisal district and tax office records for the actual ceiling attached to their account rather than treating a prior year's tax bill as an absolute cap under every circumstance.",
        "The disabled-person exemption is different from the disabled-veteran exemptions. The Comptroller notes that disability under another program does not automatically establish eligibility for the disabled-person residence-homestead exemption; the statutory qualification generally tracks disability for federal Old-Age, Survivors and Disability Insurance purposes.",
      ],
    },
    {
      heading: "Disabled-veteran exemptions are a separate set of benefits",
      paragraphs: [
        "Texas provides a separate disabled-veteran exemption under Tax Code Section 11.22. The Comptroller's current schedule lists an exemption of up to $5,000 for a service-connected disability rating of 10% to 29%, $7,500 for 30% to 49%, $10,000 for 50% to 69%, and $12,000 for 70% to 100%. This exemption is not identical to the general disabled-person residence-homestead exemption, and its filing rules can differ.",
        "A much larger benefit applies to a qualifying veteran who receives 100% disability compensation because of a service-connected disability and has a 100% disability rating or a determination of individual unemployability from the U.S. Department of Veterans Affairs. Tax Code Section 11.131 provides an exemption from taxation of the total appraised value of that veteran's residence homestead. Certain surviving spouses can continue or transfer qualifying benefits subject to statutory conditions.",
        "Because multiple veteran provisions exist, use the Comptroller's disabled-veteran guidance and the appraisal district rather than applying one exemption's percentage, deadline, or eligibility rule to another exemption.",
      ],
    },
    {
      heading: "How the 10% homestead appraisal cap actually works",
      paragraphs: [
        "The familiar 10% rule limits the appraised value used for a qualifying residence homestead; it does not stop the appraisal district from estimating a higher market value. Under Tax Code Section 23.23, a homeowner who qualifies the homestead for exemptions in the preceding and current year generally receives a limitation that prevents the appraised value from increasing by more than 10% per year, subject to the statutory formula and the market value of qualifying new improvements.",
        "Timing is important. The Comptroller states that the limitation takes effect on January 1 of the tax year following the year in which the property owner first qualifies for the residence-homestead exemption. A new buyer should therefore not assume the 10% limitation protects the first qualifying year's appraisal. The limitation also does not erase the market value of qualifying new improvements added under the statute.",
        "An appraisal cap and an appraisal protest do different jobs. The cap limits the appraised value under the statutory formula after it applies; a protest challenges matters such as the appraisal district's value or other appealable actions. If the market value itself appears wrong, see the [Texas appraisal protest playbook](/news/appraisal-protest-playbook).",
      ],
    },
    {
      heading: "How to file Form 50-114",
      paragraphs: [
        "The Texas Comptroller publishes [Form 50-114, Application for Residence Homestead Exemption](https://comptroller.texas.gov/forms/50-114.pdf). The completed application goes to the appraisal district that appraises the property, not to the Comptroller. Many appraisal districts provide an online filing option, but the official state form remains the common reference for the information and documentation the district can require.",
        "For many applicants, Texas law requires a copy of a state-issued driver's license or identification certificate whose address corresponds to the residence-homestead address, subject to statutory exceptions and alternative documentation rules. Do not rely on a generic checklist when your circumstances fall into one of those exceptions; follow the current form instructions and the appraisal district's requirements.",
      ],
      bullets: [
        "Confirm the property is your principal residence and that you have an ownership interest.",
        "Check the appraisal-district account first so you know which exemptions are already recorded.",
        "Use the current Form 50-114 or the appraisal district's official online application.",
        "Provide the identification or alternative documentation required for your situation.",
        "Keep the appraisal district's confirmation or other proof of submission with your property-tax records.",
        "Review the next appraisal notice and tax statement to verify that the approved exemption appears correctly.",
      ],
    },
    {
      heading: "April 30 is the ordinary deadline, but late filing can still matter",
      paragraphs: [
        "April 30 is the ordinary application deadline for residence-homestead exemptions. Missing April 30 does not necessarily mean the homeowner has permanently lost the general exemption for that year. Texas law permits certain late residence-homestead applications, and the Comptroller's deadline guidance explains that the general residence-homestead exemption can generally be filed late up to two years after the taxes on the property become delinquent.",
        "That legal deadline is different from saying a homeowner has two years after April 30. The delinquency date is the relevant statutory anchor for the late-filing window. Other exemptions can have different late-filing periods—for example, some disabled-veteran provisions use a five-year period after delinquency—so the homeowner should identify the exact exemption before relying on a deadline.",
      ],
    },
    {
      heading: "Homestead exemption and appraisal protest are separate rights",
      paragraphs: [
        "Receiving a residence-homestead exemption does not mean the appraisal district's market value is correct, and filing an appraisal protest does not substitute for filing an exemption application. A homeowner can need both processes in the same year: the exemption determines qualifying tax relief, while the protest process can challenge the appraisal district's value or another appealable determination.",
        "The practical workflow is to verify exemptions as soon as the annual appraisal notice arrives, compare the district's market and appraised values, and then decide whether a timely protest is warranted. KTR's [county appraisal district explainer](/news/county-appraisal-districts-explained) covers who sets values, while the [appraisal protest playbook](/news/appraisal-protest-playbook) covers the protest process.",
      ],
    },
    {
      heading: "A 2026 homeowner checklist",
      bullets: [
        "Verify that the general residence-homestead exemption appears on the appraisal-district account.",
        "If you bought after January 1, ask whether you qualify for the applicable portion of the current tax year and whether the previous owner received the same exemption.",
        "If you are age 65 or older, disabled, a disabled veteran, or a qualifying surviving spouse, review the additional exemption that specifically matches your status.",
        "Check whether your city, county, school district, or special district offers a local-option homestead exemption in addition to the state-mandated school exemption.",
        "Confirm when the 10% appraisal limitation first applies; do not assume it applies in the first year you qualify the property.",
        "Read the appraisal notice even when the exemption is correct, because exemption status and appraised market value are separate issues.",
        "Keep copies of applications, approval notices, appraisal notices, protest records, and tax statements so future changes are easy to verify.",
      ],
    },
  ],
  faq: [
    {
      q: "How much is the Texas homestead exemption in 2026?",
      a: "A qualifying residence homestead receives a $140,000 exemption from school-district appraised value. Other taxing units may provide additional exemptions, so the total taxable-value reduction can vary by address.",
    },
    {
      q: "Can I claim a Texas homestead exemption if I bought the home after January 1?",
      a: "Potentially, yes. Current Texas guidance allows the general residence-homestead exemption for the applicable portion of the acquisition year immediately on qualification if the previous owner did not receive the same exemption for that tax year.",
    },
    {
      q: "What is the deadline to file a Texas homestead exemption?",
      a: "April 30 is the ordinary deadline. A qualifying late general residence-homestead application can generally be filed up to two years after the taxes on the property become delinquent, which is different from two years after April 30.",
    },
    {
      q: "Can I claim more than one residence homestead exemption?",
      a: "No. The general exemption requires the property to be the owner's principal residence, and the applicant must state that the applicant does not claim a residence-homestead exemption on another property in or outside Texas.",
    },
    {
      q: "When does the 10% Texas homestead appraisal cap start?",
      a: "The Comptroller states that the limitation takes effect January 1 of the tax year after the owner first qualifies the property for the residence-homestead exemption. The formula also accounts for qualifying new improvements.",
    },
    {
      q: "How much extra homestead exemption do Texans age 65 or older or disabled receive?",
      a: "Qualifying homeowners age 65 or older or disabled receive an additional $60,000 school-district residence-homestead exemption under current Texas law, in addition to the $140,000 general school-district exemption.",
    },
    {
      q: "Do 100% disabled veterans pay property tax on a Texas homestead?",
      a: "A qualifying Texas veteran who meets Tax Code Section 11.131's 100% disability compensation and rating or individual-unemployability requirements is entitled to an exemption of the total appraised value of the veteran's residence homestead.",
    },
    {
      q: "Does the homestead exemption stop my appraisal from increasing?",
      a: "No. The exemption reduces taxable value, while the separate residence-homestead appraisal limitation can restrict annual appraised-value increases after it takes effect. The appraisal district can still determine a higher market value and can add qualifying new improvements under the statutory formula.",
    },
  ],
  sources: [
    {
      label: "Texas Comptroller — Property Tax Exemptions",
      url: "https://comptroller.texas.gov/taxes/property-tax/exemptions/",
    },
    {
      label: "Texas Tax Code Chapter 11 — Residence Homestead Exemptions",
      url: "https://statutes.capitol.texas.gov/Docs/TX/htm/TX.11.htm",
    },
    {
      label: "Texas Comptroller — Property Tax Law Deadlines",
      url: "https://comptroller.texas.gov/taxes/property-tax/calendars/deadlines.php",
    },
    {
      label: "Texas Comptroller — Form 50-114, Application for Residence Homestead Exemption",
      url: "https://comptroller.texas.gov/forms/50-114.pdf",
    },
    {
      label: "Texas Comptroller — Valuing Property and the Residence Homestead Appraisal Limitation",
      url: "https://comptroller.texas.gov/taxes/property-tax/valuing-property.php",
    },
    {
      label: "Texas Comptroller — Disabled Veteran and Surviving Spouse Exemptions",
      url: "https://comptroller.texas.gov/taxes/property-tax/exemptions/disabledvet-faq.php",
    },
    {
      label: "Texas Comptroller — 100 Percent Disabled Veteran and Surviving Spouse FAQ",
      url: "https://comptroller.texas.gov/taxes/property-tax/exemptions/disabledvet-100-faq.php",
    },
  ],
  related: [
    "texas-property-tax-guide",
    "texas-property-tax-laws-explained",
    "appraisal-protest-playbook",
    "county-appraisal-districts-explained",
    "isd-tax-burdens",
  ],
  cta: { label: "Read the Texas Property Tax Guide", href: "/texas/property-taxes-2026" },
};

function isLegacyHomesteadExplainer(body: UpgradeableArticleBody): boolean {
  return Boolean(
    body.editorNote?.includes(HOMESTEAD_LEGACY_EDITOR_NOTE)
      && body.intro?.some((paragraph) => paragraph.includes("Texas's homestead exemption is one of the most valuable tax benefits")),
  );
}

/**
 * A small number of early static articles predate the current authority-content
 * pipeline and live inside one very large fixture file. Apply reviewed upgrades
 * here at the rendering boundary so a targeted correction does not require
 * rewriting that entire fixture or adding a second public URL.
 *
 * Fingerprints deliberately match only the known legacy copy. If the source
 * fixture is intentionally rewritten later, the upgrade stops matching rather
 * than silently replacing newer editorial work.
 */
export function applyStaticArticleBodyUpgrade<T extends UpgradeableArticleBody>(body: T): T {
  if (isLegacyHomesteadExplainer(body)) return HOMESTEAD_2026_BODY as T;
  return body;
}
