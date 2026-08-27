import type { TexasPoliticalFigure } from "@/data/texas-political-figures";

const SECTION_EXPANSIONS: Record<string, Record<string, string>> = {
  "john-cornyn-texas-senator-profile": {
    "Why the profile belongs on KeepTXRed": " That structure also gives readers a stable place to understand the offices and institutional roles behind future headlines instead of repeatedly reconstructing his biography from breaking-news coverage."
  },
  "greg-abbott-texas-governor-profile": {
    "Election as the 48th governor": " His victory also extended the Republican hold on an office the party had controlled continuously since George W. Bush defeated Ann Richards in 1994, placing Abbott inside a longer era of statewide GOP dominance."
  },
  "ken-paxton-texas-attorney-general-profile": {
    "Power inside Republican politics": " Because the attorney general is elected independently of the governor, that political base can also give the officeholder room to pursue priorities, alliances and intraparty conflicts that do not always mirror the governor's agenda."
  },
  "phil-gramm-texas-senator-fiscal-conservative": {
    "U.S. senator from Texas": " His Senate tenure therefore linked Texas's changing partisan identity to national fights over taxation, spending, financial regulation and the size of the federal government."
  }
};

const SUPPLEMENTAL_SECTIONS: Record<string, TexasPoliticalFigure["sections"]> = {
  "ronald-reagan-texas-conservative-legacy": [
    {
      heading: "Where Reagan and today's Texas Republican coalition differ",
      body: "Invoking Reagan can hide as much history as it reveals. His administration signed the bipartisan Immigration Reform and Control Act of 1986, which combined employer sanctions and enforcement measures with legalization for many people already living in the United States without legal status. The Reagan Library's own archival materials describe those three components together. That record does not map neatly onto today's Texas Republican debates over border enforcement and immigration. The same caution applies more broadly: the Cold War, the tax system, the structure of the electorate and the national party coalitions of the 1980s were different from those of the 2020s. Reagan is therefore most useful as a historical reference point, not as a shortcut that makes every modern policy position automatically Reaganite. Comparing the actual record with present-day positions gives readers a more accurate picture of both eras."
    }
  ],
  "george-hw-bush-texas-political-life": [
    {
      heading: "Why Bush's Houston years matter to Texas Republican history",
      body: "Bush's Texas importance predates the White House by decades. After moving to Texas and building a career in the oil business, he entered politics through the Harris County Republican Party and then won a Houston-area seat in Congress. The Bush Presidential Library records that sequence before his later service at the United Nations, the Republican National Committee, the U.S. liaison office in China, the CIA and the vice presidency. That progression helps explain why his legacy in Texas is not merely that a president happened to live in Houston. He belonged to the generation that helped turn a still-competitive Texas Republican organization into a party capable of recruiting statewide candidates, building donor networks and connecting local activists to national institutions. His career also illustrates an older Texas Republican style that mixed business conservatism, international engagement and institution-minded public service."
    }
  ],
  "george-w-bush-texas-governor-president": [
    {
      heading: "How the Texas governorship shaped Bush's national political identity",
      body: "Bush's governorship matters because it was the proving ground for the political identity he carried into the 2000 presidential race. Texas governors do not possess the same concentrated appointment and budget powers found in some other states, so governing requires negotiation with an independently powerful lieutenant governor, a strong Legislature and numerous separately elected statewide officials. Bush's Texas record was therefore built in a system that rewarded coalition building as well as partisan positioning. His rise also came during the period when Republicans moved from being competitive in Texas to dominating statewide elections. That makes his governorship useful for understanding both his later national message and the state's political transition. The presidential years eventually overshadowed Austin, but the Texas chapter explains how Bush developed his public style, policy priorities and relationship with the Republican coalition that sent him to Washington."
    }
  ],
  "ted-cruz-texas-senator-profile": [
    {
      heading: "Committee power gives Cruz a different kind of influence than campaign visibility",
      body: "Cruz's national profile can make it easy to evaluate him mainly through presidential politics, television appearances or intraparty fights. A fuller assessment also has to look at Senate committee power. His official Senate biography and committee assignments show a portfolio spanning commerce, science and transportation, foreign relations, the judiciary, rules, border security, federal courts and other areas with direct consequences for Texas. Committee leadership matters because much of Congress's durable work happens before a bill reaches the floor: hearings define issues, chairs control agendas, nominations receive scrutiny and amendments are negotiated. For Texas, that institutional role touches aviation, telecommunications, space policy, trade, courts, immigration and infrastructure in ways that are less visible than campaign rhetoric. Separating Cruz the national conservative figure from Cruz the committee legislator produces a more useful profile of how a senator actually exercises power."
    }
  ],
  "john-cornyn-texas-senator-profile": [
    {
      heading: "Cornyn's state judicial career helps explain his Senate style",
      body: "Cornyn arrived in Washington with an unusually long résumé inside Texas legal institutions. His official Senate biography traces service as a Bexar County district judge, a justice on the Texas Supreme Court and Texas attorney general before his 2002 Senate election. That background matters because it places courts, criminal justice, federalism and legal procedure near the center of his political career rather than treating them as later Senate specialties. He also served as Republican whip from 2013 through 2019, giving him responsibility for vote counting and caucus strategy in addition to committee work. Those roles help explain why Cornyn's influence is often more institutional than performative. For readers comparing Texas senators, the distinction is important: longevity, leadership posts and committee relationships can shape federal policy even when a politician receives less daily attention than colleagues with more confrontational national brands."
    }
  ],
  "greg-abbott-texas-governor-profile": [
    {
      heading: "Abbott's power rests on both the governorship and a long legal career",
      body: "Abbott's governorship is easier to understand when viewed as the latest stage of a career built around Texas law and executive authority. The governor's official biography notes earlier service as a state district judge, a justice of the Texas Supreme Court and the state's longest-serving attorney general before his 2014 election as governor. Those offices gave him experience with constitutional litigation, state-federal disputes and the machinery of Texas government before he entered the governor's mansion. The governorship itself is powerful but structurally constrained: Texas divides executive authority among multiple independently elected officials, while the lieutenant governor and Legislature possess their own substantial powers. Abbott's political significance therefore comes not only from formal gubernatorial powers but from agenda setting, appointments, emergency authority, vetoes, negotiations with lawmakers and the ability to turn state litigation and administrative action into national political issues."
    }
  ],
  "dan-patrick-texas-lieutenant-governor-profile": [
    {
      heading: "Why the Texas lieutenant governor can shape policy as much as the governor",
      body: "Patrick's influence cannot be measured by the title alone. Texas gives its lieutenant governor unusually important legislative responsibilities because the office presides over the Senate, makes key committee assignments and helps determine which bills receive a path through the chamber. Patrick's official biography also notes eight years of prior Senate service, including leadership of the Senate Public Education Committee, before his first election as lieutenant governor in 2014. That combination of procedural power and long relationships with senators makes the office central to the state budget and to debates over taxes, schools, energy, border policy and social legislation. It also explains why disagreements between the governor, lieutenant governor and House speaker can determine whether a major Republican priority advances or stalls. Understanding Patrick therefore requires understanding the institutional architecture of Texas government, not simply cataloging his public positions."
    }
  ],
  "ken-paxton-texas-attorney-general-profile": [
    {
      heading: "The attorney general's institutional reach extends far beyond headline lawsuits",
      body: "Paxton is best known nationally for litigation, but the Texas attorney general's office is much broader than a courtroom strategy operation. The agency's official description says it employs thousands of people across dozens of divisions and offices, with responsibilities that include child-support enforcement, consumer protection, open-government enforcement, legal advice to state officials and representation of Texas in court. That scope matters when evaluating Paxton's record because nationally visible constitutional cases are only one part of the institution he leads. He also came to the office after service in both chambers of the Texas Legislature, giving him a political base separate from the executive branch. The combination makes the attorney general an important node in Texas's fragmented executive system: the office can defend state laws, challenge federal actions, enforce state statutes and operate large public-service programs while remaining independently elected from the governor."
    }
  ],
  "phil-gramm-texas-senator-fiscal-conservative": [
    {
      heading: "Gramm's party switch captures an important stage of Texas realignment",
      body: "Gramm's career is especially useful for understanding Texas's long partisan transition because he did not simply begin as a Republican in an already Republican state. The Texas State Cemetery biography records that the Texas A&M economist entered Congress as a Democrat, lost his House Budget Committee seat after helping advance the Reagan economic program, resigned in 1983 and then won his seat back as a Republican. He moved to the Senate in 1984 and later became closely associated with budget restraints, financial legislation and Republican campaign strategy. That sequence turns Gramm into more than a policy economist with a Senate résumé. His career shows how conservative officeholders, voters and institutions were migrating out of the old Democratic coalition while a durable Republican statewide structure was being built. The shift was political, ideological and organizational, and Gramm personally crossed all three dimensions."
    }
  ],
  "rick-perry-texas-governor-energy-legacy": [
    {
      heading: "Perry connects the Texas executive era to national energy policy",
      body: "Perry's unusually long tenure as governor makes his career a bridge between the consolidation of Republican power in Texas and later national debates over energy, regulation and economic development. Before becoming governor, he served in the Legislature, as agriculture commissioner and as lieutenant governor, giving him experience across several parts of state government. He then moved from Austin to Washington as the 14th U.S. Secretary of Energy, a role documented by the Department of Energy. That progression matters because Texas energy politics involve more than oil production: electricity reliability, natural gas, wind development, pipelines, federal research facilities and regulation all intersect with state policy. Perry's legacy therefore includes both the political model of a long-serving Republican governor and the translation of Texas's energy-centered economic identity into a federal cabinet role with responsibilities extending well beyond the state's borders."
    }
  ]
};

export function withPoliticalFigureDepthSupplements(figure: TexasPoliticalFigure): TexasPoliticalFigure {
  const expansions = SECTION_EXPANSIONS[figure.slug];
  const sections = expansions
    ? figure.sections.map((section) => ({
        ...section,
        body: expansions[section.heading] ? `${section.body}${expansions[section.heading]}` : section.body
      }))
    : figure.sections;
  const additions = SUPPLEMENTAL_SECTIONS[figure.slug];
  if (!additions?.length) return sections === figure.sections ? figure : { ...figure, sections };
  return { ...figure, sections: [...sections, ...additions] };
}
