import type { IssueGuide } from "@/data/issue-guides";

type IssueSection = IssueGuide["sections"][number];

const PRIORITY_EXTRA_SECTIONS: Record<string, IssueSection[]> = {
  "ercot-grid-reliability": [
    {
      heading: "Reliability is a chain of separate responsibilities",
      body: [
        "A reliable electric system depends on several institutions doing different jobs at the same time. ERCOT operates the grid and wholesale market, the Public Utility Commission of Texas writes and enforces many market rules, transmission and distribution utilities maintain wires, generators own and operate most power plants, gas suppliers and pipelines support fuel delivery, and the Legislature sets the statutory framework. A failure in one layer can create consequences elsewhere without making every participant legally responsible for the same decision.",
        "That division is why a useful reliability analysis starts by naming the actor and the decision. A shortage of generation, a transmission constraint, a plant outage, a fuel-delivery problem, a market-price signal, a conservation appeal, and a regulatory rule change are related but not interchangeable. KTR coverage should tell readers which entity had authority, what information was available, and what remedy the governing law or market rules actually permit."
      ]
    },
    {
      heading: "Capacity, energy and reserves answer different questions",
      body: [
        "Electricity debates often use the word capacity as if it were the same thing as electricity actually produced. Installed capacity describes how much equipment can theoretically generate under stated conditions; energy describes actual production over time; operating reserves describe resources ERCOT can call on to manage uncertainty and contingencies. A technology can contribute strongly in one category and differently in another, so comparisons should avoid reducing grid reliability to a single nameplate number or annual energy percentage.",
        "For policy purposes, the harder question is whether enough usable resources can respond during the hours when the system is tight. That requires attention to weather, maintenance, outages, transmission, fuel, storage duration, demand response and the correlation between customer demand and resource availability. The governing standard should be the reliability need being solved, not a political preference for or against one generation technology."
      ]
    },
    {
      heading: "Transmission can be as important as generation",
      body: [
        "Adding a power plant does not guarantee that its electricity can reach the customers who need it. Texas must also plan, permit, finance and build transmission that moves electricity from generation areas to load centers while keeping the network within operating limits. Congestion can separate regions economically and operationally even when the state has substantial generation in the aggregate. This is especially important when growth occurs faster than the infrastructure needed to serve it.",
        "Readers evaluating a proposed transmission project should separate the need determination from the route and cost-allocation debates. A project may be justified by reliability, economic congestion, generator interconnection or load growth, while landowners can still dispute routing and property impacts. Those are legitimate but distinct questions. The PUC, ERCOT planning processes and applicable utility law provide the record for determining who decides each stage."
      ]
    },
    {
      heading: "Weatherization is not the same as guaranteed performance",
      body: [
        "Post-Uri policy put major attention on weatherization and emergency preparation. Weatherization requirements are intended to reduce predictable cold- and heat-related failures, but no rule can eliminate every mechanical outage, fuel interruption or extreme-weather risk. The useful accountability question is whether a facility complied with the applicable standard, whether the standard addressed the failure mode that occurred, and whether regulators identified a gap that requires a later rule or legislative change.",
        "The same discipline applies to natural-gas infrastructure that supports electric generation. Electricity and gas are governed through different markets and regulatory systems, yet a fuel problem can become a grid problem when gas-fired generation cannot obtain or deliver needed fuel. KTR should therefore connect electric reliability reporting with the relevant Railroad Commission, PUC and ERCOT responsibilities without implying that one regulator controls the entire chain."
      ]
    },
    {
      heading: "Price signals and reliability policy can pull in different directions",
      body: [
        "Texas's competitive wholesale market uses prices and market rules to influence investment and operating behavior. Policies designed to improve reliability can alter those incentives by changing reserve products, scarcity pricing, performance requirements, transmission costs or the compensation available to certain resources. A proposal can improve one reliability metric while increasing customer costs, shifting risk or changing which investments are economically attractive.",
        "For that reason, KTR should evaluate grid reforms with at least four questions: what reliability problem is being targeted, who pays for the change, what behavior the rule is intended to encourage, and what measurable result would show that it worked. Announced megawatts, projected costs and political labels are not substitutes for the final PUC order, ERCOT protocol, statutory authority and observed system performance."
      ]
    },
    {
      heading: "How to read an ERCOT emergency headline",
      body: [
        "A conservation request, watch, operating condition or emergency action should be reported with its actual operational meaning. Readers need to know whether ERCOT is forecasting tight conditions, asking customers voluntarily to conserve, deploying reserve services, directing transmission actions or entering a formal emergency state. Those steps represent different levels of concern and should not all be described as a blackout warning.",
        "The permanent value of this guide is to give those fast-moving alerts a stable frame. KTR news stories can carry the immediate forecast and event details, while this page explains the institutions, market concepts and accountability questions that do not change every hour. That separation also prevents a temporary forecast from becoming stale evergreen copy after the grid returns to normal."
      ]
    }
  ],
  "texas-border-security-operation-lone-star": [
    {
      heading: "Border security and immigration administration are not the same legal function",
      body: [
        "Texas can deploy state law-enforcement resources, fund barriers, prosecute violations of state criminal law and use state personnel for missions authorized by state law. Admission to the United States, federal removal proceedings, asylum administration and most immigration-status decisions are governed through federal law and federal institutions. A border story can involve both systems at once, but that does not make their powers interchangeable.",
        "That distinction is essential when evaluating claims that a state action either 'enforces immigration law' or has no connection to immigration at all. The correct analysis identifies the state offense, state property interest, federal immigration authority or constitutional doctrine actually being invoked. It then asks whether courts have allowed the specific state mechanism to operate, rather than treating the broader political dispute as the legal holding."
      ]
    },
    {
      heading: "Operation Lone Star spending should be traced to the appropriation",
      body: [
        "Operation Lone Star is financed through state budgeting decisions spread across agencies, programs and legislative actions. A headline total can combine DPS operations, Texas Military Department costs, grants, border infrastructure, detention or other expenses that serve different purposes. The durable way to evaluate spending is to connect each major claim to an appropriation, transfer, agency record, contract or Legislative Budget Board document and identify the period the number covers.",
        "This also matters when comparing cost with results. Arrests, criminal referrals, barrier miles, seizures, encounters and federal immigration outcomes are different measures produced by different agencies. KTR should not divide one broad spending number by an unrelated activity count and call the result a program cost without explaining the denominator. Fiscal accountability requires matching the expenditure to the mission it actually funded."
      ]
    },
    {
      heading: "DPS and the Texas Military Department have different authorities",
      body: [
        "DPS is a civilian state public-safety agency with statutory law-enforcement functions. The Texas Military Department administers state military forces that can be activated for missions authorized under state or federal law. Personnel may operate in the same border region and support a common state objective, but their arrest powers, command structures, rules, equipment and legal authorities are not identical.",
        "When an incident occurs, readers should be told which organization was involved and under what mission. That prevents a National Guard engineering or observation task from being reported as if it were a DPS criminal investigation, and it prevents a DPS arrest from being attributed generically to 'the Guard.' Clear agency attribution is a basic part of evaluating both operational success and accountability."
      ]
    },
    {
      heading: "Barriers raise property, procurement and operational questions",
      body: [
        "A border wall, fencing, concertina wire, buoy system or access road is not only an immigration-policy symbol. Each project can involve land ownership, easements, environmental or water issues, procurement, construction standards, maintenance and coordination with law-enforcement operations. Texas's long border also crosses private property and varied terrain, so the legal and practical constraints can differ by segment.",
        "For taxpayers, useful reporting should identify who owns the land, who holds the contract, what the state is buying, the contract value and term, and what agency says the infrastructure is intended to accomplish. For landowners, the relevant question may be consent, access, condemnation authority or damage rather than immigration status. Separating these layers makes the coverage more precise and more useful."
      ]
    },
    {
      heading: "State criminal prosecutions require ordinary due-process analysis",
      body: [
        "Border enforcement can lead to state arrests for offenses such as trespass, smuggling or other crimes independently of a person's federal immigration case. Those prosecutions still operate through the Texas criminal-justice system, with charging decisions, evidence, bail, appointed counsel when required, court jurisdiction and constitutional protections. A state arrest does not itself decide whether a person ultimately has permission to remain in the United States.",
        "The distinction matters in both directions. Support for stronger border enforcement does not eliminate the need to prove a state criminal charge, and dismissal of a state charge does not necessarily resolve a separate federal immigration matter. KTR should identify the charge and court record when reporting a prosecution instead of using immigration status as shorthand for the criminal case."
      ]
    },
    {
      heading: "How to evaluate claims of success or failure",
      body: [
        "Border conditions can change because of federal policy, migration patterns, cartel behavior, economic conditions, weather, enforcement capacity and state operations at the same time. A rise or fall in one federal encounter statistic is therefore not automatically proof that a single Texas program caused the change. Strong analysis distinguishes correlation from a documented operational effect and looks for evidence tied to the action being evaluated.",
        "KTR's permanent framework is to track mission, authority, spending, output and outcome separately. The current policy tracker can carry fast-moving litigation, deployments and appropriations; this evergreen guide explains how to judge those developments. That structure allows readers to support vigorous state action while still demanding evidence for claims about what the action achieved."
      ]
    }
  ],
  "texas-gun-laws": [
    {
      heading: "Eligibility comes before the carry rule",
      body: [
        "The first question in any carry analysis is whether the person may legally possess the firearm. Texas carry provisions do not erase federal or state prohibited-person rules, and a person who is disqualified from possession cannot rely on a general description of permitless carry. Age, criminal history, certain court orders and other legal circumstances can matter before location-specific carry rules are even reached.",
        "That is why KTR should avoid publishing a one-line answer such as 'any adult can carry in Texas.' The accurate method is sequential: determine possession eligibility, identify the firearm and manner of carry, identify the location, check any applicable notice or special rule, and then consider federal overlays. The result can change when any one of those facts changes."
      ]
    },
    {
      heading: "Permitless carry did not abolish the License to Carry",
      body: [
        "Texas retained its License to Carry program after HB 1927. A license can still be relevant to interstate reciprocity, identification of training, certain state-law exceptions and practical interactions with other jurisdictions. Permitless carry and licensed carry are therefore parallel legal pathways rather than a before-and-after system in which the license ceased to exist.",
        "For travelers, the distinction is especially important because another state does not have to mirror Texas law. A Texas resident who can lawfully carry without a license at home may face a different rule after crossing a state line. KTR should point readers to current official state resources rather than presenting Texas constitutional carry as a nationwide permission."
      ]
    },
    {
      heading: "Restricted places are a category, not one universal list",
      body: [
        "Texas Penal Code Chapter 46 contains location-based firearm offenses and exceptions, while other statutes can govern schools, courts, correctional settings, secured airport areas and additional places. Private-property notice rules can create another layer. The correct answer therefore depends on the exact type of premises and, in some situations, what activity is occurring there.",
        "Readers should be cautious with unofficial charts that compress every rule into a red or green icon. A courthouse office, school-sponsored activity, business serving alcohol, private workplace and outdoor public property do not necessarily operate under the same provision. KTR's role is to identify the statute and factual category, not to turn a complicated location rule into an overbroad slogan."
      ]
    },
    {
      heading: "Private property rights remain part of Texas firearm law",
      body: [
        "Strong protection for the right to keep and bear arms exists alongside the ability of private property owners to control access to their premises within the rules Texas law establishes. Posted notice, direct communication and the type of license or carry status can affect the legal analysis. A business policy and a criminal prohibition are related only when the statutory requirements make them so.",
        "That distinction helps both gun owners and property owners. A carrier needs to know whether notice has legal effect and what conduct would create an offense; an owner needs to know which notice mechanism applies to the policy being enforced. Reporting should identify the actual notice or statute instead of simply saying a location is 'gun free.'"
      ]
    },
    {
      heading: "State preemption limits a patchwork of local firearm rules",
      body: [
        "Texas has long treated firearm regulation as an area in which state law can restrict local governments from creating their own rules. The exact scope depends on the statute and the governmental action at issue, but the policy purpose is to avoid turning ordinary travel between Texas cities into a maze of inconsistent possession or carry requirements.",
        "Preemption does not mean local governments have no authority over every property, employment or event decision involving firearms. As with other state-local conflicts, KTR should identify the state provision that preempts the local action and any express exception. The broader federalism principle is useful context, but the controlling Texas statute decides the particular dispute."
      ]
    },
    {
      heading: "Federal rules can control even when Texas law is permissive",
      body: [
        "Federal firearm law governs prohibited persons, certain firearm categories, licensed dealers, interstate transfers and specified federal locations, among other subjects. Texas cannot convert conduct prohibited by valid federal law into lawful federal conduct simply by choosing not to impose the same state restriction. Likewise, a federal proposal does not become Texas law merely because it is discussed nationally.",
        "For readers following litigation or agency action, the key questions are which federal statute authorizes the rule, whether a court has limited or upheld it, and whether the case affects Texans immediately or only after further proceedings. Fast-changing federal litigation belongs in current reporting; this guide provides the stable state-law framework needed to understand it."
      ]
    },
    {
      heading: "Use the exact legal question when covering a firearm bill",
      body: [
        "Firearm legislation can change possession eligibility, carry locations, licensing, penalties, school rules, domestic-violence protections, dealer requirements, civil liability, local authority or enforcement procedure. Calling all of those proposals simply 'gun control' or 'gun rights' may describe the politics but does not explain the legal effect. Readers should be told what conduct changes and who is affected.",
        "KTR's conservative editorial focus can coexist with precise legal reporting: explain the right being asserted, quote the operative bill or statute, identify enforcement authority, and describe the practical burden or protection created by the text. That gives readers a stronger basis for judging whether a proposal protects lawful ownership or imposes an unjustified restriction."
      ]
    }
  ],
  "texas-property-tax-relief": [
    {
      heading: "The bill starts with an appraisal but ends with several taxing units",
      body: [
        "A homeowner typically sees one property account but can owe taxes to multiple local taxing units, such as a school district, city, county or special district. The appraisal district determines value for the property-tax system; the taxing units adopt their own rates under state law. That means the appraisal district does not decide how much revenue a city or school district chooses to raise, and a taxing unit does not independently set the market value printed on the appraisal record.",
        "This separation is the foundation for understanding a tax bill. When a homeowner challenges value, the dispute runs through appraisal procedures. When voters or taxpayers object to a rate or local budget, the issue belongs to the taxing unit's budget and rate-setting process. State law connects both sides through exemptions, rate limits, notice requirements, elections and school-finance rules, but it does not merge them into one agency."
      ]
    },
    {
      heading: "Market value, appraised value and taxable value should not be collapsed",
      body: [
        "Texas property-tax discussions commonly use the word value to describe several different numbers. Market value is an appraisal concept tied to the property's value under the Tax Code. Appraised value can be affected by statutory limitations that apply to qualifying property. Taxable value is calculated after applicable exemptions and other adjustments. A tax rate is then applied to the taxable value for each taxing unit.",
        "Those distinctions matter when lawmakers promise an appraisal cap or a larger homestead exemption. A cap changes how quickly a qualifying appraised value can move under the law; an exemption removes an amount from the value subject to a particular tax; a rate cut changes the multiplier. Two proposals with the same advertised statewide cost can therefore distribute relief differently among homeowners, renters, businesses and local governments."
      ]
    },
    {
      heading: "A homestead exemption is targeted relief, not a universal property-tax cut",
      body: [
        "Residence-homestead provisions are designed around an owner's qualifying principal residence. They can include mandatory state-law exemptions and additional protections for categories such as older or disabled homeowners and disabled veterans. Commercial property, rental property and second homes do not automatically receive the same treatment. That is why a headline increase in a homestead exemption should not be described as the same dollar benefit for every Texas property owner.",
        "The economic effects can extend beyond the household receiving the exemption. If state money replaces school-tax revenue, the fiscal effect differs from a local exemption that simply narrows a taxing unit's base. If a proposal changes only school district taxes, city and county portions of the bill remain. KTR should always identify the affected taxing units and the financing mechanism."
      ]
    },
    {
      heading: "Rate compression uses state policy to lower part of the local rate",
      body: [
        "School-tax compression generally refers to state action that reduces the maintenance-and-operations tax rate required from school districts while the state assumes more of the school-finance burden under the governing formulas. It is therefore different from ordering every local government to cut every property-tax rate. A homeowner can receive meaningful school-tax relief while still seeing separate city, county or special-district levies.",
        "For fiscal analysis, the central questions are how much state revenue is committed, whether the change is recurring, how school districts are held harmless or funded, and what happens when state revenue growth slows. A one-time surplus can finance a large short-term commitment, but permanent rate policy creates obligations that must fit future budgets as well."
      ]
    },
    {
      heading: "Truth-in-taxation rules focus attention on the levy, not only the nominal rate",
      body: [
        "When property values rise across a taxing unit, officials may be able to collect more revenue even with a lower nominal tax rate. Texas truth-in-taxation rules address that relationship through calculated rates, public notices and, in specified circumstances, voter-approval mechanisms. The details vary by taxing unit and statute, but the purpose is to make revenue growth more visible than a simple comparison of this year's rate with last year's rate.",
        "That is why a local official can accurately say the tax rate fell while a homeowner can accurately say the tax bill rose. Both statements can be true if taxable value increased enough. KTR should report the levy, taxable-value change and relevant calculated rate when evaluating whether a local budget represents tax relief or tax growth."
      ]
    },
    {
      heading: "The protest process is about value and exemptions, not changing the tax rate",
      body: [
        "Property owners can use the appraisal-review process to challenge matters that the Tax Code makes reviewable, including certain value and exemption determinations. An appraisal review board does not rewrite a city budget or choose a school district tax rate. Understanding that boundary helps taxpayers direct a complaint to the institution that can actually provide the requested remedy.",
        "For a value dispute, evidence can include information about the property, comparable sales or unequal appraisal depending on the claim and governing rules. For a policy dispute about local spending or rates, the relevant forums are the taxing unit's public process and elections authorized by law. A complete property-tax guide should help readers distinguish those two accountability channels."
      ]
    },
    {
      heading: "How to judge a statewide property-tax proposal",
      body: [
        "Every statewide relief package should be translated from its political label into mechanics. Does it raise a homestead exemption, compress a school rate, change an appraisal limitation, tighten a revenue-growth rule, buy down debt, alter a tax base or replace local collections with state revenue? The answer determines who benefits, which government bears the cost and whether the change affects current bills or only future growth.",
        "KTR should also separate gross state spending from household savings. A large appropriation can finance school formulas, replacement revenue or other components that do not map dollar-for-dollar to one homeowner's bill. The best test is the enacted constitutional amendment, Tax Code language, appropriations and Comptroller guidance, followed by the actual local rates and taxable values that determine the bill."
      ]
    }
  ],
  "texas-abortion-law-pro-life-policy": [
    {
      heading: "Texas abortion law is a stack of statutes, not one sentence",
      body: [
        "Chapter 170A is a central part of Texas abortion law after Dobbs, but it does not exist in isolation. Chapter 171 and other provisions can address definitions, procedures, reporting, funding, civil remedies or conduct adjacent to abortion. Federal law and controlling court decisions can also affect a particular dispute. A reliable explanation therefore identifies the exact provision that governs the conduct being discussed rather than treating every abortion-related rule as part of one undifferentiated ban.",
        "This approach is especially important when legislation changes. A bill may amend only one definition, create a physician protection, change a reporting rule or address abortion-inducing drugs without rewriting the full legal framework. KTR should state the narrow legal effect of the enacted text and update this guide only when the durable framework itself changes."
      ]
    },
    {
      heading: "The physician exception should be analyzed from the statutory elements",
      body: [
        "The medical exception in Chapter 170A is built around statutory elements, including the physician's reasonable medical judgment and a qualifying life-threatening physical condition that creates the specified risk to the pregnant patient. Whether the exception applies to a real clinical situation depends on facts and medical judgment; an evergreen explainer cannot responsibly decide an individual case from a headline or hypothetical stripped of medical detail.",
        "For policy reporting, the useful questions are whether lawmakers changed an element, whether an agency issued relevant guidance, whether a court interpreted the language, and whether physicians received a new statutory protection or procedure. Those are verifiable legal developments. Broader claims that Texas law either contains no exception or permits abortion whenever a doctor prefers should be checked against the actual operative text."
      ]
    },
    {
      heading: "Criminal, civil and licensing consequences should be kept separate",
      body: [
        "Texas can attach different consequences to different abortion-related provisions. Criminal liability, civil remedies, professional discipline, licensing consequences and funding restrictions arise through different legal mechanisms with different standards and decision-makers. A court case about one mechanism does not automatically invalidate or interpret every other provision in the state's abortion framework.",
        "That distinction is crucial for accurate reporting. A prosecutor, private civil plaintiff, licensing board and state health agency do not exercise the same authority. KTR should identify who could enforce the provision, what conduct triggers it and what remedy or penalty the law authorizes. Readers can then evaluate the policy without being misled by a generic statement that 'Texas can prosecute' or 'the law was blocked.'"
      ]
    },
    {
      heading: "Pro-life policy extends beyond the criminal prohibition",
      body: [
        "A conservative pro-life agenda can include pregnancy-support programs, maternal-health initiatives, adoption and foster-care policy, child-support enforcement, family tax policy and assistance intended to make carrying a pregnancy and raising a child more feasible. Those programs should be evaluated on their own statutory authority, appropriations, eligibility rules and measured results rather than treated as rhetorical substitutes for the abortion prohibition itself.",
        "The same standard applies to criticism. Spending labeled pro-life does not prove that a program is effective, and a disagreement over one support program does not determine whether the underlying abortion statute is constitutional or well designed. KTR should track outcomes and fiscal accountability while maintaining a clear editorial distinction between protecting unborn life and judging the performance of programs created in support of that goal."
      ]
    },
    {
      heading: "Abortion-inducing drugs create overlapping state and federal questions",
      body: [
        "Medication-abortion disputes can involve state abortion statutes, prescribing rules, pharmacy or mailing questions, federal drug regulation and litigation over the relationship between those systems. A federal agency's approval of a drug does not by itself answer every state-law question about when an abortion may lawfully be performed, while a state restriction does not give Texas authority to rewrite the federal drug-approval process.",
        "Because this area changes through litigation and agency action, the permanent guide should explain the jurisdictional layers and leave case-specific status to current coverage. When KTR reports a new rule or lawsuit, it should name the regulating body, the legal claim, the court and the stage of litigation rather than imply that filing a case immediately changes the law statewide."
      ]
    },
    {
      heading: "Interstate disputes require an actual jurisdictional hook",
      body: [
        "Questions about travel, out-of-state providers, telemedicine, medication shipment and assistance across state lines can raise difficult conflicts-of-law and constitutional issues. Texas law governs conduct within its lawful reach, but the practical result of an interstate dispute can depend on where conduct occurred, what remedy is sought, which court has jurisdiction and how another state's law treats the same activity.",
        "Political proposals in this area should not be reported as settled law before enactment and judicial review. The durable rule for KTR is to separate a filed bill from an enacted statute, an enacted statute from an injunction, and a trial-court ruling from a final controlling appellate decision. That chronology is more informative than a sweeping claim that one state has simply defeated another."
      ]
    },
    {
      heading: "How to read new Texas abortion legislation",
      body: [
        "A new abortion bill should be evaluated by comparing its enrolled text with the current code section it amends. Readers need to know the affected conduct, definitions, exceptions, enforcement mechanism, effective date and any transition rule. Bill captions and campaign statements can help explain political intent, but they are not substitutes for the operative language that courts and regulated parties must follow.",
        "This source-first method also makes policy disagreements clearer. Supporters can argue that a change better protects unborn life or gives doctors clearer standards; opponents can challenge its scope or constitutional effect. KTR's job is to establish the legal baseline first, then explain those competing claims without allowing either side's shorthand to overwrite the enacted text."
      ]
    }
  ]
};

export function applyPriorityIssueGuideUpgrade(guide: IssueGuide): IssueGuide {
  const additions = PRIORITY_EXTRA_SECTIONS[guide.slug];
  if (!additions) return guide;
  return { ...guide, sections: [...guide.sections, ...additions] };
}

export const PRIORITY_ISSUE_GUIDE_SLUGS = Object.freeze(Object.keys(PRIORITY_EXTRA_SECTIONS));
