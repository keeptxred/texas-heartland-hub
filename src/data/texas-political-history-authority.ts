export type PoliticalHistoryTimelineItem = {
  year: string;
  event: string;
  meaning: string;
};

export type PoliticalHistorySection = {
  heading: string;
  paragraphs: string[];
};

export type PoliticalHistorySource = {
  href: string;
  label: string;
};

export type PoliticalHistoryLink = {
  href: string;
  label: string;
  description: string;
};

export type PoliticalHistoryFaq = {
  question: string;
  answer: string;
};

export type PoliticalHistoryAuthorityPage = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  eyebrow: string;
  intro: string;
  shortAnswer: string;
  reviewed: string;
  timeline: PoliticalHistoryTimelineItem[];
  sections: PoliticalHistorySection[];
  sources: PoliticalHistorySource[];
  relatedLinks: PoliticalHistoryLink[];
  faqs: PoliticalHistoryFaq[];
};

export const TEXAS_CONSTITUTIONAL_HISTORY: PoliticalHistoryAuthorityPage = {
  slug: "texas-constitutional-history",
  title: "Texas Constitutional History",
  seoTitle: "Texas Constitutional History: 1836 to the Constitution of 1876 | KeepTXRed",
  description:
    "A source-backed guide to Texas constitutional history from the Republic through the constitutions of 1845, 1861, 1866, 1869 and 1876, including amendments, the plural executive and the failed 1974 rewrite.",
  eyebrow: "Texas constitutional history",
  intro:
    "Texas has repeatedly rewritten its basic charter as its political status changed from Mexican territory to independent republic, U.S. state, Confederate state, Reconstruction government and post-Reconstruction state. The Constitution of 1876 remains the governing charter today, but hundreds of amendments have changed its text and the institutions created under it. Understanding that sequence explains why Texas deliberately divides executive power, elects many statewide officials and judges, and sends unusually detailed policy questions to voters as constitutional amendments.",
  shortAnswer:
    "Texas has operated under a succession of constitutions tied to major changes in sovereignty and political power. The Republic adopted a constitution in 1836; statehood produced the Constitution of 1845; secession brought a Confederate-era constitution in 1861; Reconstruction produced constitutions in 1866 and 1869; and the post-Reconstruction convention of 1875 drafted the Constitution of 1876. That last document restricted and dispersed governmental power in reaction to Reconstruction-era government. It remains in force, which is why Texas politics still reflects a plural executive, a biennial Legislature, independently elected judges and frequent amendment elections.",
  reviewed: "2026-08-30",
  timeline: [
    {
      year: "1824",
      event: "Federal Constitution of the United Mexican States",
      meaning:
        "Texas was governed within Mexico's federal system, with Coahuila y Tejas operating under its own state constitution. This is the pre-Republic constitutional setting for later Texas debates about federalism and local authority.",
    },
    {
      year: "1836",
      event: "Constitution of the Republic of Texas",
      meaning:
        "Delegates at Washington-on-the-Brazos created a constitution for an independent republic while the Texas Revolution was underway, establishing a president, Congress and judiciary for the new government.",
    },
    {
      year: "1845",
      event: "First state constitution",
      meaning:
        "Annexation required a new charter for Texas as a U.S. state. The 1845 constitution created the framework for state government within the federal Union.",
    },
    {
      year: "1861",
      event: "Secession-era constitution",
      meaning:
        "Texas altered its constitution after secession so state government would operate within the Confederacy rather than the United States.",
    },
    {
      year: "1866",
      event: "First Reconstruction constitution",
      meaning:
        "After the Civil War, Texas adopted another constitution as part of the process of restoring civil government and addressing emancipation and the legal consequences of secession.",
    },
    {
      year: "1869",
      event: "Reconstruction constitution",
      meaning:
        "A new charter reorganized state government during congressional Reconstruction and strengthened central state authority in ways later opponents would explicitly reject.",
    },
    {
      year: "1875–1876",
      event: "Convention and ratification of the present constitution",
      meaning:
        "Delegates wrote a detailed charter designed to limit and disperse government power. Voters ratified it in 1876, and it remains the state's constitution.",
    },
    {
      year: "1974",
      event: "Constitutional Convention fails to produce a replacement",
      meaning:
        "A major modern effort to replace the 1876 charter did not secure a final proposal, leaving constitutional modernization to continue largely through piecemeal amendments.",
    },
  ],
  sections: [
    {
      heading: "1. Texas constitutional history follows changes in sovereignty",
      paragraphs: [
        "Texas constitutional development is unusually easy to divide into political eras because the governing charter changed whenever the state's relationship to a larger nation changed. Spanish and Mexican law supplied the earliest governmental context. The Constitution of Coahuila y Tejas operated under Mexico's 1824 federal constitution before independence. The Republic of Texas then needed its own national charter in 1836, and annexation required another transition to state government in 1845.",
        "Secession and the Civil War forced two more changes. The 1861 document aligned Texas with the Confederacy. Defeat then required new constitutional arrangements during Presidential and congressional Reconstruction. That is why the constitutions of 1866 and 1869 cannot be understood as routine revisions: they were part of the argument over how Texas would return to the Union and how political rights and state authority would be reorganized after slavery.",
      ],
    },
    {
      heading: "2. The Constitution of 1876 was designed to restrain concentrated state power",
      paragraphs: [
        "The 1875 convention met after Democrats had regained control of Texas government and as Reconstruction was ending. The resulting charter reflected deep skepticism of centralized authority. It shortened terms, divided executive authority among separately elected officers, constrained spending and taxation, and placed extensive operational detail in the constitution itself. Those choices still shape modern Texas political disputes because many actions that another state might accomplish through ordinary legislation can require constitutional authority or a statewide amendment here.",
        "The plural executive is one of the clearest examples. The governor does not appoint a conventional cabinet with control over every major statewide function. Voters separately elect the lieutenant governor, attorney general, comptroller, land commissioner, agriculture commissioner and Railroad Commissioners, while other bodies have their own constitutional or statutory independence. Political power is therefore distributed across offices with separate electoral constituencies.",
      ],
    },
    {
      heading: "3. The constitution makes voters recurring participants in institutional change",
      paragraphs: [
        "Article XVII establishes the amendment process. The Legislature proposes constitutional amendments by the required supermajority vote, but the electorate decides whether each proposal becomes part of the constitution. Texas voters therefore regularly encounter propositions dealing with subjects ranging from taxation and public finance to water, transportation, judicial administration and local governmental authority.",
        "The volume of amendments is not an accident separate from the original design. The 1876 charter contains policy detail that later generations have repeatedly needed to revise. The Texas Legislative Council maintains both the current constitution and a historical record of amendments, while the Secretary of State administers the amendment elections. KTR's current constitutional-amendment coverage is the present-day electoral layer of this longer history.",
      ],
    },
    {
      heading: "4. Judicial selection and local government are constitutional questions too",
      paragraphs: [
        "The constitution does more than define the governor and Legislature. Article V establishes the judicial department and the basic framework for the Supreme Court, Court of Criminal Appeals and lower courts. Texas's long-running debates over partisan judicial elections, appointments to vacancies and possible selection reforms therefore sit inside a constitutional structure rather than being merely campaign-process questions.",
        "Local government is similarly intertwined with constitutional design. Counties derive their core offices and powers from a mix of constitutional and statutory authority, while home-rule cities operate under constitutional permission and state law. Property taxation, school finance and debt limits likewise involve constitutional rules. That is why constitutional history belongs at the center of a Texas government authority system rather than in a stand-alone historical corner.",
      ],
    },
    {
      heading: "5. The failed 1974 convention explains why reform remains incremental",
      paragraphs: [
        "By the twentieth century, criticism of the constitution's length and detail had become familiar. The 1974 Constitutional Convention attempted a comprehensive rewrite, but delegates did not produce a replacement that could complete the process. Subsequent reform has therefore proceeded mainly article by article and amendment by amendment instead of through a single new charter.",
        "For voters today, the practical lesson is that Texas constitutional politics is cumulative. A ballot proposition may look narrow, but it enters a document whose structure reflects the Republic, Civil War, Reconstruction, post-Reconstruction reaction and more than a century of later amendments. Reading the present text together with that history makes modern debates over executive power, courts, taxes, schools and local control much easier to understand.",
      ],
    },
  ],
  sources: [
    { href: "https://www.tsl.texas.gov/treasures/constitution", label: "Texas State Library and Archives Commission: The Texas Constitution of 1876" },
    { href: "https://www.tsl.texas.gov/arc/arclegis.html", label: "Texas State Library and Archives Commission: Legislative and constitutional convention resources" },
    { href: "https://tlc.texas.gov/publications", label: "Texas Legislative Council: Texas Constitution and amendment publications" },
    { href: "https://statutes.capitol.texas.gov/", label: "Texas Legislature Online: Constitution and statutes" },
    { href: "https://lrl.texas.gov/", label: "Legislative Reference Library of Texas" },
  ],
  relatedLinks: [
    { href: "/laws/constitutional-amendments", label: "Texas constitutional amendments", description: "How proposed amendments reach the ballot and how current propositions fit into the 1876 charter." },
    { href: "/texas-government", label: "Texas government", description: "The present-day institutions created by the constitution and state law." },
    { href: "/texas-legislature", label: "Texas Legislature", description: "How the House and Senate exercise the legislative power defined by the constitution." },
    { href: "/texas-politics/texas-supreme-court-realignment", label: "Texas Supreme Court realignment", description: "How judicial elections and partisan change reshaped the state's highest civil court." },
    { href: "/elections/2026", label: "2026 Election Central", description: "Current races and ballot information, including constitutional amendment elections when scheduled." },
  ],
  faqs: [
    {
      question: "How many constitutions has Texas had?",
      answer:
        "Texas has operated under multiple constitutional systems as its political status changed. As an independent nation and then a U.S. state, the major Texas constitutions are the Republic Constitution of 1836 and the state constitutions of 1845, 1861, 1866, 1869 and 1876. Earlier Mexican constitutional government is an important part of the background.",
    },
    {
      question: "Why does Texas still use the Constitution of 1876?",
      answer:
        "Texas has amended the 1876 charter many times rather than replacing it. A major constitutional convention in 1974 did not produce a successful replacement, so modernization has largely continued through individual amendments.",
    },
    {
      question: "Why is the Texas Constitution amended so often?",
      answer:
        "The 1876 constitution includes extensive detail and restrictions on government. Subjects that can be handled by ordinary statutes elsewhere may require constitutional authorization or revision in Texas, which sends recurring amendment propositions to voters.",
    },
  ],
};

export const TEXAS_ELECTION_HISTORY: PoliticalHistoryAuthorityPage = {
  slug: "texas-election-history",
  title: "Texas Election History",
  seoTitle: "Texas Election History: Parties, Primaries, Turnout and Realignment | KeepTXRed",
  description:
    "A source-backed history of Texas elections from one-party Democratic dominance through primaries, runoffs, Republican realignment, early voting, turnout changes and today's Election Central.",
  eyebrow: "Texas election history",
  intro:
    "Texas election history is not a single red-versus-blue timeline. For decades after Reconstruction, the decisive contest was often the Democratic primary because general elections were not competitive statewide. The twentieth century gradually introduced Republican presidential strength, breakthrough statewide candidates, two-party legislative competition and eventually Republican control of statewide offices and both legislative chambers. At the same time, registration rules, early voting, runoff procedures and federal voting-rights law changed how Texans participated.",
  shortAnswer:
    "The central story of modern Texas elections is a shift from a one-party primary-dominated system to sustained two-party competition and then Republican statewide dominance. The transition took decades: Republican presidential voting grew before state-office voting changed; John Tower won a U.S. Senate seat in 1961; Bill Clements won the governorship in 1978; Republicans held both U.S. Senate seats by 1993, swept statewide offices in 1998 and captured the Texas House after the 2002 election. Election administration also evolved through registration reform, expanded early voting, changing federal voting-rights requirements and modern election statutes.",
  reviewed: "2026-08-30",
  timeline: [
    { year: "1870s–1940s", event: "Democratic primary dominance", meaning: "After Reconstruction, statewide general elections were usually noncompetitive and many decisive political fights occurred inside the Democratic primary." },
    { year: "1920", event: "Women vote in a presidential election after the Nineteenth Amendment", meaning: "Women's suffrage transformed the eligible electorate after earlier Texas-specific changes had already expanded women's participation in primary politics." },
    { year: "1944", event: "Smith v. Allwright ends the state-sanctioned white primary", meaning: "The U.S. Supreme Court ruled the Texas Democratic Party's exclusion of Black voters from its primary unconstitutional, a major change in access to the election that often decided officeholders." },
    { year: "1952", event: "Dwight Eisenhower carries Texas", meaning: "Conservative Democratic defections helped demonstrate that presidential voting could move Republican even while Democrats retained most state and local offices." },
    { year: "1961", event: "John Tower wins a U.S. Senate special election", meaning: "Tower became the first Republican U.S. senator from Texas since Reconstruction and established a durable statewide Republican foothold." },
    { year: "1978", event: "Bill Clements elected governor", meaning: "Clements became the first Republican elected Texas governor since Reconstruction, showing that the GOP could win the state's top executive office." },
    { year: "1998", event: "Republicans sweep statewide offices", meaning: "The sweep marked broad Republican institutional strength rather than isolated victories by individual candidates." },
    { year: "2002", event: "Republicans win the Texas House", meaning: "Control of the final legislative chamber completed the GOP's transition to statewide governing-party status." },
  ],
  sections: [
    {
      heading: "1. For much of modern Texas history, the primary was the real election",
      paragraphs: [
        "Following Reconstruction, the Democratic Party dominated Texas government for generations. In many statewide and local races, the meaningful competition occurred in the Democratic primary, with the general election functioning more as ratification than a competitive partisan contest. That structure affected everything from factional politics to voting-rights litigation because access to the primary could determine whether a citizen had a meaningful voice in choosing officeholders.",
        "Texas still uses party primaries and runoff elections, but the political meaning has changed. Today's Republican primary often performs the same practical gatekeeping function in strongly Republican districts that the Democratic primary once performed under one-party dominance. KTR's Election Central therefore treats primaries and runoffs as core elections rather than preliminaries to November.",
      ],
    },
    {
      heading: "2. Presidential realignment happened before full state-government realignment",
      paragraphs: [
        "Texas voters began supporting Republican presidential candidates before they consistently elected Republicans to state office. Dwight Eisenhower carried Texas in 1952 and 1956 with help from conservative Democrats who broke with their national party. That did not immediately create a Republican state government. Ticket splitting allowed Texans to vote Republican for president and Democratic for governor, Legislature or county office for years afterward.",
        "John Tower's 1961 Senate victory, Bill Clements's 1978 gubernatorial win and the growth of Republican strength in metropolitan and suburban counties gradually changed that pattern. The statewide sweep of 1998 and the Republican takeover of the Texas House after the 2002 election are better endpoints for institutional realignment than any single presidential election.",
      ],
    },
    {
      heading: "3. Registration, turnout and early voting changed the mechanics of participation",
      paragraphs: [
        "The Texas Secretary of State maintains historical election results, registration figures and turnout series that make long-term change measurable rather than anecdotal. Those records show both population-driven growth in the electorate and wide variation in participation among presidential elections, gubernatorial elections, primaries and constitutional-amendment elections.",
        "Early voting has also become a major part of the modern Texas election calendar. Any registered voter may vote early in person under current law, while voting by mail remains limited to statutory eligibility categories. The mechanics matter politically because campaigns now organize turnout over a multi-day voting period rather than treating Election Day as the only mobilization event.",
      ],
    },
    {
      heading: "4. Runoffs preserve majority nomination rules in many party contests",
      paragraphs: [
        "Texas party primaries use runoffs when no candidate reaches the required majority in covered contests. That makes the May runoff a distinct stage of the political system. Turnout usually drops from the first primary, which can amplify the influence of highly engaged partisan voters and organized networks in selecting nominees for districts that may be safe in November.",
        "The runoff system is one reason historical election analysis should not rely only on general-election results. A district can undergo a meaningful ideological or factional shift without changing party control if the decisive replacement occurs in the primary or runoff. Current candidate and district pages should therefore connect back to the election-history layer when explaining how an office changes hands.",
      ],
    },
    {
      heading: "5. Today's Election Central is the current layer of a much longer system",
      paragraphs: [
        "Modern Texas elections combine constitutional rules, the Election Code, federal law, party procedures, county administration and district boundaries created through redistricting. Each current race is therefore connected to institutional history: the office may have evolved, its district may have been redrawn, its electorate may have changed and its party competition may look very different from a generation earlier.",
        "KTR's durable election-history pages are intended to keep that context separate from cycle-specific forecasting. Election Central can focus on verified candidates, dates, polls, finance and results while linking readers to the historical explanations that do not expire after November.",
      ],
    },
  ],
  sources: [
    { href: "https://www.sos.state.tx.us/elections/historical/index.shtml", label: "Texas Secretary of State: Historical election results and data" },
    { href: "https://www.sos.state.tx.us/elections/historical/70-92.shtml", label: "Texas Secretary of State: Turnout and voter registration figures, 1970-current" },
    { href: "https://www.sos.state.tx.us/elections/earlyvoting/index.shtml", label: "Texas Secretary of State: Election results and early-voting data" },
    { href: "https://www.tshaonline.org/handbook/entries/political-parties", label: "Handbook of Texas: Political Parties" },
    { href: "https://www.tshaonline.org/handbook/entries/republican-party", label: "Handbook of Texas: Republican Party" },
    { href: "https://www.senate.gov/states/TX/timeline.htm", label: "United States Senate: Texas Senate delegation timeline" },
  ],
  relatedLinks: [
    { href: "/elections/2026", label: "2026 Election Central", description: "Verified current races, candidates, dates, polls, forecasts and voting information." },
    { href: "/texas-politics/how-texas-became-republican", label: "How Texas became Republican", description: "A deeper chronology of the state's modern partisan realignment." },
    { href: "/texas-politics/voting-rights-history", label: "Texas voting-rights history", description: "How access to the ballot and primary changed through state law, litigation and federal law." },
    { href: "/texas-politics/texas-redistricting-history", label: "Texas redistricting history", description: "How changing district lines reshaped congressional and legislative competition." },
    { href: "/districts", label: "Texas legislative districts", description: "Permanent authority pages for the current Texas House and Senate districts." },
  ],
  faqs: [
    { question: "When did Texas become a Republican state?", answer: "There was no single switch. Republican presidential voting grew in the 1950s, statewide breakthroughs followed over several decades, Republicans swept statewide offices in 1998 and captured the Texas House after the 2002 election." },
    { question: "Why are Texas primary elections historically important?", answer: "During the era of Democratic one-party dominance, the Democratic primary often decided who would hold office. In many strongly Republican districts today, the Republican primary or runoff can similarly be the most competitive stage of the election." },
    { question: "Where can I find official historical Texas election results?", answer: "The Texas Secretary of State publishes historical results, turnout and voter-registration data. KeepTXRed uses those official records as a primary source for election-history analysis." },
  ],
};

export const TEXAS_VOTING_RIGHTS_HISTORY: PoliticalHistoryAuthorityPage = {
  slug: "voting-rights-history",
  title: "Texas Voting Rights History",
  seoTitle: "Texas Voting Rights History: Poll Taxes, White Primaries and the Voting Rights Act | KeepTXRed",
  description:
    "A carefully sourced history of voting rights in Texas, including suffrage restrictions, poll taxes, white primaries, women's suffrage, federal court cases, the Voting Rights Act and modern election administration.",
  eyebrow: "Texas voting-rights history",
  intro:
    "The right to vote in Texas has changed through constitutional amendments, state statutes, party rules, federal constitutional law and landmark litigation. The history includes the expansion of women's suffrage, the long exclusion of Black Texans through devices such as poll taxes and white primaries, litigation over Latino political participation, the Voting Rights Act of 1965, changes to federal preclearance and continuing disputes over districting and election rules. This page separates that legal history from current partisan arguments and focuses on what changed, when, and through which institution.",
  shortAnswer:
    "Texas voting rights expanded through a combination of state change and federal intervention. Women gained full voting rights through the Nineteenth Amendment after Texas had already allowed women to participate in primary elections. Black Texans faced disenfranchisement through poll taxes, white-primary rules and other barriers until federal constitutional decisions and later federal legislation dismantled those systems. The Voting Rights Act of 1965 became central to Texas election administration and redistricting; Texas was later brought under federal preclearance, while the Supreme Court's 2013 Shelby County decision made the coverage formula that triggered preclearance inoperative. Modern disputes continue under the Constitution, the Voting Rights Act and state election law.",
  reviewed: "2026-08-30",
  timeline: [
    { year: "1902", event: "Texas adopts a poll-tax requirement", meaning: "The tax became a major barrier to participation and operated alongside other features of the one-party political system." },
    { year: "1918", event: "Texas women gain access to primary voting", meaning: "State legislation allowed women to vote in primary elections before nationwide women's suffrage was secured." },
    { year: "1920", event: "Nineteenth Amendment ratified nationwide", meaning: "Women gained constitutional protection against denial of the vote on account of sex in federal and state elections." },
    { year: "1927–1935", event: "White-primary litigation reaches the Supreme Court repeatedly", meaning: "Texas changed the legal mechanism for excluding Black voters after earlier versions were struck down, shifting from statute toward party-based rules." },
    { year: "1944", event: "Smith v. Allwright", meaning: "The Supreme Court held that the Texas Democratic Party's white primary violated the Fifteenth Amendment because the primary was part of the state's election machinery." },
    { year: "1964", event: "Twenty-Fourth Amendment bars poll taxes in federal elections", meaning: "The constitutional amendment prohibited poll-tax requirements in federal elections." },
    { year: "1965", event: "Voting Rights Act becomes federal law", meaning: "The act created major federal protections against racial discrimination in voting and later became central to Texas redistricting and election litigation." },
    { year: "2013", event: "Shelby County v. Holder changes preclearance enforcement", meaning: "The Supreme Court invalidated the Voting Rights Act coverage formula used to determine which jurisdictions were automatically subject to Section 5 preclearance, ending that automatic regime unless Congress adopts a new valid formula." },
  ],
  sections: [
    {
      heading: "1. Disenfranchisement worked through both law and party structure",
      paragraphs: [
        "After Reconstruction, Texas's one-party Democratic system made the primary election especially important. Exclusion from the primary could effectively exclude a citizen from the only competitive stage of many elections. State law, party rules, registration requirements and the poll tax combined to narrow political participation, with Black Texans and many Mexican American Texans bearing much of the burden.",
        "That history matters because the white-primary cases were not simply about a private club deciding membership. The litigation forced courts to confront whether a party primary that functioned as an integral part of the state's election system could evade constitutional voting-rights protections by calling discriminatory rules private party action.",
      ],
    },
    {
      heading: "2. The white-primary cases changed the constitutional boundary between parties and the state",
      paragraphs: [
        "Texas repeatedly altered the mechanism used to exclude Black voters after courts struck down earlier versions. In Nixon v. Herndon, Nixon v. Condon and later cases, the Supreme Court addressed different forms of exclusion. The decisive 1944 ruling in Smith v. Allwright held that the Texas Democratic Party primary was sufficiently connected to state election machinery that racial exclusion violated the Fifteenth Amendment.",
        "The ruling did not instantly eliminate every obstacle to political participation, but it removed a central legal device of the one-party era. Because winning the Democratic primary often meant winning office, opening the primary had consequences for representation, party organization and the ability of Black Texans to participate meaningfully in statewide and local politics.",
      ],
    },
    {
      heading: "3. Poll-tax abolition and the Voting Rights Act transformed the legal framework",
      paragraphs: [
        "The Twenty-Fourth Amendment prohibited poll taxes in federal elections, and subsequent Supreme Court doctrine barred wealth-based poll taxes in state elections. The Voting Rights Act of 1965 added federal statutory protections, including nationwide prohibitions on discriminatory voting practices and special enforcement mechanisms for covered jurisdictions.",
        "Texas became subject to Section 5 preclearance after later federal legislation and findings regarding language-minority discrimination. For decades, many changes to Texas election law and district maps could not take effect without federal preclearance. That requirement made the Department of Justice and the U.S. District Court for the District of Columbia recurring actors in Texas election administration and redistricting.",
      ],
    },
    {
      heading: "4. Latino representation and language access are core parts of Texas voting-rights history",
      paragraphs: [
        "Texas voting-rights history is not limited to Black-white exclusion. Mexican American political organizations and litigants challenged discriminatory structures in representation, districting and election administration. Federal voting-rights protections were expanded to address language-minority barriers, an especially significant development in a state with a large Spanish-speaking population.",
        "Redistricting litigation often combines population equality, racial-vote-dilution claims and partisan objectives. The legal questions are distinct: a map can be challenged under different constitutional or statutory theories, and courts do not treat every political disadvantage as a voting-rights violation. KTR's redistricting history page separates those doctrines while linking them to the broader rights chronology.",
      ],
    },
    {
      heading: "5. Modern voting-law disputes operate in a different federal framework",
      paragraphs: [
        "In Shelby County v. Holder, the Supreme Court invalidated the Voting Rights Act's coverage formula used to determine which jurisdictions were automatically subject to Section 5 preclearance. The ruling did not erase the Voting Rights Act; provisions such as Section 2 remain enforceable. But Texas no longer has the same automatic preclearance obligation that governed earlier decades unless a valid new coverage mechanism or a court-ordered remedy applies.",
        "Current arguments over voter identification, mail ballots, registration, list maintenance, polling procedures and district maps should therefore be analyzed under the law in force today rather than by importing an earlier preclearance regime unchanged. This history page supplies the institutional sequence, while KTR's election-law guides track present requirements and current litigation separately.",
      ],
    },
  ],
  sources: [
    { href: "https://www.archives.gov/milestone-documents/voting-rights-act", label: "National Archives: Voting Rights Act of 1965" },
    { href: "https://www.justice.gov/crt/history-federal-voting-rights-laws", label: "U.S. Department of Justice Civil Rights Division: History of federal voting-rights laws" },
    { href: "https://www.tshaonline.org/handbook/entries/white-primary", label: "Handbook of Texas: White Primary" },
    { href: "https://www.tshaonline.org/handbook/entries/poll-tax", label: "Handbook of Texas: Poll Tax" },
    { href: "https://www.sos.state.tx.us/elections/", label: "Texas Secretary of State: Elections Division" },
    { href: "https://www.supremecourt.gov/", label: "Supreme Court of the United States" },
  ],
  relatedLinks: [
    { href: "/laws/topic/texas-election-law", label: "Texas election law", description: "Current voter ID, registration, mail-ballot, poll-watcher and election-administration requirements." },
    { href: "/texas-politics/texas-election-history", label: "Texas election history", description: "The broader history of primaries, turnout, party competition and election administration." },
    { href: "/texas-politics/texas-redistricting-history", label: "Texas redistricting history", description: "How population equality, the Voting Rights Act and partisan conflict shaped district maps." },
    { href: "/register-to-vote", label: "Register to vote in Texas", description: "Current registration guidance and official voter resources." },
    { href: "/elections/2026", label: "2026 Election Central", description: "Current verified races, dates and voting information." },
  ],
  faqs: [
    { question: "What was the Texas white primary?", answer: "During the one-party era, Texas Democratic primary rules excluded Black voters from the election that often effectively selected officeholders. The U.S. Supreme Court held the white primary unconstitutional in Smith v. Allwright in 1944." },
    { question: "Did Shelby County v. Holder repeal the Voting Rights Act?", answer: "No. The 2013 decision invalidated the coverage formula used to determine which jurisdictions were automatically subject to Section 5 preclearance. Other Voting Rights Act provisions, including Section 2, remain in force." },
    { question: "Why does voting-rights history matter to Texas redistricting?", answer: "District maps can affect the ability of racial and language-minority voters to elect candidates of choice. Voting Rights Act requirements and constitutional rules have therefore been central to repeated Texas redistricting disputes." },
  ],
};

export const TEXAS_REDISTRICTING_HISTORY: PoliticalHistoryAuthorityPage = {
  slug: "texas-redistricting-history",
  title: "Texas Redistricting History",
  seoTitle: "Texas Redistricting History: Census Maps, 2003 and Voting Rights | KeepTXRed",
  description:
    "A source-backed history of Texas congressional and legislative redistricting, including census cycles, one-person-one-vote, the Legislative Redistricting Board, Voting Rights Act litigation, 2003 mid-decade redistricting and modern map cycles.",
  eyebrow: "Texas redistricting history",
  intro:
    "Redistricting is where population change becomes political geography. Texas must periodically redraw congressional and state legislative districts as population shifts and the state gains or redistributes representation. The process is governed by the U.S. Constitution, federal voting-rights law and the Texas Constitution, but the political stakes are unavoidable: district lines determine which voters are grouped together, which incumbents face one another and where parties can realistically compete. Texas has produced some of the country's most consequential redistricting fights, including the 2003 mid-decade congressional redraw.",
  shortAnswer:
    "Texas redraws districts after each decennial census, with different constitutional procedures for congressional districts and the Texas Legislature. State House and Senate redistricting is primarily a legislative responsibility, but if the Legislature fails to enact those maps in the first regular session after the census, the Texas Constitution assigns the task to the Legislative Redistricting Board. Federal population-equality rules and the Voting Rights Act constrain the maps. Congressional redistricting has repeatedly produced litigation, and the 2003 mid-decade redraw demonstrated that a state may revisit congressional lines between censuses, subject to federal constitutional and statutory limits.",
  reviewed: "2026-08-30",
  timeline: [
    { year: "1960s", event: "One-person-one-vote doctrine transforms legislative districting", meaning: "Federal court decisions required state legislative districts to satisfy population-equality principles, ending systems that allowed severe population disparities among districts." },
    { year: "1970s", event: "Texas enters the modern Voting Rights Act redistricting era", meaning: "Federal voting-rights requirements become a recurring constraint on Texas maps and election changes." },
    { year: "1980s–1990s", event: "Rapid population growth and minority representation drive repeated map litigation", meaning: "New congressional seats, urban growth and disputes over minority voting strength made Texas a recurring redistricting battleground." },
    { year: "2001", event: "Post-census congressional map ends up in federal court", meaning: "Political deadlock prevented the Legislature from enacting a congressional map, leaving courts to establish lines for the 2002 election." },
    { year: "2003", event: "Legislature redraws congressional districts mid-decade", meaning: "Republican majorities revisited the court-drawn congressional map outside the normal immediate post-census cycle, triggering intense legislative conflict and national litigation." },
    { year: "2006", event: "LULAC v. Perry reaches the U.S. Supreme Court", meaning: "The Court rejected the claim that mid-decade redistricting was inherently unconstitutional but held that one South Texas district violated Section 2 of the Voting Rights Act." },
    { year: "2011–2013", event: "Post-2010 census maps face preclearance and federal litigation", meaning: "Texas's maps were litigated under the Voting Rights Act and constitutional theories while the federal preclearance framework was changing." },
    { year: "2021", event: "Post-2020 census maps establish the current decade's baseline", meaning: "Population growth gave Texas additional congressional representation and the Legislature enacted new congressional, House, Senate and State Board of Education maps." },
  ],
  sections: [
    {
      heading: "1. Redistricting starts with population, but it is carried out by political institutions",
      paragraphs: [
        "The decennial census supplies the population data that drives reapportionment and district revision. Texas's congressional delegation can gain seats when the state's population grows faster than other states, while the fixed-size Texas House and Senate must redistribute population among their existing districts. State Board of Education districts are redrawn as part of the same broad cycle.",
        "Population equality is a legal requirement, but line-drawing also involves political judgment. Legislators choose how to combine counties, neighborhoods and communities within legal limits. Those choices affect incumbent pairings, partisan performance, minority voting strength and the geographic coherence of districts, which is why redistricting repeatedly becomes both a legislative fight and a court fight.",
      ],
    },
    {
      heading: "2. Texas has a constitutional backstop for state legislative maps",
      paragraphs: [
        "Article III, Section 28 of the Texas Constitution gives the Legislature the first opportunity to reapportion Texas House and Senate districts at its first regular session after publication of the decennial census. If it fails, the Legislative Redistricting Board is convened to perform the state legislative redistricting task. The board is composed of statewide officials specified by the constitution.",
        "That backstop does not apply in the same way to congressional redistricting. When political branches fail to produce a congressional map, litigation can leave courts responsible for an interim or remedial plan. Distinguishing congressional, House, Senate and State Board of Education maps is essential because they do not all follow identical procedures.",
      ],
    },
    {
      heading: "3. Voting Rights Act law changed what mapmakers had to prove",
      paragraphs: [
        "For decades, Texas was subject to federal preclearance requirements that affected redistricting plans before they could take effect. Mapmakers also had to comply with Section 2 of the Voting Rights Act, which prohibits voting practices that unlawfully dilute protected minority voting strength under the governing legal test. Constitutional equal-protection rules create additional limits, including restrictions on racial classifications in districting.",
        "Shelby County v. Holder changed the preclearance framework in 2013 by invalidating the coverage formula used to determine which jurisdictions were automatically subject to Section 5. Section 2 litigation remained available, so the end of automatic preclearance did not remove federal voting-rights law from Texas redistricting.",
      ],
    },
    {
      heading: "4. The 2003 mid-decade redraw became a national redistricting precedent",
      paragraphs: [
        "After the 2000 census, the Texas Legislature did not enact a new congressional plan, and a federal court drew lines for the 2002 election. Once Republicans gained control of the Texas House, state leaders pursued a new congressional map in 2003 rather than waiting for the next census. The fight included special sessions, broken quorum episodes by Democratic legislators and intense disputes over partisan control of the congressional delegation.",
        "The resulting litigation reached the U.S. Supreme Court in LULAC v. Perry. The Court did not hold that mid-decade congressional redistricting is inherently unconstitutional, but it found a Voting Rights Act violation involving Congressional District 23 and required a remedy. The case is central to understanding both the legal permissibility of mid-decade redistricting and the continuing force of federal voting-rights constraints.",
      ],
    },
    {
      heading: "5. Redistricting history connects directly to today's district and election pages",
      paragraphs: [
        "A current district page is a snapshot of one map cycle, not a permanent natural boundary. District numbers can move geographically, constituencies can change dramatically and incumbents can inherit districts that bear little resemblance to earlier versions with the same number. Historical election results therefore need map context before they are compared across decades.",
        "KeepTXRed treats the redistricting history page as the durable explanation beneath current district authority. Election Central can link a 2026 race to its present district, while the history layer explains why that district exists, which census cycle produced it and which legal rules govern the next redraw.",
      ],
    },
  ],
  sources: [
    { href: "https://redistricting.capitol.texas.gov/", label: "Texas Legislature: Redistricting portal" },
    { href: "https://tlc.texas.gov/publications", label: "Texas Legislative Council: Guide to redistricting and legislative reference publications" },
    { href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.3.htm", label: "Texas Constitution Article III, including legislative redistricting provisions" },
    { href: "https://senate.texas.gov/news.php?id=20030723a", label: "Texas Senate: 2003 congressional redistricting committee history" },
    { href: "https://senate.texas.gov/news.php?id=20030917a&lang=en", label: "Texas Senate: 2003 redistricting special-session history" },
    { href: "https://www.justice.gov/crt/history-federal-voting-rights-laws", label: "U.S. Department of Justice: Federal voting-rights law history" },
    { href: "https://www.supremecourt.gov/", label: "Supreme Court of the United States" },
  ],
  relatedLinks: [
    { href: "/districts", label: "Texas legislative districts", description: "Current permanent authority pages for all Texas House and Senate districts." },
    { href: "/texas-politics/voting-rights-history", label: "Texas voting-rights history", description: "The federal and state rights framework that constrains district maps." },
    { href: "/texas-politics/texas-election-history", label: "Texas election history", description: "How map changes interact with party realignment and voter behavior." },
    { href: "/texas-politics/figures/tom-delay-texas-redistricting-congress", label: "Tom DeLay and Texas redistricting", description: "Political-figure context for the 2003 congressional redistricting fight." },
    { href: "/elections/2026", label: "2026 Election Central", description: "Current races contested under the district lines in force for this cycle." },
  ],
  faqs: [
    { question: "Who draws Texas legislative districts?", answer: "The Texas Legislature has the first responsibility to redraw Texas House and Senate districts after the decennial census. If it fails to do so in the constitutionally specified session, the Legislative Redistricting Board becomes responsible for those state legislative maps." },
    { question: "What was unusual about Texas redistricting in 2003?", answer: "The Legislature redrew congressional districts in the middle of the decade after Republicans gained full legislative control, replacing a court-drawn post-2000 census map rather than waiting for the next census cycle." },
    { question: "Did the Supreme Court ban mid-decade redistricting in LULAC v. Perry?", answer: "No. The Court did not hold mid-decade congressional redistricting inherently unconstitutional, but it found a Voting Rights Act violation involving one part of the Texas plan and required a remedy." },
  ],
};

export const TEXAS_POLITICAL_HISTORY_AUTHORITY_PAGES = [
  TEXAS_CONSTITUTIONAL_HISTORY,
  TEXAS_ELECTION_HISTORY,
  TEXAS_VOTING_RIGHTS_HISTORY,
  TEXAS_REDISTRICTING_HISTORY,
] as const;
