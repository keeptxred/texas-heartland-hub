import type { GovernmentEntity, GovernmentFaq } from "@/lib/texas-government";

type GovernmentEntityWave2Expansion = {
  overview: string;
  responsibilities: string;
  history: string[];
  powers: string[];
  limitations: string[];
  faqs: GovernmentFaq[];
};

const WAVE2_EXPANSIONS: Record<string, GovernmentEntityWave2Expansion> = {
  "agriculture-commissioner": {
    overview: " The office combines elected statewide leadership with administration of a department whose work reaches farms, food programs, rural communities and ordinary commercial transactions. That makes it important to separate the commissioner's policy and management role from the many functions carried out under detailed state statutes, federal program requirements and technical rules.",
    responsibilities: " The Department of Agriculture administers programs that range from weights-and-measures enforcement and pesticide regulation to school nutrition, agricultural marketing and rural development. Some programs are primarily state-created, while others operate through federal-state agreements that set eligibility, spending or compliance requirements. The commissioner directs the department within those legal boundaries rather than possessing a general power over every agricultural or food-related activity in Texas.",
    history: [
      "The department's responsibilities broadened as Texas agriculture became more technologically complex and as state government assumed consumer-protection and nutrition-program duties beyond traditional farm promotion. Modern accountability therefore includes not only crop and livestock issues but also measurement accuracy at fuel pumps and retail devices, pesticide licensing and enforcement, federal nutrition funds and economic-development programs.",
      "Texas agriculture is regulated by multiple institutions. Animal-health issues can involve the Texas Animal Health Commission, environmental impacts can involve TCEQ, water questions can involve local districts or state water agencies, and federal law can govern pesticides, food programs and interstate commerce. The Agriculture Department's role should be evaluated within that divided framework rather than treated as exclusive jurisdiction over the agricultural economy."
    ],
    powers: [
      "Inspect and enforce weights-and-measures requirements for regulated commercial devices and transactions, using registration, inspection and administrative enforcement tools authorized by statute. These programs are consumer-protection functions as well as agricultural responsibilities because inaccurate measurements can affect fuel, retail and commodity transactions.",
      "Administer pesticide licensing and compliance responsibilities assigned to the department, including education, registration or enforcement functions established by state law and applicable federal requirements. The department's role does not eliminate federal environmental law or the jurisdiction of other Texas agencies over water, air or waste issues.",
      "Administer state and federally supported nutrition programs assigned to the department, including program oversight and distribution responsibilities subject to federal eligibility, procurement and reimbursement rules."
    ],
    limitations: [
      "The commissioner cannot waive federal conditions attached to nutrition, pesticide or other cooperative programs. When Texas accepts and administers federal program funds, the department must operate within the governing federal and state legal framework.",
      "The department does not control local land use, private commodity prices or every animal, environmental and water regulation affecting agriculture. Those issues may fall to other state, federal or local authorities."
    ],
    faqs: [
      { question: "Does the Texas Agriculture Commissioner regulate every farming issue in the state?", answer: "No. The commissioner leads the Texas Department of Agriculture, but authority is divided among several state and federal agencies. The department has important responsibilities for agricultural programs, weights and measures, pesticides, nutrition and rural development, while animal health, environmental regulation, water, food safety and federal programs can involve other authorities." },
      { question: "Why does the Agriculture Department inspect weights and measures?", answer: "Texas law assigns the department consumer-protection responsibilities for regulated commercial measuring devices and transactions. Accurate scales, meters and similar devices affect both agricultural commerce and everyday retail purchases, so enforcement is part of the department's statutory mission." },
      { question: "Does the commissioner control school nutrition rules alone?", answer: "No. Programs administered by the department can be governed by both Texas law and federal program requirements. The department manages the programs assigned to it, but eligibility, reimbursement, procurement and nutrition standards may be constrained by federal statutes, regulations and funding conditions." }
    ]
  },
  "land-commissioner": {
    overview: " The General Land Office is unusual because it is simultaneously a land-management agency, a mineral-revenue institution, a coastal agency, a historical-records custodian and an administrator of veterans and disaster-recovery programs. The land commissioner therefore exercises several distinct statutory roles rather than one general power over all land in Texas.",
    responsibilities: " Much of the office's land and mineral work is tied to assets held for public purposes, including school-related trust lands and mineral interests. Revenue generated from those assets follows constitutional and statutory rules and should not be confused with ordinary state tax revenue. The office also performs coastal-management, oil-spill response, veterans-program and disaster-recovery duties under separate legal authorities, some of which involve substantial federal coordination.",
    history: [
      "The General Land Office began as the Republic's central repository for surveys, grants and land records, making documentary stewardship one of its oldest functions. Those records remain important for title research, boundary history and the administration of state interests even as the agency's mission has expanded far beyond nineteenth-century land grants.",
      "Mineral leasing transformed the economic significance of state lands during the oil era. The office now manages leasing and other transactions intended to produce value from qualifying state assets while complying with trust obligations, competitive procedures and statutory restrictions. That fiduciary dimension is central to evaluating whether land decisions serve the beneficiaries designated by law.",
      "The agency's modern disaster-recovery role developed through assignments involving federal housing and community-development funds after major storms. In that setting, the land commissioner is administering programs within federal grant requirements and state implementation choices, not exercising unlimited authority over local rebuilding."
    ],
    powers: [
      "Lease and manage qualifying state land and mineral interests under statutory procedures, including transactions that generate revenue for constitutionally or statutorily designated public purposes. The commissioner must follow the legal duties attached to the asset rather than treating the property as unrestricted executive inventory.",
      "Administer coastal-management and oil-spill prevention or response responsibilities assigned by state law, coordinating where necessary with federal agencies, local governments and other Texas agencies that retain their own environmental or emergency authority.",
      "Administer Veterans Land Board programs and assigned disaster-recovery grants, including program rules, contracting and compliance functions within the state and federal requirements applicable to each funding stream."
    ],
    limitations: [
      "The commissioner does not control all public land in Texas. Federal lands, local-government property, university lands and assets assigned to other state entities remain under their respective legal regimes.",
      "Revenue generated from trust lands or mineral interests cannot simply be spent at the commissioner's discretion. Constitutional and statutory provisions determine beneficiaries, transfers, investment structures and appropriations authority.",
      "Disaster-recovery administration is constrained by federal grant requirements, legislative appropriations and local implementation responsibilities; the General Land Office cannot unilaterally waive those outside requirements."
    ],
    faqs: [
      { question: "Does the Texas Land Commissioner own or control all public land in Texas?", answer: "No. The General Land Office manages specific state lands, mineral interests and programs assigned by law. Federal agencies, universities, local governments and other state entities control other public property under different legal authorities." },
      { question: "Where does money from state land and mineral leasing go?", answer: "The destination depends on the legal character of the asset and the constitutional or statutory trust involved. Significant land and mineral revenues support public-education purposes, but the commissioner does not have unrestricted discretion to spend those proceeds." },
      { question: "Why is the General Land Office involved in hurricane recovery?", answer: "Texas has assigned the agency administration of certain disaster-recovery programs, including programs supported by federal housing and community-development funds. The agency implements those grants under federal requirements and state decisions while local governments and other agencies retain separate recovery responsibilities." }
    ]
  },
  "railroad-commission": {
    overview: " Despite its historical name, the Railroad Commission is now primarily an energy and natural-resources regulator. Its decisions can affect drilling, production, pipelines, natural-gas utility service, well plugging, surface mining and alternative-fuel safety, making the commission a central source of records for Texas oil-and-gas accountability.",
    responsibilities: " The commission issues permits, maintains production and well records, conducts inspections, adopts rules within delegated authority and can pursue administrative enforcement. Different programs rely on different statutes and, in some cases, federal delegation. Evaluating the commission therefore requires distinguishing a permit decision from an inspection, an enforcement order, a utility-rate proceeding or a state-funded plugging project.",
    history: [
      "The commission's twentieth-century oil regulation gave it national importance because Texas production represented a large share of U.S. output. Production-allocation systems and conservation rules shaped the commission's historical reputation even though modern markets and federal institutions now operate very differently.",
      "As railroad duties migrated elsewhere, the agency retained its historic name while energy and resource responsibilities expanded. That mismatch is more than trivia: readers who assume the commission still controls rail service can misidentify responsibility that now rests with transportation agencies or federal regulators.",
      "Orphan and abandoned wells have become a major modern accountability issue. The commission identifies eligible wells, oversees operator financial-assurance requirements and administers state plugging activity under legislative funding and statutory priorities, while responsible operators remain liable where the law allows."
    ],
    powers: [
      "Issue and enforce oil-and-gas drilling and operating requirements, maintain well and production records, and use inspections or administrative enforcement when operators violate applicable commission rules or statutes.",
      "Regulate intrastate pipeline safety and certain natural-gas utility matters within assigned jurisdiction. Interstate pipelines and other facilities may instead fall partly or primarily under federal authority, so jurisdiction depends on the facility and activity involved.",
      "Administer plugging and remediation programs for qualifying orphaned wells and sites, using appropriated funds and statutory cost-recovery or enforcement tools where available.",
      "Regulate surface coal and uranium mining and alternative-fuel safety programs assigned by statute, separate from the environmental programs administered by TCEQ."
    ],
    limitations: [
      "The commission no longer regulates railroads, and it does not regulate the competitive retail electric market. Transportation, electric-utility and environmental responsibilities are divided among TxDOT, PUCT, ERCOT, TCEQ and federal agencies.",
      "A commission permit does not eliminate other permits or private rights that may apply. Operators can still need environmental approvals, landowner agreements, local authorizations or federal permissions depending on the project.",
      "The commission cannot guarantee commodity prices or prevent every well failure, spill or pipeline incident. Its accountability is measured through the rules it adopts, permits it issues, inspections it performs and enforcement or remediation actions it takes within legal authority."
    ],
    faqs: [
      { question: "Why is it still called the Railroad Commission if it does not regulate railroads?", answer: "The name is historical. The commission was created in the nineteenth century for railroad regulation, but those duties were transferred away over time. Its modern work centers on oil and gas, pipelines, natural-gas utilities, mining and alternative-fuel safety." },
      { question: "Does the Railroad Commission regulate the ERCOT electric grid?", answer: "No. PUCT oversees major electric-market regulation and ERCOT operates the grid and wholesale market under that framework. The Railroad Commission regulates different energy functions, including oil and gas production, intrastate pipelines and specified natural-gas utility matters." },
      { question: "Who pays to plug an orphaned oil or gas well?", answer: "Responsible operators can have plugging and financial-assurance obligations under Texas law. When no responsible operator performs the work and a well qualifies for state action, the commission can use appropriated plugging funds and pursue recovery where authorized. The exact funding source and priority can vary by program and appropriation." }
    ]
  },
  "state-board-of-education": {
    overview: " The State Board of Education is an elected policymaking body whose authority is narrower than the phrase 'state school board' can suggest. It sets important statewide standards and performs specified oversight functions, but Texas public education is divided among the Legislature, the Texas Education Agency, the commissioner of education, local school boards and other entities.",
    responsibilities: " The board's most visible responsibilities include curriculum standards, instructional-materials processes, graduation requirements and duties involving the Permanent School Fund. Each of those functions is bounded by statute. The Legislature can redefine the board's authority, TEA administers many statewide programs, and local districts retain substantial control over staffing, operations and locally selected instructional resources within state law.",
    history: [
      "The balance of power between the elected board and other education institutions has changed repeatedly through legislation. Periods of reorganization altered how the board, commissioner and education agency divide authority, which is why current Education Code provisions matter more than assumptions based on the board's title alone.",
      "Curriculum standards became one of the board's most publicly visible functions as Texas developed statewide academic standards and assessment systems. Adoption proceedings create public records through agendas, proposed standards, hearings and votes, allowing readers to distinguish the board's official decisions from recommendations made by staff, educators or outside groups.",
      "The Permanent School Fund gives the board a separate fiduciary dimension. Education policy debates and fund governance are related only because both are assigned to the same institution; investment and distribution duties operate under constitutional and statutory requirements distinct from curriculum votes."
    ],
    powers: [
      "Adopt and revise the Texas Essential Knowledge and Skills through the process authorized by the Education Code, including public meetings and formal board votes. These standards establish statewide expectations but do not script every classroom lesson.",
      "Carry out instructional-materials review and adoption responsibilities assigned by current law. District purchasing and classroom use can involve additional local discretion and statutory rules, so board action is one step in a broader instructional-materials system.",
      "Exercise assigned governance responsibilities for the Permanent School Fund, subject to constitutional fiduciary obligations, statutes and the roles of other entities involved in managing or distributing education assets.",
      "Adopt statewide graduation requirements and perform other rulemaking or review functions specifically delegated by the Legislature."
    ],
    limitations: [
      "Individual board members cannot direct a school district, hire a superintendent or order a teacher to use a particular lesson. The board acts collectively within authority granted by law, while local trustees and administrators retain operational responsibilities.",
      "The board does not control every function of the Texas Education Agency or commissioner of education. Statutes assign many accountability, intervention, funding and administrative decisions elsewhere in the state education system.",
      "The board cannot override the Legislature. Because much of its authority is statutory, lawmakers can change curriculum, instructional-materials, graduation or fund-governance responsibilities through valid legislation."
    ],
    faqs: [
      { question: "Does the State Board of Education control local Texas school districts?", answer: "No. The board sets specific statewide policies such as curriculum standards and performs other duties assigned by law, but locally elected school boards retain major operational authority. TEA, the commissioner of education and the Legislature also exercise separate powers." },
      { question: "Does adopting TEKS mean the board writes every classroom lesson?", answer: "No. TEKS establish statewide knowledge and skill standards. Curriculum materials, lesson design and classroom implementation involve districts, educators and instructional-materials decisions within the legal framework that applies." },
      { question: "Why does the board have a role in the Permanent School Fund?", answer: "The Texas Constitution and statutes assign the board specified responsibilities involving the Permanent School Fund. Those duties are fiduciary and financial in nature and are distinct from the board's curriculum and instructional-materials responsibilities." }
    ]
  },
  "supreme-court": {
    overview: " The Supreme Court of Texas is the state's court of last resort for civil and juvenile matters, while the Court of Criminal Appeals is the final court for criminal cases. That split high-court structure is fundamental to understanding Texas judicial authority and prevents the Supreme Court from being treated as a general appellate court for every state case.",
    responsibilities: " The court reviews qualifying civil and juvenile disputes, issues extraordinary writs within constitutional and statutory authority, answers certified questions in appropriate cases and participates in statewide judicial administration and procedural rulemaking. Much of its merits docket is discretionary, so the court selects a limited number of cases that present issues warranting high-court review rather than automatically rehearing every civil appeal.",
    history: [
      "Texas's bifurcated high-court system developed as the state's appellate structure evolved in the nineteenth century. The modern division places final civil jurisdiction in the Supreme Court and final criminal jurisdiction in the Court of Criminal Appeals, with intermediate courts of appeals handling both categories subject to the rules governing further review.",
      "The court's role extends beyond deciding reported cases. Constitutional and statutory assignments make it part of statewide judicial administration, and the court participates in promulgating rules governing civil procedure, evidence and professional regulation when authorized. Those institutional responsibilities affect courts and lawyers statewide even when no particular lawsuit is before the justices.",
      "Because most petitions for review are discretionary, a denial of review generally should not be described as an endorsement of every statement in the lower-court opinion. The precedential effect of the lower decision and the procedural posture must be assessed separately from the Supreme Court's decision not to grant review."
    ],
    powers: [
      "Grant discretionary review in qualifying civil and juvenile cases and issue opinions that bind lower Texas courts on questions of state law within the court's jurisdiction.",
      "Issue writs such as mandamus in circumstances authorized by the Constitution or statutes, using extraordinary relief to address specified legal errors when ordinary appellate remedies are inadequate or other governing standards are met.",
      "Answer certified questions of Texas law from eligible federal courts, allowing the state's highest civil court to resolve unsettled state-law questions without deciding the underlying federal case.",
      "Exercise statewide judicial-administration and rulemaking responsibilities assigned by law, including specified procedural and professional-regulation functions."
    ],
    limitations: [
      "The Supreme Court is not Texas's final criminal court. Criminal appeals and post-conviction criminal matters within high-court jurisdiction belong to the Court of Criminal Appeals.",
      "The court does not conduct a new jury trial or ordinarily reweigh evidence as though it were the original factfinder. Appellate review is governed by preservation, standards of review, jurisdiction and the record created below.",
      "The court cannot issue advisory rulings merely because a legal question is politically important. Jurisdiction, standing, justiciability and procedural requirements limit when judicial power may be exercised."
    ],
    faqs: [
      { question: "Is the Texas Supreme Court the highest court for criminal cases?", answer: "No. Texas has two high courts. The Supreme Court is the court of last resort for civil and juvenile matters, while the Court of Criminal Appeals is the state's highest court for criminal cases." },
      { question: "Does the Supreme Court have to hear every civil appeal?", answer: "No. Much of its docket is discretionary. Parties may seek review under applicable rules, but the court grants only a portion of petitions. Intermediate courts of appeals therefore issue the final decision in many cases." },
      { question: "What does it mean when the court denies review?", answer: "A denial generally means the court declined to take the case. It should not automatically be described as the Supreme Court approving every part of the lower court's reasoning. The lower judgment and its precedential status must be evaluated under the applicable appellate rules." }
    ]
  },
  "court-of-criminal-appeals": {
    overview: " The Texas Court of Criminal Appeals is the state's highest court for criminal matters. Its jurisdiction includes discretionary review of criminal appeals, direct review in specified death-penalty cases and important post-conviction writ proceedings, while the Supreme Court of Texas handles the state's final civil and juvenile appellate jurisdiction.",
    responsibilities: " The court reviews legal questions arising from criminal prosecutions and post-conviction proceedings under the Texas Constitution, Code of Criminal Procedure and appellate rules. It also has rulemaking and administrative responsibilities in the criminal justice system. The court's work should be distinguished from trial-court factfinding, prosecutorial charging decisions and the intermediate appellate review performed by the fourteen courts of appeals.",
    history: [
      "Texas separated its highest civil and criminal appellate functions during the development of the state judiciary, eventually producing the current Supreme Court and Court of Criminal Appeals. That division makes Texas unusual compared with states that route all final appeals through one supreme court.",
      "Post-conviction habeas corpus became a major part of the court's modern docket because Texas law channels many felony collateral challenges through a specialized process involving the convicting court and final action by the Court of Criminal Appeals. These proceedings are distinct from the direct appeal that follows conviction.",
      "Death-penalty cases also follow special appellate rules. Certain judgments receive direct review by the Court of Criminal Appeals rather than following the ordinary path through an intermediate court of appeals, reflecting statutory and constitutional procedures specific to capital cases."
    ],
    powers: [
      "Grant discretionary review of qualifying criminal decisions from Texas courts of appeals and issue precedential interpretations of criminal statutes, constitutional protections, evidence rules and criminal procedure.",
      "Exercise direct appellate jurisdiction in death-penalty cases when Texas law requires direct review, examining the trial record and preserved legal issues under the standards governing capital appeals.",
      "Decide post-conviction habeas corpus applications within its jurisdiction, including claims that a conviction or sentence is unlawful under constitutional or statutory standards. The procedural requirements for these writs differ from an ordinary direct appeal.",
      "Issue extraordinary writs and exercise criminal-procedure rulemaking or administrative authority where the Constitution, statutes or valid rules grant that power."
    ],
    limitations: [
      "The court does not prosecute criminal cases, select charges or supervise district attorneys. Prosecutorial decisions are made by authorized prosecutors, while the judiciary resolves cases and legal disputes properly brought before it.",
      "The court is not a second trial jury. Appellate and post-conviction review operate under defined standards and records; new factual claims may require procedures in the convicting court or other mechanisms before final appellate action.",
      "The Court of Criminal Appeals does not decide ordinary civil appeals. Final civil and juvenile appellate authority belongs to the Supreme Court of Texas, subject to the jurisdiction established by law."
    ],
    faqs: [
      { question: "What is the difference between the Court of Criminal Appeals and the Texas Supreme Court?", answer: "The Court of Criminal Appeals is Texas's highest criminal court. The Supreme Court of Texas is the highest court for civil and juvenile matters. Together they form the state's split high-court system." },
      { question: "Does every criminal appeal go directly to the Court of Criminal Appeals?", answer: "No. Most criminal appeals first go to one of Texas's intermediate courts of appeals. Further review by the Court of Criminal Appeals is often discretionary, while specified death-penalty cases follow a direct-review path established by law." },
      { question: "What is a post-conviction habeas case?", answer: "It is a collateral challenge to the legality of a conviction or sentence after the ordinary trial and direct-appeal process. Texas law establishes specialized procedures for felony habeas applications, including roles for the convicting court and the Court of Criminal Appeals." }
    ]
  }
};

export function applyGovernmentEntityWave2Upgrade(entity: GovernmentEntity): GovernmentEntity {
  const expansion = WAVE2_EXPANSIONS[entity.slug];
  if (!expansion) return entity;
  return {
    ...entity,
    overview: `${entity.overview}${expansion.overview}`,
    constitutionalResponsibilities: `${entity.constitutionalResponsibilities}${expansion.responsibilities}`,
    history: [...entity.history, ...expansion.history],
    powers: [...entity.powers, ...expansion.powers],
    limitations: [...entity.limitations, ...expansion.limitations],
    faqs: [...entity.faqs, ...expansion.faqs],
  };
}