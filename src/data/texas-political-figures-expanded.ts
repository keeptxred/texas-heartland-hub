import type { TexasPoliticalFigure } from "@/data/texas-political-figures";

type SourcedTexasPoliticalFigure = TexasPoliticalFigure & {
  sources: Array<{ href: string; label: string }>;
};

export const ADDITIONAL_TEXAS_POLITICAL_FIGURES: SourcedTexasPoliticalFigure[] = [
  {
    slug: "allan-shivers-texas-shivercrats-realignment",
    name: "Allan Shivers",
    kicker: "The Shivercrats and Texas's pre-Republican realignment",
    description: "Allan Shivers governed Texas as a Democrat but broke with the national party over the Tidelands dispute and backed Dwight Eisenhower, helping foreshadow the state's later Republican realignment.",
    years: "1907–1985",
    texasRole: "37th governor of Texas, 1949–1957",
    sections: [
      { heading: "A conservative Democrat in a one-party state", body: "Allan Shivers rose when winning the Democratic primary was usually the decisive political contest in Texas. He served in the Texas Senate, entered World War II military service, became lieutenant governor and moved into the governor's office after Governor Beauford Jester died in 1949. Shivers was not a Republican, and describing him as one would flatten the political world he inhabited. His importance to Republican history is that he showed how conservative Texas Democrats could separate their state loyalties and policy preferences from the national Democratic ticket long before a durable statewide GOP majority existed." },
      { heading: "The Tidelands fight", body: "The defining federalism dispute of Shivers's governorship concerned submerged Gulf lands known as the Tidelands. Texas claimed title extending three marine leagues from shore and dedicated important oil revenue from those lands to public education. The Truman administration and federal government asserted federal control, turning the issue into a major states' rights fight. Shivers made recovery of the Tidelands a central cause. Dwight Eisenhower supported state ownership during the 1952 presidential campaign, while Democratic nominee Adlai Stevenson did not accept the Texas position. That disagreement gave Shivers a concrete policy reason to break party ranks." },
      { heading: "Backing Eisenhower in 1952", body: "Shivers endorsed Republican Dwight Eisenhower for president in 1952 while remaining a Democratic governor. Conservative Democrats who followed that course became known as Shivercrats. Eisenhower carried Texas, a striking result in a state that had been overwhelmingly Democratic in presidential politics for generations. After taking office, Eisenhower signed legislation in 1953 restoring state claims to submerged lands. The episode did not instantly make Texas Republican, but it weakened the assumption that conservative Texans would always support the national Democratic nominee and created habits of ticket-splitting that later Republican candidates could build upon." },
      { heading: "Civil rights are part of the record", body: "Shivers's legacy cannot be reduced to Tidelands and party realignment. His administration also resisted federally driven school desegregation during the years after Brown v. Board of Education. Texas State Library records show how his states' rights arguments extended into the desegregation conflict, a position that belongs in any accurate account of his governorship. That history matters because the mid-century partisan transition involved economics, federalism, race, regional identity and national party change at the same time. A useful political profile should acknowledge those overlapping forces rather than turning realignment into a simple tax-and-spending story." },
      { heading: "Why Shivers matters to modern Texas politics", body: "Shivers represents a bridge between two political eras. He governed from inside the dominant Democratic system, yet his presidential defection demonstrated that conservative voters could be persuaded to cross party lines when national Democrats diverged from Texas conservatives on high-salience issues. John Tower's 1961 Senate victory, later party switches by figures such as John Connally and Phil Gramm, and the eventual Republican sweep of statewide offices came later. Shivers did not create those developments, but his 1952 break is an important early chapter in explaining how a one-party Democratic state became competitive and ultimately Republican-dominated." }
    ],
    relatedLinks: [
      { href: "/texas-politics/figures/john-tower-texas-senator-republican-breakthrough", label: "John Tower profile" },
      { href: "/texas-politics/figures/john-connally-texas-governor-party-switch", label: "John Connally profile" },
      { href: "/texas-politics", label: "Texas Politics" }
    ],
    sources: [
      { href: "https://www.tsl.texas.gov/governors/modern/shivers-p04.html", label: "Texas State Library: Allan Shivers and Eisenhower" },
      { href: "https://www.tsl.texas.gov/governors/modern/shivers-mcmurry.html", label: "Texas State Library: Tidelands and desegregation context" }
    ]
  },
  {
    slug: "john-connally-texas-governor-party-switch",
    name: "John Connally",
    kicker: "Democratic power broker who later joined the GOP",
    description: "John Connally served three terms as Texas governor, was wounded in the Kennedy assassination, later became Richard Nixon's treasury secretary and joined the Republican Party in 1973.",
    years: "1917–1993",
    texasRole: "39th governor of Texas, 1963–1969",
    sections: [
      { heading: "A career built in the Democratic establishment", body: "John Connally's early political career was closely tied to Lyndon B. Johnson and the Democratic network that dominated mid-century Texas. A lawyer and political organizer, Connally worked on Johnson campaigns and served briefly as secretary of the Navy in the Kennedy administration before running for governor. He won the office in 1962 and served three two-year terms from 1963 through 1969. His rise illustrates an important point about Texas realignment: many politicians who later became associated with Republican politics first built their careers inside a conservative-to-moderate Democratic establishment because that was where statewide power resided." },
      { heading: "Governor during a rapidly changing decade", body: "Connally promoted higher education, economic development and a more modern state government while cultivating a forceful, business-oriented image. His governorship coincided with the civil-rights era, urban growth and the national Democratic Party's movement toward a coalition increasingly different from the one that had long held Texas together. Connally remained a Democrat throughout his governorship. That distinction matters because Texas did not experience a single election-day party switch; the transition unfolded over decades as voters, donors and officeholders made different choices at different times." },
      { heading: "November 22, 1963", body: "Connally was riding in President John F. Kennedy's motorcade in Dallas on November 22, 1963, and was seriously wounded in the shooting that killed the president. The event permanently connected Connally to one of the most consequential moments in American history, but it should not eclipse his Texas political career. He recovered and continued serving as governor. His presence in the motorcade also reflected his role as a central Texas Democratic figure trusted to help manage the president's politically important trip through the state." },
      { heading: "Nixon's Treasury secretary and the 1973 party switch", body: "After leaving the governor's office, Connally moved closer to Republican President Richard Nixon and served as secretary of the Treasury from 1971 to 1972. He formally became a Republican in 1973, after Lyndon Johnson's death. The switch was symbolically powerful: a former three-term Democratic governor and Johnson ally was declaring that his political home had changed. Connally later sought the 1980 Republican presidential nomination but lost to Ronald Reagan. His path demonstrates how elite political realignment could lag behind changing presidential voting patterns while still accelerating the institutional growth of the Texas GOP." },
      { heading: "Connally as a bridge between eras", body: "Connally belongs alongside Allan Shivers, John Tower, Phil Gramm and Bill Clements in any serious history of Republican Texas, even though much of his career was Democratic. Shivers showed conservative presidential defection, Tower proved a Republican could win a statewide federal race, Clements captured the governorship and Gramm switched parties while in Congress. Connally's move added the prestige and network of a former governor and national Cabinet official. Together those careers show that modern Republican dominance emerged through a long sequence of voter changes, officeholder conversions, suburban growth and national party realignment rather than a single founding moment." }
    ],
    relatedLinks: [
      { href: "/texas-politics/figures/allan-shivers-texas-shivercrats-realignment", label: "Allan Shivers profile" },
      { href: "/texas-politics/figures/ronald-reagan-texas-conservative-legacy", label: "Ronald Reagan's Texas legacy" },
      { href: "/texas-politics", label: "Texas Politics" }
    ],
    sources: [
      { href: "https://www.tsl.texas.gov/governors/modern/index.html", label: "Texas State Library: John Connally and modern Texas governors" },
      { href: "https://www.tsl.texas.gov/ref/abouttx/governors", label: "Texas State Library: governors of Texas" }
    ]
  },
  {
    slug: "john-tower-texas-senator-republican-breakthrough",
    name: "John Tower",
    kicker: "The 1961 breakthrough for statewide Texas Republicans",
    description: "John Tower's 1961 special-election victory made him the first Republican U.S. senator from Texas since Reconstruction and gave the modern state GOP a major statewide breakthrough.",
    years: "1925–1991",
    texasRole: "U.S. senator from Texas, 1961–1985",
    sections: [
      { heading: "Why the 1961 special election mattered", body: "John Tower entered statewide politics when Texas was still overwhelmingly Democratic in state government. The Senate seat opened after Lyndon B. Johnson became vice president, and Tower won the 1961 special election after an appointed Democrat briefly held the vacancy. Senate historical records show that the previous Republican to represent Texas in the chamber, Morgan Hamilton, left office in 1877. Tower's victory therefore ended an extraordinary partisan drought and demonstrated that the presidential ticket-splitting visible under Eisenhower could eventually translate into a durable Republican win for major statewide office." },
      { heading: "Building a Republican Senate career", body: "Tower did not remain a novelty. He won reelection and served until January 1985, turning a breakthrough into a 24-year Senate career. His longevity helped normalize the idea of a Texas Republican holding statewide federal office while the state legislature and most courthouse politics remained Democratic for years afterward. The contrast is important: Republican development happened unevenly. Presidential voting, a U.S. Senate seat, suburban legislative districts and statewide executive offices shifted on different schedules. Tower's repeated victories gave the party a reliable statewide anchor during that transition." },
      { heading: "Defense and national influence", body: "Tower became especially identified with national defense and Senate institution-building. He chaired the Senate Armed Services Committee from 1981 through 1985 and also led the Senate Republican Policy Committee for more than a decade. Those roles gave a Texas Republican influence far beyond state party politics and helped connect the growing Texas GOP to the national conservative coalition of the Reagan era. His career is a reminder that the state's Republican ascent was not only electoral; it also produced seniority, committee power and policy influence in Washington." },
      { heading: "The handoff to Phil Gramm", body: "Tower chose not to seek another term in 1984. Republican Phil Gramm won the seat and took office in 1985, creating a direct succession between two figures who represented different stages of Texas realignment. Tower had built a Republican statewide base while much of Texas remained institutionally Democratic. Gramm, a former Democratic congressman who changed parties, represented the accelerating migration of conservative politicians into the GOP. John Cornyn later succeeded Gramm, meaning the seat that Tower captured in 1961 has remained in Republican hands for decades." },
      { heading: "A durable landmark in Texas political history", body: "It is tempting to label one election as the moment Texas turned red, but Tower's career is better understood as a landmark inside a longer process. Allan Shivers had already backed Eisenhower; Republican presidential candidates had shown strength; Bill Clements would not win the governorship until 1978; and Republicans would not capture every statewide elective office until much later. Tower nevertheless supplied something the party badly needed: proof that a Republican could win, survive and accumulate power in a statewide Texas office. That made his 1961 victory one of the clearest milestones in the creation of modern Republican Texas." }
    ],
    relatedLinks: [
      { href: "/texas-politics/figures/phil-gramm-texas-senator-fiscal-conservative", label: "Phil Gramm profile" },
      { href: "/texas-politics/figures/allan-shivers-texas-shivercrats-realignment", label: "Allan Shivers profile" },
      { href: "/texas-politics/figures/john-cornyn-texas-senator-profile", label: "John Cornyn profile" }
    ],
    sources: [
      { href: "https://www.senate.gov/states/TX/senators.htm", label: "U.S. Senate: Texas senators" },
      { href: "https://www.tsl.texas.gov/governors/modern/index.html", label: "Texas State Library: modern Texas timeline" }
    ]
  },
  {
    slug: "bill-clements-texas-republican-governor",
    name: "Bill Clements",
    kicker: "The Republican governorship breakthrough",
    description: "Bill Clements won the governorship in 1978 as the first Republican elected to that office in Texas since Reconstruction, then returned for a second nonconsecutive term in 1987.",
    years: "1917–2011",
    texasRole: "42nd and 44th governor of Texas, 1979–1983 and 1987–1991",
    sections: [
      { heading: "From oil fields to national government", body: "William P. Clements Jr. built his career outside elective politics before becoming governor. A Dallas native, he entered the oil business and helped build SEDCO into a major offshore drilling company. He later served as deputy secretary of defense in the Nixon and Ford administrations. That combination of business management, energy expertise and federal executive experience shaped the political brand he brought back to Texas. Clements presented himself as a Republican manager who could run state government with private-sector discipline at a time when the GOP still had to prove it could win the state's top office." },
      { heading: "The 1978 breakthrough", body: "Clements's 1978 victory was historic because Texas had not elected a Republican governor since Reconstruction. He took office in January 1979, giving the state GOP a prize that even John Tower's long Senate career had not yet produced. The win did not mean Republicans suddenly controlled Texas government; Democrats still held enormous legislative and local power. But capturing the governorship demonstrated that the Republican coalition had moved beyond occasional presidential victories and a Senate seat into the center of state executive politics." },
      { heading: "A business-oriented governing style", body: "Texas State Library describes Clements as emphasizing budgeting, management, anti-crime policy, basic education and stronger relations with Mexico. His style fit an emerging Republican message built around business growth, administrative efficiency and skepticism toward expanding government. Because Texas uses a plural executive, however, a governor cannot simply operate the state like a corporate hierarchy. Clements had to negotiate with a legislature that remained Democratic, making his tenure an early test of divided partisan government in modern Texas." },
      { heading: "Defeat and comeback", body: "Clements lost reelection to Democrat Mark White in 1982, evidence that the Republican transformation was far from complete. Four years later he defeated White and returned to office in January 1987. The comeback made his career even more revealing: Republican gains were real but not linear, and individual candidates still mattered greatly. His two nonconsecutive terms bracketed a period in which the GOP continued strengthening in suburbs and statewide contests while Democrats retained substantial power in the Legislature and county courthouses." },
      { heading: "What Clements changed", body: "Clements did not by himself create Republican dominance, but he broke a major psychological and electoral barrier. After his first victory, the idea of a Republican Texas governor no longer seemed exceptional. George W. Bush would capture the office in 1994, Rick Perry would succeed him in 2000 and Republicans would continue holding the governorship thereafter. Read alongside Tower, Connally and Gramm, Clements helps show the staircase pattern of realignment: presidential defection, Senate success, high-profile party switches, gubernatorial victory and eventually control of the broader statewide political system." }
    ],
    relatedLinks: [
      { href: "/texas-politics/figures/george-w-bush-texas-governor-president", label: "George W. Bush profile" },
      { href: "/texas-politics/figures/rick-perry-texas-governor-energy-legacy", label: "Rick Perry profile" },
      { href: "/texas-government/governor", label: "Texas Governor authority guide" }
    ],
    sources: [
      { href: "https://www.tsl.texas.gov/governors/modern/page2.html", label: "Texas State Library: William P. Clements" },
      { href: "https://www.tsl.texas.gov/ref/abouttx/governors", label: "Texas State Library: governors of Texas" }
    ]
  },
  {
    slug: "kay-bailey-hutchison-texas-senator",
    name: "Kay Bailey Hutchison",
    kicker: "Texas's first woman in the U.S. Senate",
    description: "Kay Bailey Hutchison won a 1993 special election to become the first woman to represent Texas in the U.S. Senate and later held Republican leadership posts during a 20-year Senate career.",
    years: "Born 1943",
    texasRole: "U.S. senator from Texas, 1993–2013",
    sections: [
      { heading: "Breaking barriers before the Senate", body: "Kay Bailey Hutchison's career crossed journalism, law and politics before she reached Washington. After graduating from the University of Texas and its law school, she became the first female reporter at a Houston television station at a time when major law firms offered women limited opportunities. She won election to the Texas House in 1972 and later served as state treasurer. Those earlier roles matter because her Senate victory did not emerge from nowhere; she had already built statewide experience and a public profile during the period when Republicans were becoming increasingly competitive in Texas." },
      { heading: "The 1993 special election", body: "Hutchison won a special election in 1993 for the Senate seat vacated when Lloyd Bentsen became Treasury secretary. Senate historical records identify her as the first woman to serve as a U.S. senator from Texas. She subsequently won full terms and remained in office until January 2013. Her victory arrived during a decisive phase of Republican growth: the GOP was strengthening in statewide elections, George W. Bush would win the governorship the next year and the party was moving toward the across-the-board statewide dominance it would achieve later in the decade." },
      { heading: "Leadership inside the Senate", body: "Hutchison developed an institutional profile rather than relying only on ideological confrontation. She served as vice chair of the Senate Republican Conference from 2000 through 2007 and chaired the Republican Policy Committee from 2007 through 2009. The Senate's oral-history program also highlights her work on issues including the national AMBER Alert system and the Spousal IRA. Those roles make her useful for understanding a period when Texas Republicans were not merely winning elections but accumulating seniority and leadership positions across Congress." },
      { heading: "A different Republican style", body: "Hutchison was a conservative Republican, but her political style often emphasized coalition-building, appropriations and institutional experience. That placed her differently from the later Tea Party and populist currents that reshaped Republican primaries. The contrast became visible when she challenged Governor Rick Perry in the 2010 Republican primary and lost. The race illustrated an intraparty transition: long service and establishment credentials no longer guaranteed the support of a Republican electorate increasingly receptive to anti-establishment and movement-conservative messages." },
      { heading: "Her place in the Texas GOP story", body: "Hutchison's significance is both representational and institutional. She broke a gender barrier for Texas in the Senate, served for two decades and helped extend the line of Republican senators that began with John Tower and continued through Phil Gramm. Her career also overlaps the period when Texas moved from Republican competitiveness to statewide dominance. Comparing Hutchison with Tower, Gramm, John Cornyn and Ted Cruz shows how the political incentives and public style of a Texas Republican senator changed across several generations while the party's hold on the seats remained durable." }
    ],
    relatedLinks: [
      { href: "/texas-politics/figures/john-tower-texas-senator-republican-breakthrough", label: "John Tower profile" },
      { href: "/texas-politics/figures/phil-gramm-texas-senator-fiscal-conservative", label: "Phil Gramm profile" },
      { href: "/texas-politics/figures/ted-cruz-texas-senator-profile", label: "Ted Cruz profile" }
    ],
    sources: [
      { href: "https://www.senate.gov/about/oral-history/hutchison-kay-bailey-oral-history.htm", label: "U.S. Senate: Kay Bailey Hutchison oral history" },
      { href: "https://www.senate.gov/states/TX/timeline.htm", label: "U.S. Senate: Texas timeline" }
    ]
  },
  {
    slug: "dick-armey-texas-house-majority-leader",
    name: "Dick Armey",
    kicker: "Texas economist at the center of the 1994 Republican Revolution",
    description: "Dick Armey represented North Texas for nine terms, helped develop the Contract with America and served as U.S. House majority leader from 1995 through 2003.",
    years: "Born 1940",
    texasRole: "U.S. representative from Texas, 1985–2003; House majority leader, 1995–2003",
    sections: [
      { heading: "An economist enters North Texas politics", body: "Richard 'Dick' Armey came to Congress from an academic economics career that included teaching and administration at Texas universities, including the University of North Texas. He won election to Texas's 26th Congressional District in 1984 and took office in 1985. His professional background shaped a political identity centered on lower taxes, smaller government, market competition and budget restraint. That made Armey part of a generation of Sun Belt Republicans who combined suburban electoral growth with a policy agenda intended to challenge the long Democratic majority in the U.S. House." },
      { heading: "The Contract with America", body: "Armey became one of the principal figures associated with the Contract with America, the policy and campaign program House Republicans promoted before the 1994 midterm election. The program pledged votes on measures involving taxes, welfare, crime, regulation, congressional procedure and a balanced-budget amendment. Republicans won control of the House for the first time in forty years. The Contract did not guarantee enactment of every proposal, but it gave candidates a common national message and became a landmark in modern congressional campaign strategy. Armey's role connected a Texas lawmaker directly to that national transformation." },
      { heading: "Eight years as majority leader", body: "When Republicans took control in January 1995, Armey became House majority leader. U.S. House historical records show that he held the post through four Congresses, serving until 2003 under Speakers Newt Gingrich and Dennis Hastert. The majority leader helps schedule floor action, organize party strategy and translate leadership priorities into legislation. Armey therefore moved from movement-oriented policy advocate to one of the chamber's central institutional managers, giving Texas unusually prominent representation in national Republican leadership." },
      { heading: "Budgets, taxes and the limits of a governing majority", body: "Armey consistently argued for flatter taxes, restrained federal spending and market-oriented policy. Yet the Republican majority also had to govern through conflicts with the Clinton administration, internal party factions and Senate constraints. The government shutdown fights of the mid-1990s and later budget compromises demonstrated the difference between a campaign platform and legislative control. Armey's career is useful precisely because it contains both: the clarity of an opposition message and the tradeoffs that appear once a party must manage the House and negotiate with other institutions." },
      { heading: "Why Armey belongs in a Texas political authority cluster", body: "Texas's Republican story is often told through governors and senators, but House leaders mattered too. Armey helped turn growing North Texas Republican strength into national congressional power. He was followed as majority leader by fellow Texan Tom DeLay, while Texas members such as Jeb Hensarling and Kevin Brady later chaired major policy committees. The sequence shows how state realignment created a pipeline of congressional leaders whose influence extended into national tax, budget, regulatory and campaign strategy. Armey is therefore a bridge between Texas suburban Republican growth and the 1990s transformation of the U.S. House." }
    ],
    relatedLinks: [
      { href: "/texas-politics/figures/tom-delay-texas-house-majority-leader", label: "Tom DeLay profile" },
      { href: "/texas-politics/figures/jeb-hensarling-texas-financial-services-chair", label: "Jeb Hensarling profile" },
      { href: "/texas-politics", label: "Texas Politics" }
    ],
    sources: [
      { href: "https://history.house.gov/People/Detail/8563", label: "U.S. House Historian: Dick Armey" },
      { href: "https://history.house.gov/People/Office/Majority-Leaders/", label: "U.S. House Historian: majority leaders" }
    ]
  },
  {
    slug: "tom-delay-texas-house-majority-leader",
    name: "Tom DeLay",
    kicker: "House leadership, Texas redistricting and political controversy",
    description: "Tom DeLay rose from the Texas House to become U.S. House majority whip and majority leader, while his role in fundraising and the 2003 Texas redistricting fight made him one of the era's most consequential and controversial Republicans.",
    years: "Born 1947",
    texasRole: "U.S. representative from Texas, 1985–2006; House majority leader, 2003–2005",
    sections: [
      { heading: "From the Texas House to congressional leadership", body: "Tom DeLay served in the Texas House before winning a Houston-area U.S. House seat in 1984. He entered Congress in 1985 and rose steadily through Republican leadership. House historical records list him as Republican whip for four Congresses beginning in 1995 and majority leader during the 108th and part of the 109th Congress. His reputation for enforcing party discipline and counting votes produced the nickname 'The Hammer.' The career shows how Texas's growing Republican congressional delegation became not merely larger but central to the national party's internal machinery." },
      { heading: "Political organization and fundraising", body: "DeLay treated campaign organization as a source of legislative power. He built fundraising networks and invested heavily in electing Republicans, including at the state level in Texas. Supporters saw an effective party builder willing to compete aggressively against entrenched Democratic structures; critics argued that the system blurred lines between governing, lobbying and campaign finance. Those arguments became inseparable from his public image. For a durable profile, the important point is that DeLay understood congressional power as extending beyond floor votes into candidate recruitment, money, redistricting and the composition of state legislatures." },
      { heading: "The 2003 Texas redistricting battle", body: "After Republicans captured the Texas House, state leaders pursued an unusual mid-decade congressional redistricting in 2003. DeLay played an active role in the effort, working with Texas Republicans as lawmakers fought over a map designed to produce more Republican-leaning congressional districts. Democratic legislators left the state at different points to deny a quorum, and the conflict drew national attention. The final map materially strengthened Republican representation in the Texas congressional delegation. Litigation followed, and the broader episode remains one of the clearest examples of how control of state government can reshape power in Washington." },
      { heading: "Indictment, resignation and reversed convictions", body: "DeLay's career also requires careful treatment of the legal record. He was indicted in Texas in 2005 in a campaign-finance case connected to corporate contributions and lost his majority-leader position while the case proceeded. He resigned from Congress in June 2006. A jury later convicted him of money laundering and conspiracy, but the Texas Third Court of Appeals reversed the convictions in 2013 for insufficient evidence. In 2014 the Texas Court of Criminal Appeals declined to reinstate them. Describing only the indictment or only the reversal would give readers an incomplete account." },
      { heading: "A legacy of power and polarization", body: "DeLay's influence is visible in two separate histories: the rise of Texans inside national Republican leadership and the transformation of Texas's congressional map after the GOP gained state legislative control. His methods also helped define arguments about partisan hardball, campaign finance and redistricting that continued long after he left office. Placed next to Dick Armey and Tom Craddick, his career shows a moment when Republicans had gained enough power to control institutions that had once been inaccessible to them—and then used those institutions aggressively, creating both durable policy consequences and durable controversy." }
    ],
    relatedLinks: [
      { href: "/texas-politics/figures/dick-armey-texas-house-majority-leader", label: "Dick Armey profile" },
      { href: "/texas-politics/figures/tom-craddick-texas-house-speaker", label: "Tom Craddick profile" },
      { href: "/texas-politics", label: "Texas Politics" }
    ],
    sources: [
      { href: "https://history.house.gov/People/Detail/12103", label: "U.S. House Historian: Tom DeLay" },
      { href: "https://www.texastribune.org/2003/10/13/outside-help/", label: "Texas Tribune: 2003 redistricting" },
      { href: "https://www.texastribune.org/2014/10/01/court-criminal-appeals-wont-reinstate-delay-convic/", label: "Texas Tribune: reversal of DeLay convictions" }
    ]
  },
  {
    slug: "tom-craddick-texas-house-speaker",
    name: "Tom Craddick",
    kicker: "From a nine-Republican minority to Speaker of the Texas House",
    description: "Tom Craddick entered a Texas House with only nine Republicans and later became the chamber's first Republican speaker since Reconstruction, serving as speaker from 2003 through 2009.",
    years: "Texas House service beginning in 1969",
    texasRole: "Texas state representative from Midland; Speaker of the Texas House, 2003–2009",
    sections: [
      { heading: "Winning when Republicans barely existed in the House", body: "Tom Craddick won election from Midland in 1968 and entered the Texas House in January 1969. His official House biography notes that Republicans held only nine of the chamber's 150 seats at the time. That starting point makes his career unusually useful for understanding the scale of Texas realignment. Craddick did not join an established majority party; he spent decades inside a small minority as the GOP slowly expanded through West Texas, suburbs and changing statewide voting patterns." },
      { heading: "The Dirty 30 and institutional experience", body: "Craddick joined the bipartisan 'Dirty 30' reform group during the 1971 Sharpstown scandal era, an episode that complicated simple partisan labels because reform-minded Democrats and Republicans worked together against House leadership. In 1975 Speaker Bill Clayton appointed Craddick to a committee chairmanship, making him the first Republican committee chairman in roughly a century according to his House biography. Repeated service under Democratic speakers gave Craddick deep knowledge of House procedure, committees and coalition-building long before Republicans captured the chamber." },
      { heading: "The 2002 majority and the speakership", body: "Republicans won control of the Texas House in the 2002 election. In January 2003 Craddick became speaker, the first Republican to hold the office since Reconstruction. He served through January 2009. The change was more than symbolic. The speaker appoints committees, recognizes members for motions and shapes the flow of legislation, so Republican control of the presiding office completed an institutional shift that presidential victories alone could not accomplish. For the first time in modern Texas, Republicans could coordinate a state House majority with a Republican governor and lieutenant governor." },
      { heading: "Policy power and procedural conflict", body: "Craddick's speakership coincided with major battles over budgets, school finance, tort law, property taxes and congressional redistricting. Supporters credit his leadership with advancing a business-oriented conservative agenda. Critics focused on the concentration of procedural power in the speaker's office, especially during the 2007 session when members challenged his authority and rulings over whether the House could move to remove a sitting speaker. The conflict illustrates an enduring Texas lesson: the rules and powers of legislative offices can matter as much as partisan vote totals." },
      { heading: "Why his career spans the whole Republican ascent", body: "Few Texas politicians offer a longer view of the state's partisan transformation. Craddick began with a Republican caucus small enough to fit around a table, became a committee chairman under Democratic rule, helped build the GOP minority and eventually presided over a Republican House majority. Joe Straus succeeded him as speaker in 2009, beginning a different coalition style within the same Republican-controlled chamber. Reading the two careers together shows that once a party wins an institution, the next political struggle often moves inside the majority itself over leadership, procedure and priorities." }
    ],
    relatedLinks: [
      { href: "/texas-politics/figures/joe-straus-texas-house-speaker", label: "Joe Straus profile" },
      { href: "/texas-politics/figures/tom-delay-texas-house-majority-leader", label: "Tom DeLay profile" },
      { href: "/texas-legislature/house", label: "Texas House guide" }
    ],
    sources: [
      { href: "https://house.texas.gov/members/2610/biography", label: "Texas House: Tom Craddick biography" },
      { href: "https://www.lrl.texas.gov/legeLeaders/leadership/speakerPage.cfm?memberID=109", label: "Texas Legislative Reference Library: Speaker Tom Craddick" }
    ]
  },
  {
    slug: "ron-paul-texas-libertarian-conservative",
    name: "Ron Paul",
    kicker: "Libertarian conservatism from a Texas House seat",
    description: "Ron Paul represented Texas across multiple periods in Congress and built a national following around limited government, monetary reform, nonintervention and civil liberties.",
    years: "Born 1935",
    texasRole: "U.S. representative from Texas, 1976–1977, 1979–1985 and 1997–2013",
    sections: [
      { heading: "A physician enters politics", body: "Ron Paul trained as a physician, served in the U.S. Air Force and Air National Guard and practiced obstetrics and gynecology before becoming a political figure. He first won a Texas congressional seat in a 1976 special election, lost later that year, returned to the House in 1979 and served through 1985. After time away from Congress, he returned in 1997 and remained until 2013. The interrupted timeline is important because Paul's influence was never based simply on seniority; it came from maintaining an unusually consistent ideological message across changing Republican eras." },
      { heading: "Limited government as a governing philosophy", body: "Paul's congressional identity centered on a strict reading of limited federal power. He routinely opposed spending, deficits, federal programs and interventions that many other Republicans supported. That stance sometimes aligned him with fiscal conservatives and sometimes isolated him from his own party. Supporters admired the consistency; critics argued that his approach could be impractical or too rigid for modern federal responsibilities. Either way, his record broadened the meaning of Texas conservatism by keeping libertarian arguments about constitutional power inside Republican debate." },
      { heading: "The Federal Reserve and monetary politics", body: "Paul became nationally associated with criticism of the Federal Reserve, fiat money and inflationary monetary policy. Long before those subjects became common campaign talking points, he used hearings, legislation and public speeches to argue for greater monetary transparency and a reduced federal role. His phrase 'End the Fed' became shorthand for a larger critique of central banking. Even where his preferred reforms lacked congressional majorities, he succeeded in turning an obscure policy area into a recognizable part of grassroots conservative and libertarian politics." },
      { heading: "Foreign policy and civil liberties", body: "Paul also diverged sharply from many post-September 11 Republicans on war, surveillance and executive power. He opposed the Iraq War and argued for a more noninterventionist foreign policy, positions that generated both intense support and strong criticism inside the GOP. On civil liberties, he warned against expansive federal surveillance and emergency powers. Those disagreements are central to his legacy because they anticipated later Republican divisions over overseas commitments, intelligence authorities and whether conservatism should prioritize military assertiveness or restraint." },
      { heading: "Presidential campaigns and a movement larger than one district", body: "Paul's 2008 and 2012 Republican presidential campaigns transformed a long-serving Texas congressman into a national movement figure. His campaigns attracted younger voters, online donors and activists interested in monetary policy, civil liberties and antiwar arguments. He did not win the Republican nomination, but his organization influenced later libertarian-leaning activism and helped create a national platform for ideas that had often been marginal inside party leadership. His son Rand Paul later carried some of those themes into the U.S. Senate, underscoring the movement impact of a Texas congressional career that exceeded its legislative footprint." }
    ],
    relatedLinks: [
      { href: "/texas-politics/figures/ted-cruz-texas-senator-profile", label: "Ted Cruz profile" },
      { href: "/texas-politics/figures/phil-gramm-texas-senator-fiscal-conservative", label: "Phil Gramm profile" },
      { href: "/texas-politics", label: "Texas Politics" }
    ],
    sources: [
      { href: "https://history.house.gov/People/Listing/P/PAUL%2C-Ronald-Ernest-%28P000583%29/", label: "U.S. House Historian: Ron Paul" }
    ]
  },
  {
    slug: "joe-straus-texas-house-speaker",
    name: "Joe Straus",
    kicker: "Five terms as a coalition-minded Republican Speaker",
    description: "Joe Straus represented San Antonio and served five terms as Speaker of the Texas House from 2009 through 2019, becoming the longest-serving Republican speaker in state history.",
    years: "Born 1959",
    texasRole: "Texas state representative, 2005–2019; Speaker of the Texas House, 2009–2019",
    sections: [
      { heading: "A rapid rise from San Antonio", body: "Joe Straus entered the Texas House through a 2005 special election representing District 121 in Bexar County. Four years later he became speaker after Tom Craddick's leadership lost support within the chamber. Straus's coalition included Republicans and Democrats, reflecting the Texas House tradition that the speaker is elected by the full membership rather than selected solely by a formal party caucus vote. That origin shaped how both supporters and critics understood his leadership: as a Republican speakership built around institutional coalition management rather than movement-party discipline alone." },
      { heading: "Five terms as Speaker", body: "Texas Legislative Reference Library records show Straus serving as speaker for the 81st through 85th Legislatures, from January 2009 until January 2019. The decade made him the longest-serving Republican speaker in Texas history. Longevity matters in a chamber where the speaker controls committee appointments and substantial procedural authority. Across five terms, Straus accumulated the institutional experience to shape budgets and the legislative calendar while navigating changing Republican caucuses, Democratic minorities and statewide leaders with different priorities." },
      { heading: "A business-oriented governing style", body: "Straus was generally associated with a pragmatic, business-oriented Republican approach emphasizing economic competitiveness, infrastructure, education, water planning and state finances. He frequently argued that the House should focus on long-term governing capacity as well as ideological goals. Supporters viewed that style as stable and results-oriented. Conservative activists who wanted a more confrontational agenda often regarded it as too cautious. The disagreement made Straus a central figure in a broader intraparty debate over whether Republican dominance should produce incremental institutional conservatism or faster movement-driven policy change." },
      { heading: "Conflict inside a dominant party", body: "By the 2010s, the most consequential political fights in Texas increasingly occurred inside Republican primaries and between Republican leaders rather than simply between the two major parties. Straus often represented a House-centered institutional counterweight to more movement-oriented pressure from activists and, at times, the Senate. Those disputes covered social policy, education, spending and legislative priorities. The friction is historically important because it shows what happens after realignment is complete: a dominant party develops internal factions that compete over procedure, ideology, endorsements and control of the agenda." },
      { heading: "The transition after Straus", body: "Straus announced that he would not seek another House term and left office in January 2019. Dennis Bonnen succeeded him as speaker, followed by Dade Phelan and Dustin Burrows. The succession underscores how the speakership has remained Republican while the governing coalition inside the chamber has continued to evolve. Comparing Straus with Craddick is especially useful: Craddick embodied the culmination of a long Republican climb from minority status, while Straus governed after GOP control was established and the central question had shifted toward what kind of Republican House the majority would become." }
    ],
    relatedLinks: [
      { href: "/texas-politics/figures/tom-craddick-texas-house-speaker", label: "Tom Craddick profile" },
      { href: "/texas-legislature/house", label: "Texas House guide" },
      { href: "/texas-politics", label: "Texas Politics" }
    ],
    sources: [
      { href: "https://lrl.texas.gov/legeleaders/leadership/speakerPage.cfm?memberID=5615", label: "Texas Legislative Reference Library: Speaker Joe Straus" },
      { href: "https://lrl.texas.gov/legeLeaders/members/memberDisplay.cfm?memberID=5615", label: "Texas Legislative Reference Library: Joe Straus service record" }
    ]
  },
  {
    slug: "kevin-brady-texas-ways-means-chair",
    name: "Kevin Brady",
    kicker: "Texas chairman at the center of the 2017 tax overhaul",
    description: "Kevin Brady represented Texas in Congress for 26 years, chaired the House Ways and Means Committee and served as the lead House author of the 2017 Tax Cuts and Jobs Act.",
    years: "Born 1955",
    texasRole: "U.S. representative from Texas, 1997–2023; Ways and Means chair, 2015–2019",
    sections: [
      { heading: "From the Texas House to Congress", body: "Kevin Brady served in the Texas House from 1990 through 1996 before winning election to Congress in 1996 and taking office in January 1997. He represented a district centered in the Houston-region and East Texas for thirteen terms. His career developed around tax, trade, health and economic policy rather than national-media confrontation. That committee-centered path is an important part of Texas Republican influence: while some members became famous through leadership contests or cable-news politics, others accumulated power by mastering the policy jurisdictions that determine major legislation." },
      { heading: "Chairing Ways and Means", body: "House historical records show Brady chairing the Ways and Means Committee during the 114th and 115th Congresses. Ways and Means is one of Congress's most powerful committees because its jurisdiction includes federal taxes, trade, Social Security and major health programs. Brady also chaired the Joint Committee on Taxation during the 115th Congress. Holding those posts placed a Texas Republican at the center of the party's economic agenda when Republicans controlled the House, Senate and White House in 2017." },
      { heading: "The Tax Cuts and Jobs Act", body: "As Ways and Means chairman, Brady introduced the House version of the Tax Cuts and Jobs Act in November 2017 and later chaired House participation in the conference committee that reconciled House and Senate versions. The final law, signed by President Donald Trump in December, lowered the corporate tax rate, changed individual tax brackets and deductions, increased the standard deduction and made numerous changes to international and business taxation. The committee later described Brady as the law's lead author, making the measure the defining legislative achievement of his chairmanship." },
      { heading: "The policy debate around the tax law", body: "Supporters of the 2017 law argued that lower business taxes and a more competitive international system would encourage investment, growth and higher wages. Critics focused on distributional effects, the size of corporate tax reductions and the increase in projected federal deficits. Many individual provisions were also temporary under budget-reconciliation constraints, creating later fights over extensions. Those debates belong in Brady's profile because chairing a major tax rewrite means owning both its policy ambitions and the long-term arguments over its fiscal and economic consequences." },
      { heading: "A committee-power model of Texas influence", body: "Brady did not seek reelection in 2022 and left Congress in January 2023. His career fits a larger Texas pattern that includes Jeb Hensarling on Financial Services, Mac Thornberry on Armed Services and earlier figures such as Phil Gramm in Senate banking debates. Republican dominance in Texas produced enough safe or durable congressional seats for members to build seniority and reach committee leadership. Brady's path shows why that matters: state electoral strength can translate years later into national policy-writing authority even when the politician involved is less famous than party leaders or presidential candidates." }
    ],
    relatedLinks: [
      { href: "/texas-politics/figures/jeb-hensarling-texas-financial-services-chair", label: "Jeb Hensarling profile" },
      { href: "/texas-politics/figures/phil-gramm-texas-senator-fiscal-conservative", label: "Phil Gramm profile" },
      { href: "/texas-law-policy", label: "Texas Law & Policy" }
    ],
    sources: [
      { href: "https://history.house.gov/People/Detail/9754", label: "U.S. House Historian: Kevin Brady" },
      { href: "https://waysandmeans.house.gov/2017/11/02/chairman-brady-introduces-tax-cuts-jobs-act/", label: "House Ways and Means: Brady introduces the Tax Cuts and Jobs Act" },
      { href: "https://waysandmeans.house.gov/2017/12/22/signed-law-first-overhaul-nations-tax-code-31-years/", label: "House Ways and Means: 2017 tax law signed" }
    ]
  },
  {
    slug: "jeb-hensarling-texas-financial-services-chair",
    name: "Jeb Hensarling",
    kicker: "Fiscal conservatism and post-crisis financial regulation",
    description: "Jeb Hensarling represented East and North Texas from 2003 through 2019, chaired the House Financial Services Committee and led Republican efforts to replace major parts of Dodd-Frank.",
    years: "Born 1957",
    texasRole: "U.S. representative from Texas, 2003–2019; Financial Services chair, 2013–2019",
    sections: [
      { heading: "A Texas fiscal-conservative pipeline", body: "Jeb Hensarling graduated from Texas A&M and the University of Texas School of Law, worked in business and served on the staff of U.S. Senator Phil Gramm before winning election to Congress in 2002. That background placed him in a recognizable Texas fiscal-conservative lineage emphasizing lower spending, market competition and skepticism toward federal regulation. He represented Texas from January 2003 through January 2019 and built influence through party organizations and committees rather than statewide office." },
      { heading: "From Republican Conference chair to Financial Services", body: "House historical records list Hensarling as chairman of the House Republican Conference during the 112th Congress and chairman of the Financial Services Committee for the 113th, 114th and 115th Congresses. Financial Services oversees banking, securities, housing finance and major financial regulators. His six years as chairman came directly after the 2008 financial crisis and enactment of the Dodd-Frank Act, putting him at the center of a national argument over whether post-crisis rules reduced systemic risk or imposed excessive costs and government discretion." },
      { heading: "The Financial CHOICE Act", body: "Hensarling made the Financial CHOICE Act the centerpiece of his regulatory agenda. The proposal sought to replace or revise major elements of Dodd-Frank, provide regulatory relief for highly capitalized banks, change the Consumer Financial Protection Bureau and alter the framework for handling failing financial institutions. The House passed a version in 2017, but the measure did not become law in that form. Its significance lies in establishing a detailed Republican alternative that influenced the broader debate over financial regulation and later deregulatory efforts." },
      { heading: "Supporters and critics of the approach", body: "Hensarling argued that Dodd-Frank entrenched large institutions, constrained community banks and preserved expectations of future bailouts. Supporters saw his approach as restoring market discipline and making regulators more accountable. Critics argued that weakening post-crisis safeguards could increase financial risk and reduce consumer protection. The dispute is a useful example of how conservative economic policy moved from general principles to the technical details of capital rules, agency structure, bankruptcy and enforcement once Republicans controlled congressional committees." },
      { heading: "Why Hensarling matters beyond one bill", body: "Hensarling chose not to seek reelection in 2018 and left Congress in January 2019. His career demonstrates how Texas Republican strength fed a national policy bench. He had worked for Phil Gramm, rose to House party leadership and then controlled a committee with enormous jurisdiction over financial markets. Paired with Kevin Brady's Ways and Means chairmanship, Hensarling's tenure shows Texas influence operating through committee gavels: less visible than a governorship or presidential campaign, but capable of setting the agenda for national tax, banking and regulatory policy." }
    ],
    relatedLinks: [
      { href: "/texas-politics/figures/kevin-brady-texas-ways-means-chair", label: "Kevin Brady profile" },
      { href: "/texas-politics/figures/phil-gramm-texas-senator-fiscal-conservative", label: "Phil Gramm profile" },
      { href: "/texas-politics/figures/dick-armey-texas-house-majority-leader", label: "Dick Armey profile" }
    ],
    sources: [
      { href: "https://history.house.gov/People/Detail/15568", label: "U.S. House Historian: Jeb Hensarling" },
      { href: "https://financialservices.house.gov/news/documentsingle.aspx?DocumentID=401819", label: "House Financial Services: Financial CHOICE Act introduced" },
      { href: "https://financialservices.house.gov/news/documentsingle.aspx?DocumentID=401986", label: "House Financial Services: House passage of Financial CHOICE Act" }
    ]
  }
];
