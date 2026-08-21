import type { IssueGuide } from "@/data/issue-guides";

type IssueSection = IssueGuide["sections"][number];
type IssueSource = IssueGuide["sources"][number];

type Upgrade = {
  sections: IssueSection[];
  sources?: IssueSource[];
};

const WAVE3_UPGRADES: Record<string, Upgrade> = {
  "texas-water-policy": {
    sections: [
      {
        heading: "The State Water Plan is a planning framework, not a single construction program",
        body: [
          "Texas builds its long-range water strategy through regional planning that is assembled into the State Water Plan by the Texas Water Development Board. The plan identifies projected demands, existing supplies, potential shortages and recommended strategies over future decades. A recommended reservoir, reuse project, conservation program, aquifer-storage project or pipeline is therefore a planning choice that may still need financing, permits, engineering, land, contracts and local approvals before water reaches customers.",
          "That distinction matters when a project is described as already funded or guaranteed simply because it appears in a plan. KTR should identify the sponsoring entity, planning region, estimated cost, projected yield, implementation schedule and financing status. Readers can then distinguish a recognized future need from a shovel-ready project and can track whether a strategy actually advances through permitting and construction."
        ]
      },
      {
        heading: "Surface water and groundwater follow different legal systems",
        body: [
          "Texas surface-water rights are administered under state law and generally depend on permits and seniority within the statutory system. Groundwater begins from a different property-law tradition, commonly associated with landownership and the rule of capture, while groundwater conservation districts can regulate production in many areas. Because aquifers and rivers interact physically even when the legal regimes differ, a water dispute can involve both hydrology and separate legal authorities.",
          "A useful report should therefore name the source: river, reservoir, spring, aquifer or reuse supply. It should also identify the regulator or district, the right or permit being exercised, and whether the disagreement is about ownership, pumping limits, environmental flows, transport, drought restrictions or infrastructure. Using the generic phrase 'water rights' can hide the legal rule that actually controls the dispute."
        ]
      },
      {
        heading: "Drought management is different from long-term supply planning",
        body: [
          "Long-range planning asks how Texas will meet demand decades from now; drought management asks how a utility, river authority, district or user responds when near-term supplies fall. Conservation stages, pumping restrictions, reservoir operating rules and emergency measures can change much faster than the State Water Plan. A community can have an adequate long-term strategy and still experience short-term restrictions during severe drought.",
          "KTR should report drought conditions with the date and governing authority attached. Reservoir storage, aquifer levels and local restrictions can differ sharply across a state as large as Texas. Readers benefit more from official hydrologic data and the actual drought-plan stage than from statewide generalizations that imply every region faces the same shortage at the same time."
        ]
      },
      {
        heading: "Water infrastructure is also a financing problem",
        body: [
          "Treatment plants, transmission lines, wells, reservoirs, flood-control facilities, reuse systems and aging local networks can require large capital investments before they deliver benefits. Texas uses several financing mechanisms, including state-administered loan and assistance programs, while cities, utilities, river authorities and districts may rely on rates, bonds, impact fees or local revenues. The source of repayment matters because a project can be publicly supported without being paid entirely from general state taxes.",
          "When lawmakers announce billions of dollars for water, KTR should separate authorization from appropriation, grants from loans, state money from federal money and project cost from state contribution. The accountability questions are which projects qualify, how they are ranked, who repays debt, what milestones release funds and whether construction produces the supply or reliability benefit promised."
        ]
      },
      {
        heading: "Population growth changes both demand and the location of demand",
        body: [
          "Texas growth is not evenly distributed. Fast-growing metropolitan and suburban areas may need new treatment and transmission capacity, while some rural systems struggle with aging infrastructure, small customer bases and limited technical staff. Industrial projects can create concentrated new demand in places whose historic systems were designed for smaller populations or different uses. Agricultural demand remains central in many basins and aquifers.",
          "That geography is why statewide totals alone are insufficient. A region can show adequate aggregate supply while a particular city, utility or aquifer faces constraints. KTR should connect demographic projections to the planning region and water source involved and should distinguish growth-driven capital needs from replacement of old infrastructure. That makes debates over development, conservation and project siting more concrete."
        ]
      },
      {
        heading: "Conservation, reuse and new supply solve different parts of the problem",
        body: [
          "Conservation reduces demand, reuse captures additional value from water already delivered, and new supply projects increase available water or move it to where it is needed. Each strategy has different costs, timelines and legal constraints. Conservation can often be implemented incrementally, while reservoirs or large pipelines may take years. Desalination and aquifer storage can expand options but require suitable geology, treatment, energy and permitting.",
          "Policy debates should compare strategies on equivalent terms: expected yield, cost per unit of water, reliability during drought, environmental effects, energy use, construction time and who bears the cost. No single strategy is automatically best statewide. The strongest Texas water portfolio is likely to vary by region, and KTR should let official planning documents and project records show why a local sponsor selected one option over another."
        ]
      }
    ]
  },
  "rural-texas": {
    sections: [
      {
        heading: "Rural Texas is not one economic region",
        body: [
          "The Panhandle, South Texas, East Texas, the Permian Basin, the Hill Country and the border all contain rural counties, but their economies and infrastructure needs differ. Agriculture dominates some communities, energy others, tourism others, and many depend on a mix of small business, public institutions and regional employers. A policy that helps one rural county can create different tradeoffs in another.",
          "KTR should therefore avoid treating 'rural Texas' as a single demographic block. County population trends, major industries, distance to regional centers, hospital access, school enrollment, water source and broadband availability can explain why identical state rules produce different local effects. This guide is the framework for those comparisons rather than a substitute for county-level evidence."
        ]
      },
      {
        heading: "Healthcare access is measured in travel time and service capacity",
        body: [
          "Whether a county has a hospital is only the beginning of rural-health analysis. Obstetrics, trauma care, behavioral health, dialysis, specialty services, pharmacy access and EMS coverage may require travel to another community even when a local facility remains open. Staffing shortages can also reduce available services without a formal closure. Telemedicine can help, but it cannot replace every procedure or emergency response.",
          "Useful reporting should identify the nearest available service, transfer network, workforce vacancy or service-line change. State grants and rural-hospital programs should be evaluated by whether they improve measurable access and financial stability, not only by the amount announced. KTR's dedicated rural-healthcare guide can carry the regulatory detail while this page keeps the broader rural connection visible."
        ]
      },
      {
        heading: "Broadband affects education, healthcare and business at the same time",
        body: [
          "Reliable broadband is infrastructure for remote work, telemedicine, school assignments, precision agriculture, emergency communications and small-business commerce. Rural deployment can be more expensive per customer because homes and businesses are farther apart. Federal and state programs therefore use mapping, eligibility rules and subsidies to target areas where ordinary commercial deployment may be difficult.",
          "Coverage should distinguish an area listed as eligible for funding from a location that has actually received service. Award dates, construction milestones, advertised speeds and verified availability are separate measures. KTR should also watch for overlapping programs and challenge data, because inaccurate availability maps can affect which communities qualify for public support."
        ]
      },
      {
        heading: "Property rights are central when statewide infrastructure crosses private land",
        body: [
          "Transmission lines, pipelines, highways, water projects and other infrastructure can deliver broad public or economic benefits while imposing concentrated burdens on individual landowners. Easements, condemnation authority, routing proceedings, compensation and restoration obligations therefore matter greatly in rural Texas. The agency that approves or regulates a project may not be the institution that resolves every property-value or contract dispute.",
          "KTR should identify the entity seeking access, the legal authority it claims, the route-selection process, the property interest being acquired and the forum for challenging compensation or necessity. That approach avoids treating infrastructure debates as a binary choice between growth and property rights and instead shows where Texas law attempts to balance both."
        ]
      },
      {
        heading: "Rural school districts face scale and distance constraints",
        body: [
          "A small district may transport students across long distances, operate facilities with fewer pupils and have a smaller local labor pool for teachers and specialized staff. Enrollment changes that look modest in statewide statistics can materially affect staffing and programs in a district with only a few hundred students. Alternative education providers may also be farther away than they are in metropolitan areas.",
          "School-finance and school-choice debates should therefore include rural operational data rather than assuming metro conditions apply everywhere. KTR should look at enrollment, transportation mileage, staffing vacancies, local property values, state aid and nearby provider capacity. The question is not whether rural families value educational choice; it is how policy design works where geography limits practical options."
        ]
      },
      {
        heading: "Water and energy projects can reshape rural tax bases",
        body: [
          "Oil and gas development, wind and solar projects, transmission infrastructure, reservoirs and industrial facilities can change land use, employment and local taxable value. Some communities gain significant revenue or lease income, while others bear road, housing, emergency-service or water demands. Project economics can also change over time as commodity prices, incentives or operating conditions change.",
          "Local fiscal claims should be tied to the taxing entity and time period involved. A county, school district and hospital district can experience the same project differently. KTR should separate temporary construction activity from recurring employment and distinguish private lease payments from public tax revenue so residents can evaluate the lasting local effect rather than the headline investment figure alone."
        ]
      }
    ]
  },
  "texas-economy-no-income-tax": {
    sections: [
      {
        heading: "Texas state and local taxes should be analyzed separately",
        body: [
          "The state government does not levy an individual income tax, but Texans still finance government through a mix of state and local taxes, fees and federal funds. State sales taxes and other state revenues support the state budget, while property taxes are levied locally by school districts, cities, counties and special districts. Local sales taxes also contribute to many local budgets.",
          "That structure means a claim about 'Texas taxes' should identify the level of government and the tax being measured. Property-tax relief enacted by the Legislature can change school-finance flows without turning property tax into a state tax, and a change in state sales-tax collections does not directly describe a household's local property bill. Clear categories make interstate comparisons far more meaningful."
        ]
      },
      {
        heading: "Sales-tax strength creates both an advantage and a cycle risk",
        body: [
          "A broad consumption economy can generate strong sales-tax collections when employment and spending are growing. But consumption taxes respond to economic cycles, inflation and changes in purchasing patterns. A revenue system that performs well during expansion can therefore produce different budget pressures during recession or a sharp industry downturn.",
          "Texas budgeting partly addresses that uncertainty through conservative revenue estimates, constitutional structures and reserve mechanisms. KTR should compare actual collections with the Comptroller's forecast and distinguish nominal growth caused by higher prices from growth in real economic activity. One strong collection month should not be treated as a permanent increase in the sustainable spending base."
        ]
      },
      {
        heading: "Oil and gas revenue is important but not the entire Texas budget",
        body: [
          "Severance taxes from oil and natural gas contribute directly to state revenue and can feed constitutionally directed transfers, while the energy industry also affects sales taxes, employment, property values and business activity. Yet Texas has a diversified economy, and the state budget cannot be understood by looking at petroleum revenue alone. Commodity-price swings can nevertheless create substantial year-to-year variation in energy-related receipts.",
          "KTR should separate production volume from commodity price and from tax revenue. Higher prices can raise collections without equivalent production growth, and a production record does not automatically imply a matching increase in unrestricted general revenue. The Comptroller's official revenue tables provide a better baseline than industry slogans from either supporters or critics."
        ]
      },
      {
        heading: "Property-tax relief shifts financing but does not erase local costs",
        body: [
          "When Texas uses state money to reduce school property-tax burdens, the policy changes who finances a portion of public education and how the formulas operate. Local governments still provide services with costs that must be funded, and school districts remain part of the property-tax system even when state compression or exemptions reduce individual bills. Relief can therefore be substantial without making property tax disappear.",
          "The durable fiscal questions are how much recurring state revenue is committed, how relief is distributed among taxpayers, what happens when property values change and whether the state can sustain the commitment through a weaker revenue cycle. KTR should distinguish one-time appropriations from permanent formula changes and compare proposed relief against the actual tax bill components taxpayers see."
        ]
      },
      {
        heading: "The constitutional barrier to a state individual income tax is politically significant",
        body: [
          "Texas law places substantial political barriers around adoption of a state individual income tax, reinforcing the state's longstanding policy choice. That choice shapes business recruitment, household tax comparisons and debates over how fast other revenue sources should grow. It does not, by itself, determine the total tax burden or the quality of public services.",
          "Interstate comparisons should therefore use consistent measures. Comparing Texas's zero individual income-tax rate with another state's income-tax rate while ignoring differences in property, sales or local taxes can mislead. The strongest KTR comparisons should show the tax category, household or business profile, income level and whether the source measures state taxes, local taxes or both."
        ]
      },
      {
        heading: "Spending growth is the other half of the fiscal model",
        body: [
          "A tax structure remains sustainable only if recurring spending commitments can be supported by recurring revenue across economic cycles. Texas lawmakers make choices about education, healthcare, transportation, public safety, pensions, infrastructure and other obligations, and rapid revenue growth can make permanent expansions easier to enact. The long-term question is whether those commitments remain affordable when collections normalize.",
          "One conservative benchmark compares spending growth with population growth plus inflation; other analysts focus on service needs, per-capita spending or program outcomes. KTR's role is to make the inputs visible. Readers should be able to see the baseline year, fund type, inflation measure, population period and whether federal funds are included before accepting a claim that state spending is either restrained or excessive."
        ]
      }
    ]
  },
  "texas-dei-higher-education": {
    sections: [
      {
        heading: "SB 17 regulates defined institutional practices at public higher-education institutions",
        body: [
          "The enacted 2023 law added Education Code Section 51.3525 and directs governing boards of covered public institutions to ensure that university units do not maintain a defined DEI office, assign employees or contractors to perform the duties of such an office, require DEI statements, provide specified preferences, or require covered DEI training except as the statute allows. The statutory definitions and exceptions are therefore more important than the political shorthand 'DEI ban.'",
          "KTR should identify the institutional practice actually at issue before claiming compliance or violation. A hiring process, employee training, student organization, academic course, research project and admissions program can fall under different provisions or exceptions. The enrolled law and current Education Code should be the first sources when university policies or legislative proposals are compared."
        ]
      },
      {
        heading: "The statute contains explicit exceptions that define its reach",
        body: [
          "Section 51.3525 states that the restrictions are not to be construed to apply to several categories, including academic course instruction, scholarly research and creative work, registered student organizations, short-term guest speakers, certain academic-achievement or postgraduate programs, data collection, and student recruitment or admissions. It also addresses statements used for grant or accreditation purposes under specified conditions.",
          "Those exceptions do not make every disputed activity lawful, but they prevent accurate reporting from treating any discussion of race, discrimination, diversity or identity as automatically prohibited. A strong story quotes the operative provision, identifies the institutional actor and explains why supporters or critics believe the activity falls inside or outside the statutory boundary."
        ]
      },
      {
        heading: "Governing boards carry a direct compliance responsibility",
        body: [
          "SB 17 places responsibilities on the governing boards of covered institutions rather than leaving compliance solely to individual faculty members or campus offices. The law also ties institutional certification and oversight to the governing structure. That means regents, system policies and official compliance processes are central evidence when questions arise about how a university implemented the statute.",
          "KTR should distinguish an employee's statement from an adopted institutional policy. A controversial classroom remark does not by itself establish that a governing board maintained a prohibited office, just as renaming an office does not resolve whether its actual functions comply. Documents describing duties, funding, training requirements and approval chains are more probative than labels alone."
        ]
      },
      {
        heading: "Employment and training disputes require the exact requirement",
        body: [
          "The law addresses specified employment preferences, DEI statements and mandatory training. The relevant question in an individual controversy is what the institution required as a condition of employment, promotion, enrollment or participation and whether that requirement matches the statutory language. Voluntary speech by an applicant or employee is a different issue from a university mandate or preference.",
          "For documentation, KTR should seek the job posting, application instructions, training material, policy, contract or written directive rather than relying only on a characterization of the practice. That evidence-first approach protects against both false accusations of statutory violations and attempts to preserve prohibited practices through vague terminology."
        ]
      },
      {
        heading: "Academic freedom and institutional administration are related but distinct",
        body: [
          "The statute's exceptions for course instruction and research are important because public universities perform both academic and administrative functions. A university can be restricted in how it structures an administrative office while faculty and students continue to engage in protected teaching, research and debate subject to other law and institutional rules. Free-speech and academic-freedom disputes may therefore require constitutional analysis separate from the DEI-office statute.",
          "KTR should avoid assuming that every campus speech controversy is an SB 17 case. The useful sequence is to identify whether the conduct is administrative or academic, whether the statute expressly addresses it, what other policy or constitutional rule applies, and whether a court or state authority has issued a controlling interpretation."
        ]
      },
      {
        heading: "Implementation should be evaluated through records and outcomes, not labels",
        body: [
          "The practical effect of SB 17 can be measured through office reorganizations, staffing, training policies, hiring procedures, compliance certifications and changes to student services. Institutions may describe reorganized programs using new names, but a compliance analysis should focus on function and statutory criteria. Conversely, the continued existence of programs serving first-generation, low-income or underserved students does not by itself establish a violation when the program operates within an applicable exception or neutral eligibility framework.",
          "As later legislatures amend higher-education governance, KTR should date every claim and check the current code for superseding language. The evergreen page should preserve the original SB 17 framework and explain material amendments, while current news coverage handles disputed implementation and political arguments. That keeps the guide useful without freezing a 2023 snapshot into a permanent statement of current law."
        ]
      }
    ],
    sources: [
      {
        label: "Texas Senate Research Center — SB 17 enrolled bill analysis",
        url: "https://capitol.texas.gov/tlodocs/88R/analysis/html/SB00017F.htm",
        note: "Official enrolled bill analysis describing the law's provisions, exceptions and governing-board responsibilities."
      }
    ]
  }
};

export function applyWave3IssueGuideUpgrade(guide: IssueGuide): IssueGuide {
  const upgrade = WAVE3_UPGRADES[guide.slug];
  if (!upgrade) return guide;
  return {
    ...guide,
    sections: [...guide.sections, ...upgrade.sections],
    sources: upgrade.sources ? [...guide.sources, ...upgrade.sources] : guide.sources,
  };
}

export const WAVE3_ISSUE_GUIDE_SLUGS = Object.freeze(Object.keys(WAVE3_UPGRADES));
