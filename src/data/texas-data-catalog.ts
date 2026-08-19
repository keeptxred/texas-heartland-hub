export type TexasDataSource = {
  label: string;
  url: string;
  publisher: string;
  scope: string;
};

export type TexasDataSet = {
  slug: string;
  title: string;
  dek: string;
  updated: string;
  quickAnswer: string;
  whatAvailable: string[];
  methodology: string[];
  useCases: string[];
  sources: TexasDataSource[];
  related: { label: string; href: string }[];
};

const updated = "2026-08-19";

export const TEXAS_DATA_SETS: TexasDataSet[] = [
  {
    slug: "property-tax",
    title: "Texas Property Tax Data",
    dek: "Official Texas property-tax datasets and records for local tax rates, appraisal values, levies, exemptions, taxing units, and statewide property-tax analysis.",
    updated,
    quickAnswer: "There is no single statewide property-tax bill database because Texas property taxes are locally administered. The Comptroller is the best statewide starting point for property-tax reports and data, while appraisal districts and taxing units remain the controlling sources for individual local records.",
    whatAvailable: ["Statewide and local property-tax reports", "Taxing-unit and appraisal-district information", "Tax-rate and levy data where published", "Property-value and exemption statistics", "Truth-in-taxation and local transparency resources"],
    methodology: ["Use Comptroller data for statewide comparisons and trends, but use the responsible appraisal district or taxing unit for parcel-specific or locally controlling information.", "Do not compare nominal tax rates without accounting for taxable value, exemptions, debt service, and the set of overlapping taxing units.", "When KTR publishes a county or statewide trend, record the data year, whether the measure is market value or taxable value, and whether dollars are nominal or adjusted."],
    useCases: ["Compare property-tax burdens and tax-rate changes", "Track whether legislative relief changes local bills", "Analyze appraisal growth versus rate changes", "Support KTR property-tax explainers and calculators with primary-source context"],
    sources: [
      { label: "Property Tax Assistance", url: "https://comptroller.texas.gov/taxes/property-tax/", publisher: "Texas Comptroller", scope: "Statewide property-tax administration, reports, guidance, and data resources" },
      { label: "Truth-in-Taxation", url: "https://comptroller.texas.gov/taxes/property-tax/truth-in-taxation/", publisher: "Texas Comptroller", scope: "Local tax-rate transparency framework and resources" },
    ],
    related: [{ label: "Property Tax Policy Tracker", href: "/policy/property-taxes" }, { label: "Property Tax Law", href: "/laws/topic/property-tax-law" }, { label: "The Texas Case for Eliminating Property Taxes", href: "/texas-case/eliminate-property-taxes" }],
  },
  {
    slug: "state-budget-spending",
    title: "Texas State Budget and Spending Data",
    dek: "Official sources for Texas appropriations, agency budgets, revenue estimates, state spending, performance measures, and fiscal transparency.",
    updated,
    quickAnswer: "The Legislative Budget Board and Texas Comptroller are the two essential statewide sources. LBB explains appropriations and agency performance; the Comptroller publishes revenue, expenditure, contract, and transparency data.",
    whatAvailable: ["General Appropriations Act and budget summaries", "Agency Legislative Appropriations Requests", "Biennial Revenue Estimates and revenue updates", "State expenditure and transparency data", "Agency performance measures and fiscal notes"],
    methodology: ["Separate appropriated authority from actual expenditures. A budget authorization is not the same as cash already spent.", "Separate state general revenue from federal funds, dedicated accounts, constitutional funds, and other methods of finance.", "For trend stories, identify one-time versus recurring spending and whether comparisons cover the same biennial period."],
    useCases: ["Track growth in state government by agency and function", "Verify claims about budget increases or cuts", "Connect spending decisions to bills and lawmakers", "Build Texas Money Watch and future contract/accountability products"],
    sources: [
      { label: "Legislative Budget Board", url: "https://www.lbb.texas.gov/", publisher: "Texas Legislative Budget Board", scope: "Budget, appropriations, fiscal notes, performance, and agency requests" },
      { label: "Texas Transparency", url: "https://comptroller.texas.gov/transparency/", publisher: "Texas Comptroller", scope: "State finances, expenditures, revenue, contracts, and transparency records" },
    ],
    related: [{ label: "State Budget Policy Tracker", href: "/policy/state-budget" }, { label: "The Texas Case for Spending Restraint", href: "/texas-case/spending-restraint" }, { label: "Texas Legislature", href: "/texas-legislature" }],
  },
  {
    slug: "elections-results",
    title: "Texas Election Results and Voter Data",
    dek: "Primary sources for Texas election results, voter registration totals, turnout, candidate filings, historical returns, and county election administration.",
    updated,
    quickAnswer: "The Texas Secretary of State is the statewide authority for election results and voter-registration statistics. County election offices are essential for local returns and election-administration detail. Polls and modeled party affiliation are not official voter records.",
    whatAvailable: ["Statewide and district election results", "Historical election returns", "Voter-registration statistics", "Election calendars and official candidate information", "County election records and canvass materials"],
    methodology: ["Distinguish election-night unofficial returns from canvassed and certified results.", "Texas does not register voters by political party, so modeled party affiliation must never be labeled as official registration data.", "For turnout comparisons, use consistent denominators: registered voters, voting-age population, or citizen voting-age population are different measures."],
    useCases: ["Build permanent election archives after each cycle", "Analyze Republican and Democratic margins over time", "Track turnout and registration changes by geography", "Connect district pages to certified election history"],
    sources: [
      { label: "Texas Elections", url: "https://www.sos.state.tx.us/elections/", publisher: "Texas Secretary of State", scope: "State election administration, results, registration, dates, and official guidance" },
      { label: "VoteTexas.gov", url: "https://www.votetexas.gov/", publisher: "Texas Secretary of State", scope: "Voter-facing registration and voting information" },
    ],
    related: [{ label: "Election Central", href: "/elections/2026" }, { label: "Election Policy Tracker", href: "/policy/elections" }, { label: "Texas Political Reference", href: "/texas-political-reference" }],
  },
  {
    slug: "population-demographics",
    title: "Texas Population and Demographic Data",
    dek: "Authoritative sources for Texas population growth, age, race and ethnicity, migration, households, geography, and demographic projections.",
    updated,
    quickAnswer: "The U.S. Census Bureau provides the core federal population datasets, while the Texas Demographic Center publishes Texas-focused estimates, projections, and analysis. Demographic change is not the same thing as political preference and should not be treated as a party forecast by itself.",
    whatAvailable: ["Decennial Census counts", "American Community Survey estimates", "Population estimates and projections", "Migration and household characteristics", "County, city, district, and tract-level geography"],
    methodology: ["Separate Census counts from survey estimates and projections. Each has different uncertainty and use cases.", "Avoid inferring voting behavior directly from race, ethnicity, birthplace, age, or migration status.", "When comparing suburban or county growth, hold geography constant and state whether figures are estimates or final counts."],
    useCases: ["Analyze growth in North Texas and suburban counties", "Explain district population changes and redistricting pressure", "Study rural-versus-urban population trends", "Add demographic context to election results without pretending demographics determine votes"],
    sources: [
      { label: "Census Data", url: "https://data.census.gov/", publisher: "U.S. Census Bureau", scope: "Decennial Census, ACS, population, housing, and demographic tables" },
      { label: "Texas Demographic Center", url: "https://demographics.texas.gov/", publisher: "Texas Demographic Center", scope: "Texas population estimates, projections, maps, and demographic analysis" },
    ],
    related: [{ label: "Texas Political Reference", href: "/texas-political-reference" }, { label: "Election Central", href: "/elections/2026" }, { label: "Texas Economy", href: "/texas-economy" }],
  },
  {
    slug: "energy-grid",
    title: "Texas Energy and ERCOT Data",
    dek: "Official data sources for ERCOT demand and generation, grid reliability, electricity markets, oil and gas production, wells, pipelines, and Texas energy trends.",
    updated,
    quickAnswer: "ERCOT is the core source for real-time and historical data about the grid it operates. The Public Utility Commission supplies regulatory records, the Railroad Commission publishes oil-and-gas data, and federal EIA datasets are useful for consistent interstate comparisons.",
    whatAvailable: ["ERCOT load, generation, reserves, and market data", "Grid reliability and seasonal assessments", "Oil and gas production and well records", "PUC dockets and market rules", "Federal energy production and price series"],
    methodology: ["Do not equate installed capacity with dependable output during a specific grid event.", "Separate real-time operating conditions from long-term planning forecasts.", "For generation-mix stories, state the time interval and whether the measure is capacity, energy generated, or peak contribution."],
    useCases: ["Track grid reliability and demand records", "Compare dispatchable and intermittent generation performance", "Follow oil-and-gas production and regulation", "Evaluate whether policy changes affect reliability or consumer cost"],
    sources: [
      { label: "ERCOT", url: "https://www.ercot.com/", publisher: "Electric Reliability Council of Texas", scope: "Grid operations, market information, reliability, demand, and generation data" },
      { label: "Railroad Commission Data", url: "https://www.rrc.texas.gov/resource-center/research/data-sets-available-for-download/", publisher: "Railroad Commission of Texas", scope: "Oil, gas, wells, pipelines, and downloadable regulatory datasets" },
      { label: "Texas PUC", url: "https://www.puc.texas.gov/", publisher: "Public Utility Commission of Texas", scope: "Electric-market regulation, dockets, rules, and oversight" },
    ],
    related: [{ label: "Energy & ERCOT Policy Tracker", href: "/policy/energy-ercot" }, { label: "Texas Energy", href: "/texas-energy" }, { label: "The Texas Case for Reliable, Affordable Energy", href: "/texas-case/reliable-affordable-energy" }],
  },
  {
    slug: "water",
    title: "Texas Water, Reservoir, and Drought Data",
    dek: "Official Texas data for reservoirs, groundwater, water supply, drought, regional planning, flood information, and long-term state water needs.",
    updated,
    quickAnswer: "The Texas Water Development Board is the central statewide source for water planning, reservoir, groundwater, and infrastructure data. TCEQ, river authorities, groundwater districts, and federal agencies add regulatory and local operational records.",
    whatAvailable: ["Reservoir storage and water-supply data", "Groundwater and aquifer information", "Regional and State Water Plan datasets", "Flood and infrastructure information", "Population and water-demand projections used in planning"],
    methodology: ["Reservoir storage is a changing operational measure, not a long-term water-supply forecast by itself.", "Groundwater conditions can be local to an aquifer or management area and should not be generalized statewide.", "State Water Plan projections depend on planning assumptions and scenarios; label forecasts as forecasts."],
    useCases: ["Track drought and reservoir conditions", "Follow major water-infrastructure projects", "Compare projected supply and demand by region", "Connect water policy to growth, agriculture, property rights, and state spending"],
    sources: [
      { label: "Texas Water Development Board", url: "https://www.twdb.texas.gov/", publisher: "Texas Water Development Board", scope: "State water planning, reservoir, groundwater, flood, and infrastructure data" },
      { label: "Water Data for Texas", url: "https://waterdatafortexas.org/", publisher: "Texas Water Development Board", scope: "Reservoir, drought, groundwater, coastal, and water-condition data" },
    ],
    related: [{ label: "Water Policy Tracker", href: "/policy/water" }, { label: "Texas Legislature", href: "/texas-legislature" }, { label: "Texas Government", href: "/texas-government" }],
  },
  {
    slug: "crime-public-safety",
    title: "Texas Crime and Public Safety Data",
    dek: "Official sources for Texas crime statistics, arrests, reported offenses, law-enforcement data, corrections, courts, and criminal-justice trends.",
    updated,
    quickAnswer: "Texas DPS publishes statewide crime data collected from participating law-enforcement agencies. Court, jail, prison, and recidivism questions require separate Judicial Branch, county, TDCJ, or other datasets. One source does not describe the entire criminal-justice system.",
    whatAvailable: ["Reported offenses and crime trends", "Arrest and law-enforcement statistics", "NIBRS/UCR reporting where available", "Court caseload and disposition statistics", "Prison and corrections information"],
    methodology: ["Reported crime is not identical to victimization because not every offense is reported to police.", "Changes in reporting systems, agency participation, definitions, or data completeness can affect year-to-year comparisons.", "Separate arrests, charges, convictions, incarceration, and recidivism; they measure different stages of the justice system."],
    useCases: ["Evaluate claims about crime trends in Texas cities", "Compare public-safety outcomes across time and geography", "Track repeat-offender and bail-policy debates", "Connect crime reporting to statutes, courts, prosecutors, and legislative reforms"],
    sources: [
      { label: "Texas Crime Reports", url: "https://www.dps.texas.gov/section/crime-records/crime-texas", publisher: "Texas Department of Public Safety", scope: "Statewide crime reporting and annual statistical publications" },
      { label: "Texas Judicial Branch Statistics", url: "https://www.txcourts.gov/statistics/", publisher: "Texas Judicial Branch", scope: "Court activity, caseload, and judicial statistics" },
      { label: "Texas Department of Criminal Justice", url: "https://www.tdcj.texas.gov/", publisher: "TDCJ", scope: "Corrections, incarceration, and agency publications" },
    ],
    related: [{ label: "Criminal Justice Policy Tracker", href: "/policy/criminal-justice" }, { label: "Texas Law Enforcement", href: "/texas-law-enforcement" }, { label: "The Texas Case for Law, Order, and Consequences", href: "/texas-case/law-order-public-safety" }],
  },
];

export function getTexasDataSet(slug: string): TexasDataSet | undefined {
  return TEXAS_DATA_SETS.find((dataset) => dataset.slug === slug);
}
