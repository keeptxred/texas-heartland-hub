import type { GovernmentHistoryAuthorityPage } from "./texas-government-history-authority";

const REVIEWED = "2026-08-30";
const COUNTY_EXPLAINER = "/news/2026-08-13-how-texas-county-government-works";
const LOCAL_HANDBOOK = "/issues/texas-local-government-handbook";

export const TEXAS_COUNTY_GOVERNMENT_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "texas-county-government-history",
  title: "History of Texas County Government",
  seoTitle: "Texas County Government History: Counties, Offices and Local Power | KeepTXRed",
  description: "A source-backed history of Texas county government from Spanish and Mexican municipalities through the Republic, statehood, the Constitution of 1876 and today's 254 counties.",
  eyebrow: "Texas county government history",
  intro: "Texas county government sits between state law and local daily life. Its roots reach back to the large municipalities used under Spanish and Mexican rule, but the Republic of Texas converted those local units into counties modeled more closely on southern U.S. county government. Statehood preserved elected local offices, and the Constitution of 1876 entrenched a decentralized structure in which county judges, commissioners, sheriffs, clerks, tax officials, justices of the peace and constables exercise powers assigned by the constitution and Legislature rather than by a single county executive.",
  shortAnswer: "Texas counties are political subdivisions of the state with powers granted by the Texas Constitution and statutes. In 1836 the Republic converted the 23 existing municipalities into counties. Statehood in 1845 preserved the county as the basic local arm of state government and made county offices broadly elective. The Constitution of 1876 established the durable framework still visible today: a commissioners court made up of a county judge and four precinct commissioners, plus separately elected officers whose legal duties do not flow from a mayor-style chain of command. Modern counties manage roads, courts, jails, elections, records, emergency functions, taxes and many other services within authority created by state law.",
  reviewed: REVIEWED,
  timeline: [
    { year: "Spanish and Mexican Texas", event: "Municipalities serve as the local unit", meaning: "Large municipalities combined settlements and surrounding territory before Texas independence." },
    { year: "1836", event: "Republic converts 23 municipalities into counties", meaning: "The new Republic adopted counties as its basic local governmental subdivisions." },
    { year: "1836–1845", event: "Republic county boards develop", meaning: "County courts, chief justices, justices of the peace, sheriffs and constables supplied the early local framework." },
    { year: "1845", event: "Statehood preserves county government", meaning: "The first state constitution retained counties and expanded the elective character of local offices." },
    { year: "1876", event: "Current constitutional framework takes effect", meaning: "Article V and related provisions established the commissioners-court structure and constitutional county offices that still shape local government." },
    { year: "1890s–1930s", event: "County map and institutions mature", meaning: "Population growth, settlement and new counties produced the modern statewide county network." },
    { year: "1954", event: "County and precinct terms move broadly to four years", meaning: "A constitutional amendment lengthened many elective district, county and precinct offices from two-year to four-year terms." },
    { year: "Today", event: "Texas operates through 254 counties", meaning: "Every county remains governed within a state-created constitutional and statutory framework rather than municipal home rule." },
  ],
  sections: [
    { heading: "1. Texas counties grew out of an older local-government map", paragraphs: [
      "Before independence, Spanish and Mexican Texas used municipalities rather than counties. These were large territorial units that combined settlements with surrounding rural land. By 1836 there were 23 municipalities. The Republic did not simply preserve the old municipal institutions, but it reused their territorial footprint when Congress organized counties. The Texas State Historical Association describes that transition as the starting point for the modern county system: municipalities became counties, while the structure of government shifted toward county practices familiar in the southern United States.",
      "The Republic-era county system included local judicial and law-enforcement officers, and county government quickly became a practical way to administer courts, roads, records, elections and state law across a vast territory. County boundaries changed as settlement expanded, but the concept endured. That history matters because Texas counties were never conceived as autonomous mini-states. They functioned as local governmental subdivisions whose authority depended on the larger constitutional order of the Republic and, after annexation, the State of Texas."
    ] },
    { heading: "2. Statehood made elected county officers central to local accountability", paragraphs: [
      "The Constitution of 1845 retained county government while moving local offices firmly into the electoral system. Instead of concentrating county authority in one administrator, Texans selected multiple officeholders with distinct legal responsibilities. That pattern reflected a broader Texas preference for dividing power among independently accountable officials. It also created a structure that can be confusing to residents accustomed to city government, where a mayor, council and city manager may sit within a more unified organization.",
      "A county judge, sheriff, county clerk, district clerk, tax assessor-collector, justice of the peace or constable does not ordinarily serve as a subordinate department head of the commissioners court. The commissioners court controls major countywide decisions such as the budget, tax rate, contracts and facilities, but independently elected officials retain authority over duties assigned to their offices by law. County government therefore operates through negotiation, appropriations and overlapping legal responsibilities rather than through a single executive chain of command."
    ] },
    { heading: "3. The Constitution of 1876 locked divided local power into the state framework", paragraphs: [
      "The current Texas Constitution places core county institutions in Article V and other articles. Each county is divided into four commissioners precincts, with one commissioner elected from each. The county judge presides over the commissioners court. Separate constitutional provisions address county courts, clerks, sheriffs, justices of the peace, constables and the tax assessor-collector. Statutes then add detailed duties, procedures, qualifications, budgeting rules, records requirements and vacancy processes.",
      "That constitutional architecture explains why counties have limited flexibility compared with home-rule cities. A home-rule municipality can often act unless state or federal law prohibits the action; a Texas county generally must identify legal authority for what it proposes to do. This difference shapes fights over development, roads, public health, election administration, law enforcement and taxation. Residents may want a county to adopt a policy that sounds local in nature, yet the commissioners court may lack the same general police power that a city council can exercise."
    ] },
    { heading: "4. County government expanded as Texas urbanized, but the basic design survived", paragraphs: [
      "A nineteenth-century county government handled a far smaller population, budget and service load than a modern metropolitan county. Today large counties fund extensive court systems, jails, prosecutors, election operations, public health functions, flood-control partnerships, roads, information systems and emergency management. Smaller rural counties may rely on the same constitutional offices with much leaner staffing and broader individual responsibilities. State statutes often recognize those differences through population brackets and optional organizational rules.",
      "Even with that growth, the basic architecture remains recognizable. The commissioners court still conducts the county's general business. Separately elected officers still control many statutory functions. Commissioners court often sets salaries and funds offices without possessing day-to-day command over every official it finances. This creates real checks and balances, but it also means accountability requires identifying which office has legal authority, which body controls funding, and which decisions must appear on a posted public agenda."
    ] },
    { heading: "5. Modern county politics is easiest to follow by tracing authority, money and elections", paragraphs: [
      "For voters, the practical map begins with the commissioners court agenda and county budget. Those documents show countywide fiscal choices, contracts, facilities, tax rates and many appointments. The next layer is the independently elected officers who administer courts, jails, records, tax collection, precinct justice and other functions. Election results determine those officeholders separately, so a county can contain leaders from different factions or parties who must still operate within one budget and legal framework.",
      "KeepTXRed's existing county-government explainer covers the practical current structure. This authority page adds the historical and constitutional layer: why the offices are separate, why the commissioners court is not a conventional executive cabinet, and why counties possess only delegated powers. Reading the two together makes local news easier to interpret because a dispute can be separated into policy authority, budget authority, statutory duties and voter accountability instead of being reduced to a vague claim that 'the county' did something."
    ] },
  ],
  sources: [
    { href: "https://www.tshaonline.org/handbook/entries/county-organization", label: "Handbook of Texas: County Organization" },
    { href: "https://statutes.capitol.texas.gov/Docs/CN/pdf/CN.5.pdf", label: "Texas Constitution, Article V" },
    { href: "https://statutes.capitol.texas.gov/Docs/SDocs/LOCALGOVERNMENTCODE.pdf", label: "Texas Local Government Code" },
    { href: "https://www.county.org/resources/resource-library/education-and-training/duties-texas-county-officials", label: "Texas Association of Counties: Duties of Texas County Officials" },
    { href: "https://www.tsl.texas.gov/ref/abouttx/countyseats.html", label: "Texas State Library and Archives Commission: Counties and County Seats" },
  ],
  relatedLinks: [
    { href: COUNTY_EXPLAINER, label: "How Texas county government works", description: "The practical current-government explainer for county offices, budgets and services." },
    { href: LOCAL_HANDBOOK, label: "Texas local government handbook", description: "A broader guide to county, city, school and special-district authority." },
    { href: "/texas-government/commissioners-court-history", label: "Commissioners court history", description: "How the county's governing body developed and what it controls." },
    { href: "/county-elections", label: "Texas county elections", description: "County-level election administration and local voting resources." },
    { href: "/elections/2026", label: "2026 Election Central", description: "Current elections for local and statewide offices." },
  ],
  faqs: [
    { question: "Are Texas counties home-rule governments?", answer: "No. Texas counties generally exercise powers granted by the state constitution and statutes. They do not possess the broad home-rule authority available to qualifying cities." },
    { question: "Who runs a Texas county?", answer: "No single official runs every county function. The county judge and four commissioners form the commissioners court, while numerous independently elected officers control duties assigned to their offices by law." },
    { question: "How many counties does Texas have?", answer: "Texas has 254 counties, each operating within the statewide constitutional and statutory framework for county government." },
  ],
};

export const TEXAS_COMMISSIONERS_COURT_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "commissioners-court-history",
  title: "Texas Commissioners Court: History, Powers and Structure",
  seoTitle: "Texas Commissioners Court History, Powers and Structure | KeepTXRed",
  description: "A source-backed guide to the history and authority of Texas commissioners courts, including the county judge, four precinct commissioners, budgets, taxes, contracts and vacancies.",
  eyebrow: "Texas commissioners court",
  intro: "The commissioners court is the governing body of a Texas county, but its name causes persistent confusion. It is not primarily an appellate court and it does not function like a city council with a mayor who controls every department. The body is composed of the county judge and four county commissioners elected from precincts. Its authority comes from the Texas Constitution and statutes, and its central responsibilities include county budgets, tax rates, contracts, facilities, roads, salaries and other county business assigned by law.",
  shortAnswer: "Article V, Section 18 of the Texas Constitution divides each county into four commissioners precincts and provides for one commissioner elected from each. Those four commissioners, together with the county judge as presiding officer, form the commissioners court. The court conducts the county's general business within authority granted by the constitution and Legislature. It adopts the budget and county tax rate, authorizes contracts and purchases, maintains county property, sets many salaries and benefits, and fills vacancies in specified county offices. It does not generally supervise independently elected officers in the same way a corporate board supervises employees.",
  reviewed: REVIEWED,
  timeline: [
    { year: "1836", event: "Republic county boards begin", meaning: "Early county governance combined a chief justice with local justices of the peace." },
    { year: "1845", event: "Four elective commissioners replace the earlier board model", meaning: "Statehood-era organization moved toward the recognizable commissioner structure." },
    { year: "1876", event: "Article V constitutionalizes the commissioners court", meaning: "The current constitution establishes four precinct commissioners and the county judge as the court." },
    { year: "20th century", event: "County budgets and services expand", meaning: "Urbanization and new statutory duties enlarge the practical importance of commissioners courts." },
    { year: "1954", event: "Local elective terms broadly become four years", meaning: "Constitutional changes increase continuity for county and precinct officeholders." },
    { year: "1987", event: "Local Government Code codifies county organization", meaning: "The modern code consolidates many statutes governing commissioners-court procedure and authority." },
    { year: "Modern era", event: "Open-government rules shape county meetings", meaning: "Posted agendas, public meetings and records laws make commissioners-court action a highly visible local-government process." },
    { year: "Today", event: "Every Texas county operates a commissioners court", meaning: "The five-member body remains the central countywide fiscal and policy institution." },
  ],
  sections: [
    { heading: "1. The commissioners court evolved from Republic-era county boards", paragraphs: [
      "The Republic's first county governing arrangements used a chief justice and justices of the peace rather than the exact five-member body Texans know today. By the statehood era, Texas moved toward a system with four elected commissioners. The Constitution of 1876 then fixed the recognizable structure by requiring four commissioners precincts and providing that the commissioners, together with the county judge, compose the county commissioners court.",
      "This history explains the unusual name. The commissioners court inherited terminology from an era when local judicial and administrative functions were more intertwined. Today its principal work is legislative and administrative: budgets, tax rates, contracts, facilities, road policy, appointments and county operations. The county judge may retain judicial duties depending on local court structure, but the commissioners court itself should not be confused with a trial court deciding ordinary civil or criminal cases."
    ] },
    { heading: "2. Five elected members share countywide fiscal authority", paragraphs: [
      "Each commissioner is elected from one of four precincts, while the county judge is elected countywide. Once seated, all five participate in decisions affecting the whole county. A commissioner may devote particular attention to roads or constituent issues in the commissioner's precinct, but the court collectively approves the annual county budget, tax rate, major purchases, contracts and many policies. The legal unit is the commissioners court, not four independent precinct governments.",
      "The county judge serves as presiding officer, but that does not convert the office into a mayoral executive. A judge normally needs votes from other members to approve court action. Commissioners likewise cannot individually bind the county to contracts or appropriations that require court authorization. The five-member structure creates coalition politics at the county level because durable policy generally requires a majority operating through posted meetings and legally sufficient orders."
    ] },
    { heading: "3. Budget power is broad, but it is not the same as command authority", paragraphs: [
      "The commissioners court's most consequential power is often financial. It adopts the county budget, sets the county tax rate, authorizes purchases, maintains county buildings and establishes many salaries and benefits. Those decisions can strongly affect sheriffs, clerks, prosecutors, courts and other offices because personnel and operations require appropriations. Texas Association of Counties materials describe the court as the county's general business and policymaking body for precisely this reason.",
      "Yet an independently elected sheriff, clerk or tax assessor-collector is not simply a department director who reports to the county judge. The officeholder's statutory duties belong to that office. Commissioners court can exercise budget authority and other powers granted by law, but it cannot casually transfer an elected officer's legal responsibilities to another official or direct every discretionary act. Disputes over funding and operational independence are therefore recurring features of county government."
    ] },
    { heading: "4. Vacancy appointments make the court a key continuity institution", paragraphs: [
      "State law gives commissioners courts authority to fill vacancies in a range of county offices, including county judge, county clerk, sheriff, county attorney, tax assessor-collector, justice of the peace and constable. Local Government Code Chapter 87 specifies many of these processes. A vacancy in a county commissioner position follows a different appointment rule, underscoring that local succession is governed by statute rather than improvised when an office becomes empty.",
      "These appointments are temporary democratic bridge mechanisms, not permanent transfers of the election power. The appointed official serves under the period prescribed by law until voters fill the office through the applicable election process. That makes commissioners-court composition politically important beyond budgets: a court may determine who temporarily controls another county office after resignation, death, removal or another vacancy."
    ] },
    { heading: "5. Agendas and records are the public map of commissioners-court power", paragraphs: [
      "Because the commissioners court must act collectively, posted agendas and meeting records are among the best tools for following county government. Open Meetings Act requirements generally require advance notice of subjects to be considered, while county clerks record court proceedings. Budgets, tax notices, purchasing records and meeting packets can reveal the practical exercise of authority more clearly than campaign rhetoric or social-media disputes.",
      "For residents, the simplest accountability method is to identify whether a decision belongs to the commissioners court, an independently elected officer, or another entity entirely. The court may fund a sheriff's office without directing an investigation; it may collect tax revenue without setting a school district's rate; it may maintain county roads without controlling a state highway. Understanding those boundaries turns the commissioners-court agenda into a precise guide to what the county can actually decide."
    ] },
  ],
  sources: [
    { href: "https://statutes.capitol.texas.gov/Docs/CN/pdf/CN.5.pdf", label: "Texas Constitution, Article V, Section 18" },
    { href: "https://statutes.capitol.texas.gov/Docs/LG/pdf/LG.81.pdf", label: "Texas Local Government Code, Chapter 81" },
    { href: "https://statutes.capitol.texas.gov/Docs/SDocs/LOCALGOVERNMENTCODE.pdf", label: "Texas Local Government Code, Chapter 87 vacancy provisions" },
    { href: "https://www.county.org/resources/resource-library/education-and-training/duties-texas-county-officials", label: "Texas Association of Counties: Commissioners Court and County Commissioner duties" },
    { href: "https://www.tshaonline.org/handbook/entries/county-organization", label: "Handbook of Texas: County Organization" },
  ],
  relatedLinks: [
    { href: "/texas-government/texas-county-government-history", label: "Texas county government history", description: "The larger constitutional history of counties and local offices." },
    { href: "/texas-government/county-judge-history", label: "County judge history", description: "The countywide presiding officer and the office's judicial-administrative dual role." },
    { href: "/texas-government/county-commissioner-history", label: "County commissioner history", description: "The four precinct officials who share commissioners-court power." },
    { href: COUNTY_EXPLAINER, label: "How Texas county government works", description: "Practical current guidance on budgets, roads and independent county offices." },
    { href: "/elections/2026", label: "2026 Election Central", description: "Current election coverage and local-office context." },
  ],
  faqs: [
    { question: "Is a Texas commissioners court actually a court?", answer: "Despite the name, its primary modern function is the legislative and administrative business of the county. It does not function as the ordinary trial court for county civil and criminal cases." },
    { question: "Who sits on a commissioners court?", answer: "The county judge and four county commissioners. Commissioners are elected from four precincts, while the county judge is elected countywide." },
    { question: "Can the commissioners court order the sheriff how to enforce the law?", answer: "The court controls important budget and countywide policy matters, but the sheriff is an independently elected constitutional officer with duties assigned by law. Budget power is not the same as day-to-day command authority." },
  ],
};

export const TEXAS_COUNTY_JUDGE_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "county-judge-history",
  title: "Texas County Judge: History, Powers and Dual Role",
  seoTitle: "Texas County Judge History, Powers and Commissioners Court Role | KeepTXRed",
  description: "A source-backed history of the Texas county judge, including the constitutional county court, commissioners-court leadership, emergency management and differences between rural and urban counties.",
  eyebrow: "Texas county judge",
  intro: "The title 'county judge' is one of the most misunderstood offices in Texas government. The office is rooted in the constitutional county court, yet the county judge also presides over the commissioners court and performs major administrative and emergency-management duties. In smaller counties the judge may still exercise substantial probate, misdemeanor and civil jurisdiction. In large counties statutory courts often absorb much of that judicial work, leaving the county judge's public role centered on countywide policy and administration.",
  shortAnswer: "Every Texas county has a constitutional county judge elected countywide for a four-year term. Article V creates a county court in each county and makes the county judge its judge, while Article V, Section 18 makes the county judge presiding officer of the commissioners court. State statutes add administrative, budgeting and emergency-management duties. The office therefore combines functions that are separated in many other governments. The exact balance varies by county because the Legislature has created county courts at law, probate courts and other statutory courts that can assume jurisdiction otherwise associated with the constitutional county court.",
  reviewed: REVIEWED,
  timeline: [
    { year: "Republic era", event: "County chief justices lead early local courts", meaning: "The Republic used county judicial officers as central figures in local administration." },
    { year: "1845", event: "Statehood formalizes county judicial offices", meaning: "The first state constitution preserves county courts within the state judicial structure." },
    { year: "1876", event: "Current constitution creates the durable county-judge role", meaning: "Article V establishes county courts and the county judge while making the judge presiding officer of commissioners court." },
    { year: "20th century", event: "Statutory county courts expand", meaning: "Growing counties receive county courts at law and specialized courts that reduce the constitutional judge's courtroom docket." },
    { year: "1954", event: "Term becomes four years", meaning: "Constitutional changes lengthen county-office terms and provide greater continuity." },
    { year: "Modern era", event: "Emergency-management role becomes prominent", meaning: "State law gives county judges central responsibilities for coordinating county disaster response." },
    { year: "Urban Texas", event: "Administrative identity grows", meaning: "In large counties the county judge is often known chiefly as the presiding countywide policy official rather than a courtroom judge." },
    { year: "Today", event: "Judicial duties still vary by county", meaning: "The same constitutional title can describe very different daily workloads depending on local court structure." },
  ],
  sections: [
    { heading: "1. The county judge began as both a judicial and local-government office", paragraphs: [
      "Texas inherited a tradition in which local judicial officers also carried administrative responsibilities. Republic-era county government centered on county courts and chief justices, and statehood preserved the county court as an important local institution. The Constitution of 1876 continued that mixed model rather than separating county administration completely from the judiciary. Article V establishes a county court in each county and provides for the county judge, while Section 18 places the same officer at the head of the commissioners court.",
      "That dual design is why the title can mislead modern voters. A county judge is not simply the chief administrator of a county, nor is the office always a full-time courtroom position. The legal duties depend on constitutional jurisdiction, statutes and the court structure created for that county. The office exists in every county, but Dallas, Harris or Travis County can use statutory courts in ways that make the constitutional judge's daily work look very different from the judge's work in a small rural county."
    ] },
    { heading: "2. Presiding over commissioners court makes the judge a countywide political leader", paragraphs: [
      "The county judge is elected by voters across the entire county, unlike commissioners who are elected from four precincts. As presiding officer of commissioners court, the judge sets an important public tone for meetings, works with commissioners on the budget and policy agenda, and represents the county in many intergovernmental settings. The office can be highly visible during major infrastructure projects, fiscal debates, public-health controversies and emergency declarations.",
      "Presiding does not mean unilateral command. The judge generally needs commissioners-court votes for actions that belong to the court, including budgets, tax rates and contracts. Commissioners can oppose the judge, form alternate coalitions and control the outcome of court votes. The constitutional structure therefore gives the judge countywide visibility without creating a mayoral veto or executive cabinet comparable to municipal government."
    ] },
    { heading: "3. Judicial authority varies dramatically across Texas counties", paragraphs: [
      "The constitutional county court can possess jurisdiction over probate, misdemeanors, smaller civil disputes and appeals from justice courts, but the Legislature may create statutory county courts and assign jurisdiction among them. In counties with extensive statutory court systems, the constitutional county judge may perform little or no ordinary judicial work. In smaller counties, the judge can remain an active judicial officer while simultaneously presiding over commissioners-court business.",
      "This variation is not a contradiction; it is a feature of the constitutional-statute relationship. The Constitution creates the office and baseline court, while state law can build additional local courts to handle population and caseload growth. Any description of a specific county judge's courtroom powers should therefore be verified against the statutes and local court structure rather than inferred from the title alone."
    ] },
    { heading: "4. Emergency management expanded the office's modern administrative importance", paragraphs: [
      "Texas emergency-management law commonly makes the county judge the county's emergency-management director unless authority is arranged as permitted by statute. Hurricanes, wildfires, floods, winter storms, industrial incidents and other disasters can therefore place the county judge at the center of coordination among commissioners, sheriffs, fire departments, cities, hospitals, state agencies and volunteer organizations. This is one reason the office receives statewide attention during major emergencies even in counties where the judge has limited judicial duties.",
      "Emergency leadership still operates within law. Disaster declarations, evacuation coordination, burn bans and emergency expenditures each have governing statutes and procedural requirements. The judge's visibility should not be confused with unlimited emergency power. Other elected county officers retain their legal duties, municipalities retain their own authorities, and state or federal agencies may control functions outside county jurisdiction."
    ] },
    { heading: "5. Voters should evaluate both institutional skill and local court structure", paragraphs: [
      "County-judge elections can involve budgeting, taxes, roads, public safety, emergency management, regional planning and—in some counties—actual judicial qualifications and courtroom performance. The mix makes candidate evaluation unusually dependent on local context. A voter in a small county may need to assess both legal competence and administrative leadership, while a voter in a major metropolitan county may focus more heavily on fiscal policy, coalition building and emergency administration.",
      "The office's history explains that breadth. Texas did not design the county judge as a conventional county executive and later tack on judicial language. The combined role is constitutional from the ground up. Understanding that origin helps residents distinguish what the judge can do individually, what requires a commissioners-court vote, what belongs to the constitutional county court, and what has been reassigned to statutory courts or other officials."
    ] },
  ],
  sources: [
    { href: "https://statutes.capitol.texas.gov/Docs/CN/pdf/CN.5.pdf", label: "Texas Constitution, Article V, Sections 15–18" },
    { href: "https://statutes.capitol.texas.gov/docs/sdocs/governmentcode.pdf", label: "Texas Government Code: County and statutory county court definitions" },
    { href: "https://statutes.capitol.texas.gov/Docs/LG/pdf/LG.81.pdf", label: "Texas Local Government Code, Chapter 81" },
    { href: "https://www.county.org/resources/resource-library/education-and-training/duties-texas-county-officials", label: "Texas Association of Counties: County Judge duties" },
    { href: "https://www.tshaonline.org/handbook/entries/county-organization", label: "Handbook of Texas: County Organization" },
  ],
  relatedLinks: [
    { href: "/texas-government/commissioners-court-history", label: "Commissioners court history", description: "The five-member body the county judge presides over." },
    { href: "/texas-government/county-commissioner-history", label: "County commissioner history", description: "The four precinct officials who share commissioners-court votes." },
    { href: "/texas-government/texas-county-government-history", label: "Texas county government history", description: "The broader development of county offices and delegated authority." },
    { href: COUNTY_EXPLAINER, label: "How Texas county government works", description: "Current practical guidance on the judge, commissioners and independently elected offices." },
    { href: "/elections/2026", label: "2026 Election Central", description: "Election context for county and statewide offices." },
  ],
  faqs: [
    { question: "Is a Texas county judge always a courtroom judge?", answer: "No. The office is constitutionally tied to the county court, but statutory courts can absorb much of that jurisdiction. In large counties the role is often primarily administrative and political." },
    { question: "Can a county judge pass county policy alone?", answer: "Generally no. Decisions assigned to the commissioners court require action by that body. The county judge presides but ordinarily needs votes from commissioners." },
    { question: "Why does the county judge lead emergency management?", answer: "Texas statutes assign important county emergency-management responsibilities to the county judge, making the office a central coordinator during local disasters." },
  ],
};

export const TEXAS_COUNTY_COMMISSIONER_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "county-commissioner-history",
  title: "Texas County Commissioner: History, Precincts and Powers",
  seoTitle: "Texas County Commissioner History, Precincts and Powers | KeepTXRed",
  description: "A source-backed guide to Texas county commissioners, the four constitutional precincts, commissioners-court voting, roads, budgets and countywide responsibility.",
  eyebrow: "Texas county commissioner",
  intro: "Every Texas county is divided into four commissioners precincts, each of which elects one county commissioner. The four commissioners and the county judge form the commissioners court. Commissioners are therefore both precinct representatives and members of a countywide governing body. Their local visibility often centers on roads, drainage and constituent services, but their most important legal power comes from voting on the county budget, tax rate, contracts, facilities, salaries and other business assigned to commissioners court.",
  shortAnswer: "Article V, Section 18 of the Texas Constitution requires four commissioners precincts in each county and one commissioner elected from each precinct for a four-year term. The commissioners sit with the county judge on commissioners court and collectively exercise authority over county business granted by the constitution and statutes. A commissioner represents a precinct but votes on countywide matters. Road responsibilities can vary by county and administrative system, so the old image of each commissioner personally running a precinct road department is not a universal description of modern practice.",
  reviewed: REVIEWED,
  timeline: [
    { year: "Republic era", event: "Justices of the peace participate in county boards", meaning: "Early local governance used a different composition before the commissioner system matured." },
    { year: "1845", event: "Four elective commissioners become part of county governance", meaning: "Statehood-era organization moves toward the current four-precinct model." },
    { year: "1876", event: "Four commissioners precincts enter the current constitution", meaning: "Article V establishes the durable structure used in every county." },
    { year: "Early 20th century", event: "Road administration becomes a defining local issue", meaning: "County growth makes road-and-bridge responsibilities a major part of commissioner politics." },
    { year: "1954", event: "Four-year terms replace older two-year terms", meaning: "Constitutional changes lengthen the tenure of county and precinct offices." },
    { year: "Late 20th century", event: "Professional county administration expands", meaning: "Larger budgets and staffs reduce reliance on a purely precinct-by-precinct operational model." },
    { year: "Modern era", event: "Redistricting shapes commissioner precincts", meaning: "Population equality and voting-rights requirements affect how the four precincts are drawn." },
    { year: "Today", event: "Commissioners combine district representation with countywide votes", meaning: "Each commissioner answers to a precinct while sharing responsibility for the whole county budget and policy structure." },
  ],
  sections: [
    { heading: "1. The four-commissioner system became part of Texas county identity", paragraphs: [
      "Republic-era county government did not initially use the exact commissioner structure that exists today. Local boards included judicial officers, but by statehood Texas had moved to four elective commissioners. The Constitution of 1876 made the arrangement durable by dividing every county into four commissioners precincts and providing for one commissioner elected by voters in each precinct.",
      "The precinct system ensures geographic representation inside county government. A commissioner from a rural precinct may face road, bridge, fire-protection and land-use concerns different from those in a dense suburban precinct. Yet the commissioner is not merely a ward representative. Once on commissioners court, the member votes on countywide finances, contracts, salaries, facilities and policies that affect residents far beyond the precinct boundaries."
    ] },
    { heading: "2. Precinct representation does not create four separate county governments", paragraphs: [
      "Texas political language often refers to 'Commissioner Precinct 1' or another precinct as if it were a small government of its own. Legally, the precinct is an electoral and administrative geography within one county. Commissioners may maintain offices and constituent operations in their precincts, and some counties organize road work by precinct, but the county remains the governmental unit and commissioners court remains the collective decision-making body.",
      "That distinction matters when a commissioner promises a countywide tax change, contract cancellation or new program. One member cannot ordinarily accomplish those actions alone. Commissioners can sponsor agenda items, negotiate with colleagues and use public influence, but formal action requires the votes and procedures specified by law. Local election coverage is more accurate when commissioner campaigns are evaluated as contests for one of five seats on a governing body rather than as elections for independent precinct executives."
    ] },
    { heading: "3. Roads are important, but commissioner authority extends far beyond roads", paragraphs: [
      "County commissioners have long been associated with roads and bridges, especially in rural Texas where precinct-based road systems were historically prominent. Texas Association of Counties materials still identify road and bridge responsibility as a common commissioner function. But road administration differs among counties, and professional engineering or centralized road departments may handle daily operations under systems authorized by law.",
      "The larger source of commissioner influence is the commissioners-court vote. Commissioners help adopt the budget and tax rate, approve purchases and contracts, set many salaries, maintain county facilities and determine appropriations for offices ranging from the sheriff to courts and elections. A commissioner who spends campaign time only on potholes is seeking an office with substantially broader fiscal and governmental responsibilities."
    ] },
    { heading: "4. Precinct boundaries are part of representation and voting-rights law", paragraphs: [
      "Because commissioners are elected from four precincts, the boundaries of those precincts affect political representation. Counties redraw precincts after population changes so districts comply with constitutional population principles and applicable voting-rights law. A fast-growing suburban county can see major shifts in representation as population moves among precincts, while rural counties may need to adjust large geographic districts to keep populations reasonably balanced.",
      "Redistricting also changes which commissioner a resident votes for without changing the county government that serves the address. The precinct map should therefore be understood as a representation map, not a service boundary for every county function. Sheriffs, clerks, tax offices and countywide courts continue serving the county under their own legal structures even when commissioner boundaries change."
    ] },
    { heading: "5. Commissioner elections decide one quarter of the precinct representation but one fifth of the governing body", paragraphs: [
      "Voters in a commissioner precinct elect one commissioner, while the countywide electorate chooses the county judge. On commissioners court, each of those five officials participates in formal county decisions. That creates a useful accountability structure: a resident can press the precinct commissioner on local concerns while also watching how the official votes on countywide taxes, budgets, staffing and contracts.",
      "The history of the office shows why both perspectives matter. Commissioners began as a mechanism for geographic local representation, but modern county government requires decisions about billion-dollar metropolitan budgets in some counties and sparse road networks in others. The same constitutional office has adapted to both settings because its core function is not a particular service; it is participation in the county's central governing body."
    ] },
  ],
  sources: [
    { href: "https://statutes.capitol.texas.gov/Docs/CN/pdf/CN.5.pdf", label: "Texas Constitution, Article V, Section 18" },
    { href: "https://statutes.capitol.texas.gov/Docs/LG/pdf/LG.81.pdf", label: "Texas Local Government Code, Chapter 81" },
    { href: "https://www.county.org/resources/resource-library/education-and-training/duties-texas-county-officials", label: "Texas Association of Counties: County Commissioner duties" },
    { href: "https://www.tshaonline.org/handbook/entries/county-organization", label: "Handbook of Texas: County Organization" },
    { href: "https://statutes.capitol.texas.gov/Docs/SDocs/LOCALGOVERNMENTCODE.pdf", label: "Texas Local Government Code" },
  ],
  relatedLinks: [
    { href: "/texas-government/commissioners-court-history", label: "Commissioners court history", description: "The governing body on which every commissioner serves." },
    { href: "/texas-government/county-judge-history", label: "County judge history", description: "The countywide officer who presides over commissioners court." },
    { href: "/texas-government/texas-county-government-history", label: "Texas county government history", description: "How delegated local power developed across the state." },
    { href: COUNTY_EXPLAINER, label: "How Texas county government works", description: "Current practical explanation of budgets, roads and independent offices." },
    { href: "/elections/2026", label: "2026 Election Central", description: "Current electoral context for local and statewide government." },
  ],
  faqs: [
    { question: "How many county commissioners does a Texas county have?", answer: "Four. Each county is divided into four commissioners precincts, and voters in each precinct elect one commissioner." },
    { question: "Does a county commissioner only vote on precinct issues?", answer: "No. Commissioners represent precincts but vote as members of commissioners court on countywide budgets, taxes, contracts, facilities and other county business." },
    { question: "Does every commissioner personally run county roads in the precinct?", answer: "Not necessarily. Road administration differs by county and may be centralized or professionally managed under systems authorized by law." },
  ],
};

export const TEXAS_COUNTY_SHERIFF_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "county-sheriff-history",
  title: "Texas County Sheriff: History, Constitutional Office and Duties",
  seoTitle: "Texas Sheriff History: Constitutional Office, Jails and Law Enforcement | KeepTXRed",
  description: "A source-backed history of the Texas county sheriff from the Republic through Article V of the Constitution, county jails, court process and modern law-enforcement duties.",
  eyebrow: "Texas county sheriff",
  intro: "The sheriff is one of Texas's oldest continuously recognizable local offices. Republic-era counties had sheriffs, and the Constitution of 1876 made the office a countywide elected constitutional position. Modern sheriffs are licensed peace officers who enforce state law, operate county jails, provide court security, serve warrants and civil process, and perform other duties assigned by statute. They are independently elected and are not ordinary department heads appointed by the commissioners court.",
  shortAnswer: "Article V, Section 23 requires each Texas county to elect a sheriff for a four-year term and leaves detailed duties, qualifications and compensation to the Legislature. Modern statutes make the sheriff a peace officer, jail administrator and officer of county and district courts. Commissioners court controls major county funding decisions and fills a sheriff vacancy until the next general election, but the sheriff's law-enforcement responsibilities belong to the constitutional office. In counties below the constitutional population threshold, the sheriff may also serve as ex officio tax assessor-collector unless voters establish a separate office.",
  reviewed: REVIEWED,
  timeline: [
    { year: "Spanish and Mexican era", event: "Local alguacil traditions precede the Republic", meaning: "Earlier municipal government included law-enforcement officials even before the American-style sheriff office." },
    { year: "1836", event: "Republic counties include sheriffs", meaning: "The new county system provides for sheriffs as core local officers." },
    { year: "1845", event: "Statehood continues elected local law enforcement", meaning: "The sheriff remains part of the county system after annexation." },
    { year: "1876", event: "Article V constitutionalizes the sheriff", meaning: "The current constitution requires an elected sheriff in each county." },
    { year: "1954", event: "Sheriff term becomes four years", meaning: "The statewide amendment lengthens elective county and precinct terms." },
    { year: "Late 20th century", event: "Professional licensing and jail standards expand", meaning: "State law increasingly formalizes training, jail operations and peace-officer standards." },
    { year: "Modern era", event: "Sheriffs operate complex county public-safety systems", meaning: "Large offices may include patrol, jail, investigations, warrants, courts and specialized units." },
    { year: "Today", event: "Sheriff remains independently elected countywide", meaning: "Voters, not the county judge, directly select the officer responsible for the constitutional sheriff's office." },
  ],
  sections: [
    { heading: "1. The sheriff office predates Texas statehood", paragraphs: [
      "Texas local law enforcement did not begin with the Constitution of 1876. Spanish and Mexican municipalities used local enforcement officials, and the Republic's county system included sheriffs and constables. When Texas became a state, the sheriff remained a recognizable county institution. The office therefore connects modern jail and patrol operations to a local-government lineage nearly as old as Texas independence itself.",
      "The modern legal foundation is explicit. Article V, Section 23 of the Texas Constitution requires an elected sheriff in each county and provides a four-year term under the amended constitution. The Legislature supplies the detailed duties and qualifications. That division between constitutional existence and statutory responsibilities is typical of Texas county offices and explains why sheriff authority must be read from both the constitution and state codes."
    ] },
    { heading: "2. The sheriff combines law enforcement, jail administration and court service", paragraphs: [
      "Sheriffs are licensed peace officers responsible for enforcing state criminal law within their jurisdiction. Texas Association of Counties identifies core duties that include managing the county jail, providing court security, serving warrants and civil papers, and carrying out law-enforcement functions. The exact size and specialization of a sheriff's office vary dramatically from a rural county with a small staff to a metropolitan agency with thousands of employees.",
      "The jail function is especially important because county incarceration is a distinct governmental responsibility. A city police department may arrest a suspect, but a county sheriff typically operates the county jail that houses pretrial detainees and other inmates assigned there by law. Jail standards, medical care, staffing, transport, court security and inmate management can therefore consume a major share of the county budget and make sheriff funding a recurring commissioners-court issue."
    ] },
    { heading: "3. Independent election separates the sheriff from commissioners-court command", paragraphs: [
      "A sheriff is not hired by the county judge and does not serve at the pleasure of commissioners court. Voters elect the sheriff countywide. Commissioners court adopts the county budget and determines appropriations that support the sheriff's office, but the sheriff retains legal control over duties assigned to the office. That separation can create tension when fiscal policy, staffing priorities or law-enforcement strategy collide.",
      "The distinction is a practical form of local checks and balances. Commissioners cannot simply direct a sheriff to investigate a particular person or refuse to execute a statutory responsibility, while the sheriff cannot unilaterally appropriate county funds outside lawful budgeting processes. Each side has authority the other must respect. Local reporting is more accurate when a budget dispute is described as a conflict between independent legal powers rather than a supervisor disciplining a subordinate department."
    ] },
    { heading: "4. Small counties can combine sheriff and tax-collection responsibilities", paragraphs: [
      "The Texas Constitution recognizes that a county with a small population may not need the same number of separately staffed offices as a major metropolitan county. Article VIII provides that in counties below the specified population threshold, the sheriff serves as assessor-collector of taxes unless the commissioners court submits and voters approve a separate tax assessor-collector office. This is a reminder that Texas county organization uses constitutional population rules as well as statewide uniform offices.",
      "Combined responsibilities do not erase the legal distinctions between functions. Tax assessment and collection duties come from tax law, while sheriff duties come from Article V, the Local Government Code, Code of Criminal Procedure and other statutes. A single officeholder may wear both hats in a small county, but each function remains governed by its own legal authority and public records."
    ] },
    { heading: "5. Sheriff elections are local executive choices with direct operational consequences", paragraphs: [
      "Sheriff races can affect jail administration, patrol emphasis, staffing, civil-process operations, interagency agreements and organizational priorities. The office also interacts constantly with district attorneys, constables, municipal police, DPS, courts and federal agencies. Yet the sheriff does not set criminal statutes or determine the county budget alone. Candidates should therefore be evaluated on the duties the office actually controls rather than promises that belong to prosecutors, judges or commissioners court.",
      "The historical continuity of the sheriff helps explain the office's strong public identity. Texans have elected sheriffs for generations because the state constitutional system places local coercive authority directly before county voters. That democratic mandate is powerful, but it remains bounded by state law, judicial review, professional licensing, jail standards, civil rights and appropriations. The office is independent, not unlimited."
    ] },
  ],
  sources: [
    { href: "https://statutes.capitol.texas.gov/Docs/CN/pdf/CN.5.pdf", label: "Texas Constitution, Article V, Section 23" },
    { href: "https://statutes.capitol.texas.gov/Docs/LG/pdf/LG.85.pdf", label: "Texas Local Government Code, Chapter 85" },
    { href: "https://statutes.capitol.texas.gov/GetStatute.aspx?Code=CR&Value=2.134", label: "Texas Code of Criminal Procedure: Peace officers" },
    { href: "https://www.county.org/resources/resource-library/education-and-training/duties-texas-county-officials", label: "Texas Association of Counties: Sheriff duties" },
    { href: "https://www.tshaonline.org/handbook/entries/county-organization", label: "Handbook of Texas: County Organization" },
  ],
  relatedLinks: [
    { href: "/texas-government/texas-county-government-history", label: "Texas county government history", description: "The broader structure of county constitutional offices." },
    { href: "/texas-government/commissioners-court-history", label: "Commissioners court history", description: "The body that funds county operations and fills a sheriff vacancy." },
    { href: "/texas-government/justice-of-the-peace-constable-history", label: "JP and constable history", description: "The precinct-level judicial and peace-officer offices that coexist with the sheriff." },
    { href: COUNTY_EXPLAINER, label: "How Texas county government works", description: "Current practical guidance on sheriffs, budgets and independent county officers." },
    { href: "/elections/2026", label: "2026 Election Central", description: "Current election coverage and voting resources." },
  ],
  faqs: [
    { question: "Who elects the Texas county sheriff?", answer: "Qualified voters of the county elect the sheriff countywide for a four-year term under the Texas Constitution." },
    { question: "Does the county judge control the sheriff?", answer: "No. The sheriff is an independently elected constitutional officer. Commissioners court controls important funding decisions, but budget authority is not ordinary supervisory command over the sheriff's statutory duties." },
    { question: "Does the sheriff run the county jail?", answer: "Yes. Operating and managing the county jail is a core sheriff responsibility under Texas law, subject to state standards and other applicable law." },
  ],
};

export const TEXAS_COUNTY_CLERKS_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "county-district-clerk-history",
  title: "Texas County and District Clerks: History, Records and Court Duties",
  seoTitle: "Texas County Clerk and District Clerk History, Records and Elections | KeepTXRed",
  description: "A source-backed guide to Texas county and district clerks, constitutional court records, deeds, marriage licenses, jury administration, elections and combined clerk offices in small counties.",
  eyebrow: "Texas county and district clerks",
  intro: "County clerks and district clerks are two distinct constitutional offices that preserve the documentary machinery of Texas local government and courts. County clerks serve county courts and commissioners courts, record deeds and other instruments, issue marriage licenses and often administer countywide elections. District clerks maintain records for district courts, manage filings and court registry funds, and support jury administration. In smaller counties, state law and the constitution can combine the two roles in a single clerk's office.",
  shortAnswer: "The Texas Constitution provides for district clerks and county clerks as elected local offices. County clerks act as clerks for county courts and commissioners courts and preserve major public records such as deeds and vital records assigned by law. District clerks serve district courts, maintaining pleadings, judgments and other court records while administering filings, registry funds and jury processes. In counties below the constitutional population threshold, one elected clerk generally performs both county- and district-clerk duties unless voters preserve separate offices under the authorized process. Both offices illustrate Texas's preference for independently elected custodians rather than a single county records department controlled by commissioners court.",
  reviewed: REVIEWED,
  timeline: [
    { year: "Republic era", event: "County and court recordkeeping becomes a core local function", meaning: "Courts and county government require official clerks and preserved records from the earliest Texas county system." },
    { year: "1845", event: "Statehood constitutionalizes local court administration", meaning: "County and district judicial systems require dedicated clerical officers." },
    { year: "1876", event: "Current constitution establishes county and district clerk framework", meaning: "Article V provides for elected clerks and allows combined offices in small counties." },
    { year: "1954", event: "Terms become four years", meaning: "Constitutional amendments lengthen district and county elective office terms." },
    { year: "Late 20th century", event: "Electronic court and land records expand", meaning: "Clerks adapt traditional record-custodian duties to digital filing and indexing systems." },
    { year: "Modern elections", event: "County clerks often serve as election administrators", meaning: "In many counties the clerk is the chief elections officer, though local arrangements vary." },
    { year: "Modern courts", event: "District clerks manage increasingly complex dockets and registry funds", meaning: "Population and litigation growth expand the administrative scope of the office." },
    { year: "Today", event: "Small counties may combine both clerk roles", meaning: "Texas still uses population-sensitive rules to scale county institutions." },
  ],
  sections: [
    { heading: "1. Clerks are constitutional custodians, not simply administrative assistants", paragraphs: [
      "Texas courts and county government generate records that determine property ownership, court judgments, marriages, elections and public accountability. The clerk offices grew with those functions. The Constitution of 1876 preserved district and county clerks as elected officers rather than placing all records under commissioners court. This makes the clerk a public custodian with duties owed directly under law and to the courts the office serves.",
      "The independence is significant. Commissioners court funds facilities and personnel, but a clerk's obligation to maintain a court record, accept a lawful filing or preserve an official instrument is not merely an internal administrative policy that commissioners can waive. Records duties come from the constitution, Government Code, Local Government Code, Property Code, Election Code and other statutes."
    ] },
    { heading: "2. County clerks connect courts, commissioners court, land records and elections", paragraphs: [
      "The county clerk serves as clerk of the constitutional county court and commissioners court. Local Government Code Section 81.003 requires the clerk to keep commissioners-court books, papers, records and proceedings. Other laws make the county clerk recorder and custodian for deeds and many instruments, authorize marriage licenses and assign vital-record responsibilities. The office therefore sits at the intersection of judicial records, property records and county governance.",
      "County clerks also play a major role in elections in many counties, often serving as the chief elections officer unless administration has been transferred or organized differently under state law. That creates a direct connection between records expertise and democratic administration. Election duties are time-sensitive and heavily regulated, so a county clerk's office can shift from routine recording work to high-volume ballot, early-voting and canvass responsibilities during election cycles."
    ] },
    { heading: "3. District clerks preserve the formal record of district courts", paragraphs: [
      "District courts handle major civil, criminal, family and other matters assigned by law. The district clerk serves as registrar, recorder and custodian for those courts, maintaining pleadings, orders, judgments and other filed instruments. The office collects filing fees, administers court registry funds and supports the process used to summon and manage jury panels. Because district-court records can determine liberty, property and family rights, accurate custody is a core judicial function.",
      "The district clerk works with judges but is independently elected in the county. This arrangement divides court administration across separate constitutional actors: judges control judicial decisions, prosecutors and litigants perform their legal roles, and the clerk maintains the official record and administrative systems. It is another example of Texas using elected offices to distribute rather than centralize local government authority."
    ] },
    { heading: "4. Small counties can combine the offices without combining the legal duties", paragraphs: [
      "Article V permits a single clerk to perform both county- and district-clerk duties in counties below the stated population threshold, subject to the election process authorized by law for keeping offices separate. Government Code provisions implement that system. The rule reflects the practical reality that a small county may not need two separately staffed constitutional offices to handle a modest volume of court and public records.",
      "A combined office does not make the underlying duties interchangeable. The same person may act as county clerk for one filing and district clerk for another, but each record belongs to a different legal system and follows different statutes, fees and retention rules. The population-based flexibility saves administrative duplication while preserving the constitutional identity of the functions."
    ] },
    { heading: "5. Digital records changed the technology, not the public-trust role", paragraphs: [
      "Electronic filing, online land indexes, digital court records and election-management systems transformed how clerks work. Residents can now search many records remotely, attorneys file electronically, and county systems exchange data with state agencies. Yet the legal responsibility for authenticity, preservation, access and security still belongs to the clerk office designated by law. Technology increases convenience while also creating cybersecurity and privacy obligations unknown to nineteenth-century framers.",
      "For voters, clerk elections are therefore not ceremonial. Candidates may oversee major record systems, election operations, public funds and high-volume court administration. Understanding the history of the offices helps explain why Texas elects these custodians independently and why commissioners court cannot simply consolidate every records function into a generic county administration department without legal authority."
    ] },
  ],
  sources: [
    { href: "https://statutes.capitol.texas.gov/Docs/CN/pdf/CN.5.pdf", label: "Texas Constitution, Article V" },
    { href: "https://statutes.capitol.texas.gov/?artSec=51.902&chapter=GV.51&code=GV&tab=1", label: "Texas Government Code, Chapter 51 clerk provisions" },
    { href: "https://statutes.capitol.texas.gov/Docs/LG/pdf/LG.81.pdf", label: "Texas Local Government Code, Section 81.003" },
    { href: "https://www.county.org/resources/resource-library/education-and-training/duties-texas-county-officials", label: "Texas Association of Counties: County and District Clerk duties" },
    { href: "https://statutes.capitol.texas.gov/", label: "Texas Constitution and Statutes" },
  ],
  relatedLinks: [
    { href: "/texas-government/texas-county-government-history", label: "Texas county government history", description: "Why clerk offices are separate constitutional institutions." },
    { href: "/texas-government/commissioners-court-history", label: "Commissioners court history", description: "The body whose proceedings the county clerk records." },
    { href: "/county-elections", label: "Texas county elections", description: "Election resources connected to county-level administration." },
    { href: COUNTY_EXPLAINER, label: "How Texas county government works", description: "Current practical explanation of clerks and other independent county offices." },
    { href: "/elections/2026", label: "2026 Election Central", description: "Current election coverage and voter resources." },
  ],
  faqs: [
    { question: "What is the difference between a Texas county clerk and district clerk?", answer: "The county clerk serves county courts and commissioners court and maintains many public records, while the district clerk serves district courts and maintains their filings, judgments, registry funds and related records." },
    { question: "Can one person be both county clerk and district clerk?", answer: "Yes. In qualifying smaller counties, Texas law provides for a combined clerk office unless voters preserve separate offices under the authorized process." },
    { question: "Does the county clerk run elections?", answer: "Often, but not always. County clerks commonly serve as chief election officers, while some counties use an elections administrator or another arrangement authorized by law." },
  ],
};

export const TEXAS_TAX_ASSESSOR_COLLECTOR_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "tax-assessor-collector-history",
  title: "Texas County Tax Assessor-Collector: History and Duties",
  seoTitle: "Texas County Tax Assessor-Collector History, Taxes and Voter Registration | KeepTXRed",
  description: "A source-backed history of the Texas county tax assessor-collector, including property-tax collection, motor vehicle services, voter registration and the small-county sheriff exception.",
  eyebrow: "Texas county tax assessor-collector",
  intro: "The county tax assessor-collector is one of the clearest examples of how Texas local government combines county and state administrative work. The office collects county property taxes and may collect for other taxing units, handles motor-vehicle title and registration transactions for the state, and commonly serves as voter registrar. Article VIII of the Texas Constitution establishes the elected office while preserving a small-county exception in which the sheriff performs tax assessor-collector duties unless voters create a separate office.",
  shortAnswer: "Article VIII, Section 14 provides for an elected county assessor-collector of taxes and sets a population-based exception for smaller counties. Modern tax assessor-collectors calculate the county's tax rate from the legally adopted levy and taxable values, collect property taxes for the county and often other local governments, process state motor-vehicle transactions, and frequently serve as voter registrar. The office does not appraise property; county appraisal districts determine taxable values. It also does not independently choose the county tax rate; commissioners court adopts the county rate through the truth-in-taxation process.",
  reviewed: REVIEWED,
  timeline: [
    { year: "Republic and early statehood", event: "Local tax collection develops with county government", meaning: "County fiscal administration requires officials to assess and collect revenue." },
    { year: "1876", event: "Constitution formalizes county tax offices", meaning: "Tax administration becomes part of the constitutional county framework." },
    { year: "20th century", event: "Assessment and collection functions evolve", meaning: "State law repeatedly changes how local property taxation and county finance are administered." },
    { year: "1979–1982", event: "Modern appraisal-district system takes effect", meaning: "Property appraisal moves to centralized county appraisal districts, separating valuation from the tax assessor-collector's collection role." },
    { year: "Modern motor-vehicle era", event: "County offices become state transaction partners", meaning: "Tax assessor-collectors process titles, registrations and related motor-vehicle functions for Texans." },
    { year: "Modern elections", event: "Many tax offices serve as voter registrars", meaning: "The office becomes a key entry point for voter-registration administration." },
    { year: "Current constitution", event: "Small counties may use the sheriff as assessor-collector", meaning: "Population rules allow a combined office unless voters approve separation." },
    { year: "Today", event: "Tax offices connect property, vehicles and elections", meaning: "One elected county office administers several high-volume public functions created by state law." },
  ],
  sections: [
    { heading: "1. The tax assessor-collector grew from the county's need to finance government", paragraphs: [
      "Counties require revenue to operate courts, jails, roads, records and other public functions. Texas therefore developed local officials responsible for assessing and collecting taxes alongside the broader county system. Article VIII of the Constitution places the assessor-collector within the constitutional framework for taxation, while later statutes define the modern office in far more detail.",
      "The current title can create confusion because property 'assessment' no longer means the office appraises market value. Modern county appraisal districts determine taxable property values under the Tax Code. The assessor-collector uses certified tax rolls and legally adopted tax rates to calculate and collect the amounts due. That separation of valuation from collection is an important accountability reform in the modern property-tax system."
    ] },
    { heading: "2. Commissioners court sets the county rate; the tax office administers the levy", paragraphs: [
      "The commissioners court adopts the county property-tax rate through procedures established by state law. The assessor-collector performs calculations and administrative steps required for the tax process, then collects the county's levy. Many tax offices also collect for cities, school districts or special districts through agreements, which can make one tax statement appear to represent one government even though several taxing units separately adopted their own rates.",
      "This distinction matters during property-tax debates. A taxpayer challenging an appraised value goes to the appraisal district and appraisal review process. A resident opposing the county tax rate addresses commissioners court. A taxpayer making payment or resolving collection questions deals with the assessor-collector. One bill can therefore reflect decisions made by several legally separate institutions."
    ] },
    { heading: "3. Motor-vehicle administration made the county office a state-service counter", paragraphs: [
      "County tax assessor-collector offices perform major motor-vehicle functions for the state, including title transfers and vehicle registration transactions. Residents may think of the local tax office primarily as the place to renew registration rather than as a property-tax institution. This state-county partnership is characteristic of Texas local government: counties often administer state-created systems close to residents while operating under statewide rules.",
      "The motor-vehicle role also means the office handles enormous transaction volumes and state funds. Staff training, technology, fraud prevention and coordination with the Texas Department of Motor Vehicles are operational responsibilities beyond traditional county taxation. The elected officer must manage both county fiscal duties and state administrative programs that can change through legislation and agency rules."
    ] },
    { heading: "4. Voter registration adds a direct elections responsibility", paragraphs: [
      "In many counties the tax assessor-collector serves as voter registrar. Registration duties include processing applications, maintaining records and implementing Election Code requirements in coordination with the Secretary of State and county election officials. This function is separate from actually conducting an election, which may belong to the county clerk, elections administrator or another authorized local official.",
      "The combination of tax, vehicle and voter-registration responsibilities makes the office unusually visible to residents. It also requires careful separation of legal functions and data systems. A change in voter-registration law does not alter property-tax authority, and a dispute over a vehicle title does not involve commissioners court policy. The same elected office can administer several distinct statutory programs without merging their legal bases."
    ] },
    { heading: "5. The small-county sheriff exception shows how Texas scales constitutional government", paragraphs: [
      "Article VIII allows the sheriff to serve as ex officio assessor-collector in counties below the constitutional population threshold, unless the commissioners court submits and voters approve a separate tax assessor-collector office. The rule reflects a recurring feature of Texas county organization: smaller counties can combine certain offices when separate staffing would be inefficient.",
      "For voters, the office should be evaluated as an administrative institution rather than a body that independently sets tax policy. The assessor-collector must accurately calculate, collect, account for and distribute revenue and administer state programs. Policy choices about tax rates belong to elected taxing units, while appraisal choices belong to appraisal districts. Understanding that division prevents the wrong office from receiving credit or blame for decisions it did not legally make."
    ] },
  ],
  sources: [
    { href: "https://statutes.capitol.texas.gov/SOTWDocs/CN/pdf/CN.8.pdf", label: "Texas Constitution, Article VIII, Section 14" },
    { href: "https://statutes.capitol.texas.gov/Docs/TX/htm/TX.6.htm", label: "Texas Tax Code, local property-tax administration" },
    { href: "https://www.county.org/resources/resource-library/education-and-training/duties-texas-county-officials", label: "Texas Association of Counties: Tax Assessor-Collector duties" },
    { href: "https://www.sos.state.tx.us/elections/", label: "Texas Secretary of State: Elections and voter registration" },
    { href: "https://www.txdmv.gov/", label: "Texas Department of Motor Vehicles" },
  ],
  relatedLinks: [
    { href: "/texas-government/texas-county-government-history", label: "Texas county government history", description: "The broader constitutional structure of local offices." },
    { href: "/texas-government/county-sheriff-history", label: "Texas sheriff history", description: "Why the sheriff can also serve as assessor-collector in qualifying smaller counties." },
    { href: "/news/texas-property-tax-laws-explained", label: "Texas property-tax laws", description: "How appraisal, rates, exemptions, protests and collection fit together." },
    { href: COUNTY_EXPLAINER, label: "How Texas county government works", description: "Current practical guidance on county tax offices and local authority." },
    { href: "/elections/2026", label: "2026 Election Central", description: "Current election coverage and voter resources." },
  ],
  faqs: [
    { question: "Does the county tax assessor-collector appraise my property?", answer: "No. County appraisal districts determine appraised values. The assessor-collector administers tax calculations and collection using certified values and rates adopted by taxing units." },
    { question: "Who sets the county property-tax rate?", answer: "The commissioners court adopts the county tax rate under state truth-in-taxation law. The assessor-collector administers the resulting levy." },
    { question: "Why does a tax assessor-collector handle vehicle registration?", answer: "Texas statutes use county tax offices as local agents for major state motor-vehicle title and registration services, in addition to their county tax duties." },
  ],
};

export const TEXAS_JP_CONSTABLE_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "justice-of-the-peace-constable-history",
  title: "Texas Justices of the Peace and Constables: History and Precinct Power",
  seoTitle: "Texas Justice of the Peace and Constable History, Courts and Duties | KeepTXRed",
  description: "A source-backed history of Texas justice-of-the-peace courts and constables, including precinct structure, Class C misdemeanors, civil cases, inquests and civil process.",
  eyebrow: "Texas precinct government",
  intro: "Justices of the peace and constables are among the most durable precinct-level offices in Texas. They appeared in the Republic's county system and remain embedded in Article V of the current constitution. A justice of the peace presides over a local justice court with limited civil and criminal jurisdiction and performs magistrate and inquest duties. A constable is a licensed peace officer associated with the precinct who serves warrants and civil process, performs law-enforcement duties and often acts as bailiff for justice court.",
  shortAnswer: "Article V, Section 18 provides the constitutional framework for justice-of-the-peace and constable precincts. Each qualifying precinct elects a justice of the peace and constable for four-year terms, subject to population-based rules that allow different numbers of precincts or courts. Justices hear fine-only misdemeanors, smaller civil disputes, eviction cases and other matters assigned by law while performing magistrate and inquest duties. Constables are licensed peace officers who serve civil process, warrants and court papers and may perform broader law-enforcement functions. The two offices are related by precinct and court service but are independently elected and legally distinct.",
  reviewed: REVIEWED,
  timeline: [
    { year: "1836", event: "Republic counties use justices and constables", meaning: "Both offices appear in the earliest county-government framework of independent Texas." },
    { year: "1845", event: "Statehood preserves precinct justice", meaning: "Local courts and peace officers continue as part of the state system." },
    { year: "1876", event: "Article V establishes the durable precinct framework", meaning: "The current constitution provides for justices of the peace, constables and commissioner precincts." },
    { year: "1890s–20th century", event: "Jurisdiction evolves through statute", meaning: "The Legislature repeatedly adjusts justice-court civil, criminal and procedural authority." },
    { year: "1954", event: "Terms become four years", meaning: "Constitutional changes lengthen elective precinct-office terms." },
    { year: "Late 20th century", event: "Peace-officer licensing professionalizes constable offices", meaning: "State training and licensing standards become central to modern constable service." },
    { year: "Modern era", event: "Justice courts handle high-volume local dockets", meaning: "Traffic, fine-only misdemeanors, evictions, small civil disputes and magistrate work make the courts a frequent public contact point." },
    { year: "Today", event: "Population rules shape precinct configurations", meaning: "Counties can have different numbers of JP courts while retaining the constitutional precinct model." },
  ],
  sections: [
    { heading: "1. Justices and constables reach back to the Republic county system", paragraphs: [
      "When the Republic organized counties from the former municipalities, justices of the peace and constables were part of the local structure. These offices reflected a practical need for accessible local justice and officers who could serve process and preserve the peace across large territories. Statehood retained the model, and the Constitution of 1876 embedded it in the judicial article rather than replacing precinct government with centralized county courts alone.",
      "The long history explains why Texas still uses offices that may seem archaic to residents from other states. A justice court is deliberately close to the public and handles lower-level matters without requiring every dispute to enter a district or county court. A constable supplies an elected peace officer tied to that precinct and court system. Both roles evolved substantially, but their geographic and democratic foundations remain recognizable."
    ] },
    { heading: "2. Justice courts are real courts with limited but important jurisdiction", paragraphs: [
      "Justices of the peace hear cases assigned by constitution and statute, including Class C misdemeanors punishable by fine only, smaller civil disputes, eviction cases and other matters within justice-court jurisdiction. They also act as magistrates, issue warrants when legally authorized, conduct inquests and perform other duties assigned by the Code of Criminal Procedure and civil statutes. The office is judicial even though many justices are not required to be attorneys.",
      "Because justice courts handle high-volume, everyday disputes, they can be a resident's most direct contact with the Texas judiciary. Traffic citations, landlord-tenant disputes, small debts and magistrate proceedings may all pass through the court. Appeals and procedural rules connect justice courts to higher courts, so the precinct tribunal is not isolated from the larger judicial system even though its jurisdiction is intentionally limited."
    ] },
    { heading: "3. Constables are peace officers with a distinctive civil-process role", paragraphs: [
      "Constables and deputy constables are peace officers under Texas law and must satisfy applicable licensing standards. Their traditional role includes serving civil process, warrants, subpoenas, temporary restraining orders and other court papers. Many offices also perform traffic enforcement, warrant operations, school or neighborhood patrols and other law-enforcement functions authorized by law and local resources.",
      "The close relationship with justice court does not make the constable a judicial employee controlled by the justice of the peace. The constable is independently elected. Commissioners court funds the office and sets compensation within law, while the constable carries out statutory peace-officer and process duties. As with the sheriff, financial dependence on the county budget coexists with independent electoral authority."
    ] },
    { heading: "4. Population rules allow Texas to scale precinct government", paragraphs: [
      "Article V uses population and local conditions to determine how justice-of-the-peace and constable precincts may be organized. Larger counties can operate multiple justice courts within precincts, while smaller counties may use fewer precincts under constitutional rules. Commissioners courts have authority over precinct boundaries within the legal framework, creating an important intersection between local representation, court access and population change.",
      "Boundary changes affect which justice and constable serve an address, but they do not transform these offices into departments of the county commissioner for that precinct. Commissioner precincts and justice/constable precincts are related constitutional geographies with different purposes. A resident should verify the correct precinct for voting, filing a case or contacting a constable rather than assuming every local boundary is identical."
    ] },
    { heading: "5. These low-ballot offices carry significant direct power", paragraphs: [
      "JP and constable races often appear far down the ballot, yet the offices touch liberty, property, housing and law enforcement. A justice can issue magistrate orders, decide eviction cases and adjudicate fine-only offenses. A constable can exercise peace-officer authority and execute court process. The relatively local scale of the offices means individual leadership, training and administrative competence can have immediate effects on residents.",
      "Their history reinforces the logic of direct election: Texans have long placed localized judicial and enforcement authority before precinct voters. That accountability model does not eliminate state oversight. Jurisdiction, procedure, judicial ethics, peace-officer licensing, civil rights and appellate review all constrain these offices. The result is local democratic control nested inside a statewide legal system."
    ] },
  ],
  sources: [
    { href: "https://statutes.capitol.texas.gov/Docs/CN/pdf/CN.5.pdf", label: "Texas Constitution, Article V, Section 18" },
    { href: "https://statutes.capitol.texas.gov/GetStatute.aspx?Code=CR&Value=2.134", label: "Texas Code of Criminal Procedure: Peace officers and magistrates" },
    { href: "https://statutes.capitol.texas.gov/", label: "Texas Constitution and Statutes: Justice Court jurisdiction" },
    { href: "https://www.county.org/resources/resource-library/education-and-training/duties-texas-county-officials", label: "Texas Association of Counties: Justice of the Peace and Constable duties" },
    { href: "https://www.tshaonline.org/handbook/entries/county-organization", label: "Handbook of Texas: County Organization" },
  ],
  relatedLinks: [
    { href: "/texas-government/texas-county-government-history", label: "Texas county government history", description: "The broader development of county and precinct institutions." },
    { href: "/texas-government/county-sheriff-history", label: "Texas sheriff history", description: "Compare the countywide sheriff with precinct constables." },
    { href: "/texas-government/commissioners-court-history", label: "Commissioners court history", description: "The countywide body that manages budgets and precinct boundaries under law." },
    { href: COUNTY_EXPLAINER, label: "How Texas county government works", description: "Current practical explanation of independent county and precinct offices." },
    { href: "/elections/2026", label: "2026 Election Central", description: "Current election coverage and voting resources." },
  ],
  faqs: [
    { question: "What does a Texas justice of the peace do?", answer: "A justice of the peace presides over a justice court with limited civil and criminal jurisdiction and also performs magistrate, inquest and other duties assigned by law." },
    { question: "Is a Texas constable a real police officer?", answer: "A constable is a licensed peace officer under Texas law and can perform law-enforcement duties in addition to serving civil process and court papers." },
    { question: "Are the justice of the peace and constable the same office?", answer: "No. They are separate elected precinct offices. The justice performs judicial duties; the constable is a peace officer and process-serving official." },
  ],
};

export const TEXAS_LOCAL_GOVERNMENT_AUTHORITY_PAGES: GovernmentHistoryAuthorityPage[] = [
  TEXAS_COUNTY_GOVERNMENT_HISTORY,
  TEXAS_COMMISSIONERS_COURT_HISTORY,
  TEXAS_COUNTY_JUDGE_HISTORY,
  TEXAS_COUNTY_COMMISSIONER_HISTORY,
  TEXAS_COUNTY_SHERIFF_HISTORY,
  TEXAS_COUNTY_CLERKS_HISTORY,
  TEXAS_TAX_ASSESSOR_COLLECTOR_HISTORY,
  TEXAS_JP_CONSTABLE_HISTORY,
];
