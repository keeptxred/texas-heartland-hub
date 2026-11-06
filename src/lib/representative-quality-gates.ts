import pilot from "@/data/representative-research-pilot.json";
import expansion from "@/data/representative-research-script2.json";
import type { Rep } from "@/data/representatives";
import { speakerActivityFor } from "@/data/representative-speaker-activity";
import type { RepresentativeAuthority } from "@/data/representative-authority";

/** Internal publishing states, not Google's assessment of search quality. */
export type RepresentativeCertificationState =
  | "AUTHORITY_READY"
  | "NOT_READY"
  | "VERIFICATION_FAILED";

export type PilotResearchRecord = (typeof pilot.records)[number];

type EditorialReview = {
  name: string;
  office: "Texas Senate" | "Texas House";
  district: string;
  party: "R" | "D";
  officialUrl: string;
  biography: string;
  identityChecked: string;
  source: string;
};

/**
 * Explicit, dated identity reviews for the pilot. The summaries are written
 * against linked House/Senate primary biographies, not LLM-generated fillers.
 * A synchronized roster change that disagrees with a review FAILS CLOSED.
 */
export const EDITORIAL_REVIEWS: Record<string, EditorialReview> = {
  "chris-turner": {
    name: "Chris Turner", office: "Texas House", district: "House District 101", party: "D",
    officialUrl: "https://house.texas.gov/members/4680",
    biography: "Chris Turner serves House District 101 in Tarrant County, including Arlington and Grand Prairie. The House biography documents work on veterans benefits, school finance and earlier Democratic Caucus leadership. The 89th Legislature official committee list records State Affairs and Ways and Means, including chairmanship of the Property Tax Appraisals subcommittee, not the older assignments still described in his biography. The sourced bill histories below distinguish actual 89th-session legislative roles and outcomes from unverifiable roll-call totals.",
    identityChecked: "2026-11-06", source: "https://house.texas.gov/members/4680/biography",
  },
  "ana-maria-rodriguez-ramos": {
    name: "Ana-Maria Rodriguez Ramos", office: "Texas House", district: "House District 102", party: "D",
    officialUrl: "https://house.texas.gov/members/3735",
    biography: "Ana-María Rodríguez Ramos represents Dallas County House District 102 and was first elected in 2018. Her official House biography identifies a law and community-revitalization career, with education at UT Arlington, Texas Woman's University and Southern Methodist University. The 89th Legislature committee record lists Criminal Jurisprudence and Delivery of Government Efficiency, superseding earlier committee references in her biography. Official histories on this profile distinguish recorded individual sponsor roles and bill status without implying that every measure became law.",
    identityChecked: "2026-11-06", source: "https://house.texas.gov/members/3735/biography",
  },
  "rafael-anchia": {
    name: "Rafael Anchía", office: "Texas House", district: "House District 103", party: "D",
    officialUrl: "https://house.texas.gov/members/2150",
    biography: "Rafael Anchía represents House District 103 across western Dallas County communities. His House biography records previous Dallas ISD trustee service, Tulane legal education and leadership of the Mexican American Legislative Caucus. During the 89th Legislature he served on Environmental Regulation and State Affairs and chaired the Telecommunications and Broadband subcommittee, according to the official committee roster. Linked bill histories identify individual author or sponsor roles and their recorded outcomes, not a comprehensive collection of votes.",
    identityChecked: "2026-11-06", source: "https://house.texas.gov/members/2150/biography",
  },
  "jessica-gonzalez": {
    name: "Jessica González", office: "Texas House", district: "House District 104", party: "D",
    officialUrl: "https://house.texas.gov/members/3335",
    biography: "Jessica González represents Dallas County House District 104. Her official House biography records criminology and criminal-justice studies at UT Arlington, legal education and practice, and earlier public-policy work in Washington, D.C. The 89th Legislature committee roster lists Insurance, Judiciary and Civil Jurisprudence with Family and Fiduciary Relationships, and Local and Consent Calendars. The source-linked bill research distinguishes the documented role on each measure and its legislative status, rather than presenting all introductions as successful laws.",
    identityChecked: "2026-11-06", source: "https://house.texas.gov/members/3335/biography",
  },
  "terry-meza": {
    name: "Terry Meza", office: "Texas House", district: "House District 105", party: "D",
    officialUrl: "https://house.texas.gov/members/3455",
    biography: "Terry Meza represents House District 105 in the Irving area. Her House biography documents prior teaching, nonprofit economic-development and workforce work, and two decades of legal practice. Because that biography still names committee assignments from 2023, the 89th Legislature committee record is used for current-session scope: Corrections and Trade, Workforce and Economic Development. The dated government bill histories below record specific legislative sponsor roles and outcomes, not a complete lifetime total.",
    identityChecked: "2026-11-06", source: "https://house.texas.gov/members/3455/biography",
  },
  "jared-patterson": {
    name: "Jared Patterson", office: "Texas House", district: "House District 106", party: "R",
    officialUrl: "https://house.texas.gov/members/3655",
    biography: "Jared Patterson serves House District 106 in Denton County and was first elected in 2018. His official House biography cites Texas A&M University and describes legislative work related to school libraries, taxes, public safety and transportation. The published 89th Legislature committee roster records his chairmanship of Local and Consent Calendars and membership on Licensing and Administrative Procedures, Transportation and its Transportation Funding subcommittee. The linked bill histories distinguish recorded roles and outcomes from an unsupported assertion of floor votes.",
    identityChecked: "2026-11-06", source: "https://house.texas.gov/members/3655/biography",
  },
  "linda-garcia": {
    name: "Linda Garcia", office: "Texas House", district: "House District 107", party: "D",
    officialUrl: "https://house.texas.gov/members/4485",
    biography: "Linda Garcia represents Dallas County House District 107 from Mesquite. Her House biography is blank; the official Texas Legislative Directory instead identifies her occupation as author and records business and marketing education. The Texas Legislature's 89th-session member record confirms Delivery of Government Efficiency and Pensions, Investments and Financial Services committee assignments. This page does not invent a personal history from a missing biography. The official bill histories below document dated individual sponsorship roles and legislative outcomes.",
    identityChecked: "2026-11-06", source: "https://legdir.capitol.texas.gov/MemberInfo.aspx?Chamber=H&Code=A4485",
  },
  "morgan-meyer": {
    name: "Morgan Meyer", office: "Texas House", district: "House District 108", party: "R",
    officialUrl: "https://house.texas.gov/members/3075",
    biography: "Morgan Meyer represents House District 108 in Dallas County, including University Park and Highland Park. First elected in 2014, his official biography discusses prior Texas tax legislation and human-trafficking laws. The published 89th Legislature committee roster lists him as chair of Ways and Means and a member of House Administration. This profile separately links its own 89th-session records to distinguish authored or sponsored measures and their recorded status; older achievements are not automatically assigned to a later legislative session.",
    identityChecked: "2026-11-06", source: "https://house.texas.gov/members/3075/biography",
  },
  "aicha-davis": {
    name: "Aicha Davis", office: "Texas House", district: "House District 109", party: "D",
    officialUrl: "https://house.texas.gov/members/4465",
    biography: "Aicha Davis represents House District 109 in Dallas County and began legislative service in 2025, according to the Texas Legislative Reference Library. Because her official House biography is blank, this profile uses official Legislative Directory records documenting an education career, a Southern Mississippi bachelor's degree and a University of North Texas education master's degree. The 89th Legislature committee roster lists Higher Education and Human Services. Actual source-linked bill histories supply the dated activity instead of invented biography or voting totals.",
    identityChecked: "2026-11-06", source: "https://lrl.texas.gov/legeleaders/members/memberdisplay.cfm?memberID=5921",
  },
  "toni-rose": {
    name: "Toni Rose", office: "Texas House", district: "House District 110", party: "D",
    officialUrl: "https://house.texas.gov/members/2555",
    biography: "Toni Rose represents House District 110 in Dallas County, including Oak Cliff, Pleasant Grove and Balch Springs. Her official House biography describes health and mental-health policy work and a Paul Quinn College education. In the 89th Legislature she served as vice chair of Calendars and on Appropriations and Human Services, with Article II budget-subcommittee work documented in her House-issued newsletter. Official bill histories below distinguish individual legislative roles and enacted outcomes without relying on unsupported aggregate performance claims.",
    identityChecked: "2026-11-06", source: "https://house.texas.gov/members/2555/biography",
  },
  "yvonne-davis": {
    name: "Yvonne Davis", office: "Texas House", district: "House District 111", party: "D",
    officialUrl: "https://house.texas.gov/members/2625",
    biography: "Yvonne Davis represents House District 111 in Dallas County, where Texas Legislative Reference Library service records date her House tenure to 1993. The Library's official 89th Legislature committee history lists Land and Resource Management and State Affairs, which differ from her Judiciary and Transportation work in earlier sessions. Her linked 89th-session histories identify individual bill roles and recorded statuses rather than mixing decades of service into an unverified lifetime count or claiming every measure passed.",
    identityChecked: "2026-11-06", source: "https://lrl.texas.gov/legeleaders/members/memberdisplay.cfm?memberID=116",
  },
  "angie-button": {
    name: "Angie Button", office: "Texas House", district: "House District 112", party: "R",
    officialUrl: "https://house.texas.gov/members/2510",
    biography: "Angie Chen Button serves House District 112 in Dallas County communities including Garland, Richardson and Rowlett. Her House biography documents international marketing work at Texas Instruments, service with Dallas Area Rapid Transit, CPA credentials and graduate training in public finance and management science. The official 89th Legislature committee roster identifies her as chair of Trade, Workforce and Economic Development and a member of House Administration and Ways and Means. The sourced bill histories below identify particular legislative roles and recorded results rather than a complete voting record.",
    identityChecked: "2026-11-06", source: "https://house.texas.gov/members/2510/biography",
  },
  "david-lowe": {
    name: "David Lowe", office: "Texas House", district: "House District 91", party: "R",
    officialUrl: "https://house.texas.gov/members/4643",
    biography: "David Lowe represents Texas House District 91 in Tarrant County. His official House biography records U.S. Army military-police service, multiple overseas deployments including Afghanistan, and later law-enforcement work after Texas Peace Officer Academy training. The published 89th Legislature committee roster places him on Corrections and Intergovernmental Affairs and its County and Regional Government subcommittee. Linked official bill histories below document individual roles and the recorded outcomes of measures, rather than a lifetime bill total or roll-call voting history.",
    identityChecked: "2026-11-06", source: "https://house.texas.gov/members/4643/biography",
  },
  "salman-bhojani": {
    name: "Salman Bhojani", office: "Texas House", district: "House District 92", party: "D",
    officialUrl: "https://house.texas.gov/members/4115",
    biography: "Salman Bhojani represents House District 92 in Tarrant County. The official House biography describes his immigration to Texas as a teenager, legal and business career and previous service on the Euless City Council as mayor pro tem. The 89th Legislature's published standing-committee roster lists him as vice chair of Delivery of Government Efficiency and a Trade, Workforce and Economic Development member, including its workforce subcommittee. The official bill-history records below distinguish his separate recorded sponsorship roles and statuses without treating introduced legislation as enacted law.",
    identityChecked: "2026-11-06", source: "https://house.texas.gov/members/4115/biography",
  },
  "tony-tinderholt": {
    name: "Tony Tinderholt", office: "Texas House", district: "House District 94", party: "R",
    officialUrl: "https://house.texas.gov/members/3065",
    biography: "Tony Tinderholt represents House District 94, serving parts of Arlington, Fort Worth and surrounding Tarrant County communities. His official biography describes prior U.S. Air Force and Army service, a later teaching career and business ownership. The 89th Legislature standing-committee roster records Delivery of Government Efficiency and Higher Education, unlike older committee appointments still mentioned in parts of his biography; this dated roster governs the 89th-session summary. His cited bill histories identify actual legislative roles and outcomes, not presumed votes or complete lifetime activity.",
    identityChecked: "2026-11-06", source: "https://house.texas.gov/members/3065/biography",
  },
  "nicole-collier": {
    name: "Nicole Collier", office: "Texas House", district: "House District 95", party: "D",
    officialUrl: "https://house.texas.gov/members/2360",
    biography: "Nicole Collier represents House District 95 in Fort Worth. Her official biography documents a legal career and degrees from the University of Houston and Texas Wesleyan University School of Law, as well as earlier leadership of the Criminal Jurisprudence committee. The House's published 89th Legislature standing-committee assignments list Appropriations and Public Health, distinct from prior-session committee positions mentioned in the biography. The profile's linked 89th-session records trace actual individual bill roles and recorded status; they do not assume every bill passed or every legislative action was a personal floor vote.",
    identityChecked: "2026-11-06", source: "https://house.texas.gov/members/2360/biography",
  },
  "david-cook": {
    name: "David Cook", office: "Texas House", district: "House District 96", party: "R",
    officialUrl: "https://house.texas.gov/members/3960",
    biography: "David Cook represents House District 96, encompassing parts of Mansfield, Arlington, Kennedale, Crowley and other Tarrant County communities. The official House biography documents his Mansfield mayoral service from 2008 through 2021 and work as an attorney and managing partner. During the 89th Legislature, the published committee roster identifies Criminal Jurisprudence, the Juvenile Justice subcommittee chairmanship, and Delivery of Government Efficiency. The dated official bill histories below separate authorship and other sponsor roles from the recorded legislative outcome, not a comprehensive voting record.",
    identityChecked: "2026-11-06", source: "https://house.texas.gov/members/3960/biography",
  },
  "john-mcqueeney": {
    name: "John McQueeney", office: "Texas House", district: "House District 97", party: "R",
    officialUrl: "https://house.texas.gov/members/4665",
    biography: "John McQueeney was first elected in 2024 to represent House District 97 in southwest Tarrant County, including areas of Fort Worth. His official House biography documents a Texas Christian University business education and an earlier career in logistics, retail development and restaurant operations. The 89th Legislature standing-committee roster lists State Affairs, Licensing and Administrative Procedures, and the Telecommunications and Broadband subcommittee. Linked official 89th-session bill histories show documented individual sponsor roles and outcomes, not fabricated votes or a full legislative career inventory.",
    identityChecked: "2026-11-06", source: "https://house.texas.gov/members/4665/biography",
  },
  "giovanni-capriglione": {
    name: "Giovanni Capriglione", office: "Texas House", district: "House District 98", party: "R",
    officialUrl: "https://house.texas.gov/members/2345",
    biography: "Giovanni Capriglione represents House District 98 in northeast Tarrant County, including communities such as Keller, Southlake and Grapevine. His House biography documents a physics degree, finance MBA, a technology and investment career and ownership of a business-services company. The 89th Legislature committee assignment document lists him as chair of Delivery of Government Efficiency, and as a member of Ways and Means and its Property Tax Appraisals subcommittee. The individually cited bill histories distinguish recorded legislative roles from actual passage and do not claim to capture all votes.",
    identityChecked: "2026-11-06", source: "https://house.texas.gov/members/2345/biography",
  },
  "charlie-geren": {
    name: "Charlie Geren", office: "Texas House", district: "House District 99", party: "R",
    officialUrl: "https://house.texas.gov/members/2945",
    biography: "Charlie Geren represents Texas House District 99 in Tarrant County and was first elected in November 2000. His official biography documents earlier service on the Texas Water Development Board and Tarrant Regional Water District, along with commercial real estate work. The 89th Legislature's standing-committee assignment document identifies him as House Administration chair and a member of General Investigating, Licensing and Administrative Procedures, and State Affairs. This dated roster differs from some committee roles described in his biographical page. The official legislative histories below show individual sponsor roles and actual outcomes, not an unverified lifetime total.",
    identityChecked: "2026-11-06", source: "https://house.texas.gov/members/2945/biography",
  },
  "venton-jones": {
    name: "Venton Jones", office: "Texas House", district: "House District 100", party: "D",
    officialUrl: "https://house.texas.gov/members/4275",
    biography: "Venton Jones represents House District 100, which includes portions of South, West and East Dallas and Oak Cliff. First elected in 2022, his official House biography describes a nonprofit health-policy advocacy career and academic training in community health and health care administration. The published 89th Legislature standing-committee roster lists him as vice chair of Corrections and a member of Appropriations. The 89th-session bill histories linked below are dated examples of distinct recorded legislative roles and outcomes; they are not a complete roll-call voting record or proof that every measure became law.",
    identityChecked: "2026-11-06", source: "https://house.texas.gov/members/4275/biography",
  },
  "carl-tepper": {
    name: "Carl Tepper", office: "Texas House", district: "House District 84", party: "R",
    officialUrl: "https://house.texas.gov/members/4360",
    biography: "Carl Tepper represents House District 84, confined to Lubbock County. The official Texas House biography documents his service as an Air Force C-130 flight engineer during the Persian Gulf War, graduation from Texas Tech in 1995, and later commercial-real-estate and downtown Lubbock redevelopment work. His 89th House committee assignments include Appropriations, Calendars, Redistricting and Intergovernmental Affairs, including chairing its State-Federal Relations subcommittee. The source-linked 89th-session records below distinguish authorship from other sponsorship roles and recorded outcomes, rather than presenting an unverified total of votes or bills.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/4360/biography",
  },
  "stan-kitzman": {
    name: "Stan Kitzman", office: "Texas House", district: "House District 85", party: "R",
    officialUrl: "https://house.texas.gov/members/4280",
    biography: "Stan Kitzman represents House District 85, which includes Austin, Colorado, Fayette, Waller and Wharton counties and part of Fort Bend County. His official House biography identifies a former Waller County commissioner, public-school teacher and Texas A&M Agricultural Systems Management graduate. Kitzman served 21 years in the Texas Army National Guard, with three deployments. For the 89th Legislature he served on Appropriations, Agriculture and Livestock and the Sunset Advisory Commission, with additional leadership of the Appropriations Article III subcommittee and the Water Caucus. The dated bill-role histories below are samples of documented 89th-session work, not a complete voting or lifetime record.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/4280/biography",
  },
  "john-smithee": {
    name: "John Smithee", office: "Texas House", district: "House District 86", party: "R",
    officialUrl: "https://house.texas.gov/members/4530",
    biography: "John T. Smithee represents House District 86, comprising Armstrong, Dallam, Deaf Smith, Hartley, Oldham, Parmer and Randall counties in the Panhandle. The official Legislative Reference Library records his Texas House service beginning in 1985, including multiple committee chairmanships. The current Legislative Directory identifies his occupation as attorney and confirms a business degree from West Texas A&M and a law degree from Texas Tech. In the 89th Legislature he chairs Criminal Jurisprudence and serves on State Affairs. The House biography page itself contains no substantive biography, so this review relies on the official Legislative Directory, Legislative Reference Library and actual bill histories, and does not invent educational or personal claims.",
    identityChecked: "2026-11-05", source: "https://legdir.capitol.texas.gov/MemberInfo.aspx?Chamber=H&Code=A4530",
  },
  "caroline-fairly": {
    name: "Caroline Fairly", office: "Texas House", district: "House District 87", party: "R",
    officialUrl: "https://house.texas.gov/members/4480",
    biography: "Caroline Fairly represents House District 87 in the Amarillo area. Her official House biography identifies an Abilene Christian University Business Marketing graduate, previous congressional constituent-service work in Washington, D.C., and medical-negotiation experience with The OccuNet Company. In the 89th House, her committees include Appropriations, Local and Consent Calendars, Natural Resources and the Select Committee on Civil Discourse and Freedom of Speech in Higher Education. The official House member identifier is 4480, not district number 87; this source review corrects the permanent roster link. Specific official bill-history entries below distinguish recorded roles, legislative status and actual passage rather than treating introductions as laws.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/4480/biography",
  },
  "ken-king": {
    name: "Ken King", office: "Texas House", district: "House District 88", party: "R",
    officialUrl: "https://house.texas.gov/members/2455",
    biography: "Ken King represents House District 88, covering 19 counties across the Texas Panhandle and South Plains. His official House biography identifies earlier service as Canadian ISD school-board president and Hemphill County Appraisal District board chair, alongside his leadership of Black Gold Pump and Supply in Canadian. In the 89th Legislature he chaired State Affairs and participated in House Administration, the Energy Council and the House Research Organization board. These public office, district and committee facts are distinct from the 89th bill-role source histories displayed below; the sample does not claim to include his entire legislative record or all floor votes.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/2455/biography",
  },
  "candy-noble": {
    name: "Candy Noble", office: "Texas House", district: "House District 89", party: "R",
    officialUrl: "https://house.texas.gov/members/3740",
    biography: "Candy Noble represents House District 89 in eastern Collin County, including communities such as Lucas, Murphy, Princeton and Wylie. Her official House biography identifies an education degree from Hardin-Simmons University, where she also serves as a trustee, and long involvement in Collin County. For the 89th Legislature she serves on Human Services and Ways and Means and is vice chair of the Ways and Means subcommittee on Property Tax Appraisals. The source-linked official histories below separate each recorded bill-author, coauthor, sponsor or cosponsor role from the outcome, avoiding unsupported claims that a filing necessarily became law or reflected a recorded floor vote.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/3740/biography",
  },
  "ramon-romero": {
    name: "Ramon Romero", office: "Texas House", district: "House District 90", party: "D",
    officialUrl: "https://house.texas.gov/members/3060",
    biography: "Ramon Romero represents House District 90 in Fort Worth; the official Texas House biography styles his name Ramón Romero, Jr. and records a 2014 first election after service on the Fort Worth Zoning and Planning commissions. He founded A-Fast Tile and Coping and also owns Stone Mason Supply. In the 89th Legislature he chairs the Mexican American Legislative Caucus and serves on Calendars, Natural Resources and Licensing and Administrative Procedures. The bill-history section below draws individual roles from official 89th-session records and does not assume that all coauthored measures, sponsorships, amendments or floor votes are interchangeable.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/3060/biography",
  },
  "dustin-burrows": {
    name: "Dustin Burrows", office: "Texas House", district: "House District 83", party: "R",
    officialUrl: "https://house.texas.gov/members/3055",
    biography: "Dustin Burrows represents House District 83 and was elected by his House colleagues as the 77th Speaker in January 2025. His official House biography documents earlier leadership of the Calendars and Ways and Means committees and work on investigations of the Uvalde school shooting and Panhandle wildfires. The Speaker presides over floor debate and appoints committee members; those powers differ from authoring or sponsoring legislation. The dated 89th-Legislature Speaker records below show specific committee appointments, interim charges, House proceedings and public statements, without attributing another member’s bill or vote to Burrows.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/speaker",
  },
  "bryan-hughes": {
    name: "Bryan Hughes", office: "Texas Senate", district: "Senate District 1", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=1",
    biography: "Bryan Hughes represents Texas Senate District 1. The official Senate biography records his House service from 2003 to 2017 and his Senate service from 2017 onward. It lists his occupation as an attorney and his hometown as Mineola.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=1",
  },
  "judith-zaffirini": {
    name: "Judith Zaffirini", office: "Texas Senate", district: "Senate District 21", party: "D",
    officialUrl: "https://senate.texas.gov/member.php?d=21",
    biography: "Judith Zaffirini represents Texas Senate District 21. The official Senate member biography dates her service to 1987 and describes professional experience in communications and education, including 13 years of teaching.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=21",
  },
  "terri-leo-wilson": {
    name: "Terri Leo-Wilson", office: "Texas House", district: "House District 23", party: "R",
    officialUrl: "https://house.texas.gov/members/4290",
    biography: "Terri Leo-Wilson represents Texas House District 23, which includes Chambers County and part of Galveston County. Her official House biography describes prior work in elementary and special education and educational administration.",
    identityChecked: "2026-11-04", source: "https://www.house.texas.gov/members/4290/biography",
  },
  "mihaela-plesa": {
    name: "Mihaela Pleșa", office: "Texas House", district: "House District 70", party: "D",
    officialUrl: "https://house.texas.gov/members/4345",
    biography: "Mihaela Pleșa represents Texas House District 70 in parts of Collin County. The official House biography describes her as a vice chair of the Pensions, Investments and Financial Services committee and a member of the Elections committee.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4345/biography",
  },
  "shelley-luther": {
    name: "Shelley Luther", office: "Texas House", district: "House District 62", party: "R",
    officialUrl: "https://house.texas.gov/members/4645",
    biography: "Shelley Luther represents House District 62, covering Delta, Fannin, Franklin and Grayson counties. The official Legislative Directory identifies her as a business owner with a B.A. degree, while the Texas House member record lists her Sherman district office. Her 89th Legislature committee assignments include Health Care Affordability (Select), Intergovernmental Affairs, and Trade, Workforce and Economic Development. The linked official bill histories below distinguish individual sponsorship roles and recorded legislative outcomes without claiming to show all votes or complete career activity.",
    identityChecked: "2026-11-05", source: "https://legdir.capitol.texas.gov/memberInfo.aspx?Chamber=H&Code=A4645",
  },
  "mitch-little": {
    name: "Mitch Little", office: "Texas House", district: "House District 65", party: "R",
    officialUrl: "https://house.texas.gov/members/4615",
    biography: "Mitch Little represents House District 65 in Denton County. The official Legislative Directory lists his occupation as attorney and records a bachelor's degree from Harvard University and a law degree from the University of Texas. The Texas Legislative Reference Library lists his 89th Legislature committee work on Criminal Jurisprudence, Governmental Oversight (Select) and Transportation. The linked legislative histories below identify particular bill roles and recorded outcomes rather than a complete voting record or a lifetime sponsorship total.",
    identityChecked: "2026-11-05", source: "https://legdir.capitol.texas.gov/MemberInfo.aspx?Chamber=H&Code=A4615",
  },
  "matt-shaheen": {
    name: "Matt Shaheen", office: "Texas House", district: "House District 66", party: "R",
    officialUrl: "https://house.texas.gov/members/2995",
    biography: "Matt Shaheen represents Texas House District 66 in western Collin County, including portions of Plano, Frisco, Prosper, Celina and McKinney. His current House biography records five years of earlier service on the Collin County Commissioners Court and a technology career focused on corporate digital transformation. The House identifies him as chair of the Elections Committee and a member of Higher Education and the Sunset Advisory Commission. His separately cited 89th Legislature bill records identify authored or sponsored measures and their recorded outcomes, not a complete voting record.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/2995/biography",
  },
  "jeff-leach": {
    name: "Jeff Leach", office: "Texas House", district: "House District 67", party: "R",
    officialUrl: "https://house.texas.gov/members/2475",
    biography: "Jeff Leach represents Texas House District 67 in Collin County. His House biography documents undergraduate study at Baylor University and a law degree from Southern Methodist University, followed by a career in commercial and civil litigation. For the 89th Legislature, the House identifies him as chair of Judiciary and Civil Jurisprudence, with assignments to Public Education and Calendars. His public legislative history includes work on the judiciary, property taxes, water and education. Individual source-linked bills below distinguish his recorded authorship or sponsorship roles from enactment and voting records.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/2475/biography",
  },
  "david-spiller": {
    name: "David Spiller", office: "Texas House", district: "House District 68", party: "R",
    officialUrl: "https://house.texas.gov/members/4075",
    biography: "David Spiller represents a twelve-county North and Central Texas House District 68, with communities stretching from the Red River south toward Lampasas. His official biography identifies him as a Jacksboro resident who earned a business degree at the University of Texas at Austin and a law degree at St. Mary's University, then practiced law and served as a Jacksboro school board trustee for 26 years. The district includes substantial rural communities, making school, hospital, infrastructure and water questions locally consequential. The linked bill histories show specific legislative roles and statuses rather than unverified claims of successful passage.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/4075/biography",
  },
  "james-frank": {
    name: "James Frank", office: "Texas House", district: "House District 69", party: "R",
    officialUrl: "https://house.texas.gov/members/2385",
    biography: "James Frank represents Texas House District 69, which includes Wichita Falls and a broad group of North and Northwest Texas counties. According to his House biography, he earned a finance degree from Texas A&M University, worked in banking and later helped grow manufacturing businesses in Wichita Falls. First elected in 2012, he previously chaired Human Services and served during the 89th Legislature on Public Education and Public Health, including leadership of a Public Health subcommittee. Separately cited official bill records identify measures linked to his author or sponsor roles, the recorded outcomes and primary legislative sources.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/2385/biography",
  },
  "keresa-richardson": {
    name: "Keresa Richardson", office: "Texas House", district: "House District 61", party: "R",
    officialUrl: "https://house.texas.gov/members/4735",
    biography: "Keresa Richardson represents Texas House District 61, including part of Collin County. Her official Texas House biography identifies her as chief executive of The Lawton Group, which operates plumbing, HVAC, electrical, refrigeration and pest-control services in Texas. It describes more than forty years of business experience and her work advocating for small businesses and women in skilled trades. The linked 89th Legislature records below separately identify her recorded bill roles and legislative outcomes, not floor votes or an exhaustive career history.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/4735/biography",
  },
  "ben-bumgarner": {
    name: "Ben Bumgarner", office: "Texas House", district: "House District 63", party: "R",
    officialUrl: "https://house.texas.gov/members/4125",
    biography: "Ben Bumgarner represents House District 63 in southern Denton County, including parts of Flower Mound and Lewisville. His official Texas House biography documents earlier service on the Flower Mound Town Council and as mayor pro tem, a history degree from Austin College, and small-business ownership. During the 89th Legislature he served on Environmental Regulation and Pensions, Investments and Financial Services committees. This profile's separately linked official bill histories show specific authorship or sponsorship roles and recorded outcomes rather than claiming every bill passed.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/4125/biography",
  },
  "andy-hopper": {
    name: "Andy Hopper", office: "Texas House", district: "House District 64", party: "R",
    officialUrl: "https://house.texas.gov/members/4555",
    biography: "Andy Hopper represents House District 64, covering Wise County and part of Denton County, and began House service in 2025. His official Texas House biography records graduating from the University of North Texas in 2000, working in defense-industry software engineering, owning a software company, and serving in the Texas State Guard since 2014. The 89th Legislature records below link particular measures to his documented bill roles and statuses; they are not presented as his voting history or the complete set of bills on which he worked.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/4555/biography",
  },
  "sheryl-cole": {
    name: "Sheryl Cole", office: "Texas House", district: "House District 46", party: "D",
    officialUrl: "https://house.texas.gov/members/3625",
    biography: "Sheryl Cole represents House District 46 in the East Austin, Manor and Pflugerville communities. Her official Texas House biography describes previous service on the Austin City Council as mayor pro tem, community organizing for Austin schools, and accounting and law degrees from the University of Texas. First elected to the House in 2018, she serves as vice chair of House Administration and the County and Regional Government subcommittee while participating in Culture, Recreation and Tourism and Intergovernmental Affairs. Official bill histories below distinguish her individual roles and recorded outcomes.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/3625/biography",
  },
  "vikki-goodwin": {
    name: "Vikki Goodwin", office: "Texas House", district: "House District 47", party: "D",
    officialUrl: "https://house.texas.gov/members/3820",
    biography: "Vikki Goodwin represents Texas House District 47 in western Travis County, including communities around southwest Austin, Bee Cave and Lakeway. Her official biography documents a business-administration degree and master's in public affairs from the University of Texas at Austin, followed by work in real estate and small business. Elected in 2018, she has worked on child-care safety, domestic-violence protections, food resilience and housing policy. The 89th Legislature bill research on this page separates authorship and coauthor roles from recorded legislative status and does not imply every listed bill became law.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/3820/biography",
  },
  "donna-howard": {
    name: "Donna Howard", office: "Texas House", district: "House District 48", party: "D",
    officialUrl: "https://house.texas.gov/members/3310",
    biography: "Donna Howard represents House District 48 in Travis County and has served in the Texas House since 2006. Her official biography records nursing and health-education degrees from the University of Texas, experience as a critical-care nurse in Austin and a term on the Eanes ISD board. During the 89th Legislature she is vice chair of the Appropriations Article II subcommittee and vice chair of Higher Education, and she chairs the Texas Women's Health Caucus. The linked official bill histories separately identify individual sponsorship roles and the outcomes recorded for each measure.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/3310/biography",
  },
  "gina-hinojosa": {
    name: "Gina Hinojosa", office: "Texas House", district: "House District 49", party: "D",
    officialUrl: "https://house.texas.gov/members/3210",
    biography: "Gina Hinojosa represents Texas House District 49 in central Austin. Her House biography documents growing up in the Rio Grande Valley, attending the University of Texas and George Washington University law school, and practicing civil-rights and labor law. She served on the Austin ISD school board and became its president before her 2016 election to the House. Her House assignments have included Public Education and Business and Industry, reflecting an education-policy focus; specific bill authorship and sponsorship claims below are limited to source-linked 89th Legislature records.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/3210/biography",
  },
  "james-talarico": {
    name: "James Talarico", office: "Texas House", district: "House District 50", party: "D",
    officialUrl: "https://house.texas.gov/members/3685",
    biography: "James Talarico represents Texas House District 50 in Travis County. According to his official Texas House biography, he was born in Round Rock, attended McNeil High School and studied at the University of Texas at Austin and Harvard University. Before his 2018 election he taught middle school in San Antonio. His House committee service includes Public Education, Juvenile Justice and Family Issues and Calendars, while legislative priorities have included school finance, child care and prescription-drug costs. Linked official histories document particular bill roles and recorded outcomes.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/3685/biography",
  },
  "lulu-flores": {
    name: "Lulu Flores", office: "Texas House", district: "House District 51", party: "D",
    officialUrl: "https://house.texas.gov/members/4150",
    biography: "Maria Luisa 'Lulu' Flores represents Texas House District 51 in Travis County and was first elected in 2022. Her official Texas House biography records government and law degrees from the University of Texas at Austin and early legislative work for Representative Irma Rangel, including domestic-violence legislation. She later held policy roles with the State Bar of Texas and Texas Railroad Commission and worked in private law practice. In the House she serves on Judiciary and Civil Jurisprudence and is vice chair of Culture, Recreation and Tourism; linked histories identify distinct bill roles and results.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4150/biography",
  },
  "caroline-harris-davila": {
    name: "Caroline Harris Davila", office: "Texas House", district: "House District 52", party: "R",
    officialUrl: "https://house.texas.gov/members/4205",
    biography: "Caroline Harris Davila represents House District 52 in Williamson County, including Round Rock. Her official House biography identifies her upbringing in Round Rock, communications education at Thomas Edison State College and a master's in public affairs from the University of Texas at Austin's LBJ School. Elected at age 28, she entered the House as its youngest female Republican elected to that point. Her recorded legislative activity includes a focus on healthcare billing transparency and small businesses; 89th Legislature source-linked records on this page distinguish each documented role and outcome.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4205/biography",
  },
  "brad-buckley": {
    name: "Brad Buckley", office: "Texas House", district: "House District 54", party: "R",
    officialUrl: "https://house.texas.gov/members/3585",
    biography: "Brad Buckley represents House District 54 in Bell County and the Fort Hood area. His official Texas House biography identifies him as a Killeen-area veterinarian who earned undergraduate and veterinary degrees from Texas A&M University in 1989 and 1993. He previously served on the Killeen ISD board and in the Greater Killeen Chamber of Commerce. During the 89th Legislature he chairs the House Public Education Committee and serves on Natural Resources; the legislative research table cites recorded bill roles and outcomes from official sources rather than treating them as his full career totals.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/3585/biography",
  },
  "hillary-hickland": {
    name: "Hillary Hickland", office: "Texas House", district: "House District 55", party: "R",
    officialUrl: "https://house.texas.gov/members/4520",
    biography: "Hillary Hickland represents Texas House District 55 in central Bell County, which includes Temple, Belton and Harker Heights. Her official House biography describes a bachelor's degree from Baylor University, a master's degree in criminal justice from Boston University and earlier work teaching English in Mexico. She began House service in 2025 after organizing and advocating on family issues. In the 89th Legislature she serves on Ways and Means, Redistricting, Homeland Security, Public Safety and Veterans' Affairs and related defense subcommittees; official bill-role histories provide measure-specific outcomes.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4520/biography",
  },
  "shelby-slawson": {
    name: "Shelby Slawson", office: "Texas House", district: "House District 59", party: "R",
    officialUrl: "https://house.texas.gov/members/4055",
    biography: "Shelby Slawson represents Texas House District 59 in Central Texas. Her official House biography identifies her as a Stephenville attorney and entrepreneur who attended Tarleton State University, graduated from the University of Texas at Dallas and earned her law degree at the University of Texas at Austin. Her legislative career includes committee service on Calendars, State Affairs and Pensions, Investments and Financial Services, though the official biography describes earlier-session appointments rather than the complete current committee roster. The linked 89th Legislature bill records give separate measure-specific roles and outcomes.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4055/biography",
  },
  "erin-gamez": {
    name: "Erin Gámez", office: "Texas House", district: "House District 38", party: "D",
    officialUrl: "https://house.texas.gov/members/4095",
    biography: "Erin Gámez represents Texas House District 38 in part of Cameron County. Her official House biography records that she grew up in Brownsville, graduated from the University of Texas at Austin in 2010 and earned a law degree from South Texas College of Law in 2014. She has worked as a Brownsville attorney, including in the county's mental-health diversion court, and took office following a March 2022 special election. During the 89th Legislature she serves on General Investigating, Transportation and Natural Resources; the linked bill histories distinguish specific roles and results.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4095/biography",
  },
  "mando-martinez": {
    name: "Mando Martinez", office: "Texas House", district: "House District 39", party: "D",
    officialUrl: "https://house.texas.gov/members/3780",
    biography: "Armando 'Mando' Martinez represents House District 39 in Hidalgo County, including Weslaco, Mercedes and Donna. The official House biography records his first election in 2004, work as a firefighter, licensed paramedic and critical-care flight paramedic, and education at the University of Texas–Pan American and UTRGV. His public service includes medical training, fire instruction and small-business ownership. He has held appointments on the House Transportation and Culture, Recreation and Tourism committees; official bill histories below attribute each recorded legislative role separately.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/3780/biography",
  },
  "terry-canales": {
    name: "Terry Canales", office: "Texas House", district: "House District 40", party: "D",
    officialUrl: "https://house.texas.gov/members/2340",
    biography: "Terry Canales represents House District 40 in the Hidalgo County area and was first elected in 2012. His official House biography documents a degree from the University of the Incarnate Word and a law degree from St. Mary's University, followed by legal practice in Edinburg. He previously chaired the Transportation Committee and in 2025 was appointed chair of Transportation Funding, while also serving on Calendars and Homeland Security, Public Safety and Veterans' Affairs. The legislative table below links individual bill roles to original state histories instead of implying a voting record.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/2340/biography",
  },
  "bobby-guerra": {
    name: "Bobby Guerra", office: "Texas House", district: "House District 41", party: "D",
    officialUrl: "https://house.texas.gov/members/2325",
    biography: "R.D. 'Bobby' Guerra represents Texas House District 41 in Hidalgo County, including areas around McAllen, Mission and Edinburg. His official Texas House biography describes studying biology and chemistry at Pan American University, working as a television reporter, and earning a law degree from Texas Southern University in 1985. Before his election to the House in 2012, he served as Hidalgo County Democratic Party chair. House committee appointments have included Energy Resources, Environmental Regulation and Resolutions Calendars; source-backed records below identify distinct bill roles and outcomes.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/2325/biography",
  },
  "richard-raymond": {
    name: "Richard Raymond", office: "Texas House", district: "House District 42", party: "D",
    officialUrl: "https://house.texas.gov/members/4215",
    biography: "Richard Peña Raymond represents Texas House District 42 in the Laredo area of Webb County. The official House biography describes growing up in Benavides, earning government and law degrees at the University of Texas at Austin and working for U.S. Senators Lloyd Bentsen and Paul Simon. Initially elected to the Texas House in 1992, he returned to House service in 2001 after an unsuccessful statewide campaign. His committee work includes chairing Defense and Veterans' Affairs and serving on State Affairs, while linked state bill histories record his legislative activity by role and outcome.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4215/biography",
  },
  "alan-schoolcraft": {
    name: "Alan Schoolcraft", office: "Texas House", district: "House District 44", party: "R",
    officialUrl: "https://house.texas.gov/members/4745",
    biography: "Alan Schoolcraft represents Texas House District 44, which includes Guadalupe and Gonzales counties. According to his official House biography, he served six terms from 1981 through 1993 and returned to the House in 2024. He is a U.S. Air Force veteran and an attorney who studied at the University of Texas at Austin and St. Mary's University School of Law. His 89th Legislature assignments include Public Education and Pensions, Investments and Financial Services, as well as the Academic and Career-Oriented Education subcommittee; linked bill research separates sponsor roles and statuses.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4745/biography",
  },
  "erin-zwiener": {
    name: "Erin Zwiener", office: "Texas House", district: "House District 45", party: "D",
    officialUrl: "https://house.texas.gov/members/3710",
    biography: "Erin Zwiener represents Texas House District 45 in part of Hays County. Her official House biography describes her background as an author, lawyer and conservationist, with degrees in natural-resource conservation, creative writing and law. She is vice chair of the Intergovernmental Affairs Committee and also serves on Natural Resources, Local and Consent Calendars, and the County and Regional Government subcommittee. She founded the Texas Energy and Climate Caucus in 2021; individual 89th Legislature bill-role and outcome sources accompany this summary without treating recorded roles as votes.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/3710/biography",
  },
  "denise-villalobos": {
    name: "Denise Villalobos", office: "Texas House", district: "House District 34", party: "R",
    officialUrl: "https://house.texas.gov/members/4770",
    biography: "Denise Villalobos represents Texas House District 34 in part of Nueces County, where she grew up in Corpus Christi. Her official Texas House biography describes her engineering education at Texas A&M University–Kingsville and master's degree in business at Texas Tech University, followed by refinery reliability and oil-and-gas project management. She previously served on the Tuloso-Midway school board and joined the House in 2025. Her 89th-session committee appointments include Appropriations, Natural Resources and Local and Consent Calendars; separate source-linked records document individual bill roles and outcomes.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4770/biography",
  },
  "oscar-longoria": {
    name: "Oscar Longoria", office: "Texas House", district: "House District 35", party: "D",
    officialUrl: "https://house.texas.gov/members/2485",
    biography: "Oscar Longoria represents House District 35 in parts of Hidalgo and Cameron counties. His official Texas House biography records degrees from the University of Texas at Austin and UT School of Law, work as an attorney, and previous service on an area utility district and South Texas College board. In the 89th Legislature he chairs the Workforce subcommittee and serves as vice chair of the International Relations subcommittee, in addition to Licensing and Trade, Workforce and Economic Development committees. Official bill histories below identify individual recorded legislative roles and outcomes.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/2485/biography",
  },
  "sergio-munoz": {
    name: "Sergio Muñoz", office: "Texas House", district: "House District 36", party: "D",
    officialUrl: "https://house.texas.gov/members/2060",
    biography: "Sergio Muñoz Jr. represents Texas House District 36 in Hidalgo County and was first elected in March 2010. His official Texas House biography describes graduating from Mission High School, earning a business administration degree at the University of Texas at Austin, then a law degree with honors from Thurgood Marshall School of Law. His committee experience includes Insurance, Land and Resource Management and Appropriations, with documented work on regional healthcare and infrastructure. The separate legislative research supplies original bill-role and status citations rather than assuming each bill was his sole sponsorship.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/2060/biography",
  },
  "janie-lopez": {
    name: "Janie Lopez", office: "Texas House", district: "House District 37", party: "R",
    officialUrl: "https://house.texas.gov/members/4295",
    biography: "Janie Lopez represents Texas House District 37, which includes Willacy County and part of Cameron County. Her official Texas House biography records her 2022 election, graduation from San Benito High School in 1997, graduate education in mental health and work as a mental healthcare professional serving children, veterans and first responders. Before taking state office she worked in San Benito school district leadership and focused on student achievement and discipline. The linked 89th Legislature research differentiates documented authored, coauthored and sponsored measures and their recorded outcomes.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4295/biography",
  },
  "ryan-guillen": {
    name: "Ryan Guillen", office: "Texas House", district: "House District 31", party: "R",
    officialUrl: "https://house.texas.gov/members/3045",
    biography: "Ryan Guillen represents House District 31, a South Texas district including Brooks, Duval, Starr and other counties. His Texas House biography describes six generations of South Texas family ties, work on a cattle ranch and feed store, an agriculture degree from Texas A&M University and experience teaching high-school agriculture. He chairs the House Homeland Security and Public Safety Committee and serves on State Affairs. The official legislative histories below distinguish recorded authored, coauthored and sponsored bills and their outcomes, not floor votes.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/3045/biography",
  },
  "todd-hunter": {
    name: "Todd Hunter", office: "Texas House", district: "House District 32", party: "R",
    officialUrl: "https://house.texas.gov/members/3365",
    biography: "Todd Hunter represents Texas House District 32, covering Aransas County and part of Nueces County. His official House biography records that he studied at the University of Kansas and Southern Methodist University law school and began practicing law in Corpus Christi in 1978. First elected in 1988 and returning in 2008, he chairs the House Calendars Committee during the 89th Legislature and serves on Land and Resource Management and Public Education. The linked research provides individual bill-role and outcome sources without claiming a complete career voting record.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/3365/biography",
  },
  "katrina-pierson": {
    name: "Katrina Pierson", office: "Texas House", district: "House District 33", party: "R",
    officialUrl: "https://house.texas.gov/members/4715",
    biography: "Katrina Pierson represents Texas House District 33 in Rockwall County and part of Collin County. Her official Texas House biography describes graduating from Forney High School, earning a biology degree from the University of Texas at Dallas and building a career in healthcare, communications and public-affairs consulting. She served as a national spokesperson for Donald Trump's 2016 presidential campaign and as a senior adviser in 2020. The separate 89th Legislature research table documents individual legislative roles and recorded bill outcomes against official records.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4715/biography",
  },
  "greg-bonnen": {
    name: "Greg Bonnen", office: "Texas House", district: "House District 24", party: "R",
    officialUrl: "https://house.texas.gov/members/2875",
    biography: "Greg Bonnen represents House District 24 in Galveston County and serves as chair of the Texas House Appropriations Committee. The official House biography and Legislative Directory identify him as a practicing neurosurgeon who studied biochemistry at Texas A&M University and medicine at the University of Texas Medical Branch. His legislative work includes budget oversight and disaster preparedness, with original 89th Legislature bill-role and outcome histories available below.",
    identityChecked: "2026-11-04", source: "https://www.house.texas.gov/index.php/members/2875/biography",
  },
  "cody-vasut": {
    name: "Cody Vasut", office: "Texas House", district: "House District 25", party: "R",
    officialUrl: "https://house.texas.gov/members/4065",
    biography: "Cody Vasut represents Texas House District 25, which covers southern and western Brazoria County. The official House biography identifies him as an Angleton attorney educated at Texas A&M University and the University of Houston Law Center who previously served on the Angleton City Council. In the 89th Legislature he chairs the House Redistricting Committee and serves on Culture, Recreation and Tourism and Ways and Means; original bill-role records below distinguish his specific sponsorship and coauthor activities.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4065/biography",
  },
  "matt-morgan": {
    name: "Matt Morgan", office: "Texas House", district: "House District 26", party: "R",
    officialUrl: "https://house.texas.gov/members/4675",
    biography: "Matt Morgan represents Texas House District 26 in Fort Bend County, taking office in January 2025. His official House biography describes a business degree from Sam Houston State University and work as a public insurance adjuster, including founding an independent claims-services business in 2015. The official Legislative Directory lists his committee appointments to Insurance and Land and Resource Management; linked 89th Legislature records identify his individual legislative roles and recorded outcomes.",
    identityChecked: "2026-11-04", source: "https://www.house.texas.gov/index.php/members/4675/biography",
  },
  "ron-reynolds": {
    name: "Ron Reynolds", office: "Texas House", district: "House District 27", party: "D",
    officialUrl: "https://house.texas.gov/members/2040",
    biography: "Ron Reynolds represents Texas House District 27 in Fort Bend County and began his legislative service in January 2011. His official Texas House biography describes previous service as an associate municipal judge in Houston, leadership in the Texas Legislative Black Caucus and prior House minority-whip responsibilities. The official Legislative Directory lists Energy Resources, Environmental Regulation and House Administration among his committee assignments; linked legislative histories distinguish bill authorship, sponsorship and recorded outcomes.",
    identityChecked: "2026-11-04", source: "https://www.house.texas.gov/members/2040/biography",
  },
  "gary-gates": {
    name: "Gary Gates", office: "Texas House", district: "House District 28", party: "R",
    officialUrl: "https://house.texas.gov/members/3920",
    biography: "Gary Gates represents Texas House District 28 in Fort Bend County and has served in the Texas House since 2020. The official Texas House biography describes his work building a family-operated apartment business and his role chairing the Land and Resource Management Committee. His office's documented work connects to land-use, housing and energy matters; original 89th Legislature bill records below provide sources for specific author, coauthor, sponsor and cosponsor roles without presenting them as votes.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/3920/biography",
  },
  "angelia-orr": {
    name: "Angelia Orr", office: "Texas House", district: "House District 13", party: "R",
    officialUrl: "https://house.texas.gov/members/4340",
    biography: "Angelia Orr represents Texas House District 13, covering Hill, Bosque, Falls, Limestone, Freestone, Leon and part of McLennan counties. Her official House biography describes running small businesses, prior work on the Itasca school board and service as Hill County district clerk. She graduated from Texas A&M University in 1992 and began House service in 2023. Her official member page links individual authored and sponsored bills; the research below identifies the recorded role on each linked measure.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4340/biography",
  },
  "paul-dyson": {
    name: "Paul Dyson", office: "Texas House", district: "House District 14", party: "R",
    officialUrl: "https://house.texas.gov/members/4475",
    biography: "Paul Dyson represents Texas House District 14 in Brazos County and began service in January 2025. The official Texas Legislative Directory identifies him as an attorney educated at Texas A&M University and South Texas College of Law. His recorded House committee assignments include Energy Resources, Judiciary and Civil Jurisprudence, and the July 2025 flooding investigation. His official legislative and member sources provide traceable bill histories rather than unsupported voting or lifetime sponsorship totals.",
    identityChecked: "2026-11-04", source: "https://legdir.capitol.texas.gov/MemberInfo.aspx?Chamber=H&Code=A4475",
  },
  "janis-holt": {
    name: "Janis Holt", office: "Texas House", district: "House District 18", party: "R",
    officialUrl: "https://house.texas.gov/members/4535",
    biography: "Janis Holt represents Texas House District 18 and began her first legislative term in January 2025. Her official House biography describes her Silsbee roots, ownership of an air-purification business, prior work in education and service on the Silsbee Independent School District board. Texas legislative records identify her appointments to the Homeland Security, Public Safety and Veterans' Affairs and Pensions, Investments and Financial Services committees; individual 89th Legislature bill roles and outcomes are documented in the source-linked research below.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4535/biography",
  },
  "brent-money": {
    name: "Brent Money", office: "Texas House", district: "House District 2", party: "R",
    officialUrl: "https://house.texas.gov/members/2",
    biography: "Brent Money represents House District 2, covering Hunt, Hopkins, and Van Zandt counties. His official Texas House biography describes his work as an attorney and business owner. His House member record lists his capitol and district offices and links directly to authored and sponsored legislation; the separate research table on this page distinguishes his different legislative roles and recorded bill outcomes.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4670/biography",
  },
  "will-metcalf": {
    name: "Will Metcalf", office: "Texas House", district: "House District 16", party: "R",
    officialUrl: "https://house.texas.gov/members/2900",
    biography: "Will Metcalf represents House District 16, including the Conroe area of Montgomery County. According to his official Texas House biography, his professional background includes banking and business development, and he earned a criminal-justice degree from Sam Houston State University. The official House record provides legislative and district sources; the searchable 89th Legislature research below separates his authored and sponsored measures from coauthor and cosponsor roles.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/2900/biography",
  },
  "tan-parker": {
    name: "Tan Parker", office: "Texas Senate", district: "Senate District 12", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=12",
    biography: "Tan Parker represents Senate District 12. His official Texas Senate biography records service in the Texas House from 2007 through 2023, followed by Senate service beginning in 2023, along with business experience and education at the University of Dallas and the London School of Economics. His Senate page documents transportation and criminal-justice committee leadership, while the linked legislative histories distinguish each 89th Legislature bill role.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=12",
  },
  "royce-west": {
    name: "Royce West", office: "Texas Senate", district: "Senate District 23", party: "D",
    officialUrl: "https://senate.texas.gov/member.php?d=23",
    biography: "Royce West represents Senate District 23 in the Dallas area and has served in the Texas Senate since 1993, according to the official Senate member record. An attorney and managing partner of West & Associates, he has pursued education and higher-education legislation and is listed as vice chair of the Senate Transportation Committee. This page separates source-recorded authorship, sponsorship, and other legislative roles rather than treating all participation as a vote.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=23",
  },
  "joanne-shofner": {
    name: "Joanne Shofner", office: "Texas House", district: "House District 11", party: "R",
    officialUrl: "https://house.texas.gov/members/11",
    biography: "Joanne Shofner represents House District 11, including Nacogdoches, Newton, Panola, Rusk, Shelby, and Sabine counties. Her official Texas House biography identifies her 89th Legislature committee appointments to Higher Education and Public Health, and describes work on House Bill 25. The accompanying bill-research records use the original Texas Legislature histories to distinguish individual bill roles and outcomes from statements about votes or overall legislative totals.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4755/biography",
  },
  "lois-kolkhorst": {
    name: "Lois Kolkhorst", office: "Texas Senate", district: "Senate District 18", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=18",
    biography: "Lois Kolkhorst represents Senate District 18 and is based in Brenham. The official Senate biography documents her Texas House service from 2001 to 2014, Senate service since 2014, a business background, and a degree from Texas Christian University. Her Senate responsibilities include Health and Human Services, and the official member page links legislative activity to independently checkable Texas Legislature bill histories and recorded outcomes.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=18",
  },
  "richard-hayes": {
    name: "Richard Hayes", office: "Texas House", district: "House District 57", party: "R",
    officialUrl: "https://house.texas.gov/members/4165",
    biography: "Richard Hayes represents House District 57 in Denton County. The official Texas House biography describes his election in 2022, work as a business and real-estate attorney, and education at Texas Christian University, Texas A&M University, and St. Mary's University School of Law. During the 89th Legislature he was appointed to the Judiciary and Civil Jurisprudence, pensions and financial-services, and Governmental Oversight committees; linked bill histories document his distinct legislative roles.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4165/biography",
  },
  "cesar-blanco": {
    name: "César Blanco", office: "Texas Senate", district: "Senate District 29", party: "D",
    officialUrl: "https://senate.texas.gov/member.php?d=29",
    biography: "César Blanco represents Senate District 29, covering El Paso and several West Texas counties. His official Senate biography describes his Navy service, degree from the University of Texas at El Paso, Texas House service from 2015 through 2021, and Senate service beginning in 2021. His official committee work spans business, health, natural resources, and disaster preparedness; the legislative sample provides primary-source links for specific bills and distinguishes each recorded role.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=29",
  },
  "bob-hall": {
    name: "Bob Hall", office: "Texas Senate", district: "Senate District 2", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=2",
    biography: "Bob Hall represents Texas Senate District 2, and the official Texas Senate member page lists his service in the Senate beginning in 2015. A retired U.S. Air Force captain, he also worked as an aerospace systems engineer and established a business consulting company. His Senate committee work includes chairing Administration and participation in Finance, Health and Human Services, and State Affairs; individual legislative roles and outcomes are documented below against official bill histories.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=2",
  },
  "robert-nichols": {
    name: "Robert Nichols", office: "Texas Senate", district: "Senate District 3", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=3",
    biography: "Robert Nichols represents Texas Senate District 3, an East Texas district. According to the official Texas Senate biography, he has served since 2007, holds an industrial engineering degree from Lamar University, and worked in plastics manufacturing. The Senate identifies transportation policy as a central part of his legislative service and lists his roles on Transportation, Finance, Local Government, and Business and Commerce; official bill histories below identify specific recorded legislative roles.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=3",
  },
  "charles-schwertner": {
    name: "Charles Schwertner", office: "Texas Senate", district: "Senate District 5", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=5",
    biography: "Charles Schwertner represents Texas Senate District 5, covering parts of Central and East Texas. The official Senate biography identifies him as an orthopedic surgeon who earned a pharmacy degree from the University of Texas at Austin and a medical degree from the University of Texas Medical Branch. After serving in the Texas House from 2011 to 2013, he joined the Senate in 2013 and chairs Business and Commerce, with other responsibilities in Finance, State Affairs, and Economic Development.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=5",
  },
  "carol-alvarado": {
    name: "Carol Alvarado", office: "Texas Senate", district: "Senate District 6", party: "D",
    officialUrl: "https://senate.texas.gov/member.php?d=6",
    biography: "Carol Alvarado represents Texas Senate District 6 in Harris County. Her official Texas Senate biography documents previous Houston City Council service from 2002 through 2008 and Texas House service beginning in 2009 before she won a 2018 Senate special election. She holds a political-science bachelor's degree and MBA from the University of Houston, chairs the Senate Democratic Caucus, and serves on committees covering finance, economic development, and natural resources.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=6",
  },
  "paul-bettencourt": {
    name: "Paul Bettencourt", office: "Texas Senate", district: "Senate District 7", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=7",
    biography: "Paul Bettencourt represents Texas Senate District 7 in the Houston area and has served since 2015. According to the Texas Senate's official member biography, he previously served as Harris County tax assessor-collector from 1998 through 2008 and earned an industrial-distribution degree from Texas A&M University. His Senate work includes chairing Local Government and work on property tax, education, finance and transportation legislation; each bill role in the research sample is linked to its original history.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=7",
  },
  "angela-paxton": {
    name: "Angela Paxton", office: "Texas Senate", district: "Senate District 8", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=8",
    biography: "Angela Paxton represents Texas Senate District 8 and was elected in 2018, beginning service in 2019. Her official Senate biography describes more than two decades as a secondary mathematics teacher and school counselor, a degree from Baylor University, and a graduate education degree from the University of Houston–Clear Lake. She chairs Economic Development and serves as vice chair of State Affairs and the Religious Liberty select committee, with additional duties in finance and education.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=8",
  },
  "phil-king": {
    name: "Phil King", office: "Texas Senate", district: "Senate District 10", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=10",
    biography: "Phil King represents Texas Senate District 10. The official Texas Senate member biography records his Texas House service from 1999 through 2022 and his Senate service beginning in 2023. An attorney and former Fort Worth police officer, he served in law enforcement for 15 years and holds degrees from Dallas Baptist University and Texas A&M University School of Law. His district encompasses parts of North and West Texas, including Brown and Parker counties.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=10",
  },
  "mayes-middleton": {
    name: "Mayes Middleton", office: "Texas Senate", district: "Senate District 11", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=11",
    biography: "Mayes Middleton represents Texas Senate District 11, covering portions of Brazoria, Galveston and Harris counties. The Texas Senate biography identifies him as president of an independent oil and gas company, with bachelor's and law degrees from the University of Texas at Austin. He served two terms in the Texas House before joining the Senate in 2023 and was formerly chair of the Texas House Freedom Caucus; his recorded bill roles and outcomes are traceable to individual Texas Legislature histories.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=11",
  },
  "borris-miles": {
    name: "Borris Miles", office: "Texas Senate", district: "Senate District 13", party: "D",
    officialUrl: "https://senate.texas.gov/member.php?d=13",
    biography: "Borris L. Miles represents Texas Senate District 13 in Houston. The official Texas Senate biography records previous Texas House service from 2007 to 2017 and Senate service beginning in 2017. A graduate of Sam Houston State University, Miles works in insurance and real estate development and has served on the Health and Human Services, Criminal Justice, Nominations and Transportation committees. This profile distinguishes recorded legislative authorship and sponsorship from other coauthor or cosponsor roles.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=13",
  },
  "sarah-eckhardt": {
    name: "Sarah Eckhardt", office: "Texas Senate", district: "Senate District 14", party: "D",
    officialUrl: "https://senate.texas.gov/member.php?d=14",
    biography: "Sarah Eckhardt represents Texas Senate District 14 in Travis County. According to the official Senate biography, she entered the Senate in 2020 after serving as Travis County commissioner from 2006 through 2013 and county judge from 2015 through 2020. She earned a public affairs master's degree and law degree from the University of Texas at Austin and previously worked in the Travis County Attorney's Office. Official bill histories below allow readers to verify her different legislative roles and outcomes.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=14",
  },
  "molly-cook": {
    name: "Molly Cook", office: "Texas Senate", district: "Senate District 15", party: "D",
    officialUrl: "https://senate.texas.gov/member.php?d=15",
    biography: "Molly Cook represents Texas Senate District 15 in Houston and joined the Senate in 2024. Her official Senate biography identifies her as an emergency-room nurse and public-health organizer with a bachelor's degree in nursing from the University of Texas at Austin and graduate nursing and public-health degrees from Johns Hopkins University. The Senate member page also documents her Health and Human Services committee work and research on health and transportation issues; the linked bill-history sample identifies specific legislative roles.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=15",
  },
  "nathan-johnson": {
    name: "Nathan Johnson", office: "Texas Senate", district: "Senate District 16", party: "D",
    officialUrl: "https://senate.texas.gov/member.php?d=16",
    biography: "Nathan Johnson represents Texas Senate District 16 in Dallas County and has served since 2019. The official Senate biography identifies his work as an attorney, a physics degree from the University of Arizona, and a law degree from the University of Texas. It describes legislative priorities spanning the electric grid, health care, government transparency and state infrastructure. This page supplies bill-by-bill Texas Legislature Online links so readers can distinguish measure authorship and sponsorship from floor voting.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=16",
  },
  "joan-huffman": {
    name: "Joan Huffman", office: "Texas Senate", district: "Senate District 17", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=17",
    biography: "Joan Huffman represents Texas Senate District 17 in the Houston region and has served in the Senate since 2008. The official Senate biography recounts her earlier work as a Harris County prosecutor and criminal district court judge, and lists degrees from Louisiana State University and South Texas College of Law. She chairs the Senate Finance Committee and has served on Criminal Justice and the Legislative Budget Board. The 89th Legislature research below records the role and status of specific bills without implying a roll-call voting record.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=17",
  },
  "roland-gutierrez": {
    name: "Roland Gutierrez", office: "Texas Senate", district: "Senate District 19", party: "D",
    officialUrl: "https://senate.texas.gov/member.php?d=19",
    biography: "Roland Gutierrez represents Texas Senate District 19, covering a substantial South Texas area. His official Senate biography lists Texas House service from 2008 to 2021 and Senate service beginning in 2021. A San Antonio attorney with degrees from the University of Texas at San Antonio and St. Mary's University School of Law, he has worked on rural mental health, defense and veterans' affairs, and firearm safety following the Uvalde school shooting. Original bill histories document each sampled legislative role.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=19",
  },
  "chuy-hinojosa": {
    name: "Chuy Hinojosa", office: "Texas Senate", district: "Senate District 20", party: "D",
    officialUrl: "https://senate.texas.gov/member.php?d=20",
    biography: "Juan 'Chuy' Hinojosa represents Texas Senate District 20. His official Senate biography documents service in the U.S. Marine Corps during the Vietnam War, a political science degree from the University of Texas–Pan American, and a law degree from Georgetown University. He served in the Texas House from 1981 to 1991 and again from 1997 to 2003 before entering the Senate in 2003. The related Texas Legislature histories identify individual sponsorship and authorship records, not inferred voting behavior.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=20",
  },
  "pete-flores": {
    name: "Pete Flores", office: "Texas Senate", district: "Senate District 24", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=24",
    biography: "Pete Flores represents Texas Senate District 24, serving first from 2018 to 2021 and again from 2023. His official Senate biography documents 27 years as a Texas game warden, including service as a colonel overseeing statewide operations, and his studies at Texas A&M University. He chaired Criminal Justice during the 89th Regular Legislature and served in a leadership role investigating the July 2025 Hill Country flooding. The research records below distinguish his separate bill roles and outcomes.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=24",
  },
  "donna-campbell": {
    name: "Donna Campbell", office: "Texas Senate", district: "Senate District 25", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=25",
    biography: "Donna Campbell represents Texas Senate District 25, which covers parts of the Texas Hill Country, and has served in the Senate since 2013. The official Texas Senate biography identifies her as a board-certified emergency-room physician with nursing degrees from Central State University and Texas Woman's University and a medical degree from Texas Tech University. It documents service on education, nominations and veterans committees. Each sampled 89th Legislature bill links to a primary-source history and its recorded status.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=25",
  },
  "jose-menendez": {
    name: "José Menéndez", office: "Texas Senate", district: "Senate District 26", party: "D",
    officialUrl: "https://senate.texas.gov/member.php?d=26",
    biography: "José Menéndez represents Texas Senate District 26 in San Antonio and has served since 2015, after Texas House service from 2001 through 2015. The Senate's official biography documents earlier work on the San Antonio City Council and professional experience in title insurance and multicultural markets. His legislative work has addressed public schools, cyberbullying prevention through David's Law, veterans' services and local development. The source-linked research sample distinguishes authored measures from sponsorship and other bill roles.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=26",
  },
  "adam-hinojosa": {
    name: "Adam Hinojosa", office: "Texas Senate", district: "Senate District 27", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=27",
    biography: "Adam Hinojosa represents Texas Senate District 27 along the southern Gulf Coast. Elected in 2024, he began Senate service in 2025; the official biography identifies experience as a small-business owner and finance executive, and education at Del Mar College. The Senate's March 2026 press materials report his appointment as chair of the Committee on Nominations. The 89th Legislature research below connects his specific bill roles and recorded outcomes to original Texas Legislature histories.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=27",
  },
  "charles-perry": {
    name: "Charles Perry", office: "Texas Senate", district: "Senate District 28", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=28",
    biography: "Charles Perry represents Texas Senate District 28 and is based in Lubbock. According to the official Texas Senate biography, he is a certified public accountant with an accounting and management-information degree from Texas Tech University. Following Texas House service from 2010 to 2014, he entered the Senate in 2014 and chairs Water, Agriculture and Rural Affairs while working on health, finance and infrastructure matters. The searchable legislative sample provides direct primary-source bill histories.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=28",
  },
  "brent-hagenbuch": {
    name: "Brent Hagenbuch", office: "Texas Senate", district: "Senate District 30", party: "R",
    officialUrl: "https://www.senate.texas.gov/member.php?d=30",
    biography: "Brent Hagenbuch represents Texas Senate District 30 and began Senate service in 2025. The official member biography identifies him as chairman of a transportation and logistics company, a former U.S. Navy Civil Engineer Corps officer, and a graduate of the U.S. Naval Academy, Stanford University and UCLA. His business career includes transport operations and management roles. This page presents historical 89th Legislature authored and sponsored bill examples separately from coauthor and cosponsor records.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=30",
  },
  "kevin-sparks": {
    name: "Kevin Sparks", office: "Texas Senate", district: "Senate District 31", party: "R",
    officialUrl: "https://senate.texas.gov/member.php?d=31",
    biography: "Kevin Sparks represents Texas Senate District 31 in West Texas and has served since 2023. His official Senate biography identifies him as an oil and gas operator based in Midland and a University of Texas at Austin business graduate. His public 89th Legislature agenda includes electric-grid reliability, water supply, child-welfare reform, and efforts against oilfield theft. The research records below use Texas Legislature Online bill histories to distinguish each formal legislative role and recorded outcome.",
    identityChecked: "2026-11-04", source: "https://senate.texas.gov/member.php?d=31",
  },
  "cecil-bell": {
    name: "Cecil Bell", office: "Texas House", district: "House District 3", party: "R",
    officialUrl: "https://house.texas.gov/members/2335",
    biography: "Cecil Bell, Jr. represents House District 3. His official Texas House biography identifies him as a sixth-generation Texan who grew up in several parts of the state and works as chief executive of nine active businesses. It also describes his cattle-ranching operations in Leon and Freestone counties and his recognition as a Southwest regional entrepreneurship award finalist. The distinct 89th Legislature bill research below identifies source-linked authorship, sponsorship, and other recorded legislative roles.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/2335/biography",
  },
  "keith-bell": {
    name: "Keith Bell", office: "Texas House", district: "House District 4", party: "R",
    officialUrl: "https://house.texas.gov/members/3695",
    biography: "Keith Bell represents House District 4 and lives in Forney. According to his official Texas House biography, he served for twenty years on the Forney Independent School District board, founded Intex Electrical Contractors in 1983 and holds a Texas master electrician's license. He also led state and Dallas-area Independent Electrical Contractors organizations. The official bill-history research below connects individual 89th Legislature measures to their recorded roles and outcomes.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/3695/biography",
  },
  "cole-hefner": {
    name: "Cole Hefner", office: "Texas House", district: "House District 5", party: "R",
    officialUrl: "https://house.texas.gov/members/3505",
    biography: "Cole Hefner represents House District 5, covering Camp, Rains, Titus, Upshur, Wood and part of Smith counties. His official House biography says he has served since 2017, previously represented Upshur County as a commissioner, operated a construction business for sixteen years and subsequently worked in commercial construction and insurance. The 89th Legislature activity section links each sampled legislative role and its recorded outcome to an official Texas Legislature history.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/3505/biography",
  },
  "daniel-alders": {
    name: "Daniel Alders", office: "Texas House", district: "House District 6", party: "R",
    officialUrl: "https://house.texas.gov/members/4395",
    biography: "Daniel Alders serves House District 6, a Smith County district including Tyler, Whitehouse, Troup and several nearby communities. The official Texas House biography identifies his election to a first term in the 89th Legislature, a liberal arts degree from New Saint Andrews College and a real-estate career begun after returning to East Texas. This page distinguishes the legislation on which he served as an author, sponsor, coauthor or cosponsor and links individual recorded outcomes to official bill histories.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4395/biography",
  },
  "jay-dean": {
    name: "Jay Dean", office: "Texas House", district: "House District 7", party: "R",
    officialUrl: "https://house.texas.gov/members/3515",
    biography: "Jay Dean represents Texas House District 7, which has included Gregg, Harrison and Marion counties since the 2023 district configuration. His official Texas House biography dates his state service to 2017 and describes a decade as Longview mayor preceded by five years on the city council. His local-government background and work on public education and economic development provide context for the source-linked 89th Legislature bill roles and outcomes presented below.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/3515/biography",
  },
  "cody-harris": {
    name: "Cody Harris", office: "Texas House", district: "House District 8", party: "R",
    officialUrl: "https://house.texas.gov/members/3580",
    biography: "Cody Harris represents House District 8 across Anderson, Cherokee, Henderson and Navarro counties. His official House biography describes his family's longstanding East Texas ties along the Trinity River and his emphasis on the needs of rural communities. The House member page supplies direct links to legislative activity, while this profile's searchable 89th Legislature research distinguishes authored measures from coauthorship, sponsorship and cosponsorship without claiming these entries represent his floor votes.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/3580/biography",
  },
  "trent-ashby": {
    name: "Trent Ashby", office: "Texas House", district: "House District 9", party: "R",
    officialUrl: "https://house.texas.gov/members/2330",
    biography: "Trent Ashby represents House District 9, including Angelina, Houston, Polk, San Augustine, Trinity and Tyler counties. The official Texas House biography dates his service to January 2013 and identifies him as chair of Culture, Recreation and Tourism and a member of Transportation during the 89th Legislature. He previously held roles on Appropriations, Public Education and Natural Resources committees. This profile connects those responsibilities to individual source-linked bill-role examples rather than an invented voting history.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/2330/biography",
  },
  "brian-harrison": {
    name: "Brian Harrison", office: "Texas House", district: "House District 10", party: "R",
    officialUrl: "https://house.texas.gov/members/4085",
    biography: "Brian Harrison represents Texas House District 10, covering Ellis County. His official House biography recounts his service as chief of staff at the U.S. Department of Health and Human Services during the first Trump administration and his upbringing in the Ellis County area. His prior federal executive-branch work provides distinct career context; the separate 89th Legislature source records document the bills on which he appeared as author, coauthor, sponsor or cosponsor and their recorded statuses.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4085/biography",
  },
  "trey-wharton": {
    name: "Trey Wharton", office: "Texas House", district: "House District 12", party: "R",
    officialUrl: "https://house.texas.gov/members/4795",
    biography: "Trey Wharton represents House District 12, which includes Grimes, Madison, Robertson, Walker, Washington and part of Brazos counties. His official House biography documents service on the Huntsville Independent School District board, including three years as its president, and the founding of an insurance business in 1991 after earning a finance degree at Texas Christian University. In his first House term he served on Corrections, Insurance, and Health Care Affordability committees; specific bill roles are linked below.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4795/biography",
  },
  "steve-toth": {
    name: "Steve Toth", office: "Texas House", district: "House District 15", party: "R",
    officialUrl: "https://house.texas.gov/members/2825",
    biography: "Steve Toth represents Texas House District 15 in southern Montgomery County. The official Texas House biography describes him as a small-business owner from the Woodlands area who has served on the Appropriations Committee since 2019. His legislative work includes county-government ethics, school visitation rights and support tools for students with dyslexia. This page links individual 89th Legislature bill histories and carefully separates recorded bill roles from actual votes or comprehensive legislative totals.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/2825/biography",
  },
  "stan-gerdes": {
    name: "Stan Gerdes", office: "Texas House", district: "House District 17", party: "R",
    officialUrl: "https://house.texas.gov/members/4195",
    biography: "Stan Gerdes represents House District 17 and resides in Smithville. His official Texas House biography documents more than a decade working with Rick Perry, first while Perry served as Texas governor and later during his service as U.S. secretary of energy. The biography also describes Gerdes's work on rural law-enforcement funding and the Texas Water Fund. Official Texas Legislature links below show the distinct legislative roles and recorded outcomes associated with his 89th Legislature bill activity.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4195/biography",
  },
  "ellen-troxclair": {
    name: "Ellen Troxclair", office: "Texas House", district: "House District 19", party: "R",
    officialUrl: "https://house.texas.gov/members/19",
    biography: "Ellen Troxclair represents House District 19 across Blanco, Burnet, Gillespie, Kendall and western Travis counties. Elected to the Texas House in 2022, she previously served on Austin City Council and worked in residential real estate. The official House biography identifies past committee responsibilities in Homeland Security, Culture and Recreation, community safety and property-tax relief. The searchable official bill histories below document particular legislative roles rather than asserting complete voting or sponsorship totals.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/4385/biography",
  },
  "terry-wilson": {
    name: "Terry Wilson", office: "Texas House", district: "House District 20", party: "R",
    officialUrl: "https://house.texas.gov/members/3525",
    biography: "Terry Wilson represents House District 20. The official Texas House biography identifies him as a retired United States Army colonel who served more than thirty years and holds a business degree from Texas A&M University and a graduate degree in strategic logistics. He chaired the House Higher Education Committee and served on Elections and Redistricting during the 89th Legislature, with previous Defense and Veterans' Affairs and Appropriations leadership. The activity records below link to the original Texas Legislature bill histories.",
    identityChecked: "2026-11-04", source: "https://house.texas.gov/members/3525/biography",
  },
  "stan-lambert": {
    name: "Stan Lambert", office: "Texas House", district: "House District 71", party: "R",
    officialUrl: "https://house.texas.gov/members/3225",
    biography: "Stan Lambert represents House District 71, covering Callahan, Jones, Nolan and Taylor counties around Abilene. A former community banker, he earned a business degree at Abilene Christian University and previously served as mayor of Ennis and on the Abilene ISD board. The official Legislative Directory lists him as chair of Pensions, Investments and Financial Services and as a member of Higher Education during the 89th Legislature. The individually linked bill histories below identify his recorded author, coauthor, sponsor and cosponsor roles; they do not constitute a roll-call voting record.",
    identityChecked: "2026-11-05", source: "https://legdir.capitol.texas.gov/MemberInfo.aspx?Chamber=H&Code=A3225",
  },
  "drew-darby": {
    name: "Drew Darby", office: "Texas House", district: "House District 72", party: "R",
    officialUrl: "https://house.texas.gov/members/2645",
    biography: "Drew Darby represents House District 72 across ten West Texas counties, including San Angelo and communities in the Concho Valley and Permian Basin. A University of Texas at Austin business and law graduate, he has worked in real estate and title services. His official 89th Legislature biography identifies him as chair of Energy Resources and a member of House Administration and State Affairs. The recorded bills linked below allow readers to distinguish his specific sponsorship roles from bill passage or enactment; they are a limited historical sample, not his full legislative career.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/2645/biography",
  },
  "carrie-isaac": {
    name: "Carrie Isaac", office: "Texas House", district: "House District 73", party: "R",
    officialUrl: "https://house.texas.gov/members/4265",
    biography: "Carrie Isaac represents House District 73, covering Comal County and part of Hays County. Her official House biography describes earlier work with nonprofit organizations and states that she earned a bachelor's degree from Stephen F. Austin State University and a master's degree from Purdue University Global. For the 89th Legislature her recorded committee assignments include Elections and Homeland Security, Public Safety and Veterans' Affairs. The cited bill histories below separate individual legislative roles and reported outcomes, without presenting a complete voting history or assuming a bill became law from her involvement.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/4265/biography",
  },
  "eddie-morales": {
    name: "Eddie Morales", office: "Texas House", district: "House District 74", party: "D",
    officialUrl: "https://house.texas.gov/members/4000",
    biography: "Eddie Morales represents House District 74, an eleven-county West Texas and border district that includes Maverick County and part of El Paso County. Born in Eagle Pass, he earned a political science degree from the University of Texas at Austin and a law degree from St. Mary's University, then worked as an attorney. His 89th Legislature committee assignments include Energy Resources as vice chair, Governmental Oversight (Select), and Transportation. The independently linked Texas Legislature histories below describe specific recorded bill roles and results rather than an unverified lifetime total or roll-call voting pattern.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/4000/biography",
  },
  "mary-gonzalez": {
    name: "Mary González", office: "Texas House", district: "House District 75", party: "D",
    officialUrl: "https://house.texas.gov/members/2410",
    biography: "Mary González represents House District 75 in eastern El Paso County. Raised in Clint, she was first elected in 2012 and earned a doctorate in curriculum and instruction from the University of Texas at Austin after earlier study at UT Austin and St. Edward's. During the 89th Legislature she served as vice chair of House Appropriations and as a Natural Resources committee member. The source-linked bill records below identify specific author, coauthor, sponsor and cosponsor roles and recorded outcomes, rather than a complete roll-call voting history.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/2410/biography",
  },
  "suleman-lalani": {
    name: "Suleman Lalani", office: "Texas House", district: "House District 76", party: "D",
    officialUrl: "https://house.texas.gov/members/4285",
    biography: "Suleman Lalani represents Texas House District 76, covering parts of Fort Bend County around Sugar Land, Stafford, Richmond and Meadows Place. A physician practicing in the area for nearly thirty years, he holds certifications in internal medicine, geriatric medicine, and hospice and palliative care. The 89th Legislature lists him as vice chair of Land and Resource Management and as a member of Higher Education and the Health Care Affordability select committee. Individual historical bill links below distinguish legislative roles and outcomes from unsupported claims of a complete record.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/4285/biography",
  },
  "vince-perez": {
    name: "Vince Perez", office: "Texas House", district: "House District 77", party: "D",
    officialUrl: "https://house.texas.gov/members/4710",
    biography: "Vince Perez represents Texas House District 77 in El Paso, including downtown and the University of Texas at El Paso. His official biography describes two earlier terms as an El Paso County commissioner and undergraduate and graduate government degrees from Georgetown University. In the 89th Legislature his assignments include Higher Education, Ways and Means, and Local and Consent Calendars. The links below provide original Texas Legislature bill histories for his individual recorded legislative roles; they are a bounded sample, not evidence of how he voted on every bill.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/4710/biography",
  },
  "joe-moody": {
    name: "Joe Moody", office: "Texas House", district: "House District 78", party: "D",
    officialUrl: "https://house.texas.gov/members/3850",
    biography: "Joe Moody represents Texas House District 78 in El Paso and serves as Speaker Pro Tempore of the Texas House. A practicing attorney, he founded and co-chairs the Criminal Justice Reform Caucus, with work focused on criminal justice and indigent access to counsel. His 89th Legislature assignments include Criminal Jurisprudence, Judiciary and Civil Jurisprudence, House Administration and multiple investigating committees. Original bill history links below distinguish his recorded sponsorship activities from floor votes or claims about all legislation during his career.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/3850/biography",
  },
  "claudia-ordaz": {
    name: "Claudia Ordaz", office: "Texas House", district: "House District 79", party: "D",
    officialUrl: "https://house.texas.gov/members/4015",
    biography: "Claudia Ordaz represents House District 79 in eastern and northeastern El Paso, including areas around Fort Bliss and the international airport. Before serving in the Texas Legislature she was an El Paso city council member, and the Legislative Directory records a political science degree from the University of Texas at El Paso. For the 89th Legislature, Texas Legislature Online—not the outdated committee list on her House biography—identifies her as vice chair of Environmental Regulation and a member of Trade, Workforce and Economic Development. The linked records below describe recorded bill roles and outcomes, not a complete voting record.",
    identityChecked: "2026-11-05", source: "https://capitol.texas.gov/Committees/MembershipMbr.aspx?LegCode=A4015&LegSess=89R",
  },
  "don-mclaughlin": {
    name: "Don McLaughlin", office: "Texas House", district: "House District 80", party: "R",
    officialUrl: "https://house.texas.gov/members/4655",
    biography: "Don McLaughlin represents House District 80, encompassing Atascosa, Dimmit, Frio, Uvalde and Zavala counties and part of Webb County. He previously served as mayor of Uvalde; the official Legislative Directory describes his occupation as sales. His 89th Legislature assignments are Agriculture and Livestock and Homeland Security, Public Safety and Veterans' Affairs. Because his official House biography contains no substantive text, this profile relies on separately identified institutional and official legislative records and does not attribute unverified education or accomplishments to him.",
    identityChecked: "2026-11-05", source: "https://legdir.capitol.texas.gov/MemberInfo.aspx?Chamber=H&Code=A4655",
  },
  "brooks-landgraf": {
    name: "Brooks Landgraf", office: "Texas House", district: "House District 81", party: "R",
    officialUrl: "https://house.texas.gov/members/3040",
    biography: "Brooks Landgraf represents the Permian Basin's House District 81, comprising Ector, Loving, Ward and Winkler counties. An Odessa native from a longtime West Texas ranching family, he studied at Texas A&M University and St. Mary's University School of Law and has practiced law in energy and healthcare matters. In the 89th Legislature he chaired Environmental Regulation and served on Governmental Oversight (Select) and Judiciary and Civil Jurisprudence. The official bill links below are role-specific historical examples, not a complete voting or career-total claim.",
    identityChecked: "2026-11-05", source: "https://house.texas.gov/members/3040/biography",
  },
  "tom-craddick": {
    name: "Tom Craddick", office: "Texas House", district: "House District 82", party: "R",
    officialUrl: "https://house.texas.gov/members/2610",
    biography: "Tom Craddick represents House District 82, covering Dawson, Martin and Midland counties. Texas legislative records identify the Midland lawmaker as the longest-serving member in the Legislature's history and a former Speaker of the House. His Legislative Directory credentials include a B.B.A. and M.B.A. from Texas Tech University. For the 89th Legislature he chaired Transportation and served on Energy Resources. Individual bill histories below provide dated author and sponsorship roles, not unsupported lifetime bill totals or a complete account of roll-call votes.",
    identityChecked: "2026-11-05", source: "https://lrl.texas.gov/legeLeaders/members/memberDisplay.cfm?memberID=109",
  },
};

export const SIX_PROFILE_PILOT = [
  "bryan-hughes", "judith-zaffirini",
  "terri-leo-wilson", "mihaela-plesa",
  "dan-crenshaw", "john-cornyn",
] as const;

/** Checked against current official member pages 2026-11-04. Each entry must
 * independently pass all A-F gates before appearing in the representative sitemap. */
export const SCRIPT2_REVIEWED_SLUGS = [
  "brent-money", "will-metcalf", "tan-parker", "royce-west",
  "joanne-shofner", "lois-kolkhorst", "richard-hayes", "cesar-blanco",
  "bob-hall", "robert-nichols", "charles-schwertner", "carol-alvarado",
  "paul-bettencourt", "angela-paxton", "phil-king", "mayes-middleton",
  "borris-miles", "sarah-eckhardt", "molly-cook", "nathan-johnson",
  "joan-huffman", "roland-gutierrez", "chuy-hinojosa", "pete-flores",
  "donna-campbell", "jose-menendez", "adam-hinojosa", "charles-perry",
  "brent-hagenbuch", "kevin-sparks",
  "angelia-orr", "paul-dyson", "janis-holt",
  "greg-bonnen", "cody-vasut", "matt-morgan", "ron-reynolds", "gary-gates",
  "ryan-guillen", "todd-hunter", "katrina-pierson",
  "denise-villalobos", "oscar-longoria", "sergio-munoz", "janie-lopez",
  "erin-gamez", "mando-martinez", "terry-canales", "bobby-guerra",
  "richard-raymond", "alan-schoolcraft", "erin-zwiener",
  "sheryl-cole", "vikki-goodwin", "donna-howard", "gina-hinojosa", "james-talarico",
  "lulu-flores", "caroline-harris-davila", "brad-buckley", "hillary-hickland", "shelby-slawson",
  "cecil-bell", "keith-bell", "cole-hefner", "daniel-alders", "jay-dean",
  "cody-harris", "trent-ashby", "brian-harrison", "trey-wharton",
  "steve-toth", "stan-gerdes", "ellen-troxclair", "terry-wilson",
  "keresa-richardson", "ben-bumgarner", "andy-hopper",
  "shelley-luther", "mitch-little",
  "matt-shaheen", "jeff-leach", "david-spiller", "james-frank",
  "stan-lambert", "drew-darby", "carrie-isaac", "eddie-morales",
  "mary-gonzalez", "suleman-lalani", "vince-perez", "joe-moody",
  "claudia-ordaz", "don-mclaughlin", "brooks-landgraf", "tom-craddick",
  "dustin-burrows",
  "carl-tepper", "stan-kitzman", "john-smithee", "caroline-fairly",
  "ken-king", "candy-noble", "ramon-romero",
  "david-lowe", "salman-bhojani", "tony-tinderholt", "nicole-collier",
  "david-cook", "john-mcqueeney", "giovanni-capriglione", "charlie-geren", "venton-jones",
  "chris-turner", "ana-maria-rodriguez-ramos", "rafael-anchia", "jessica-gonzalez", "terry-meza", "jared-patterson", "linda-garcia", "morgan-meyer", "aicha-davis", "toni-rose", "yvonne-davis", "angie-button",
] as const;

export const CERTIFICATION_CANDIDATE_SLUGS = [
  ...SIX_PROFILE_PILOT,
  ...SCRIPT2_REVIEWED_SLUGS,
] as const;

export function applyPilotEditorial(
  slug: string,
  authority: RepresentativeAuthority | null,
): RepresentativeAuthority | null {
  const review = EDITORIAL_REVIEWS[slug];
  if (!authority || !review) return authority;
  const official89RCommittees = "https://www.house.texas.gov/pdfs/committees/89R-Assignments-by-Member.pdf";
  const cohort = ["david-lowe","salman-bhojani","tony-tinderholt","nicole-collier","david-cook","john-mcqueeney","giovanni-capriglione","charlie-geren","venton-jones","chris-turner","ana-maria-rodriguez-ramos","rafael-anchia","jessica-gonzalez","terry-meza","jared-patterson","linda-garcia","morgan-meyer","aicha-davis","toni-rose","yvonne-davis","angie-button"] as readonly string[];
  return {
    ...authority,
    biography: review.biography,
    sources: cohort.includes(slug) && !authority.sources.some((item) => item.url === official89RCommittees)
      ? [...authority.sources, { label: "Official House 89th Legislature standing committee assignment roster", url: official89RCommittees }]
      : authority.sources,
  };
}

/**
 * All historical research is indexed by officeholder on the server. These
 * records are source-linked samples, not a complete bill or voting history.
 * Expansion records are not in themselves proof of member identity or
 * authority-page readiness; the six editorial gates remain fail-closed.
 */
const RESEARCH_BY_SLUG = new Map<string, PilotResearchRecord[]>();
for (const row of [...pilot.records, ...expansion.records]) {
  const records = RESEARCH_BY_SLUG.get(row.sponsor_slug) ?? [];
  records.push(row as PilotResearchRecord);
  RESEARCH_BY_SLUG.set(row.sponsor_slug, records);
}

export function pilotResearchFor(slug: string): PilotResearchRecord[] {
  return RESEARCH_BY_SLUG.get(slug) ?? [];
}

export type RepresentativeCertification = {
  state: RepresentativeCertificationState;
  evaluatedAt: string;
  gates: Record<"A" | "B" | "C" | "D" | "E" | "F", boolean>;
  reasons: string[];
  evidenceCount: number;
  officialSource?: string;
  researchCapture?: string;
  temporaryDataOutage?: boolean;
};

function isOfficialLegislativeSource(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === "capitol.texas.gov" &&
      parsed.pathname.startsWith("/BillLookup/History.aspx") &&
      parsed.searchParams.has("LegSess") && parsed.searchParams.has("Bill");
  } catch { return false; }
}

function isOfficialMemberUrl(url: string, office: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    return parsed.protocol === "https:" &&
      (office === "Texas Senate"
        ? host === "senate.texas.gov" && parsed.pathname === "/member.php"
        : host === "house.texas.gov" && /^\/members\/\d+$/.test(parsed.pathname));
  } catch { return false; }
}

export function certifyRepresentative(input: {
  slug: string;
  representative: Rep | null | undefined;
  authority: RepresentativeAuthority | null;
  temporaryDataOutage?: boolean;
}): RepresentativeCertification {
  const { slug, representative, authority } = input;
  const review = EDITORIAL_REVIEWS[slug];
  const records = pilotResearchFor(slug);
  const speakerRecords = speakerActivityFor(slug);
  const speakerEvidence = slug === "dustin-burrows" && speakerRecords.length >= 16 &&
    new Set(speakerRecords.map((record) => record.sourceUrl)).size === speakerRecords.length &&
    new Set(speakerRecords.map((record) => record.title)).size === speakerRecords.length &&
    new Set(speakerRecords.map((record) => record.kind)).size >= 3 &&
    new Set(speakerRecords.map((record) => record.date)).size >= 8 &&
    speakerRecords.every((record) => /^202[56]-\d{2}-\d{2}$/.test(record.date) &&
      Number.isFinite(Date.parse(record.date)) &&
      (record.sourceUrl.startsWith("https://lrl.texas.gov/scanned/leadershipdocs/") ||
       record.sourceUrl.startsWith("https://www.house.texas.gov/pdfs/speaker/")));
  const reasons: string[] = [];
  const gates: RepresentativeCertification["gates"] =
    { A: false, B: false, C: false, D: false, E: false, F: false };

  const mismatch = Boolean(review && representative && (
    representative.name !== review.name ||
    representative.office !== review.office ||
    representative.district !== review.district ||
    representative.party !== review.party ||
    representative.website !== review.officialUrl ||
    representative.status === "former"
  ));
  gates.A = Boolean(review && representative && !mismatch &&
    authority?.slug === slug && isOfficialMemberUrl(representative.website, review.office));
  if (!gates.A) reasons.push(mismatch ? "A: official identity/office/URL conflicts with reviewed pilot record" :
    "A: individual official identity and office verification is incomplete");

  const unique = new Map(records.map((row) => [row.bill_id + ":" + row.sponsor_role, row]));
  const roles = new Set(records.map((row) => row.sponsor_role));
  const statuses = new Set(records.map((row) => row.current_status_label));
  // Capped role-stratified 89th-legislature sample, not a complete career count.
  gates.B = Boolean(review && ((unique.size >= 16 && roles.size >= 2 && statuses.size >= 2) || speakerEvidence));
  if (!gates.B) reasons.push("B: distinctive, profile-specific official legislative role/outcome research not certified");

  gates.C = Boolean(review && authority?.reviewedAt && /^\d{4}-\d{2}-\d{2}$/.test(authority.reviewedAt) &&
    review.source.startsWith("https://") &&
    (records.length >= 16 || speakerEvidence) && records.every((row) =>
      isOfficialLegislativeSource(row.source_url) &&
      typeof row.bill_identifier === "string" && Boolean(row.caption?.trim()) &&
      !Number.isNaN(Date.parse(row.last_synced_at)) &&
      row.legislature_number === 89
    ) && authority.sources.some((source) =>
    source.url.replace(/^https:\/\/www\./, "https://") ===
    review.officialUrl.replace(/^https:\/\/www\./, "https://")));
  if (!gates.C) reasons.push("C: official bill histories, timestamps, or member source traceability incomplete");

  const cleanBiography = authority?.biography?.trim() ?? "";
  gates.D = Boolean(review && cleanBiography === review.biography &&
    !/this authority profile consolidates|consult the linked official biography/i.test(cleanBiography));
  if (!gates.D) reasons.push("D: generic profile copy or independent editorial review remains");

  gates.E = Boolean(review && authority &&
    authority.sources.every((source) => source.url.startsWith("https://")) &&
    representative && !representative.status &&
    ((records.length >= 16 && records.every((row) => row.bill_id)) || speakerEvidence));
  if (!gates.E) reasons.push("E: canonical office/source and research record linkage incomplete");

  const otherBiographies = Object.entries(EDITORIAL_REVIEWS)
    .filter(([other]) => other !== slug).map(([, data]) => data.biography);
  gates.F = Boolean(review && cleanBiography.length >= 140 &&
    !otherBiographies.includes(cleanBiography) &&
    (new Set(records.map((row) => row.bill_identifier + ":" + row.sponsor_role)).size >= 16 || speakerEvidence));
  if (!gates.F) reasons.push("F: profile-specific factual distinctiveness unverified");

  const state: RepresentativeCertificationState = mismatch ? "VERIFICATION_FAILED" :
    Object.values(gates).every(Boolean) ? "AUTHORITY_READY" : "NOT_READY";
  return {
    state,
    gates,
    reasons,
    evaluatedAt: review?.identityChecked ?? pilot.capturedAt,
    evidenceCount: speakerEvidence ? speakerRecords.length : records.length,
    ...(review ? { officialSource: review.source, researchCapture: speakerEvidence ? review.identityChecked : pilot.capturedAt } : {}),
    temporaryDataOutage: Boolean(input.temporaryDataOutage),
  };
}
