export type JudicialConductMember = {
  name: string;
  role: "Judge member" | "Public member";
  location: string;
  appointedBy: "Supreme Court of Texas" | "Governor";
  termExpires: string;
  officer?: "Chair" | "Vice-Chair" | "Secretary";
};

export type JudicialConductSource = {
  label: string;
  href: string;
};

export const SCJC_REVIEWED = "2026-09-08";

export const SCJC_QUICK_FACTS = [
  {
    value: "13",
    label: "commissioners",
    detail: "Six judges or justices are appointed by the Supreme Court of Texas and seven citizen members are appointed by the governor, all with Senate confirmation.",
  },
  {
    value: "1965",
    label: "constitutional creation",
    detail: "Texas voters created the judicial-discipline commission through an amendment to Article V of the Texas Constitution.",
  },
  {
    value: "30 days",
    label: "key review window",
    detail: "A sanctioned judge generally has 30 days to request a Special Court of Review; a complainant also has a 30-day statutory window for qualifying reconsideration of a dismissal.",
  },
  {
    value: "Not a court",
    label: "discipline, not appellate review",
    detail: "The Commission administers judicial discipline. It cannot reverse a ruling, change a sentence, award damages, or remove a judge from a particular case.",
  },
] as const;

export const SCJC_CURRENT_MEMBERS: JudicialConductMember[] = [
  { name: "Ken Wise", role: "Judge member", location: "Houston", appointedBy: "Supreme Court of Texas", termExpires: "12/31/2031", officer: "Chair" },
  { name: "Andrew M. \"Andy\" Kahan", role: "Public member", location: "Houston", appointedBy: "Governor", termExpires: "12/31/2031", officer: "Vice-Chair" },
  { name: "Derek M. Cohen", role: "Public member", location: "Austin", appointedBy: "Governor", termExpires: "12/31/2029", officer: "Secretary" },
  { name: "Wayne Money", role: "Judge member", location: "Greenville", appointedBy: "Supreme Court of Texas", termExpires: "12/31/2029" },
  { name: "Sid L. Harle", role: "Judge member", location: "San Antonio", appointedBy: "Supreme Court of Texas", termExpires: "12/31/2029" },
  { name: "Kevin Yeary", role: "Judge member", location: "Austin", appointedBy: "Supreme Court of Texas", termExpires: "12/31/2027" },
  { name: "Ana E. Estevez", role: "Judge member", location: "Amarillo", appointedBy: "Supreme Court of Texas", termExpires: "12/31/2027" },
  { name: "Grant Dorfman", role: "Judge member", location: "Houston", appointedBy: "Supreme Court of Texas", termExpires: "12/31/2031" },
  { name: "April I. Aguirre", role: "Public member", location: "Pasadena", appointedBy: "Governor", termExpires: "12/31/2029" },
  { name: "Yinon Weiss", role: "Public member", location: "Austin", appointedBy: "Governor", termExpires: "12/31/2031" },
  { name: "Tracy L. Harrison", role: "Public member", location: "Friendswood", appointedBy: "Governor", termExpires: "12/31/2031" },
  { name: "JJ Isbell", role: "Public member", location: "Houston", appointedBy: "Governor", termExpires: "12/31/2027" },
  { name: "Martin Deleon Jr.", role: "Public member", location: "Corpus Christi", appointedBy: "Governor", termExpires: "12/31/2027" },
];

export const SCJC_JURISDICTION = {
  covers: [
    "Municipal judges",
    "Magistrates",
    "Justices of the peace",
    "Constitutional county judges",
    "County court at law judges",
    "Statutory probate judges",
    "District judges",
    "Appellate judges and justices",
    "Retired and former judges sitting by assignment",
    "Associate judges and masters",
    "Judicial candidates for conduct within the Commission's constitutional authority",
  ],
  doesNotCover: [
    "Attorneys acting as attorneys, including prosecutors",
    "Federal judges and federal magistrate judges",
    "State-agency administrative hearing officers and the State Office of Administrative Hearings",
    "Private mediators or arbitrators",
    "Law-enforcement officers",
    "County and district clerks",
    "Jail or prison conditions and correctional officials as such",
  ],
} as const;

export const SCJC_LIMITS = [
  "The Commission cannot exercise appellate review or change a judge's ruling or sentence.",
  "It cannot remove a judge from a particular litigant's case.",
  "It cannot order a person released from jail or cancel a bench warrant.",
  "It does not provide legal representation or legal assistance in a pending case.",
  "It cannot award damages or monetary relief to a complainant.",
] as const;

export const SCJC_COMPLAINT_STEPS = [
  {
    title: "Use the official complaint form",
    text: "The Commission directs complainants to download its fillable complaint form or request a paper form by telephone. Anyone may file a complaint; an attorney is not required.",
  },
  {
    title: "Complete, sign, and swear to the complaint",
    text: "The current filing instructions require a completed, signed, sworn complaint form with the attached affidavit completed. The Commission asks complainants not to leave sections blank.",
  },
  {
    title: "Attach useful supporting material",
    text: "Court orders, pleadings, transcripts, recordings, correspondence, or other documentation can help the Commission understand the allegation. The Commission's FAQ asks that additional supporting material be received within 30 days after submission when possible.",
  },
  {
    title: "Mail it to the Commission",
    text: "Judicial complaints are mailed to State Commission on Judicial Conduct, P.O. Box 12265, Austin, Texas 78711. The Commission does not accept complaints by online form, telephone, email, or fax.",
  },
  {
    title: "Investigation and disposition",
    text: "An investigation can include legal research, documents, witness or complainant interviews, a letter of inquiry to the judge, and in some matters separate appearances before the Commission. Cases can take from a few months to more than a year.",
  },
] as const;

export const SCJC_DECISIONS = [
  {
    action: "Administrative dismissal",
    visibility: "Generally confidential",
    text: "Used when the submission does not state an allegation that would amount to judicial misconduct within the Commission's authority.",
  },
  {
    action: "Dismissal after review",
    visibility: "Generally confidential",
    text: "The Commission may dismiss when evidence is insufficient or the investigation concludes that sanctionable misconduct did not occur. A dismissal notice must explain the reason and the reconsideration process.",
  },
  {
    action: "Additional education",
    visibility: "May accompany private or public action",
    text: "The Commission can require targeted judicial education. Current constitutional limits adopted in 2025 apply to when private reprimands and additional education may be used.",
  },
  {
    action: "Private sanction",
    visibility: "Judge identity generally confidential",
    text: "Private admonitions, warnings, or reprimands address misconduct without publicly naming the judge, subject to the Constitution and Government Code.",
  },
  {
    action: "Public sanction",
    visibility: "Public",
    text: "Public admonitions, warnings, reprimands, and censures identify misconduct publicly. The Commission maintains a fiscal-year archive of public sanctions.",
  },
  {
    action: "Suspension",
    visibility: "Public in specified circumstances",
    text: "The Constitution and disciplinary rules authorize suspension in defined circumstances, including certain criminal charges. The 2025 amendment also expanded authority to order suspension without pay as punishment.",
  },
  {
    action: "Resignation agreement",
    visibility: "Public when accepted",
    text: "The Commission may accept a voluntary agreement to resign in lieu of disciplinary action; accepted resignation agreements are public.",
  },
  {
    action: "Formal proceedings / removal recommendation",
    visibility: "Public after formal charges",
    text: "Formal proceedings can lead to public censure or a recommendation for removal or retirement. The Commission itself does not enter the final removal order; that role belongs to the constitutionally prescribed review tribunal process.",
  },
] as const;

export const SCJC_REVIEW_PATHS = [
  {
    title: "Complainant: reconsideration after dismissal",
    text: "Government Code Section 33.035 allows a complainant to request reconsideration of a dismissed complaint within 30 days of the dismissal notice if the complainant provides additional evidence of judicial misconduct. A complainant may use that statutory reconsideration process only once.",
  },
  {
    title: "Judge: Special Court of Review",
    text: "A judge may generally appeal a public or private sanction or order of additional education within 30 days by asking the Chief Justice of the Supreme Court of Texas to appoint three appellate justices as a Special Court of Review. The proceeding is de novo, public, and the Special Court of Review's decision is final.",
  },
  {
    title: "Formal removal: Review Tribunal",
    text: "When the Commission recommends removal or retirement after formal proceedings, a Review Tribunal decides whether removal or retirement is warranted. The 2025 amendment changed how tribunal members are selected, giving the Chief Justice authority to select the appellate justices who serve. Review Tribunal decisions remain subject to the constitutional appellate route to the Supreme Court of Texas.",
  },
] as const;

export const SCJC_2025_REFORMS = [
  {
    title: "Six judicial members, seven citizen members",
    text: "Proposition 12 replaced the prior membership formula with six judges or justices appointed by the Supreme Court of Texas and seven citizens age 35 or older appointed by the governor, all subject to Senate confirmation.",
  },
  {
    title: "New limits on private reprimands and education",
    text: "The amendment restricted use of a private reprimand or an additional-training requirement to a person who had not previously received a private reprimand and to a complaint that does not allege criminal behavior.",
  },
  {
    title: "A stated threshold for public punishment",
    text: "Before a public admonition or punishment, the Commission must find willful or persistent conduct clearly inconsistent with proper judicial duties or determine that other good cause exists.",
  },
  {
    title: "Suspension without pay as punishment",
    text: "The amendment expanded the Commission's disciplinary authority to include suspension without pay as a punishment in the constitutional framework.",
  },
  {
    title: "Chief Justice selects Review Tribunal members",
    text: "The Chief Justice of the Supreme Court of Texas gained authority to select the appellate justices who serve on a tribunal reviewing a Commission recommendation for removal or retirement, without the former court-by-court designation requirement.",
  },
  {
    title: "New staggered terms began in 2026",
    text: "The Supreme Court and governor were directed to make initial appointments for two-, four-, and six-year terms beginning January 1, 2026; succeeding terms are six years, creating staggered membership.",
  },
] as const;

export const SCJC_TIMELINE = [
  { year: "1965", title: "Texas creates a judicial-discipline commission", text: "A constitutional amendment created the commission to investigate judicial misconduct or disability and discipline judges." },
  { year: "1970", title: "Jurisdiction broadens", text: "The Commission's authority, initially focused on appellate and district judges, was extended to additional categories of Texas judges." },
  { year: "1984", title: "More judicial officers come within reach", text: "The constitutional and statutory framework expanded to cover former judges, magistrates, masters, and related judicial officers in specified circumstances." },
  { year: "1987", title: "Special Court of Review process added", text: "Texas added statutory review of Commission sanctions, creating the de novo Special Court of Review mechanism used by sanctioned judges." },
  { year: "2001", title: "Modern statutory framework continues to develop", text: "Legislation revised Chapter 33 procedures, including public-hearing and complaint-disposition provisions, while statutory references to the former State Judicial Qualifications Commission were aligned with the State Commission on Judicial Conduct." },
  { year: "2013", title: "Transparency and reconsideration rules expand", text: "Legislation amended Chapter 33 to strengthen complaint notices, reconsideration procedures, and other Commission processes." },
  { year: "2022", title: "Judicial-candidate authority expands", text: "A constitutional change effective September 1, 2022 allowed the Commission, in its discretion, to investigate and sanction judicial candidates for violations within its authority." },
  { year: "2025", title: "Voters adopt Proposition 12", text: "Texas voters adopted SJR 27 as Proposition 12, changing Commission membership, discipline rules, and the Review Tribunal selection process." },
  { year: "2026", title: "New 13-member structure takes effect", text: "Initial Supreme Court and gubernatorial appointments under the new six-judge / seven-citizen structure began terms January 1, 2026." },
] as const;

export const SCJC_FAQS = [
  {
    question: "What does the State Commission on Judicial Conduct do?",
    answer: "It is the Texas judicial-branch agency that investigates allegations of judicial misconduct or incapacity and administers judicial discipline under Article V, Section 1-a of the Texas Constitution and Chapter 33 of the Government Code.",
  },
  {
    question: "Is the State Commission on Judicial Conduct a court?",
    answer: "No. Texas Government Code Section 33.002 expressly says the Commission administers judicial discipline but does not have the power or authority of a Texas court.",
  },
  {
    question: "Can the Commission reverse a judge's ruling?",
    answer: "No. It cannot exercise appellate review, change a ruling or sentence, remove a judge from a particular case, award damages, or provide legal representation. A court ruling must be challenged through the applicable appellate or other legal process.",
  },
  {
    question: "Who can file a complaint against a Texas judge?",
    answer: "Anyone may file a complaint, and a lawyer is not required. The Commission also has authority over a broad range of Texas judges and, within constitutional limits, judicial candidates.",
  },
  {
    question: "Can I file a Texas judicial complaint online or by email?",
    answer: "No. The Commission's current instructions require a completed, signed, sworn complaint form to be mailed. It says complaints are not accepted by online form, telephone, email, or fax.",
  },
  {
    question: "Are judicial complaints public in Texas?",
    answer: "Generally, Commission papers and proceedings are confidential unless law provides otherwise. Public sanctions, formal charges and proceedings, specified suspension records, and accepted resignation agreements are among the records that can become public.",
  },
  {
    question: "Can a Texas judge appeal a Commission sanction?",
    answer: "Yes. A judge may generally request a three-justice Special Court of Review within 30 days after a public or private sanction or order of education. The review is de novo and the Special Court of Review's decision is final.",
  },
  {
    question: "Can the Commission remove a judge from office?",
    answer: "The Commission can initiate formal proceedings and recommend removal or retirement, but it does not itself enter the final removal order. The constitutional Review Tribunal process determines removal, with the Supreme Court retaining the appellate role specified by the Constitution.",
  },
  {
    question: "What changed after Texas Proposition 12 in 2025?",
    answer: "The amendment changed the Commission to six judicial members appointed by the Supreme Court and seven citizen members appointed by the governor, revised rules for private and public discipline, expanded suspension-without-pay authority, changed Review Tribunal selection, and established staggered terms beginning in 2026.",
  },
] as const;

export const SCJC_SOURCES: JudicialConductSource[] = [
  { label: "State Commission on Judicial Conduct — About", href: "https://scjc.texas.gov/about/" },
  { label: "State Commission on Judicial Conduct — Commissioners", href: "https://scjc.texas.gov/about/commissioners/" },
  { label: "State Commission on Judicial Conduct — Governing Provisions", href: "https://scjc.texas.gov/about/governing-provisions/" },
  { label: "State Commission on Judicial Conduct — Complaints", href: "https://scjc.texas.gov/complaints/" },
  { label: "State Commission on Judicial Conduct — FAQ", href: "https://scjc.texas.gov/faq/" },
  { label: "State Commission on Judicial Conduct — Public Sanctions", href: "https://scjc.texas.gov/discipline/public-sanctions/" },
  { label: "State Commission on Judicial Conduct — Private Sanctions", href: "https://scjc.texas.gov/discipline/private-sanctions/" },
  { label: "State Commission on Judicial Conduct — Suspensions", href: "https://scjc.texas.gov/discipline/suspensions/" },
  { label: "State Commission on Judicial Conduct — Special Court of Review Opinions", href: "https://scjc.texas.gov/opinions/" },
  { label: "State Commission on Judicial Conduct — Rule 12 / Public Information", href: "https://scjc.texas.gov/public-information/rule-12/" },
  { label: "Texas Constitution — Article V", href: "https://statutes.capitol.texas.gov/Docs/CN/pdf/CN.5.pdf" },
  { label: "Texas Government Code — Chapter 33", href: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.33.htm" },
  { label: "89th Legislature — SJR 27 enrolled text", href: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SJ00027F.htm" },
  { label: "Texas Secretary of State — 2025 constitutional amendment explanatory statements", href: "https://www.sos.texas.gov/elections/forms/2025-explanatory-statements.pdf" },
  { label: "Texas Register — proclamation certifying 2025 constitutional amendments", href: "https://www.sos.texas.gov/texreg/archive/December52025/The%20Governor/The%20Governor.html" },
];
