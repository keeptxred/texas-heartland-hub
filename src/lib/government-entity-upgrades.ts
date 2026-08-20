import type { GovernmentEntity, GovernmentFaq } from "@/lib/texas-government";

type GovernmentEntityExpansion = {
  overview: string;
  responsibilities: string;
  history: string[];
  powers: string[];
  limitations: string[];
  faqs: GovernmentFaq[];
};

const EXPANSIONS: Record<string, GovernmentEntityExpansion> = {
  governor: {
    overview: " In practice, the office sits at the center of appointments, emergency management, budget negotiations and the final stage of the legislative process, but Texas deliberately divides executive power among several independently elected officials. That means the governor is powerful without being the direct supervisor of every statewide agency or constitutional officer.",
    responsibilities: " The governor also submits budget recommendations, fills many vacancies, makes appointments to boards and commissions, and communicates policy priorities to lawmakers. Those responsibilities operate inside statutory limits: an executive order cannot override a statute, and emergency powers depend on authority the Legislature has actually delegated.",
    history: [
      "Texas intentionally maintains a plural executive. The governor shares statewide executive authority with separately elected officials including the lieutenant governor, attorney general, comptroller, land commissioner and agriculture commissioner. That structure limits the ability of any one governor to direct every part of state government and makes appointments, legislation and interagency coordination especially important tools of gubernatorial influence.",
      "Modern governors also exercise substantial influence through appointments. Many boards and commissions have staggered terms, so a governor can shape agencies over several years rather than replacing an entire governing body immediately. Senate confirmation, statutory qualifications and fixed terms can constrain that influence, and some offices are independently elected rather than appointed at all."
    ],
    powers: [
      "Submit a proposed state budget and policy recommendations to the Legislature. The Legislature writes the appropriations act, but the governor can frame priorities, negotiate with lawmakers and later exercise the constitutional line-item veto over appropriations subject to constitutional procedures.",
      "Fill many vacancies and appoint members of state boards and commissions when statute gives that power to the governor. Appointment authority varies by entity, and many appointments require Senate confirmation or must satisfy statutory qualifications."
    ],
    limitations: [
      "Texas does not give the governor a federal-style cabinet that controls every executive function. Independently elected statewide officials and multi-member boards exercise authority that the governor cannot simply absorb by executive order.",
      "Special-session authority is significant but limited: the governor may call the Legislature into special session and set the subjects lawmakers may consider, while legislators still decide whether particular bills pass and what language they contain."
    ],
    faqs: [
      { question: "Does the Texas governor control every state agency?", answer: "No. Texas uses a plural executive and many agencies are governed by independently elected officials, boards or commissions. The governor appoints many board members and agency leaders, but the exact appointment, removal and supervisory authority depends on the constitution and the statute creating the agency." },
      { question: "Can the governor force the Legislature to pass a bill in a special session?", answer: "No. The governor can call a special session and identify the subjects eligible for consideration, but the House and Senate still must approve legislation through their normal voting processes. The governor can advocate, negotiate, sign or veto legislation, but cannot substitute an executive order for a bill the Legislature declined to enact." },
      { question: "Why does the governor's appointment power matter?", answer: "Many Texas boards and commissions make regulatory, licensing, oversight and spending decisions. When law gives the governor appointment authority, those appointments can influence policy over long staggered terms. Senate confirmation and statutory qualifications can limit that power, and some important offices remain independently elected." }
    ]
  },
  "lieutenant-governor": {
    overview: " The office is unusual because it is elected statewide as an executive-branch constitutional officer while exercising its most visible power inside the legislative branch. Much of the lieutenant governor's practical influence comes not from a broad executive command but from Senate rules governing committee assignments, bill referrals, floor recognition and the flow of legislation.",
    responsibilities: " The lieutenant governor's responsibilities also include service on major fiscal and oversight bodies created by law. The office therefore sits at the intersection of statewide electoral accountability, Senate procedure and long-term budget planning. The exact procedural powers can change when senators amend their rules, so the current Senate rules are an important primary source alongside the Constitution.",
    history: [
      "The office's modern influence reflects the institutional development of the Texas Senate. Although the Constitution makes the lieutenant governor president of the Senate, many day-to-day powers over committees and scheduling are grounded in Senate rules adopted by senators themselves. That distinction matters because constitutional powers cannot be changed as easily as chamber rules.",
      "Because the lieutenant governor is elected by voters statewide rather than by senators, Texas separates the Senate's presiding officer from the chamber's membership in a way that differs from the Texas House. The arrangement gives the office an independent political constituency while still making Senate votes and rules essential checks on procedural authority."
    ],
    powers: [
      "Influence the Senate calendar and committee process through the powers assigned to the presiding officer by current Senate rules, including bill referral and recognition. Those tools can determine when and how a proposal receives a hearing or reaches the floor, even though senators retain the power to vote on the proposal itself.",
      "Participate in major state fiscal and oversight institutions when the Constitution or statute assigns the lieutenant governor a seat or appointment power. Those roles can extend the office's influence beyond individual Senate bills into budget execution, redistricting contingencies and intersession oversight."
    ],
    limitations: [
      "The lieutenant governor cannot unilaterally enact a Senate proposal. Bills still require the votes required by Senate rules and the Constitution, passage by the House when applicable, and gubernatorial action or another constitutionally valid route to becoming law.",
      "Many of the office's procedural advantages depend on rules adopted by the Senate. Senators can change those rules, and courts may review government action when a constitutional or statutory question is properly before them."
    ],
    faqs: [
      { question: "Why is the Texas lieutenant governor considered so powerful?", answer: "The office combines a statewide electoral mandate with the presidency of the Texas Senate. Current Senate rules give the presiding officer important roles in committee assignments, bill referrals, recognition and scheduling. Those procedural tools can strongly influence which proposals advance, even though the lieutenant governor cannot pass legislation without senators' votes." },
      { question: "Is the lieutenant governor the same as the Senate majority leader?", answer: "No. Texas does not structure the Senate around a federal-style majority leader who serves as the chamber's principal presiding officer. The lieutenant governor is elected statewide and serves as president of the Senate, while senators organize committees and conduct legislative business under the Constitution and their adopted rules." },
      { question: "When does the lieutenant governor act as governor?", answer: "The Texas Constitution provides for the lieutenant governor to exercise gubernatorial powers when succession or temporary absence conditions are met. The precise circumstance matters, so an official succession question should be checked against the Constitution and current state records rather than assumed from political practice." }
    ]
  },
  "attorney-general": {
    overview: " The office is both a litigation institution and an administrative agency. Its work ranges from representing Texas in major constitutional disputes to child-support enforcement, consumer protection, open-government rulings and selected fraud or regulatory matters. Those responsibilities are created by different statutes, so the office's authority can be broad in one field and narrow in another.",
    responsibilities: " Texas law gives the attorney general numerous duties beyond courtroom advocacy, including responding to authorized requests for legal opinions and administering programs assigned by the Legislature. The office also participates in the Public Information Act process when a governmental body seeks to withhold records and the law requires or permits an attorney general determination.",
    history: [
      "The office's litigation profile has grown as disputes between Texas and the federal government have become a recurring part of state policy. Whether Texas is a plaintiff or defendant, the attorney general represents the state's legal position; a filing by the office is an advocacy document, while a court's judgment determines the binding legal outcome unless later changed on appeal.",
      "The Legislature has repeatedly assigned specialized enforcement programs to the office. Child-support services, Medicaid-fraud work, consumer protection and open-government responsibilities illustrate why the attorney general should not be described only as the state's courtroom lawyer. Each program has its own statutory scope and procedural limits."
    ],
    powers: [
      "Seek injunctions, penalties or other relief when a statute specifically authorizes the attorney general to enforce that law. The available remedy depends on the law involved; the office does not possess an unlimited general power to regulate private conduct merely because it considers the conduct harmful.",
      "Issue formal legal opinions to officials and entities authorized by law to request them. Opinions can guide public officials and explain the office's interpretation of Texas law, but courts retain the authority to issue binding judgments in actual cases and controversies."
    ],
    limitations: [
      "Texas criminal prosecution remains primarily local. District and county attorneys handle ordinary criminal cases, and the attorney general may participate in criminal matters only where the Constitution and statutes provide authority or a legally sufficient request or referral mechanism applies.",
      "The attorney general cannot rewrite statutes through litigation or legal opinions. Courts interpret disputed law, the Legislature can amend statutes, and constitutional limits apply to the office just as they apply to other state actors."
    ],
    faqs: [
      { question: "Does the Texas Attorney General prosecute ordinary crimes?", answer: "Usually not. Ordinary criminal prosecution is primarily the responsibility of local district and county attorneys. The attorney general can have criminal authority in specific areas or may assist when Texas law authorizes that role, but the office is not a statewide replacement for every local prosecutor." },
      { question: "Are attorney general legal opinions binding like court decisions?", answer: "No. Formal opinions are important interpretations issued to authorized requestors and often guide state and local officials, but they are not a substitute for a binding judgment from a court with jurisdiction. A court can reach a different legal conclusion in an actual case." },
      { question: "What role does the attorney general play in Texas open-records disputes?", answer: "Under the Texas Public Information Act, governmental bodies sometimes request an attorney general decision about whether particular information may or must be withheld. The office applies the statute and relevant precedent to the request, while requestors and governmental bodies may have additional judicial remedies under the law." }
    ]
  },
  comptroller: {
    overview: " The comptroller's work affects both sides of the state ledger: money coming in through taxes and other revenue, and statewide accounting for money paid out. The office also publishes economic and fiscal data used by lawmakers, local governments, businesses and taxpayers. Its constitutional revenue certification role makes the office especially important when the Legislature writes a two-year budget.",
    responsibilities: " Texas's pay-as-you-go framework requires appropriations from certain funds to fit within revenue the comptroller estimates will be available, subject to constitutional exceptions and procedures. The office therefore separates fiscal measurement from legislative spending choices: the comptroller estimates and certifies available revenue, while elected lawmakers decide appropriations and tax policy within constitutional limits.",
    history: [
      "The modern comptroller's office is a statewide fiscal information system as well as a tax agency. It operates accounting and payment functions used across state government and publishes transparency, revenue, economic and local-government data. Those records make the office a primary source for verifying claims about collections, appropriations capacity and state financial trends.",
      "Revenue estimates are forecasts, not guarantees. Economic growth, energy prices, consumer spending, tax-law changes and timing effects can cause actual collections to differ from an estimate. The comptroller updates fiscal information as conditions change, so KTR distinguishes a certified estimate from later actual revenue and expenditure data."
    ],
    powers: [
      "Administer major state taxes by issuing guidance, processing returns and payments, conducting audits and using collection procedures authorized by the Tax Code. The Legislature defines the taxes and rates; the comptroller administers them under those laws.",
      "Publish statewide fiscal and economic data and distribute certain revenues to cities, counties, transit authorities and other local entities under statutory formulas. These distributions are accounting and statutory functions rather than discretionary grants chosen by the comptroller."
    ],
    limitations: [
      "The comptroller cannot create a new statewide tax or independently raise a tax rate. Those policy choices require legislation and, in some cases, compliance with constitutional restrictions or voter-approved constitutional provisions.",
      "A revenue estimate does not itself appropriate money. The Legislature must enact appropriations, and constitutional spending, debt and revenue rules can impose additional constraints beyond the comptroller's certification."
    ],
    faqs: [
      { question: "Why does the comptroller's revenue estimate matter to the Texas budget?", answer: "Texas generally cannot appropriate certain funds beyond the amount the comptroller certifies will be available under the Constitution. That makes the revenue estimate a practical ceiling for much of the budget process, although constitutional provisions, dedicated funds and later supplemental actions can complicate the final picture." },
      { question: "Does the comptroller decide how Texas spends tax money?", answer: "No. The Legislature makes appropriations through the state budget and other laws. The comptroller collects and accounts for revenue, estimates how much is available, certifies appropriations against applicable revenue limits and executes statewide payment and accounting functions." },
      { question: "Are comptroller forecasts the same as actual collections?", answer: "No. Revenue estimates are forecasts based on economic assumptions and current law. Actual collections can be higher or lower. For accountability reporting, KTR distinguishes forecasts, certified revenue, appropriations and actual expenditures instead of treating them as interchangeable measures." }
    ]
  },
  "secretary-of-state": {
    overview: " The secretary of state combines several functions that otherwise might appear unrelated: statewide election administration, business and commercial filings, official state records and protocol. Unlike most major statewide executive offices, the secretary is appointed by the governor rather than elected by voters, and the appointment is subject to the constitutional confirmation process.",
    responsibilities: " As chief elections officer, the secretary issues guidance and administers statewide election systems under the Election Code, but Texas elections remain highly decentralized. Counties conduct most voter registration and election operations, local officials administer polling and tabulation, and courts resolve legal disputes. The secretary also maintains business-entity filings and other records under separate statutes.",
    history: [
      "Texas has long used the secretary of state as a recordkeeping and authentication office. Over time, the Legislature added modern business filing systems and a central role in election administration. The office therefore touches both civic participation and commercial organization, even though those functions arise under different bodies of law.",
      "The secretary's election role expanded as statewide databases, uniform forms, federal election requirements and election-security responsibilities became more complex. That growth did not eliminate county administration; Texas still relies on local election officials to conduct elections under state and federal rules."
    ],
    powers: [
      "Maintain statewide voter-registration and election-administration systems and issue official election guidance within the authority granted by the Election Code. The office can support, train and oversee aspects of local administration, while counties retain major operational responsibilities.",
      "Accept and maintain filings for corporations, limited liability companies and other entities created or registered under Texas business law. Filing acceptance records an entity's legal documents but does not mean the secretary endorses the business or guarantees its compliance with every other law."
    ],
    limitations: [
      "The secretary of state does not personally count every Texas ballot or replace county election administrators. Local officials conduct elections, and recounts, contests and other disputes follow procedures established by the Election Code and courts.",
      "Business filing authority is ministerial and statutory. The secretary does not decide private contract disputes, provide legal advice to business owners or guarantee that a filed company is financially sound or lawfully operating in every regulated field."
    ],
    faqs: [
      { question: "Who actually runs elections in Texas?", answer: "Texas election administration is shared. The Secretary of State is the chief elections officer and provides statewide systems, guidance and oversight, while counties and other local authorities perform most voter-registration, polling-place, ballot and tabulation operations under the Election Code." },
      { question: "Is the Texas Secretary of State elected?", answer: "No. The governor appoints the Secretary of State under Article IV of the Texas Constitution, with Senate confirmation as required by the constitutional process. That differs from offices such as governor, attorney general and comptroller, which are elected statewide." },
      { question: "What does a Texas business filing with the Secretary of State prove?", answer: "It shows that a filing has been accepted into the state's business-record system under applicable filing rules. It does not establish that the business has every required license, complies with every tax or regulatory obligation, or will prevail in a private legal dispute." }
    ]
  },
  "texas-legislature": {
    overview: " The Legislature is a bicameral institution made up of the 150-member House and 31-member Senate. Its work extends beyond passing bills: lawmakers adopt the state budget, propose constitutional amendments, oversee agencies, conduct investigations and confirmations, and shape state policy through committees and appropriations. Legislative power is significant but divided between two chambers and constrained by the Texas Constitution.",
    responsibilities: " Regular sessions are constitutionally limited in timing, while the governor may call special sessions on specified subjects. A proposal normally must move through committee and receive the required votes in both chambers in identical form before it can be sent to the governor. Constitutional amendments follow a different path: they require supermajority legislative approval and then voter approval rather than the governor's signature.",
    history: [
      "The Constitution of 1876 intentionally created a part-time Legislature with biennial regular sessions and detailed procedural limits. That design concentrates lawmaking into defined sessions but also gives interim committees, agency oversight, rulemaking review and special sessions an important role between regular sessions.",
      "Modern legislative work is highly committee-driven. Committees take testimony, analyze bills, receive fiscal and policy information and decide whether many proposals advance. Floor votes remain decisive, but understanding committee referrals, substitutes, calendars and conference committees is essential to understanding how a Texas bill actually becomes law."
    ],
    powers: [
      "Enact general and local laws within state and federal constitutional limits, including laws governing taxation, education, criminal justice, elections, property, business regulation and the organization of state agencies.",
      "Appropriate state money through the General Appropriations Act and other legislation. Fiscal choices remain subject to constitutional revenue, spending and debt constraints, and some dedicated funds or constitutional accounts have special rules.",
      "Propose amendments to the Texas Constitution with the required legislative supermajorities. Proposed amendments go to Texas voters for approval or rejection and do not depend on a gubernatorial signature."
    ],
    limitations: [
      "Neither chamber can enact ordinary legislation by itself. House and Senate must agree to the same text, and the resulting bill remains subject to gubernatorial action and judicial review unless a constitutional procedure provides otherwise.",
      "The Legislature cannot override the U.S. Constitution or valid federal law, and state courts can invalidate state statutes that violate the Texas Constitution. Constitutional limitations also restrict subjects such as debt, appropriations and local or special laws."
    ],
    faqs: [
      { question: "How often does the Texas Legislature meet in regular session?", answer: "The Texas Constitution provides for regular sessions beginning in January of odd-numbered years. Special sessions may be called by the governor between regular sessions, but lawmakers may consider only subjects within the governor's call unless the call is expanded." },
      { question: "Do all filed Texas bills receive a floor vote?", answer: "No. Many bills never advance out of committee or never reach a chamber's floor calendar. Filing is only the beginning. Readers should check committee referral, hearing, committee action, calendar status, floor votes and action in the other chamber before describing a proposal as likely to become law." },
      { question: "Can the Legislature amend the Texas Constitution without voters?", answer: "No. Lawmakers can propose a constitutional amendment with the required supermajority vote, but the amendment becomes part of the Texas Constitution only if voters approve it at the required statewide election." }
    ]
  },
  "texas-house": {
    overview: " The Texas House of Representatives is the larger chamber of the Legislature, with 150 members elected from single-member districts. The House originates revenue bills, participates equally with the Senate in most lawmaking, adopts its own rules and elects the Speaker from among its members. Much of its work occurs through standing committees, calendars and floor debate.",
    responsibilities: " The House has distinctive constitutional responsibilities in addition to ordinary legislation. It possesses the power of impeachment, while the Senate conducts impeachment trials. The House also adopts rules governing bill referral, committee procedure, calendars and floor consideration, and those rules can materially affect whether and when legislation receives a vote.",
    history: [
      "House districts are redrawn after each federal decennial census through the Texas redistricting process. Because every representative runs from a geographic district, population shifts and court rulings can change district boundaries even when the chamber's constitutional size remains 150 members.",
      "The Speaker is chosen by House members and is central to chamber organization. The office appoints committee leadership and performs procedural duties under House rules, but the Speaker's authority ultimately exists within rules the membership adopts and votes the House takes."
    ],
    powers: [
      "Originate bills for raising revenue as required by the Texas Constitution. The Senate may amend those measures, and both chambers still must agree to identical final language before the legislation can advance.",
      "Exercise the constitutional power of impeachment. The House decides whether to approve articles of impeachment; a separate Senate trial process determines whether an impeached official is removed under the Constitution.",
      "Organize standing and select committees, conduct oversight hearings and investigate matters within legislative authority. Committee subpoenas, records and investigative procedures depend on applicable rules and law."
    ],
    limitations: [
      "A House vote alone does not make an ordinary bill state law. The Senate must approve identical text, and the bill then proceeds through the constitutional gubernatorial process unless another constitutional rule applies.",
      "House rules create substantial procedural authority but cannot override the Texas or U.S. Constitution. Courts generally avoid internal political questions, yet constitutional and statutory requirements remain binding on legislative action."
    ],
    faqs: [
      { question: "How many members are in the Texas House?", answer: "The Texas House has 150 representatives elected from single-member districts. District lines are redrawn through redistricting after the federal census and can also be affected by litigation or later legislative action." },
      { question: "What is unique about the Texas House's impeachment power?", answer: "The House has the constitutional power to impeach certain state officials by approving articles of impeachment. Impeachment is an accusation and does not itself remove the official; the Senate conducts the trial and determines the result under the Texas Constitution." },
      { question: "Why do House committees matter?", answer: "Most bills are referred to committees before they can reach the floor. Committees can hold hearings, take testimony, amend or substitute proposals and decide whether to report a bill. A bill's committee status is therefore one of the most important indicators of actual legislative progress." }
    ]
  },
  "texas-senate": {
    overview: " The Texas Senate is the 31-member upper chamber of the Legislature. Senators represent larger districts and serve staggered terms, while the statewide elected lieutenant governor presides over the chamber. The Senate shares ordinary lawmaking and budget authority with the House and has distinctive roles in gubernatorial appointments and impeachment trials.",
    responsibilities: " Senate procedure is governed by the Constitution and rules adopted by senators. Committees examine bills and nominations, the chamber considers legislation and confirmations, and senators participate in conference committees when House and Senate versions differ. Because the lieutenant governor is the presiding officer, Texas Senate organization differs materially from the House's member-elected Speaker system.",
    history: [
      "Senators generally serve four-year staggered terms, with post-redistricting elections producing special term patterns so the chamber returns to staggered cycles. That structure creates continuity between election cycles while still requiring the entire chamber to face voters after districts are redrawn.",
      "The Senate's advice-and-consent role is an important check on gubernatorial appointments. Not every appointment requires confirmation, and confirmation timing can depend on when the appointment occurs and whether the Senate is in session, so official appointment records and Senate action should be checked in each case."
    ],
    powers: [
      "Confirm or reject many gubernatorial appointments when the Constitution or statute requires Senate advice and consent. Confirmation power does not make the Senate the appointing authority; it is a separate check on appointments made by the governor.",
      "Conduct trials after the House impeaches an official. Senators act under the impeachment provisions of the Texas Constitution, and conviction/removal requires the constitutionally specified process rather than an ordinary legislative vote.",
      "Participate equally with the House in ordinary legislation and appropriations, subject to constitutional rules such as the House-origin requirement for revenue-raising bills."
    ],
    limitations: [
      "The Senate cannot enact an ordinary bill by itself. House concurrence in identical text is required, and the governor then has the constitutional opportunity to sign, veto or allow legislation to become law without a signature as applicable.",
      "The lieutenant governor's procedural influence does not eliminate senators' voting authority. Chamber rules, constitutional vote thresholds and member votes constrain what the presiding officer can accomplish without legislative support."
    ],
    faqs: [
      { question: "How many Texas senators are there?", answer: "The Texas Senate has 31 members elected from single-member districts. Senators generally serve four-year staggered terms, with special post-redistricting term assignments used to restore staggering after all districts are contested." },
      { question: "What role does the Senate play in gubernatorial appointments?", answer: "Many appointments require Senate confirmation. The governor makes the appointment, while the Senate considers whether to consent when the Constitution or statute requires it. Not every state position follows the same appointment and confirmation process." },
      { question: "What happens when the House and Senate pass different versions of a bill?", answer: "The chambers must ultimately agree to identical language. They can concur in amendments or use a conference committee to negotiate differences. A conference report then requires the approvals required by chamber rules before the final bill can be sent to the governor." }
    ]
  },
  "speaker-of-the-house": {
    overview: " The Speaker is both a constitutional officer of the House and a representative elected from a district. House members choose the Speaker at the beginning of a legislative session. The office's influence comes from presiding over the chamber and exercising organizational powers granted by the Constitution, statutes and House rules, especially committee assignments and procedural administration.",
    responsibilities: " The Speaker maintains order, recognizes members, signs measures that have passed as required by legislative procedure and performs numerous administrative duties. House rules also give the Speaker important responsibilities for committee appointments and referrals. Those powers can shape the legislative agenda, but they exist within a chamber whose members can adopt, amend and enforce their own rules.",
    history: [
      "The speakership has evolved with House rules and legislative practice. Different eras have concentrated or dispersed procedural power in different ways, demonstrating why a description of the Speaker's authority should distinguish constitutional duties from powers that exist because the current House membership adopted particular rules.",
      "Because the Speaker remains an elected representative, the office combines statewide legislative influence with responsibility to a local district. The Speaker votes as a House member and is subject to the same election cycle for the underlying representative seat, while the speakership itself is decided by House members."
    ],
    powers: [
      "Appoint House committees, chairs and vice chairs when House rules assign that responsibility, affecting which members develop expertise and control hearing schedules in major policy areas.",
      "Preside over House floor proceedings, rule on parliamentary questions subject to House rules and precedents, and recognize members to conduct business. Those procedural decisions can influence timing without replacing the chamber's required votes.",
      "Refer introduced legislation to committees under House rules and perform administrative duties connected to enrolled legislation and chamber operations."
    ],
    limitations: [
      "The Speaker cannot pass a bill without House votes or bind the Senate. Even strong control over procedure does not substitute for constitutional vote requirements, bicameral agreement and gubernatorial action.",
      "House members can change the rules that define many of the Speaker's procedural powers. The Speaker also remains subject to constitutional requirements, ethics rules, election law and the accountability that comes with holding an elected House seat."
    ],
    faqs: [
      { question: "Who elects the Speaker of the Texas House?", answer: "The 150 members of the Texas House elect the Speaker from among the House membership. Voters elect the representative to the underlying district seat, but the speakership is chosen by the chamber rather than in a statewide election." },
      { question: "Why can the Speaker influence which bills advance?", answer: "House rules give the Speaker important organizational and procedural responsibilities, including committee appointments and bill referrals. Committees and calendars strongly affect whether legislation reaches the floor, although members still must cast the votes required to pass a bill." },
      { question: "Can a future Texas House reduce the Speaker's power?", answer: "Many procedural powers are created by House rules, so a House majority can revise those rules at the start of a session or through the procedures the rules allow. Constitutional duties cannot be changed merely by adopting a chamber rule." }
    ]
  }
};

export function upgradeGovernmentEntity(entity: GovernmentEntity): GovernmentEntity {
  const expansion = EXPANSIONS[entity.slug];
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

export function upgradeGovernmentEntities(entities: GovernmentEntity[]): GovernmentEntity[] {
  return entities.map(upgradeGovernmentEntity);
}
