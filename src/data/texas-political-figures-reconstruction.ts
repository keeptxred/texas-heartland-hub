import type { TexasPoliticalFigure } from "@/data/texas-political-figures";

type SourcedTexasPoliticalFigure = TexasPoliticalFigure & {
  sources: Array<{ href: string; label: string }>;
};

export const RECONSTRUCTION_TEXAS_POLITICAL_FIGURES: SourcedTexasPoliticalFigure[] = [
  {
    slug: "edmund-j-davis-texas-reconstruction-governor",
    name: "Edmund J. Davis",
    kicker: "Union officer, Reconstruction governor and early Texas Republican leader",
    description: "Edmund J. Davis led Texas's Radical Republican faction, won the disputed 1869 governor's race and governed from 1870 through 1874 during the most consequential phase of Reconstruction in the state.",
    years: "1827–1883",
    texasRole: "Governor of Texas, 1870–1874; early Republican Party leader",
    sections: [
      {
        heading: "A Texas Unionist who joined the Union Army",
        body: "Edmund Jackson Davis was a Texas lawyer and state judge before the Civil War. He opposed secession and, after leaving Texas, served as an officer in the Union Army. That wartime record placed him among the Unionists who became central to postwar Republican politics in Texas. The early state Republican coalition was not simply an imported organization: it included White Texas Unionists, newly enfranchised Black Texans, Northern migrants and federal officials whose political goals overlapped on restoring the Union and redefining citizenship after slavery. Davis emerged as the leader of the party's more radical faction, which favored a stronger Reconstruction program than moderate Republicans led by Andrew Jackson Hamilton and Elisha Pease were willing to support."
      },
      {
        heading: "The 1869 governor's race split Texas Republicans",
        body: "The Republican Party entered the 1869 election divided. Davis led the Radical ticket while former provisional governor Andrew Jackson Hamilton led the moderate or Conservative Republican faction. Their disagreement included the pace of Reconstruction, the treatment of former Confederates and the role of federal authority. President Ulysses S. Grant's administration ultimately supported the Davis faction. After a closely disputed election, military authorities declared Davis the winner by a narrow margin. He took office in 1870 as Texas completed the congressional requirements for readmission to the Union. The episode is important because Republican control did not mean Republican unity: factional conflict was present from the party's first years in Texas."
      },
      {
        heading: "Public schools, state power and the Texas State Police",
        body: "Davis's administration pursued a broad Reconstruction program that expanded the role of state government. It supported a statewide public-school system, internal improvements, immigration and geological bureaus, frontier protection and stronger law enforcement. The most controversial instrument was the Texas State Police, created amid widespread postwar violence and resistance to Reconstruction. Supporters argued that state authority was necessary because local institutions often failed to protect Unionists and Black citizens. Opponents attacked the police, militia and taxation required to fund the new government as centralized and abusive. Those competing claims became central to the political memory of Reconstruction and helped Democrats mobilize against the Davis administration."
      },
      {
        heading: "Defeat, the Coke-Davis controversy and Democratic restoration",
        body: "Davis sought reelection in 1873 but lost decisively to Democrat Richard Coke. A legal dispute over the election culminated in the Coke-Davis controversy, with Democrats taking control of the Capitol in January 1874 as federal officials declined to intervene on Davis's behalf. The transition ended Republican control of state government for roughly a century. Democrats subsequently wrote the 1876 Texas Constitution in a political climate strongly shaped by reaction against the centralized powers associated with the Davis era. That history helps explain why arguments over Reconstruction in Texas are inseparable from later debates about limited state government, local control and the structure of the Texas Constitution."
      },
      {
        heading: "Why Davis cannot be treated as a modern Republican",
        body: "Davis remained a major Texas Republican leader after leaving the governorship, but the party he led operated in a political world very different from the modern GOP. Reconstruction Republicans emphasized Union loyalty, Black citizenship and voting rights, public education and federal enforcement of the postwar constitutional settlement. The party's later pro-business and conservative identity developed through different coalitions over many decades. Davis belongs in KTR's Republican history because he led the first period of statewide Republican government, not because nineteenth-century Republicanism can be mapped neatly onto twenty-first-century ideological labels."
      }
    ],
    relatedLinks: [
      { href: "/texas-politics/reconstruction-republicans", label: "Texas Republicans during Reconstruction" },
      { href: "/texas-politics/figures/norris-wright-cuney-texas-republican-leader", label: "Norris Wright Cuney profile" },
      { href: "/texas-politics/how-texas-became-republican", label: "How Texas became Republican" }
    ],
    sources: [
      { href: "https://www.tshaonline.org/handbook/entries/davis-edmund-jackson", label: "Handbook of Texas: Edmund J. Davis" },
      { href: "https://www.tshaonline.org/handbook/entries/reconstruction", label: "Handbook of Texas: Reconstruction" },
      { href: "https://www.tshaonline.org/handbook/entries/republican-party", label: "Handbook of Texas: Republican Party" }
    ]
  },
  {
    slug: "norris-wright-cuney-texas-republican-leader",
    name: "Norris Wright Cuney",
    kicker: "Black Republican leader of the post-Reconstruction 'Cuney Era'",
    description: "Norris Wright Cuney became Texas's Republican national committeeman, Galveston's customs collector, a labor organizer and the most powerful Black Republican leader in late nineteenth-century Texas.",
    years: "1846–1898",
    texasRole: "Republican National Committeeman for Texas, 1886–1896; Galveston civic and labor leader",
    sections: [
      {
        heading: "From slavery-era Texas to Republican politics",
        body: "Norris Wright Cuney was born near Hempstead in 1846 to a White planter father and an enslaved mother. After education in Pennsylvania and work on riverboats, he returned to Texas and settled in Galveston. There he entered the political network built around the Union League and Republican Party. Cuney's rise reflects one of the defining facts of early Texas Republican history: Black voters and organizers were not peripheral to the party. They were among its largest and most active constituencies after congressional Reconstruction established Black male suffrage. Cuney worked with figures including George T. Ruby and became a delegate to every Republican national convention from 1872 through 1892."
      },
      {
        heading: "Party organization and the 'Cuney Era'",
        body: "Cuney held several party and federal patronage positions before becoming Texas's Republican national committeeman in 1886. The Handbook of Texas describes the period from roughly 1884 through 1896 as the 'Cuney Era' because of his influence over the state organization. He also served as collector of customs at the Port of Galveston beginning in 1889, one of the most important federal appointments available in Texas. His power came from national Republican connections, control of patronage, convention organization and a large Black Republican base at a time when Democrats dominated state elections."
      },
      {
        heading: "Labor organization and education in Galveston",
        body: "Cuney's public career extended beyond party conventions. He organized Black dockworkers into the Screwmen's Benevolent Association and competed for work on Galveston's waterfront. He served as a school director and supported educational opportunities for Black Texans, including the institution that became Prairie View A&M University. He also served on the Galveston City Council. Those roles show why reducing Cuney to a patronage politician misses much of his significance: he tried to translate political participation into economic organization, local officeholding and institutional development for Black Texans."
      },
      {
        heading: "Black-and-Tan Republicans versus the Lily-White movement",
        body: "Cuney's leadership was increasingly challenged by White Republicans who sought to reduce Black influence in the state party. The conflict developed into the Black-and-Tan versus Lily-White struggle that shaped Texas Republican politics for decades. Cuney defended a biracial party in which Black members retained convention power and federal appointments. His opponents argued that a Whiter party organization would be more competitive with Democrats. The struggle was not a minor internal dispute; it concerned who could exercise political power in an era when Jim Crow laws and disfranchisement were narrowing Black citizenship across the South."
      },
      {
        heading: "The bridge from Reconstruction to the twentieth-century GOP",
        body: "Cuney died in 1898, but the factional and organizational battles of his era continued through leaders such as William Madison McDonald and R.B. Creager. That makes Cuney an essential bridge between the Reconstruction government of Edmund J. Davis and the Republican organization that survived into the twentieth century. Modern Texas Republican history is often started with Eisenhower, John Tower or Bill Clements because those figures mark electoral breakthroughs. Cuney shows the deeper institutional history: a Republican Party existed, organized and contested internal power for generations before conservative Democratic realignment made statewide Republican victories common."
      }
    ],
    relatedLinks: [
      { href: "/texas-politics/reconstruction-republicans", label: "Texas Republicans during Reconstruction" },
      { href: "/texas-politics/figures/edmund-j-davis-texas-reconstruction-governor", label: "Edmund J. Davis profile" },
      { href: "/texas-politics/figures/rb-creager-early-texas-republican-leader", label: "R.B. Creager profile" }
    ],
    sources: [
      { href: "https://www.tshaonline.org/handbook/entries/cuney-norris-wright", label: "Handbook of Texas: Norris Wright Cuney" },
      { href: "https://www.tshaonline.org/handbook/entries/republican-party", label: "Handbook of Texas: Republican Party" },
      { href: "https://www.tshaonline.org/handbook/entries/late-nineteenth-century-texas", label: "Handbook of Texas: Late Nineteenth-Century Texas" }
    ]
  },
  {
    slug: "richard-allen-texas-reconstruction-legislator",
    name: "Richard Allen",
    kicker: "Formerly enslaved Houston leader and one of Texas's first Black legislators",
    description: "Richard Allen helped organize Republicans in Harris County, served in the Reconstruction legislature and became the first Black candidate for statewide office in Texas when he ran for lieutenant governor in 1878.",
    years: "1830–1909",
    texasRole: "Texas state representative during Reconstruction; Houston Republican and civic leader",
    sections: [
      {
        heading: "From slavery to voter registration and the Freedmen's Bureau",
        body: "Richard Allen was born enslaved in Virginia and brought to Texas as a child. After emancipation in 1865, he built a business career as a contractor and entered public life during Reconstruction. Federal authorities appointed him a voter registrar in 1867 and he worked with the Freedmen's Bureau in the Houston area. These roles placed Allen directly inside the process by which formerly enslaved Texans became voters and political organizers. He also helped organize the Republican Party in Harris County, making his career part of the party's local foundation rather than simply a later appointment from state leaders."
      },
      {
        heading: "One of the first Black members of the Texas Legislature",
        body: "Allen participated in the Radical Republican meeting that nominated Edmund J. Davis for governor and won election to the Texas House in 1869. Representing a district that included Harris and Montgomery counties, he became one of the first Black legislators in Texas history. His legislative interests included public education, law enforcement and civil rights. Reconstruction opened offices that had previously been legally unavailable to Black Texans, but the period also exposed officeholders to organized political and racial resistance. Allen's legislative service therefore belongs both to the history of the Republican Party and to the history of Black citizenship in Texas."
      },
      {
        heading: "Houston politics, conventions and statewide candidacy",
        body: "Allen remained active in Houston and state Republican politics after his legislative service. He served as a Union League vice president, attended Republican conventions and held local office as Houston street commissioner. In 1878 the conservative Republican faction nominated him for lieutenant governor, making him the first Black candidate for statewide office in Texas. The candidacy did not come close to overcoming Democratic dominance, but it demonstrated that Black Republican political participation continued after the end of formal Reconstruction even as the environment for Black voting and officeholding grew more hostile."
      },
      {
        heading: "Civil-rights conventions and a debate over leaving Texas",
        body: "Allen participated in state and national Black conventions that addressed civil rights, education and economic opportunity. In 1879 he also supported the Exoduster movement, which encouraged Black Southerners to move to Kansas in response to racial violence and limited prospects. That position divided Black leaders and illustrates the difficult choices facing Texans who had gained formal citizenship but encountered shrinking political protection. Allen's politics therefore cannot be understood only through elections; they included arguments over whether meaningful freedom could be secured within Texas at all."
      },
      {
        heading: "Why Allen expands the story of Texas Republicanism",
        body: "A history that jumps directly from Edmund J. Davis to twentieth-century White Republican leaders leaves out the voters and officeholders who made the early party a biracial institution. Allen's career shows how Reconstruction Republicanism operated at the county, legislative, fraternal and civic levels. He was a formerly enslaved businessman, organizer, legislator and statewide candidate whose political activity continued for decades. Including him in KTR's authority layer makes the party's nineteenth-century history more accurate and explains why later Lily-White efforts to remove Black influence represented a fundamental change in the organization, not a minor factional adjustment."
      }
    ],
    relatedLinks: [
      { href: "/texas-politics/reconstruction-republicans", label: "Texas Republicans during Reconstruction" },
      { href: "/texas-politics/figures/george-t-ruby-texas-reconstruction-senator", label: "George T. Ruby profile" },
      { href: "/texas-politics/figures/norris-wright-cuney-texas-republican-leader", label: "Norris Wright Cuney profile" }
    ],
    sources: [
      { href: "https://www.tshaonline.org/handbook/entries/allen-richard", label: "Handbook of Texas: Richard Allen" },
      { href: "https://www.tshaonline.org/handbook/entries/reconstruction", label: "Handbook of Texas: Reconstruction" }
    ]
  },
  {
    slug: "george-t-ruby-texas-reconstruction-senator",
    name: "George T. Ruby",
    kicker: "Union League organizer and influential Black Texas senator during Reconstruction",
    description: "George T. Ruby organized Union League chapters, served in the 1868–69 constitutional convention and became one of the most influential members of the Texas Senate during Reconstruction.",
    years: "1841–1882",
    texasRole: "Texas state senator, Reconstruction era; Union League and Republican organizer",
    sections: [
      {
        heading: "A free-born Black educator arrives in postwar Texas",
        body: "George Thompson Ruby was born free in New York in 1841 and educated in the North. After work as a teacher in Louisiana, he joined the Freedmen's Bureau and came to Galveston, where he administered schools, taught and wrote for newspapers. As a traveling bureau agent he moved through Texas establishing Union League chapters and temperance organizations. The Union League helped newly enfranchised Black men learn political procedures, register, organize and participate in Republican conventions. Ruby's work therefore helped create the grassroots structure beneath Reconstruction-era Republican electoral power."
      },
      {
        heading: "Union League power and the 1868 constitutional convention",
        body: "Ruby became president of the Texas Union League in 1868 and used that organization to influence the Republican Party's large Black constituency. He was the only Black member of the Texas delegation to the Republican National Convention that year and also won election to the state Constitutional Convention of 1868–69. During the bitter split between moderate and Radical Republicans, Ruby helped move Union League support toward the Radical faction led by Edmund J. Davis. That organizational decision mattered because Black voters formed a decisive part of the coalition that ultimately brought Davis and Radical legislative majorities to power."
      },
      {
        heading: "An unusually influential Texas state senator",
        body: "Ruby won election to the Texas Senate in 1869 from a predominantly White district. He served on major committees including judiciary, militia, education and state affairs and became one of the chamber's most consequential members. His legislative work included railroad and corporate charters, a geological and agricultural survey and other economic-development measures. This record complicates stereotypes of Reconstruction politics as concerned only with race or federal occupation. Black Republican legislators also participated in the ordinary but important work of building transportation, institutions and a postwar economy."
      },
      {
        heading: "Labor organizing on the Galveston waterfront",
        body: "Ruby also organized Black workers on Galveston's docks, helping establish the Labor Union of Colored Men. His political influence, federal customs role and relationships with business figures made him an unusual bridge among Republican organization, labor and commerce. Those connections could create tensions: Black workers sought economic opportunity in a port economy where race and labor competition were deeply intertwined. Ruby's career demonstrates that Reconstruction leadership involved material questions of jobs, contracts and local economic power as well as constitutional rights."
      },
      {
        heading: "Leaving Texas as Republican power collapsed",
        body: "Ruby chose not to seek another Texas Senate term in 1873 as Democrats regained legislative strength and the Radical Republican coalition weakened. He returned to Louisiana, where he continued working in government, journalism and Black political causes. His departure mirrors the collapse of Republican state power after the 1873 election, but the organizations he helped build continued under leaders including Norris Wright Cuney. Ruby's place in Texas history is therefore larger than a short Senate tenure: he helped mobilize the voters who created the first biracial mass political party in the state and became one of Reconstruction Texas's most powerful Black officeholders."
      }
    ],
    relatedLinks: [
      { href: "/texas-politics/reconstruction-republicans", label: "Texas Republicans during Reconstruction" },
      { href: "/texas-politics/figures/richard-allen-texas-reconstruction-legislator", label: "Richard Allen profile" },
      { href: "/texas-politics/figures/edmund-j-davis-texas-reconstruction-governor", label: "Edmund J. Davis profile" }
    ],
    sources: [
      { href: "https://www.tshaonline.org/handbook/entries/ruby-george-thompson", label: "Handbook of Texas: George T. Ruby" },
      { href: "https://www.tshaonline.org/handbook/entries/republican-party", label: "Handbook of Texas: Republican Party" },
      { href: "https://www.tshaonline.org/handbook/entries/reconstruction", label: "Handbook of Texas: Reconstruction" }
    ]
  }
];
