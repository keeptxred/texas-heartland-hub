import type { GovernmentHistoryAuthorityPage } from "./texas-government-history-authority";

const REVIEWED = "2026-08-30";
const LOCAL_HANDBOOK = "/issues/texas-local-government-handbook";
const PREEMPTION_TRACKER = "/policy/local-preemption-regulatory-consistency";
const ELECTION_CENTRAL = "/elections/2026";

export const TEXAS_MUNICIPAL_GOVERNMENT_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "texas-municipal-government-history",
  title: "History of Municipal Government in Texas",
  seoTitle: "Texas Municipal Government History: Cities, Charters and Local Power | KeepTXRed",
  description: "A source-backed history of Texas city government from Spanish and Mexican municipalities through Republic-era incorporation, the 1912 home-rule amendment and modern city authority.",
  eyebrow: "Texas municipal government history",
  intro: "Texas city government developed along a different path from county government. Spanish and Mexican municipalities were broad territorial units, but after independence the Republic converted those older municipalities into counties and began separately incorporating towns and cities. For decades the Texas Congress and then the Legislature granted or controlled municipal charters. The major break came in 1912, when voters amended Article XI of the Texas Constitution to permit qualifying cities to adopt home-rule charters. That change created the modern distinction between general-law municipalities that depend on statutory grants of power and home-rule cities that possess local self-government subject to constitutional and statutory limits.",
  shortAnswer: "Texas municipal government moved from individually granted charters toward local self-government as cities grew. The Republic began incorporating cities after 1836. State legislatures continued to grant special charters after statehood, while general incorporation statutes created standardized options for smaller communities. In 1912 Texas voters approved constitutional home rule for cities above the constitutional population threshold, and enabling legislation followed in 1913. Today municipal authority depends heavily on whether a city is home rule or general law, what its charter provides, and what the Legislature has authorized or preempted. City councils govern through ordinances, budgets, taxes, appointments and local services, while administrative structure varies among mayor-council and council-manager systems.",
  reviewed: REVIEWED,
  timeline: [
    { year: "Spanish and Mexican Texas", event: "Municipalities organize local territory", meaning: "The term municipality described both settlements and large surrounding jurisdictions before independence." },
    { year: "1836", event: "Republic separates counties from incorporated cities", meaning: "Former municipalities became counties while Congress began granting charters to urban settlements." },
    { year: "1837–1845", event: "Republic charters cities individually", meaning: "Local corporate authority depended on acts of the Republic rather than a general home-rule power." },
    { year: "1845", event: "Statehood continues legislative control of city charters", meaning: "The Legislature remained the central source of municipal corporate authority." },
    { year: "Late 1800s", event: "General incorporation laws expand", meaning: "Standard statutory forms allowed more communities to organize without a unique special charter." },
    { year: "1901", event: "Galveston popularizes commission government", meaning: "Post-hurricane reform made the commission form nationally influential before later council-manager systems spread." },
    { year: "1912–1913", event: "Texas adopts constitutional home rule", meaning: "Voters approved Article XI home rule and the Legislature enacted procedures for qualifying cities to adopt charters." },
    { year: "Modern era", event: "State preemption increasingly defines local boundaries", meaning: "Home-rule power remains broad, but statutes and statewide regulatory policy determine where local authority stops." },
  ],
  sections: [
    { heading: "1. Texas cities began as separately incorporated governments, not miniature counties", paragraphs: [
      "Before independence, a Spanish or Mexican municipality was both a settlement and a much larger territorial unit. Independence changed that vocabulary. The Republic of Texas used the old municipal territories as the basis for counties, while urban communities increasingly became incorporated cities or towns through separate acts. The distinction still matters: Texas counties developed as subdivisions of the state with delegated powers, while municipalities evolved into corporate local governments with ordinances, charters and more concentrated authority over urban services.",
      "Early incorporation was highly legislative. A city could not simply write its own charter because local corporate powers were supplied by Congress of the Republic or, after statehood, by the Texas Legislature. Individual charters addressed governing bodies, taxes, streets, markets, police powers and other municipal functions. That arrangement tied local institutional design to Austin and made growing cities dependent on state lawmakers for many structural changes." ] },
    { heading: "2. General incorporation laws created a standardized path for smaller communities", paragraphs: [
      "As settlement expanded, individual special charters became an inefficient way to organize every town. Texas developed general incorporation laws that allowed communities meeting statutory requirements to organize under standardized forms. The modern Local Government Code preserves this tradition through Type A, Type B and Type C general-law municipalities. Their precise governing structures differ, but the common principle is that general-law cities look to state law for the authority to act and for many of the rules governing their councils and officers.",
      "That legal posture distinguishes general-law municipalities from home-rule cities. A general-law city cannot rely on a broad theory of inherent local authority; officials must identify constitutional or statutory authorization. For voters, the difference affects annexation, organization, appointments, terms, ordinances and many other questions. Two neighboring cities may deliver similar services while operating under materially different legal frameworks because one has adopted a home-rule charter and the other remains general law." ] },
    { heading: "3. The 1912 home-rule amendment was the major constitutional turning point", paragraphs: [
      "Rapid urban growth created pressure for cities to manage their own internal affairs without repeatedly seeking special legislation. Texas voters approved the home-rule amendment to Article XI, Section 5 in 1912, and enabling legislation followed in 1913. Qualifying cities could thereafter frame and adopt local charters through voter approval. A charter could establish governing structure and local powers so long as it remained consistent with the Texas Constitution and general laws enacted by the Legislature.",
      "Home rule changed the direction of the legal inquiry. Instead of asking only whether the Legislature had affirmatively granted a particular municipal power, a home-rule city could generally exercise local self-government unless state or federal law restricted it. Local Government Code Section 51.072 reflects that principle. The distinction is central to modern lawsuits over ordinances because courts often begin by asking whether state law expressly or impliedly preempts the local action rather than whether a home-rule city received a narrow enabling grant." ] },
    { heading: "4. Texas experimented with several forms of urban political organization", paragraphs: [
      "Institutional design changed as cities became more complex. Galveston's commission government, adopted after the 1900 hurricane and associated recovery crisis, became a nationally studied reform model. Commissioners combined legislative and administrative responsibilities for major city functions. Over time, however, the council-manager model became dominant among many Texas home-rule cities, separating elected policy leadership from professional day-to-day administration. Other cities retained forms of mayor-council government with varying degrees of executive power.",
      "These labels do not by themselves answer every authority question. A home-rule charter can allocate appointment, veto, agenda, budget and administrative responsibilities differently from another city's charter. General-law cities are more tightly structured by statute. To understand who controls a particular decision, residents need to read the applicable charter or statute rather than assuming that every Texas mayor has the same powers as a governor, county judge or mayor in another state." ] },
    { heading: "5. Modern municipal politics is a continuing negotiation between local voters and state law", paragraphs: [
      "Cities now govern police and fire services, streets, utilities, zoning where authorized, parks, public health functions, building regulation, municipal courts, debt, taxes and many other local services. But municipal authority is never isolated from the state. The Legislature establishes election rules, taxation limits, debt procedures, annexation rules, open-government requirements and substantive restrictions that can override local ordinances. Home-rule authority is therefore broad but legally bounded; general-law authority remains more expressly dependent on statute.",
      "KeepTXRed's municipal authority cluster separates institutional history from current policy disputes. This page explains why city government has the structure it does. The local-government handbook supplies the practical overview, while the state-local preemption tracker follows modern legislation and litigation that changes what cities and counties may regulate. Election Central connects those legal structures to the voters who choose mayors, councilmembers and other local officials." ] },
  ],
  sources: [
    { href: "https://www.tshaonline.org/handbook/entries/city-government", label: "Handbook of Texas: City Government" },
    { href: "https://www.tshaonline.org/handbook/entries/home-rule-charters", label: "Handbook of Texas: Home Rule Charters" },
    { href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.11.htm", label: "Texas Constitution, Article XI" },
    { href: "https://statutes.capitol.texas.gov/Docs/LG/htm/LG.5.htm", label: "Texas Local Government Code, Chapter 5" },
    { href: "https://www.tml.org/DocumentCenter/View/5614/2025-Handbook-for-Mayors-and-Councilmembers-pdf-FINAL", label: "Texas Municipal League: Handbook for Mayors and Councilmembers" },
  ],
  relatedLinks: [
    { href: LOCAL_HANDBOOK, label: "Texas local government handbook", description: "The practical overview of city, county, school and special-district authority." },
    { href: PREEMPTION_TRACKER, label: "State-local preemption tracker", description: "Current Texas legislation and litigation defining local regulatory boundaries." },
    { href: "/texas-government/home-rule-general-law-cities-history", label: "Home-rule vs. general-law cities", description: "How the two legal categories differ and why the distinction matters." },
    { href: "/texas-government/mayor-city-council-history", label: "Mayor and city council authority", description: "How elected city leadership developed and how its powers vary." },
    { href: ELECTION_CENTRAL, label: "2026 Election Central", description: "Current elections and voter resources for Texas offices." },
  ],
  faqs: [
    { question: "When did Texas cities gain home rule?", answer: "Texas voters approved the constitutional home-rule amendment in 1912, and implementing legislation followed in 1913." },
    { question: "Are all Texas cities home rule?", answer: "No. Texas has home-rule and general-law municipalities. General-law cities operate under powers and structures supplied by state law, while qualifying cities may adopt home-rule charters." },
    { question: "Does home rule let a city ignore state law?", answer: "No. Home-rule authority is subject to the Texas Constitution and state laws that validly limit or preempt municipal action." },
  ],
};

export const TEXAS_HOME_RULE_GENERAL_LAW_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "home-rule-general-law-cities-history",
  title: "Texas Home-Rule vs. General-Law Cities: History and Authority",
  seoTitle: "Texas Home-Rule vs General-Law Cities: Powers, Charters and History | KeepTXRed",
  description: "How Texas home-rule and general-law cities developed, how charters work, why the 5,000-population threshold matters, and how state preemption limits local power.",
  eyebrow: "Texas home rule and general law",
  intro: "The most important legal distinction in Texas municipal government is not whether a place calls itself a city or town. It is whether the municipality operates under a home-rule charter or under the state's general municipal laws. General-law municipalities exercise powers supplied by statute. Home-rule municipalities operate under voter-approved charters and possess broad local self-government subject to the Texas Constitution and state preemption. The distinction emerged from the political struggle over whether rapidly growing cities should have to seek legislative permission for ordinary local decisions.",
  shortAnswer: "A Texas home-rule municipality is one that operates under a charter adopted or amended under Article XI, Section 5 of the Texas Constitution. A qualifying city with more than 5,000 inhabitants may adopt such a charter through local procedures and voter approval. Local Government Code Section 51.072 recognizes full power of local self-government for home-rule cities, but that power remains subject to constitutional and statutory limits. General-law cities do not have the same residual power; they generally act only where state law authorizes them. The practical result is that city type affects governing structure, ordinance authority, vacancies, annexation, elections and the analysis courts use when state law conflicts with local rules.",
  reviewed: REVIEWED,
  timeline: [
    { year: "1836–1911", event: "Legislative charters and general laws dominate", meaning: "Cities remain dependent on state-level grants rather than constitutional home rule." },
    { year: "1900s", event: "Urban growth intensifies charter reform pressure", meaning: "Large cities seek greater ability to reorganize and address local problems without special legislation." },
    { year: "1912", event: "Voters approve Article XI home rule", meaning: "The constitution authorizes qualifying cities to frame and adopt local charters." },
    { year: "1913", event: "Legislature implements home-rule procedures", meaning: "State law provides machinery for charter commissions, elections and local charter government." },
    { year: "20th century", event: "Council-manager charters spread", meaning: "Many home-rule cities use charters to separate elected policy leadership from professional administration." },
    { year: "1987", event: "Local Government Code consolidates municipal statutes", meaning: "Modern codification organizes definitions and powers for general-law and home-rule municipalities." },
    { year: "2023", event: "Regulatory Consistency Act expands preemption debate", meaning: "HB 2127 adds statutory limits across specified regulatory fields while preserving other local authority." },
    { year: "Today", event: "City type remains the first municipal-law question", meaning: "Officials and courts still begin many disputes by identifying the municipality's legal category and charter." },
  ],
  sections: [
    { heading: "1. General-law cities are creatures of the state's municipal statutes", paragraphs: [
      "Texas general-law municipalities are organized under state law rather than a locally drafted home-rule charter. The Local Government Code recognizes Types A, B and C, each with statutory rules governing matters such as the governing body and municipal officers. The categories reflect historical stages of municipal organization, but they remain legally important because officials cannot simply invent a different structure when the statute prescribes how that type of municipality must operate.",
      "The core legal principle is delegated authority. A general-law municipality looks to the constitution and Legislature for the power to act. If state law has not authorized the city to exercise a particular governmental power, a claim of broad local self-government ordinarily does not supply the missing authority. That makes statutory interpretation especially important for smaller cities and means a general-law council may have less flexibility than residents expect when comparing it with a large home-rule city." ] },
    { heading: "2. Home rule reversed the presumption for qualifying cities", paragraphs: [
      "The 1912 amendment to Article XI responded to urban frustration with legislative control. It allowed cities above the constitutional threshold to frame, adopt and amend their own charters, subject to the constitution and general laws. A charter functions as the city's local governing document, addressing organization, elections, executive and legislative responsibilities, administrative structure and other municipal matters permitted by law.",
      "Local Government Code Section 51.072 states that a home-rule municipality has full power of local self-government. In practice, that means lawyers often ask whether state law has prohibited the local action rather than whether the Legislature granted a narrow power in the first place. This residual-power model is one of the sharpest institutional differences between Texas cities and counties, because counties generally remain limited to powers the state has affirmatively delegated." ] },
    { heading: "3. The population threshold creates a choice, not an automatic conversion", paragraphs: [
      "Crossing the constitutional population threshold does not automatically transform a general-law city into a home-rule municipality. The community must follow charter procedures and voters must approve the proposed charter. Until that happens, the city continues operating under its existing legal framework. The Secretary of State and Texas Municipal League both emphasize the need to determine a municipality's actual status rather than assuming population alone answers the question.",
      "This matters in fast-growing suburbs. Population can change quickly, but governmental structure changes through law and elections. A newly eligible city may decide whether greater charter flexibility justifies the complexity of drafting, adopting and maintaining a home-rule charter. Once adopted, the charter becomes an important local source that residents must read alongside the Local Government Code and other state statutes." ] },
    { heading: "4. Home rule is broad, but state preemption is the controlling limit", paragraphs: [
      "The Texas Constitution itself makes home-rule charters subject to the constitution and general laws enacted by the Legislature. State law can therefore preempt local ordinances. Some preemption is express: a statute directly says a city may not regulate a subject. Other disputes ask whether the Legislature has occupied a field or created a state scheme inconsistent with the local rule. Courts apply Texas municipal-law doctrine to determine whether a home-rule ordinance survives.",
      "The Legislature has increasingly used preemption in politically contested areas. The 2023 Texas Regulatory Consistency Act, HB 2127, created a major modern framework across specified code fields. KeepTXRed maintains a separate policy tracker for that changing legal landscape. This authority page instead supplies the durable institutional background: home rule never meant sovereignty independent of Texas; it means local self-government within a state constitutional system where the Legislature retains substantial power." ] },
    { heading: "5. Voters should identify city type before judging claims about local power", paragraphs: [
      "Municipal political disputes often begin with a claim that 'the city can' or 'the city cannot' do something. That phrasing is incomplete. The answer may depend on whether the city is home rule or general law, the wording of a local charter, the particular statutory grant or limitation, and whether state or federal law occupies the subject. The same policy may be legally available to one municipality but not another because their governing sources differ.",
      "For accountability, the first documents to check are the city charter if one exists, the Local Government Code, the ordinance or resolution at issue, and any state statute cited as a limitation. Election results then determine the councilmembers and mayor operating inside that framework. Understanding the category prevents voters from assigning blame or credit to officials for powers they may not legally possess." ] },
  ],
  sources: [
    { href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.11.htm", label: "Texas Constitution, Article XI" },
    { href: "https://statutes.capitol.texas.gov/Docs/LG/htm/LG.5.htm", label: "Texas Local Government Code, Chapter 5" },
    { href: "https://statutes.capitol.texas.gov/Docs/LG/htm/LG.51.htm", label: "Texas Local Government Code, Chapter 51" },
    { href: "https://www.tshaonline.org/handbook/entries/home-rule-charters", label: "Handbook of Texas: Home Rule Charters" },
    { href: "https://www.tml.org/DocumentCenter/View/5614/2025-Handbook-for-Mayors-and-Councilmembers-pdf-FINAL", label: "Texas Municipal League municipal handbook" },
  ],
  relatedLinks: [
    { href: "/texas-government/texas-municipal-government-history", label: "Texas municipal government history", description: "The broader development of incorporated cities and municipal authority." },
    { href: PREEMPTION_TRACKER, label: "State-local preemption tracker", description: "Follow current statutory and court changes affecting local regulatory power." },
    { href: LOCAL_HANDBOOK, label: "Texas local government handbook", description: "Practical comparison of cities, counties, schools and special districts." },
    { href: "/texas-government/mayor-city-council-history", label: "Mayor and city council authority", description: "How elected municipal leadership differs across city forms." },
    { href: ELECTION_CENTRAL, label: "2026 Election Central", description: "Current Texas elections and voter resources." },
  ],
  faqs: [
    { question: "What makes a Texas city home rule?", answer: "A home-rule city operates under a municipal charter adopted or amended under Article XI, Section 5 of the Texas Constitution." },
    { question: "Does a city become home rule automatically when it grows?", answer: "No. Eligibility does not itself create home-rule status. A qualifying city must adopt a charter through the legally required local process and voter approval." },
    { question: "Which type of city has broader residual authority?", answer: "Home-rule cities generally possess broader local self-government subject to state and federal limits. General-law municipalities depend more directly on powers granted by state law." },
  ],
};

export const TEXAS_MAYOR_CITY_COUNCIL_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "mayor-city-council-history",
  title: "Texas Mayors and City Councils: History, Powers and Accountability",
  seoTitle: "Texas Mayor and City Council Powers: History and Government Structure | KeepTXRed",
  description: "A source-backed guide to Texas mayors and city councils, including mayor-council and council-manager government, ordinances, budgets, appointments and charter differences.",
  eyebrow: "Texas mayor and city council authority",
  intro: "There is no single statewide job description for a Texas mayor. The mayor of a general-law municipality operates under statutory rules, while the mayor of a home-rule city exercises powers defined by the city's charter and state law. Some mayors have substantial executive responsibilities; others primarily preside over a council while a city manager administers daily operations. City councils are similarly shaped by municipal type and charter, yet they remain the central elected bodies for ordinances, budgets, taxation, local services and many appointments.",
  shortAnswer: "Texas municipal power is usually exercised collectively by a governing body rather than by a mayor acting alone. General-law statutes prescribe council structures and mayoral duties for different city types. Home-rule charters can design mayor-council or council-manager systems and allocate appointment, veto, administrative and agenda powers differently. Councils typically adopt ordinances and budgets, authorize taxes and debt within law, approve contracts and establish policy. A mayor may vote, veto, appoint or direct departments only to the extent applicable law and the charter provide. Voters therefore need to know their own city's type and charter before comparing the mayor with another Texas mayor.",
  reviewed: REVIEWED,
  timeline: [
    { year: "Republic era", event: "Incorporated towns use mayors and aldermen", meaning: "Early charters create local elected governing bodies under Republic legislation." },
    { year: "19th century", event: "Mayor-alderman forms become common", meaning: "Legislative charters and general laws establish familiar municipal governing structures." },
    { year: "1901", event: "Galveston commission reform challenges the traditional model", meaning: "Commission government temporarily offers a different allocation of elected administrative power." },
    { year: "1912–1913", event: "Home rule permits charter-designed government", meaning: "Qualifying cities gain more control over the structure and powers of mayors and councils." },
    { year: "20th century", event: "Council-manager government spreads", meaning: "Many cities separate elected policymaking from professional administration." },
    { year: "1960s onward", event: "Representation lawsuits reshape council districts", meaning: "Voting-rights and equal-population principles influence at-large and single-member council systems." },
    { year: "Modern era", event: "Open-government rules formalize council action", meaning: "Posted agendas and public meetings make collective council decisions visible and legally structured." },
    { year: "Today", event: "Charter differences remain decisive", meaning: "Mayoral authority varies significantly among Texas cities despite similar titles." },
  ],
  sections: [
    { heading: "1. Texas mayors developed through local charters and general municipal law", paragraphs: [
      "Early Texas city charters frequently used a mayor and board of aldermen as the governing structure. Because charters came from the Republic Congress and later the Legislature, local executive and legislative authority depended on the language of those acts. General incorporation statutes later standardized municipal forms for communities operating under state law, while home rule ultimately allowed qualifying cities to draft their own charter structures.",
      "The result is historical diversity rather than one statewide mayoral model. The title 'mayor' can describe a presiding officer with limited independent administrative power, an official with veto or appointment powers, or a stronger executive depending on city type and charter. A useful comparison therefore begins with legal authority, not political visibility. The most prominent person at city hall is not necessarily empowered to act without the council." ] },
    { heading: "2. The city council is ordinarily the core municipal lawmaking body", paragraphs: [
      "Councils adopt ordinances, approve budgets, levy municipal taxes within state limits, authorize contracts, set policy and make appointments where law assigns that responsibility. Because municipal action is collective, council votes are the formal mechanism for many decisions that news coverage casually attributes to 'the mayor' or 'the city.' The governing body must act through legally authorized procedures, posted meetings and recorded votes rather than private executive direction.",
      "General-law cities receive their governing-body structure largely from the Local Government Code. Home-rule cities can use charters to establish council size, district or at-large seats, terms, mayoral voting rules and administrative relationships, subject to constitutional and statutory constraints. These design choices shape coalition politics because a mayor may need a council majority for budgets, ordinances, appointments or policy even when elected citywide." ] },
    { heading: "3. Mayor-council and council-manager systems divide administration differently", paragraphs: [
      "In a mayor-council system, the charter may place greater administrative responsibility in the elected mayor, though the actual scope varies widely. In a council-manager system, the elected governing body hires a professional city manager to administer municipal operations. The council retains political accountability for policy, budget and the manager's continued service, while the manager supervises day-to-day administration to the extent authorized by charter and ordinance.",
      "This distinction is one reason municipal scandals or service failures can produce confusion about responsibility. A mayor may have little authority to fire a department head directly if the manager controls personnel. Conversely, a strong-mayor charter may assign substantial executive functions to the mayor. Voters should identify who possesses appointment, removal, procurement and departmental authority before concluding which official legally controlled the disputed decision." ] },
    { heading: "4. Council representation became a major voting-rights issue", paragraphs: [
      "Municipal governing bodies may use at-large seats, single-member districts or combinations allowed by law and charter. During the twentieth century, equal-population doctrine and federal voting-rights litigation increasingly shaped how local districts and election systems were evaluated. The structure of a council can affect whether geographically concentrated communities can elect candidates of choice and how citywide coalitions form.",
      "Texas city politics therefore links institutional design with civil-rights history. Charter amendments and court orders can change district boundaries, methods of election and the balance between citywide and district representation. These questions belong beside municipal-government history because the identity of the governing body depends not only on what powers a council has, but also on how residents choose its members." ] },
    { heading: "5. Accountability requires matching the decision to the correct municipal actor", paragraphs: [
      "For practical civic analysis, start with the city charter or general-law classification, then identify the governing body's rules. Ask whether the action required an ordinance, resolution, budget vote, appointment, administrative directive or election. The answer determines whether responsibility lies with the full council, the mayor, the city manager, a municipal department or some combination. State law can further constrain all of them through preemption, procurement, finance and open-government requirements.",
      "KeepTXRed's municipal cluster is designed to make those distinctions visible. The municipal-government history guide explains how city institutions developed; the city-manager guide explains professional administration; the election guide covers representation; and the state-local preemption tracker follows current restrictions imposed from Austin. Together they give voters a legal map for assessing local political claims rather than relying on titles alone." ] },
  ],
  sources: [
    { href: "https://statutes.capitol.texas.gov/Docs/LG/htm/LG.22.htm", label: "Texas Local Government Code, Chapter 22" },
    { href: "https://statutes.capitol.texas.gov/Docs/LG/htm/LG.23.htm", label: "Texas Local Government Code, Chapter 23" },
    { href: "https://statutes.capitol.texas.gov/Docs/LG/htm/LG.24.htm", label: "Texas Local Government Code, Chapter 24" },
    { href: "https://www.tshaonline.org/handbook/entries/city-government", label: "Handbook of Texas: City Government" },
    { href: "https://www.tml.org/DocumentCenter/View/5614/2025-Handbook-for-Mayors-and-Councilmembers-pdf-FINAL", label: "Texas Municipal League: Handbook for Mayors and Councilmembers" },
  ],
  relatedLinks: [
    { href: "/texas-government/texas-municipal-government-history", label: "Texas municipal government history", description: "How cities, charters and municipal authority developed." },
    { href: "/texas-government/city-manager-government-history", label: "Texas city manager government", description: "How professional administration fits beneath elected councils." },
    { href: "/texas-government/municipal-elections-representation-history", label: "Municipal elections and representation", description: "How city governing bodies are elected and districts are structured." },
    { href: LOCAL_HANDBOOK, label: "Texas local government handbook", description: "Current practical local-government authority." },
    { href: ELECTION_CENTRAL, label: "2026 Election Central", description: "Current elections and voter information." },
  ],
  faqs: [
    { question: "Do all Texas mayors have the same powers?", answer: "No. Powers vary by municipal type, charter and state law. Some mayors have significant executive authority while others primarily preside over a council." },
    { question: "Who passes a city ordinance in Texas?", answer: "Municipal ordinances are generally adopted by the city's governing body through the procedures applicable to that municipality." },
    { question: "Can a Texas mayor fire the city manager alone?", answer: "That depends on the city's charter and governing structure. In many council-manager cities, the manager is appointed by and serves at the will of the governing body rather than the mayor acting alone." },
  ],
};

export const TEXAS_CITY_MANAGER_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "city-manager-government-history",
  title: "Texas City Manager Government: History and Administrative Power",
  seoTitle: "Texas City Manager Government: History, Powers and Council-Manager Structure | KeepTXRed",
  description: "How council-manager government developed in Texas, what city managers administer, how councils appoint them and why the system separates politics from daily operations.",
  eyebrow: "Texas council-manager government",
  intro: "The city manager is one of the most powerful local officials many Texas voters never elect. In council-manager government, residents elect the council and mayor, while the governing body appoints a professional manager to administer municipal business. Texas became an important home for the council-manager movement as twentieth-century reformers sought to separate policymaking from daily administration. State law expressly authorizes a city-manager form for certain general-law municipalities, while home-rule charters can define their own council-manager systems within state limits.",
  shortAnswer: "A Texas city manager is generally an appointed administrator rather than an independently elected political executive. Local Government Code Chapter 25 provides a city-manager form for eligible general-law municipalities and states that the manager is appointed by and serves at the will of the governing body. The manager administers municipal business and may receive additional duties by ordinance. Home-rule cities frequently establish council-manager systems by charter, with details that vary locally. The elected council still sets policy, adopts budgets and holds democratic authority; the manager carries out administration, supervises staff as authorized and can usually be removed by the governing body under the applicable charter or law.",
  reviewed: REVIEWED,
  timeline: [
    { year: "Progressive Era", event: "Professional administration becomes a reform goal", meaning: "Municipal reformers seek to reduce patronage and separate elected policy from technical management." },
    { year: "Early 1900s", event: "Commission government spreads after Galveston", meaning: "Texas urban reform experiments help set the stage for later professional-manager systems." },
    { year: "1912–1913", event: "Home rule creates structural flexibility", meaning: "Charter cities gain power to design council-manager government subject to state law." },
    { year: "1920s–1950s", event: "Council-manager systems expand", meaning: "Growing cities increasingly employ professional administrators for complex municipal services." },
    { year: "1987", event: "Chapter 25 is codified", meaning: "The Local Government Code consolidates statutory city-manager provisions for general-law municipalities." },
    { year: "Late 20th century", event: "Professional municipal administration becomes routine", meaning: "Managers oversee larger workforces, utilities, capital programs and service systems." },
    { year: "Modern era", event: "Charters refine manager-council relationships", meaning: "Home-rule cities specify appointment, removal and administrative duties in local governing documents." },
    { year: "Today", event: "Managers remain accountable through elected councils", meaning: "Administrative authority is substantial but ultimately rests on law, charter, budget and governing-body oversight." },
  ],
  sections: [
    { heading: "1. Council-manager government emerged from municipal reform", paragraphs: [
      "American cities in the Progressive Era confronted corruption, patronage, infrastructure demands and increasingly technical public services. Reformers argued that elected councils should set policy while trained administrators managed personnel, procurement, utilities, budgeting and operations. Texas had already attracted national attention for Galveston's commission government after the 1900 hurricane, but the council-manager model offered a different separation between elected representation and professional management.",
      "Home rule made this model easier to adopt because qualifying cities could write local charters establishing a manager and defining the relationship among council, mayor and administration. The system spread widely among Texas home-rule municipalities. Its popularity reflected practical growth: water systems, streets, police, fire, planning, finance and public works required continuous administration beyond what part-time or politically rotating councilmembers could personally supervise." ] },
    { heading: "2. State law also provides a city-manager path for general-law municipalities", paragraphs: [
      "Local Government Code Chapter 25 allows certain general-law municipalities to adopt the city-manager form through prescribed procedures. The statute provides that the manager is appointed by and serves at the will of the governing body. It directs the manager to administer municipal business and permits the governing body by ordinance to delegate additional powers and duties considered proper for efficient administration.",
      "That statutory model reinforces an important accountability principle: the manager's authority comes from the governing body and law, not from an independent electoral mandate. Residents do not ordinarily vote directly for the manager. They vote for the mayor and councilmembers who establish policy, approve the budget and decide whether the manager should continue to serve. Administrative influence can be considerable, but it is structurally derivative rather than sovereign." ] },
    { heading: "3. The manager often controls operations while the council controls policy and money", paragraphs: [
      "In a typical council-manager city, the manager prepares or administers the budget, supervises departments, coordinates services, recommends policy options and carries out council decisions. The council adopts ordinances, approves the final budget, authorizes taxes and major contracts, and establishes broad policy. The mayor may have important ceremonial, agenda or leadership responsibilities without becoming the direct supervisor of every department.",
      "This division is designed to create administrative continuity across election cycles. Department heads can report through a professional chain of command while councilmembers focus on representative choices. Yet the line between policy and administration is not always clean. Budget recommendations, hiring choices and implementation strategy can shape policy outcomes, which is why manager performance and council oversight remain politically significant even when the manager does not appear on the ballot." ] },
    { heading: "4. Home-rule charters matter because manager powers are not uniform statewide", paragraphs: [
      "A charter may define who appoints department directors, who prepares the budget, whether the mayor has special appointment powers, how the manager may be removed and which officials are outside the manager's supervision. Two Texas council-manager cities can therefore use the same label while distributing authority differently. State laws governing procurement, finance, civil service, police and fire, open meetings and other subjects can further affect the administrative chain.",
      "For voters, the charter is essential. News reports may say that a mayor 'runs' a city, but in a council-manager system the mayor may lack unilateral authority over staffing or daily operations. Conversely, criticism directed only at an unelected manager may ignore that the elected council adopted the policy or budget being implemented. Accurate local accountability requires matching each decision to its legal source." ] },
    { heading: "5. The model deliberately makes municipal elections indirect control over administration", paragraphs: [
      "Council-manager government creates a two-step democratic relationship. Residents elect the governing body; the governing body selects and supervises the manager. That arrangement can insulate technical administration from campaign cycles, but it also means voters must evaluate councilmembers partly on how they oversee an appointed executive. Contract terms, performance reviews, budget priorities and removal decisions become key indicators of that oversight.",
      "KeepTXRed's municipal authority system connects those questions to the broader city structure. The mayor-and-council guide explains elected authority, the home-rule guide explains charter power, and Election Central tracks the officials voters can directly replace. The distinction is useful whenever a city controversy raises the question of who actually had authority to make an administrative decision." ] },
  ],
  sources: [
    { href: "https://statutes.capitol.texas.gov/Docs/LG/htm/LG.25.htm", label: "Texas Local Government Code, Chapter 25" },
    { href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.11.htm", label: "Texas Constitution, Article XI" },
    { href: "https://www.tshaonline.org/handbook/entries/city-government", label: "Handbook of Texas: City Government" },
    { href: "https://www.tshaonline.org/handbook/entries/home-rule-charters", label: "Handbook of Texas: Home Rule Charters" },
    { href: "https://www.tml.org/DocumentCenter/View/5614/2025-Handbook-for-Mayors-and-Councilmembers-pdf-FINAL", label: "Texas Municipal League municipal handbook" },
  ],
  relatedLinks: [
    { href: "/texas-government/mayor-city-council-history", label: "Mayor and city council authority", description: "The elected side of municipal policymaking and oversight." },
    { href: "/texas-government/home-rule-general-law-cities-history", label: "Home-rule vs. general-law cities", description: "The legal frameworks that determine municipal structure." },
    { href: "/texas-government/texas-municipal-government-history", label: "Texas municipal government history", description: "The development of incorporated city authority." },
    { href: LOCAL_HANDBOOK, label: "Texas local government handbook", description: "A practical guide to local-government institutions." },
    { href: ELECTION_CENTRAL, label: "2026 Election Central", description: "Elections for the officials who supervise municipal administration." },
  ],
  faqs: [
    { question: "Are Texas city managers elected?", answer: "Usually no. In council-manager systems the manager is appointed by the governing body under the applicable charter or statute." },
    { question: "Who can remove a Texas city manager?", answer: "The applicable charter or statute controls. Under the Chapter 25 general-law model, the manager serves at the will of the governing body." },
    { question: "Does a city manager replace the mayor?", answer: "No. The manager administers municipal business while the elected mayor and council retain the political and policy roles assigned by law and charter." },
  ],
};

export const TEXAS_MUNICIPAL_COURTS_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "texas-municipal-courts-history",
  title: "History of Texas Municipal Courts",
  seoTitle: "Texas Municipal Courts History: City Judges, Ordinances and Fine-Only Cases | KeepTXRed",
  description: "A source-backed history of Texas municipal courts, their city-government role, ordinance jurisdiction, fine-only state cases, judges and modern court-of-record systems.",
  eyebrow: "Texas municipal court history",
  intro: "Municipal courts sit at the intersection of city government and the Texas judiciary. They are local courts created under state law, but they operate for municipalities and handle the kinds of cases residents most often encounter through city ordinances, traffic enforcement and fine-only offenses. Their role changed as Texas cities grew from chartered nineteenth-century towns into modern governments with extensive codes and public-safety responsibilities. Today Government Code Chapter 29 provides the general statutory framework, while some municipalities operate municipal courts of record under additional law.",
  shortAnswer: "Texas municipal courts are part of the state judicial system even though municipalities fund and operate them. Government Code Chapter 29 gives municipal courts jurisdiction over municipal ordinance violations and concurrent jurisdiction with justice courts over specified fine-only state-law offenses arising within the municipality, along with other authority provided by law. Municipal judges are selected according to statutes or city charters, so appointment and election arrangements can vary. Cities may also establish municipal courts of record when authorized, creating formal records that affect appellate procedure. These courts are not general felony or major civil trial courts; their jurisdiction is limited by state law.",
  reviewed: REVIEWED,
  timeline: [
    { year: "19th century", event: "City charters provide local police and ordinance adjudication", meaning: "Growing municipalities need local forums to enforce corporate rules and minor offenses." },
    { year: "1876", event: "State constitution preserves legislatively created inferior courts", meaning: "Texas judicial structure leaves room for local courts established under state authority." },
    { year: "20th century", event: "Traffic and ordinance caseloads expand", meaning: "Automobile growth and larger municipal codes make city courts a routine public institution." },
    { year: "1960s–1980s", event: "Court administration becomes more professional", meaning: "Procedural rules, judicial education and standardized state law increasingly shape municipal practice." },
    { year: "1985", event: "Government Code codification consolidates court statutes", meaning: "State law organizes municipal-court jurisdiction within the modern Government Code." },
    { year: "Late 20th century", event: "Municipal courts of record expand", meaning: "Authorized cities establish courts that preserve formal records for appeals." },
    { year: "Modern era", event: "Due-process and indigency rules receive greater attention", meaning: "State law and judicial guidance increasingly focus on lawful fine, fee and enforcement practices." },
    { year: "Today", event: "Municipal courts remain the judiciary's most local public face", meaning: "Millions of residents encounter Texas courts through city-level traffic and ordinance cases." },
  ],
  sections: [
    { heading: "1. Municipal courts grew from the practical need to enforce city law", paragraphs: [
      "Incorporated cities need a mechanism to enforce ordinances. Early Texas charters commonly gave local officials authority over public order, streets, markets and other urban concerns, and local adjudication developed alongside those regulatory powers. As municipal codes became more detailed, city courts provided a specialized forum for violations that did not belong in the state's higher trial courts.",
      "The modern municipal court is therefore both local and statewide in character. The city supplies facilities, staff and funding, but jurisdiction comes from Texas law. A city council cannot simply expand a municipal judge's subject-matter jurisdiction by ordinance. The Legislature determines what kinds of cases the court may hear, while court procedures are also governed by statewide constitutional, statutory and judicial rules." ] },
    { heading: "2. Government Code Chapter 29 defines the basic jurisdiction", paragraphs: [
      "Chapter 29 provides general jurisdiction over criminal cases arising under municipal ordinances and over specified fine-only state-law offenses within municipal territory, concurrently with justice courts. State law also assigns particular civil or enforcement authority in defined circumstances. This limited jurisdiction distinguishes municipal courts from district courts, county-level courts and the state's appellate courts.",
      "The jurisdictional boundary is important politically because municipal enforcement choices can affect residents without giving city officials unlimited criminal-law power. The Legislature defines penalties and procedural rules, and state-law offenses remain state law even when prosecuted in a municipal court. Local ordinances likewise remain subject to constitutional and statutory limits, including preemption rules that can invalidate the underlying municipal regulation." ] },
    { heading: "3. Municipal judges are local officials operating within a state judicial framework", paragraphs: [
      "Selection methods vary. General-law statutes and home-rule charters can determine whether municipal judges are appointed or elected and how long they serve, subject to applicable state requirements. The method matters because judicial independence and city political accountability can intersect when a governing body controls appointment or reappointment. Yet a municipal judge deciding cases exercises judicial duties rather than acting as a councilmember or department administrator.",
      "This dual character makes municipal courts a useful example of Texas local-state overlap. The municipality budgets the court, but judicial decisions cannot lawfully be dictated by city revenue goals or political preferences. State appellate review, judicial-conduct rules, criminal procedure and constitutional due process constrain the system. Court administration is local; judicial authority belongs to the broader Texas legal order." ] },
    { heading: "4. Courts of record changed the way some municipal appeals work", paragraphs: [
      "Some Texas municipalities operate municipal courts of record under statutes authorizing that structure. A court of record preserves a formal record of proceedings, which changes the appellate path compared with traditional non-record municipal courts where appeals may involve a trial de novo in a higher local court. The exact procedures depend on the statute applicable to the municipality and statewide court rules.",
      "The distinction is easy to miss because two city courthouses may look similar to residents. One may operate a court of record and another may not. The difference can affect transcripts, appellate review and litigation strategy. That is why statewide generalizations about a 'municipal court appeal' should be checked against the type of court and the law creating it." ] },
    { heading: "5. Modern debates focus on lawful enforcement, access and municipal accountability", paragraphs: [
      "Municipal courts handle high-volume, lower-level cases, making administrative practices consequential. Fines, payment plans, warrants, ability-to-pay procedures, compliance dismissals and defensive-driving options can affect large numbers of residents. State lawmakers and judicial agencies have repeatedly revised rules governing those processes, especially where poverty and nonpayment raise due-process concerns.",
      "For civic accountability, residents should separate three actors: the Legislature defines jurisdiction and statewide rules; the municipality funds the court and adopts lawful ordinances; and the judge decides cases. KeepTXRed links municipal court history to the city-government and preemption guides so readers can distinguish the validity of an ordinance, the politics of enforcement policy and the independent adjudication of an individual case." ] },
  ],
  sources: [
    { href: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.29.htm", label: "Texas Government Code, Chapter 29" },
    { href: "https://statutes.capitol.texas.gov/Docs/CR/htm/CR.4.htm", label: "Texas Code of Criminal Procedure, Chapter 4" },
    { href: "https://www.txcourts.gov/about-texas-courts/trial-courts/", label: "Texas Judicial Branch: Trial Courts" },
    { href: "https://www.txcourts.gov/publications-training/training-materials/", label: "Texas Judicial Branch: Publications and Training" },
    { href: "https://www.tml.org/DocumentCenter/View/5614/2025-Handbook-for-Mayors-and-Councilmembers-pdf-FINAL", label: "Texas Municipal League municipal handbook" },
  ],
  relatedLinks: [
    { href: "/texas-government/texas-municipal-government-history", label: "Texas municipal government history", description: "How city institutions and ordinance authority developed." },
    { href: "/texas-government/texas-judicial-selection-history", label: "Texas judicial selection history", description: "How Texas selects judges across the broader court system." },
    { href: "/texas-courts", label: "Texas courts authority hub", description: "Current judicial structure and court resources." },
    { href: LOCAL_HANDBOOK, label: "Texas local government handbook", description: "Practical municipal and county authority." },
    { href: ELECTION_CENTRAL, label: "2026 Election Central", description: "Current elections for Texas public offices." },
  ],
  faqs: [
    { question: "Are Texas municipal courts part of the state judiciary?", answer: "Yes. They are local courts funded and operated by municipalities, but their jurisdiction and judicial authority are created and limited by Texas law." },
    { question: "Do municipal courts hear felonies?", answer: "No. Their ordinary jurisdiction centers on municipal ordinance violations and specified fine-only state-law offenses, plus other limited authority granted by statute." },
    { question: "Are all municipal judges elected?", answer: "No. Selection methods vary according to applicable statutes and municipal charters." },
  ],
};

export const TEXAS_SPECIAL_DISTRICTS_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "texas-special-district-government-history",
  title: "Texas Special District Government: History, Power and Accountability",
  seoTitle: "Texas Special Districts: History, Powers, Taxes and Local Accountability | KeepTXRed",
  description: "A source-backed guide to Texas special districts, including water and utility districts, constitutional authority, elected boards, taxes, bonds and local accountability.",
  eyebrow: "Texas special district government",
  intro: "Not every important local government in Texas is a city or county. The state relies heavily on special-purpose political subdivisions to provide water, sewer, drainage, flood control, hospitals, emergency services and other defined functions. Their growth reflects Texas geography, rapid suburban development and the constitutional limits placed on ordinary local governments. A special district can have an elected or appointed board, issue debt, levy taxes or assessments when authorized, own infrastructure and exercise powers supplied by the constitution and Legislature. Because their names are less familiar than city councils, they can be politically powerful while receiving less voter attention.",
  shortAnswer: "Texas special districts are governmental entities created or authorized for limited purposes rather than general local government. Their powers depend on the constitutional provision, statute, local law or creation order governing the district. Water Code districts such as municipal utility districts can finance and operate infrastructure and may levy taxes or issue bonds when law and voter approval require. Other districts address hospitals, emergency services, drainage, navigation, groundwater and more. Boards may be elected, appointed or use structures defined by the enabling law. Special districts are separate from cities and counties even when their boundaries overlap, so residents may pay taxes to several local governments with distinct elected boards and legal responsibilities.",
  reviewed: REVIEWED,
  timeline: [
    { year: "19th century", event: "Special local authorities appear for infrastructure", meaning: "Texas uses targeted public bodies where ordinary local structures cannot easily finance regional projects." },
    { year: "1904", event: "Constitutional conservation amendment expands district tools", meaning: "Article XVI, Section 59 becomes a major foundation for conservation and reclamation districts." },
    { year: "Early 20th century", event: "Water, navigation and drainage districts grow", meaning: "Regional infrastructure needs drive specialized political subdivisions." },
    { year: "Post-World War II", event: "Suburban growth increases utility-district use", meaning: "District financing helps extend water and sewer infrastructure beyond existing city systems." },
    { year: "1970s–1980s", event: "Modern Water Code framework develops", meaning: "Statutes consolidate and refine district creation, bonding, taxation and operational powers." },
    { year: "Late 20th century", event: "Emergency, hospital and other district forms expand", meaning: "The special-district model becomes a common tool for specialized local services." },
    { year: "21st century", event: "Rapid metro development increases district visibility", meaning: "New subdivisions frequently sit inside overlapping utility and service district boundaries." },
    { year: "Today", event: "Special districts form a major layer of Texas local government", meaning: "Residents may vote on boards, bonds and taxes outside ordinary city and county elections." },
  ],
  sections: [
    { heading: "1. Special districts solve problems that do not fit ordinary political boundaries", paragraphs: [
      "Texas cities and counties have fixed legal powers and geographic limits, while infrastructure systems often cross those lines. Water supply, drainage, flood control, navigation and emergency services may require a financing and governance structure tailored to a specific service area. The Legislature and Texas Constitution therefore authorize special districts that can focus on one or several defined public purposes without becoming a full city or county government.",
      "The model is especially important in fast-growing unincorporated areas. A developer or community may need water, sewer and drainage infrastructure before annexation into a city or extension of city utilities. A municipal utility district can provide a governmental financing mechanism under the Water Code, subject to creation procedures, regulatory oversight, elections and debt rules. The district remains a separate political subdivision even if later urban development surrounds it." ] },
    { heading: "2. Constitutional authority is central to the Texas district system", paragraphs: [
      "Article XVI, Section 59 of the Texas Constitution is a major source of authority for conservation and reclamation districts. It declares conservation and development of natural resources to be public rights and duties and authorizes governmental agencies for those purposes. Other constitutional provisions and statutes support different district categories. The Legislature then supplies detailed powers, creation procedures, board structures, taxes, bonds and oversight.",
      "This constitutional foundation matters because a special district cannot simply claim the general powers of a city. Its authority is purpose-specific. A drainage district, hospital district or emergency services district must trace its actions to the law governing that type of entity. The narrow mission can make accountability clearer on paper, but overlapping districts can make the overall local-government map more complicated for residents." ] },
    { heading: "3. Taxes and bonds make district governance politically consequential", paragraphs: [
      "Many special districts can levy property taxes, assessments or fees and issue bonds when their enabling law permits and required elections or approvals occur. Those financing powers allow major capital projects to be paid over time by the properties benefiting from infrastructure. They also create long-lived fiscal obligations that can remain after the original development decisions are forgotten.",
      "Voters evaluating a district should therefore examine outstanding debt, tax rates, service contracts, capital plans and the authority under which new bonds are proposed. A low-profile board election can influence significant public spending. Because district boundaries may not match a city's limits or familiar neighborhood lines, property owners should identify every political subdivision appearing on tax statements rather than assuming city and county taxes describe the full local burden." ] },
    { heading: "4. Board selection varies by district type and stage of development", paragraphs: [
      "Some district boards are elected by residents or qualified voters; others are appointed by cities, counties, state officials or other entities under the applicable statute. Newly created development districts can also have transitional governance structures before a larger resident population exists. The governing law determines eligibility, terms, vacancies and election procedures.",
      "That variety creates a civic-information challenge. Residents may know their mayor and county judge but not the board overseeing water rates, drainage projects or emergency-service taxes. Transparency laws, meeting notices, election materials, audited financial reports and regulatory filings are therefore important accountability tools. A special district is still government even when its administrative footprint is small or its election appears on a low-turnout local ballot." ] },
    { heading: "5. Special districts should be read as part of the broader state-local power system", paragraphs: [
      "Districts exist because Texas law creates them and defines their authority. They may coordinate or contract with cities and counties, but they are not subordinate departments of those governments unless the governing statute makes them so. Annexation, consolidation, dissolution, service agreements and overlapping jurisdiction can create complicated relationships that depend on the particular type of district.",
      "KeepTXRed treats special districts as civic institutions rather than generic development topics. The local-government handbook explains where they fit alongside cities and counties, while this history guide explains why Texas relies on them and why their tax and bond powers deserve voter attention. Election Central provides the larger voting context for local ballots and bond elections." ] },
  ],
  sources: [
    { href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.16.htm", label: "Texas Constitution, Article XVI" },
    { href: "https://statutes.capitol.texas.gov/Docs/WA/htm/WA.54.htm", label: "Texas Water Code, Chapter 54" },
    { href: "https://statutes.capitol.texas.gov/Docs/SDocs/WATERCODE.pdf", label: "Texas Water Code" },
    { href: "https://www.tshaonline.org/handbook/entries/water-districts", label: "Handbook of Texas: Water Districts" },
    { href: "https://www.tml.org/DocumentCenter/View/5614/2025-Handbook-for-Mayors-and-Councilmembers-pdf-FINAL", label: "Texas Municipal League municipal handbook" },
  ],
  relatedLinks: [
    { href: LOCAL_HANDBOOK, label: "Texas local government handbook", description: "How special districts fit beside cities, counties and school districts." },
    { href: "/texas-government/texas-municipal-government-history", label: "Texas municipal government history", description: "The general-purpose city government layer." },
    { href: "/texas-government/texas-county-government-history", label: "Texas county government history", description: "The county layer that often overlaps district boundaries." },
    { href: "/property-taxes", label: "Texas property tax resources", description: "Tools and guides for understanding local property taxation." },
    { href: ELECTION_CENTRAL, label: "2026 Election Central", description: "Current Texas election information and voter resources." },
  ],
  faqs: [
    { question: "Is a Texas special district a government?", answer: "Yes. A special district is a political subdivision or governmental entity created or authorized by law for defined public purposes." },
    { question: "Can special districts levy taxes?", answer: "Many can when their governing law authorizes taxation and any required voter approval or procedures are satisfied. Powers vary by district type." },
    { question: "Are special districts controlled by city councils?", answer: "Not necessarily. They are separate entities whose board structure and relationship to cities or counties depend on the law creating or governing the district." },
  ],
};

export const TEXAS_MUNICIPAL_ELECTIONS_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "municipal-elections-representation-history",
  title: "Texas Municipal Elections and Representation: History and Voting Structure",
  seoTitle: "Texas Municipal Elections History: Mayors, Council Districts and Representation | KeepTXRed",
  description: "A source-backed history of Texas city elections, including at-large and district seats, home-rule charters, uniform election dates, vacancies and voting-rights changes.",
  eyebrow: "Texas municipal election history",
  intro: "Texas city elections are local, but the rules are shaped by state law, federal constitutional doctrine, the Voting Rights Act and—where a city is home rule—the local charter. Cities can use at-large seats, single-member districts or mixed systems when legally authorized. Terms and vacancy procedures vary. During the twentieth century, equal-population principles and voting-rights litigation made municipal representation a major civil-rights issue, particularly where at-large systems diluted the voting strength of racial or language-minority communities. Modern city elections therefore reflect both local charter choices and a larger legal history of representation.",
  shortAnswer: "Texas municipalities elect governing bodies under a combination of the Texas Election Code, Local Government Code, constitutional provisions and local charters. General-law structures are substantially defined by state statute, while home-rule charters can establish local council arrangements within legal limits. Most local elections must use uniform election dates established by state law. At-large and single-member district systems have both been common, but federal equal-protection and voting-rights law can require changes when an election method unlawfully dilutes minority voting power. Vacancies, term lengths and candidate qualifications also depend on city type, charter provisions and state law.",
  reviewed: REVIEWED,
  timeline: [
    { year: "19th century", event: "Charters define early mayor and alderman elections", meaning: "Municipal representation begins as a locally specific feature of legislative incorporation." },
    { year: "1912–1913", event: "Home rule expands charter control of representation", meaning: "Qualifying cities gain greater ability to design council structure and local election arrangements." },
    { year: "Mid-20th century", event: "At-large systems become common in many cities", meaning: "Citywide council elections are often defended as reform but later face representation challenges." },
    { year: "1960s", event: "One-person-one-vote doctrine reshapes local districts", meaning: "Constitutional equal-population principles apply to local representative bodies." },
    { year: "1965 onward", event: "Voting Rights Act affects municipal election systems", meaning: "Federal law becomes central to challenges alleging racial or language-minority vote dilution." },
    { year: "Late 20th century", event: "Single-member and mixed systems expand", meaning: "Litigation, settlements and charter reforms alter representation in many Texas cities." },
    { year: "Modern era", event: "State law standardizes election dates and procedures", meaning: "The Election Code constrains when and how cities conduct many elections." },
    { year: "Today", event: "Local charters operate inside state and federal election law", meaning: "Municipal voters choose leaders through systems that combine local design with statewide and national protections." },
  ],
  sections: [
    { heading: "1. City election systems began as features of individual charters", paragraphs: [
      "Early municipal charters set the number of aldermen, mayoral selection and other local election details because no constitutional home-rule system yet existed. Later general municipal laws standardized structures for smaller cities. Home rule then gave qualifying cities greater ability to design governing bodies through charters approved by voters, including the number of council positions, district arrangements and terms subject to state and federal law.",
      "This local flexibility means municipal ballots can differ sharply. One city may elect a mayor and all councilmembers citywide; another may use geographic districts; a third may combine district seats with at-large positions. Those choices affect campaign strategy and representation because the electorate for a seat can be the entire city or a defined portion of it." ] },
    { heading: "2. At-large elections became politically important in the civil-rights era", paragraphs: [
      "At-large systems require candidates to win support across the entire municipality. Reformers historically argued that citywide elections could reduce ward-based machines and encourage officials to consider citywide interests. Critics and civil-rights plaintiffs showed that in some demographic and voting circumstances, at-large systems could prevent geographically concentrated minority communities from electing candidates of choice even when those communities could form effective majorities in districts.",
      "Federal constitutional law and the Voting Rights Act changed the legal environment. Courts evaluating local representation increasingly examined population equality and discriminatory voting effects. Texas municipalities were among the jurisdictions where litigation, negotiated settlements and charter changes produced single-member districts or mixed systems. That history is part of Texas political development because local representation helped determine pathways for Black and Latino political leadership." ] },
    { heading: "3. State law now supplies a common procedural framework", paragraphs: [
      "The Texas Election Code governs major parts of local election administration, including uniform election dates, candidate procedures, ballots, early voting, canvassing and other mechanics. The Secretary of State publishes detailed guidance for cities, schools and other political subdivisions. Home-rule charters remain important, but they operate inside this statewide election framework.",
      "Uniform election dates illustrate the balance between local and state control. A city may choose among legally available scheduling options, yet it cannot invent an entirely separate election calendar inconsistent with state law. Similarly, state rules address candidate qualifications and vacancy procedures, while a home-rule charter may control particular details when the constitution or statutes allow local variation." ] },
    { heading: "4. Terms and vacancies can differ materially among municipalities", paragraphs: [
      "Texas law permits variation in municipal terms within constitutional and statutory limits. Some cities use two-year terms, while authorized three- or four-year arrangements create different vacancy requirements. Article XI of the Texas Constitution and Local Government Code provisions interact with local charters to determine when a governing body may appoint a replacement and when a special election is required.",
      "These rules matter whenever a mayor or councilmember resigns to run for another office, dies, is removed or otherwise leaves a vacancy. Political actors sometimes describe a replacement as a discretionary council choice when state law requires an election, or describe a special election as mandatory when a charter authorizes a temporary appointment. The correct answer requires checking term length, city type, charter language and the remaining portion of the term." ] },
    { heading: "5. Municipal election structure shapes the pipeline of Texas political leadership", paragraphs: [
      "City office is a major entry point into Texas politics. Mayors and councilmembers often move into county, legislative, congressional or statewide roles. The design of municipal districts can therefore influence which neighborhoods and communities gain governing experience and public visibility. Changes to at-large or district systems have consequences beyond city hall because they affect the recruitment and development of future political leaders.",
      "KeepTXRed connects this history to current election coverage rather than treating city elections as isolated local events. Election Central provides the current voting layer; the mayor-and-council guide explains what winners can actually do; and the home-rule guide explains how charters shape office structure. Together those pages make municipal results more meaningful than a simple list of winners." ] },
  ],
  sources: [
    { href: "https://www.sos.state.tx.us/elections/laws/local-laws.shtml", label: "Texas Secretary of State: Laws and Procedures Pertaining to Cities" },
    { href: "https://www.sos.state.tx.us/elections/laws/terms.shtml", label: "Texas Secretary of State: Terms, Qualifications and Vacancies" },
    { href: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.41.htm", label: "Texas Election Code, Chapter 41" },
    { href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.11.htm", label: "Texas Constitution, Article XI" },
    { href: "https://www.tshaonline.org/handbook/entries/city-government", label: "Handbook of Texas: City Government" },
  ],
  relatedLinks: [
    { href: "/texas-government/mayor-city-council-history", label: "Mayor and city council authority", description: "What municipal election winners can do once in office." },
    { href: "/texas-government/home-rule-general-law-cities-history", label: "Home-rule vs. general-law cities", description: "Why charter status changes municipal election structure." },
    { href: "/texas-politics/voting-rights-history", label: "Texas voting-rights history", description: "The statewide civil-rights context for local representation disputes." },
    { href: LOCAL_HANDBOOK, label: "Texas local government handbook", description: "The broader practical local-government system." },
    { href: ELECTION_CENTRAL, label: "2026 Election Central", description: "Current Texas election information and voter resources." },
  ],
  faqs: [
    { question: "Do all Texas city councilmembers run citywide?", answer: "No. Cities may use at-large seats, single-member districts or mixed systems when authorized by applicable law and charter." },
    { question: "Who sets Texas municipal election dates?", answer: "State law establishes uniform election dates and procedural rules, while municipalities choose among legally available options and follow applicable charter provisions." },
    { question: "Why did some Texas cities move from at-large to district elections?", answer: "Some changes came through local charter reform, while others resulted from voting-rights litigation or settlements addressing representation and vote-dilution concerns." },
  ],
};

export const TEXAS_MUNICIPAL_FINANCE_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "municipal-finance-tax-debt-history",
  title: "Texas Municipal Finance: History of City Taxes, Budgets and Debt",
  seoTitle: "Texas Municipal Finance History: City Taxes, Budgets, Bonds and Debt | KeepTXRed",
  description: "A source-backed history of Texas city finance, including property taxes, sales taxes, budgets, general-obligation and revenue debt, bond elections and state fiscal limits.",
  eyebrow: "Texas municipal finance history",
  intro: "Municipal government becomes real through money. Texas cities may adopt ordinances and plans, but police, fire protection, streets, utilities, parks and capital projects require revenue and lawful appropriations. Over time municipal finance evolved from relatively simple property-tax and fee systems into modern budgets supported by property taxes, local-option sales taxes, utility revenue, fees, intergovernmental funds and debt. State law places substantial controls on tax rates, budget procedures, borrowing and elections, making city finance a direct example of how local self-government operates inside a statewide constitutional framework.",
  shortAnswer: "Texas municipalities finance operations through revenue sources authorized by state law, commonly including property taxes, local sales taxes where adopted, utility revenues, franchise-related revenues, fees and other receipts. Governing bodies adopt annual budgets and tax rates under statutory procedures. Cities can issue general-obligation debt backed by taxing authority and revenue debt backed by specified income streams, subject to constitutional and statutory requirements. Some debt requires voter approval; other obligations follow different legal procedures. State lawmakers have repeatedly changed property-tax, disclosure and debt rules, so municipal fiscal power is significant but not unlimited even for home-rule cities.",
  reviewed: REVIEWED,
  timeline: [
    { year: "19th century", event: "City charters authorize basic taxes and fees", meaning: "Early municipal finance depends on locally collected revenue within legislative charter limits." },
    { year: "1876", event: "Constitution restricts local taxation and debt", meaning: "The current charter imposes fiscal limits and debt requirements on political subdivisions." },
    { year: "Early 20th century", event: "Urban infrastructure increases borrowing", meaning: "Water, sewer, streets and public facilities expand municipal capital needs." },
    { year: "Mid-20th century", event: "Revenue-bond financing grows", meaning: "Utility and enterprise revenues support major projects outside ordinary operating taxes." },
    { year: "1960s–1980s", event: "Local sales taxes become important", meaning: "State-authorized local-option sales taxes diversify municipal revenue." },
    { year: "Late 20th century", event: "Professional budgeting and bond disclosure expand", meaning: "Larger cities adopt sophisticated capital planning, audits and debt-management systems." },
    { year: "2019 onward", event: "Property-tax reforms tighten state oversight", meaning: "Legislative changes alter notice, rate-setting and voter-approval mechanisms for local taxing units." },
    { year: "Today", event: "Municipal budgets combine local choice with state fiscal rules", meaning: "City councils retain major spending authority while taxes and debt remain constrained by statewide law." },
  ],
  sections: [
    { heading: "1. Municipal fiscal authority began as part of the incorporation bargain", paragraphs: [
      "Early Texas cities needed revenue to maintain streets, markets, public order and other basic services. Charters therefore included taxing and fee authority, but the power came from the Republic or Legislature. Statehood and later constitutional provisions continued to treat local taxation as a governmental power subject to statewide legal limits rather than an inherent private corporate right.",
      "That history persists. A modern home-rule city may possess broad self-government, but it cannot create any tax it wants. Taxing authority requires constitutional or statutory support. General-law municipalities are even more directly dependent on legislative authorization. The same principle applies to many fees and assessments: local fiscal innovation operates within a state-created legal menu." ] },
    { heading: "2. Property taxes remain central but are tightly procedural", paragraphs: [
      "Property taxation has long financed Texas local government. Modern city property taxes support general operations and debt service, but appraisal is generally performed through county appraisal districts rather than by the city itself. State law governs appraisal, exemptions, rate calculations, notices, hearings and voter-approval mechanisms. A city council sets its tax rate, but that vote takes place inside a detailed statewide property-tax system.",
      "This separation is politically important. Residents may blame a city for an appraisal increase even though the appraisal district determined taxable value, or blame an appraisal district for a tax bill driven by a city rate and budget. Understanding municipal finance requires separating value, exemptions, tax rates and debt service among the distinct governmental entities involved." ] },
    { heading: "3. Sales taxes and utility revenues diversified city budgets", paragraphs: [
      "As Texas urbanized, municipalities gained access to state-authorized local sales taxes and other revenue tools. Sales taxes can provide substantial general revenue, especially in commercial centers, but they vary with economic activity and statutory rate limits. Utility systems can generate revenues dedicated to water, sewer, electric or other enterprise functions, and cities may transfer lawful amounts or allocate shared costs under applicable rules.",
      "Revenue diversity affects politics. A city heavily dependent on property taxes faces different incentives from a city with a large retail base or municipally owned utility. Economic development, annexation, land use and infrastructure choices can therefore have fiscal consequences beyond immediate service demand. Yet the revenue tools remain defined by state law, preventing municipal finance from becoming a wholly independent local tax system." ] },
    { heading: "4. Debt lets current voters finance long-lived infrastructure—and obligates future budgets", paragraphs: [
      "Cities issue debt for streets, public safety facilities, utilities, parks and other capital projects. General-obligation bonds rely on the taxing power of the municipality, while revenue bonds are paid from specified revenues such as utility income. Certificates and other financing instruments can operate under separate statutory frameworks. Voter approval requirements depend on the type of obligation and applicable law.",
      "Debt makes municipal elections especially consequential because bond propositions can authorize years or decades of repayment. Voters should examine principal, estimated interest, existing debt, tax-rate effects, project life and whether the financing source matches the asset. A legally authorized bond is not automatically prudent, and opposition to a bond does not mean the underlying project lacks a public purpose. Fiscal analysis requires both legal authority and long-term budget context." ] },
    { heading: "5. State fiscal policy increasingly shapes local budget politics", paragraphs: [
      "The Legislature has repeatedly revised property-tax rate procedures, voter-approval thresholds, debt disclosures and other local finance rules. These laws reflect an ongoing state-local argument over taxpayer protection and municipal flexibility. City officials often argue that local voters should control service levels and revenue; state lawmakers may respond that uniform protections are needed because property-tax burdens cross political boundaries and local elections can have low turnout.",
      "KeepTXRed treats that debate as an institutional question as well as a policy fight. The home-rule guide explains why cities have meaningful local autonomy; the preemption tracker follows current statewide limits; and this page explains the fiscal machinery through which councils translate policy into taxes, spending and debt. Voters can then evaluate budget arguments with a clearer map of who controls each lever." ] },
  ],
  sources: [
    { href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.11.htm", label: "Texas Constitution, Article XI" },
    { href: "https://statutes.capitol.texas.gov/Docs/TX/htm/TX.26.htm", label: "Texas Tax Code, Chapter 26" },
    { href: "https://statutes.capitol.texas.gov/Docs/LG/htm/LG.102.htm", label: "Texas Local Government Code, Chapter 102" },
    { href: "https://statutes.capitol.texas.gov/Docs/LG/htm/LG.1331.htm", label: "Texas Government Code and Local Government Code municipal debt provisions" },
    { href: "https://www.tml.org/DocumentCenter/View/5614/2025-Handbook-for-Mayors-and-Councilmembers-pdf-FINAL", label: "Texas Municipal League municipal finance handbook sections" },
  ],
  relatedLinks: [
    { href: "/property-taxes", label: "Texas property tax resources", description: "Current property-tax tools and explainers." },
    { href: "/texas-government/texas-municipal-government-history", label: "Texas municipal government history", description: "How city authority developed." },
    { href: PREEMPTION_TRACKER, label: "State-local preemption tracker", description: "Current statewide restrictions on local authority." },
    { href: LOCAL_HANDBOOK, label: "Texas local government handbook", description: "Practical overview of municipal and other local governments." },
    { href: ELECTION_CENTRAL, label: "2026 Election Central", description: "Current elections, including local propositions and offices where covered." },
  ],
  faqs: [
    { question: "Can a Texas city create any tax it wants?", answer: "No. Municipal taxing authority is subject to the Texas Constitution and statutes authorizing particular taxes and setting procedures and limits." },
    { question: "Who sets a Texas city's property-tax rate?", answer: "The municipal governing body adopts the city's tax rate under state-law procedures. The appraisal district, not the city council, generally determines appraised property value." },
    { question: "Do all Texas city bonds require an election?", answer: "No. Requirements depend on the type of debt and governing law. General-obligation bonds and other obligations can follow different approval procedures." },
  ],
};

export const TEXAS_MUNICIPAL_GOVERNMENT_AUTHORITY_PAGES: GovernmentHistoryAuthorityPage[] = [
  TEXAS_MUNICIPAL_GOVERNMENT_HISTORY,
  TEXAS_HOME_RULE_GENERAL_LAW_HISTORY,
  TEXAS_MAYOR_CITY_COUNCIL_HISTORY,
  TEXAS_CITY_MANAGER_HISTORY,
  TEXAS_MUNICIPAL_COURTS_HISTORY,
  TEXAS_SPECIAL_DISTRICTS_HISTORY,
  TEXAS_MUNICIPAL_ELECTIONS_HISTORY,
  TEXAS_MUNICIPAL_FINANCE_HISTORY,
];
