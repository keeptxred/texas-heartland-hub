export type GovernmentHistoryTimelineItem = {
  year: string;
  event: string;
  meaning: string;
};

export type GovernmentHistorySection = {
  heading: string;
  paragraphs: string[];
};

export type GovernmentHistorySource = {
  href: string;
  label: string;
};

export type GovernmentHistoryLink = {
  href: string;
  label: string;
  description: string;
};

export type GovernmentHistoryFaq = {
  question: string;
  answer: string;
};

export type GovernmentHistoryAuthorityPage = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  eyebrow: string;
  intro: string;
  shortAnswer: string;
  reviewed: string;
  timeline: GovernmentHistoryTimelineItem[];
  sections: GovernmentHistorySection[];
  sources: GovernmentHistorySource[];
  relatedLinks: GovernmentHistoryLink[];
  faqs: GovernmentHistoryFaq[];
};

const REVIEWED = "2026-08-30";

export const TEXAS_GOVERNMENT_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "texas-government-history",
  title: "History of Texas Government",
  seoTitle: "History of Texas Government: Constitution, Branches and State Power | KeepTXRed",
  description: "A source-backed history of Texas government from the Republic and statehood through Reconstruction, the Constitution of 1876, the plural executive and modern state institutions.",
  eyebrow: "Texas government history",
  intro: "Texas government did not emerge fully formed in 1876. Its institutions reflect Mexican federalism, the Republic of Texas, statehood, Civil War, Reconstruction, post-Reconstruction reaction, constitutional amendments and the growth of a modern administrative state. The enduring feature is divided power: a bicameral Legislature, a governor with important but bounded authority, independently elected statewide officers, separate highest civil and criminal courts, and counties whose core institutions are rooted in the constitution and statutes.",
  shortAnswer: "Modern Texas government is built principally on the Constitution of 1876, but many offices and practices are older. Statehood in 1845 created the basic governor-Legislature-judiciary structure. Reconstruction constitutions changed the balance of power, and the 1876 convention responded by dispersing authority and limiting concentrated state power. Later amendments lengthened terms, reorganized courts and updated finance and administration without replacing the basic charter. The result is a system in which no single executive controls all statewide government and voters directly select many officials who would be appointed elsewhere.",
  reviewed: REVIEWED,
  timeline: [
    { year: "1836", event: "Republic of Texas government begins", meaning: "The Republic constitution established a president, Congress and judiciary before Texas entered the United States." },
    { year: "1845–1846", event: "State government organized", meaning: "The Constitution of 1845 and first Legislature translated republican institutions into a U.S. state government." },
    { year: "1861", event: "Secession changes constitutional allegiance", meaning: "Texas rewrote its charter to operate within the Confederacy while retaining state institutions." },
    { year: "1866", event: "First postwar constitution", meaning: "Texas reorganized civil government after the Civil War during the first phase of Reconstruction." },
    { year: "1869", event: "Reconstruction constitution expands central authority", meaning: "A new charter strengthened state institutions during congressional Reconstruction." },
    { year: "1876", event: "Current constitution takes effect", meaning: "The new charter deliberately divided executive power, constrained government and restored elected institutions." },
    { year: "1891", event: "Judicial article is reorganized", meaning: "Constitutional amendments created the Court of Criminal Appeals name and intermediate civil appellate courts." },
    { year: "1972", event: "Major statewide terms become four years", meaning: "Voters approved four-year terms for the governor, lieutenant governor and several statewide executive offices." },
  ],
  sections: [
    {
      heading: "1. Texas government predates Texas statehood",
      paragraphs: [
        "The institutional history of Texas begins before admission to the United States. Under Mexico, Texas was part of Coahuila y Tejas within a federal constitutional system. Independence in 1836 required a national government for the Republic of Texas, with a president, Congress and Supreme Court. Those institutions supplied precedents, personnel and political habits that carried into statehood even though the legal framework changed.",
        "The Constitution of 1845 established Texas as a state and created executive, legislative and judicial departments. The first Legislature met in 1846. Early state government was smaller and less administratively complex than the modern system, but the basic argument over how much power should be concentrated in Austin was already present. Texas political development repeatedly returned to that question as population, public finance and regulatory responsibilities grew."
      ],
    },
    {
      heading: "2. Civil War and Reconstruction repeatedly changed the balance of power",
      paragraphs: [
        "Secession produced the Constitution of 1861, while Confederate defeat forced another constitutional transition. The 1866 and 1869 charters reflected different stages of Reconstruction and different assumptions about executive authority, voting rights, courts and the relationship between state and federal power. Government during this period cannot be understood as a simple uninterrupted continuation of antebellum Texas.",
        "The Reconstruction government became a central political reference point for the delegates who later wrote the Constitution of 1876. Their reaction against what they considered excessive centralized authority shaped the structure Texans still recognize: short and constrained legislative sessions, detailed constitutional restrictions, elected officials with separate mandates and a governor who does not command a unified cabinet in the model used by the federal executive branch."
      ],
    },
    {
      heading: "3. The Constitution of 1876 dispersed authority on purpose",
      paragraphs: [
        "Article IV names executive officers, but Texas operates a plural executive rather than placing every statewide function beneath the governor. The attorney general, comptroller, land commissioner and other elected officials derive authority from the constitution and statutes, while boards and commissions may have staggered appointments or independent responsibilities. That fragmentation can slow coordinated action, but it also prevents one election for governor from transferring control of every major state function.",
        "The Legislature is similarly constrained and empowered. Article III vests legislative power in a Senate and House, while the constitution limits regular-session duration and governs appropriations, debt and numerous policy areas. The governor can veto legislation and call special sessions, but only the Legislature can enact statutes. Courts then determine legal disputes under the constitution and laws. Texas government is therefore best understood as a network of overlapping institutions rather than a hierarchy."
      ],
    },
    {
      heading: "4. Amendments modernized the system without replacing its foundation",
      paragraphs: [
        "Texas has repeatedly adjusted the 1876 framework through constitutional amendments. Judicial amendments reorganized appellate jurisdiction. The 1972 statewide vote expanded major executive terms from two years to four. Other amendments have addressed legislative compensation, finance, debt, local government, courts and specialized state funds. Each change modifies a document that remains rooted in nineteenth-century political assumptions.",
        "The failed 1974 constitutional convention is important because it left Texas with incremental reform rather than a replacement charter. Modern agencies, digital administration, massive public budgets and statewide regulatory systems therefore coexist with a constitutional design created for a much smaller state. That tension helps explain why institutional authority often depends on a combination of constitutional text, statutes, agency rules, appropriations and judicial decisions."
      ],
    },
    {
      heading: "5. Elections remain unusually important to institutional control",
      paragraphs: [
        "Texans elect the governor and lieutenant governor separately, elect several other statewide executive officers, elect members of both legislative chambers and use partisan elections for the state's appellate judiciary. County voters also elect judges, commissioners and other constitutional officers. As a result, election cycles determine personnel across multiple branches instead of simply choosing a governor and Legislature.",
        "For current political coverage, that history matters because a statewide election can alter one part of government without changing another. The governor may share a party with the attorney general yet possess no direct power to remove or command that independently elected officer. A Supreme Court election can affect civil law without changing the Court of Criminal Appeals. Understanding those institutional boundaries is the foundation for reading modern Texas political news accurately."
      ],
    },
  ],
  sources: [
    { href: "https://statutes.capitol.texas.gov/", label: "Texas Legislature Online: Texas Constitution and statutes" },
    { href: "https://tlc.texas.gov/publications", label: "Texas Legislative Council: Constitution and legislative reference publications" },
    { href: "https://lrl.texas.gov/", label: "Legislative Reference Library of Texas" },
    { href: "https://www.tsl.texas.gov/treasures/constitution", label: "Texas State Library and Archives Commission: constitutional history" },
    { href: "https://www.txcourts.gov/", label: "Texas Judicial Branch" },
  ],
  relatedLinks: [
    { href: "/texas-government", label: "Texas government authority hub", description: "Current offices, leaders, powers, limits and official sources." },
    { href: "/texas-politics/texas-constitutional-history", label: "Texas constitutional history", description: "The sequence of constitutions that created today's institutional framework." },
    { href: "/texas-legislature", label: "Texas Legislature", description: "Current House, Senate, bills and legislative authority." },
    { href: "/texas-courts", label: "Texas courts", description: "Current judicial structure and court resources." },
    { href: "/elections/2026", label: "2026 Election Central", description: "Current elections for the officials who operate these institutions." },
  ],
  faqs: [
    { question: "Why is Texas government power so divided?", answer: "The Constitution of 1876 was written in reaction to Reconstruction-era centralization and intentionally dispersed authority among separate elected offices, two legislative chambers, courts and constitutionally limited institutions." },
    { question: "Does the Texas governor control every state agency?", answer: "No. Texas has a plural executive, independently elected officers and boards or commissions whose authority comes from the constitution and statutes. The governor has major appointment and veto powers but does not command every statewide institution." },
    { question: "Has Texas replaced the Constitution of 1876?", answer: "No. Texans have amended it many times, and a major 1974 rewrite effort failed to produce a replacement. The 1876 charter remains the foundation of state government." },
  ],
};

export const TEXAS_LEGISLATURE_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "texas-legislature-history",
  title: "History of the Texas Legislature",
  seoTitle: "History of the Texas Legislature: House, Senate and Legislative Power | KeepTXRed",
  description: "A source-backed history of the Texas Legislature from the first state Legislature through Reconstruction, the 1876 Constitution, modern sessions, committees and partisan control.",
  eyebrow: "Texas legislative history",
  intro: "The Texas Legislature has met since 1846, but its institutional role has changed with every major constitutional era. The modern body is a citizen legislature of 31 senators and 150 representatives operating under Article III of the Constitution of 1876, normally meeting in regular session every odd-numbered year. Its limited calendar concentrates power in presiding officers, committees and deadlines while giving the governor a distinct role through vetoes and special sessions.",
  shortAnswer: "Texas has had a bicameral state Legislature since statehood. The first Legislature met in 1846 under the Constitution of 1845. Civil War and Reconstruction altered the constitutional framework, and the Constitution of 1876 established the basis of today's system. Modern regular sessions are biennial and constitutionally limited to 140 days. The House chooses its Speaker; the statewide elected lieutenant governor presides over the Senate. Over time, committees, professional staff, budget institutions and redistricting responsibilities turned a nineteenth-century citizen legislature into the central lawmaking institution of a rapidly growing state.",
  reviewed: REVIEWED,
  timeline: [
    { year: "1846", event: "First Texas Legislature meets", meaning: "The first Senate and House organized after statehood under the Constitution of 1845." },
    { year: "1861–1865", event: "Civil War legislatures", meaning: "The Legislature operated under the secession-era constitution and addressed wartime government." },
    { year: "1870", event: "Legislature resumes under congressional Reconstruction", meaning: "Reconstruction changed membership, political control and the constitutional environment." },
    { year: "1876", event: "Article III framework takes effect", meaning: "The current constitution reestablished a constrained Legislature and detailed rules for lawmaking and finance." },
    { year: "1930", event: "Regular-session provisions amended", meaning: "Voters continued modifying legislative session and compensation rules through constitutional amendments." },
    { year: "1960s–1970s", event: "Professional support expands", meaning: "Research, budget and legislative-support institutions grew as state government became more complex." },
    { year: "2003", event: "Republicans organize the House", meaning: "After the 2002 election, Republicans controlled both legislative chambers, a major milestone in partisan realignment." },
    { year: "2025", event: "89th Legislature convenes", meaning: "The modern Legislature continues the biennial system while managing a state of more than 30 million residents." },
  ],
  sections: [
    { heading: "1. Statehood created a two-chamber Legislature", paragraphs: ["The Constitution of 1845 vested legislative power in a Senate and House of Representatives. The first Legislature convened in 1846, establishing procedures, offices and statutes for the new state. A bicameral structure required agreement between two separately organized chambers before legislation could reach the governor.", "That design endured through later constitutional changes even as membership, districting, session rules and political coalitions changed. The Senate developed longer terms and smaller membership, while the House became the larger chamber closest to population-based districts. Those structural differences remain central to how legislation advances today."] },
    { heading: "2. Reconstruction reshaped membership and political conflict", paragraphs: ["The Civil War interrupted ordinary political development and the Reconstruction constitutions changed the context in which legislators served. Republican officeholders gained influence during Reconstruction, including Black legislators whose service became an important part of Texas political history. Democratic restoration in the 1870s then set the stage for the constitutional convention that produced the present charter.", "The 1876 constitution reflected suspicion of legislative spending and centralized authority as well as executive power. Detailed restrictions on debt, appropriations and subjects of legislation were placed directly in the constitution. Those limits mean legislative procedure in Texas is not only a matter of chamber rules; constitutional text often determines what lawmakers may do and how they must do it."] },
    { heading: "3. Biennial sessions make time a source of power", paragraphs: ["Article III provides for regular legislative sessions in odd-numbered years, and the constitution limits a regular session to 140 days. The governor may call special sessions and determines the subjects lawmakers may consider during those sessions. The limited regular calendar creates intense procedural deadlines for bill filing, committee action, calendars and final passage.", "Because time is scarce, presiding officers and committees have substantial agenda-setting influence. The Speaker refers House bills and appoints committees under House rules; the lieutenant governor performs comparable Senate functions under Senate rules. A bill can fail without a final floor vote simply because it does not clear each procedural stage before the deadline."] },
    { heading: "4. Modern legislative capacity grew around the elected chambers", paragraphs: ["As Texas expanded, lawmakers needed permanent research, drafting, budget and archival support. Institutions such as the Legislative Budget Board, Texas Legislative Council and Legislative Reference Library provide continuity between sessions and preserve the record of bills, members, amendments and legislative history.", "That professional infrastructure does not turn Texas into a full-time legislature. Members still operate within a constitutionally defined citizen-legislature model. The combination of short sessions and extensive permanent staff is one reason preparation before the gavel falls matters so much: budget assumptions, bill drafts, committee priorities and stakeholder negotiations often develop long before the formal regular session begins."] },
    { heading: "5. Partisan control changed, but institutional rules still shape outcomes", paragraphs: ["For generations after Reconstruction, Democrats dominated both chambers. Republican strength grew gradually, and the GOP captured the Senate before winning the House in the 2002 election. Tom Craddick became Speaker in 2003, marking the first Republican speakership since Reconstruction. The change completed the broader transition to Republican control of statewide government.", "Partisan majorities matter because they determine chamber organization and committee leadership, but Texas legislative outcomes are also shaped by district geography, supermajority or procedural thresholds, presiding-officer authority, constitutional limits and the governor's veto or special-session powers. Current bill coverage is clearer when those institutional rules are separated from party labels alone."] },
  ],
  sources: [
    { href: "https://lrl.texas.gov/", label: "Legislative Reference Library of Texas" },
    { href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.3.htm", label: "Texas Constitution, Article III" },
    { href: "https://tlc.texas.gov/", label: "Texas Legislative Council" },
    { href: "https://capitol.texas.gov/", label: "Texas Legislature Online" },
    { href: "https://house.texas.gov/", label: "Texas House of Representatives" },
  ],
  relatedLinks: [
    { href: "/texas-legislature", label: "Texas Legislature hub", description: "Current chambers, members, sessions and bill tracking." },
    { href: "/texas-government/texas-legislature", label: "Texas Legislature authority page", description: "Constitutional powers, limits and institutional relationships." },
    { href: "/bills", label: "Texas bill tracker", description: "Follow current legislation through the process described here." },
    { href: "/texas-politics/texas-redistricting-history", label: "Texas redistricting history", description: "How legislative districts and political control interact after each census." },
    { href: "/texas-politics/how-texas-became-republican", label: "How Texas became Republican", description: "The partisan realignment that eventually changed control of both chambers." },
  ],
  faqs: [
    { question: "When did the first Texas Legislature meet?", answer: "The first state Legislature met in 1846 after Texas entered the United States under the Constitution of 1845." },
    { question: "How long is a regular Texas legislative session?", answer: "Article III of the Texas Constitution limits a regular session to 140 days. Regular sessions begin in odd-numbered years, while the governor may call special sessions on specified subjects." },
    { question: "When did Republicans take control of the Texas House?", answer: "Republicans won control of the House in the 2002 election and organized the chamber in 2003, completing GOP control of both legislative chambers." },
  ],
};

export const TEXAS_GOVERNOR_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "governor-history",
  title: "History of the Governor of Texas",
  seoTitle: "History of the Texas Governor: Powers, Terms and Political Change | KeepTXRed",
  description: "A source-backed history of the Texas governorship from statehood through Reconstruction, the Constitution of 1876, four-year terms, vetoes, appointments and modern executive power.",
  eyebrow: "Texas governor history",
  intro: "The Texas governor is the state's chief executive, but the office was intentionally designed to share power with other independently elected officials. From the first state governor in 1846 through Reconstruction, the 1876 Constitution and modern emergency government, the office accumulated important veto, appointment and agenda-setting powers without becoming a federal-style executive controlling every department.",
  shortAnswer: "The governorship dates to Texas statehood in 1845–1846, following the presidency of the Republic of Texas. The Constitution of 1876 weakened and dispersed executive power compared with Reconstruction government, creating the plural-executive system still used today. The governor signs or vetoes bills, calls special sessions, appoints many officials, fills certain vacancies and exercises emergency and military powers under law. Voters approved four-year terms in 1972. There are no constitutional term limits, which has allowed modern governors to serve much longer than the two-year terms common in earlier eras.",
  reviewed: REVIEWED,
  timeline: [
    { year: "1846", event: "J. Pinckney Henderson becomes first state governor", meaning: "Statehood replaced the Republic presidency with a governor operating under the 1845 constitution." },
    { year: "1861", event: "Sam Houston removed after rejecting Confederate oath", meaning: "The secession crisis demonstrated the office's dependence on the constitutional political order around it." },
    { year: "1870–1874", event: "Edmund J. Davis serves during Reconstruction", meaning: "The Davis administration became a lasting reference point in debates over centralized executive power." },
    { year: "1876", event: "New constitution disperses executive authority", meaning: "The plural executive and shorter terms reflected distrust of concentrated state power." },
    { year: "1917", event: "Governor James E. Ferguson impeached and removed", meaning: "Legislative impeachment demonstrated a constitutional check on the governor." },
    { year: "1972", event: "Voters approve four-year terms", meaning: "The governor and several other statewide officers moved from two-year to four-year terms." },
    { year: "1978", event: "Bill Clements elected", meaning: "Clements became the first Republican elected governor since Reconstruction." },
    { year: "2000", event: "Rick Perry succeeds George W. Bush", meaning: "Succession after Bush became president began the longest gubernatorial tenure in Texas history." },
  ],
  sections: [
    { heading: "1. Statehood replaced a president with a governor", paragraphs: ["The Republic of Texas had a national president. Admission to the Union required a state executive under the Constitution of 1845, and J. Pinckney Henderson became the first governor. The office handled execution of state law, appointments and relations with a Legislature whose authority was separately defined.", "Nineteenth-century governors operated in a state with limited administrative capacity, but the position was politically central. Secession, Civil War and Reconstruction made executive authority a recurring constitutional issue. Sam Houston's removal in 1861 and the later Reconstruction administration of Edmund J. Davis showed how closely the office was tied to disputes over sovereignty, federal authority and control of state institutions."] },
    { heading: "2. The 1876 Constitution deliberately limited concentrated executive power", paragraphs: ["Delegates writing the Constitution of 1876 reacted against Reconstruction-era government by dividing authority among separately elected officers. The attorney general, comptroller, land commissioner and other officials were not made cabinet secretaries removable at the governor's pleasure. That plural-executive arrangement remains one of the defining differences between Texas and the federal government.", "The governor nevertheless possesses significant constitutional tools. Legislation may be signed or vetoed, including use of the line-item veto in appropriations. The governor can call special sessions and set their subjects, make numerous appointments subject to legal and Senate-confirmation rules, and fill specified vacancies. These powers are substantial precisely because the governor must use them in a system where other actors retain independent authority."] },
    { heading: "3. Impeachment and succession reveal the office's constitutional limits", paragraphs: ["Governor James E. Ferguson was impeached by the House and convicted by the Senate in 1917, one of the clearest demonstrations that a statewide electoral mandate does not place a governor beyond legislative accountability. Lieutenant governors have also succeeded to gubernatorial power when vacancies occurred, making executive succession more than a theoretical constitutional provision.", "The relationship between governor and lieutenant governor is especially unusual because each is elected independently. They can belong to the same party but lead distinct institutions and political coalitions. The lieutenant governor's Senate power can rival the governor's influence over legislation, while the governor controls vetoes and special-session agendas. Texas executive politics is therefore structurally competitive even within one governing party."] },
    { heading: "4. Four-year terms transformed the modern governorship", paragraphs: ["For most of Texas history, governors served two-year terms. In November 1972, voters adopted a constitutional amendment providing four-year terms for the governor, lieutenant governor and several other statewide officers. The longer term gave governors more time to build appointment influence, policy agendas and statewide political organizations between elections.", "Texas imposes no constitutional term limit on the governor. Rick Perry's service from December 2000 to January 2015 demonstrated how long tenure can compound appointment power as board terms expire and judicial vacancies arise. Greg Abbott's later multi-term tenure continued the modern pattern of governors operating with far greater continuity than their nineteenth- and early-twentieth-century predecessors."] },
    { heading: "5. Modern executive power depends on statutes as well as Article IV", paragraphs: ["Emergency management, disaster response, agency administration and executive orders receive intense attention today, but the governor's authority in these areas comes from both the constitution and statutes enacted by the Legislature. Courts can review whether executive action stays within those boundaries. Budget execution also requires cooperation with legislative appropriations and other constitutional officers.", "That legal architecture is why current governor coverage should distinguish political influence from formal power. A governor can shape the agenda, endorse candidates, veto bills and appoint officials, yet cannot independently enact a statute, command the attorney general as a subordinate or appropriate money outside constitutional and statutory authority. The office is powerful because of its strategic position within divided government, not because it sits above the rest of Texas government."] },
  ],
  sources: [
    { href: "https://www.lrl.texas.gov/legeLeaders/governors/govBrowse.cfm", label: "Legislative Reference Library: Governors of Texas" },
    { href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.4.htm", label: "Texas Constitution, Article IV" },
    { href: "https://lrl.texas.gov/legis/ConstAmends/results.cfm?electionDate=Nov+7%2C+1972", label: "Legislative Reference Library: 1972 constitutional amendment results" },
    { href: "https://gov.texas.gov/", label: "Office of the Texas Governor" },
    { href: "https://www.tsl.texas.gov/governors/index.html", label: "Texas State Library and Archives: Texas Governors" },
  ],
  relatedLinks: [
    { href: "/texas-government/governor", label: "Governor of Texas authority page", description: "Current officeholder, constitutional powers, limits and official links." },
    { href: "/texas-government/lieutenant-governor", label: "Lieutenant Governor", description: "The separately elected officer first in line to gubernatorial succession." },
    { href: "/texas-politics/texas-constitutional-history", label: "Texas constitutional history", description: "Why the 1876 charter divides executive power." },
    { href: "/texas-politics/how-texas-became-republican", label: "Texas Republican realignment", description: "How the governorship moved from Democratic dominance to Republican control." },
    { href: "/elections/2026", label: "2026 Election Central", description: "Current statewide election coverage and candidate information." },
  ],
  faqs: [
    { question: "Who was the first governor of the State of Texas?", answer: "J. Pinckney Henderson became the first governor after Texas entered the United States, taking office in 1846." },
    { question: "How long is a Texas governor's term?", answer: "The governor serves a four-year term. Texas voters approved the move from two-year to four-year terms in 1972." },
    { question: "Does Texas have a term limit for governor?", answer: "No. The Texas Constitution does not impose a gubernatorial term limit, so a governor may seek additional four-year terms." },
  ],
};

export const TEXAS_LIEUTENANT_GOVERNOR_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "lieutenant-governor-history",
  title: "History of the Lieutenant Governor of Texas",
  seoTitle: "History of the Texas Lieutenant Governor and Senate Presidency | KeepTXRed",
  description: "A source-backed history of the Texas lieutenant governorship, Senate presidency, succession role, committee power, four-year terms and modern legislative influence.",
  eyebrow: "Texas lieutenant governor history",
  intro: "The Texas lieutenant governor is unusual among statewide executives because the office's greatest power is legislative. Elected independently from the governor, the lieutenant governor presides over the Senate and exercises extensive authority under Senate rules. The office has existed since statehood and has evolved from a constitutional succession post into one of the most influential agenda-setting positions in Texas government.",
  shortAnswer: "Texas created the lieutenant governorship at statehood. The officeholder is elected statewide, serves as president of the Senate and is first in the constitutional line to exercise gubernatorial powers when required. Its modern influence comes largely from Senate rules governing committee appointments, bill referrals, recognition and floor procedure. Voters approved four-year terms in 1972. Because the lieutenant governor does not run on a joint ticket with the governor, the office has an independent electoral base and can pursue a legislative agenda distinct from the governor's.",
  reviewed: REVIEWED,
  timeline: [
    { year: "1846", event: "Office organized at statehood", meaning: "The new state constitution created a lieutenant governor to preside over the Senate and provide succession." },
    { year: "1846", event: "Disputed first election resolved", meaning: "Albert Clinton Horton ultimately took the oath after legislators reconsidered incomplete election returns." },
    { year: "1853", event: "James W. Henderson succeeds to governor", meaning: "An early vacancy demonstrated the office's constitutional succession function." },
    { year: "1876", event: "Current constitutional framework established", meaning: "Article IV retained the office while Article III continued its Senate role." },
    { year: "1941", event: "Coke Stevenson succeeds Governor O'Daniel", meaning: "Succession again moved a lieutenant governor directly into the governorship." },
    { year: "1972", event: "Four-year term approved", meaning: "Voters lengthened the lieutenant governor's term along with the governor and other statewide officers." },
    { year: "1990s–2000s", event: "Presiding-officer power remains central", meaning: "Committee appointments and Senate procedure made the office a major legislative gatekeeper across partisan change." },
    { year: "2015–present", event: "Dan Patrick era", meaning: "A multi-term lieutenant governorship illustrates the office's independent statewide mandate and agenda power." },
  ],
  sections: [
    { heading: "1. The office began as both Senate presidency and executive insurance", paragraphs: ["The Constitution of 1845 created a lieutenant governor as Texas organized state government. From the beginning, the office combined two functions that remain linked today: presiding over the Senate and standing ready to exercise gubernatorial power under succession rules. The complicated first election, eventually resolved in favor of Albert Clinton Horton, immediately showed that the office was a distinct statewide elective position rather than an appointee of the governor.", "Early lieutenant governors sometimes moved directly into the governorship when vacancies occurred. James W. Henderson did so in 1853, and later examples reinforced the practical importance of succession. But day-to-day power developed in the Senate, where procedure determines whether legislation receives hearings, reaches the floor and survives a compressed legislative calendar."] },
    { heading: "2. Senate rules turned a constitutional presiding officer into an agenda setter", paragraphs: ["The constitution makes the lieutenant governor president of the Senate, but much of the office's modern influence comes from rules adopted by senators. Committee assignments, chair appointments, bill referrals and recognition on the floor give the presiding officer leverage over the path legislation must travel. Those powers can change as Senate rules change, so the office is partly constitutional and partly institutional.", "This distinction matters when comparing the lieutenant governor with the governor. The governor can veto bills and call special sessions but does not preside over either chamber. The lieutenant governor has no independent power to enact a statute, yet can shape which proposals receive Senate attention. In a 140-day regular session, control over timing and referral can be as politically important as formal executive authority."] },
    { heading: "3. The office is independently elected, not part of a governor's ticket", paragraphs: ["Texas voters choose the governor and lieutenant governor separately. The arrangement allows different political constituencies and even different parties to hold the offices, unlike states that elect a joint executive ticket. It also means the lieutenant governor's political survival does not depend on remaining aligned with a governor after the election.", "Independent election reinforces the plural-executive character of Texas government. The lieutenant governor can build relationships with senators, donors, interest groups and voters around a legislative record of his own. That institutional base helps explain why Texas political observers frequently describe the office as one of the strongest lieutenant governorships in the country even though its formal executive duties are comparatively narrow."] },
    { heading: "4. Four-year terms increased continuity and institutional reach", paragraphs: ["Like the governor, the lieutenant governor historically served shorter terms. The constitutional amendment approved in November 1972 established four-year terms for both offices and several other statewide positions. Longer terms reduce the frequency of statewide reelection and allow a lieutenant governor to span multiple legislative sessions within one term.", "Because Senate rules and committee structures recur across sessions, longevity can compound influence. A multi-term lieutenant governor participates in repeated budget cycles, redistricting debates, appointments to state boards and leadership changes within the chamber. That continuity is particularly significant in a Legislature that meets in regular session only every two years."] },
    { heading: "5. Succession remains a real constitutional responsibility", paragraphs: ["The legislative role dominates ordinary news coverage, but succession has repeatedly mattered in Texas history. Lieutenant governors have exercised gubernatorial power when governors left office, and the constitution also addresses temporary inability or absence. The office therefore sits at the intersection of the executive and legislative branches by design.", "For voters, the combination means a lieutenant-governor election is not merely a backup choice for governor. It selects the Senate's presiding officer, a statewide political leader and a potential successor to gubernatorial power. Current election and legislative coverage should treat the office as its own institution rather than as a vice-presidential analogue subordinate to the governor."] },
  ],
  sources: [
    { href: "https://lrl.texas.gov/legeleaders/leadership/ltgovbrowse.cfm", label: "Legislative Reference Library: Lieutenant Governors of Texas" },
    { href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.4.htm", label: "Texas Constitution, Article IV" },
    { href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.3.htm", label: "Texas Constitution, Article III" },
    { href: "https://senate.texas.gov/rules.php", label: "Texas Senate Rules" },
    { href: "https://www.ltgov.texas.gov/", label: "Office of the Lieutenant Governor" },
  ],
  relatedLinks: [
    { href: "/texas-government/lieutenant-governor", label: "Lieutenant Governor authority page", description: "Current officeholder, powers, limits and official sources." },
    { href: "/texas-government/texas-senate", label: "Texas Senate authority page", description: "The chamber over which the lieutenant governor presides." },
    { href: "/texas-government/governor", label: "Governor of Texas", description: "Compare the governor's executive tools with Senate presiding power." },
    { href: "/texas-legislature", label: "Texas Legislature hub", description: "Current sessions, lawmakers and bills." },
    { href: "/elections/2026", label: "2026 Election Central", description: "Current statewide and legislative election coverage." },
  ],
  faqs: [
    { question: "Is the Texas lieutenant governor elected with the governor?", answer: "No. Texans elect the lieutenant governor separately in a statewide election, giving the office an independent electoral mandate." },
    { question: "Why is the Texas lieutenant governor so powerful?", answer: "The constitution makes the lieutenant governor president of the Senate, while Senate rules provide substantial authority over committees, bill referrals, recognition and procedure." },
    { question: "How long is the lieutenant governor's term?", answer: "The office has a four-year term following a constitutional amendment approved by Texas voters in 1972." },
  ],
};

export const TEXAS_SPEAKER_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "speaker-of-the-house-history",
  title: "History of the Speaker of the Texas House",
  seoTitle: "History of the Texas House Speaker: Power, Elections and Leadership | KeepTXRed",
  description: "A source-backed history of Texas House speakers from the first Legislature through Reconstruction, long Democratic control, the 2003 Republican transition and modern House leadership.",
  eyebrow: "Texas House speaker history",
  intro: "The Speaker of the Texas House is chosen by representatives rather than statewide voters, yet the office is one of the most consequential positions in state government. The Speaker controls organization of the House under chamber rules, appoints committees, refers legislation and manages a 150-member institution facing strict constitutional deadlines. The office's history tracks Texas's partisan transformations as well as changes in legislative procedure.",
  shortAnswer: "Texas House members have chosen a Speaker since the first Legislature in 1846. The office is established by the constitution, while much of its practical power comes from House rules. Speakers appoint committees and chairs, refer bills and preside over floor proceedings. Democratic speakers dominated after Reconstruction for more than a century. Republican Tom Craddick became Speaker in 2003 after the GOP won the House, the first Republican to hold the post since Reconstruction. The office remains internally elected, so a Speaker must maintain support among House members as well as lead the chamber publicly.",
  reviewed: REVIEWED,
  timeline: [
    { year: "1846", event: "First Legislature chooses House speakers", meaning: "The new House immediately used an internally elected presiding officer to organize its work." },
    { year: "1870–1873", event: "Republican Reconstruction speakers serve", meaning: "Ira Hobart Evans and William Henry Sinclair presided during the Reconstruction political order." },
    { year: "1870s–2002", event: "Long era of Democratic speakers", meaning: "Democratic dominance of Texas politics kept the speakership in Democratic hands for generations." },
    { year: "1965–1969", event: "Ben Barnes becomes a prominent modern Speaker", meaning: "Barnes illustrated the speakership's role as a platform for statewide political leadership." },
    { year: "1975–1983", event: "Bill Clayton serves four terms", meaning: "Extended tenure showed how committee and procedural authority could create durable institutional power." },
    { year: "1993–2003", event: "Pete Laney leads during partisan transition", meaning: "Laney presided as Republican strength grew toward eventual House control." },
    { year: "2003", event: "Tom Craddick becomes Speaker", meaning: "Craddick was the first Republican Speaker since Reconstruction after the GOP won a House majority." },
    { year: "2025", event: "Dustin Burrows elected Speaker", meaning: "The 89th Legislature continued the modern Republican era while demonstrating that Speaker coalitions are formed inside the House." },
  ],
  sections: [
    { heading: "1. The Speaker is a constitutional officer chosen inside the House", paragraphs: ["Article III directs the House to choose its Speaker. Unlike the governor or lieutenant governor, the Speaker does not receive a separate statewide popular mandate. Power begins with the votes of representatives at the opening of a Legislature and must be exercised in a chamber where members can organize coalitions around rules, committees and leadership decisions.", "This internal election makes the office both powerful and dependent. A Speaker can shape legislative traffic through referrals, committee appointments and floor management, but the authority rests on House rules and continued political support. Leadership contests therefore reveal factional structure within the majority party and sometimes across party lines in ways a statewide election cannot."] },
    { heading: "2. Committee organization is the core of modern Speaker power", paragraphs: ["Most bills never become law, and committee routing is one of the first decisive steps. Under House rules, the Speaker appoints standing committees and their leadership and refers filed measures to committees with jurisdiction. Those decisions affect which lawmakers develop expertise, which bills receive hearings and how quickly proposals move toward the Calendars process and floor consideration.", "The limited 140-day regular session magnifies that gatekeeping function. Delay can be fatal even without a direct vote against a bill. At the same time, the House can revise its rules, and members retain voting authority over legislation. The Speaker's strength is therefore institutional rather than absolute: it comes from coordinating a large chamber under procedural constraints."] },
    { heading: "3. The speakership mirrors Texas partisan history", paragraphs: ["Republican speakers served during Reconstruction, but Democratic control after the 1870s created a remarkably long era of Democratic House leadership. The office then operated within a one-party political system where the most important competition often occurred among Democratic factions rather than between parties.", "The late twentieth-century Republican realignment gradually changed House membership. Pete Laney remained Speaker while the chamber became increasingly competitive. After Republicans won control in the 2002 election, Tom Craddick became Speaker in January 2003, marking the first Republican speakership since Reconstruction and completing GOP control of both legislative chambers."] },
    { heading: "4. Modern speakers build coalitions, not merely majorities", paragraphs: ["A numerical partisan majority does not automatically settle a Speaker race because representatives cast the vote and leadership contests can divide the majority party. Joe Straus, Dennis Bonnen, Dade Phelan and Dustin Burrows each entered office in different political circumstances, illustrating that procedural leadership depends on coalitions within the House rather than a direct command from statewide party officials.", "That independence is structurally important. The governor cannot appoint the Speaker, and the lieutenant governor leads a separate chamber. The House therefore has its own institutional center of power. Disagreements among the governor, lieutenant governor and Speaker can determine whether priority legislation advances even when all three offices are held by the same party."] },
    { heading: "5. Speaker history is a guide to understanding current bill outcomes", paragraphs: ["News coverage often focuses on final floor votes, but the Speaker's institutional history explains why committee assignments, referrals and calendars matter earlier in the process. A proposal may have broad public support yet fail because it lacks a pathway through committee or because competing priorities consume the remaining session calendar.", "For current voters, the key distinction is that they do not cast a direct ballot for Speaker. They elect a House member, and the assembled House chooses its presiding officer. Legislative elections therefore indirectly shape the speakership, while internal House politics decides which candidate can assemble the votes to lead the chamber."] },
  ],
  sources: [
    { href: "https://www.lrl.texas.gov/legeleaders/leadership/speakerBrowse.cfm", label: "Legislative Reference Library: Speakers of the Texas House" },
    { href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.3.htm", label: "Texas Constitution, Article III" },
    { href: "https://house.texas.gov/", label: "Texas House of Representatives" },
    { href: "https://house.texas.gov/pdfs/rules.pdf", label: "Rules of the Texas House of Representatives" },
    { href: "https://lrl.texas.gov/legeleaders/leadership/", label: "Legislative Reference Library: Presiding officers" },
  ],
  relatedLinks: [
    { href: "/texas-government/speaker-of-the-house", label: "Speaker authority page", description: "Current House leadership powers, limits and relationships." },
    { href: "/texas-government/texas-house", label: "Texas House authority page", description: "The 150-member chamber that elects the Speaker." },
    { href: "/texas-legislature", label: "Texas Legislature hub", description: "Current session, members, committees and bills." },
    { href: "/texas-politics/how-texas-became-republican", label: "Texas Republican realignment", description: "The electoral change that led to the 2003 Republican speakership." },
    { href: "/texas-politics/reconstruction-republicans", label: "Reconstruction Republicans", description: "The earlier period when Republican speakers and lawmakers served in Texas." },
  ],
  faqs: [
    { question: "Who elects the Speaker of the Texas House?", answer: "The members of the Texas House elect the Speaker. Voters elect representatives, but there is no separate statewide ballot for Speaker." },
    { question: "When did Texas get its first modern Republican Speaker?", answer: "Tom Craddick became Speaker in 2003 after Republicans won the House in the 2002 election. He was the first Republican Speaker since Reconstruction." },
    { question: "What gives the Speaker power?", answer: "The Texas Constitution creates the office, while House rules give the Speaker major procedural authority including committee appointments, bill referrals and presiding responsibilities." },
  ],
};

export const TEXAS_SUPREME_COURT_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "texas-supreme-court-history",
  title: "History of the Texas Supreme Court",
  seoTitle: "History of the Texas Supreme Court: Structure, Elections and Jurisdiction | KeepTXRed",
  description: "A source-backed institutional history of the Supreme Court of Texas from the Republic through the 1876 Constitution, 1891 judicial reorganization, court expansion and modern elections.",
  eyebrow: "Texas Supreme Court history",
  intro: "The Supreme Court of Texas predates statehood, but the court Texans know today emerged through repeated constitutional redesign. The Republic's Supreme Court combined a chief justice with district judges. State constitutions changed appointment and election methods, Reconstruction altered the bench, the Constitution of 1876 separated civil and criminal appellate jurisdiction, and the 1891 judicial amendment created the appellate structure that evolved into the modern system.",
  shortAnswer: "Texas has had a highest court since the Republic. Under the Constitution of 1876, the Supreme Court became the state's highest court for civil matters while a separate Court of Appeals handled criminal cases and some civil work. The 1891 judicial amendment created Courts of Civil Appeals and renamed the criminal court the Court of Criminal Appeals. The Supreme Court later expanded to nine members. Today its justices are elected statewide in partisan elections for six-year terms, with gubernatorial appointments used to fill vacancies until an election, subject to constitutional rules.",
  reviewed: REVIEWED,
  timeline: [
    { year: "1836", event: "Republic constitution creates Supreme Court", meaning: "A chief justice and district judges formed the Republic's highest judicial tribunal." },
    { year: "1846", event: "State Supreme Court begins", meaning: "Statehood reorganized the judiciary under the Constitution of 1845." },
    { year: "1866", event: "Court expands to five elected judges", meaning: "The first Reconstruction constitution altered membership and selection." },
    { year: "1869", event: "Justices become appointed", meaning: "The Reconstruction constitution reduced the court to three and changed judicial selection." },
    { year: "1876", event: "Elected three-member court restored", meaning: "The current constitution returned the Supreme Court to elected judges and separated major appellate functions." },
    { year: "1891", event: "Judicial article reorganized", meaning: "Intermediate civil appellate courts were created, easing the Supreme Court's workload and clarifying jurisdiction." },
    { year: "1945", event: "Modern nine-member structure emerges", meaning: "Constitutional change produced the chief justice plus eight-justice court familiar today." },
    { year: "1980s–1990s", event: "Partisan realignment reshapes elections", meaning: "Republicans gradually captured the statewide elected court, linking judicial history to broader Texas realignment." },
  ],
  sections: [
    { heading: "1. The Supreme Court began with the Republic", paragraphs: ["The Constitution of the Republic of Texas created a Supreme Court in 1836. Its structure differed sharply from today's: a chief justice sat with district judges serving as associate justices. That arrangement reflected the limited judicial resources of a new republic and tied trial and appellate institutions closely together.", "Statehood required another redesign. The Constitution of 1845 created a state judiciary, and later constitutions repeatedly changed the number of justices, term lengths and method of selection. The court's history therefore mirrors Texas constitutional history rather than following one continuous organizational model."] },
    { heading: "2. Reconstruction repeatedly changed judicial selection", paragraphs: ["Under the 1866 constitution the Supreme Court expanded to five judges and used elections, but U.S. military authorities removed the elected bench during Reconstruction. The Constitution of 1869 then reduced the court and made judicial positions appointive. These shifts show why judicial selection became politically charged long before modern partisan campaigns.", "The Constitution of 1876 restored elections and a three-member Supreme Court. Its framers' preference for popular election fit the wider post-Reconstruction effort to disperse government authority and place more offices directly before voters. Judicial elections remain a defining feature of Texas state government today."] },
    { heading: "3. Texas split civil and criminal appellate authority", paragraphs: ["The 1876 constitution created a separate Court of Appeals while the Supreme Court focused on civil jurisdiction. In 1891, voters approved a major judicial amendment that created Courts of Civil Appeals and renamed the criminal court the Court of Criminal Appeals. Texas thereby developed two separate courts of last resort, a structure that still distinguishes it from most states.", "The separation is essential for interpreting modern judicial news. The Supreme Court decides the state's highest civil and juvenile matters and has significant administrative responsibilities for the judicial branch, while the Court of Criminal Appeals is the highest court for criminal cases. A statewide election for one court does not change the personnel or jurisdiction of the other."] },
    { heading: "4. Workload pressures produced the modern court", paragraphs: ["Rapid population and commercial growth repeatedly strained appellate capacity. Texas used commissions and intermediate courts to manage caseloads, and constitutional changes eventually produced a nine-member Supreme Court consisting of a chief justice and eight justices. The larger court and intermediate appellate system allow the Supreme Court to concentrate on cases presenting important legal questions.", "Jurisdiction today is governed by constitutional and statutory provisions rather than simply by whether a litigant wants another appeal. The court exercises discretionary review in many matters and also oversees rules and administration across the civil judicial system. Its influence therefore extends beyond the opinions issued in individual cases."] },
    { heading: "5. Judicial elections became part of Texas partisan realignment", paragraphs: ["For much of the twentieth century, Democratic dominance in Texas meant the Supreme Court was overwhelmingly Democratic. Republican candidates gained ground as the state realigned, and the court eventually became Republican-controlled. The transition was not merely a change of labels; it changed how judicial races fit into statewide campaigns, fundraising and voter behavior.", "KTR's separate Supreme Court realignment guide follows that partisan story in detail. The institutional history here provides the larger frame: election rules, six-year terms, vacancy appointments and statewide jurisdiction all predate the modern partisan balance. Current court elections are the latest chapter in a constitutional system that has repeatedly alternated between appointment and election over nearly two centuries."] },
  ],
  sources: [
    { href: "https://www.txcourts.gov/supreme/about-the-court/court-history/", label: "Supreme Court of Texas: Court History" },
    { href: "https://www.txcourts.gov/supreme/about-the-court/court-history/supreme-court-judicial-election-history.aspx", label: "Supreme Court of Texas: Judicial Election History" },
    { href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.5.htm", label: "Texas Constitution, Article V" },
    { href: "https://www.txcourts.gov/supreme/", label: "Supreme Court of Texas" },
    { href: "https://www.tsl.texas.gov/arc/", label: "Texas State Archives" },
  ],
  relatedLinks: [
    { href: "/texas-government/supreme-court", label: "Texas Supreme Court authority page", description: "Current justices, jurisdiction, powers and official resources." },
    { href: "/texas-politics/texas-supreme-court-realignment", label: "Texas Supreme Court partisan realignment", description: "The modern electoral transition from Democratic to Republican control." },
    { href: "/texas-courts", label: "Texas courts hub", description: "Current court structure across the state." },
    { href: "/texas-government/court-of-criminal-appeals", label: "Court of Criminal Appeals", description: "Texas's separate court of last resort for criminal matters." },
    { href: "/texas-politics/texas-constitutional-history", label: "Texas constitutional history", description: "The constitutional changes that repeatedly reorganized the judiciary." },
  ],
  faqs: [
    { question: "How old is the Texas Supreme Court?", answer: "Texas has had a Supreme Court since the Republic constitution of 1836, though its membership, jurisdiction and selection method changed repeatedly afterward." },
    { question: "Does the Texas Supreme Court hear criminal cases?", answer: "The Supreme Court is the state's highest court for civil matters. The Texas Court of Criminal Appeals is the court of last resort for criminal cases." },
    { question: "How are Texas Supreme Court justices selected?", answer: "Justices are elected statewide in partisan elections for six-year terms. Vacancies can be filled by gubernatorial appointment under the constitutional process until the seat is filled through election." },
  ],
};

export const TEXAS_CCA_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "court-of-criminal-appeals-history",
  title: "History of the Texas Court of Criminal Appeals",
  seoTitle: "History of the Texas Court of Criminal Appeals: 1876 to Today | KeepTXRed",
  description: "A source-backed history of Texas's highest criminal court from the 1876 Court of Appeals through the 1891 constitutional reorganization, expansion and modern elections.",
  eyebrow: "Texas criminal court history",
  intro: "Texas is one of the few states with separate courts of last resort for civil and criminal law. The Court of Criminal Appeals traces its modern lineage to the Court of Appeals created by the Constitution of 1876. A constitutional amendment adopted in 1891 renamed the tribunal, reorganized appellate jurisdiction and helped create the two-track appellate structure Texans use today.",
  shortAnswer: "The Constitution of 1876 created a Court of Appeals with criminal jurisdiction and some civil responsibilities while the Supreme Court handled other civil matters. In 1891, Texas voters approved a judicial amendment that created Courts of Civil Appeals and renamed the existing Court of Appeals the Court of Criminal Appeals. The CCA is now the state's highest court for criminal cases. It has a presiding judge and eight judges elected statewide in partisan elections for six-year terms, and it exercises final appellate authority in criminal matters assigned by the constitution and law.",
  reviewed: REVIEWED,
  timeline: [
    { year: "1876", event: "Court of Appeals created", meaning: "The new constitution separated major criminal appellate work from the Supreme Court." },
    { year: "1891", event: "Court of Criminal Appeals formally created by amendment", meaning: "Voters approved the name and judicial reorganization that established the modern criminal court of last resort." },
    { year: "1892", event: "New appellate structure begins operating", meaning: "Intermediate civil appellate courts took civil work while the CCA focused on criminal jurisdiction." },
    { year: "1920s", event: "Caseload pressures drive institutional adaptation", meaning: "Population and criminal appeals increased the need for additional judicial capacity and procedural development." },
    { year: "1966", event: "Court expands", meaning: "Constitutional changes increased judicial capacity as Texas's population and criminal docket grew." },
    { year: "1977–1978", event: "Nine-member court structure develops", meaning: "Expansion produced the presiding judge plus eight judges that define the modern court." },
    { year: "1980s–1990s", event: "Partisan competition intensifies", meaning: "Statewide judicial elections increasingly reflected Texas's broader partisan realignment." },
    { year: "2016", event: "Court marks 125 years under its current name", meaning: "The court commemorated the 1891 constitutional amendment that formally created the CCA." },
  ],
  sections: [
    { heading: "1. The 1876 Constitution created a separate criminal appellate path", paragraphs: ["Before 1876, the Texas Supreme Court had carried broad appellate responsibilities. The new constitution created a Court of Appeals with jurisdiction over criminal cases and certain civil matters, beginning the institutional separation that later became a fully divided civil and criminal appellate system.", "The change reflected both constitutional philosophy and workload. A growing state needed more appellate capacity, while the framers were willing to distribute judicial authority rather than concentrate every final appeal in one tribunal. That structural choice still affects voters because Texas elects judges to two different statewide high courts."] },
    { heading: "2. The 1891 amendment created the modern Court of Criminal Appeals", paragraphs: ["By 1891, Texas again reorganized its judicial article. Voters approved amendments establishing Courts of Civil Appeals and changing the Court of Appeals into the Court of Criminal Appeals. Governor Jim Hogg proclaimed the amendment part of the constitution after the vote was canvassed in September 1891.", "The new structure allowed intermediate civil courts to absorb much of the civil appellate workload while the CCA became the specialized court of last resort for criminal law. The division remains fundamental: the Texas Supreme Court and CCA are peers at the top of different subject-matter tracks rather than one being superior to the other."] },
    { heading: "3. Expansion followed population and caseload growth", paragraphs: ["A three-judge criminal high court was workable for a smaller nineteenth-century state but increasingly strained as population, prosecutions and appellate litigation expanded. Constitutional and statutory changes eventually enlarged the court to a presiding judge and eight additional judges, providing greater capacity for opinions, discretionary review and extraordinary writ proceedings.", "Modern criminal appellate procedure also became more complex through changes in statutes, rules and federal constitutional law. Death-penalty cases, post-conviction habeas corpus, discretionary review and statewide criminal-law questions can place the CCA at the center of issues far beyond a single trial. Its institutional growth reflects that expanding responsibility."] },
    { heading: "4. Statewide partisan elections connect the court to political history", paragraphs: ["CCA judges are elected statewide in partisan elections. For decades, Democratic dominance shaped judicial outcomes just as it did other statewide offices. As Republican voting strength increased, judicial races became part of the same statewide partisan transition that transformed the Supreme Court and executive branch.", "Judicial candidates are still judges rather than legislators: the court decides cases under law and precedent rather than enacting statutes. Yet selection through partisan elections means voters directly influence the court's membership. Vacancy appointments add another layer because governors may temporarily fill seats under constitutional rules before voters decide subsequent terms."] },
    { heading: "5. The CCA's separate role prevents confusion about Texas high-court decisions", paragraphs: ["A recurring source of confusion is the phrase 'Texas Supreme Court' being used generically for any final state case. That is incorrect for criminal law. The Court of Criminal Appeals is the final state tribunal for criminal matters within its jurisdiction, while the Supreme Court is the high court for civil and juvenile matters.", "For current election and legal coverage, identifying the correct court matters. A CCA race concerns statewide criminal jurisprudence, and a CCA opinion can affect prosecutors, defendants and trial courts across Texas without passing through the Supreme Court. Treating the two high courts as separate institutions is essential to accurate civic reporting."] },
  ],
  sources: [
    { href: "https://www.txcourts.gov/cca/", label: "Texas Court of Criminal Appeals" },
    { href: "https://www.txcourts.gov/cca/news/court-of-criminal-appeals-celebrates-125th-anniversary/", label: "Court of Criminal Appeals: 125th Anniversary history" },
    { href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.5.htm", label: "Texas Constitution, Article V" },
    { href: "https://www.txcourts.gov/5thcoa/about-the-court/history/", label: "Texas Judicial Branch: History of the appellate courts" },
    { href: "https://www.txcourts.gov/", label: "Texas Judicial Branch" },
  ],
  relatedLinks: [
    { href: "/texas-government/court-of-criminal-appeals", label: "Court of Criminal Appeals authority page", description: "Current judges, jurisdiction, powers and official resources." },
    { href: "/texas-government/supreme-court", label: "Texas Supreme Court", description: "Compare the state's separate civil court of last resort." },
    { href: "/texas-courts", label: "Texas courts hub", description: "Current trial and appellate court structure." },
    { href: "/texas-government/judicial-selection-elections", label: "Texas judicial selection and elections", description: "How voters and vacancy appointments place judges on Texas courts." },
    { href: "/elections/2026", label: "2026 Election Central", description: "Current statewide judicial election coverage." },
  ],
  faqs: [
    { question: "When was the Texas Court of Criminal Appeals created?", answer: "Its predecessor Court of Appeals was created by the Constitution of 1876. Voters approved the 1891 constitutional amendment that renamed and reorganized it as the Court of Criminal Appeals." },
    { question: "Is the Court of Criminal Appeals below the Texas Supreme Court?", answer: "No. Texas has separate courts of last resort. The CCA is the highest state court for criminal cases, while the Supreme Court is the highest state court for civil matters." },
    { question: "How are CCA judges chosen?", answer: "The presiding judge and eight judges are elected statewide in partisan elections for six-year terms, with constitutional procedures for filling vacancies." },
  ],
};

export const TEXAS_JUDICIAL_SELECTION_HISTORY: GovernmentHistoryAuthorityPage = {
  slug: "judicial-selection-elections",
  title: "Texas Judicial Selection and Election History",
  seoTitle: "Texas Judicial Elections and Selection: History, Terms and Vacancies | KeepTXRed",
  description: "A source-backed guide to how Texas moved between appointed and elected judges, why statewide courts use partisan elections, how vacancies are filled and what reform debates mean.",
  eyebrow: "Texas judicial elections",
  intro: "Texas has not always selected judges the same way. Republic-era appointments, elected state judges, Reconstruction appointments and the post-Reconstruction return to elections produced a long-running debate over accountability and judicial independence. Today, many Texas judges are chosen in partisan elections, while governors fill specified vacancies until voters participate under constitutional rules.",
  shortAnswer: "Texas judicial selection has alternated between appointment and election across different constitutions. The Constitution of 1876 restored popular election for major courts after the appointed judiciary of the 1869 Reconstruction constitution. Today Supreme Court justices and Court of Criminal Appeals judges are elected statewide in partisan elections for six-year terms, while courts of appeals and many trial judges are also elected within their jurisdictions. When covered vacancies occur, the governor may appoint a replacement under constitutional procedures, generally creating an interim period before an election determines a longer term.",
  reviewed: REVIEWED,
  timeline: [
    { year: "1836", event: "Republic uses appointed chief justice", meaning: "The Republic's Congress selected the Supreme Court chief justice, establishing an early appointment model." },
    { year: "1845", event: "State constitution reorganizes judiciary", meaning: "Statehood created a new judicial selection system under the first state constitution." },
    { year: "1850", event: "Judicial election amendment expands popular selection", meaning: "Texas moved toward direct election of judges before the Civil War." },
    { year: "1866", event: "Reconstruction constitution uses elections", meaning: "Judges were elected under the first postwar constitution, though military Reconstruction soon disrupted the bench." },
    { year: "1869", event: "Constitution shifts to appointment", meaning: "The Reconstruction charter made judicial offices appointive." },
    { year: "1876", event: "Popular judicial elections return", meaning: "The current constitution restored elected judges as part of a broader reaction against centralized power." },
    { year: "1891", event: "Appellate system reorganized", meaning: "New courts expanded the number and types of judicial offices selected under the constitutional system." },
    { year: "1980s–present", event: "Partisan judicial elections become highly competitive", meaning: "Realignment, campaign finance and statewide party voting intensified attention to judicial selection reform." },
  ],
  sections: [
    { heading: "1. Texas has repeatedly switched between appointment and election", paragraphs: ["Judicial selection in Texas is not an unbroken tradition. The Republic used appointment for its chief justice, and early state constitutions experimented with different systems. A pre-Civil War amendment moved more judicial offices toward popular election. Reconstruction then reopened the question as successive constitutions alternated the mechanism again.", "The 1869 constitution's appointed judiciary became associated with Reconstruction government, while the Constitution of 1876 restored elections as part of a wider movement to disperse authority and return offices directly to voters. That historical context explains why judicial-election reform debates in Texas are often arguments about constitutional identity as well as administrative efficiency."] },
    { heading: "2. Texas now uses partisan elections for major appellate courts", paragraphs: ["Candidates for the Supreme Court and Court of Criminal Appeals run in party primaries and statewide general elections. Intermediate appellate judges run within court districts, and many district and county-level judicial offices are also elected. Terms and qualifications vary by court, but the highest statewide courts use six-year terms.", "Partisan labels give voters information about candidates in low-information races, but critics argue that party sweeps can remove judges for reasons unrelated to individual performance. Supporters emphasize direct democratic accountability. That tension has driven repeated proposals for appointment-retention systems, nonpartisan elections or other reforms without displacing the constitutional system of elections."] },
    { heading: "3. Vacancy appointments create a hybrid system", paragraphs: ["Even in an elected judiciary, not every judge first reaches office through a scheduled election. When a covered vacancy occurs, the governor may appoint a qualified replacement under Article V and related law. The appointment generally lasts only through the constitutionally defined period until voters can fill the seat.", "That hybrid structure gives governors meaningful influence over judicial composition while preserving elections as the long-term selection mechanism. A governor serving multiple terms may receive many opportunities to fill vacancies, and appointed judges often later appear on the ballot as incumbents. Election reporting should therefore distinguish between the method by which a judge first took office and the elections that followed."] },
    { heading: "4. Partisan realignment changed the practical operation of judicial elections", paragraphs: ["When Texas was overwhelmingly Democratic, winning the Democratic nomination often determined statewide judicial outcomes. Republican growth in the late twentieth century made general elections competitive and eventually produced Republican control of both high courts. The same electoral mechanism therefore yielded very different partisan results as the electorate realigned.", "Straight-ticket voting, ballot length and limited public knowledge of judicial candidates became recurring concerns in reform debates. Texas later eliminated one-punch straight-ticket voting, but party cues remain visible in partisan judicial races. The underlying policy question persists: how should a state balance voter control, judicial independence, candidate information and campaign politics?"] },
    { heading: "5. Reform proposals must confront the Texas Constitution", paragraphs: ["Major changes to selection of constitutional judges generally require constitutional action rather than an ordinary administrative decision. That raises the threshold for reform because lawmakers must approve a proposed amendment and voters must ratify it. Past commissions and legislative proposals have therefore operated within a process designed to make structural change deliberate.", "For voters, the current practical rule is straightforward: statewide high-court races are real elections with consequences for court membership, and vacancy appointments can affect who appears as an incumbent. Understanding both pathways makes judicial ballots easier to interpret and prevents the mistaken assumption that Texas judges are selected the same way as federal judges."] },
  ],
  sources: [
    { href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.5.htm", label: "Texas Constitution, Article V" },
    { href: "https://www.txcourts.gov/supreme/about-the-court/court-history/supreme-court-judicial-election-history.aspx", label: "Supreme Court of Texas: Judicial Election History" },
    { href: "https://www.txcourts.gov/", label: "Texas Judicial Branch" },
    { href: "https://www.sos.state.tx.us/elections/", label: "Texas Secretary of State: Elections" },
    { href: "https://lrl.texas.gov/", label: "Legislative Reference Library of Texas" },
  ],
  relatedLinks: [
    { href: "/texas-government/texas-supreme-court-history", label: "Texas Supreme Court history", description: "How constitutional changes shaped the state's highest civil court." },
    { href: "/texas-government/court-of-criminal-appeals-history", label: "Court of Criminal Appeals history", description: "The evolution of Texas's separate criminal court of last resort." },
    { href: "/texas-politics/texas-election-history", label: "Texas election history", description: "How primaries, parties and statewide voting changed over time." },
    { href: "/texas-politics/voting-rights-history", label: "Texas voting-rights history", description: "The broader legal history of access to Texas elections." },
    { href: "/elections/2026", label: "2026 Election Central", description: "Current races, candidates and voting information." },
  ],
  faqs: [
    { question: "Are Texas Supreme Court justices elected?", answer: "Yes. Supreme Court justices are elected statewide in partisan elections for six-year terms, with gubernatorial appointments used to fill covered vacancies under constitutional rules." },
    { question: "Has Texas always elected judges?", answer: "No. Texas has alternated between appointment and election under different constitutions. The 1869 Reconstruction constitution used appointments, while the Constitution of 1876 restored elections." },
    { question: "Are Texas judges selected like federal judges?", answer: "No. Federal Article III judges are nominated by the president and confirmed by the Senate for life tenure during good behavior. Texas uses elections for many state judges and constitutional procedures for temporary vacancy appointments." },
  ],
};

export const GOVERNMENT_HISTORY_AUTHORITY_PAGES: GovernmentHistoryAuthorityPage[] = [
  TEXAS_GOVERNMENT_HISTORY,
  TEXAS_LEGISLATURE_HISTORY,
  TEXAS_GOVERNOR_HISTORY,
  TEXAS_LIEUTENANT_GOVERNOR_HISTORY,
  TEXAS_SPEAKER_HISTORY,
  TEXAS_SUPREME_COURT_HISTORY,
  TEXAS_CCA_HISTORY,
  TEXAS_JUDICIAL_SELECTION_HISTORY,
];
