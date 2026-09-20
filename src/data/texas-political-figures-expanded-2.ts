import type { TexasPoliticalFigure } from "@/data/texas-political-figures";

type SourcedTexasPoliticalFigure = TexasPoliticalFigure & {
  sources: Array<{ href: string; label: string }>;
};

export const MORE_TEXAS_POLITICAL_FIGURES: SourcedTexasPoliticalFigure[] = [
  {
    slug: "price-daniel-texas-governor-attorney-general-senator",
    name: "Price Daniel",
    kicker: "A conservative Democrat whose career spanned nearly every branch of Texas government",
    description: "Price Daniel served as Texas House speaker, attorney general, U.S. senator, governor and Texas Supreme Court justice, making his career a useful bridge between the old Democratic order and the later Republican realignment.",
    years: "1910–1988",
    texasRole: "Texas attorney general, U.S. senator, governor and Texas Supreme Court justice",
    sections: [
      { heading: "A career built inside one-party Democratic Texas", body: "Marion Price Daniel Sr. rose when the Democratic Party still dominated Texas politics. A Liberty lawyer, he won election to the Texas House in 1938 and became associated with the 'Immortal 56,' legislators who opposed a state sales tax. His colleagues elected him speaker in 1943. Daniel then left state office for military service during World War II, serving as an Army judge advocate in the Pacific. His early career illustrates why modern party labels cannot simply be projected backward: many of the state's most fiscally conservative politicians still operated entirely inside the Democratic system." },
      { heading: "Attorney general and the Tidelands fight", body: "After the war, Daniel won election as Texas attorney general. One of the defining legal battles of his tenure involved the Tidelands—oil-rich submerged lands claimed by Texas. The dispute became a major states' rights and education-funding issue because revenue from the lands was tied to the Permanent School Fund. Daniel's advocacy on the issue overlapped with Governor Allan Shivers's political campaign against federal control. The controversy later helped drive Shivers and other conservative Democrats toward Dwight Eisenhower in the 1952 presidential election, making Daniel's legal work part of the background to an early break in Democratic presidential loyalty." },
      { heading: "From the U.S. Senate to the governor's office", body: "Daniel won election to the U.S. Senate in 1952 and served until resigning to become governor. He entered the governor's office in January 1957 and served three two-year terms through January 1963. His administration dealt with public finance, education, water, insurance regulation and the changing demands of a rapidly urbanizing state. Daniel remained a Democrat, but his combination of fiscal conservatism, states' rights arguments and Texas-centered policy shows why the state's partisan transition cannot be explained simply as conservative voters suddenly appearing in the Republican Party." },
      { heading: "A later role on the Texas Supreme Court", body: "Governor Preston Smith appointed Daniel to the Texas Supreme Court in 1971. He subsequently won election and served roughly eight years on the court. The Handbook of Texas notes his influence in groundwater and mineral-law cases, including disputes involving oil, gas and uranium. That judicial service completed an unusual institutional arc: Daniel had served in legislative leadership, as the state's chief legal officer, in the U.S. Senate, as governor and on the state's highest civil court. Few Texas political careers crossed so many different centers of governmental power." },
      { heading: "Why Daniel belongs in a Republican-realignment history", body: "Price Daniel was not a Republican, and a credible history should not relabel him as one. He matters because his career reveals the conservative Democratic system from which modern Republican Texas emerged. Daniel's Tidelands work, tax skepticism and statewide popularity coexisted with Democratic party membership at a time when conservative Texans were beginning to split their presidential and state ballots. Read alongside Allan Shivers and John Connally, Daniel helps explain the political world that existed before John Tower, Bill Clements and later Republican officeholders converted conservative voting tendencies into a durable party organization." }
    ],
    relatedLinks: [
      { href: "/texas-politics/figures/allan-shivers-texas-shivercrats-realignment", label: "Allan Shivers profile" },
      { href: "/texas-politics/figures/john-connally-texas-governor-party-switch", label: "John Connally profile" },
      { href: "/texas-politics/how-texas-became-republican", label: "How Texas became Republican" }
    ],
    sources: [
      { href: "https://www.tshaonline.org/handbook/entries/daniel-marion-price-sr", label: "Handbook of Texas: Price Daniel" },
      { href: "https://www.tsl.texas.gov/governors/modern/daniel-p01.html", label: "Texas State Library: Price Daniel" },
      { href: "https://www.tsl.texas.gov/governors/modern/index.html", label: "Texas State Library: modern Texas governors" }
    ]
  },
  {
    slug: "rb-creager-early-texas-republican-leader",
    name: "R.B. Creager",
    kicker: "Building Texas Republican organization before the modern breakthrough",
    description: "Rentfro Banton Creager led Texas Republican politics for decades from Brownsville, served on the Republican National Committee and helped maintain a statewide GOP organization during the long era of Democratic dominance.",
    years: "1877–1950",
    texasRole: "Texas Republican leader and Republican National Committeeman",
    sections: [
      { heading: "A Republican career in overwhelmingly Democratic Texas", body: "Rentfro Banton 'R.B.' Creager built his political career when Republicans were a small minority in Texas. A lawyer based in Brownsville, he served as customs collector under Republican presidents Theodore Roosevelt and William Howard Taft and became the Republican nominee for governor in 1916. He did not come close to overturning Democratic dominance, but his career illustrates a basic organizational problem facing the early GOP: the party still needed candidates, patronage networks and local leaders even when statewide victory was improbable." },
      { heading: "National Republican connections", body: "Creager became a prominent figure at Republican national conventions and developed relationships with national party leaders. The Handbook of Texas records that he seconded Warren G. Harding's nomination in 1920, supported Herbert Hoover before the 1928 convention and later worked on behalf of Alfred Landon and Robert Taft. Those connections gave Texas Republicans access to a national political network that was far stronger than the party's position inside Texas government. Creager was even offered the ambassadorship to Mexico by Presidents Harding and Coolidge, though he declined." },
      { heading: "Republican National Committeeman for Texas", body: "After the death of Henry F. MacGregor, Creager became Texas's member of the Republican National Committee in 1923 and held the position until his death in 1950. That long tenure made him one of the central organizational figures in the state party. The Handbook of Texas describes major party changes under Creager's leadership as Republicans tried to appeal to Texans sympathetic to national Republican programs, particularly pro-business policies emphasizing lower taxes, less regulation and restrained government spending." },
      { heading: "The limits and complications of the early party", body: "The early Texas Republican Party also carried deep factional and racial conflicts. Party organization in the late nineteenth and early twentieth centuries was shaped by struggles between Black-and-Tan Republicans, who included African-American participation, and Lily-White factions that sought to reduce Black influence. Creager's era cannot be understood only as a clean prehistory of modern conservatism. The party he helped lead operated inside the racial politics and patronage structures of its time while also trying to build a more electorally viable pro-business organization." },
      { heading: "Why Creager matters to the modern story", body: "Creager died in 1950, just before the presidential defections associated with Allan Shivers and Dwight Eisenhower began to make Republican voting much more common among conservative Texans. His significance is therefore organizational rather than electoral: he helped keep a Texas Republican structure connected to the national party during decades when statewide success was rare. Later leaders inherited a party that already had committees, donors, activists and national relationships. The modern breakthrough did not start from zero in 1952, and Creager is one of the clearest figures showing why." }
    ],
    relatedLinks: [
      { href: "/texas-politics/how-texas-became-republican", label: "How Texas became Republican" },
      { href: "/texas-politics/figures/allan-shivers-texas-shivercrats-realignment", label: "Allan Shivers profile" },
      { href: "/texas-politics/figures/john-tower-texas-senator-republican-breakthrough", label: "John Tower profile" }
    ],
    sources: [
      { href: "https://www.tshaonline.org/handbook/entries/creager-rentfro-banton", label: "Handbook of Texas: Rentfro Banton Creager" },
      { href: "https://www.tshaonline.org/handbook/entries/republican-party", label: "Handbook of Texas: Republican Party" }
    ]
  },
  {
    slug: "sam-johnson-texas-congressman-pow",
    name: "Sam Johnson",
    kicker: "Combat veteran, Vietnam POW and long-serving North Texas congressman",
    description: "Sam Johnson served nearly three decades in the Air Force, endured almost seven years as a Vietnam prisoner of war and later represented North Texas in Congress from 1991 through 2019.",
    years: "1930–2020",
    texasRole: "U.S. representative from Texas, 1991–2019",
    sections: [
      { heading: "A military career before elective office", body: "Sam Johnson's public life began in the Air Force rather than politics. He flew combat missions in the Korean and Vietnam wars, served with the Air Force Thunderbirds and eventually directed the Air Force Fighter Weapons School. House records list an extensive set of decorations, including two Silver Stars, two Legions of Merit, the Distinguished Flying Cross, a Bronze Star with Valor and two Purple Hearts. That military record became inseparable from his later political identity, particularly on questions of national defense and service." },
      { heading: "Nearly seven years as a prisoner of war", body: "Johnson was shot down over North Vietnam in 1966 and captured. He remained a prisoner until 1973, spending years in harsh conditions that included a long period of solitary confinement. Official House and Ways and Means accounts describe nearly seven years in captivity. His POW experience gave Johnson a personal authority on military sacrifice that few members of Congress could match. It also shaped the language he used about freedom, duty and the obligations of public service after returning to Texas." },
      { heading: "From the Texas House to Congress", body: "After retiring from the Air Force, Johnson entered business and then politics. He served in the Texas House from 1985 through 1991 before winning a special election to Congress in May 1991. He represented North Texas for the remainder of that Congress and thirteen additional Congresses, leaving office in January 2019. His tenure overlapped the period when Dallas-area suburbs moved from an emerging Republican base into one of the institutional centers of the Texas GOP." },
      { heading: "Ways and Means and Social Security", body: "Johnson joined the House Ways and Means Committee in 1995 and later chaired its Social Security Subcommittee. The committee highlighted his work on Social Security administration and program-integrity legislation and, in 2016, named a Rayburn House Office Building hearing room the 'Sam Johnson Room.' Committee leadership gave Johnson a policy role beyond his better-known military biography, placing a Texas Republican veteran inside one of Congress's most consequential tax and entitlement committees." },
      { heading: "A different kind of congressional profile", body: "Johnson's career is useful within a Texas political authority cluster because it combines three distinct stories: Cold War military service, the growth of Republican North Texas and the accumulation of congressional seniority after the GOP became competitive. Unlike national leadership figures such as Dick Armey or Tom DeLay, Johnson was defined less by partisan strategy than by personal biography and committee service. That contrast helps show the range of careers produced by the same broader Texas Republican rise." }
    ],
    relatedLinks: [
      { href: "/texas-politics/figures/kevin-brady-texas-ways-means-chair", label: "Kevin Brady profile" },
      { href: "/texas-politics/figures/dick-armey-texas-house-majority-leader", label: "Dick Armey profile" },
      { href: "/texas-politics/how-texas-became-republican", label: "How Texas became Republican" }
    ],
    sources: [
      { href: "https://history.house.gov/People/Detail/15916", label: "U.S. House Historian: Sam Johnson" },
      { href: "https://waysandmeans.house.gov/2020/05/27/brady-statement-on-the-passing-of-sam-johnson/", label: "House Ways and Means: Sam Johnson service record" },
      { href: "https://waysandmeans.house.gov/2018/09/27/chairman-johnson-american-hero-gavels-final-hearing-as-subcommittee-chair/", label: "House Ways and Means: Johnson's final hearing as subcommittee chair" }
    ]
  },
  {
    slug: "lamar-smith-texas-judiciary-science-chair",
    name: "Lamar Smith",
    kicker: "Three major House committee chairmanships across a 32-year congressional career",
    description: "Lamar Smith represented a San Antonio- and Hill Country-based district for sixteen terms and chaired the House Ethics, Judiciary, and Science, Space and Technology committees.",
    years: "Born 1947",
    texasRole: "U.S. representative from Texas, 1987–2019",
    sections: [
      { heading: "From Bexar County government to Congress", body: "Lamar Smith moved through several levels of Texas government before entering Congress. A journalist and lawyer, he served in the Texas House and then as a Bexar County commissioner. He won election to Congress in 1986 and took office in January 1987. Smith ultimately served sixteen terms, making him part of the long-tenured Texas Republican delegation that accumulated committee seniority as the state's GOP strength expanded." },
      { heading: "Judiciary Committee leadership", body: "House historical records show Smith chairing the Judiciary Committee during the 112th Congress. The committee's jurisdiction includes immigration, intellectual property, federal courts, constitutional questions and criminal law. Smith's chairmanship therefore placed a Texas Republican at the center of debates whose effects reached well beyond his district. His tenure also made him part of a broader pattern in which long-serving Texans converted electoral durability into control of major national policy committees." },
      { heading: "Science, Space and Technology", body: "Smith next chaired the House Science, Space and Technology Committee during the 113th, 114th and 115th Congresses. The committee oversees federal science agencies, NASA-related policy, research programs and major parts of environmental and technology policy. Smith's leadership was frequently contentious, especially around climate and environmental research, where supporters emphasized oversight and skepticism toward regulatory claims while critics argued the committee was challenging established scientific findings too aggressively. That conflict is a durable part of his public record." },
      { heading: "Legislative influence and controversy", body: "Smith's long career included work on immigration enforcement, intellectual property, internet policy and federal research oversight. Some proposals drew broad support, while others generated intense opposition from technology groups, civil-liberties advocates or Democrats. His role in copyright and online-enforcement debates, in particular, demonstrated how a committee chairman can become nationally significant even without holding a top elected leadership post. The substance and controversy of those debates are more informative than reducing his record to a generic conservative label." },
      { heading: "The committee-seniority model of Texas power", body: "Smith retired from Congress in January 2019 after thirty-two years. His path resembles Kevin Brady and Jeb Hensarling more than headline-driven national figures: win a durable Texas district, build expertise and seniority, and eventually control a committee with broad federal jurisdiction. Together those careers show one of the less visible consequences of Texas's Republican rise. A strong state party did not simply produce governors and senators; it created enough durable House seats for Texans to shape national policy through congressional institutions." }
    ],
    relatedLinks: [
      { href: "/texas-politics/figures/kevin-brady-texas-ways-means-chair", label: "Kevin Brady profile" },
      { href: "/texas-politics/figures/jeb-hensarling-texas-financial-services-chair", label: "Jeb Hensarling profile" },
      { href: "/texas-politics/how-texas-became-republican", label: "How Texas became Republican" }
    ],
    sources: [
      { href: "https://history.house.gov/People/Listing/S/SMITH%2C-Lamar-Seeligson-%28S000583%29/", label: "U.S. House Historian: Lamar Smith" }
    ]
  },
  {
    slug: "mac-thornberry-texas-armed-services-chair",
    name: "Mac Thornberry",
    kicker: "National-defense leadership from the Texas Panhandle",
    description: "Mac Thornberry represented a sprawling North and West Texas district from 1995 through 2021 and chaired the House Armed Services Committee during the 114th and 115th Congresses.",
    years: "Born 1958",
    texasRole: "U.S. representative from Texas, 1995–2021; House Armed Services chair, 2015–2019",
    sections: [
      { heading: "A Panhandle path to Washington", body: "William McClellan 'Mac' Thornberry grew up in Clarendon, graduated from Texas Tech and the University of Texas School of Law, and worked on Capitol Hill and at the State Department before returning to Texas. He won election to Congress in 1994 as part of the Republican wave that also transformed control of the U.S. House. Thornberry's district covered a large swath of North and West Texas, giving him a political base very different from the suburban districts that powered other parts of the state's Republican growth." },
      { heading: "Two decades building defense expertise", body: "Thornberry served thirteen terms from January 1995 through January 2021. House records show his eventual chairmanship of the Armed Services Committee during the 114th and 115th Congresses. Reaching that position required years of committee work on military readiness, procurement, nuclear forces, intelligence and defense strategy. The result was a Texas member with substantial influence over the annual National Defense Authorization Act and the organization of the Pentagon." },
      { heading: "Reforming defense acquisition", body: "A recurring theme of Thornberry's chairmanship was the Pentagon acquisition system: how the military buys weapons, technology and services. He pushed for changes intended to speed procurement, reduce bureaucracy and give military services more responsibility for acquisition decisions. Supporters argued that the existing system was too slow for rapid technological competition. Critics of procurement reform generally warned that faster processes could weaken oversight or produce new forms of waste. Thornberry's policy legacy is therefore tied to the continuing tension between speed, accountability and defense-industrial complexity." },
      { heading: "The NDAA that carries his name", body: "Congress named the National Defense Authorization Act for Fiscal Year 2021 for William M. 'Mac' Thornberry. House Armed Services Committee records list Public Law 116-283 as the William M. (Mac) Thornberry National Defense Authorization Act for Fiscal Year 2021. Naming the annual defense policy law for a retiring member was an institutional recognition of his long committee service and reinforced the extent to which his congressional identity had become associated with national defense rather than broader partisan leadership." },
      { heading: "Why Thornberry matters in the Texas delegation", body: "Thornberry did not become a governor, senator or House party leader, but his committee career illustrates another form of durable power. Texas's Republican congressional growth produced members from very different regional bases who could specialize and accumulate seniority. Alongside Lamar Smith, Kevin Brady and Jeb Hensarling, Thornberry shows how the state's political realignment translated into national committee gavels across science, taxes, finance and defense." }
    ],
    relatedLinks: [
      { href: "/texas-politics/figures/lamar-smith-texas-judiciary-science-chair", label: "Lamar Smith profile" },
      { href: "/texas-politics/figures/kevin-brady-texas-ways-means-chair", label: "Kevin Brady profile" },
      { href: "/texas-politics/how-texas-became-republican", label: "How Texas became Republican" }
    ],
    sources: [
      { href: "https://history.house.gov/People/Detail/22922", label: "U.S. House Historian: Mac Thornberry" },
      { href: "https://armedservices.house.gov/ndaa/history-ndaa.htm", label: "House Armed Services Committee: history of the NDAA" }
    ]
  },
  {
    slug: "david-dewhurst-texas-lieutenant-governor",
    name: "David Dewhurst",
    kicker: "Twelve years presiding over the Texas Senate before the Tea Party era reshaped GOP primaries",
    description: "David Dewhurst served as Texas land commissioner and then lieutenant governor from 2003 through 2015, presiding over the Senate during a major period of Republican legislative consolidation.",
    years: "Born 1945",
    texasRole: "Texas land commissioner, 1999–2003; lieutenant governor, 2003–2015",
    sections: [
      { heading: "From statewide land office to lieutenant governor", body: "David Dewhurst won election as Texas land commissioner and served from 1999 until 2003. He then won the lieutenant governorship and took office in January 2003. The timing was historically significant: Republicans had just won control of the Texas House, so Dewhurst entered the Senate presidency as the GOP consolidated control across statewide executive offices and both legislative chambers. He would serve twelve years as lieutenant governor, spanning the 78th through the opening of the 84th Legislature." },
      { heading: "Why the lieutenant governorship is powerful", body: "The Texas lieutenant governor is elected statewide but exercises much of the office's practical power inside the Senate. The presiding officer influences committee assignments, bill referrals and the flow of legislation, making the job one of the strongest legislative posts in the state. Dewhurst's long tenure therefore placed him at the center of budgets, school finance, taxes, business policy and social-policy debates during a period when Republican control became the normal condition of Texas government rather than a new breakthrough." },
      { heading: "Governing with changing House speakers", body: "Dewhurst's Senate tenure overlapped with Speakers Tom Craddick and Joe Straus and Governor Rick Perry. Those relationships mattered because Texas lawmaking requires coordination across institutions whose leaders may represent different factions of the same party. The 2000s and early 2010s featured repeated disputes over school finance, transportation, property taxes, budgets and legislative procedure. Dewhurst's record belongs to the institutional phase of Republican Texas, when the central question was increasingly how a GOP-controlled government would manage internal disagreements." },
      { heading: "The 2012 Senate primary and a changing Republican electorate", body: "Dewhurst's 2012 campaign for the U.S. Senate became one of the most visible signs that the Texas Republican primary electorate was changing. He entered the race with statewide experience and establishment support but lost the runoff to Ted Cruz, who ran with strong Tea Party and movement-conservative backing. The result did not erase Dewhurst's statewide record, but it revealed a new political incentive: long service inside Republican government could itself become a liability among voters demanding a more confrontational conservative style." },
      { heading: "The handoff to Dan Patrick", body: "Dewhurst lost the 2014 Republican primary for lieutenant governor to Dan Patrick and left office in January 2015. Patrick's succession marked a shift in tone and coalition inside the same Republican-controlled institution. Comparing the two is useful because it separates party control from factional change. Texas remained Republican throughout, but the priorities, messaging and relationship between Senate leadership and grassroots activists evolved substantially. Dewhurst is therefore a key figure in the transition from early GOP institutional consolidation to the movement-driven politics of the 2010s." }
    ],
    relatedLinks: [
      { href: "/texas-politics/figures/dan-patrick-texas-lieutenant-governor", label: "Dan Patrick profile" },
      { href: "/texas-politics/figures/rick-perry-texas-governor-energy-legacy", label: "Rick Perry profile" },
      { href: "/texas-legislature/senate", label: "Texas Senate guide" }
    ],
    sources: [
      { href: "https://lrl.texas.gov/legeleaders/leadership/ltgovPage.cfm?ltgovID=41", label: "Texas Legislative Reference Library: Lt. Governor David Dewhurst" },
      { href: "https://lrl.texas.gov/legeleaders/leadership/ltgovbrowse.cfm", label: "Texas Legislative Reference Library: lieutenant governors of Texas" }
    ]
  },
  {
    slug: "nathan-hecht-texas-supreme-court-chief-justice",
    name: "Nathan Hecht",
    kicker: "The longest-serving member of the Texas Supreme Court",
    description: "Nathan Hecht served on the Texas Supreme Court from 1988 through 2024 and was chief justice from 2013 until his retirement, with a major institutional focus on court administration and access to civil legal services.",
    years: "Texas Supreme Court service, 1988–2024",
    texasRole: "27th chief justice of the Supreme Court of Texas, 2013–2024",
    sections: [
      { heading: "A record-setting tenure on the Texas Supreme Court", body: "Nathan Hecht first won election to the Supreme Court of Texas in 1988 after earlier service on a district court and court of appeals. He remained on the court through December 31, 2024, becoming the longest-serving member in the court's history. Governor Rick Perry appointed him chief justice in 2013, and voters subsequently elected him to that position in 2014 and 2020. His career spans almost the entire period in which Texas's statewide judiciary shifted from competitive partisan control to sustained Republican electoral dominance." },
      { heading: "Chief justice as institutional administrator", body: "The chief justice does more than cast a vote in individual cases. The office has a central role in judicial administration, procedural rules and the statewide court system. The Supreme Court's official history credits Hecht with overseeing revisions to rules of administration, practice and procedure. He also served on national judicial bodies, including a federal advisory committee on civil rules and the Conference of Chief Justices. Those responsibilities make his institutional record as important as any single high-profile opinion." },
      { heading: "Access to justice and civil legal services", body: "Hecht repeatedly emphasized access to civil legal services for Texans who could not afford counsel. The court's biography specifically highlights efforts to improve basic civil legal assistance for people living below the poverty level and others with limited means. That work complicates any attempt to describe a judge solely through a partisan election label. Texas elects Supreme Court justices in partisan contests, but the chief justice also administers a court system whose responsibilities include procedural fairness, legal aid and statewide judicial capacity." },
      { heading: "Partisan elections and the Republican judicial era", body: "Hecht was first elected in 1988, the same year Texas Republicans were beginning to achieve major statewide judicial breakthroughs. Over the following decade the Supreme Court moved to an all-Republican elected membership. That history makes Hecht relevant to the broader political realignment, but judicial independence still requires a distinction between party identification and a claim that every court decision is partisan. A useful profile should explain the electoral system and historical context without treating judicial outcomes as campaign talking points." },
      { heading: "Retirement in 2024 and succession", body: "Hecht retired effective December 31, 2024. Governor Greg Abbott appointed Justice James D. Blacklock as the 28th chief justice effective January 6, 2025. This corrects a stale claim in the uploaded political-fact list that still described Hecht as the current chief justice. The distinction is exactly why evergreen profiles should use dated service records and authoritative court sources rather than freezing time-sensitive political facts into permanent copy." }
    ],
    relatedLinks: [
      { href: "/texas-politics/figures/wallace-jefferson-texas-supreme-court-chief-justice", label: "Wallace Jefferson profile" },
      { href: "/texas-politics/how-texas-became-republican", label: "How Texas became Republican" },
      { href: "/texas-government", label: "Texas Government" }
    ],
    sources: [
      { href: "https://www.txcourts.gov/supreme/about-the-court/court-history/justices-since-1945/chief-justices/nathan-l-hecht/", label: "Supreme Court of Texas: Nathan L. Hecht" },
      { href: "https://www.txcourts.gov/supreme/news/chief-justice-nathan-l-hecht-to-retire-from-the-supreme-court-of-texas/", label: "Supreme Court of Texas: Hecht retirement announcement" },
      { href: "https://www.txcourts.gov/supreme/about-the-court/court-history/justices-since-1945/chief-justices/", label: "Supreme Court of Texas: chief justices history" }
    ]
  },
  {
    slug: "wallace-jefferson-texas-supreme-court-chief-justice",
    name: "Wallace B. Jefferson",
    kicker: "The first African-American justice and chief justice of the Supreme Court of Texas",
    description: "Wallace B. Jefferson made Texas history as the first African-American justice and chief justice of the Supreme Court of Texas, serving on the court from 2001 through 2013.",
    years: "Texas Supreme Court service, 2001–2013",
    texasRole: "Chief justice of the Supreme Court of Texas, 2004–2013",
    sections: [
      { heading: "A historic appointment to the Texas Supreme Court", body: "Governor Rick Perry appointed Wallace B. Jefferson to the Supreme Court of Texas in March 2001. Jefferson became the first African-American justice in the court's history. Perry later named him chief justice in 2004, making him the first African-American chief justice as well. He subsequently won statewide election to continue in the office. Those milestones made Jefferson an important figure in the institutional history of a court that had changed dramatically during the broader Republican realignment of Texas statewide elections." },
      { heading: "A lawyer with appellate experience", body: "Before joining the court, Jefferson built a practice centered on appellate litigation and had argued before the U.S. Supreme Court, the Supreme Court of Texas and the Fifth Circuit. That background shaped a career focused heavily on judicial process and appellate administration. His official court biography identifies him as board certified in civil appellate law and records his later service in professional legal organizations, placing his tenure within the professional as well as electoral history of the Texas judiciary." },
      { heading: "Access to justice and statewide electronic filing", body: "As chief justice, Jefferson led efforts to support access-to-justice programs and helped establish statewide electronic filing for Texas courts. The court also credits his tenure with work on juvenile-justice reform. These administrative initiatives are important because chief justices influence how the judicial system functions beyond the opinions issued in individual cases. Electronic filing, legal-service funding and court-system reform affect lawyers, litigants and local courts across the state regardless of party." },
      { heading: "Judicial elections require careful political framing", body: "Jefferson was appointed by a Republican governor and elected in Texas's partisan judicial system, but a historical profile should not reduce a judge to party affiliation. Texas Supreme Court justices appear on partisan ballots, so their elections are part of the state's political realignment. At the same time, the institutional legitimacy of courts depends on deciding cases through law rather than campaign loyalty. KTR's political history therefore treats the partisan electoral structure as context while separately describing the justice's administrative and legal record." },
      { heading: "Resignation and the transition to Nathan Hecht", body: "Jefferson resigned from the court effective October 2013 and returned to private appellate practice. Nathan Hecht succeeded him as chief justice and served through the end of 2024. Read together, their careers cover more than two decades of Supreme Court leadership during a period when Republicans consistently won statewide judicial elections. Jefferson's legacy is especially durable because it combines a historic representational milestone with concrete institutional changes in access to justice and electronic court administration." }
    ],
    relatedLinks: [
      { href: "/texas-politics/figures/nathan-hecht-texas-supreme-court-chief-justice", label: "Nathan Hecht profile" },
      { href: "/texas-politics/figures/rick-perry-texas-governor-energy-legacy", label: "Rick Perry profile" },
      { href: "/texas-government", label: "Texas Government" }
    ],
    sources: [
      { href: "https://www.txcourts.gov/supreme/about-the-court/court-history/justices-since-1945/chief-justices/wallace-b-jefferson/", label: "Supreme Court of Texas: Wallace B. Jefferson" },
      { href: "https://www.txcourts.gov/supreme/about-the-court/court-history/supreme-court-judicial-election-history.aspx", label: "Supreme Court of Texas: judicial election history" }
    ]
  }
];
