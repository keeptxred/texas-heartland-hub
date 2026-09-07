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
    dek: "A permanent primary-source guide to Texas reported-crime trends, offense rates, clearances, felony court activity, bail-related case reporting, state corrections populations, releases, and the methodological boundaries needed to compare public-safety statistics without treating every stage of the justice system as the same measure.",
    updated: "2026-09-06",
    quickAnswer: "Texas does not have one master statistic that answers whether crime, prosecution, courts, bail, or incarceration are rising or falling. DPS is the statewide repository for reported UCR/NIBRS offenses; the Office of Court Administration reports court cases and dispositions; TDCJ reports state correctional custody and releases. KTR uses each source for the question it actually measures and does not substitute arrests, cases, convictions, incarceration, or releases for reported crime.",
    whatAvailable: [
      "DPS Crime in Texas annual snapshots showing statewide reported index-crime volume and rates, five-year offense trends, local-agency comparisons, clearances, weapons information, property losses, sexual-assault reporting, family violence, hate crime, and other supplemental NIBRS/UCR measures.",
      "Five-year statewide violent- and property-crime trend tables that preserve both the number of reported offenses and the rate per 100,000, allowing Texas population change to be separated from changes in raw offense volume.",
      "Office of Court Administration fiscal-year files for district, statutory county, constitutional county, justice, and municipal courts, including felony and misdemeanor case activity, dispositions, sentencing information, pending caseloads, age of disposed cases, and selected bail-related case counts.",
      "TDCJ fiscal-year statistical reports covering people on hand in prison, state jail, and substance-abuse felony punishment facilities, as well as receives, releases, departures, offense-of-record information, sentence characteristics, demographics, and supervision-related categories.",
      "Official source notes that explain reporting cutoffs, revisions, population denominators, agency participation, NIBRS definitions, court reporting completeness, and TDCJ counting conventions so a change in methodology is not misreported as a change in public safety.",
      "Downloadable KTR-derived trend files that preserve the DPS annual snapshot values while linking readers back to the official report, supplemental tables, court files, and correctional reports used for verification.",
    ],
    methodology: [
      "Use DPS reported-crime statistics only for what they measure: offenses submitted by law-enforcement agencies to the Texas Uniform Crime Reporting program. The 2025 Crime in Texas report states that its annual publication is a static snapshot based on data reported by March 20, 2026, while the online UCR portal can change later when agencies add or revise records. KTR should therefore preserve the publication year, retrieval date, and annual-report cutoff instead of silently replacing a historical figure with a later portal value and calling the difference a new crime trend.",
      "Keep crime volume and crime rate separate. Volume is the number of reported offenses; the rate expresses reported offenses per 100,000 people using the population basis assigned for reporting jurisdictions. A growing state can have a falling crime rate even when raw incidents do not fall by the same percentage, and a shrinking or changing reporting population can produce the reverse. When KTR compares years or places, show the denominator and avoid mixing a statewide rate with a city, county, sheriff, or zero-population agency measure.",
      "Account for the reporting-system transition before drawing long-run conclusions. DPS explains that Texas reporting is now NIBRS-based and that statutory reporting requirements expanded participation. NIBRS records more incident detail than the older summary system, and changes in agency participation, zero-population agencies, corrections, submission timing, definitions, or quality-control processes can move statewide totals. A five-year chart is useful, but KTR should pair it with the DPS methodology note rather than imply that every movement is caused by an equivalent change in underlying victimization.",
      "Do not treat reported crime as the same thing as victimization. Some offenses are never reported to law enforcement, while some reported incidents are later reclassified, supplemented, or corrected. Likewise, a clearance is not synonymous with a conviction. DPS can record a clearance through arrest or qualifying exceptional means; prosecution and adjudication occur later in a different system. KTR should describe a DPS clearance as a law-enforcement outcome and use court records for charges, dispositions, convictions, dismissals, acquittals, deferred adjudication, sentencing, or pending caseload questions.",
      "Treat Office of Court Administration statistics as case activity, not unique people or unique crimes. One defendant can have multiple cases, one event can generate multiple charges, a case can move between active and inactive status, and motions to revoke or reactivated cases can enter the fiscal-year docket without representing a newly reported crime. OCA's FY2025 felony files explicitly count cases. Bail-related figures in the Judicial Council reporting system are also case counts in several datasets, so KTR should not label a failure-to-appear case count as the number of distinct defendants who failed to appear.",
      "Separate court dispositions from correctional custody. A conviction can result in prison, state jail, local jail, community supervision, a fine, another sentence, or combinations defined by law and case circumstances. TDCJ's on-hand population is a point-in-time snapshot of people in particular state correctional statuses as of August 31, while its annual receives and releases describe flows during a fiscal year. Neither measure is a direct proxy for the number of crimes committed, arrests made, felony cases filed, or convictions entered during that year.",
      "Read TDCJ totals with the agency's counting conventions. The FY2025 statistical report explains that an individual can experience multiple episodes or types of TDCJ control during a year and can be counted in more than one category. KTR should use point-in-time on-hand totals for custody snapshots and separately label annual receives, releases, departures, parole or mandatory-supervision categories. Do not sum overlapping categories to invent a unique-person total unless the source specifically says the categories are mutually exclusive.",
      "For city or county comparisons, use the local reporting agency and statewide DPS methodology together. Police departments, sheriff offices, constables, university agencies, transit agencies, and other law-enforcement entities can overlap geography, and some are assigned no population by the FBI for rate calculations. A mailing address or county name does not automatically define the correct reporting jurisdiction. KTR should identify the responsible agency, its population denominator where applicable, the reporting year, and whether the comparison is volume, rate, clearance, arrest, or another measure.",
      "For bail and repeat-offender policy reporting, trace the claim to the correct unit of analysis. OCA publishes Public Safety Report System data and Judicial Council case activity, but the systems do not always count the same thing. A case in which a defendant failed to appear, violated a release condition, or allegedly committed an offense while on bail or supervision is not automatically a unique defendant count or proof of guilt for a new offense. Use the statutory definition, court record, disposition, and local case context before turning an aggregate into an individual-level claim.",
      "Maintain a primary-source evidence chain for consequential claims. DPS is the starting point for statewide reported crime; OCA and the Judicial Branch are the starting point for state court activity; TDCJ is the starting point for state corrections. Local courts, county jails, prosecutors, clerks, and law-enforcement agencies remain controlling sources for many local records. KTR should preserve report dates and source links, distinguish preliminary or revisable data from published fiscal-year snapshots, and correct derived charts when an official source revises the underlying record.",
    ],
    useCases: [
      "Track statewide violent- and property-crime volume and rates over time while preserving DPS reporting cutoffs, NIBRS methodology, and population denominators.",
      "Evaluate claims that a particular offense is increasing or decreasing by comparing both raw volume and per-capita rate instead of selecting whichever measure best fits a headline.",
      "Connect reported-crime trends to court capacity by showing felony filings, dispositions, convictions, dismissals, deferred adjudication, pending caseloads, and case-age measures without implying that the court statistics are additional crime counts.",
      "Add correctional context with TDCJ point-in-time custody, receives, releases, sentence characteristics, and offense-of-record data while keeping incarceration separate from arrests, prosecutions, and convictions.",
      "Investigate bail and repeat-offender policy using OCA's case-based bail reporting, local court records, and disposition data rather than treating aggregate case flags as unique-person guilt determinations.",
      "Support permanent city, county, district, law-enforcement, criminal-justice, and legislative pages with the same source definitions so breaking-news coverage strengthens durable KTR reference infrastructure.",
      "Build future county and major-city public-safety comparisons that record the reporting agency, geographic denominator, completeness caveats, and source year before ranking jurisdictions.",
    ],
    sources: [
      { label: "2025 Crime in Texas Annual Report", url: "https://www.dps.texas.gov/sites/default/files/documents/crimereports/25/2025cit.pdf", publisher: "Texas Department of Public Safety", scope: "Official statewide 2025 UCR/NIBRS annual snapshot, statewide violent- and property-crime volume and rate trends, five-year offense tables, local-agency comparisons, methodology, clearances, weapons, sexual assault, family violence, hate crime, and reporting-cutoff notes." },
      { label: "2025 Crime in Texas Supplemental Reports", url: "https://www.dps.texas.gov/section/crime-records/2025-crime-texas-supplemental-reports", publisher: "Texas Department of Public Safety", scope: "Official supplemental offense-volume, offense-rate, clearance, weapons, property-loss, demographics, drug-seizure and law-enforcement staffing tables that extend the streamlined annual report." },
      { label: "Texas UCR Crime in Texas", url: "https://www.dps.texas.gov/section/crime-records/crime-texas", publisher: "Texas Department of Public Safety", scope: "State Crime in Texas publication hub and access point for current and historical statewide crime-reporting resources." },
      { label: "FY2025 Texas Judicial Branch Statistical Supplement", url: "https://www.txcourts.gov/statistics/annual-statistical-reports/2025/", publisher: "Texas Office of Court Administration / Texas Judicial Branch", scope: "Official FY2025 district, county, justice and municipal court activity files, statewide felony and misdemeanor case activity, dispositions, sentencing, bail information, case age, pending caseloads, and county-level downloadable tables." },
      { label: "FY2025 Statewide Felony Case Activity", url: "https://www.txcourts.gov/media/1461812/felony_activity_detail-2025.pdf", publisher: "Texas Office of Court Administration / Texas Judicial Branch", scope: "Statewide district and statutory county court felony docket, filings, convictions, deferred adjudication, acquittals, dismissals, dispositions, pending cases, sentencing and selected bail-related case counts for September 1, 2024 through August 31, 2025." },
      { label: "TDCJ Fiscal Year 2025 Statistical Report", url: "https://tdcj.texas.gov/documents/Statistical_Report_FY2025.pdf", publisher: "Texas Department of Criminal Justice", scope: "Official FY2025 prison, state-jail and SAFP on-hand populations, demographics, offense of record, receives, releases, departures, sentence information, supervision-related categories and agency counting notes." },
      { label: "TDCJ Statistical Reports Archive", url: "https://tdcj.texas.gov/publications/statistical_reports.html", publisher: "Texas Department of Criminal Justice", scope: "Current and historical TDCJ fiscal-year statistical reports for longitudinal correctional analysis and source verification." },
    ],
    related: [{ label: "Criminal Justice Policy Tracker", href: "/policy/criminal-justice" }, { label: "Texas Law Enforcement", href: "/texas-law-enforcement" }, { label: "The Texas Case for Law, Order, and Consequences", href: "/texas-case/law-order-public-safety" }, { label: "Texas Legislature", href: "/texas-legislature" }],
  },
];

export function getTexasDataSet(slug: string): TexasDataSet | undefined {
  return TEXAS_DATA_SETS.find((dataset) => dataset.slug === slug);
}
