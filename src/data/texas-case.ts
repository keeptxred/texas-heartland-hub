export type TexasCaseSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type TexasCasePosition = {
  slug: string;
  shortTitle: string;
  title: string;
  dek: string;
  stance: string;
  updated: string;
  keyPoints: string[];
  intro: string[];
  sections: TexasCaseSection[];
  sources: { label: string; url: string }[];
  related: { label: string; href: string }[];
};

export const TEXAS_CASE_POSITIONS: TexasCasePosition[] = [
  {
    slug: "protect-unborn-life",
    shortTitle: "Life",
    title: "The Texas Case for Protecting Unborn Life",
    dek: "Keep TX Red's case for a culture and legal framework that protects unborn children while strengthening support for mothers, families, adoption, and difficult pregnancies.",
    stance: "Keep TX Red is pro-life. We believe Texas should protect unborn human life and pair that protection with serious support for mothers, children, and families.",
    updated: "2026-08-18",
    keyPoints: [
      "The pro-life argument begins with the premise that unborn human life has moral value and deserves legal protection.",
      "Texas should not treat the debate as finished once a prohibition is enacted; policy should also make it easier to carry a pregnancy, raise a child, pursue adoption, and obtain legitimate medical care.",
      "Medical emergencies, difficult diagnoses, maternal health, adoption, foster care, child support, and family policy belong inside a serious pro-life agenda.",
      "Disagreement over abortion is profound, so KTR should state its position clearly while accurately describing Texas law and the strongest arguments on the other side.",
    ],
    intro: [
      "Keep TX Red's pro-life position rests on a straightforward moral judgment: an unborn child is not merely an inconvenience, a line item, or a political abstraction. Human life before birth has value, and a society that claims to protect vulnerable people should not exclude the unborn simply because they cannot speak for themselves.",
      "That conviction does not eliminate hard cases. Pregnancy can involve medical emergencies, severe fetal diagnoses, financial fear, abuse, abandonment, and families who feel unprepared. A serious pro-life policy cannot answer those realities with a slogan. Texas should protect unborn life while making sure women facing difficult pregnancies can find competent medical care, practical assistance, adoption information, and long-term support.",
    ],
    sections: [
      {
        heading: "Why the unborn deserve protection",
        paragraphs: [
          "The central disagreement in the abortion debate is not really about whether pregnancy can be difficult; everyone knows it can be. The dispute is about what the unborn child is and what obligations follow from that answer. Keep TX Red's position is that human development does not become morally significant only when a child is wanted, viable outside the womb, or delivered. The law routinely protects people whose independence and capacities differ, and dependency by itself should not erase human worth.",
          "That is why the pro-life case is fundamentally different from a preference about health-care delivery. If there are two human lives involved, the state has a legitimate interest in protecting both whenever possible. Texas policy should begin from that premise and then confront the difficult medical and practical questions honestly.",
        ],
      },
      {
        heading: "A pro-life state has obligations after birth",
        paragraphs: [
          "Protecting life before birth is not enough. If Texas asks a frightened mother to choose life, the state, churches, charities, families, employers, and communities should make that choice more realistic. That does not mean every social problem requires a new entitlement. It does mean the pro-life movement should care about adoption capacity, foster-care performance, maternal health, child-support enforcement, abuse prevention, workplace flexibility, and practical pregnancy assistance.",
          "The strongest pro-life culture is one in which a woman in crisis can see a path forward. KTR should therefore measure pro-life policy not only by restrictions on abortion, but also by whether Texas is becoming a better place to carry a pregnancy, deliver safely, place a child for adoption when necessary, and raise a family.",
        ],
      },
      {
        heading: "Medical emergencies require precision, not political caricature",
        paragraphs: [
          "Texas abortion law is often discussed through competing slogans that are too broad to be useful. Supporters of current restrictions sometimes understate the fear physicians describe in emergency cases, while critics sometimes describe Texas law as though it contains no medical protections at all. KTR should do neither. We should quote the statute, explain the exceptions and standards as written, track court decisions and agency guidance, and distinguish a genuine emergency from an elective abortion debate.",
          "A pro-life legal framework should be clear enough that doctors can act when a mother's life or major bodily function is seriously threatened without believing that ordinary emergency medicine will be treated as criminal conduct. Clarity protects both patients and the legitimacy of the law.",
        ],
      },
      {
        heading: "The strongest argument on the other side",
        paragraphs: [
          "The strongest pro-choice argument is that pregnancy uniquely uses a woman's body and can reshape her health, finances, relationships, education, and future; therefore the government should not force continuation of a pregnancy. That argument deserves a direct answer rather than dismissal.",
          "KTR disagrees because bodily autonomy is not the only moral interest once another developing human life exists. The law places limits on individual freedom when another person's life is at stake. The difficult question is where those duties begin, and our answer is that birth should not be the line that determines whether a human life may be intentionally ended.",
        ],
      },
      {
        heading: "What Texas should do",
        bullets: [
          "Protect unborn life in law while writing medical-emergency provisions with maximum clarity.",
          "Publish plain-language explanations of what Texas abortion law does and does not prohibit.",
          "Strengthen adoption, pregnancy-assistance, maternal-health, and family-support systems while demanding measurable outcomes from public spending.",
          "Hold agencies and lawmakers accountable for whether promised family-support programs actually work.",
          "Treat mothers in crisis as people to help, not props in a political argument.",
        ],
      },
    ],
    sources: [
      { label: "Texas Health & Safety Code — Chapter 170A", url: "https://statutes.capitol.texas.gov/Docs/HS/htm/HS.170A.htm" },
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/" },
      { label: "Texas Health and Human Services — Women and Children", url: "https://www.hhs.texas.gov/services/health/women-children" },
    ],
    related: [
      { label: "Texas laws", href: "/laws" },
      { label: "Texas Legislature", href: "/texas-legislature" },
      { label: "Texas bill tracker", href: "/bills" },
      { label: "Texas politics", href: "/texas-politics" },
    ],
  },
  {
    slug: "gun-rights-over-gun-control",
    shortTitle: "Gun Rights",
    title: "The Texas Case for Gun Rights — and Against More Gun Control",
    dek: "Why Keep TX Red believes Texas should focus on violent criminals, due process, enforcement, and responsible gun ownership instead of burdening law-abiding citizens with new restrictions.",
    stance: "Keep TX Red supports the right of law-abiding Texans to keep and bear arms and opposes gun-control policies that burden lawful ownership without convincingly targeting violent offenders.",
    updated: "2026-08-18",
    keyPoints: [
      "A constitutional right should not be treated as a privilege available only after government permission unless a restriction can meet a very high burden.",
      "Gun policy should distinguish violent criminals and dangerous conduct from millions of lawful gun owners.",
      "Restrictions that are easy for criminals to evade but costly for compliant citizens deserve special skepticism.",
      "Due process matters when government seeks to disarm an individual based on allegations of dangerousness.",
    ],
    intro: [
      "Texas has a strong gun culture because firearms are tied to self-defense, hunting, sport, rural life, family tradition, and a constitutional distrust of concentrating all coercive power in the government. Keep TX Red believes that tradition is worth defending.",
      "Every mass shooting and violent crime creates understandable pressure to 'do something.' But a policy should be judged by what it actually changes, whom it burdens, how easily criminals can evade it, and whether the government could accomplish the same safety goal by targeting dangerous conduct more directly. A law that mainly inconveniences peaceful citizens while leaving determined violent offenders largely unaffected is not a serious public-safety strategy.",
    ],
    sections: [
      {
        heading: "The right belongs to ordinary citizens",
        paragraphs: [
          "The Second Amendment is not a special exemption for hunters or a benefit reserved for people who can persuade the state that they have a particular need. It protects an individual right. Texas law should therefore begin with a presumption that a law-abiding adult may possess and carry commonly owned firearms, subject to constitutionally valid restrictions on prohibited persons and genuinely sensitive circumstances.",
          "That presumption matters because rights can be hollowed out without being formally repealed. Excessive fees, discretionary permitting, arbitrary waiting periods, confusing location rules, and broad bans can make lawful ownership practically inaccessible even when the government insists the right technically remains.",
        ],
      },
      {
        heading: "Focus on criminals, not categories of equipment",
        paragraphs: [
          "Political debates often focus on the appearance, magazine capacity, or marketing label of a firearm. KTR's preference is to focus on behavior: illegal possession by prohibited people, violent threats, trafficking, robbery, domestic violence, repeat violent offending, and the failure to incapacitate offenders who repeatedly demonstrate that they are dangerous.",
          "Banning a category of firearm can be politically visible, but visibility is not the same as effectiveness. If a person willing to commit murder is also willing to violate a gun restriction, lawmakers should be able to explain why the restriction will meaningfully change that person's access or conduct rather than merely change what compliant citizens may own.",
        ],
      },
      {
        heading: "Self-defense is not theoretical",
        paragraphs: [
          "Police perform an indispensable public-safety role, but officers cannot be physically present at every home invasion, assault, carjacking, or rural emergency. Texans retain the primary responsibility for surviving the minutes before help arrives. For many people, especially those facing a stronger attacker or multiple attackers, a firearm can equalize a dangerous disparity in force.",
          "That does not excuse recklessness. Responsible ownership includes safe storage appropriate to the household, knowledge of the law, competent handling, and judgment about when force is lawful. Rights and responsibility reinforce each other; they are not opposites.",
        ],
      },
      {
        heading: "The strongest argument for more gun control",
        paragraphs: [
          "The strongest gun-control argument is that widespread firearm availability increases the chance that impulsive violence, domestic abuse, suicide, or ordinary disputes become lethal, and that some restrictions could reduce access during moments of crisis. KTR takes that concern seriously, particularly where there is documented violent conduct or a legally established prohibition.",
          "Where we disagree is the assumption that broad restrictions on lawful owners are the best answer. The burden should be on government to show that a restriction is constitutional, narrowly targeted, enforceable, and likely to affect the dangerous behavior at issue. When government seeks to disarm a particular person because of alleged dangerousness, strong due-process protections are essential.",
        ],
      },
      {
        heading: "What Texas should do",
        bullets: [
          "Aggressively prosecute violent criminals who illegally possess or use firearms.",
          "Protect constitutional carry and lawful self-defense while keeping the law understandable to ordinary citizens.",
          "Improve reporting and enforcement of existing prohibitions before creating new burdens for lawful owners.",
          "Require meaningful due process before an individual is deprived of firearm rights.",
          "Promote voluntary training and responsible storage without converting every best practice into a criminal mandate.",
        ],
      },
    ],
    sources: [
      { label: "U.S. Constitution — Second Amendment", url: "https://constitution.congress.gov/constitution/amendment-2/" },
      { label: "Texas Penal Code — Chapter 46, Weapons", url: "https://statutes.capitol.texas.gov/Docs/PE/htm/PE.46.htm" },
      { label: "Texas DPS — Handgun Licensing", url: "https://www.dps.texas.gov/section/handgun-licensing" },
    ],
    related: [
      { label: "Texas laws", href: "/laws" },
      { label: "Texas law enforcement", href: "/texas-law-enforcement" },
      { label: "Texas bills", href: "/bills" },
      { label: "Texas Legislature", href: "/texas-legislature" },
    ],
  },
  {
    slug: "eliminate-property-taxes",
    shortTitle: "Property Taxes",
    title: "The Texas Case for Eliminating Property Taxes",
    dek: "Why Keep TX Red believes Texans should not owe government a permanent annual charge simply for continuing to own their homes and land — and what a responsible path away from property taxes would require.",
    stance: "Keep TX Red believes Texas should make the long-term elimination of property taxes a state goal, with a transparent replacement plan that does not simply hide the same burden elsewhere.",
    updated: "2026-08-18",
    keyPoints: [
      "Property tax makes ownership conditional on a recurring payment to government even after a mortgage is paid off.",
      "Rising appraisals can increase political pressure and tax burdens even when a homeowner's income has not increased.",
      "Elimination is much harder than a slogan because property taxes finance schools, cities, counties, and special districts.",
      "A credible phaseout requires spending discipline, replacement revenue decisions, local-government reform, and protection against simply recreating the tax under another name.",
    ],
    intro: [
      "Texas celebrates private property, yet a homeowner who has paid off every dollar of a mortgage can still lose the property for failing to pay taxes assessed year after year. Keep TX Red believes that contradiction should bother Texans more than it does.",
      "Property taxes are deeply embedded in Texas local government and school finance, so eliminating them cannot be accomplished by declaring them gone and ignoring the bills they currently pay. But complexity is not an argument for permanent surrender. Texas has spent years debating relief, compression, exemptions, appraisal reform, and rate limits. The next long-term question should be whether the state can move from temporary relief toward ending the tax itself.",
    ],
    sections: [
      {
        heading: "You should be able to truly own your home",
        paragraphs: [
          "Private ownership should mean more than holding title subject to an endlessly recurring government claim. A family can save for decades, pay principal and interest, maintain the property, insure it, and still face an annual bill that can rise because surrounding market values rose. For retirees and others on relatively fixed incomes, that disconnect is especially serious.",
          "Property taxes are often defended as the price of local services. Those services must be paid for, but the method matters. KTR's objection is to a system that taxes an asset repeatedly based on an estimated value that may rise without producing any cash the owner can use to pay the tax.",
        ],
      },
      {
        heading: "Appraisal growth is not the same as ability to pay",
        paragraphs: [
          "A higher appraisal may make a homeowner wealthier on paper, but paper appreciation does not automatically create spendable income. A person can live in the same house, receive the same paycheck or retirement income, and see the taxable value of the property climb because the neighborhood became more expensive.",
          "Texas has adopted exemptions, appraisal limits for certain property, tax-rate mechanisms, and school-tax compression to address parts of this problem. Those policies can provide relief, but they still operate inside a system built around recurring taxation of property ownership.",
        ],
      },
      {
        heading: "Elimination requires arithmetic, not applause lines",
        paragraphs: [
          "Property taxes finance substantial local obligations, including public schools, counties, cities, and special districts. Any politician promising immediate elimination should identify which spending disappears, which revenue replaces it, which level of government collects that revenue, and how taxpayers are protected from paying both the old and new burden during a transition.",
          "KTR should be aggressive about the goal and equally aggressive about the math. A plan that replaces property tax dollar-for-dollar with a new broad tax can still improve the principle of ownership, but it may not lower the overall burden. A plan that raises consumption taxes without restraining spending could become a tax shift rather than tax reform. Texans deserve to see the tradeoffs before voting for the slogan.",
        ],
      },
      {
        heading: "The strongest case for keeping property taxes",
        paragraphs: [
          "The strongest defense of property taxes is that they provide a relatively stable local revenue base tied to local property values, fund services close to the taxpayer, and are harder to avoid than some other taxes. Eliminating them could make local governments more dependent on Austin or require large increases in other taxes.",
          "Those are real concerns. KTR's response is that local control should not require a perpetual lien-like claim on a family's home. Texas can preserve meaningful local decision-making while changing the revenue structure, but only if the replacement system is transparent and paired with limits that prevent uncontrolled spending growth.",
        ],
      },
      {
        heading: "A responsible Texas phaseout",
        bullets: [
          "Set elimination, not temporary relief alone, as the long-term policy objective.",
          "Require every phaseout proposal to publish the replacement-revenue and spending assumptions in plain language.",
          "Use state revenue growth and spending restraint to buy down school property taxes over time where feasible.",
          "Reform local debt, special-district growth, and spending incentives that continually recreate property-tax pressure.",
          "Prevent replacement taxes from being layered on top of the old burden without enforceable offsets.",
          "Publish county, city, school-district, and special-district tax data so taxpayers can see exactly who is charging what.",
        ],
      },
    ],
    sources: [
      { label: "Texas Comptroller — Property Tax", url: "https://comptroller.texas.gov/taxes/property-tax/" },
      { label: "Texas Tax Code", url: "https://statutes.capitol.texas.gov/Docs/TX/htm/TX.1.htm" },
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/" },
    ],
    related: [
      { label: "Texas economy", href: "/texas-economy" },
      { label: "Texas laws", href: "/laws" },
      { label: "Texas bills", href: "/bills" },
      { label: "Find your representatives", href: "/find-representative" },
    ],
  },
  {
    slug: "lower-taxes-limited-government",
    shortTitle: "Lower Taxes",
    title: "The Texas Case for Lower Taxes and Limited Government",
    dek: "Why Keep TX Red believes Texas should make government justify what it takes before asking families and businesses to justify what they keep.",
    stance: "Keep TX Red favors lower taxes, restrained government growth, simpler rules, and a presumption that Texans should keep more of the money they earn.",
    updated: "2026-08-18",
    keyPoints: [
      "Taxes are not free resources for government; they are money first earned by families, workers, and businesses.",
      "A growing state does not automatically require government spending to grow at the same rate or faster.",
      "Tax cuts are most durable when paired with spending discipline rather than temporary surpluses alone.",
      "Government should publish measurable outcomes so taxpayers can distinguish essential services from programs that merely perpetuate themselves.",
    ],
    intro: [
      "Texas has benefited from a political culture that is generally skeptical of high taxes and broad state control. Keep TX Red believes that skepticism should be strengthened, not softened as Texas becomes larger and wealthier.",
      "The first question in a budget debate should not be, 'How much revenue is available to spend?' It should be, 'What does government actually need to do, what level of government should do it, and what result are taxpayers buying?' Revenue forecasts are not spending instructions. Economic growth should create opportunities to return money to taxpayers and reduce long-term burdens.",
    ],
    sections: [
      {
        heading: "The money belongs to Texans before it belongs to Austin",
        paragraphs: [
          "Government taxes are compulsory. That makes public spending morally different from private spending and creates a higher duty to justify each use. A household cannot force a neighbor to fund a purchase it finds desirable; government can. Fiscal restraint is therefore not hostility to public services. It is respect for the fact that every public dollar was taken from someone who had another use for it.",
          "Lower taxes leave more decisions with families and businesses that know their own needs. They can save, invest, hire, expand, donate, pay down debt, educate children, or simply absorb the cost of living without first asking government permission.",
        ],
      },
      {
        heading: "Growth should make tax relief easier",
        paragraphs: [
          "When population, incomes, business activity, and consumption grow, state revenue can rise even without increasing tax rates. That creates a recurring temptation to build every strong revenue cycle into a permanently larger spending base. KTR believes Texas should resist that ratchet.",
          "Some spending will legitimately rise with population and inflation, especially for infrastructure and core services. But agencies should not receive automatic claims on every additional dollar. Lawmakers should use strong revenue periods to retire debt where prudent, shore up genuine obligations, fund one-time needs, and return excess capacity to taxpayers through durable tax reduction.",
        ],
      },
      {
        heading: "Spending discipline makes tax cuts durable",
        paragraphs: [
          "A tax cut financed only by a temporary revenue spike can disappear when the cycle turns. Permanent tax relief is strongest when the state also restrains recurring spending growth, evaluates programs, sunsets failures, and avoids creating obligations that require future tax increases.",
          "This is where accountability reporting matters. KTR should not merely repeat that a budget is 'record-setting' or that an agency received more money. We should ask what taxpayers were promised, what performance measure was attached, what happened after the money was spent, and whether lawmakers later expanded the program despite weak results.",
        ],
      },
      {
        heading: "The strongest case for higher taxes",
        paragraphs: [
          "Advocates for higher taxes argue that a fast-growing state needs more infrastructure, teachers, health services, public safety, water projects, and other investments, and that chronic underfunding can be more expensive in the long run. That argument can be correct in a specific case; deferred maintenance and genuine capacity shortages are real costs.",
          "KTR's disagreement is with treating higher revenue as the default solution before prioritization, reform, competition, and performance are examined. Government should prove the need, define the outcome, and show why the chosen level of government is the right one before asking Texans for more.",
        ],
      },
      {
        heading: "What Texas should do",
        bullets: [
          "Limit recurring spending growth and subject major programs to periodic performance review.",
          "Return structural surpluses through durable tax relief instead of treating every surplus as a new baseline.",
          "Make budgets understandable at the program and outcome level, not only through giant appropriations totals.",
          "Prefer broad, simple, low-rate taxes over narrow carve-outs, hidden fees, and politically allocated exemptions.",
          "Require strong justification before creating new taxes, fees, regulatory assessments, or local taxing entities.",
        ],
      },
    ],
    sources: [
      { label: "Texas Comptroller — Taxes", url: "https://comptroller.texas.gov/taxes/" },
      { label: "Texas Legislative Budget Board", url: "https://www.lbb.texas.gov/" },
      { label: "Texas Comptroller — Transparency", url: "https://comptroller.texas.gov/transparency/" },
    ],
    related: [
      { label: "Texas economy", href: "/texas-economy" },
      { label: "Texas Legislature", href: "/texas-legislature" },
      { label: "Texas bill tracker", href: "/bills" },
      { label: "Texas government", href: "/texas-government" },
    ],
  },
  {
    slug: "parental-rights-school-choice",
    shortTitle: "Parental Rights",
    title: "The Texas Case for Parental Rights and School Choice",
    dek: "Why Keep TX Red believes parents — not education bureaucracies — should hold the primary authority over a child's upbringing and should have meaningful choices when a school is not working for that child.",
    stance: "Keep TX Red supports strong parental rights, transparent schools, and meaningful education choice because children do not belong to the state or to an education system.",
    updated: "2026-08-18",
    keyPoints: [
      "Parents have the primary responsibility for a child's upbringing and should therefore have meaningful authority over education decisions.",
      "Transparency about curriculum, policies, safety, and student records is a minimum condition for trust.",
      "School choice gives families leverage when a school is unsafe, ineffective, ideologically incompatible, or simply a poor fit.",
      "Choice programs should be judged by whether they expand family options without creating a new regulatory system that destroys the independence families were trying to obtain.",
    ],
    intro: [
      "A school can be important without becoming the ultimate authority over a child. Parents carry the lifelong legal, financial, and moral responsibility for their children, and Keep TX Red believes public policy should recognize that hierarchy.",
      "Parental rights mean more than receiving a newsletter from a school district. Parents should be able to know what is being taught, review important policies and records, object through lawful processes, protect a child from unsafe conditions, and choose another educational setting when the assigned school is not meeting the child's needs.",
    ],
    sections: [
      {
        heading: "Parents are the primary decision-makers",
        paragraphs: [
          "Teachers, coaches, counselors, administrators, and specialists can have enormous positive influence, but their authority is delegated and limited. The family is not a stakeholder on equal footing with the institution; parents are responsible for the child when the school day ends, when a medical or disciplinary problem emerges, and long after an employee or administrator changes jobs.",
          "That responsibility should come with access to information and meaningful decision-making power. Policies that intentionally keep parents uninformed about significant matters involving their children should face a strong presumption against them, subject to narrow situations where existing law protects a child from abuse or immediate danger.",
        ],
      },
      {
        heading: "Transparency is not censorship",
        paragraphs: [
          "Parents cannot exercise responsibility if they are unable to see curriculum materials, library policies, district rules, safety procedures, academic records, or the standards being used to make important decisions. Public schools are public institutions. Their default posture should be transparency, not suspicion toward parents asking questions.",
          "Transparency also improves the quality of the debate. When people can read the actual policy, assignment, book, lesson, or district guidance, disagreements can focus on what is really happening rather than screenshots and rumors stripped of context.",
        ],
      },
      {
        heading: "Choice gives families an exit",
        paragraphs: [
          "Accountability is weak when a family has only one practical provider. School choice changes that balance by allowing families to leave a setting that is unsafe, chronically ineffective, or incompatible with a child's needs. Choice can include district transfers, charter schools, private schools, home education, specialized programs, and other arrangements depending on law and family circumstances.",
          "KTR supports policies that make those choices more realistic, particularly for families that cannot simply move to another neighborhood or pay tuition twice — once through taxes and again privately. Choice should not be reserved for affluent families who already have the means to exit.",
        ],
      },
      {
        heading: "The strongest argument against school choice",
        paragraphs: [
          "Opponents argue that moving public dollars with students can weaken neighborhood schools, that private providers may not face the same accountability requirements, and that rural communities may have few alternatives. Those concerns deserve specific answers rather than accusations about motives.",
          "KTR's view is that funding systems exist to educate children, not to guarantee revenue to a particular institution regardless of family satisfaction. At the same time, program design matters. Texas should protect fiscal transparency, prevent fraud, preserve genuine private-school and homeschool independence, and acknowledge that rural choice may require different solutions from urban choice.",
        ],
      },
      {
        heading: "What Texas should do",
        bullets: [
          "Codify strong parental access to curriculum, policies, records, and important notices.",
          "Make district complaint and appeal processes understandable and usable by ordinary parents.",
          "Expand meaningful school options without turning private and home education into extensions of the state bureaucracy.",
          "Publish comparable performance, safety, and spending information so families can make informed choices.",
          "Treat parents who raise good-faith concerns as citizens to answer, not obstacles to manage.",
        ],
      },
    ],
    sources: [
      { label: "Texas Education Code", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.1.htm" },
      { label: "Texas Education Agency", url: "https://tea.texas.gov/" },
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/" },
    ],
    related: [
      { label: "Texas politics", href: "/texas-politics" },
      { label: "Texas bills", href: "/bills" },
      { label: "Texas laws", href: "/laws" },
      { label: "Find your representatives", href: "/find-representative" },
    ],
  },
  {
    slug: "secure-texas-border",
    shortTitle: "Border Security",
    title: "The Texas Case for a Secure Border",
    dek: "Why Keep TX Red believes a sovereign nation must control entry, Texas has a legitimate interest in protecting its communities, and immigration policy should distinguish legal immigration from unlawful entry.",
    stance: "Keep TX Red supports strong border enforcement, legal immigration, consequences for unlawful entry and trafficking, and the fullest lawful role for Texas when federal enforcement fails to protect the state adequately.",
    updated: "2026-08-18",
    keyPoints: [
      "A country that cannot reliably control entry cannot fully enforce immigration law, protect lawful immigration, or know who is entering.",
      "Border security and legal immigration are not opposites; consistent enforcement can strengthen public support for lawful immigration.",
      "Texas bears real public-safety and fiscal consequences from conditions at the international border even though immigration law is primarily federal.",
      "State action must still operate within constitutional limits, which is why court rulings and statutory authority matter as much as political announcements.",
    ],
    intro: [
      "Texas shares a long international border with Mexico and experiences the consequences of federal immigration and border policy more directly than most states. Keep TX Red believes Texans are justified in demanding a border that is controlled rather than merely observed.",
      "The argument for enforcement is not an argument against immigrants. Texas has been shaped by generations of lawful immigrants, and a credible system should welcome people who follow the law while maintaining meaningful consequences for those who evade it. When lawful and unlawful entry are treated as morally or practically interchangeable, the system punishes the people who waited, applied, paid fees, and complied with the rules.",
    ],
    sections: [
      {
        heading: "Borders are a basic function of sovereignty",
        paragraphs: [
          "Immigration policy can be generous or restrictive, but either approach requires the government to know and control who is admitted. If rules are routinely unenforced, formal immigration limits become suggestions rather than law. That undermines public confidence and creates incentives for dangerous smuggling routes and fraudulent claims.",
          "A secure border therefore comes before many of the ideological disagreements about legal immigration levels. Texans can debate how many immigrants should be admitted, which categories should receive priority, and what legal pathways should exist while still agreeing that entry should occur through rules the government can actually enforce.",
        ],
      },
      {
        heading: "Texas has interests the federal government cannot dismiss",
        paragraphs: [
          "The federal government holds primary constitutional authority over immigration, but Texas is not insulated from the results of federal choices. State and local governments operate roads, law-enforcement systems, schools, hospitals, emergency services, and other institutions affected by population flows and criminal activity at or near the border.",
          "KTR supports Texas using the lawful tools available to protect public safety, disrupt smuggling and cartel operations, deploy state resources where authorized, and challenge federal policies in court when state leaders believe Washington has exceeded or abandoned its obligations. But 'Texas should act' is not the same as 'Texas may do anything.' Legal authority should be evaluated honestly.",
        ],
      },
      {
        heading: "Cartels and human smuggling change the stakes",
        paragraphs: [
          "An uncontrolled border creates business opportunities for criminal organizations that move people, drugs, weapons, and money. Migrants themselves can become customers, cargo, debtors, or victims of those networks. Border enforcement is therefore not only an immigration issue; it is also a public-safety and organized-crime issue.",
          "KTR coverage should distinguish ordinary migrants from cartel members and traffickers rather than treating everyone crossing the border as the same. Precision makes the case for enforcement stronger because it focuses blame on the people and organizations committing crimes rather than on ethnicity or nationality.",
        ],
      },
      {
        heading: "The strongest argument for a more permissive approach",
        paragraphs: [
          "Critics of aggressive enforcement argue that many migrants are fleeing violence, political instability, or extreme poverty; that asylum law creates legal processes for protection claims; and that enforcement measures can impose humanitarian costs. Those facts should not be ignored.",
          "KTR's response is that humanitarian concern and enforceable rules must coexist. A system overwhelmed by claims it cannot promptly adjudicate helps neither legitimate asylum seekers nor the rule of law. Faster decisions, clear standards, lawful pathways, detention or monitoring where authorized, and actual consequences for failed claims are more humane than a years-long system that encourages dangerous journeys based on the expectation of release.",
        ],
      },
      {
        heading: "What Texas should do",
        bullets: [
          "Support strong federal enforcement and demand measurable operational control rather than rhetorical claims.",
          "Use lawful state police, intelligence, National Guard, prosecution, and infrastructure tools to target smuggling and border-related crime.",
          "Track the cost and outcomes of state border programs so taxpayers can judge whether they work.",
          "Defend legal immigration and distinguish it clearly from unlawful entry.",
          "Challenge federal policy through legislation and courts while respecting binding constitutional limits and rulings.",
        ],
      },
    ],
    sources: [
      { label: "Texas Department of Public Safety — Border Security", url: "https://www.dps.texas.gov/section/texas-border-security" },
      { label: "U.S. Customs and Border Protection", url: "https://www.cbp.gov/" },
      { label: "Texas Legislature Online", url: "https://capitol.texas.gov/" },
    ],
    related: [
      { label: "Texas border security", href: "/texas-border-security" },
      { label: "Texas law enforcement", href: "/texas-law-enforcement" },
      { label: "Texas laws", href: "/laws" },
      { label: "Texas bills", href: "/bills" },
    ],
  },
];

export const TEXAS_CASE_BY_SLUG: Record<string, TexasCasePosition> = Object.fromEntries(
  TEXAS_CASE_POSITIONS.map((position) => [position.slug, position]),
);

export function getTexasCasePosition(slug: string): TexasCasePosition | undefined {
  return TEXAS_CASE_BY_SLUG[slug];
}
