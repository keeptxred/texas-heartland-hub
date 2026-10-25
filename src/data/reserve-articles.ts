import type { ArticleBody } from "@/data/article-bodies";
import { VERIFIED_ADDITIONAL_RESERVE_ARTICLES } from "./reserve-articles-verified-2026";

export type ReserveArticle = {
  key: string;
  slugStem: string;
  category: string;
  title: string;
  dek: string;
  body: Omit<ArticleBody, "updated" | "related">;
};

// Prewritten, source-backed stories that require no AI or external feed.
// The safety-net job releases at most one after each 24-hour publishing gap.
export const RESERVE_ARTICLES: ReserveArticle[] = [
  {
    key: "texas-county-government",
    slugStem: "how-texas-county-government-works",
    category: "Legislature",
    title: "How Texas County Government Works—and Who Controls What",
    dek: "A practical guide to county judges, commissioners courts, sheriffs, clerks, tax offices, budgets, public meetings, and the local decisions that affect Texans.",
    body: {
      editorNote:
        "This prewritten reference article is part of the Keep TX Red publishing reserve. It is released only when the normal newsroom pipeline has been quiet for at least 24 hours.",
      intro: [
        "Texas county government is where many daily public services meet the taxpayer, yet its structure is easy to misunderstand. A county judge may sound like a courtroom official but often leads the commissioners court. Commissioners represent precincts but vote on a countywide budget. Sheriffs, clerks, treasurers, tax assessor-collectors, and many judges are independently elected, which means no single county executive controls the whole organization.",
        "That divided structure is deliberate. Texas counties are arms of the state with powers granted by the Texas Constitution and Legislature. They do not possess the broad home-rule authority available to large cities. Understanding who controls a decision is therefore the first step toward following county government effectively.",
      ],
      sections: [
        {
          heading: "The commissioners court is the county's governing body",
          paragraphs: [
            "Each county has a commissioners court made up of the county judge and four commissioners. Despite its name, the body mainly performs legislative and administrative work rather than deciding ordinary lawsuits. It adopts the budget and tax rate, approves many contracts, oversees county property, sets policies within state law, and funds departments ranging from roads to courts and elections.",
            "The county judge presides over meetings and is elected countywide. In smaller counties the judge may also perform judicial duties; in larger counties the role is primarily administrative and emergency-management focused. Commissioners are elected from four precincts, but each votes on the full county budget. A road project may be associated with one precinct while its funding still depends on the court as a whole.",
            "Commissioners courts must post meeting notices and conduct business under the Texas Open Meetings Act. Agendas matter because the court generally cannot take final action on a subject that was not properly posted. Residents can review the agenda before a meeting, read backup materials when available, and direct comments to the official who actually has authority over the item.",
          ],
        },
        {
          heading: "Independent elected officers divide responsibility",
          paragraphs: [
            "The sheriff operates the county jail and provides law enforcement, particularly in unincorporated areas. The district and county clerks maintain different court records and perform duties assigned by state law. The tax assessor-collector handles functions that can include vehicle registration, voter registration in some counties, and collection of property taxes for participating jurisdictions. The county treasurer, auditor, constables, justices of the peace, district attorney, and other officers each occupy their own legal lane.",
            "Because many of these officials are independently elected, the commissioners court usually controls their budgets more directly than their day-to-day decisions. A dispute over staffing may involve the court, while a question about how an officer performs a statutory duty belongs with that officer or, in some cases, a court. This separation can frustrate residents who expect a mayor-style chain of command, but it also prevents one official from controlling every local function.",
            "County departments also work beside state and local entities that are not county departments. An appraisal district values property independently; school districts and cities adopt their own tax rates; groundwater districts, hospital districts, and emergency-service districts may have separate boards. A county tax bill can collect charges for several entities without making the county responsible for all of them.",
          ],
        },
        {
          heading: "Budgets, taxes, roads, and emergency management",
          paragraphs: [
            "The annual budget is the clearest map of county priorities. It shows expected revenue, department appropriations, debt payments, capital projects, and staffing. Property taxes commonly provide a major share of general revenue, but fees, intergovernmental transfers, sales taxes where authorized, and other sources can matter. Truth-in-taxation notices allow residents to compare proposed rates and revenue before adoption.",
            "Counties maintain many roads outside municipalities, but the state operates highways and cities maintain municipal streets. Before reporting a pothole or drainage problem, residents should identify the road owner. The same address can sit in a city, county, flood-control district, and emergency-service district, with each entity responsible for a different layer of infrastructure.",
            "County judges commonly serve as emergency-management directors, coordinating with cities, state agencies, hospitals, utilities, and first responders during storms, fires, and other disasters. Emergency powers do not erase the normal division of authority, but they give the county a central coordination role. Residents should follow official county alerts and know whether evacuation, burn-ban, shelter, or disaster-assistance information comes from the county or another jurisdiction.",
          ],
        },
        {
          heading: "How Texans can follow county decisions",
          paragraphs: [
            "Start with the commissioners court calendar, agenda, and adopted minutes. Then locate the proposed budget, current tax-rate page, purchasing notices, election information, and the contact pages for independently elected officers. County websites vary, so the Texas Association of Counties directory can help identify the correct office.",
            "For a specific issue, ask three questions: which entity owns the asset or program, which official has legal authority, and when will the decision appear on a posted agenda or public notice? Those questions prevent wasted calls and make public comments more effective. A request aimed at the proper official before a vote is more useful than a general complaint after authority has already been exercised.",
            "County government is intentionally fragmented, but it is not unknowable. Agendas, budgets, tax notices, campaign filings, court records, and election results provide a public trail. Following that trail turns an abstract layer of government into a set of identifiable decisions and accountable officeholders.",
          ],
        },

        {
          heading: "Why This Matters",
          paragraphs: [
            "For Texans, knowing which county official actually has authority over a decision makes public accountability more precise. The commissioners court adopts many countywide budgets and tax decisions, while offices such as the sheriff and county clerk have separate elected responsibilities. Asking the correct office for records or action is more useful than assuming every county service reports to the county judge.",
            "Residents can track meeting agendas, budget hearings, tax-rate votes, and published records to understand which decisions were made publicly and who voted on them. This helps distinguish a disagreement about spending priorities from a question about an independently elected official’s duties.",
          ],
        },
      ],
      faq: [
        { q: "Is a Texas county judge always a courtroom judge?", a: "No. The county judge presides over the commissioners court and often leads administration and emergency management. Judicial duties vary by county." },
        { q: "Who sets the county property-tax rate?", a: "The commissioners court adopts the county rate. Cities, school districts, and special districts separately adopt their own rates." },
        { q: "Who maintains a road?", a: "It depends on ownership. The road may belong to a city, county, the Texas Department of Transportation, or another public entity." },
      ],
      sources: [
        { label: "Texas Constitution, Article V", url: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.5.htm" },
        { label: "Texas Association of Counties", url: "https://www.county.org/" },
        { label: "Texas Attorney General — Open Government", url: "https://www.texasattorneygeneral.gov/open-government" },
      ],
      keyTakeaways: [
        "The county judge and four commissioners form the commissioners court.",
        "Many county officers are independently elected rather than managed by the county judge.",
        "Counties possess powers granted by state law, not broad municipal home-rule authority.",
        "Posted agendas, budgets, and tax notices are the best tools for following county decisions.",
      ],
    },
  },
  {
    key: "texas-public-information",
    slugStem: "texas-public-information-act-request-guide",
    category: "Legislature",
    title: "Texas Public Information Requests: A Practical Guide",
    dek: "How to request records from a Texas government body, describe what you need, understand deadlines and costs, and respond when information may be withheld.",
    body: {
      editorNote:
        "This prewritten reference article is part of the Keep TX Red publishing reserve. It is released only when the normal newsroom pipeline has been quiet for at least 24 hours.",
      intro: [
        "Texas residents do not need a special title or a lawyer to ask a government body for existing public records. The Texas Public Information Act begins with the principle that government records belong to the people, subject to exceptions created by law. A useful request can uncover contracts, correspondence, reports, spending records, policies, and data that explain how a public decision was made.",
        "The process works best when the requester identifies the correct government body, asks for identifiable existing records, provides a realistic date range, and keeps a written copy. The law generally requires a prompt response, but it does not require an agency to answer questions, perform research, create a new document, or disclose information that an exception protects.",
      ],
      sections: [
        {
          heading: "Choose the correct government body",
          paragraphs: [
            "Send the request to the entity that possesses the records. A city police department will not necessarily hold a county sheriff's records. A school district is separate from the Texas Education Agency, and a county appraisal district is separate from the county commissioners court. When responsibility is unclear, review the agency's website, meeting agenda, or document letterhead before filing.",
            "Government bodies must identify a public-information contact and accepted methods for submitting requests. Many use an online portal, while others accept email, mail, or hand delivery. Using the designated method creates a reliable timestamp and reduces the risk that an informal message to the wrong employee will be overlooked.",
            "The act applies to existing recorded information in many formats, including paper, email, audio, video, databases, and messages about official business. It does not turn officials into interview subjects. Instead of asking why a contract was awarded, request the evaluation sheets, proposals, scoring records, staff recommendation, final contract, and communications concerning the award.",
          ],
        },
        {
          heading: "Write a narrow, searchable request",
          paragraphs: [
            "A strong request names the record types, subject, custodians when known, and date range. For example: request emails and attachments sent or received by named officials between two dates containing specified project terms. A broad request for every message an agency has ever created can produce delay, cost, and disputes without yielding useful information.",
            "Avoid demanding a format the agency cannot reasonably produce, but ask for electronic records in their native electronic format when that matters. Spreadsheets are easier to analyze as spreadsheets than as printed PDF pages. If metadata or attachments are important, say so. If you want only final reports rather than drafts, include that limitation.",
            "Do not include unnecessary personal information in the request. The request itself may become a public record. Provide enough contact information to receive estimates, clarification questions, records, and legal notices, but avoid sensitive identifiers unrelated to the search.",
          ],
        },
        {
          heading: "Deadlines, exceptions, and attorney general rulings",
          paragraphs: [
            "A government body must produce public information promptly, which means as soon as reasonably possible under the circumstances. If it believes requested material may be withheld, it generally must seek a decision from the Office of the Attorney General within ten business days, unless a previous determination or another rule applies. The agency must also notify the requester and provide the required information about that process.",
            "The ten-business-day point is not always the date records must be delivered. Large searches, redaction work, consultations, and cost questions can extend production. Still, silence should not be the normal response. Keep the original submission receipt and follow up in writing if the body has not acknowledged the request.",
            "Exceptions protect categories such as certain confidential personal information, active law-enforcement interests, attorney-client communications, security details, and information made confidential by other statutes. Some exceptions are mandatory; others may be waived. An exception should be tied to specific material rather than used as a reason to ignore the whole request.",
          ],
        },
        {
          heading: "Costs, clarification, and practical follow-up",
          paragraphs: [
            "Texas rules permit charges for copies, labor, programming, and other work in qualifying circumstances. If estimated charges exceed a statutory threshold, the government body generally provides an itemized estimate before proceeding. A requester can narrow the scope, inspect records instead of obtaining copies where available, or accept the estimate.",
            "If an agency asks for clarification, respond promptly and preserve the exchange. Clarification can improve the request, but a government body should not use it to force the requester to identify a document number that only the agency knows. Describe the public business, people, time period, and record types as concretely as possible.",
            "When records arrive, compare the production with the request. Check whether attachments are present, date ranges are complete, redactions are labeled, and withheld categories are explained. A courteous, precise follow-up often resolves omissions. For persistent problems, the Attorney General's Open Government Hotline provides guidance, and legal advice may be appropriate in consequential disputes.",
            "Keep a simple request log with the submission date, tracking number, contact person, estimates, payments, clarification messages, ruling deadlines, and production dates. That record becomes important when an agency sends material in installments or when several offices hold related documents. It also lets a requester distinguish an ordinary production delay from a missed legal step and explain the history accurately in any later complaint or appeal.",
          ],
        },

        {
          heading: "Why This Matters",
          paragraphs: [
            "Why this matters to Texans is practical: a focused request for existing records can let residents check what a public body actually approved, spent, or communicated rather than relying on rumors or a press release. The right agency and a specific record description help ensure the request reaches the people who can locate it.",
            "Public information requests seek records, not new explanations or research prepared on demand. Tracking the request date, the agency’s response, any claimed exceptions, and the applicable attorney general process gives Texans a better way to assess whether access to government information is being handled as the law requires.",
          ],
        },
      ],
      faq: [
        { q: "Must I be a Texas resident?", a: "The statute generally gives each person access to public information; a requester does not need to explain a political or journalistic purpose." },
        { q: "Can I require an agency to answer questions?", a: "No. The act provides access to existing recorded information. Frame questions as requests for the records that would contain the answer." },
        { q: "Are public records always free?", a: "No. Inspection or small electronic productions may be free, while larger requests can carry charges governed by state cost rules." },
      ],
      sources: [
        { label: "Texas Public Information Act", url: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.552.htm" },
        { label: "Texas Attorney General — Public Information Act", url: "https://www.texasattorneygeneral.gov/open-government/members-public" },
        { label: "Texas Attorney General — Charges for Public Information", url: "https://www.texasattorneygeneral.gov/open-government/governmental-bodies/charges-public-information" },
      ],
      keyTakeaways: [
        "Request identifiable existing records rather than asking an agency to create answers.",
        "Use the government body's designated submission method and retain the receipt.",
        "Narrow subjects, custodians, record types, and date ranges make searches more effective.",
        "Agencies may charge permitted costs and may withhold only information protected by law.",
      ],
    },
  },
  {
    key: "texas-emergency-plan",
    slugStem: "texas-household-emergency-plan-checklist",
    category: "Non-Political",
    title: "A Texas Household Emergency Plan That Works Year-Round",
    dek: "A practical preparedness checklist for Texas heat, freezes, hurricanes, tornadoes, wildfires, floods, power outages, evacuation, and family communication.",
    body: {
      editorNote:
        "This prewritten reference article is part of the Keep TX Red publishing reserve. It is released only when the normal newsroom pipeline has been quiet for at least 24 hours.",
      intro: [
        "Texas households can face triple-digit heat, flash flooding, tornadoes, hurricanes, wildfire smoke, hard freezes, and power outages—sometimes in the same year. Preparedness is less about buying a dramatic survival kit than making ordinary decisions before stress removes time and options.",
        "A durable plan covers alerts, communication, medication, water, transportation, pets, documents, and the specific hazards surrounding an address. It should work whether a family must shelter for several hours, live without utilities for several days, or leave the area quickly.",
      ],
      sections: [
        {
          heading: "Start with the hazards around the address",
          paragraphs: [
            "Identify whether the home is near a floodplain, bayou, coast, wildfire-prone vegetation, industrial corridor, dam, or evacuation route. Learn which local office issues warnings and whether the address lies in a hurricane evacuation zone. County and city emergency-management pages often provide localized maps, shelter information, and alert enrollment.",
            "Do not rely on outdoor sirens as an indoor warning system. Enable Wireless Emergency Alerts on phones, use a weather radio where reception and power loss are concerns, and subscribe to the local emergency-alert service. Households should know the difference between a watch, which means conditions are possible, and a warning, which means the hazard is occurring or imminent.",
            "Choose the safest available location for each hazard. Tornado sheltering usually means a small interior room on the lowest floor away from windows. Flooding can require moving to higher ground rather than staying inside. Hurricane and wildfire instructions may require early evacuation. One universal location is not appropriate for every emergency.",
          ],
        },
        {
          heading: "Build water, food, power, and medical resilience",
          paragraphs: [
            "Store water for drinking and basic sanitation, taking household size, heat, pets, and medical needs into account. Rotate shelf-stable food that the household already eats and keep a manual can opener. People with infants, allergies, diabetes, or other dietary needs should maintain a tailored reserve rather than depending on a generic list.",
            "Keep essential medications filled within prescription rules and maintain a written medication list. Backup batteries, power banks, flashlights, and safe charging options matter during outages. Generators must remain outdoors, far from doors, windows, and vents; carbon monoxide can kill even when a garage door is open. Battery-operated carbon-monoxide alarms provide another layer of protection.",
            "Plan for temperature, not just electricity. During extreme heat, know the nearest cooling center and recognize heat illness. During a freeze, protect people first, then pipes and property. Never heat a home with an oven, grill, or outdoor combustion appliance. If a household member depends on powered medical equipment, register with the utility where programs exist but maintain an independent backup plan.",
          ],
        },
        {
          heading: "Make evacuation and communication concrete",
          paragraphs: [
            "Select an out-of-area contact who can relay messages when local networks are congested. Every household member should know two meeting places: one near home and another outside the neighborhood. Write down key numbers because a dead or lost phone removes access to stored contacts.",
            "Keep vehicles reasonably fueled when severe weather is forecast, and identify more than one route. Coastal residents should know that evacuation decisions account for storm surge and road capacity, not only the forecast point of landfall. Leaving after roads are gridlocked can be more dangerous than following local timing guidance.",
            "Include pets and livestock from the beginning. Identify carriers, leashes, vaccination records, food, water, and destinations that accept animals. Large-animal owners need trailer capacity and a destination before a fire or flood threatens. Shelters may have specific rules, so assumptions made at the door can create avoidable delays.",
          ],
        },
        {
          heading: "Protect documents and rehearse the plan",
          paragraphs: [
            "Store copies of identification, insurance policies, prescriptions, property inventories, account contacts, and important medical information in a protected physical container and an encrypted digital location. Photograph rooms and valuable property before disaster season. Documentation can accelerate insurance claims and assistance applications.",
            "Review insurance for the hazards that apply. Standard homeowners policies generally do not replace separate flood coverage, and coastal wind coverage may be structured differently. Understand deductibles, exclusions, waiting periods, and the steps required to document damage. Do not enter a damaged structure until authorities say it is safe.",
            "Test the plan twice a year and whenever the household changes. Practice reaching the shelter location, sending the family check-in message, operating medical backups, and loading pets. Replace expired supplies and update contacts. A short rehearsal exposes missing keys, dead batteries, inaccessible carriers, and unrealistic assumptions while those problems are still easy to fix.",
            "Neighbors can strengthen the plan without surrendering privacy or independence. Identify who may need help receiving warnings, moving mobility equipment, checking a generator, or transporting an animal. Agree in advance on safe ways to check in, particularly during extreme heat or a prolonged outage. A neighborhood contact list should complement official instructions, not replace them, and nobody should enter floodwater, a fire zone, a damaged building, or another dangerous area to perform an informal welfare check.",
            "Recovery planning deserves the same attention as the first warning. Keep cleanup gloves, sturdy shoes, masks, basic tools, and a way to photograph damage. Treat downed power lines as energized, avoid contaminated floodwater, and use licensed professionals where electrical, gas, structural, or major tree hazards are involved. Save receipts for emergency lodging, repairs, food loss, and temporary supplies because insurers or assistance programs may request documentation.",
          ],
        },

        {
          heading: "Why This Matters",
          paragraphs: [
            "For Texans, a written emergency plan turns an uncertain warning into a set of decisions already made: where to shelter, whether and when to evacuate, who will check on vulnerable family members, and what to do when electricity or cellular service fails. The best plan reflects the actual hazards and official alerts affecting a particular address.",
            "Families can reduce avoidable confusion by documenting medications, accessible transportation, pet arrangements, important contacts, and backup ways to receive reliable weather and emergency instructions. Practicing the plan and revisiting it after a move or major household change matters more than buying supplies without deciding how to use them.",
          ],
        },
      ],
      faq: [
        { q: "How much water should a household store?", a: "Federal guidance commonly starts with at least one gallon per person per day for several days, with additional water for heat, pets, illness, and sanitation." },
        { q: "Can a generator run in a garage?", a: "No. Generators belong outdoors well away from doors, windows, and vents because carbon monoxide can accumulate and enter the home." },
        { q: "Should every Texas household evacuate for a hurricane?", a: "No. Follow local officials and evacuation-zone guidance. Unnecessary evacuation can add congestion for residents facing storm-surge risk." },
      ],
      sources: [
        { label: "Texas Ready", url: "https://texasready.gov/" },
        { label: "Texas Division of Emergency Management", url: "https://tdem.texas.gov/" },
        { label: "National Weather Service Safety", url: "https://www.weather.gov/safety/" },
        { label: "FEMA Ready.gov", url: "https://www.ready.gov/" },
      ],
      keyTakeaways: [
        "Plan for the hazards surrounding the specific address.",
        "Use multiple warning methods and know the correct shelter or evacuation action.",
        "Include medication, powered medical devices, pets, transportation, and temperature safety.",
        "Rehearse and update the plan at least twice a year.",
      ],
    },
  },
  {
    key: "texas-bill-process",
    slugStem: "how-a-texas-bill-becomes-law",
    category: "Legislature",
    title: "How a Texas Bill Becomes Law—and Where to Track It",
    dek: "A practical guide to filing, committees, calendars, floor votes, conference committees, governor action, effective dates, and the Texas Legislature Online records that show what actually happened.",
    body: {
      editorNote:
        "This prewritten reference article is part of the Keep TX Red publishing reserve. It is released only when the normal newsroom pipeline has been quiet for at least 24 hours.",
      intro: [
        "A Texas bill does not become law because it was filed, received a hearing, passed one chamber, or appeared in a press release. The process is a sequence of public actions that can be followed in official records from introduction through committee work, floor votes, action by the second chamber, agreement on final language, and delivery to the governor. Texas Legislature Online, commonly called TLO, is the most useful public record for following those steps.",
        "Understanding the sequence matters because political claims often compress several stages into one. A bill that is reported favorably from committee is not yet passed by the House or Senate. A bill that passes one chamber still has another chamber to clear. A bill that passes both chambers in different forms is not finished until lawmakers agree on identical text. The safest way to describe a bill is to identify the latest official action and the date it occurred.",
      ],
      sections: [
        {
          heading: "Filing starts the public legislative record",
          paragraphs: [
            "A member of the Texas House or Senate files a bill and the measure receives a bill number. House bills use the HB prefix and Senate bills use SB. Other types of measures include joint resolutions, concurrent resolutions, and simple resolutions, each with a different legal purpose. TLO provides the text, author or sponsor information, action history, committee referrals, votes, analyses, fiscal notes when available, and later versions of the measure.",
            "The introduced version is only the starting point. Bills can be substituted or amended during the process, so quoting the filed text after later action can be misleading. TLO's text history allows readers to compare versions and identify whether language was added, removed, or rewritten. Committee substitutes are especially important because a committee may recommend a substantially revised version instead of the exact bill that was filed.",
            "Texas holds regular legislative sessions in odd-numbered years under the state constitution, and the governor may call special sessions. Special sessions are narrower because the governor identifies the subjects lawmakers may consider. Filing deadlines, calendars, and procedural rules affect which bills can advance, so a proposal's legal status should be checked against the official session record rather than inferred from a sponsor's announcement.",
          ],
        },
        {
          heading: "Committees do much of the detailed work",
          paragraphs: [
            "After filing and referral, a bill normally goes to a committee with jurisdiction over the subject. Committees can hold public hearings, receive testimony, request analysis, amend language, substitute a new version, report the bill favorably, report it unfavorably, or take no final action. Many filed bills never leave committee, which is why a hearing should not be described as legislative passage.",
            "Committee pages and bill histories show scheduled hearings and reported actions. Written analyses, witness lists, fiscal notes, and other supporting documents can reveal how the proposal would operate and what supporters or opponents argued. For a reader trying to understand substance rather than political messaging, those records are often more useful than a short floor speech or campaign statement.",
            "A favorable committee report still does not put every bill immediately before the full chamber. House and Senate scheduling procedures differ, and calendars or other procedural steps determine when a measure is eligible for floor consideration. Readers should look for the actual floor action in the official history before saying the chamber approved a bill.",
          ],
        },
        {
          heading: "Both chambers must agree to the same text",
          paragraphs: [
            "When a bill reaches a chamber floor, members may debate it and consider amendments under the chamber's rules. Passage in the originating chamber sends the measure to the other chamber, where the committee and floor process begins again. The second chamber can pass the bill unchanged, reject it, or pass a different version.",
            "If the House and Senate pass different language, the disagreement must be resolved before the measure can be sent to the governor. One chamber may concur in the other's amendments, or lawmakers may use a conference committee to work out differences. A conference committee report must then receive the approvals required by legislative procedure. The final enrolled bill is the version that matters for determining what lawmakers actually sent to the governor.",
            "Vote records should be read with the action they belong to. A committee vote, procedural vote, amendment vote, and final passage vote answer different questions. TLO links recorded votes where available, allowing readers to distinguish a member's position on an amendment from the member's vote on final passage.",
          ],
        },
        {
          heading: "The governor acts after legislative passage",
          paragraphs: [
            "After the Legislature completes a bill and the final text is enrolled, the measure is sent to the governor. Depending on timing and constitutional rules, the governor may sign a bill, veto it, or allow it to become law without a signature. Texas also has line-item veto authority for appropriations. The official bill history and governor records provide the safest confirmation of final action.",
            "A bill's effective date is a separate question from whether it became law. Some laws take effect immediately when the constitutional vote threshold and bill language support that result; others take effect on a specified date or under the default constitutional timing. The enrolled bill and final legislative information should be checked before telling readers when a new requirement begins.",
            "For practical tracking, save the TLO bill page rather than a search result or social-media screenshot. Check the Actions tab for the most recent official step, the Text tab for the current version, the Votes tab for recorded votes, and available analyses or fiscal notes for context. That habit makes it possible to report what the Legislature actually did without confusing a proposal, committee recommendation, chamber passage, or final law.",
          ],
        },

        {
          heading: "Why This Matters",
          paragraphs: [
            "For Texans, each legislative stage answers a different question: what is proposed, whether a committee advanced it, how each chamber voted, and whether the final measure actually became law. A filing or committee hearing does not itself change state law. That distinction helps readers evaluate legislative claims without confusing a proposal with a requirement already in force.",
            "Texas Legislature Online lets readers check bill text, current status, actions and available recorded votes directly. Following the official record makes it easier to see what changed, identify the lawmakers who acted, and determine whether the measure was sent to the governor.",
          ],
        },
      ],
      faq: [
        { q: "Does a committee vote make a Texas bill law?", a: "No. Committee action is only one stage. A bill generally must clear the required steps in both chambers and complete the constitutional process before becoming law." },
        { q: "Where can I see the latest official version of a bill?", a: "Texas Legislature Online publishes bill text and action history. Check the text history because later substitutes, amendments, or enrolled versions may differ from the filed bill." },
        { q: "If both chambers pass a bill, is the process always finished?", a: "Not necessarily. If the chambers passed different versions, they must agree on identical final language before the measure can be sent to the governor." },
      ],
      sources: [
        { label: "Texas Legislature Online — How to Follow a Bill", url: "https://capitol.texas.gov/resources/FollowABill.aspx" },
        { label: "Texas House — How a Bill Becomes a Law", url: "https://house.texas.gov/index.php/about" },
        { label: "Texas Constitution, Article III", url: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.3.htm" },
      ],
      keyTakeaways: [
        "A filed bill is a proposal, not a law.",
        "Committee action, chamber passage, and final legislative passage are separate milestones.",
        "Both chambers must ultimately agree on the same text.",
        "Texas Legislature Online is the best public record for bill text, actions, votes, and status.",
      ],
    },
  },
  {
    key: "texas-agency-rulemaking",
    slugStem: "how-texas-state-agencies-make-rules",
    category: "Legislature",
    title: "How Texas State Agencies Make Rules—and How the Public Can Follow Them",
    dek: "A practical guide to proposed rules, public comments, adopted rules, emergency rules, the Texas Register, and the Texas Administrative Code.",
    body: {
      editorNote:
        "This prewritten reference article is part of the Keep TX Red publishing reserve. It is released only when the normal newsroom pipeline has been quiet for at least 24 hours.",
      intro: [
        "The Legislature writes statutes, but much of the detail Texans encounter in licensing, environmental regulation, professional standards, benefits, transportation, health, education, and other programs appears in administrative rules. State agencies adopt those rules under authority granted by law. The Texas Register is the official public journal that lets residents see proposed, adopted, withdrawn, reviewed, and emergency rule actions as they move through that process.",
        "Rulemaking is easy to miss because it does not look like a bill moving through the Capitol. A proposal can be highly consequential even though no floor vote appears on television. The public record is still extensive: agencies publish proposed text and explanations, identify statutory authority, accept comments when required, respond to significant issues, and later publish adopted rules. Final rules are codified in the Texas Administrative Code.",
      ],
      sections: [
        {
          heading: "Start with the agency's legal authority",
          paragraphs: [
            "A Texas agency cannot simply create any policy it wants and call it a rule. Rulemaking authority comes from the constitution or statutes that assign duties and powers to the agency. A proposed rule notice ordinarily identifies the legal authority relied upon. Reading that authority helps answer whether the proposal is implementing a specific legislative command, filling in administrative details, or interpreting a broader delegation.",
            "The Administrative Procedure Act in Government Code Chapter 2001 supplies the general framework for state rulemaking. Other statutes can create agency-specific requirements, deadlines, consultation duties, or exceptions. That means two agencies may follow the same basic administrative framework while still operating under different program statutes.",
            "For readers evaluating a controversial rule, separate the policy question from the authority question. The agency's explanation may argue that a proposal is wise, but the legal citation tells you why the agency believes it has power to adopt it. Courts can review agency action under applicable law, and the Legislature can change the underlying statute, but neither possibility changes the need to identify the current official rulemaking record.",
          ],
        },
        {
          heading: "The Texas Register is the rulemaking journal",
          paragraphs: [
            "The Secretary of State publishes the Texas Register weekly. It includes proposed rules, adopted rules, withdrawn proposals, emergency rules, notices of rule review, attorney general opinions, appointments, and other official materials. The Register page also provides current and previous issues and a searchable archive, making it possible to follow a proposal from publication through later action.",
            "A proposed-rule notice typically explains the purpose of the rule, provides proposed text, identifies statutory authority, and includes information required by law about fiscal or other impacts. It also tells the public how and when to submit comments and whether a hearing is available or scheduled. Those details matter because comments sent outside the stated process may not become part of the formal rulemaking record.",
            "The Register is a publication channel, not the author of agency policy. Questions about a particular proposal belong with the agency that submitted it. The notice includes agency contact information, and many agencies maintain their own rulemaking pages with additional staff contacts, hearing information, or explanatory material.",
          ],
        },
        {
          heading: "Public comments can test the proposal before adoption",
          paragraphs: [
            "During the comment period, residents, regulated businesses, local governments, professional groups, advocates, and other interested people can submit information and arguments. Effective comments are specific. They identify the section at issue, explain the practical or legal concern, and provide evidence or an alternative when possible. A short, well-supported comment can be more useful than a broad statement that does not engage the proposed text.",
            "Comments do not function like votes in an election. An agency does not decide a rule simply by counting messages for and against it. The purpose is to build an administrative record and give the agency information it must consider under applicable law. When a rule is adopted, the agency's published order generally explains the action and addresses relevant comments or changes.",
            "A proposal can change before adoption. That is why someone who commented on the proposed version should still read the adopted notice. The final wording, effective date, agency explanation, and response to comments may differ from what appeared initially. If the agency does not adopt the proposal, the Register can also document withdrawal or other disposition.",
          ],
        },
        {
          heading: "Adopted rules move into the Texas Administrative Code",
          paragraphs: [
            "After adoption and the required filing and publication steps, permanent rules are codified in the Texas Administrative Code, organized by title, part, chapter, subchapter, and section. The Code is the better place to read the currently codified rule text, while the Register is the better place to understand the history of a particular rulemaking action.",
            "Emergency rules follow a different accelerated path permitted by statute in qualifying circumstances. Their existence is another reason not to assume that every rule change follows an identical schedule. The Register identifies emergency actions, and the Administrative Procedure Act sets the governing framework. Readers should use the official notice rather than treating an agency press release as the legal text.",
            "A reliable rulemaking workflow is simple: locate the proposal in the Texas Register, save its agency and rule identifiers, read the cited statutory authority, note the comment deadline, check later Register issues for adoption or withdrawal, and then verify the codified rule in the Texas Administrative Code. That chain separates proposal from final law and gives Texans a durable public record of how administrative policy changed.",
          ],
        },

        {
          heading: "Why This Matters",
          paragraphs: [
            "An agency rule can affect how Texans apply for licenses, comply with requirements, or use public services even when there is no new floor vote in the Legislature. The proposal stage is an opportunity to review the agency’s stated legal authority, the actual rule text, its anticipated effects, and the available comment process.",
            "Checking the Texas Register for proposed and adopted rules, then consulting the current Texas Administrative Code, helps residents and businesses separate a proposal from an effective requirement. The effective date and final adopted language—not an announcement about a proposed rule—determine what may be required now.",
          ],
        },
      ],
      faq: [
        { q: "Is a proposed Texas agency rule already in effect?", a: "Usually no. A proposal is part of the rulemaking process. Check later official notices and the Texas Administrative Code to determine whether and when a rule was adopted and became effective." },
        { q: "Where are Texas agency rules published?", a: "Rulemaking notices appear in the Texas Register. Adopted permanent rules are codified in the Texas Administrative Code." },
        { q: "Do public comments work like a vote?", a: "No. Agencies consider comments under the governing legal process; rulemaking is not decided by simply counting comments for and against." },
      ],
      sources: [
        { label: "Texas Secretary of State — Texas Register", url: "https://www.sos.state.tx.us/texreg/index.shtml" },
        { label: "Texas Administrative Procedure Act", url: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.2001.htm" },
        { label: "Texas Administrative Code", url: "https://texreg.sos.state.tx.us/public/readtac$ext.ViewTAC" },
      ],
      keyTakeaways: [
        "Texas agencies adopt rules under authority granted by law.",
        "The Texas Register publishes proposed, adopted, withdrawn, reviewed, and emergency rule actions.",
        "Public comments are part of an administrative record, not a simple popularity vote.",
        "The Texas Administrative Code contains codified permanent agency rules.",
      ],
    },
  },
  {
    key: "texas-open-meetings",
    slugStem: "texas-open-meetings-act-practical-guide",
    category: "Legislature",
    title: "Texas Open Meetings: A Practical Guide to Agendas, Quorums, and Closed Sessions",
    dek: "How to read public meeting notices, understand quorums and deliberation, follow executive sessions, find minutes or recordings, and distinguish a public meeting from a public hearing.",
    body: {
      editorNote:
        "This prewritten reference article is part of the Keep TX Red publishing reserve. It is released only when the normal newsroom pipeline has been quiet for at least 24 hours.",
      intro: [
        "The Texas Open Meetings Act is built around a straightforward idea: when a covered governmental body deliberates or acts on public business as a body, the public generally has a right to know when and where that meeting will occur and to observe the open portions of the meeting. The details matter, however, because the law defines governmental bodies, meetings, deliberation, quorums, notice, emergency circumstances, closed sessions, and records with specific legal rules.",
        "For residents, the most useful skill is learning to read a posted agenda before the meeting begins. The notice identifies the body, meeting time and place, and subjects to be considered. It creates the public roadmap for the meeting and helps residents decide when to attend, what documents to request, and which official has authority over the decision.",
      ],
      sections: [
        {
          heading: "Notice is the public roadmap",
          paragraphs: [
            "Governmental bodies subject to the Act must post notice in the manner and within the time required by law. The notice must be sufficiently specific to inform the public about the subjects the body will consider. A vague label can be inadequate when it hides the real matter under discussion, while routine items may require less detail than an unusual or high-interest decision.",
            "Before attending, compare the agenda with supporting material published by the body. Cities, counties, school districts, boards, and state agencies often post staff reports, contracts, maps, presentations, or proposed orders alongside the agenda. Those packets are not a substitute for the legal notice, but they can make a technical agenda item understandable before officials begin deliberating.",
            "If an issue is not on the posted notice, officials may be limited in what they can deliberate or decide about it during that meeting. Public-comment periods do not automatically turn every subject raised by a speaker into an agenda item. A body may sometimes provide a limited response permitted by law, but a later posted meeting may be necessary for fuller deliberation or action.",
          ],
        },
        {
          heading: "Quorums and deliberation are central concepts",
          paragraphs: [
            "The Act focuses heavily on whether a quorum of a governmental body is deliberating public business. A quorum is generally the minimum number of members required to conduct the body's business, although the exact number depends on the body and governing law. The statutory definitions are important when evaluating gatherings, electronic communications, committees, or serial discussions.",
            "Officials do not escape open-meeting requirements merely by avoiding a formal vote if a covered deliberation is occurring. At the same time, not every social encounter, training event, ceremonial appearance, or communication automatically becomes a meeting. The statute contains definitions and exceptions that should be applied to the actual facts rather than reduced to a slogan.",
            "For the public, the practical approach is to distinguish individual constituent communication from collective governmental deliberation. Residents can contact officials separately, but when members of a covered body collectively discuss matters within their jurisdiction, notice and meeting requirements may become relevant. Complex situations can require legal analysis, which is why the Attorney General publishes an Open Meetings Act handbook and training resources.",
          ],
        },
        {
          heading: "Closed sessions are exceptions, not a second invisible government",
          paragraphs: [
            "The Act permits closed meetings for specified subjects, commonly including certain consultations with an attorney, personnel matters, real-property deliberations, security issues, or other matters authorized by statute. A body should identify the legal basis before entering a closed session and follow the procedural requirements that apply.",
            "A closed session does not mean every related action can occur in secret. Final action, decisions, or votes generally must occur in an open meeting as required by law. Residents following an issue should watch both the announcement that the body is entering closed session and the open-session agenda item where later action may be taken.",
            "The existence of an exception also does not make every document about the subject confidential. Open-meeting law and public-information law are separate frameworks. A body may lawfully discuss a matter in closed session while some related records remain public, or records may be protected under another law. Requests for documents should therefore be evaluated under the Public Information Act and other applicable confidentiality rules rather than the meeting label alone.",
          ],
        },
        {
          heading: "Minutes, recordings, public comment, and practical follow-up",
          paragraphs: [
            "Covered bodies must keep records of open meetings as required by law, and many entities provide agendas, minutes, recordings, or video archives online. Minutes usually summarize subjects and actions rather than reproduce every statement. A recording can provide fuller context, while written orders, resolutions, contracts, and vote records show the legal result.",
            "Public comment is important but is not identical across every governmental body. State law and local rules can govern when and how members of the public may address a body, including reasonable time limits and procedures. A public meeting also is not necessarily a public hearing; some hearings are required by specific statutes and have their own notice or participation rules.",
            "To follow an issue effectively, save the posted notice, note the agenda item number, download the packet, watch or attend the meeting, record the motion and vote, and later compare the approved minutes or final document. If a meeting-law question remains, the Office of the Attorney General provides training materials and an Open Government Hotline for general information, while legal advice may be necessary for a specific dispute.",
          ],
        },

        {
          heading: "Why This Matters",
          paragraphs: [
            "Meeting notices, agendas and public records let Texans know when public bodies may make decisions that affect budgets, schools, local services, and community priorities. The posted subject of an agenda item matters because it helps residents decide whether to attend, watch, or request related records before a decision is made.",
            "Open-meetings requirements do not make every discussion public or guarantee identical comment opportunities at every meeting. Residents should distinguish an open meeting from a legally permitted closed session, follow the published agenda and minutes or recordings, and use official procedures to raise concerns about a specific decision.",
          ],
        },
      ],
      faq: [
        { q: "Can a Texas governmental body ever meet in closed session?", a: "Yes, but only when a statutory exception applies and the body follows the required procedure. Final action generally must occur in open session as required by law." },
        { q: "Is every gathering of public officials automatically a meeting?", a: "No. The Act contains definitions and exceptions. Quorum, deliberation, subject matter, and the facts of the gathering matter." },
        { q: "Does public comment let a body act on any subject raised by a speaker?", a: "No. The posted agenda and applicable law govern what the body may deliberate or decide at that meeting." },
      ],
      sources: [
        { label: "Texas Government Code Chapter 551 — Open Meetings", url: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.551.htm" },
        { label: "Texas Attorney General — Open Meetings Act Training", url: "https://www.texasattorneygeneral.gov/open-government/governmental-bodies/pia-and-oma-training-resources/open-meetings-act-training" },
        { label: "Texas Attorney General — Open Government Resources", url: "https://www.texasattorneygeneral.gov/open-government/governmental-bodies" },
      ],
      keyTakeaways: [
        "Posted notice tells the public what a covered governmental body plans to consider.",
        "Quorum and deliberation are central concepts in determining when the Act applies.",
        "Closed sessions require legal authority and do not generally replace open-session final action.",
        "Agendas, packets, recordings, minutes, and final documents create a public trail for following decisions.",
      ],
    },
  },
  ...VERIFIED_ADDITIONAL_RESERVE_ARTICLES,
];
