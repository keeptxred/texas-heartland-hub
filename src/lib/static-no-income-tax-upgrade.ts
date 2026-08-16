type Section = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  [key: string]: unknown;
};

type Faq = { q?: string; a?: string };
type Source = { label?: string; url?: string };

type ArticleBodyLike = {
  updated?: string;
  editorNote?: string;
  intro?: string[];
  sections?: Section[];
  faq?: Faq[];
  sources?: Source[];
  related?: string[];
  cta?: { label: string; href: string };
  keyTakeaways?: string[];
  [key: string]: unknown;
};

const TEXAS_NO_INCOME_TAX_2026: ArticleBodyLike = {
  updated: "2026-08-16",
  editorNote:
    "Reviewed against current Texas Comptroller revenue, sales-tax, franchise-tax, severance-tax and property-tax guidance, plus the Texas Secretary of State's 2019 Proposition 4 record. State and local revenue are separated because Texas does not levy a state property tax.",
  keyTakeaways: [
    "Texas does not impose an individual state income tax, and the Texas Constitution prohibits the Legislature from imposing one on the net incomes of natural persons without first changing the Constitution.",
    "Sales tax is the largest source of Texas state tax revenue; the Comptroller reported in July 2026 that it accounted for 58% of state tax collections.",
    "Texas has no state property tax. Cities, counties, school districts and special-purpose districts levy property taxes locally under state law.",
    "Texas businesses can still owe the franchise tax. For 2026 and 2027 reports, the no-tax-due threshold is $2.65 million, with rates of 0.375% for retail or wholesale entities and 0.75% for other taxable entities, subject to the franchise-tax rules.",
    "Oil and natural-gas production taxes contribute state revenue but are volatile; the standard rates are 4.6% of crude-oil market value and 7.5% of natural-gas market value unless a statutory exemption changes the rate.",
  ],
  intro: [
    "Texas does not tax an individual's wages or other net personal income at the state level. That does not mean Texas government operates without broad-based taxes. The state relies heavily on sales and use taxes, business franchise tax, motor-vehicle taxes, oil and natural-gas production taxes, insurance taxes, fees, federal revenue and other sources. Local governments rely heavily on property tax and may also collect local sales taxes and other revenue authorized by law.",
    "The distinction between state and local revenue matters. A common shorthand says Texas 'replaces income tax with property tax,' but Texas itself does not levy a state property tax. Local school districts, cities, counties and special-purpose districts set and collect property taxes. For taxpayers, the practical result is still a different mix of taxes than in a state with a broad individual income tax—but the government receiving each tax is not the same.",
  ],
  sections: [
    {
      heading: "Why Texas has no individual state income tax",
      paragraphs: [
        "Texas had long made adoption of an individual income tax difficult, but voters went further in 2019. Proposition 4 asked voters to amend the Texas Constitution to prohibit the imposition of an individual income tax, including a tax on an individual's share of partnership and unincorporated-association income. The proposition was placed on the ballot after the Legislature approved the proposed constitutional amendment by the required supermajority.",
        "Because the prohibition is constitutional, an ordinary tax bill is not enough to create a broad individual state income tax. The Legislature would first have to propose another constitutional amendment under Texas's amendment process, which requires approval by two-thirds of each legislative chamber, and Texas voters would then have to approve the amendment statewide. Only after the constitutional barrier were changed could implementing tax legislation operate within the new constitutional framework.",
        "That is a more precise description than saying an income tax is simply 'illegal forever.' The current Constitution blocks it, and changing that rule requires the constitutional-amendment process rather than a normal majority-vote statute.",
      ],
    },
    {
      heading: "What pays for Texas state government instead?",
      paragraphs: [
        "The Texas Comptroller's Monthly State Revenue Watch identifies sales tax, the franchise tax, motor-vehicle-related taxes and crude-oil and natural-gas production taxes among the state's largest tax-revenue sources. The state also receives federal funds, fees, land income, interest, lottery proceeds and other revenue, depending on which fund and budget measure is being examined.",
        "Sales tax is the dominant state tax source. In the Comptroller's July 1, 2026 report on June collections, the agency said sales tax accounted for 58% of all state tax collections. That is a cleaner current measure than mixing state taxes with local property taxes in one table and calling every percentage a share of the same revenue base.",
        "The Comptroller's 2026–27 Biennial Revenue Estimate also illustrates the structure of General Revenue-Related revenue: sales taxes were projected to provide more than half of that revenue, followed by motor-vehicle sales and rental taxes, oil production tax, franchise tax, insurance taxes, natural-gas production tax, other state taxes and non-tax revenue. Those forecast shares describe state General Revenue-Related funds, not total state-and-local government revenue.",
      ],
    },
    {
      heading: "Sales tax is the backbone of state tax collections",
      paragraphs: [
        "Texas's state sales and use tax rate is 6.25%. Local jurisdictions—including cities, counties, special-purpose districts and transit authorities—may impose local sales and use taxes totaling up to another 2%, producing a maximum combined rate of 8.25% where the full local amount applies.",
        "Sales tax reaches a broad base of taxable transactions, which helps explain why it produces so much state revenue. But it is not a tax on every dollar a household spends: Texas law exempts or treats differently many transactions, and taxable services are defined by statute. The rate alone therefore does not tell a household's complete tax burden.",
        "Sales-tax collections also move with consumer and business activity. The Comptroller publishes monthly collections and sector detail, so a current article should use the latest state data rather than a permanent-looking percentage that was calculated from an older year or a different revenue denominator.",
      ],
    },
    {
      heading: "Businesses can still owe Texas franchise tax",
      paragraphs: [
        "No individual state income tax does not mean businesses operate tax-free. Texas's franchise tax is the state's primary business tax. It is generally calculated under the franchise-tax framework using taxable margin rather than simply applying a personal-income-tax rate to net profit.",
        "For 2026 and 2027 reports, the Comptroller lists a $2.65 million no-tax-due threshold. The tax rate is 0.375% for qualifying retail or wholesale entities and 0.75% for other taxable entities. The EZ Computation rate is 0.331% for qualifying entities within the applicable revenue limit. The exact filing and calculation rules depend on the entity and report year, so these figures should not be presented as though every Texas business pays the same rate on gross revenue.",
        "This corrects an important stale detail in the older version of this explainer: the $2.47 million no-tax-due threshold applied to 2024 and 2025 reports. The Comptroller increased the threshold to $2.65 million for 2026 and 2027 reports.",
      ],
    },
    {
      heading: "Oil and natural-gas taxes matter, but they are volatile",
      paragraphs: [
        "Texas taxes crude-oil and natural-gas production. The standard crude-oil production tax is 4.6% of market value, while the standard natural-gas production tax is 7.5% of market value, subject to statutory exemptions and special rules. These taxes can produce large amounts of revenue when production and prices are strong.",
        "They are also much less stable than sales tax. The Comptroller describes severance taxes as the state's most volatile tax-revenue category. Portions of eligible severance-tax revenue are constitutionally transferred to the Economic Stabilization Fund and State Highway Fund, so oil and gas revenue affects both general revenue and dedicated state finances.",
        "That volatility is why it is misleading to treat oil and gas as a fixed percentage of what permanently 'replaces' an income tax. Their contribution changes materially with commodity prices, production, refunds, exemptions and constitutional transfers.",
      ],
    },
    {
      heading: "Property tax is local, not a Texas state tax",
      paragraphs: [
        "The Texas Comptroller states this directly: Texas has no state property tax. The Comptroller does not set local property-tax rates or collect local property taxes. Local taxing units—including school districts, counties, cities and special-purpose districts—set rates and collect property tax to fund local services under the framework established by the Texas Constitution and statutes.",
        "Property tax is nevertheless a major part of the overall Texas tax system. In the Comptroller's statewide 2022 comparison of state and local taxes, local property tax accounted for 47% of combined state-and-local tax revenue, state sales tax for 25.5%, local sales taxes for 7.2%, and other state taxes for 20.3%. Those figures are useful precisely because they use one clearly labeled combined tax denominator and a stated year.",
        "School districts are especially important in the property-tax system, but school finance also includes state funding. Recent legislatures have used state revenue for school-tax compression and larger homestead exemptions. For how appraisals, exemptions, local rates and tax bills interact, use the [Texas Property Tax Guide](/texas/property-taxes-2026) and [Texas property-tax laws explainer](/news/texas-property-tax-laws-explained).",
      ],
    },
    {
      heading: "Does 'no income tax' mean Texans pay less tax overall?",
      paragraphs: [
        "Not automatically. A state's tax mix and a household's total tax burden are different questions. A household can avoid state tax on wages while paying sales tax, property tax directly or through rent, fuel taxes, vehicle taxes, fees and federal taxes. The amount depends on income, spending, homeownership, location, business activity and the services being taxed.",
        "Comparisons between states are especially sensitive to method. Rankings can change depending on whether a study measures taxes as a share of personal income, taxes per resident, only state taxes, combined state-and-local taxes, business taxes, or a model household. KTR should therefore explain Texas's tax structure with official Texas data and avoid claiming that the absence of an income tax by itself proves the state has the lowest overall burden.",
        "The defensible conclusion is narrower: Texas chooses a tax mix that does not include an individual state income tax and instead depends heavily on consumption taxes at the state level and property taxes at the local level, with business, motor-vehicle, energy-production and other taxes contributing as well.",
      ],
    },
    {
      heading: "What the Texas tax mix means for different taxpayers",
      bullets: [
        "Workers do not have Texas individual state income tax withheld from wages.",
        "Consumers pay a 6.25% state sales tax on taxable transactions, plus applicable local sales tax up to the 8.25% combined maximum.",
        "Homeowners can face local school-district, city, county and special-district property taxes; Texas itself does not levy a state property tax.",
        "Renters do not receive a property-tax bill for the rented property, but property-tax costs can affect a landlord's operating costs and rent economics.",
        "Businesses may owe franchise tax and other taxes depending on entity type, activity, revenue, property, payroll and transactions.",
        "Oil and gas producers face production taxes whose collections can fluctuate sharply with market conditions.",
        "The tax mix does not determine every person's total burden in the same way; location and economic circumstances matter.",
      ],
    },
    {
      heading: "How to read Texas revenue numbers without mixing unlike data",
      paragraphs: [
        "Before comparing revenue shares, identify the denominator. 'State tax collections,' 'General Revenue-Related revenue,' 'all state funds,' and 'combined state-and-local taxes' are different measures. A percentage that is correct for one can be wrong when relabeled as another.",
        "For current state collections, use the Comptroller's Monthly State Revenue Watch. For state budgeting, use the Biennial Revenue Estimate and Certification Revenue Estimate. For historical tax-source changes, use Sources of Revenue. For property taxes, use the Comptroller's Property Tax Assistance data and remember that the tax is locally administered.",
        "That source discipline matters for search quality as well as accuracy: a reader asking what funds Texas government should be able to see which government level, tax base, year and official source supports each number.",
      ],
    },
  ],
  faq: [
    {
      q: "Does Texas have a state income tax in 2026?",
      a: "No. Texas does not impose an individual state income tax, and the Texas Constitution currently prohibits the Legislature from imposing a tax on the net incomes of natural persons.",
    },
    {
      q: "Could Texas ever create an individual income tax?",
      a: "Not through an ordinary tax bill under the current Constitution. The constitutional prohibition would first have to be changed through Texas's constitutional-amendment process, which requires a two-thirds vote in each legislative chamber to propose an amendment and statewide voter approval.",
    },
    {
      q: "What is Texas's biggest source of state tax revenue?",
      a: "Sales tax. The Texas Comptroller's July 2026 report said sales tax accounted for 58% of state tax collections.",
    },
    {
      q: "What is the Texas sales tax rate?",
      a: "The state rate is 6.25%. Local jurisdictions may add up to 2% in local sales and use taxes, producing a maximum combined rate of 8.25%.",
    },
    {
      q: "Does Texas have a state property tax?",
      a: "No. Property tax is levied locally by school districts, cities, counties and other authorized local taxing units. The Texas Comptroller does not set local property-tax rates or collect those taxes.",
    },
    {
      q: "Do Texas businesses pay an income tax?",
      a: "Texas does not impose an individual income tax, but taxable business entities can owe the franchise tax and other taxes. For 2026 and 2027 reports, the franchise-tax no-tax-due threshold is $2.65 million, with rates that depend on the entity's classification and computation method.",
    },
    {
      q: "How much are Texas oil and natural-gas production taxes?",
      a: "The standard crude-oil production tax is 4.6% of market value and the standard natural-gas production tax is 7.5% of market value, unless a statutory exemption or special rule changes the applicable rate.",
    },
    {
      q: "Does having no state income tax mean Texas has the lowest taxes?",
      a: "Not necessarily. Overall tax burden depends on the measure used and on each taxpayer's income, spending, property, location and business activity. The absence of an individual income tax describes the tax mix, not every household's total tax burden.",
    },
  ],
  sources: [
    {
      label: "Texas Secretary of State — 2019 Proposition 4 ballot language",
      url: "https://www.sos.state.tx.us/about/newsreleases/2019/072319.shtml",
    },
    {
      label: "Texas Comptroller — Monthly State Revenue Watch",
      url: "https://comptroller.texas.gov/transparency/revenue/watch/",
    },
    {
      label: "Texas Comptroller — June 2026 state sales-tax collections",
      url: "https://comptroller.texas.gov/about/media-center/news/20260701-state-sales-tax-revenue-totaled-42-billion-in-june-1782924668919",
    },
    {
      label: "Texas Comptroller — 2026–27 Biennial Revenue Estimate",
      url: "https://comptroller.texas.gov/transparency/reports/biennial-revenue-estimate/2026-27/",
    },
    {
      label: "Texas Comptroller — Franchise Tax rates and thresholds",
      url: "https://comptroller.texas.gov/taxes/franchise/",
    },
    {
      label: "Texas Comptroller — Local Sales and Use Tax FAQ",
      url: "https://comptroller.texas.gov/taxes/sales/faq/local.php",
    },
    {
      label: "Texas Comptroller — Property Tax Assistance",
      url: "https://comptroller.texas.gov/taxes/property-tax/",
    },
    {
      label: "Texas Comptroller — Crude Oil Production Tax",
      url: "https://comptroller.texas.gov/taxes/crude-oil/",
    },
    {
      label: "Texas Comptroller — Natural Gas Production Tax",
      url: "https://comptroller.texas.gov/taxes/natural-gas/",
    },
    {
      label: "Texas Comptroller — Property Tax Cuts as Large as Texas",
      url: "https://comptroller.texas.gov/economy/fiscal-notes/archive/2023/dec/proptax.php",
    },
  ],
  related: [
    "texas-property-tax-guide",
    "texas-property-tax-laws-explained",
    "homestead-exemption-explained",
    "isd-tax-burdens",
    "local-government-control",
  ],
  cta: { label: "Read the Texas Property Tax Guide", href: "/texas/property-taxes-2026" },
};

function isLegacyNoIncomeTaxExplainer(body: ArticleBodyLike): boolean {
  return Boolean(
    body.intro?.some((paragraph) => paragraph.includes("Texas is one of nine states without a personal income tax"))
      && body.sections?.some((section) => section.heading === "The Three Pillars of Texas Revenue")
      && body.sections?.some((section) => section.heading === "How Proposition 4 Locked the Door")
      && body.faq?.some((faq) => faq.q === "Could Texas ever add an income tax?"),
  );
}

export function applyNoIncomeTaxArticleUpgrade<T extends ArticleBodyLike>(body: T): T {
  return isLegacyNoIncomeTaxExplainer(body) ? (TEXAS_NO_INCOME_TAX_2026 as T) : body;
}
