import { getTexasCasePosition } from "./texas-case-all";

export type TexasCaseFacts = {
  slug: string;
  title: string;
  dek: string;
  reviewed: string;
  overview: string[];
  framework: string[];
  keyQuestions: string[];
};

const FACTS: TexasCaseFacts[] = [
  {
    slug: "protect-unborn-life",
    title: "Abortion Law in Texas: Facts, Framework, and Key Questions",
    dek: "A factual companion to KTR's editorial position, covering the legal framework, medical-policy questions, state programs, and primary sources readers should check.",
    reviewed: "2026-08-18",
    overview: [
      "Texas abortion policy is governed by state statutes, court decisions, medical practice standards, and state health programs. The legal rules and their interpretation can change through legislation, litigation, and agency guidance.",
      "A useful factual review separates at least four questions: what conduct state law prohibits, what exceptions or emergency standards apply, how courts interpret those rules, and what public programs exist for pregnancy, maternal health, children, adoption, and family support.",
    ],
    framework: [
      "Start with the current Texas Health & Safety Code rather than a news summary.",
      "Distinguish elective abortion rules from emergency medical treatment and other pregnancy care.",
      "Track court rulings and official guidance when statutory language is disputed.",
      "Evaluate state support programs separately from the criminal or regulatory rules governing abortion.",
    ],
    keyQuestions: [
      "What does current Texas law prohibit, and what exceptions are written into statute?",
      "How are medical-emergency standards being interpreted by courts and regulators?",
      "What pregnancy, maternal-health, adoption, and family-support programs are actually available and funded?",
    ],
  },
  {
    slug: "gun-rights-over-gun-control",
    title: "Texas Gun Law: Rights, Restrictions, and the Policy Framework",
    dek: "A neutral guide to the constitutional, state-law, and public-safety framework behind Texas gun-rights and gun-control debates.",
    reviewed: "2026-08-18",
    overview: [
      "Texas firearm policy sits at the intersection of the Second Amendment, federal firearms law, the Texas Constitution, the Texas Penal Code, and state licensing and enforcement rules.",
      "Policy disputes often involve who may possess firearms, where firearms may be carried, what conduct is criminal, how prohibited-person rules are enforced, and what due-process protections apply when government restricts an individual's firearm rights.",
    ],
    framework: [
      "Separate constitutional doctrine from ordinary statutory restrictions.",
      "Distinguish possession rules, carry rules, prohibited locations, and criminal misuse.",
      "Check both federal and Texas law because either can control a specific situation.",
      "Treat enforcement, prosecution, and due process as separate questions from whether a new restriction is proposed.",
    ],
    keyQuestions: [
      "Which restrictions are imposed by Texas law and which come from federal law?",
      "How do current rules distinguish lawful owners from prohibited persons and criminal misuse?",
      "What evidence is offered for the likely effect of a proposed restriction or enforcement change?",
    ],
  },
  {
    slug: "eliminate-property-taxes",
    title: "Texas Property Taxes: How the System Works and What Elimination Would Require",
    dek: "A factual guide to appraisal, local tax rates, school finance, state relief programs, and the fiscal questions behind proposals to eliminate property taxes.",
    reviewed: "2026-08-18",
    overview: [
      "Texas does not have a single statewide property-tax bill. Local taxing units levy property taxes, while state law governs appraisal, exemptions, rate-setting procedures, school-finance rules, and many limits on local taxation.",
      "Any proposal to eliminate property taxes must answer both sides of the ledger: which local revenue disappears and which spending cuts, replacement revenues, state transfers, or structural reforms would replace it.",
    ],
    framework: [
      "Separate appraised value from the tax rate and from the final tax levy.",
      "Identify which local entities appear on a taxpayer's bill and what each funds.",
      "Track homestead exemptions, school-tax compression, rate limits, and other relief separately.",
      "Require elimination proposals to show replacement revenue, spending changes, transition rules, and local-government effects.",
    ],
    keyQuestions: [
      "How much revenue currently comes from each class of local property tax?",
      "Which public services or school-finance obligations would need replacement funding?",
      "Would a replacement plan reduce the total tax burden or mainly shift it to another tax base?",
    ],
  },
  {
    slug: "lower-taxes-limited-government",
    title: "Texas Taxes and Limited Government: Revenue, Spending, and Tradeoffs",
    dek: "A factual companion on how Texas raises money, where it spends it, and what policymakers must measure when debating lower taxes or a smaller government footprint.",
    reviewed: "2026-08-18",
    overview: [
      "Texas government is financed through a mix of state taxes, fees, federal funds, dedicated revenue, and local taxes. Debates over lower taxes cannot be evaluated without looking at both revenue sources and spending commitments.",
      "A tax cut can be permanent, temporary, broad, targeted, or offset by another levy. Likewise, spending restraint can come from slower growth, program elimination, efficiency gains, or shifting responsibility to another level of government.",
    ],
    framework: [
      "Compare tax changes with the spending baseline they are meant to support.",
      "Distinguish one-time surpluses from recurring revenue.",
      "Identify whether a policy cuts taxes, delays them, or shifts them elsewhere.",
      "Track state and local burdens separately because Texans pay both.",
    ],
    keyQuestions: [
      "Is a proposed tax reduction recurring or funded by temporary revenue?",
      "What spending or revenue change makes the tax reduction sustainable?",
      "Does the policy reduce the total burden or move it among taxpayers and jurisdictions?",
    ],
  },
  {
    slug: "parental-rights-school-choice",
    title: "Parental Rights and School Choice in Texas: Laws, Funding, and Options",
    dek: "A factual guide to the state, district, parental-rights, school-funding, and school-choice framework behind Texas education debates.",
    reviewed: "2026-08-18",
    overview: [
      "Texas education policy is governed by the Education Code, state funding formulas, Texas Education Agency rules, local district policies, federal requirements, and court decisions.",
      "Parental-rights and school-choice debates cover several distinct issues: access to records, curriculum and instructional decisions, transfers, charter schools, private-school options, home education, special education, and how public dollars follow or do not follow students.",
    ],
    framework: [
      "Distinguish rights created by statute from district policies and informal practices.",
      "Separate public-school choice, charter policy, private-school programs, and home education.",
      "Track funding effects on both participating students and school districts.",
      "Check eligibility, accountability, and special-education rules for each program separately.",
    ],
    keyQuestions: [
      "Which parental rights are explicitly guaranteed by current Texas law?",
      "What school-choice options currently exist and who is eligible?",
      "How does a proposed program change state spending and district funding?",
    ],
  },
  {
    slug: "secure-texas-border",
    title: "Texas Border Policy: State Powers, Federal Authority, and Enforcement",
    dek: "A factual guide to the division of state and federal authority, Texas border operations, immigration enforcement, litigation, and public-safety policy.",
    reviewed: "2026-08-18",
    overview: [
      "Immigration law is principally federal, while Texas has broad responsibilities for state criminal law, public safety, emergency response, land, infrastructure, and state spending. Many border disputes arise where those authorities overlap.",
      "Texas border policy should be evaluated through statutes, appropriations, operational data, federal law, and court rulings rather than by treating every state action as immigration law or every federal dispute as a purely political disagreement.",
    ],
    framework: [
      "Separate immigration status and removal authority from state criminal enforcement.",
      "Track state border spending and operational programs independently from federal enforcement statistics.",
      "Follow litigation when courts define the boundary between state and federal authority.",
      "Use official incident, arrest, seizure, and expenditure records where available.",
    ],
    keyQuestions: [
      "Which specific powers belong to the federal government and which remain with Texas?",
      "What measurable outcomes are associated with state-funded border operations?",
      "Which state policies are currently limited, upheld, or unresolved in court?",
    ],
  },
  {
    slug: "reliable-affordable-energy",
    title: "Texas Energy and Grid Reliability: Who Regulates What and What to Measure",
    dek: "A factual guide to ERCOT, the PUC, the Railroad Commission, generation, transmission, fuel supply, reliability, and consumer-cost questions.",
    reviewed: "2026-08-18",
    overview: [
      "Texas energy policy spans several institutions. ERCOT operates much of the grid, the Public Utility Commission regulates key electricity-market functions, and the Railroad Commission regulates major parts of the oil and gas system.",
      "Reliability debates should distinguish installed generation, dependable capacity, transmission constraints, fuel availability, reserves, extreme-weather performance, wholesale-market design, and the retail prices consumers ultimately pay.",
    ],
    framework: [
      "Do not equate nameplate generation capacity with dependable output during system stress.",
      "Separate electricity-market rules from oil-and-gas production regulation.",
      "Track transmission and demand growth alongside new generation.",
      "Compare reliability benefits and total system costs rather than a single technology metric.",
    ],
    keyQuestions: [
      "What resource or infrastructure constraint is actually causing a reliability concern?",
      "Who has regulatory authority to address it?",
      "How will a proposed change affect both reliability and consumer cost?",
    ],
  },
  {
    slug: "law-order-public-safety",
    title: "Texas Criminal Justice: Bail, Prosecution, Public Safety, and Due Process",
    dek: "A factual guide to the institutions and legal questions behind Texas crime, bail, prosecution, policing, and repeat-offender debates.",
    reviewed: "2026-08-18",
    overview: [
      "Texas criminal-justice policy involves state statutes, local prosecutors, judges, sheriffs and police, state agencies, county jails, state prisons, and appellate courts. Outcomes can differ substantially by offense type and jurisdiction.",
      "Public-safety debates should distinguish pretrial release, conviction and sentencing, probation or parole, repeat offending, police practices, and the treatment of victims rather than treating all criminal-justice policy as one issue.",
    ],
    framework: [
      "Keep the presumption of innocence separate from post-conviction punishment.",
      "Evaluate bail rules by legal standards, risk, appearance in court, and public safety.",
      "Distinguish violent, property, drug, and low-level offenses when using recidivism data.",
      "Separate police misconduct questions from the broader effectiveness of lawful policing.",
    ],
    keyQuestions: [
      "What legal standard controls the decision being debated?",
      "What outcome data exist for release, recidivism, prosecution, or sentencing?",
      "Are policy changes affecting low-risk defendants and violent repeat offenders in the same way?",
    ],
  },
  {
    slug: "election-integrity",
    title: "Texas Election Administration: Registration, Voting, Counting, and Audits",
    dek: "A factual guide to voter eligibility, identification, mail voting, ballot handling, observation, counting, reconciliation, and election audits in Texas.",
    reviewed: "2026-08-18",
    overview: [
      "Texas elections are governed primarily by the Election Code and administered through the Secretary of State and local election officials. Rules cover registration, voter identification, early voting, mail ballots, equipment, poll watchers, counting, canvassing, recounts, and contests.",
      "Election-integrity analysis should separate a verified procedural error, an allegation of fraud, a legal dispute over a rule, and evidence that could actually change an outcome. Those are not interchangeable claims.",
    ],
    framework: [
      "Start with the Election Code and Secretary of State procedures.",
      "Distinguish registration eligibility from ballot-casting procedures.",
      "Track chain-of-custody, reconciliation, canvass, recount, and audit rules separately.",
      "Require evidence before describing an irregularity as fraud or an election as invalid.",
    ],
    keyQuestions: [
      "What exact rule or safeguard applies to the disputed step?",
      "Is the claim supported by official records, sworn evidence, or only anecdote?",
      "What remedy does Texas law provide when an election procedure is violated?",
    ],
  },
  {
    slug: "religious-liberty",
    title: "Religious Liberty in Texas: Constitutional Protections and Legal Limits",
    dek: "A factual guide to federal and Texas protections for religious exercise, government neutrality, and the legal framework for conflicts involving conscience and public law.",
    reviewed: "2026-08-18",
    overview: [
      "Religious-liberty disputes can involve the First Amendment, the Texas Constitution, state statutory protections, federal statutes, and court decisions. Different legal tests can apply depending on whether government targets religion, applies a neutral rule, conditions a public benefit, or compels conduct.",
      "A factual analysis should distinguish belief, worship, speech, institutional autonomy, and conduct because the law does not treat every religious-liberty claim identically.",
    ],
    framework: [
      "Identify whether the challenged action comes from government or a private party.",
      "Determine which constitutional or statutory protection applies before evaluating the burden.",
      "Separate government neutrality from government endorsement of religion.",
      "When rights conflict, track the exact legal standard courts use rather than relying on slogans.",
    ],
    keyQuestions: [
      "What government action is alleged to burden religious exercise?",
      "Which federal or Texas protection governs the claim?",
      "What competing legal rights or public interests must the court consider?",
    ],
  },
  {
    slug: "free-speech",
    title: "Free Speech in Texas: Government Limits, Public Institutions, and Protected Expression",
    dek: "A factual guide to the First Amendment, the Texas Constitution, compelled speech, public institutions, and the difference between protected expression and unlawful conduct.",
    reviewed: "2026-08-18",
    overview: [
      "The First Amendment generally restricts government rather than private criticism or ordinary private consequences. Texas also has its own constitutional free-speech protection.",
      "Speech cases often turn on forum, government role, viewpoint discrimination, compelled speech, employee status, school context, or whether conduct falls into a legally unprotected category.",
    ],
    framework: [
      "First ask whether the actor restricting speech is the government.",
      "Distinguish viewpoint discrimination from neutral time, place, and manner rules.",
      "Separate offensive speech from threats, fraud, defamation, or other legally distinct conduct.",
      "Check whether government is compelling a person to affirm or carry a message.",
    ],
    keyQuestions: [
      "Is the challenged restriction governmental or private?",
      "What forum and legal standard apply?",
      "Is the rule based on conduct, content, or viewpoint?",
    ],
  },
  {
    slug: "property-rights",
    title: "Property Rights in Texas: Eminent Domain, Regulation, and Compensation",
    dek: "A factual guide to Texas constitutional property protections, eminent-domain procedure, compensation, and regulatory burdens on landowners.",
    reviewed: "2026-08-18",
    overview: [
      "Texas property-rights law includes constitutional protections, statutory eminent-domain procedure, public-use requirements, compensation rules, and specific powers granted to governmental and certain private entities.",
      "Property disputes should distinguish an actual taking of title or easement from regulation that limits use, because the procedure and legal test can differ substantially.",
    ],
    framework: [
      "Identify the entity claiming condemnation authority and the statute granting it.",
      "Define the public use or project for which property is sought.",
      "Separate valuation and compensation disputes from disputes over authority to take.",
      "For regulation, identify the burden on use or value and the legal remedy available.",
    ],
    keyQuestions: [
      "Who has the legal power to take or burden the property?",
      "What public use or statutory authority is being asserted?",
      "How are compensation, alternatives, and appeal rights handled?",
    ],
  },
  {
    slug: "federalism-state-sovereignty",
    title: "Texas and Federal Power: Federalism, Preemption, and State Authority",
    dek: "A factual guide to the Tenth Amendment, federal supremacy, preemption, state police powers, and the legal channels used when Texas challenges federal action.",
    reviewed: "2026-08-18",
    overview: [
      "Federalism divides authority between the federal government and the states. The federal government has constitutionally granted powers, states retain substantial authority, and valid federal law can preempt conflicting state law.",
      "Texas-federal disputes often turn not on whether one side dislikes the other's policy but on statutory authority, constitutional power, administrative procedure, preemption, and the remedy a court is allowed to order.",
    ],
    framework: [
      "Identify the federal constitutional or statutory power being invoked.",
      "Identify the Texas authority or police power claimed on the other side.",
      "Check whether Congress expressly or implicitly preempted state law.",
      "Track court orders and appeals because the enforceable rule may change during litigation.",
    ],
    keyQuestions: [
      "Which level of government has authority over the specific subject?",
      "Is the conflict about constitutional power, statutory interpretation, or administrative procedure?",
      "Has a court entered a binding order that changes what either government may do?",
    ],
  },
  {
    slug: "less-regulation-small-business",
    title: "Texas Regulation and Small Business: Rulemaking, Licensing, and Compliance Costs",
    dek: "A factual guide to agency rulemaking, administrative procedure, small-business impact analysis, licensing, permits, and regulatory review in Texas.",
    reviewed: "2026-08-18",
    overview: [
      "Texas agencies generally create rules under authority delegated by statute and through administrative procedures that include publication, notice, and opportunities for public participation.",
      "Regulatory analysis should separate the underlying statutory mandate from the agency rule used to implement it, and should examine compliance costs, enforcement mechanisms, affected businesses, and available judicial or administrative review.",
    ],
    framework: [
      "Find the statute that authorizes the agency to regulate the subject.",
      "Read the proposed or adopted rule rather than relying only on an agency summary.",
      "Check required fiscal, local-government, and small-business impact statements where applicable.",
      "Distinguish occupational licensing, permits, reporting duties, safety standards, and outright prohibitions.",
    ],
    keyQuestions: [
      "What problem is the regulation intended to address?",
      "What statutory authority supports the rule?",
      "What measurable costs, benefits, and barriers to entry are identified?",
    ],
  },
  {
    slug: "spending-restraint",
    title: "Texas State Spending: Budget, Appropriations, Actual Expenditures, and Oversight",
    dek: "A factual guide to the Texas budget process, appropriations, Comptroller data, Legislative Budget Board analysis, and the difference between authorized and actual spending.",
    reviewed: "2026-08-18",
    overview: [
      "Texas budgeting involves revenue estimates, appropriations, dedicated funds, federal money, agency requests, legislative decisions, and actual expenditures that can differ from headline appropriation totals.",
      "Evaluating spending requires more than asking whether the budget is balanced. A program can be legally funded and still raise questions about outcomes, duplication, procurement, long-term obligations, or whether temporary revenue supports recurring commitments.",
    ],
    framework: [
      "Distinguish appropriated amounts from actual expenditures.",
      "Separate recurring spending from one-time capital or emergency spending.",
      "Track federal funds and dedicated revenues rather than treating all dollars as interchangeable.",
      "Pair spending totals with measurable program outputs and outcomes where available.",
    ],
    keyQuestions: [
      "How much was appropriated, how much was actually spent, and from which fund source?",
      "What outcome or service is the spending intended to produce?",
      "Is a new commitment supported by recurring revenue or temporary money?",
    ],
  },
  {
    slug: "merit-equal-treatment-over-dei",
    title: "DEI, Equal Treatment, and Texas Public Institutions: What the Law Covers",
    dek: "A factual guide to Texas public-higher-education restrictions, federal equal-protection rules, anti-discrimination law, and the difference between outreach, preferences, and compelled ideology.",
    reviewed: "2026-08-18",
    overview: [
      "Texas has enacted statutory restrictions affecting DEI offices and practices in public higher education, while public institutions also remain subject to federal and state anti-discrimination requirements and constitutional equal-protection rules.",
      "These debates often mix several different practices: demographic outreach, race- or sex-based preferences, mandatory training, diversity statements, anti-discrimination enforcement, academic programs, and collection of demographic data. They should be analyzed separately.",
    ],
    framework: [
      "Identify whether the institution is public or private and which law applies.",
      "Distinguish equal-opportunity outreach from a preference or quota.",
      "Separate anti-discrimination compliance from compelled political or ideological statements.",
      "Track current Texas statutory requirements and federal constitutional rules independently.",
    ],
    keyQuestions: [
      "What specific program or practice is being challenged?",
      "Does it classify individuals by race, sex, or another protected characteristic?",
      "Is the policy required by law, prohibited by law, or left to institutional discretion?",
    ],
  },
  {
    slug: "judicial-restraint",
    title: "Texas Courts and Judicial Review: Structure, Interpretation, and Limits",
    dek: "A factual guide to Texas court structure, constitutional review, statutory interpretation, precedent, and the institutional difference between courts and legislatures.",
    reviewed: "2026-08-18",
    overview: [
      "Texas has a multi-level court system with separate highest courts for civil and criminal matters. Courts interpret statutes, apply constitutions, resolve disputes, and can invalidate government action when higher law requires it.",
      "Debates over judicial restraint are interpretive debates. Factual analysis should identify the text being interpreted, controlling precedent, the procedural posture of the case, and the remedy the court actually ordered before assigning an ideological label to a ruling.",
    ],
    framework: [
      "Identify the court, jurisdiction, and procedural stage of the case.",
      "Read the controlling constitutional or statutory text.",
      "Separate the court's legal holding from dicta and policy commentary.",
      "Track dissents, precedent, appeals, and later legislative responses where relevant.",
    ],
    keyQuestions: [
      "What law or constitutional provision is the court interpreting?",
      "What precedent binds the court?",
      "What exactly did the judgment change, prohibit, require, or leave unresolved?",
    ],
  },
  {
    slug: "work-self-reliance-safety-net",
    title: "Texas Safety-Net Programs: Eligibility, Work, Benefit Cliffs, and Outcomes",
    dek: "A factual guide to the roles of Texas Health and Human Services, the Texas Workforce Commission, eligibility rules, work-related requirements, and program outcomes.",
    reviewed: "2026-08-18",
    overview: [
      "Texas safety-net programs span health, nutrition, disability, family assistance, unemployment, workforce services, and other supports administered by different agencies and often governed partly by federal law.",
      "Policy debates should distinguish people with long-term disabilities or caregiving responsibilities from able-bodied adults expected to work, and should measure both access for eligible people and whether program design creates sharp benefit cliffs or administrative churn.",
    ],
    framework: [
      "Identify the program, administering agency, funding source, and federal or state rules that control eligibility.",
      "Separate cash assistance, health coverage, nutrition support, unemployment, and workforce programs.",
      "Measure both enrollment accuracy and outcomes such as work, earnings, stability, and reduced need where realistic.",
      "Check whether benefit phaseouts create abrupt cliffs when earnings rise.",
    ],
    keyQuestions: [
      "Who is eligible and what rules are federal versus Texas-specific?",
      "What work, training, reporting, or exemption rules apply?",
      "What evidence shows whether participants become more stable or self-sufficient over time?",
    ],
  },
];

export const TEXAS_CASE_FACTS = FACTS.filter((facts) => Boolean(getTexasCasePosition(facts.slug)));

export function getTexasCaseFacts(slug: string): TexasCaseFacts | undefined {
  return TEXAS_CASE_FACTS.find((facts) => facts.slug === slug);
}
