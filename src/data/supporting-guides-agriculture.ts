import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const commonRelated = [
  { label: "Texas Agriculture & Rural Texas", href: "/texas-agriculture" },
  { label: "Texas Economy & Small Business", href: "/texas-economy" },
  { label: "Texas Laws & Legislature", href: "/laws" },
];

export const AGRICULTURE_SUPPORTING_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-farming-ranching-guide": {
    slug: "texas-farming-ranching-guide",
    title: "Texas Farming and Ranching: How the Industry Fits Together",
    dek: "A practical map of Texas crops, livestock, producers, agencies, research, markets, and public-policy issues that shape farms and ranches across the state.",
    updated: "2026-08-09",
    pillarLabel: "Texas Agriculture & Rural Texas",
    pillarHref: "/texas-agriculture",
    guideLabel: "Pillar Guide",
    keyTakeaways: [
      "Texas agriculture includes livestock, row crops, specialty crops, timber, food production, and supporting businesses, so no single commodity represents the whole sector.",
      "State and federal agencies, Texas A&M AgriLife, local governments, producer groups, lenders, and markets all influence operating conditions.",
      "Weather matters, but policy questions involving water, land, taxes, transportation, labor, trade, animal health, and regulation can be just as consequential.",
    ],
    intro: [
      "Texas farming and ranching is a network rather than one industry. Cattle operations, cotton farms, grain producers, dairies, poultry operations, nurseries, orchards, vegetable growers, timber producers, feed suppliers, processors, equipment dealers, lenders, veterinarians, transporters, and rural businesses depend on one another.",
      "For readers trying to understand an agriculture story, the useful question is usually not simply what commodity is involved. It is which part of the production chain is affected, which public agency has authority, and whether the impact is local, regional, statewide, or tied to federal policy.",
    ],
    sections: [
      { heading: "The major pieces of Texas agriculture", paragraphs: [
        "Livestock and crop production vary sharply by region because rainfall, soils, water availability, elevation, markets, and infrastructure differ across Texas. Cattle and ranching are important statewide, while cotton, grains, dairy, poultry, horticulture, timber, and specialty crops have their own geographic concentrations and supply chains.",
        "USDA agricultural statistics and Texas A&M AgriLife publications are useful starting points for understanding what is produced where. Current acreage, inventory, production, and price figures change from year to year, so a current statistical release is more reliable than a permanent number in an evergreen guide.",
      ]},
      { heading: "Who provides research, extension, and producer support", paragraphs: [
        "Texas A&M AgriLife Extension operates through a statewide county network and provides research-based education on agriculture, natural resources, family and community issues, and related topics. Producers may also work with commodity groups, conservation districts, USDA offices, veterinarians, universities, and private advisers.",
        "The Texas Department of Agriculture handles a different set of responsibilities, including regulation, market development, finance programs, rural development, and producer services. Understanding that division helps readers identify whether a question belongs with research and extension, regulation, finance, or another agency entirely.",
      ]},
      { heading: "What usually moves farm and ranch economics", paragraphs: [
        "Producer margins can be affected by commodity prices, feed and fertilizer costs, fuel, interest rates, insurance, labor, transportation, disease, drought, export demand, input availability, and financing. A strong headline about one commodity does not necessarily describe the financial condition of every producer.",
        "Public policy can change those economics through taxes, water rules, infrastructure spending, disaster programs, trade policy, animal-health restrictions, environmental regulation, and agricultural lending programs. Keep TX Red will connect those decisions to the Texas regions and producers most affected.",
      ]},
      { heading: "How to read an agriculture story", bullets: [
        "Identify the commodity, region, and stage of the supply chain involved.",
        "Separate current market conditions from permanent structural issues such as water or land use.",
        "Check whether a state, federal, county, groundwater, or other local entity actually has authority over the issue.",
        "Use current USDA, TDA, or AgriLife data when a claim depends on production, acreage, inventory, prices, or program availability.",
      ]},
    ],
    faq: [
      { q: "What are the main types of agriculture in Texas?", a: "Texas agriculture includes cattle and other livestock, cotton, grains, dairy, poultry, horticulture, timber, specialty crops, and many supporting businesses. The mix varies substantially by region." },
      { q: "Where can I find current Texas farm production data?", a: "USDA National Agricultural Statistics Service publishes current agricultural statistics, while Texas A&M AgriLife and the Texas Department of Agriculture provide additional Texas-specific information and program guidance." },
      { q: "Does the Texas Department of Agriculture run county extension offices?", a: "No. Texas A&M AgriLife Extension operates the statewide extension network. The Texas Department of Agriculture is a separate state agency with regulatory, market, finance, rural-development, and other responsibilities." },
    ],
    sources: [
      { label: "USDA NASS — Texas", url: "https://www.nass.usda.gov/Statistics_by_State/Texas/" },
      { label: "Texas A&M AgriLife Extension", url: "https://agrilifeextension.tamu.edu/" },
      { label: "Texas Department of Agriculture", url: "https://texasagriculture.gov/" },
    ],
    related: [...commonRelated, { label: "Texas agriculture essential guide", href: "/guides/texas-agriculture-rural-guide" }],
  },

  "texas-cattle-ranching-guide": {
    slug: "texas-cattle-ranching-guide",
    title: "Texas Cattle and Ranching Guide: Herds, Markets, Drought and Policy",
    dek: "How cattle production, grazing conditions, animal health, markets, drought, transportation, and state and federal policy intersect for Texas ranchers.",
    updated: "2026-08-09",
    pillarLabel: "Texas Agriculture & Rural Texas",
    pillarHref: "/texas-agriculture",
    guideLabel: "Pillar Guide",
    keyTakeaways: [
      "Cattle operations are exposed to both biological risks and market risks, including drought, feed costs, disease, weather, interest rates, and cattle prices.",
      "Animal-health events may involve the Texas Animal Health Commission as well as federal agencies and private veterinarians.",
      "Stocking decisions and herd rebuilding are long-cycle choices, so one season of rainfall or one price spike does not tell the whole story.",
    ],
    intro: [
      "Ranching is one of the most visible parts of Texas agriculture, but cattle production is a complex biological and financial cycle. Cow-calf operators, stocker operations, feedyards, processors, veterinarians, auction markets, transporters, hay producers, feed suppliers, and lenders can all be affected by the same drought or disease event in different ways.",
      "The most useful way to follow cattle news is to separate herd conditions, pasture and feed conditions, market prices, animal health, and public policy. Those factors interact, but they do not always move in the same direction at the same time.",
    ],
    sections: [
      { heading: "Drought changes more than grass conditions", paragraphs: [
        "When forage and water become scarce, ranchers may reduce stocking rates, buy supplemental feed, lease additional pasture, move cattle, or sell animals earlier than planned. Those decisions can reduce a herd quickly and influence future calf supplies and rebuilding costs long after rainfall returns.",
        "Because drought intensity differs by region, statewide averages can obscure severe local conditions. Current drought maps, range reports, and local extension guidance provide better context for a particular county or ranching region.",
      ]},
      { heading: "Animal health can trigger movement and market consequences", paragraphs: [
        "Livestock disease and pests can prompt testing, quarantine, movement restrictions, surveillance, or other official actions. In Texas, the Texas Animal Health Commission is a central state authority for livestock and poultry health, while federal agencies may also be involved depending on the disease or program.",
        "During an outbreak, producers should rely on current agency notices rather than recycled social posts. Geography, species, movement rules, effective dates, and exemptions can all matter to whether an order affects a specific operation.",
      ]},
      { heading: "Markets reflect several stages of production", paragraphs: [
        "Cattle prices can differ by animal class, weight, location, quality, and stage of production. Feed costs, processing capacity, consumer demand, imports and exports, interest rates, and herd size can also affect incentives throughout the chain.",
        "A record or unusually high price can help a seller while also making replacement animals more expensive. That is why ranch economics should be evaluated through costs and margins rather than a headline price alone.",
      ]},
      { heading: "Policy issues to watch", bullets: [
        "Animal-health rules and emergency orders.",
        "Drought and disaster assistance.",
        "Water, grazing, fencing, transportation, and land-use policy.",
        "Federal cattle-market, trade, labeling, and inspection policy when it has a material Texas impact.",
      ]},
    ],
    faq: [
      { q: "What Texas agency handles livestock disease control?", a: "The Texas Animal Health Commission is the state's primary livestock and poultry health regulatory agency. Federal agencies may also participate depending on the disease or program." },
      { q: "Why can drought affect cattle markets after rain returns?", a: "Ranchers may sell breeding animals during prolonged drought, shrinking the herd. Rebuilding takes time because cattle production is a multi-year biological cycle, so supply effects can continue after forage conditions improve." },
      { q: "Where can ranchers find current drought information?", a: "The U.S. Drought Monitor, Texas A&M AgriLife, USDA, and state water resources provide current conditions. Local conditions should be checked rather than inferred from a statewide headline." },
    ],
    sources: [
      { label: "Texas Animal Health Commission", url: "https://www.tahc.texas.gov/" },
      { label: "USDA NASS — Texas", url: "https://www.nass.usda.gov/Statistics_by_State/Texas/" },
      { label: "U.S. Drought Monitor — Texas", url: "https://droughtmonitor.unl.edu/CurrentMap/StateDroughtMonitor.aspx?TX" },
      { label: "Texas A&M AgriLife Extension", url: "https://agrilifeextension.tamu.edu/" },
    ],
    related: [...commonRelated, { label: "Texas farming and ranching guide", href: "/guides/texas-farming-ranching-guide" }],
  },

  "texas-agricultural-property-tax-guide": {
    slug: "texas-agricultural-property-tax-guide",
    title: "Texas Agricultural Property Taxes: Productivity Appraisal and Rollback Risk",
    dek: "A plain-English guide to Texas agricultural land appraisal, why it is not simply an 'ag exemption,' and what landowners should verify before changing a property's use.",
    updated: "2026-08-09",
    pillarLabel: "Texas Agriculture & Rural Texas",
    pillarHref: "/texas-agriculture",
    guideLabel: "Pillar Guide",
    keyTakeaways: [
      "Texas generally values qualifying agricultural land based on agricultural productivity rather than ordinary market value; calling the entire system an 'ag exemption' can be misleading.",
      "Eligibility depends on statutory requirements and local appraisal administration, so owning acreage alone does not automatically qualify land.",
      "A change in use can create additional tax consequences, making advance verification important before development or conversion.",
    ],
    intro: [
      "Property-tax treatment is one of the most important land-policy issues for Texas farmers, ranchers, and rural landowners. Qualifying agricultural land may receive special appraisal based on productivity, which can produce a taxable value very different from the property's open-market value.",
      "The details matter. Texas has multiple special appraisal provisions, local appraisal districts administer applications, and a later change in use can have consequences. This guide explains the framework but does not determine whether a particular parcel qualifies.",
    ],
    sections: [
      { heading: "Why 'ag exemption' is an incomplete description", paragraphs: [
        "For many qualifying properties, the key benefit is a special method of appraisal rather than a blanket exemption from taxation. The Texas Comptroller's property-tax guidance describes agricultural appraisal rules and the statutory framework local appraisal districts apply.",
        "That distinction matters because land can remain taxable while its appraised value is determined under a productivity formula. Owners should use the terminology and application requirements published by their appraisal district rather than assume informal labels carry legal meaning.",
      ]},
      { heading: "Qualification depends on use and statutory standards", paragraphs: [
        "Acreage by itself is not the test. Agricultural use, intensity, history, timing, ownership facts, and the particular statutory provision can matter. Local appraisal districts review applications and supporting information under state law.",
        "Because agricultural practices vary by region, appraisal districts may publish local guidelines for typical intensity and documentation. Those local guidelines do not replace state law, but they help owners understand what evidence the district expects.",
      ]},
      { heading: "Changing the land's use can trigger additional taxes", paragraphs: [
        "Texas law can impose additional tax consequences when qualifying land changes to a nonqualifying use. The exact rule depends on the type of appraisal and current law, so owners contemplating development, subdivision, commercial use, or another conversion should verify the consequences before the change occurs.",
        "This is especially important around fast-growing metros where development value may greatly exceed agricultural productivity value. A contract or project that looks profitable can have a different net result after taxes and transaction costs are considered.",
      ]},
      { heading: "A practical verification checklist", bullets: [
        "Confirm the parcel's current appraisal classification and value with the county appraisal district.",
        "Identify the specific Texas Tax Code provision being used rather than relying on the phrase 'ag exemption.'",
        "Ask what annual filings, documentation, or ownership/use changes must be reported.",
        "Before changing use, obtain current guidance on any additional-tax or rollback consequence that may apply.",
      ]},
    ],
    faq: [
      { q: "Is the Texas agricultural valuation an exemption from all property taxes?", a: "Generally no. Qualifying agricultural land may receive special productivity appraisal, which changes how taxable value is determined. Other exemptions may be separate and have different eligibility rules." },
      { q: "Does owning 10 acres automatically qualify for agricultural appraisal?", a: "No universal acreage rule automatically qualifies every parcel. Qualification depends on Texas law, agricultural use, history, intensity, and local administration of the statutory standards." },
      { q: "What should I do before converting agricultural land to another use?", a: "Contact the county appraisal district and review current Texas Comptroller guidance to understand whether additional taxes may result. For a material transaction, professional tax or legal advice may also be appropriate." },
    ],
    sources: [
      { label: "Texas Comptroller — Agricultural and Timber Land", url: "https://comptroller.texas.gov/taxes/property-tax/ag-timber/" },
      { label: "Texas Comptroller — Property Tax Assistance", url: "https://comptroller.texas.gov/taxes/property-tax/" },
      { label: "Texas Constitution and Statutes", url: "https://statutes.capitol.texas.gov/" },
    ],
    related: [...commonRelated, { label: "Texas property tax guide", href: "/news/texas-property-tax-guide" }],
  },

  "texas-agriculture-drought-water-guide": {
    slug: "texas-agriculture-drought-water-guide",
    title: "Texas Agriculture, Drought and Water: What Producers Need to Watch",
    dek: "How drought, groundwater, surface water, local districts, state planning, and conservation programs shape agricultural decisions across Texas.",
    updated: "2026-08-09",
    pillarLabel: "Texas Agriculture & Rural Texas",
    pillarHref: "/texas-agriculture",
    guideLabel: "Pillar Guide",
    keyTakeaways: [
      "Drought is a weather condition, but water availability is also shaped by law, infrastructure, aquifer conditions, local groundwater rules, and surface-water rights.",
      "Texas groundwater management can vary by location, so producers should know whether a groundwater conservation district governs a particular property.",
      "State water planning addresses long-term demand and supply, while producers also make short-term operational decisions about irrigation, forage, livestock, and conservation.",
    ],
    intro: [
      "Texas agriculture lives with recurring drought, but drought coverage can become too simplistic when it treats rainfall as the only variable. Producers may depend on groundwater, surface-water rights, stock tanks, reservoirs, irrigation systems, municipal or rural utilities, and conservation practices, each governed by different physical and legal constraints.",
      "A useful agriculture-water story therefore connects current conditions to the specific water source and governing institution. The same drought map can create very different consequences for a dryland cotton operation, an irrigated farm, a cow-calf ranch, or a rural community water system.",
    ],
    sections: [
      { heading: "Groundwater rules can be local", paragraphs: [
        "Texas groundwater law includes the rule of capture, but groundwater conservation districts can regulate groundwater production within their jurisdictions under state law. District boundaries, permits, spacing rules, metering, production limits, and management plans can therefore matter to an agricultural well.",
        "Before making an investment based on expected groundwater production, a landowner should identify the applicable district, if any, and review current local requirements. A statewide summary cannot substitute for the rules governing the actual tract and aquifer.",
      ]},
      { heading: "Surface water uses a different legal framework", paragraphs: [
        "Surface water administered by the state generally operates through water rights and permits rather than the groundwater framework. The Texas Commission on Environmental Quality administers state surface-water rights, while river authorities and other entities may also play operational roles in particular basins.",
        "During shortages, priority dates, permit terms, reservoir conditions, emergency actions, and basin-specific circumstances can become important. Producers relying on surface water should track the official agency or supplier controlling their source.",
      ]},
      { heading: "Drought changes both production and rural infrastructure needs", paragraphs: [
        "Drought can reduce forage and crop yields, increase irrigation demand, raise feed costs, lower reservoir levels, intensify wildfire risk, and strain small water systems. Those effects can ripple into local tax bases, agricultural employment, freight, and rural businesses.",
        "Long-term resilience can involve conservation, storage, well planning, irrigation efficiency, brush management, drought-tolerant practices, infrastructure, and financial risk management. Which investment makes sense depends heavily on region and operation.",
      ]},
      { heading: "Official resources to follow", bullets: [
        "Texas Water Development Board for planning, drought, aquifer, and water-data resources.",
        "Texas Commission on Environmental Quality for state surface-water rights and regulation.",
        "Local groundwater conservation districts for applicable groundwater rules.",
        "Texas A&M AgriLife and USDA for producer-oriented drought and conservation guidance.",
      ]},
    ],
    faq: [
      { q: "Who regulates groundwater used for Texas agriculture?", a: "Groundwater regulation depends on location. Groundwater conservation districts can regulate production within their jurisdictions under Texas law, while areas outside districts may operate under a different local regulatory structure." },
      { q: "Who administers Texas surface-water rights?", a: "The Texas Commission on Environmental Quality administers state surface-water rights. Other basin and local entities may also manage facilities or deliveries." },
      { q: "Where can I see current Texas drought conditions?", a: "The U.S. Drought Monitor and Texas Water Development Board provide current drought information, while local and agricultural agencies can provide more operation-specific context." },
    ],
    sources: [
      { label: "Texas Water Development Board", url: "https://www.twdb.texas.gov/" },
      { label: "TCEQ — Water Rights", url: "https://www.tceq.texas.gov/permitting/water_rights" },
      { label: "Texas Alliance of Groundwater Districts", url: "https://texasgroundwater.org/" },
      { label: "U.S. Drought Monitor — Texas", url: "https://droughtmonitor.unl.edu/CurrentMap/StateDroughtMonitor.aspx?TX" },
    ],
    related: [...commonRelated, { label: "Texas water rights explained", href: "/news/texas-water-rights-explained" }],
  },

  "texas-rural-eminent-domain-guide": {
    slug: "texas-rural-eminent-domain-guide",
    title: "Texas Eminent Domain for Rural Landowners: A Starting Guide",
    dek: "A plain-English overview of condemnation, easements, offers, landowner rights, and why rural property owners should verify the authority and process before signing.",
    updated: "2026-08-09",
    pillarLabel: "Texas Agriculture & Rural Texas",
    pillarHref: "/texas-agriculture",
    guideLabel: "Pillar Guide",
    keyTakeaways: [
      "Eminent domain allows certain governmental and authorized private entities to acquire property for a public use, subject to constitutional and statutory requirements.",
      "An easement can affect farming, ranching, access, drainage, future development, and property value even when the owner keeps title to the land.",
      "Landowners should identify the condemning entity, authority, proposed rights, compensation terms, and deadlines before signing documents.",
    ],
    intro: [
      "Transmission lines, pipelines, highways, water projects, and other infrastructure can bring eminent-domain questions directly onto farms and ranches. For a rural landowner, the impact is often about more than the acreage physically occupied by a project; access, gates, livestock, drainage, crop operations, aerial application, future improvements, and the wording of an easement can matter for decades.",
      "Texas condemnation law contains procedural requirements and landowner protections, but every project and parcel is fact-specific. This guide is an orientation tool, not legal advice, and a landowner facing a proposed taking should pay close attention to official notices and deadlines.",
    ],
    sections: [
      { heading: "Eminent domain is a legal power, not ordinary negotiation", paragraphs: [
        "A condemning entity must have legal authority and pursue a public use under applicable law. Texas provides a Landowner's Bill of Rights explaining basic protections and the condemnation process, including notice and procedural steps.",
        "Before treating a letter as routine real-estate outreach, a landowner should determine whether the entity claims condemnation authority and what stage of the process has begun. That distinction affects leverage, deadlines, and available remedies.",
      ]},
      { heading: "The easement language can matter as much as the payment", paragraphs: [
        "A permanent or long-term easement may define access, width, construction rights, vegetation control, maintenance, relocation, additional facilities, and restrictions on the owner's use. The operational effect on a ranch or farm can therefore extend beyond a one-time compensation figure.",
        "Owners should understand exactly what rights are being granted and whether temporary construction areas, roads, gates, drainage work, restoration obligations, or future expansion are included. These are contract and property-law questions that may justify professional review.",
      ]},
      { heading: "Compensation and damages are property-specific", paragraphs: [
        "Condemnation compensation can involve the property acquired and, depending on the facts and law, impacts to the remaining property. Agricultural operations may have concerns involving access, irrigation, improvements, fences, livestock handling, crop loss, or future use.",
        "Because valuation disputes are evidence-driven, landowners should preserve maps, photographs, leases, production information, improvement records, and other documents that help explain how the property is used and how the project may affect it.",
      ]},
      { heading: "First steps after receiving a proposal", bullets: [
        "Confirm the entity's identity and claimed condemnation authority.",
        "Read the Texas Landowner's Bill of Rights and all official notices.",
        "Map the proposed route or easement against wells, roads, fences, improvements, drainage, and productive areas.",
        "Do not ignore deadlines; obtain legal or valuation advice when the financial or operational impact is material.",
      ]},
    ],
    faq: [
      { q: "Can private companies ever use eminent domain in Texas?", a: "Certain private entities can have condemnation authority when Texas law grants it and the constitutional and statutory requirements are met. Authority should be verified for the specific entity and project." },
      { q: "Where can Texas landowners read their basic condemnation rights?", a: "The Office of the Attorney General publishes the Texas Landowner's Bill of Rights, which explains core rights and process requirements." },
      { q: "Should a landowner sign an easement offer immediately?", a: "A landowner should first understand the rights being granted, the compensation, project impacts, and deadlines. Material or complex transactions may warrant legal and appraisal advice before signing." },
    ],
    sources: [
      { label: "Texas Attorney General — Landowner's Bill of Rights", url: "https://www.texasattorneygeneral.gov/landowners-bill-rights" },
      { label: "Texas Constitution and Statutes", url: "https://statutes.capitol.texas.gov/" },
      { label: "Public Utility Commission of Texas", url: "https://www.puc.texas.gov/" },
    ],
    related: [...commonRelated, { label: "Texas water rights explained", href: "/news/texas-water-rights-explained" }],
  },

  "texas-agriculture-agencies-programs-guide": {
    slug: "texas-agriculture-agencies-programs-guide",
    title: "Texas Agriculture Agencies and Programs: Who Handles What",
    dek: "A directory-style guide to TDA, AgriLife, TAHC, USDA, water agencies, appraisal districts, and the public institutions Texas producers are most likely to encounter.",
    updated: "2026-08-09",
    pillarLabel: "Texas Agriculture & Rural Texas",
    pillarHref: "/texas-agriculture",
    guideLabel: "Pillar Guide",
    keyTakeaways: [
      "Texas agriculture issues are divided among multiple agencies; sending the right question to the right institution can save significant time.",
      "TDA handles many regulatory, market, finance, grant, and rural-development functions, while AgriLife Extension focuses on research-based education and outreach.",
      "Livestock health, water, taxes, conservation, and federal farm programs each have separate authorities.",
    ],
    intro: [
      "A producer looking for help can easily encounter a maze of acronyms. The Texas Department of Agriculture, Texas A&M AgriLife, Texas Animal Health Commission, USDA agencies, groundwater districts, appraisal districts, TCEQ, and TWDB all touch agriculture, but they do not do the same job.",
      "This guide is a routing map. Program names, funding, eligibility, and deadlines change, so the durable skill is knowing which official institution owns the question and then checking that agency's current guidance.",
    ],
    sections: [
      { heading: "Texas Department of Agriculture", paragraphs: [
        "TDA is the primary state agriculture agency. Its responsibilities include regulation, consumer protection, marketing, agricultural finance, grants, rural development, nutrition programs, and other producer and industry services.",
        "Questions about a TDA grant, pesticide-related state requirement, agricultural finance program, GO TEXAN marketing, or certain rural-development programs should start with the department's current program pages.",
      ]},
      { heading: "Texas A&M AgriLife Extension and research", paragraphs: [
        "AgriLife Extension provides research-based educational programs through county offices and subject-matter specialists. It is often the better first stop for production practices, natural resources, plant and animal topics, farm management education, and locally relevant extension information.",
        "AgriLife research and extension do not replace regulatory agencies. A recommendation about best practices is different from a binding permit, quarantine, tax rule, or program eligibility decision.",
      ]},
      { heading: "Specialized state and local authorities", bullets: [
        "Texas Animal Health Commission: livestock and poultry health regulation.",
        "TCEQ: state environmental regulation and surface-water rights administration.",
        "Texas Water Development Board: water planning, data, finance, and drought resources.",
        "Groundwater conservation districts: local groundwater management where districts exist.",
        "County appraisal districts: local property appraisal and agricultural-appraisal administration.",
      ]},
      { heading: "USDA agencies", paragraphs: [
        "Federal programs can involve the Farm Service Agency, Natural Resources Conservation Service, Risk Management Agency, Rural Development, National Agricultural Statistics Service, Animal and Plant Health Inspection Service, and other USDA components.",
        "When a federal disaster, conservation, crop-insurance, loan, statistics, or animal/plant health story breaks, identifying the specific USDA agency matters because each has different authority and program rules.",
      ]},
    ],
    faq: [
      { q: "Who should a Texas farmer call for production advice?", a: "Texas A&M AgriLife Extension is a strong starting point for research-based production and management education, often through the local county extension office." },
      { q: "Who handles Texas agricultural grants and finance programs?", a: "Many state agriculture grants and finance programs are administered by the Texas Department of Agriculture, though other state and federal agencies also operate programs." },
      { q: "Who decides whether land qualifies for agricultural property appraisal?", a: "The county appraisal district administers local property appraisal under Texas law. Statewide guidance is available from the Texas Comptroller." },
    ],
    sources: [
      { label: "Texas Department of Agriculture", url: "https://texasagriculture.gov/" },
      { label: "Texas A&M AgriLife Extension", url: "https://agrilifeextension.tamu.edu/" },
      { label: "Texas Animal Health Commission", url: "https://www.tahc.texas.gov/" },
      { label: "USDA", url: "https://www.usda.gov/" },
    ],
    related: [...commonRelated, { label: "Texas agriculture essential guide", href: "/guides/texas-agriculture-rural-guide" }],
  },

  "texas-rural-economy-infrastructure-guide": {
    slug: "texas-rural-economy-infrastructure-guide",
    title: "Rural Texas Economy and Infrastructure: Roads, Broadband, Water and Jobs",
    dek: "Why transportation, broadband, water systems, health access, workforce, schools, utilities, and state investment are core economic issues for rural Texas.",
    updated: "2026-08-09",
    pillarLabel: "Texas Agriculture & Rural Texas",
    pillarHref: "/texas-agriculture",
    guideLabel: "Pillar Guide",
    keyTakeaways: [
      "Rural economic development depends on infrastructure and services as much as on business recruitment.",
      "Roads, broadband, water, power, health care, schools, housing, and workforce availability can determine whether a community can support employers and families.",
      "Agriculture and rural towns are economically linked, so infrastructure failures can raise producer costs and weaken local services at the same time.",
    ],
    intro: [
      "Rural Texas is often discussed as if economic development means landing one factory or attracting one large employer. In practice, communities compete on a larger system: reliable water and electricity, road and freight access, broadband, health care, workforce, schools, housing, emergency services, and the capacity of local government to support growth.",
      "Agriculture sits inside that system. Farms and ranches need roads, communications, suppliers, mechanics, veterinarians, lenders, processors, hospitals, schools, and workers. When rural infrastructure weakens, agricultural operations can face higher costs even if production itself remains strong.",
    ],
    sections: [
      { heading: "Transportation connects production to markets", paragraphs: [
        "Farm-to-market roads, county roads, state highways, bridges, rail, and ports move livestock, crops, feed, equipment, workers, and processed products. Weight limits, bridge conditions, congestion, construction, and long detours can become direct business costs.",
        "Infrastructure policy is therefore an agriculture story when it materially changes access to elevators, processors, auctions, export corridors, input suppliers, or emergency services in producing regions.",
      ]},
      { heading: "Broadband is now basic business infrastructure", paragraphs: [
        "Modern producers use connectivity for markets, weather, precision agriculture, equipment systems, payments, records, telehealth, education, and communication. Rural businesses and families face the same need.",
        "Texas and federal broadband programs are intended to expand access, but maps, eligibility, funding rounds, and construction schedules change. Communities should verify current project status rather than assume an announced award means service is already available.",
      ]},
      { heading: "Water, power, health care, and housing constrain growth", paragraphs: [
        "An employer cannot expand if a community lacks water capacity, reliable power, workers, or attainable housing. Families may also leave when health care, child care, schools, or emergency services are too difficult to reach.",
        "That creates a feedback loop: population loss can weaken the tax base and local services, while service loss makes retention and recruitment harder. State rural-development policy can influence that cycle through infrastructure finance, grants, health programs, and regional planning.",
      ]},
      { heading: "What Keep TX Red will track", bullets: [
        "State and federal infrastructure awards with a measurable rural Texas impact.",
        "Water-system, broadband, transportation, and electric reliability projects.",
        "Rural hospital, workforce, housing, school, and emergency-service policy.",
        "Economic-development proposals where public incentives or state policy materially affect rural taxpayers and employers.",
      ]},
    ],
    faq: [
      { q: "Why is broadband an agriculture issue?", a: "Connectivity supports markets, precision agriculture, equipment, records, finance, weather information, education, health access, and everyday business operations for producers and rural communities." },
      { q: "What state agency runs rural-development programs in Texas?", a: "Multiple agencies have roles. The Texas Department of Agriculture administers several rural community-development programs, while transportation, broadband, water, health, and other projects involve separate agencies." },
      { q: "Does an infrastructure grant announcement mean construction is complete?", a: "No. Awards can precede contracting, engineering, permitting, matching funds, construction, and service activation. Project status should be verified with the administering agency or recipient." },
    ],
    sources: [
      { label: "Texas Department of Agriculture — Rural Community Development", url: "https://texasagriculture.gov/Grants-Services/Rural-Economic-Development/RuralCommunityDevelopment" },
      { label: "Texas Broadband Development Office", url: "https://comptroller.texas.gov/programs/broadband/" },
      { label: "Texas Department of Transportation", url: "https://www.txdot.gov/" },
      { label: "Texas Water Development Board", url: "https://www.twdb.texas.gov/" },
    ],
    related: [...commonRelated, { label: "Texas agriculture essential guide", href: "/guides/texas-agriculture-rural-guide" }],
  },
};
