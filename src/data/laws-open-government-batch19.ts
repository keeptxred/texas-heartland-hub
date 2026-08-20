import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const common = {
  updated: "2026-08-15",
  pillarLabel: "Texas Laws",
  pillarHref: "/laws",
  guideLabel: "Texas Law Guide",
} as const;

const piaChapter = { label: "Texas Government Code Chapter 552 — Public Information", url: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.552.htm" };
const omaChapter = { label: "Texas Government Code Chapter 551 — Open Meetings", url: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.551.htm" };
const oagRequest = { label: "Texas Attorney General — How to Request Public Information", url: "https://www.texasattorneygeneral.gov/open-government/members-public/how-request-public-information" };
const oagOverview = { label: "Texas Attorney General — Public Information Act Overview", url: "https://www.texasattorneygeneral.gov/open-government/members-public/overview-public-information-act" };
const oagResources = { label: "Texas Attorney General — Open Government Resources", url: "https://www.texasattorneygeneral.gov/open-government/members-public/open-government-resources" };

export const OPEN_GOVERNMENT_BATCH19_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-public-information-act-request-guide": {
    ...common,
    slug: "texas-public-information-act-request-guide",
    title: "Texas Public Information Act Requests: How to Ask for Government Records",
    dek: "How to make a Texas Public Information Act request, where to send it, what the government must search for, and the 2025 statewide contact-database change under HB 4214.",
    keyTakeaways: [
      "A Texas Public Information Act request must be in writing and should be sent to the governmental body's public information officer or designee using a method authorized by Government Code Section 552.234.",
      "The request should identify existing information; the Public Information Act does not generally require a governmental body to answer questions, perform legal research, or create new records.",
      "Section 552.234 recognizes mail, email, hand delivery, and other methods approved by the governmental body, so using the body's designated address helps preserve a clear receipt date.",
      "HB 4214 added a requirement for governmental bodies to report their designated mailing and email addresses to the Attorney General for a publicly accessible contact database.",
    ],
    intro: [
      "Texas Government Code Chapter 552 gives the public a process for requesting existing government information. A focused written request sent to the correct contact is usually more effective than asking an agency to explain an issue or create a custom report.",
      "This guide covers the statewide framework. Special statutes can control particular records, and confidential information can still be withheld when law requires it.",
    ],
    sections: [
      { heading: "Send a written request to the correct governmental body", paragraphs: ["Section 552.234 governs delivery methods. The Attorney General recommends keeping a copy of the request and evidence showing when the governmental body received it."] },
      { heading: "Ask for existing information, not answers to questions", paragraphs: ["The Act concerns information already collected, assembled, or maintained. A governmental body is not generally required to create new information, answer interrogatories, or conduct legal research for a requestor."] },
      { heading: "Describe records clearly enough to locate them", paragraphs: ["Useful requests identify subjects, date ranges, offices, people, contracts, communications, or record types. A governmental body may seek clarification when a request is unclear or unusually broad, but clarification should not be used to rewrite a clear request into a different one."] },
      { heading: "HB 4214 improves access to designated request addresses", paragraphs: ["The 2025 law added Section 552.234(e) and (f), requiring governmental bodies to provide current designated mailing and email addresses to the Attorney General and requiring a public online database of those addresses."] },
    ],
    faq: [
      { q: "Do I need special legal wording to make a Texas public-information request?", a: "No. The request must be in writing, but it does not need to cite Chapter 552 if it clearly asks the governmental body for existing public information." },
      { q: "Can I force an agency to answer questions with a PIA request?", a: "Generally no. The Act requires access to existing information; it does not generally require an agency to create explanations or new records." },
      { q: "Should I send the request to any employee's email address?", a: "Use the governmental body's designated Public Information Act address or another method it approves under Section 552.234 whenever possible." },
    ],
    sources: [piaChapter, oagRequest, { label: "Texas Legislature — HB 4214 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB04214F.htm" }],
    related: [
      { label: "Texas PIA response deadlines", href: "/guides/texas-public-information-act-deadlines" },
      { label: "Texas PIA costs", href: "/guides/texas-public-information-act-costs" },
      { label: "Texas PIA exceptions", href: "/guides/texas-public-information-act-exceptions" },
    ],
  },

  "texas-public-information-act-deadlines": {
    ...common,
    slug: "texas-public-information-act-deadlines",
    title: "Texas Public Information Act Deadlines: Prompt Production and Attorney General Rulings",
    dek: "The key Texas PIA timing rules: prompt production, the 10-business-day Attorney General decision deadline, later submission deadlines, and why special records can use different timelines.",
    keyTakeaways: [
      "Government Code Section 552.221 requires public information to be produced promptly, meaning as soon as possible under the circumstances and within a reasonable time without delay.",
      "When a governmental body wants to withhold requested information and no applicable prior determination authorizes withholding, Section 552.301 generally requires an Attorney General decision request by the 10th business day after receiving the written request.",
      "Section 552.301 contains additional notice and submission duties, including later business-day deadlines for written comments and responsive information.",
      "Some categories, such as requested body-worn-camera recordings, have special statutory deadlines that differ from the ordinary Chapter 552 timetable.",
    ],
    intro: ["Texas does not impose one universal number of days for every record request. The ordinary rule is prompt production, while specific business-day deadlines govern a governmental body's effort to withhold information through the Attorney General process."],
    sections: [
      { heading: "Public information must be produced promptly", paragraphs: ["Section 552.221 does not mean every request must be completed immediately. It requires production as soon as possible under the circumstances, within a reasonable time, without delay."] },
      { heading: "The 10th business day is a major withholding deadline", paragraphs: ["Under Section 552.301, a governmental body that needs an Attorney General ruling generally must ask for that ruling and identify the claimed exceptions not later than the 10th business day after receiving the written request."] },
      { heading: "Additional submissions follow the initial ruling request", paragraphs: ["Chapter 552 requires additional material to be provided to the Attorney General and certain information to the requestor on later statutory deadlines. Missing a deadline can trigger the presumption described in Section 552.302, subject to law that makes information confidential."] },
      { heading: "Special record statutes can alter the ordinary timetable", paragraphs: ["For example, Code of Criminal Procedure Article 2B.0113 provides longer Attorney General decision deadlines for requested body-worn-camera recordings. Always check whether a record category has a special rule."] },
    ],
    faq: [
      { q: "Does Texas require all requested records within 10 business days?", a: "No. Ten business days is chiefly associated with the ordinary Attorney General ruling process. Production itself is governed by the prompt-production rule and the circumstances of the request." },
      { q: "What happens if a governmental body misses the ordinary Attorney General deadline?", a: "Section 552.302 creates a presumption that the information is public, but information made confidential by law can remain protected and other statutory rules may matter." },
      { q: "Are body-camera requests on the same deadline?", a: "Not always. Article 2B.0113 provides special 20- and 25-business-day deadlines for specified body-worn-camera ruling submissions." },
    ],
    sources: [piaChapter, oagOverview, { label: "Texas Code of Criminal Procedure Art. 2B.0113", url: "https://statutes.capitol.texas.gov/Docs/CR/htm/CR.2B.htm" }],
    related: [
      { label: "How to make a PIA request", href: "/guides/texas-public-information-act-request-guide" },
      { label: "PIA exceptions", href: "/guides/texas-public-information-act-exceptions" },
      { label: "PIA enforcement", href: "/guides/texas-public-information-act-complaint-enforcement" },
    ],
  },

  "texas-public-information-act-costs": {
    ...common,
    slug: "texas-public-information-act-costs",
    title: "Texas Public Information Act Costs: Copy Charges, Estimates and Overcharge Complaints",
    dek: "When Texas governmental bodies may charge for public information, the $40 itemized-estimate rule, deposit thresholds, lower-cost options, and Attorney General cost complaints.",
    keyTakeaways: [
      "Government Code Sections 552.261 through 552.274 govern charges for providing public information and authorize Attorney General cost rules.",
      "Section 552.2615 generally requires a written itemized estimate when charges for copies, or qualifying inspection costs, are expected to exceed $40.",
      "For 50 or fewer pages of ordinary paper records, Section 552.261 generally limits charges to the per-page copy charge and bars material, labor, and overhead charges unless specified location exceptions apply.",
      "The Attorney General's Open Records Division handles complaints alleging improper overcharges and publishes cost guidance for governmental bodies and requestors.",
    ],
    intro: ["The Public Information Act permits lawful recovery of certain reproduction and personnel costs, but it also requires advance notice and itemization in important situations. A large estimate is not automatically valid merely because a request covers many records."],
    sections: [
      { heading: "Charges must fit Chapter 552 and Attorney General rules", paragraphs: ["Section 552.261 allows reasonable reproduction-related charges, while Section 552.262 directs the Attorney General to adopt cost rules. Different formats and unusually burdensome retrieval can affect the calculation."] },
      { heading: "More than $40 generally triggers an itemized estimate", paragraphs: ["Section 552.2615 requires a written itemized statement detailing estimated charges when the statutory threshold is exceeded. If a less costly method of viewing the records is available, the statement must tell the requestor that the alternative can be discussed."] },
      { heading: "Small paper-copy requests receive special treatment", paragraphs: ["For 50 or fewer pages of paper records, the statute generally excludes material, labor, and overhead charges and limits the cost to the page-copy charge, subject to the separate-building and remote-storage exceptions."] },
      { heading: "Overcharge complaints go to the Attorney General", paragraphs: ["The Open Records Division accepts cost complaints and determines charges under the Attorney General's rules. Requestors should preserve the estimate, request, correspondence, and any explanation of labor time."] },
    ],
    faq: [
      { q: "When must a Texas agency give me an itemized cost estimate?", a: "Generally when qualifying charges are expected to exceed $40 under Section 552.2615." },
      { q: "Can labor be charged on a simple 20-page paper request?", a: "Ordinarily not for 50 or fewer pages of paper records, unless the statutory location exceptions apply or another specific rule controls." },
      { q: "Can I challenge a public-records cost estimate?", a: "Yes. The Attorney General's Open Records Division provides a process for complaints alleging overcharges." },
    ],
    sources: [piaChapter, { label: "Texas Attorney General — Charges for Public Information", url: "https://www.texasattorneygeneral.gov/open-government/governmental-bodies/charges-public-information" }],
    related: [
      { label: "How to make a PIA request", href: "/guides/texas-public-information-act-request-guide" },
      { label: "PIA deadlines", href: "/guides/texas-public-information-act-deadlines" },
      { label: "PIA enforcement", href: "/guides/texas-public-information-act-complaint-enforcement" },
    ],
  },

  "texas-public-information-act-exceptions": {
    ...common,
    slug: "texas-public-information-act-exceptions",
    title: "Texas Public Information Act Exceptions: Confidential Records and Withholding Claims",
    dek: "How Texas PIA exceptions work, the difference between information made confidential by law and discretionary withholding, Attorney General rulings, and why partial release or redaction may still be required.",
    keyTakeaways: [
      "The Public Information Act begins with a strong disclosure policy, but Chapter 552 contains exceptions and also incorporates confidentiality created by other law.",
      "Section 552.101 protects information considered confidential by constitutional law, statutory law, or judicial decision; confidential-by-law information generally cannot simply be released at the government's discretion.",
      "Other exceptions can be discretionary, and a governmental body commonly must seek an Attorney General ruling unless a previous determination or another statutory mechanism authorizes withholding.",
      "An exception applying to part of a record does not automatically make every responsive page confidential; nonexcepted information may still have to be released after lawful redaction.",
    ],
    intro: ["A Public Information Act request is not a guarantee that every responsive word will be released. The legal question is whether a particular exception or confidentiality statute applies to particular information, and whether the governmental body followed the process required to withhold it."],
    sections: [
      { heading: "Confidential by law is different from merely sensitive", paragraphs: ["Section 552.101 incorporates confidentiality established elsewhere in law. Government officials cannot make confidential information public merely because disclosure seems convenient."] },
      { heading: "Chapter 552 contains many specific exceptions", paragraphs: ["Examples can involve litigation, attorney-client material, law-enforcement interests, competitive bidding, policymaking drafts, personal privacy, security information, and other subjects. Each exception has its own elements and limits."] },
      { heading: "Attorney General review is central to many withholding claims", paragraphs: ["If no previous determination or special statutory authority applies, a governmental body generally seeks an Open Records Division decision under Section 552.301 before withholding information based on an exception."] },
      { heading: "Redaction can permit partial disclosure", paragraphs: ["When only part of a responsive record is protected, the governmental body may need to redact the protected portion and release the remainder. Some statutes also allow specified redactions without a new ruling while requiring notice to the requestor."] },
    ],
    faq: [
      { q: "Does 'confidential' mean the same thing as 'embarrassing' or 'sensitive'?", a: "No. Withholding requires a legal basis; a record is not confidential merely because disclosure would be uncomfortable." },
      { q: "Can a governmental body claim any exception it wants?", a: "No. The claimed exception must legally apply, and the governmental body must follow the applicable Chapter 552 process." },
      { q: "If one sentence is confidential, can the entire document be withheld?", a: "Not automatically. If protected material can be separated from public material, the public portions may still have to be released." },
    ],
    sources: [piaChapter, { label: "Texas Attorney General — Confidential Information Under the PIA", url: "https://www.texasattorneygeneral.gov/open-government/members-public/confidential-information-under-public-information-act" }],
    related: [
      { label: "PIA deadlines", href: "/guides/texas-public-information-act-deadlines" },
      { label: "PIA enforcement", href: "/guides/texas-public-information-act-complaint-enforcement" },
      { label: "How to make a PIA request", href: "/guides/texas-public-information-act-request-guide" },
    ],
  },

  "texas-public-information-act-complaint-enforcement": {
    ...common,
    slug: "texas-public-information-act-complaint-enforcement",
    title: "Texas Public Information Act Enforcement: Complaints, Mandamus and Attorney General Review",
    dek: "Options when a Texas governmental body does not properly handle a public-information request, including Attorney General assistance, cost complaints, Section 552.321 mandamus, and Section 552.3215 enforcement.",
    keyTakeaways: [
      "The Attorney General's Open Government resources provide assistance and processes for Public Information Act disputes, including cost complaints and Open Records Division rulings.",
      "Government Code Section 552.321 authorizes a requestor or the Attorney General to seek a writ of mandamus in specified circumstances to compel a governmental body to make public information available.",
      "Section 552.3215 creates a separate complaint and civil-enforcement framework involving district or county attorneys and the Attorney General for alleged violations of Chapter 552.",
      "Different remedies have different prerequisites and purposes; calling the Open Government Hotline is not the same as filing a lawsuit or a statutory complaint.",
    ],
    intro: ["A delayed or denied request does not always require immediate litigation. Texas law provides several routes depending on whether the dispute concerns an Attorney General ruling, excessive costs, failure to request a ruling, or refusal to produce information that must be public."],
    sections: [
      { heading: "Start by identifying the type of dispute", paragraphs: ["A cost dispute, missed deadline, exception claim, and refusal to comply with an Attorney General decision can trigger different procedures. Preserve the original request, proof of receipt, estimates, notices, and ruling correspondence."] },
      { heading: "Attorney General resources can resolve or narrow disputes", paragraphs: ["The Open Records Division issues rulings, handles cost complaints, and staffs the Open Government Hotline. Hotline lawyers provide information about the statutes but do not act as private counsel."] },
      { heading: "Section 552.321 provides mandamus authority", paragraphs: ["The statute authorizes court action to compel release in specified circumstances. Whether mandamus is available in a particular dispute depends on the statutory conditions and procedural posture."] },
      { heading: "Section 552.3215 provides another enforcement path", paragraphs: ["The statute establishes a complaint process and possible declaratory or injunctive relief for Chapter 552 violations. It should not be treated as an automatic damages remedy for every records dispute."] },
    ],
    faq: [
      { q: "Can I call the Texas Attorney General about an open-records problem?", a: "Yes. The Open Government Hotline provides information about the Public Information Act, but hotline attorneys do not represent callers." },
      { q: "Can a requestor sue to compel public records?", a: "Section 552.321 authorizes mandamus in specified circumstances. Court remedies are fact- and procedure-dependent." },
      { q: "Is an overcharge complaint the same as a lawsuit?", a: "No. Cost complaints are handled through the Attorney General's cost process, while judicial enforcement uses separate statutory mechanisms." },
    ],
    sources: [piaChapter, { label: "Texas Attorney General — Open Government Hotline", url: "https://www.texasattorneygeneral.gov/open-government/governmental-bodies/open-government-hotline" }],
    related: [
      { label: "PIA deadlines", href: "/guides/texas-public-information-act-deadlines" },
      { label: "PIA costs", href: "/guides/texas-public-information-act-costs" },
      { label: "PIA exceptions", href: "/guides/texas-public-information-act-exceptions" },
    ],
  },

  "texas-open-meetings-notice-law": {
    ...common,
    slug: "texas-open-meetings-notice-law",
    title: "Texas Open Meetings Notice Law: Agendas, Posting and the 72-Hour Rule",
    dek: "Texas Open Meetings Act notice requirements, the general 72-hour posting rule, agenda specificity, emergency exceptions, and why special governmental bodies can have additional posting rules.",
    keyTakeaways: [
      "Government Code Section 551.041 requires a governmental body to give written notice of the date, hour, place, and subject of each meeting held under the Open Meetings Act.",
      "Section 551.043 generally requires the notice to be posted in a place readily accessible to the general public at all times for at least 72 hours before the scheduled meeting.",
      "Emergency and urgent-public-necessity meetings use the narrower procedures in Section 551.045 rather than the ordinary 72-hour rule.",
      "Cities, counties, school districts, state agencies, and other bodies can have additional location or Internet-posting requirements, so the general rule is only the starting point.",
    ],
    intro: ["Open-meeting notice is meant to tell the public not merely that officials will gather, but what public business they will consider. Chapter 551 combines a general notice rule with body-specific and emergency provisions."],
    sections: [
      { heading: "Notice must identify when, where and what", paragraphs: ["Section 551.041 requires written notice stating the date, hour, place, and subject of each meeting. Agenda language must be sufficient under the Act as applied to the subject being considered."] },
      { heading: "The general posting window is at least 72 hours", paragraphs: ["Section 551.043 provides the baseline 72-hour accessibility period before a scheduled meeting. Other sections specify where and how different governmental bodies post their notices."] },
      { heading: "Emergencies use a narrower exception", paragraphs: ["Section 551.045 permits shorter notice only for an emergency or urgent public necessity as defined by the statute. The exception is not a general convenience rule for late-added business."] },
      { heading: "Special bodies may have additional posting duties", paragraphs: ["Chapter 551 contains separate provisions for municipalities, counties, school districts, state bodies, and other entities. Some agencies also operate under statutes requiring Internet posting or broadcasting in addition to Chapter 551."] },
    ],
    faq: [
      { q: "How far in advance must a normal Texas open meeting be posted?", a: "The general Chapter 551 rule is at least 72 hours before the scheduled meeting, subject to statutes that impose additional or different requirements." },
      { q: "Can a board add a major item at the meeting without public notice?", a: "The Open Meetings Act generally requires advance notice of the subject to be considered. Emergency procedures are narrow and separately regulated." },
      { q: "Does every governmental body post notice in exactly the same place?", a: "No. Chapter 551 contains body-specific posting provisions, and special statutes can add Internet or other notice duties." },
    ],
    sources: [omaChapter, oagResources],
    related: [
      { label: "Public comment at Texas meetings", href: "/guides/texas-open-meetings-public-comment-law" },
      { label: "Closed sessions", href: "/guides/texas-open-meetings-closed-session-law" },
      { label: "Meeting minutes and recordings", href: "/guides/texas-open-meetings-minutes-records-law" },
    ],
  },

  "texas-open-meetings-public-comment-law": {
    ...common,
    slug: "texas-open-meetings-public-comment-law",
    title: "Texas Open Meetings Public Comment Law: Speaking on Agenda Items",
    dek: "The Section 551.007 right to address many Texas governmental bodies on agenda items, reasonable speaking rules, criticism of government, and the difference between public testimony and a board's duty to deliberate.",
    keyTakeaways: [
      "Government Code Section 551.007 requires covered governmental bodies to allow each member of the public who wishes to address the body regarding an agenda item to do so before or during consideration of that item.",
      "A governmental body may adopt reasonable rules concerning the public's right to address it, including reasonable time limits and procedures that are applied consistently with the statute.",
      "Section 551.007 restricts governmental bodies from prohibiting public criticism of the governmental body, including criticism of its acts, omissions, policies, procedures, programs, or services, subject to lawful rules addressing disruption and other conduct.",
      "The right to address a governmental body does not require officials to debate or take action on a subject that is not properly posted on the meeting agenda.",
    ],
    intro: ["Texas law gives the public more than a right to sit silently through many open meetings. Section 551.007 establishes a statutory opportunity to speak on agenda items while preserving reasonable meeting-management rules."],
    sections: [
      { heading: "The right attaches to agenda items", paragraphs: ["Section 551.007 requires a covered governmental body to allow a member of the public who wants to address it regarding an agenda item to speak before or during the body's consideration of that item."] },
      { heading: "Reasonable rules are allowed", paragraphs: ["Boards can adopt reasonable procedures, including speaking-time limits and sign-up practices. Rules must be administered consistently with the statutory right rather than used as a pretext to suppress a disfavored viewpoint."] },
      { heading: "Criticism of government receives statutory protection", paragraphs: ["The statute specifically addresses public criticism of the governmental body and its conduct, policies, procedures, programs, and services. That protection does not eliminate lawful authority to address actual disruption or conduct outside the scope of protected comment."] },
      { heading: "Public comment does not expand the posted agenda", paragraphs: ["Officials can listen to comments, but the Open Meetings Act's notice requirements still govern deliberation and action. A speaker's remarks do not automatically authorize the body to deliberate an unposted subject."] },
    ],
    faq: [
      { q: "Can a Texas governmental body limit each speaker's time?", a: "Yes. Section 551.007 allows reasonable rules, including reasonable time limits, so long as the statutory right is respected." },
      { q: "Can officials ban criticism during public comment?", a: "Section 551.007 restricts a governmental body from prohibiting public criticism of the body and specified aspects of its conduct, subject to lawful meeting rules." },
      { q: "Must the board answer my questions during public comment?", a: "No. The statute provides an opportunity to address the body; it does not generally require an immediate debate or response." },
    ],
    sources: [omaChapter, { label: "Texas Government Code § 551.007", url: "https://statutes.capitol.texas.gov/?artSec=551.007&chapter=GV.551&code=GV&tab=1" }],
    related: [
      { label: "Open-meeting notice", href: "/guides/texas-open-meetings-notice-law" },
      { label: "Recording an open meeting", href: "/guides/texas-open-meetings-recording-law" },
      { label: "Meeting minutes and recordings", href: "/guides/texas-open-meetings-minutes-records-law" },
    ],
  },

  "texas-open-meetings-closed-session-law": {
    ...common,
    slug: "texas-open-meetings-closed-session-law",
    title: "Texas Closed Meetings and Executive Sessions: When a Government Body May Deliberate Privately",
    dek: "When the Texas Open Meetings Act permits a closed session, required announcements and records, attorney consultations and real-property exceptions, and why final action must return to open session.",
    keyTakeaways: [
      "Texas governmental bodies may close a meeting only when a specific constitutional or statutory exception authorizes the closed deliberation.",
      "Chapter 551 includes exceptions for subjects such as certain attorney consultations, real-property deliberations, personnel matters, security matters, and other specifically listed situations.",
      "Before a closed meeting, the presiding officer must publicly announce the applicable statutory authority, and Section 551.103 generally requires a certified agenda or recording of the closed meeting except for a private attorney consultation under Section 551.071.",
      "Section 551.102 requires a final action, decision, or vote on a matter deliberated in a closed meeting to be made in an open meeting that complies with the Act.",
    ],
    intro: ["An 'executive session' is not a general privilege to discuss difficult or controversial matters in private. The governmental body must fit the discussion within an authorized exception and comply with the procedural safeguards in Chapter 551."],
    sections: [
      { heading: "Closed sessions require a specific legal exception", paragraphs: ["Sections 551.071 through 551.089 and other statutes authorize particular closed-meeting subjects. The existence of confidential information does not by itself create an unlimited closed-session power."] },
      { heading: "The body must announce the legal basis", paragraphs: ["The Open Meetings Act requires the governmental body to identify the statutory section authorizing the closed meeting before it convenes privately. The posted agenda must also satisfy the Act's notice rules."] },
      { heading: "Closed-session records are specially protected", paragraphs: ["Section 551.103 generally requires either a certified agenda or recording of the closed proceedings, with an exception for private consultations under Section 551.071. Chapter 551 restricts public disclosure of those closed-session records."] },
      { heading: "Final action returns to open session", paragraphs: ["Section 551.102 requires any final action, decision, or vote on a matter deliberated privately to occur in an open meeting. A closed-session consensus is not a substitute for the required public action."] },
    ],
    faq: [
      { q: "Can a Texas board go into executive session whenever it wants privacy?", a: "No. A specific statutory or constitutional exception must authorize the closed deliberation." },
      { q: "Can the board take its final vote in executive session?", a: "No. Section 551.102 requires final action, decision, or vote to occur in an open meeting." },
      { q: "Is every closed session recorded?", a: "Section 551.103 generally requires a certified agenda or recording, except for the private attorney consultation described in Section 551.071." },
    ],
    sources: [omaChapter, oagResources],
    related: [
      { label: "Open-meeting notice", href: "/guides/texas-open-meetings-notice-law" },
      { label: "Public comment", href: "/guides/texas-open-meetings-public-comment-law" },
      { label: "Meeting minutes and recordings", href: "/guides/texas-open-meetings-minutes-records-law" },
    ],
  },

  "texas-open-meetings-recording-law": {
    ...common,
    slug: "texas-open-meetings-recording-law",
    title: "Recording Texas Open Meetings: Cameras, Audio and Reasonable Rules",
    dek: "The public's right under Government Code Section 551.023 to record an open meeting, the governmental body's authority to adopt reasonable rules, and the difference between public recording and closed-session records.",
    keyTakeaways: [
      "Government Code Section 551.023 allows a person in attendance at an open meeting of a governmental body to record all or any part of the meeting by audio or video or other means of sonic reproduction.",
      "A governmental body may adopt reasonable rules to maintain order at the meeting, including rules relating to the location of recording equipment and the manner in which recording is conducted.",
      "Reasonable meeting-management rules do not erase the statutory right to record an open meeting.",
      "Section 551.023 concerns open meetings; it does not give a member of the public access to or a right to record a lawful closed session.",
    ],
    intro: ["Texas's Open Meetings Act expressly addresses public recording. That makes the issue different from facilities where recording depends solely on local policy: at a Chapter 551 open meeting, Section 551.023 supplies a statutory baseline."],
    sections: [
      { heading: "The public may record an open meeting", paragraphs: ["Section 551.023 authorizes a person attending an open meeting to make audio, video, or other sonic recordings of all or part of the meeting."] },
      { heading: "The governmental body may manage equipment reasonably", paragraphs: ["A board can adopt reasonable rules concerning recording equipment and meeting order, such as placement that avoids blocking aisles or interfering with participants. Those rules must remain consistent with the statutory recording right."] },
      { heading: "Recording rights do not create a right to disrupt", paragraphs: ["The Act protects recording, not conduct that prevents the meeting from functioning. A neutral rule aimed at safety, access, or actual disruption can coexist with Section 551.023."] },
      { heading: "Closed sessions are different", paragraphs: ["A lawful executive session is not an open meeting for purposes of the public recording right. Closed-session certified agendas and recordings are governed by separate provisions of Chapter 551."] },
    ],
    faq: [
      { q: "Can I video-record a Texas city council or school-board open meeting?", a: "If the meeting is governed by Chapter 551, Section 551.023 generally allows a person in attendance to record the open meeting." },
      { q: "Can officials tell me where to place a tripod?", a: "They may adopt reasonable rules concerning recording equipment and meeting order, but those rules cannot nullify the statutory right." },
      { q: "Does Section 551.023 let me record an executive session?", a: "No. The public recording right applies to open meetings; closed sessions are governed by separate rules." },
    ],
    sources: [omaChapter, { label: "Texas Government Code § 551.023", url: "https://statutes.capitol.texas.gov/?artSec=551.023&chapter=GV.551&code=GV&tab=1" }],
    related: [
      { label: "Public comment", href: "/guides/texas-open-meetings-public-comment-law" },
      { label: "Meeting minutes and recordings", href: "/guides/texas-open-meetings-minutes-records-law" },
      { label: "Closed sessions", href: "/guides/texas-open-meetings-closed-session-law" },
    ],
  },

  "texas-open-meetings-minutes-records-law": {
    ...common,
    slug: "texas-open-meetings-minutes-records-law",
    title: "Texas Open Meeting Minutes and Recordings: Required Records and Public Access",
    dek: "What Texas governmental bodies must preserve from open meetings, the contents required by Section 551.021, public inspection under Section 551.022, and how official records differ from a citizen's recording.",
    keyTakeaways: [
      "Government Code Section 551.021 requires a governmental body to prepare and keep minutes or make a recording of each open meeting.",
      "The minutes must state the subject of each deliberation and indicate each vote, order, decision, or other action taken.",
      "Section 551.022 makes the minutes and recordings of an open meeting public records and requires them to be available for public inspection and copying on request to the governmental body's chief administrative officer or designee.",
      "The body's official minutes or recording are separate from the public's independent right to record an open meeting under Section 551.023.",
    ],
    intro: ["Open government continues after the meeting adjourns. Chapter 551 requires an official record of each open meeting and makes that record available to the public, creating a durable way to check what was discussed and what action was taken."],
    sections: [
      { heading: "Every open meeting needs minutes or an official recording", paragraphs: ["Section 551.021 requires the governmental body to prepare and keep minutes or make a recording of each open meeting. The statute permits either form for the official meeting record."] },
      { heading: "Minutes must capture subjects and actions", paragraphs: ["The minutes must identify the subject of each deliberation and each vote, order, decision, or other action. They need not be a verbatim transcript unless another law or policy requires more."] },
      { heading: "Open-meeting records are public records", paragraphs: ["Section 551.022 makes the minutes and recordings public and available for public inspection and copying upon request to the governmental body's chief administrative officer or designee."] },
      { heading: "Citizen recordings remain separate", paragraphs: ["A member of the public may also record the meeting under Section 551.023. A citizen's video is not automatically the governmental body's official meeting record, and the body's recordkeeping duty remains its own."] },
    ],
    faq: [
      { q: "Must a Texas board keep verbatim minutes?", a: "Not under the basic Section 551.021 rule. It must keep minutes or make a recording, and minutes must state deliberation subjects and official actions." },
      { q: "Can I inspect the official recording of an open meeting?", a: "Section 551.022 makes open-meeting minutes and recordings public records available for inspection and copying on request." },
      { q: "Does my own recording replace the board's recordkeeping duty?", a: "No. The governmental body's Section 551.021 duty is separate from the public's Section 551.023 recording right." },
    ],
    sources: [omaChapter, oagResources],
    related: [
      { label: "Recording an open meeting", href: "/guides/texas-open-meetings-recording-law" },
      { label: "Open-meeting notice", href: "/guides/texas-open-meetings-notice-law" },
      { label: "Closed sessions", href: "/guides/texas-open-meetings-closed-session-law" },
    ],
  },
};
