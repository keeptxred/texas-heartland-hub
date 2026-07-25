import type { ArticleBody } from "@/data/article-bodies";

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
];
