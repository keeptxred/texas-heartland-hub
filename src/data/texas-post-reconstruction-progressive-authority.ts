import type { PoliticalHistoryAuthorityPage } from "./texas-political-history-authority";

const REVIEWED = "2026-08-30";
const POLITICS = "/texas-politics";
const CONSTITUTION = "/texas-politics/texas-constitutional-history";
const ELECTIONS = "/texas-politics/texas-election-history";
const VOTING = "/texas-politics/voting-rights-history";
const RECONSTRUCTION = "/texas-politics/texas-reconstruction-government";
const RECONSTRUCTION_GOP = "/texas-politics/reconstruction-republicans";

export const DEMOCRATIC_RESTORATION_TEXAS: PoliticalHistoryAuthorityPage = {
  slug: "democratic-restoration-texas-1874-1900",
  title: "Democratic Restoration in Texas, 1874–1900: The One-Party System Takes Shape",
  seoTitle: "Democratic Restoration in Texas, 1874–1900: Coke, the 1876 Constitution and One-Party Rule | KeepTXRed",
  description: "A source-backed history of Texas politics after Reconstruction: Richard Coke, the 1876 Constitution, Democratic dominance, retrenchment, opposition parties and the foundations of the one-party era.",
  eyebrow: "Post-Reconstruction Texas politics",
  intro: "The end of Republican state control in January 1874 did more than change governors. Richard Coke's Democratic victory began a political order that would dominate Texas for generations. Democrats dismantled or revised institutions associated with Reconstruction, emphasized lower taxes and decentralized government, wrote the Constitution of 1876 and gradually made their primary the decisive arena for statewide politics. Republicans remained an organized party, and Greenbackers, Populists and other movements challenged Democratic control, but none displaced it before the twentieth century.",
  shortAnswer: "Democratic restoration began when Richard Coke defeated Republican governor Edmund J. Davis in the disputed 1873 election and took office in January 1874. Democrats then controlled the 1875 constitutional convention and wrote the Constitution of 1876, which dispersed executive authority, limited taxation and debt, restricted legislative sessions and restored elected local institutions. For the rest of the nineteenth century Democrats usually dominated statewide government, while Republicans, Greenbackers and later Populists supplied opposition. That system was not politically static: agrarian distress, railroad regulation, race, public finance and factional conflict repeatedly divided the Democratic coalition and generated reform movements that shaped modern Texas institutions.",
  reviewed: REVIEWED,
  timeline: [
    { year: "December 1873", event: "Richard Coke defeats Edmund J. Davis", meaning: "The Democratic victory ends Reconstruction-era Republican electoral control of state government." },
    { year: "January 1874", event: "Coke takes office after a disputed transition", meaning: "Federal authorities decline to restore Davis, consolidating Democratic control in Austin." },
    { year: "1875", event: "Constitutional convention convenes", meaning: "A Democratic-dominated convention rewrites the structure of state government." },
    { year: "1876", event: "Voters ratify the Constitution of 1876", meaning: "The new charter limits centralized power, taxation, debt and regular legislative sessions." },
    { year: "1878–1880", event: "Greenback challenge grows", meaning: "Economic distress produces organized third-party opposition to the Democratic establishment." },
    { year: "1880s", event: "Farm organizations expand", meaning: "The Farmers' Alliance turns economic grievances into a statewide reform network." },
    { year: "1890–1891", event: "James Hogg wins and Railroad Commission is created", meaning: "Railroad regulation shows that reform can be absorbed into Democratic state government." },
    { year: "1892–1896", event: "Populists mount serious statewide challenges", meaning: "The People's Party becomes the strongest third-party threat of the post-Reconstruction era." },
  ],
  sections: [
    { heading: "1. The 1873–1874 transition ended Republican state control", paragraphs: [
      "Democrat Richard Coke defeated Republican governor Edmund J. Davis in the 1873 election by a wide margin. The transfer of power was nevertheless contested. Davis relied on a Texas Supreme Court ruling that questioned the validity of the election and remained in the Capitol while Coke's supporters organized a rival government. President Ulysses S. Grant declined to provide federal troops to keep Davis in office, and Coke assumed the governorship in January 1874. The episode marked the practical end of Reconstruction government in Texas even though the constitutional consequences were still to come.",
      "The political meaning of the transition extended beyond party labels. Democrats campaigned against the taxes, state police, militia powers and centralized institutions they associated with the Davis administration. Their return to power was described by supporters as redemption or restoration, but it also reduced the political leverage that Black Texans and White Unionists had exercised under congressional Reconstruction. The new majority's governing program therefore combined fiscal retrenchment and institutional decentralization with the restoration of White Democratic dominance." ] },
    { heading: "2. The Constitution of 1876 turned the restoration into a durable governmental structure", paragraphs: [
      "The constitutional convention of 1875 translated post-Reconstruction political reaction into institutional design. Delegates wrote a charter that dispersed executive authority among separately elected officers, limited regular legislative sessions, restricted debt and taxation, restored many elected local offices and placed detailed policy rules directly in the constitution. Voters ratified the document in 1876, and it remains the foundation of Texas government.",
      "Those choices mattered politically because they made sweeping centralized action more difficult regardless of which party controlled Austin. The governor retained important appointment, veto and special-session powers but did not command a unified cabinet. Counties and locally elected officials carried substantial responsibilities. The Legislature met biennially in regular session. Texas therefore entered its long Democratic era with a constitutional system deliberately designed to fragment authority." ] },
    { heading: "3. Democratic dominance did not mean political unanimity", paragraphs: [
      "Late-nineteenth-century Texas Democrats included farmers, ranchers, merchants, lawyers, urban interests and regional factions whose economic priorities often clashed. Disputes over public debt, taxation, land policy, railroads, monetary policy and prohibition repeatedly divided the party. Because winning the Democratic nomination increasingly became the most reliable path to office, many policy fights occurred inside the dominant party rather than between equally matched statewide parties.",
      "Republicans remained especially important among Black voters, former Unionists and some business and regional constituencies. Greenbackers and independent movements also challenged Democratic candidates. These groups could affect close races and coalition strategies even when they could not control the state. The later People's Party would build on precisely this tradition of organized dissent." ] },
    { heading: "4. Agrarian and railroad politics forced the dominant party to respond", paragraphs: [
      "Rapid railroad expansion connected Texas farms and towns to national markets but also generated complaints about freight rates, discriminatory practices and corporate power. At the same time, farmers faced credit pressures, falling prices and debt. Organizations such as the Grange and Farmers' Alliance created cooperative enterprises and demanded political reforms. These movements made economic regulation a central test of whether Democratic government would respond to rural voters or protect established interests.",
      "James Stephen Hogg turned railroad regulation into a winning gubernatorial issue in 1890. Voters approved constitutional authority for regulation, and the Legislature created the Railroad Commission in 1891. The episode demonstrated a recurring feature of one-party politics: a dominant party could preserve electoral control by absorbing parts of an insurgent reform agenda while fighting independent parties for the same voters." ] },
    { heading: "5. The one-party order hardened only after intense competition", paragraphs: [
      "The People's Party challenged Democrats in the 1890s with an unusually strong rural organization and a program that included railroad regulation, monetary reform, land protection and political reforms. Populist gubernatorial candidate Thomas Nugent won roughly a quarter of the vote in 1892, while Jerome Kearby reached roughly 44 percent in 1896 with Republican support. Those totals show that Democratic dominance was tested rather than automatic.",
      "Populism declined after 1896 as national fusion disputes, changing economic conditions and Democratic adoption of selected reform themes weakened the third party. At the same time, legal and political restrictions on participation narrowed the electorate. By the early twentieth century the Democratic primary, not the November general election, had become the decisive statewide contest in much of Texas. Understanding that outcome requires seeing the 1874–1900 period as the construction of a political system, not simply a long list of Democratic governors." ] },
  ],
  sources: [
    { href: "https://www.tshaonline.org/handbook/entries/coke-richard", label: "Handbook of Texas: Richard Coke" },
    { href: "https://www.tshaonline.org/handbook/entries/late-nineteenth-century-texas", label: "Handbook of Texas: Late Nineteenth-Century Texas" },
    { href: "https://www.tsl.texas.gov/treasures/constitution", label: "Texas State Library and Archives: constitutional history" },
    { href: "https://www.tshaonline.org/handbook/entries/peoples-party", label: "Handbook of Texas: People's Party" },
    { href: "https://www.rrc.texas.gov/about-us/", label: "Railroad Commission of Texas: agency history" },
  ],
  relatedLinks: [
    { href: RECONSTRUCTION, label: "Texas Reconstruction government", description: "The governmental order displaced by the 1874 Democratic restoration." },
    { href: "/texas-politics/texas-constitutional-convention-1875", label: "1875 constitutional convention", description: "How the post-Reconstruction majority wrote the framework that became the Constitution of 1876." },
    { href: CONSTITUTION, label: "Texas constitutional history", description: "The complete sequence of Republic and state constitutions." },
    { href: "/texas-politics/texas-farmers-alliance-populism", label: "Farmers' Alliance and Populism", description: "The major agrarian challenge to the late-nineteenth-century political order." },
    { href: ELECTIONS, label: "Texas election history", description: "How dominant-party primaries and two-party competition changed across Texas history." },
  ],
  faqs: [
    { question: "When did Democrats regain control of Texas after Reconstruction?", answer: "Richard Coke defeated Edmund J. Davis in the 1873 election and took office in January 1874, beginning sustained Democratic control of state government." },
    { question: "Was Texas immediately a completely one-party state after 1874?", answer: "No. Republicans, Greenbackers, independents and especially Populists mounted meaningful challenges. Democratic dominance hardened over time as opposition weakened and the Democratic primary became the decisive contest." },
    { question: "How did Democratic restoration affect the Constitution of 1876?", answer: "The post-Reconstruction majority favored dispersed authority, lower taxes and debt limits, elected local offices and constraints on centralized state power. Those priorities strongly shaped the 1875 convention and 1876 Constitution." },
  ],
};

export const TEXAS_FARMERS_ALLIANCE_POPULISM: PoliticalHistoryAuthorityPage = {
  slug: "texas-farmers-alliance-populism",
  title: "Texas Farmers' Alliance and Populism: The Agrarian Revolt That Challenged One-Party Rule",
  seoTitle: "Texas Farmers' Alliance and Populist Party History: Agrarian Reform and the People's Party | KeepTXRed",
  description: "A source-backed guide to the Farmers' Alliance, Colored Farmers' Alliance and People's Party in Texas, including cooperatives, railroad regulation, monetary reform and the elections of the 1890s.",
  eyebrow: "Agrarian political history",
  intro: "Texas was one of the principal birthplaces of the Farmers' Alliance and one of the strongest states for the People's Party. What began as rural cooperative organization became a political rebellion against debt, railroad power, tight money and the Democratic establishment. The movement built newspapers, lecturers, local clubs and conventions across the state, created biracial possibilities that were never fully realized, and forced mainstream politicians to respond to demands for regulation and reform.",
  shortAnswer: "The Farmers' Alliance grew in Texas during the 1870s and 1880s as farmers organized cooperatives, purchasing networks and political education. Texas Alliance leaders helped build the Southern Alliance, while a separate Colored Farmers' Alliance organized Black farmers. By 1891 reformers had organized the Texas People's Party. Populist Thomas Nugent won about one-quarter of the 1892 gubernatorial vote, and Jerome Kearby reached roughly 44 percent in 1896 with Republican support. The party declined after the national fusion fight of 1896 and changing economic conditions, but its demands for railroad regulation, electoral reform and stronger public oversight influenced later Texas politics.",
  reviewed: REVIEWED,
  timeline: [
    { year: "1870s", event: "Farmers' Alliance begins in Texas", meaning: "Rural producers organize against credit, marketing and transportation disadvantages." },
    { year: "1886", event: "Colored Farmers' Alliance organizes in Houston", meaning: "Black farmers create a parallel cooperative and reform organization amid segregation." },
    { year: "1887", event: "Southern Alliance forms", meaning: "Texas and Louisiana organizations help create a rapidly expanding regional movement." },
    { year: "1890", event: "Railroad regulation dominates state politics", meaning: "Alliance pressure helps make corporate regulation central to the Hogg gubernatorial campaign." },
    { year: "1891", event: "Texas People's Party formally organizes", meaning: "Agrarian reformers create an independent electoral vehicle rather than relying only on Democratic primaries." },
    { year: "1892", event: "Thomas Nugent wins about one-quarter of the gubernatorial vote", meaning: "Populism becomes a serious statewide challenge." },
    { year: "1896", event: "Jerome Kearby reaches roughly 44 percent", meaning: "Republican-Populist cooperation creates the movement's strongest gubernatorial showing." },
    { year: "1900s", event: "People's Party declines", meaning: "Fusion disputes, prosperity and Democratic absorption of reforms reduce the third party's viability." },
  ],
  sections: [
    { heading: "1. The movement began with economics before it became a party", paragraphs: [
      "Texas farmers in the late nineteenth century operated in a system shaped by crop liens, merchant credit, railroad freight rates and volatile commodity prices. The Farmers' Alliance responded first with cooperative economics: members tried to purchase supplies together, market crops more effectively and reduce dependence on creditors and middlemen. Educational meetings and lecturers turned local grievances into a shared interpretation of how transportation, banking and monetary policy affected farm families.",
      "This organizational infrastructure mattered politically. A statewide reform movement needs more than a platform; it needs local institutions that can recruit members, distribute information and sustain action between elections. Alliance lodges, cooperative enterprises and newspapers supplied that network before an independent party existed." ] },
    { heading: "2. Texas helped turn the Alliance into a regional and national force", paragraphs: [
      "Under leaders such as Charles W. Macune, the Texas Farmers' Alliance became influential beyond the state. Its 1887 merger with the Louisiana Farmers' Union helped create the National Farmers' Alliance and Industrial Union, commonly called the Southern Alliance. The movement promoted cooperative marketing and a broad reform program involving money, transportation and taxation.",
      "Black farmers also organized. The Colored Farmers' Alliance and Cooperative Union was established in Houston in 1886 and spread across the South. The existence of parallel organizations reflected both the common economic pressures facing farmers and the racial segregation that constrained collective action. Later Populists attempted biracial electoral cooperation, but racial prejudice, violence and competing Republican loyalties limited how far that strategy could go." ] },
    { heading: "3. Alliance demands moved from cooperation to public policy", paragraphs: [
      "Farm reformers increasingly argued that private cooperation could not solve structural problems alone. They supported government regulation or ownership of transportation and communications, monetary expansion, tax reform, direct election reforms and stronger public education. The subtreasury proposal sought federal mechanisms that would allow farmers to store crops and obtain credit rather than selling immediately into depressed markets.",
      "Texas Democrats responded selectively. James Hogg's successful campaign for railroad regulation and the creation of the Railroad Commission demonstrated that the dominant party could absorb a popular demand without accepting the Alliance's full economic program. That dynamic pushed activists who distrusted Democratic promises toward independent political organization." ] },
    { heading: "4. The People's Party became Texas's strongest third-party challenge", paragraphs: [
      "Texas Populists formally organized a state People's Party in 1891. They built clubs, county and district conventions, campaign committees, speakers' networks and a large reform press. In 1892 Thomas Nugent won approximately 25 percent of the gubernatorial vote, while presidential Populist James B. Weaver also drew substantial Texas support. The results made clear that agrarian discontent could no longer be treated as a fringe movement.",
      "The party drew small farmers, laborers, some ranchers, reform-minded Democrats, Republicans and Black supporters. Its attempt to assemble a biracial coalition was politically significant but unstable. Democratic appeals to White supremacy and the continuing identification of many Black voters with the Republican Party limited the coalition, while local racial intimidation imposed additional barriers." ] },
    { heading: "5. The 1896 fusion crisis produced both a high-water mark and a collapse", paragraphs: [
      "National Populists nominated Democratic free-silver candidate William Jennings Bryan for president in 1896, a fusion strategy that divided Texas activists who feared the Democratic Party would absorb and destroy their movement. Texas delegates strongly resisted full fusion. At the state level, Populist gubernatorial nominee Jerome Kearby won roughly 44 percent of the vote, aided by the absence of a separate Republican gubernatorial candidate.",
      "The strong gubernatorial result masked organizational damage. National fusion, economic recovery and Democratic adoption of selected reform positions reduced the independent party's appeal. By 1900 the People's Party had lost most of its electoral force. Its institutional legacy survived, however, in reform ideas and organizing traditions later associated with progressive regulation, primary reform and public oversight. Populism therefore matters not only as a failed third party but as a force that changed what mainstream Texas politicians had to address." ] },
  ],
  sources: [
    { href: "https://www.tshaonline.org/handbook/entries/farmers-alliance", label: "Handbook of Texas: Farmers' Alliance" },
    { href: "https://www.tshaonline.org/handbook/entries/peoples-party", label: "Handbook of Texas: People's Party" },
    { href: "https://www.tshaonline.org/handbook/entries/agriculture", label: "Handbook of Texas: Agriculture" },
    { href: "https://www.tshaonline.org/handbook/entries/southern-mercury", label: "Handbook of Texas: Southern Mercury" },
    { href: "https://www.rrc.texas.gov/resource-center/research/research-queries/imaged-records/historical-hearing-finding-aid/", label: "Railroad Commission of Texas: origins of railroad regulation" },
  ],
  relatedLinks: [
    { href: "/texas-politics/democratic-restoration-texas-1874-1900", label: "Democratic restoration", description: "The dominant political order the agrarian movement challenged." },
    { href: "/texas-politics/texas-railroad-commission-regulatory-politics", label: "Railroad Commission and regulatory politics", description: "How railroad grievances produced a permanent state regulatory institution." },
    { href: "/texas-politics/texas-progressive-era-politics", label: "Progressive Era politics", description: "How later reformers carried regulation and electoral reform into the twentieth century." },
    { href: ELECTIONS, label: "Texas election history", description: "The broader evolution of Texas party competition and primaries." },
    { href: VOTING, label: "Texas voting rights history", description: "The legal changes that narrowed and later expanded participation." },
  ],
  faqs: [
    { question: "Did the Farmers' Alliance start in Texas?", answer: "Texas was a central birthplace and organizing base of the movement. Texas Alliance leaders helped create the Southern Alliance, which expanded across the region." },
    { question: "How strong were Texas Populists?", answer: "They were the state's strongest late-nineteenth-century third-party movement. Thomas Nugent won about 25 percent for governor in 1892, and Jerome Kearby reached about 44 percent in 1896 with Republican support." },
    { question: "What happened to the People's Party in Texas?", answer: "It declined after the 1896 fusion dispute, improving economic conditions and Democratic adoption of some reform themes. Its ideas continued to influence regulation and progressive-era politics." },
  ],
};

export const TEXAS_RAILROAD_COMMISSION_REGULATORY_POLITICS: PoliticalHistoryAuthorityPage = {
  slug: "texas-railroad-commission-regulatory-politics",
  title: "The Railroad Commission and the Rise of Texas Regulatory Politics",
  seoTitle: "Texas Railroad Commission History: Hogg, Railroad Regulation and State Regulatory Power | KeepTXRed",
  description: "A source-backed political history of the Railroad Commission of Texas, from the 1890 regulation campaign and 1891 creation through elected commissioners and the expansion of state regulatory power.",
  eyebrow: "Texas regulatory history",
  intro: "The Railroad Commission of Texas began as a political answer to one of the biggest conflicts of the late nineteenth century: whether the state could restrain powerful railroads whose rates shaped the fortunes of farmers, merchants and towns. James Stephen Hogg made regulation a defining issue of the 1890 governor's race. Voters approved constitutional authority, the Legislature created the commission in 1891, and Texas established what is now its oldest regulatory agency. The commission later shifted from railroads toward oil, gas and pipelines, but its creation marked a lasting expansion of administrative state power.",
  shortAnswer: "Texas created the Railroad Commission in 1891 after voters approved a constitutional amendment authorizing railroad regulation and James Hogg won the governorship campaigning on the issue. The original three commissioners were appointed, with former U.S. senator John H. Reagan as the first chairman. A 1894 constitutional amendment changed the positions to elective offices, further embedding the commission in statewide politics. Over the twentieth century the agency acquired authority over oil and gas and eventually lost its remaining railroad jurisdiction, but the 1891 institution became a model for how Texas balances elected politics, legislative delegation and specialized regulation.",
  reviewed: REVIEWED,
  timeline: [
    { year: "1880s", event: "Railroad regulation becomes a major farm and merchant demand", meaning: "Rate disputes and discriminatory practices make transportation policy a statewide political issue." },
    { year: "1890", event: "James Hogg campaigns on regulation", meaning: "The attorney general wins the governorship with railroad oversight at the center of his program." },
    { year: "1890", event: "Voters approve constitutional authority", meaning: "A constitutional amendment empowers the Legislature to create a regulatory commission." },
    { year: "April 3, 1891", event: "Legislature creates Railroad Commission", meaning: "Texas establishes a permanent three-member regulatory agency." },
    { year: "June 1891", event: "First commissioners begin service", meaning: "John H. Reagan, L. L. Foster and W. P. McLean form the original appointed commission." },
    { year: "1894", event: "Voters make commissioners elective", meaning: "Regulatory authority becomes directly connected to statewide electoral accountability." },
    { year: "1910s–1930s", event: "Oil and gas responsibilities expand", meaning: "The commission evolves beyond its railroad origins as energy becomes central to the Texas economy." },
    { year: "2005", event: "Last railroad jurisdiction transfers away", meaning: "The agency retains its historic name even though it no longer regulates railroads." },
  ],
  sections: [
    { heading: "1. Railroad power turned economic grievances into a constitutional issue", paragraphs: [
      "Railroads transformed Texas by connecting farms, ranches and towns to national markets, but their economic importance also gave rate-setting and route decisions enormous political consequences. Farmers and shippers complained that discriminatory freight charges could favor one town, commodity or customer over another. Agrarian organizations therefore treated transportation regulation as a public-interest question rather than a private contract dispute.",
      "The conflict illustrates how nineteenth-century Texas politics evolved beyond the small-government reaction of the 1870s. A constitution written to restrain centralized authority still had to accommodate demands for effective statewide regulation of corporations operating across county lines. That tension produced a constitutional amendment and then a permanent agency." ] },
    { heading: "2. James Hogg made regulation a winning statewide program", paragraphs: [
      "As attorney general, James Stephen Hogg pursued railroad and corporate cases and became identified with stronger public oversight. He ran for governor in 1890 with railroad regulation as the centerpiece of his campaign. Voters elected Hogg and approved an amendment to Article X that gave the Legislature authority to establish a regulatory commission.",
      "The Legislature acted in 1891, creating a three-member Railroad Commission. Hogg appointed former U.S. senator John H. Reagan as chairman along with L. L. Foster and W. P. McLean. The commission could address rates and discriminatory practices through a specialized institution rather than forcing every controversy through ordinary legislation or litigation." ] },
    { heading: "3. Electing commissioners connected regulation to party politics", paragraphs: [
      "The first commissioners were gubernatorial appointees, but Texans soon changed the structure. A constitutional amendment made the offices elective, creating an unusual hybrid: a technical regulatory agency led by statewide politicians. Commissioners therefore needed both administrative authority and electoral legitimacy, and the office became a potential platform for higher political ambition.",
      "This structure fits the broader Texas preference for a plural executive and separately elected statewide officials. Rather than place major regulatory authority under a cabinet secretary removable by the governor, voters gained a direct role in choosing commissioners. The tradeoff is familiar across Texas government: fragmented authority can limit gubernatorial control while making coordination more complicated." ] },
    { heading: "4. The commission grew as the Texas economy changed", paragraphs: [
      "The agency's jurisdiction expanded beyond the railroad disputes that created it. As oil and gas production transformed Texas, the commission acquired responsibilities involving pipelines, production and energy regulation. By the twentieth century its influence over petroleum made it one of the most consequential state regulatory bodies in the country.",
      "That evolution also shows how administrative institutions can outlive the original policy problem. The Railroad Commission ultimately transferred its remaining rail functions to other agencies, with the last rail responsibilities moving to the Texas Department of Transportation in 2005. The historic name remained even as energy regulation became its defining function." ] },
    { heading: "5. The commission changed the vocabulary of Texas government", paragraphs: [
      "Before 1891, the post-Reconstruction political culture often framed state power principally as something to constrain. Railroad regulation demonstrated another logic: statewide markets could create problems that local government and courts could not address efficiently, requiring specialized public administration. Later commissions and agencies would follow that general model in other policy areas.",
      "The commission therefore belongs in political history as well as economic history. Its creation linked agrarian protest, constitutional amendment, gubernatorial leadership, legislative delegation and statewide elections. Modern debates over the commission's energy role are easier to understand when the institution is seen as the product of an older conflict over how much regulatory authority Texans were willing to give their state government." ] },
  ],
  sources: [
    { href: "https://www.rrc.texas.gov/about-us/", label: "Railroad Commission of Texas: About and agency history" },
    { href: "https://www.rrc.texas.gov/resource-center/research/research-queries/imaged-records/historical-hearing-finding-aid/", label: "Railroad Commission of Texas: historical hearing finding aid and origins" },
    { href: "https://www.rrc.texas.gov/about-us/commissioners/commissioner-list/", label: "Railroad Commission of Texas: commissioners past through present" },
    { href: "https://www.tshaonline.org/handbook/entries/hogg-james-stephen", label: "Handbook of Texas: James Stephen Hogg" },
    { href: "https://www.tshaonline.org/handbook/entries/railroad-commission", label: "Handbook of Texas: Railroad Commission" },
  ],
  relatedLinks: [
    { href: "/texas-politics/texas-farmers-alliance-populism", label: "Farmers' Alliance and Populism", description: "The agrarian pressure behind demands for transportation regulation." },
    { href: "/texas-politics/democratic-restoration-texas-1874-1900", label: "Democratic restoration", description: "The political system in which Hogg's regulatory movement emerged." },
    { href: "/texas-government", label: "Texas government authority hub", description: "Today's statewide institutions and elected officials." },
    { href: CONSTITUTION, label: "Texas constitutional history", description: "How constitutional amendments changed the 1876 framework." },
    { href: "/texas-politics/texas-progressive-era-politics", label: "Progressive Era politics", description: "The later expansion of reform and administrative government." },
  ],
  faqs: [
    { question: "Why was the Railroad Commission of Texas created?", answer: "It was created in 1891 to regulate railroad rates and discriminatory practices after those issues became a major statewide political demand." },
    { question: "Were Railroad Commissioners always elected?", answer: "No. The original commissioners were appointed by Governor James Hogg. Texas later amended the constitution so commissioners would be elected statewide." },
    { question: "Does the Railroad Commission still regulate railroads?", answer: "No. Its remaining railroad jurisdiction was transferred away by 2005. The agency now is chiefly associated with oil, gas, pipelines and related energy regulation." },
  ],
};

export const TEXAS_PROGRESSIVE_ERA_POLITICS: PoliticalHistoryAuthorityPage = {
  slug: "texas-progressive-era-politics",
  title: "Progressive Era Politics in Texas: Reform, Regulation and a Narrower Electorate",
  seoTitle: "Progressive Era Texas Politics: Reform, Regulation, Primaries and State Government | KeepTXRed",
  description: "A source-backed history of Progressive Era politics in Texas, including regulation, direct primaries, labor and social reform, women's suffrage, prohibition and the era's exclusionary voting system.",
  eyebrow: "Progressive Era Texas",
  intro: "Progressivism in Texas was not one unified movement. Reformers supported stronger regulation, public-health measures, labor protections, education, prohibition, women's suffrage and changes to elections, while the same era also saw the electorate narrowed through poll taxes, white-primary rules and other exclusions. The period from the late 1890s through the 1920s therefore expanded state capacity and democratic participation in some directions while restricting it in others.",
  shortAnswer: "Texas progressivism emerged from agrarian reform, urbanization, industrialization and dissatisfaction with machine or corporate influence. Reform politics helped strengthen regulation, direct-primary practices, education and labor protections and contributed to women's suffrage. Yet the era also consolidated a White Democratic primary system and poll-tax regime that sharply reduced participation by Black Texans, Mexican Americans and poor voters. Prohibition and the Ku Klux Klan further divided Democrats in the 1910s and 1920s. Texas progressivism is best understood as a contradictory period of government modernization, moral reform and political exclusion.",
  reviewed: REVIEWED,
  timeline: [
    { year: "1890s", event: "Populism and Hogg-era regulation reshape reform politics", meaning: "Agrarian demands move regulatory and electoral questions into mainstream Democratic politics." },
    { year: "1898–1905", event: "Progressive reform accelerates", meaning: "Urban growth, corporate regulation and election reform become major statewide issues." },
    { year: "1902", event: "Poll tax amendment approved", meaning: "A new voting prerequisite contributes to a sharp decline in turnout and narrows the electorate." },
    { year: "1900s", event: "Direct-primary system expands", meaning: "The Democratic primary increasingly replaces the general election as the decisive statewide contest." },
    { year: "1910s", event: "Prohibition divides state politics", meaning: "Wet and dry factions reorganize alliances inside the dominant Democratic Party." },
    { year: "1917", event: "Ferguson impeachment shocks state government", meaning: "Conflict over universities, finance and executive conduct produces the removal and disqualification of a governor." },
    { year: "1918–1920", event: "Women enter primary and national suffrage expands", meaning: "Texas women gain primary voting rights before ratification of the Nineteenth Amendment." },
    { year: "1924", event: "Ferguson defeats Klan-backed gubernatorial faction", meaning: "Anti-Klan and Ferguson politics mark the closing phase of the classic Progressive Era." },
  ],
  sections: [
    { heading: "1. Texas progressivism grew from agrarian and urban pressures", paragraphs: [
      "The reform impulse that historians call progressivism did not arrive in Texas fully formed. Farmers' Alliance and Populist campaigns had already demanded railroad regulation, tax changes and political reform. Rapid urban growth, industrialization and corporate concentration then added concerns about public health, labor conditions, utilities and municipal government. Reformers differed over solutions, but they shared a belief that nineteenth-century institutions were not automatically equipped for a more complex economy.",
      "Texas Democrats absorbed many reform themes because the party dominated statewide politics. That meant progressivism often operated through Democratic primaries and factional struggles rather than through a separate party. Governors, legislators, women's organizations, prohibitionists, labor advocates, business reformers and agrarian groups could all call themselves reformers while disagreeing sharply on race, economics and the role of government." ] },
    { heading: "2. Regulation and administrative capacity expanded", paragraphs: [
      "The Railroad Commission, created in 1891, was an early example of specialized regulation. The broader Progressive Era continued this trend as state government took larger roles in education, health, labor and economic oversight. Reformers argued that technical or statewide problems required institutions with continuity and expertise rather than relying only on short legislative sessions and county government.",
      "This did not erase Texas's constitutional suspicion of centralized power. Agencies and commissions developed inside a system still dominated by separately elected officials, constitutional limits and biennial legislative sessions. Progressive government in Texas therefore expanded administrative capacity without adopting a unified executive model." ] },
    { heading: "3. Election reform made primaries more orderly while narrowing the electorate", paragraphs: [
      "Progressives often promoted formal election procedures as alternatives to patronage, fraud and informal machine control. Direct-primary laws increasingly structured party nominations. In a state where Democrats already dominated general elections, however, making the primary the decisive contest also magnified the consequences of who was allowed to participate in that primary.",
      "The poll tax and white-primary system sharply restricted access. The 1902 constitutional poll-tax requirement and later statutory restrictions reduced turnout, especially among poor voters and racial minorities. By the early twentieth century many statewide offices were effectively decided inside a White Democratic electorate. For that reason, institutional election reform and voting-rights exclusion have to be studied together rather than treated as separate stories." ] },
    { heading: "4. Prohibition, education and women's suffrage fractured old coalitions", paragraphs: [
      "Prohibition became one of the era's most persistent factional issues. Wet and dry Democrats organized statewide campaigns and competed for legislative and gubernatorial influence. Education also remained central, from rural school aid to fights over university governance. James Ferguson's political career intersected with both themes: he built a rural following while opposing statewide prohibition and then triggered an institutional crisis through his conflict with the University of Texas.",
      "Women's suffrage transformed the electorate in a different direction. Texas women gained the right to vote in primary elections in 1918, and the Nineteenth Amendment expanded voting rights nationally in 1920. The change altered campaign organization and party strategy even as other legal barriers continued to exclude many Texans." ] },
    { heading: "5. The 1920s exposed the limits and contradictions of reform politics", paragraphs: [
      "The revived Ku Klux Klan became a major political force in Texas during the early 1920s, electing local and state officials and supporting Earle Mayfield for the U.S. Senate. The Klan presented itself as a moral and political reform organization while promoting Protestant nativism, racial hierarchy and secret political organization. Its influence revealed how progressive-era language about purification and reform could be directed toward exclusionary ends.",
      "The 1924 governor's race became a major anti-Klan contest. Miriam Ferguson defeated Klan-backed Felix Robertson in the Democratic primary and then Republican George Butte in the general election, becoming Texas's first woman governor. The result weakened the Klan's political standing but did not end the one-party system or erase the era's voting restrictions. By the mid-1920s Texas had a more capable state government and a larger female electorate, but political participation remained sharply unequal." ] },
  ],
  sources: [
    { href: "https://www.tshaonline.org/handbook/entries/progressive-era", label: "Handbook of Texas: Progressive Era" },
    { href: "https://www.tshaonline.org/handbook/entries/texas-in-the-1920s", label: "Handbook of Texas: Texas in the 1920s" },
    { href: "https://www.tsl.texas.gov/lobbyexhibits/governorsexhibit/thepoliticsofpersonality", label: "Texas State Library and Archives: Politics of Personality" },
    { href: "https://www.tshaonline.org/handbook/entries/woman-suffrage", label: "Handbook of Texas: Woman Suffrage" },
    { href: "https://www.tshaonline.org/handbook/entries/prohibition", label: "Handbook of Texas: Prohibition" },
  ],
  relatedLinks: [
    { href: "/texas-politics/texas-farmers-alliance-populism", label: "Farmers' Alliance and Populism", description: "The agrarian reform traditions that preceded progressivism." },
    { href: "/texas-politics/texas-railroad-commission-regulatory-politics", label: "Railroad Commission history", description: "An early institutional model for specialized state regulation." },
    { href: "/texas-politics/james-ferguson-impeachment-1917", label: "James Ferguson impeachment", description: "The era's most dramatic executive-legislative constitutional crisis." },
    { href: VOTING, label: "Texas voting rights history", description: "Poll taxes, white primaries and later federal voting-rights changes." },
    { href: ELECTIONS, label: "Texas election history", description: "How primaries, turnout and party competition changed." },
  ],
  faqs: [
    { question: "When was the Progressive Era in Texas?", answer: "Its roots appeared in the late nineteenth century, with the strongest reform period generally running from the late 1890s into the 1920s." },
    { question: "Did Progressive Era reforms make Texas elections more democratic?", answer: "Some reforms formalized primaries and expanded participation, including women's suffrage, but the same era also entrenched poll taxes and white-primary restrictions that excluded many voters." },
    { question: "Why is the Progressive Era important to Texas government?", answer: "It expanded regulation, education and administrative capacity while reshaping elections and party factions. Many modern state institutions developed from reforms of this period." },
  ],
};

export const JAMES_FERGUSON_IMPEACHMENT_1917: PoliticalHistoryAuthorityPage = {
  slug: "james-ferguson-impeachment-1917",
  title: "James Ferguson's 1917 Impeachment: Texas's Landmark Governor Removal",
  seoTitle: "James Ferguson Impeachment 1917: Charges, Senate Trial and Texas Political Legacy | KeepTXRed",
  description: "A source-backed explanation of Governor James E. Ferguson's 1917 impeachment, his conflict with the University of Texas, financial charges, Senate conviction and lasting disqualification.",
  eyebrow: "Texas impeachment history",
  intro: "James E. Ferguson remains the central case study in Texas gubernatorial impeachment. Elected in 1914 and reelected in 1916, Ferguson built a strong rural political following and backed school funding while clashing with prohibitionists, university leaders and political opponents. In 1917 his confrontation with the University of Texas and questions about public and private finances escalated into a House impeachment and Senate trial. He resigned before judgment, but the Senate convicted him and disqualified him from future state office.",
  shortAnswer: "The Texas House impeached Governor James E. Ferguson in 1917 after investigations involving his attempt to influence University of Texas personnel, his veto of the university appropriation and multiple financial allegations. The Senate, sitting as a court of impeachment, convicted him on ten charges. Ferguson resigned before the final judgment, but the Senate still entered judgment removing and disqualifying him from future Texas office, and courts later upheld the effect of that disqualification. Lieutenant Governor William P. Hobby succeeded him. Ferguson remained a major political figure afterward and helped elect his wife Miriam governor in 1924 and 1932.",
  reviewed: REVIEWED,
  timeline: [
    { year: "1914", event: "Ferguson elected governor", meaning: "A Bell County banker and lawyer builds a strong rural coalition and defeats prohibition-aligned opponents." },
    { year: "1915", event: "First term begins", meaning: "School aid and education spending become prominent parts of the administration's record." },
    { year: "1916", event: "Ferguson wins reelection", meaning: "His rural political organization secures a second term despite growing opposition." },
    { year: "1917", event: "University conflict escalates", meaning: "Ferguson pressures the University of Texas over faculty and governance disputes." },
    { year: "June 1917", event: "Governor vetoes university appropriation", meaning: "The action intensifies legislative and public scrutiny." },
    { year: "July 1917", event: "Grand jury indictments and legislative investigation", meaning: "Financial allegations broaden the controversy beyond university governance." },
    { year: "August–September 1917", event: "House impeachment and Senate trial", meaning: "The Legislature invokes its constitutional removal power against a sitting governor." },
    { year: "September 1917", event: "Senate convicts and disqualifies Ferguson", meaning: "William P. Hobby succeeds to the governorship while Ferguson remains barred from state office." },
  ],
  sections: [
    { heading: "1. Ferguson entered office as a rural populist-style Democrat", paragraphs: [
      "James Edward Ferguson was a lawyer, banker and businessman from Bell County who entered statewide politics with a strong appeal to tenant farmers and rural voters. He opposed statewide prohibition and attacked political elites while supporting measures such as rural school aid. His style created a loyal personal following that survived long after his removal from office.",
      "That personal political organization is essential to understanding the impeachment's aftermath. Ferguson was not simply an officeholder whose career ended in 1917. His supporters came to identify with 'Fergusonism,' a durable faction that would later return through the gubernatorial campaigns of his wife, Miriam." ] },
    { heading: "2. The University of Texas conflict became a constitutional showdown", paragraphs: [
      "Ferguson sought the removal of University of Texas faculty members he opposed and clashed with regents and administrators over control of the institution. When university officials resisted, he vetoed the university's legislative appropriation in June 1917. Critics viewed the veto as an abuse of executive leverage against an institution whose governance was not meant to function as a governor's personal patronage system.",
      "The university dispute transformed a political feud into a broader institutional question about executive power, appropriations and public education. It also encouraged legislators and investigators to examine other allegations involving Ferguson's financial conduct." ] },
    { heading: "3. Financial allegations broadened the impeachment case", paragraphs: [
      "A Travis County grand jury indicted Ferguson in July 1917 on charges involving public funds and financial transactions. Legislative investigators also examined an unexplained large currency loan and the handling of state banking matters. The House ultimately developed numerous articles of impeachment rather than relying on a single university-related accusation.",
      "This breadth matters because the final Senate judgment cannot accurately be reduced to 'Ferguson was impeached for fighting the university.' The university confrontation triggered and symbolized the crisis, but the Senate convictions included financial and legal-governance charges as well." ] },
    { heading: "4. The Senate trial established that resignation would not erase the impeachment judgment", paragraphs: [
      "The House adopted articles of impeachment and the Senate convened as a court of impeachment. Ferguson resigned before the Senate announced its final judgment, apparently hoping resignation would end the proceeding or avoid the constitutional consequences of conviction. The Senate nevertheless sustained ten charges and entered a judgment that removed and disqualified him from future state office.",
      "The episode became a lasting precedent in Texas political culture because it demonstrated that impeachment is not merely a mechanism for changing the occupant of an office. Disqualification can have consequences beyond the current term. Ferguson repeatedly challenged or worked around that barrier politically, but he did not return to the governorship in his own name." ] },
    { heading: "5. Fergusonism survived impeachment through party organization and Miriam Ferguson", paragraphs: [
      "William P. Hobby succeeded Ferguson and won election in his own right. Ferguson, however, remained active in Democratic politics, running unsuccessfully for several offices and maintaining a substantial rural following. In 1924, when he could not legally return to the governorship, his wife Miriam entered the race with his organization and explicit political partnership.",
      "Miriam Ferguson's victory showed that constitutional disqualification of an individual did not automatically dissolve a political faction. The Fergusons became a recurring force in Texas politics through the 1920s and 1930s. For modern readers, the 1917 impeachment is therefore both a constitutional case about removal and a political case about how personal organizations can survive formal sanctions against their leaders." ] },
  ],
  sources: [
    { href: "https://www.tsl.texas.gov/governors/personality/index.html", label: "Texas State Library and Archives: James E. Ferguson and the Politics of Personality" },
    { href: "https://www.tsl.texas.gov/governors/personality/pferguson-anti-1.html", label: "Texas State Library and Archives: Ferguson impeachment campaign material" },
    { href: "https://www.lrl.texas.gov/legeleaders/governors/govBrowse.cfm", label: "Legislative Reference Library: Governors of Texas" },
    { href: "https://www.tshaonline.org/handbook/entries/ferguson-james-edward", label: "Handbook of Texas: James Edward Ferguson" },
    { href: "https://www.tshaonline.org/handbook/entries/impeachment", label: "Handbook of Texas: Impeachment" },
  ],
  relatedLinks: [
    { href: "/texas-politics/texas-progressive-era-politics", label: "Progressive Era Texas politics", description: "The reform and factional context surrounding Ferguson's governorship." },
    { href: "/texas-government/governor-history", label: "History of the Texas governor", description: "The institutional powers and succession rules of the office." },
    { href: "/texas-politics/miriam-ferguson-ku-klux-klan-1920s", label: "Miriam Ferguson and the Klan", description: "How Fergusonism returned to the governor's race through his wife." },
    { href: CONSTITUTION, label: "Texas constitutional history", description: "The charter governing impeachment and executive power." },
    { href: POLITICS, label: "Texas Politics hub", description: "Current and historical Texas political authority." },
  ],
  faqs: [
    { question: "Why was Governor James Ferguson impeached?", answer: "The case involved both his conflict with the University of Texas and multiple financial and governance allegations. The Senate convicted him on ten charges." },
    { question: "Did Ferguson avoid impeachment by resigning?", answer: "No. He resigned before final judgment, but the Senate still entered its judgment and disqualified him from future Texas office." },
    { question: "Who became governor after Ferguson?", answer: "Lieutenant Governor William P. Hobby succeeded him and later won election as governor." },
  ],
};

export const MIRIAM_FERGUSON_KLAN_1920S: PoliticalHistoryAuthorityPage = {
  slug: "miriam-ferguson-ku-klux-klan-1920s",
  title: "Miriam Ferguson, the Ku Klux Klan and Texas Politics in the 1920s",
  seoTitle: "Miriam Ferguson and the Texas Ku Klux Klan: 1924 Governor's Race and Political Realignment | KeepTXRed",
  description: "A source-backed history of the 1920s Texas Klan, Earle Mayfield, Felix Robertson, Miriam Ferguson's anti-Klan campaign and the political significance of the 1924 governor's race.",
  eyebrow: "Texas politics in the 1920s",
  intro: "The second Ku Klux Klan became a major Texas political organization in the early 1920s, influencing local offices, the Legislature and the 1922 U.S. Senate race. Its high-water mark collided with another powerful political machine: Fergusonism. Because impeached former governor James Ferguson was barred from state office, his wife Miriam ran for governor in 1924. Her campaign against Klan-backed Felix Robertson turned the Democratic primary into a referendum on secret political organization and made Miriam Ferguson the first woman elected governor of Texas.",
  shortAnswer: "The revived Klan grew rapidly in Texas after World War I and by the early 1920s could influence local and statewide Democratic primaries. Klan-backed Earle B. Mayfield won a U.S. Senate seat in 1922, and Klan member Felix Robertson became a leading gubernatorial candidate in 1924. Miriam 'Ma' Ferguson, running with the political organization of her disqualified husband James Ferguson, defeated Robertson and campaigned explicitly against the Klan. She then defeated Republican George Butte in the general election and became Texas's first woman governor. The defeat of Robertson and subsequent internal decline sharply reduced the Klan's statewide political power.",
  reviewed: REVIEWED,
  timeline: [
    { year: "1915", event: "Second Ku Klux Klan founded nationally", meaning: "The revived organization later expands rapidly in Texas cities and politics." },
    { year: "1921–1922", event: "Texas Klan membership surges", meaning: "The organization develops major blocs in local Democratic politics and some legislative districts." },
    { year: "1922", event: "Earle Mayfield wins U.S. Senate race", meaning: "A Klan-backed candidate demonstrates the organization's statewide electoral reach." },
    { year: "1923", event: "Klan influence reaches high-water mark", meaning: "The organization holds substantial local and legislative influence." },
    { year: "1924", event: "Felix Robertson runs for governor with Klan backing", meaning: "The gubernatorial primary becomes a direct test of Klan political strength." },
    { year: "1924", event: "Miriam Ferguson defeats Robertson", meaning: "Anti-Klan and Ferguson voters combine to block the Klan-backed candidate." },
    { year: "November 1924", event: "Ferguson defeats Republican George Butte", meaning: "She becomes Texas's first woman governor despite a significant anti-Ferguson crossover vote." },
    { year: "1925 onward", event: "Klan political influence declines", meaning: "Factional conflict, public backlash and defeat weaken the organization's statewide electoral power." },
  ],
  sections: [
    { heading: "1. The revived Klan became a political organization as well as a secret society", paragraphs: [
      "The second Ku Klux Klan expanded in Texas during the early 1920s with a program combining White Protestant supremacy, nativism, anti-Catholicism, anti-Semitism and moral regulation. Its secret membership and bloc voting allowed local chapters to influence Democratic nominations in a political system where the primary often determined who would hold office.",
      "The Klan won influence in municipal governments and elected legislators, sheriffs, judges and other officials. That power made its role more than a social-history subject. It became a question about whether a private secret organization could function as an informal political party inside the dominant Democratic Party." ] },
    { heading: "2. Earle Mayfield's Senate victory demonstrated statewide reach", paragraphs: [
      "In 1922 the Klan supported Railroad Commissioner Earle B. Mayfield for the United States Senate. He advanced through a crowded Democratic primary and defeated former governor James Ferguson in the runoff. Anti-Klan Democrats and Republicans then supported George Peddy as a fusion alternative, but Mayfield won the general election decisively.",
      "The contest showed both the strength and the limits of anti-Klan coalition politics. In a heavily Democratic state, a candidate who secured the Democratic nomination still possessed a major structural advantage. The controversy nevertheless exposed the Klan's role to broader scrutiny and set the stage for the 1924 fight." ] },
    { heading: "3. The 1924 governor's race paired Klan power against Fergusonism", paragraphs: [
      "James Ferguson remained disqualified from Texas office after his 1917 impeachment, but his personal organization and rural following survived. Miriam Ferguson entered the 1924 gubernatorial contest as the vehicle for that organization. She openly presented her candidacy as a partnership with her husband while also making opposition to the Ku Klux Klan a central issue.",
      "Felix Robertson, a Dallas judge and Klan member, represented the strongest Klan-aligned gubernatorial faction. The runoff therefore became more than a normal Democratic contest. Voters were deciding between two intensely personal political movements, each with strong organizations and deep enemies." ] },
    { heading: "4. Ferguson's victory fractured old Democratic loyalties", paragraphs: [
      "Miriam Ferguson defeated Robertson in the Democratic runoff, a major setback for the Klan. The general election then created another unusual coalition. Some anti-Ferguson Democrats supported Republican nominee George Butte, while some Klan members who opposed Ferguson also crossed party lines. Ferguson still won by a substantial margin and became the first woman governor of Texas.",
      "The election demonstrated how one-party dominance could coexist with intense factional competition. The Democratic label remained powerful, but voters and elites could split over Klan membership, Fergusonism, prohibition, religion and government reform. Those conflicts mattered long before Texas became a genuinely competitive two-party state." ] },
    { heading: "5. The Klan's defeat changed the balance of 1920s politics", paragraphs: [
      "The defeat of Robertson, internal dissension and growing public opposition weakened the Klan's standing. Texas ceased to be one of the organization's strongest political bases. Ferguson later supported legislation restricting masked public activity by secret societies, symbolically reversing the period when Klan endorsements had dominated candidate calculations.",
      "The longer-term lesson is not that the 1924 election permanently solved exclusionary politics. Poll taxes, the White Democratic primary and segregation remained. Rather, it showed that secret Klan control had become a liability large enough to reorganize statewide coalitions. The Ferguson victory is therefore best understood as an anti-Klan political turning point inside an otherwise still-restrictive one-party system." ] },
  ],
  sources: [
    { href: "https://www.tshaonline.org/handbook/entries/texas-in-the-1920s", label: "Handbook of Texas: Texas in the 1920s" },
    { href: "https://www.tshaonline.org/handbook/entries/ku-klux-klan", label: "Handbook of Texas: Ku Klux Klan" },
    { href: "https://www.tsl.texas.gov/governors/personality/index.html", label: "Texas State Library and Archives: Ferguson era governors" },
    { href: "https://www.tshaonline.org/handbook/entries/ferguson-miriam-amanda-wallace", label: "Handbook of Texas: Miriam Amanda Wallace Ferguson" },
    { href: "https://www.lrl.texas.gov/legeleaders/governors/govBrowse.cfm", label: "Legislative Reference Library: Governors of Texas" },
  ],
  relatedLinks: [
    { href: "/texas-politics/james-ferguson-impeachment-1917", label: "James Ferguson impeachment", description: "Why James Ferguson could not return to the governorship himself." },
    { href: "/texas-politics/texas-progressive-era-politics", label: "Progressive Era politics", description: "The broader reform, prohibition and election context." },
    { href: ELECTIONS, label: "Texas election history", description: "The primary-dominant system in which the 1924 contest occurred." },
    { href: VOTING, label: "Texas voting rights history", description: "The participation restrictions that defined the era's electorate." },
    { href: RECONSTRUCTION_GOP, label: "Reconstruction Republicans", description: "Earlier Republican and Black political organization before the one-party Democratic era." },
  ],
  faqs: [
    { question: "Was Miriam Ferguson elected because she opposed the Ku Klux Klan?", answer: "Anti-Klan politics was a major part of her 1924 coalition, but Fergusonism, rural support and opposition to Klan-backed Felix Robertson also shaped the result." },
    { question: "How powerful was the Klan in Texas politics?", answer: "At its early-1920s peak it influenced local governments, legislators and statewide races and helped elect Earle Mayfield to the U.S. Senate." },
    { question: "Did the 1924 election end the Klan in Texas?", answer: "It sharply weakened the Klan's statewide political standing, but the organization did not disappear immediately and the broader discriminatory political system remained." },
  ],
};

export const TEXAS_POST_RECONSTRUCTION_PROGRESSIVE_AUTHORITY_PAGES = [
  DEMOCRATIC_RESTORATION_TEXAS,
  TEXAS_FARMERS_ALLIANCE_POPULISM,
  TEXAS_RAILROAD_COMMISSION_REGULATORY_POLITICS,
  TEXAS_PROGRESSIVE_ERA_POLITICS,
  JAMES_FERGUSON_IMPEACHMENT_1917,
  MIRIAM_FERGUSON_KLAN_1920S,
] as const;
