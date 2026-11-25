type OfficeRecord = { label: string; url: string; description: string };
type OfficeGuide = { distinction: string; examples: OfficeRecord[]; related: { label: string; href: string }[] };
const GUIDES: Record<string, OfficeGuide> = {
  "land-commissioner": {
    distinction: "The General Land Office manages assigned state land interests and programs; it is not the county's deed registrar, appraisal district or a universal land-use regulator. State mineral leases, land grants, veterans lending and HUD-funded disaster recovery produce different types of records. Identify the program and the specific tract or grant before drawing a conclusion about ownership or spending.",
    examples: [
      { label: "Current commissioner biography", url: "https://www.glo.texas.gov/about-glo/about-the-commissioner", description: "Verify the officeholder independently from election results. The November 19, 2026 agency announcement still identifies Dawn Buckingham as commissioner." },
      { label: "Search the official land grant and map collections", url: "https://www.glo.texas.gov/archives-and-heritage/search-our-collections", description: "Use historic grant and map records to investigate original surveys and grants. For a contemporary private title dispute, also obtain the chain of title and recorded instruments from the applicable county; an archival map alone is not a title opinion." },
      { label: "School Land Board and other GLO boards", url: "https://www.glo.texas.gov/open-government/boards-committees", description: "Identify which board made the decision, its agenda, meeting record and supporting documents. A lease-sale announcement is distinct from the executed lease, production and royalty receipts." },
      { label: "Texas Veterans Land Board loan programs", url: "https://www.glo.texas.gov/veterans/loans-veterans", description: "Check the relevant land, home or home-improvement loan eligibility and current terms. A state VLB loan is not automatically the same as a federal VA loan or a grant." },
      { label: "2024 disaster homeowner programs", url: "https://www.glo.texas.gov/disaster-recovery/apply", description: "Identify the disaster declaration, eligible geographic area, program rules and current funding status before applying. Federal allocations, state obligations and completed repairs are different milestones." },
      { label: "Official November leadership announcement", url: "https://www.glo.texas.gov/about-glo/press-releases/commissioner-buckingham-applauds-successful-save-texas-history-symposium", description: "Dated agency record for the incumbent, not a prediction of the next officeholder." },
    ],
    related: [{ label: "Texas water rights and groundwater", href: "/news/texas-water-rights-explained" }, { label: "Government data and public records", href: "/data" }],
  },
  "secretary-of-state": {
    distinction: "The secretary administers statewide election guidance and business filings but does not perform every local election function or decide a business's legal and tax obligations. For a specific election, identify the authority conducting it. For a business record, identify the legal entity and filing type. For a proposed administrative rule, identify the agency that has delegated rulemaking authority.",
    examples: [
      { label: "Secretary Robert S. Howden official biography", url: "https://www.sos.state.tx.us/about/sosbio.shtml", description: "The official biography identifies Howden as the 116th secretary, appointed in July 2026. This appointed office is distinct from the statewide elected executive offices." },
      { label: "Business Services and SOSPortal", url: "https://www.sos.state.tx.us/corp/index.shtml", description: "The agency announced its new business-filing system, SOSPortal, launched September 29, 2026. Use the current official entry point to choose the filing service rather than relying on older screenshots or assuming every transaction remains in SOSDirect." },
      { label: "Official election resources", url: "https://www.sos.state.tx.us/elections/", description: "Find statewide election guidance, laws and advisories. For a sample ballot, verify the county or other conducting authority and the election date." },
      { label: "Texas Register and administrative rules", url: "https://www.sos.state.tx.us/texreg/index.shtml", description: "Locate the proposed, adopted, withdrawn or emergency rule action. The publishing office does not itself enforce each agency's rule; verify the adopting agency and effective date." },
      { label: "Apostille and document authentication", url: "https://www.sos.state.tx.us/authinfo.shtml", description: "Check document type and official authentication requirements before submitting originals. An apostille does not establish the underlying document's factual accuracy." },
      { label: "Agency contact and complaint routing", url: "https://www.sos.state.tx.us/contact.shtml", description: "Select the relevant business, election, notary or other service channel; avoid sending sensitive identification or account information to third-party websites." },
    ],
    related: [{ label: "County election office directory", href: "/county-elections" }, { label: "Texas voter registration", href: "/register-to-vote" }, { label: "How to read a Texas bill", href: "/texas-government/reference/how-to-read-a-texas-bill" }],
  },
  "comptroller": {
    distinction: "Texas state taxes and local property taxes are separate systems. The Comptroller administers major state taxes and provides property-tax oversight resources, but does not set local property tax rates, appraise an individual home or collect a homeowner's local tax bill. The county appraisal district, appraisal review board, taxing unit and tax collector perform distinct local functions.",
    examples: [
      { label: "Official incumbent announcement", url: "https://comptroller.texas.gov/about/media-center/news/20260801-don-huffines-sworn-in-as-texas-comptroller-refuses-salary-calls-for-property-tax-relief-1785512488796", description: "Verify the August 1, 2026 swearing-in and distinguish appointment from the subsequent election and new term." },
      { label: "Biennial Revenue Estimate", url: "https://comptroller.texas.gov/transparency/reports/biennial-revenue-estimate/", description: "Read the pre-session forecast of revenue available for the budget period. It is an estimate based on assumptions, not the amount already collected." },
      { label: "Certification Revenue Estimate", url: "https://comptroller.texas.gov/transparency/reports/certification-revenue-estimate/", description: "Read the updated forecast after legislative changes and economic developments. Compare the same biennium and fund category, not a two-year estimate against one month's receipts." },
      { label: "Find your local appraisal district or tax office", url: "https://comptroller.texas.gov/taxes/property-tax/county-directory/", description: "Use the correct local office for an individual appraisal, exemption, protest or tax payment question. Statewide reporting is not a substitute for the actual parcel record." },
      { label: "Property tax rates and levies", url: "https://comptroller.texas.gov/taxes/property-tax/rates/", description: "Compare reported adopted rates and levies by year and taxing unit. Check missing-data indicators and pending tax-rate elections before making a county-to-county comparison." },
      { label: "Webfile account and tax filing guidance", url: "https://comptroller.texas.gov/taxes/file-pay/getting-started.php", description: "Follow current official instructions for state tax account access, filing and payments. Confirm the specific tax and due date instead of applying a single deadline to every taxpayer." },
    ],
    related: [{ label: "School district tax rates and estimator", href: "/news/isd-tax-burdens" }, { label: "Texas government data", href: "/data" }, { label: "How to read Texas fiscal notes", href: "/texas-government/reference/texas-bill-fiscal-notes" }],
  },
};
export function getStatewideOfficeRecords(slug: string): OfficeGuide | undefined { return GUIDES[slug]; }
