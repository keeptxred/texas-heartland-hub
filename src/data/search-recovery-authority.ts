export type SearchRecoveryAuthoritySection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type SearchRecoveryAuthorityGuide = {
  slug: string;
  title: string;
  dek: string;
  eyebrow: string;
  updated: string;
  keyTakeaways: string[];
  snapshot?: { label: string; value: string; note?: string }[];
  sections: SearchRecoveryAuthoritySection[];
  faq: { q: string; a: string }[];
  sources: { name: string; url: string; note: string }[];
  related: { label: string; href: string }[];
  methodology: string;
};

export const SEARCH_RECOVERY_AUTHORITY_GUIDES: Record<string, SearchRecoveryAuthorityGuide> = {
  "texas-lobbying-2026": {
    "slug": "texas-lobbying-2026",
    "title": "Who Lobbies Texas Government? 2026 Lobbyists, Clients and Spending Explained",
    "dek": "A source-first guide to Texas Ethics Commission lobbying records: registrations, clients, compensation ranges, activity reports, expenditures, subject matter and the limits of what the public data can prove.",
    "eyebrow": "Texas public-record research guide",
    "updated": "2026-09-28",
    "keyTakeaways": [
      "The Texas Ethics Commission maintains searchable lobby registration and activity-report records and publishes current-year lists and downloadable data.",
      "Lobby compensation is commonly disclosed through statutory reporting ranges rather than as a precise contract amount.",
      "Activity and expenditure records add context, but a filing does not establish that a lobbyist caused a vote, agency decision or policy outcome.",
      "Reliable analysis starts with an official registration and independently verifies any connected bill, rule or government action in the system that controls that subject.",
      "KeepTXRed treats lobbying disclosures as public-record data, not as evidence of wrongdoing by themselves."
    ],
    "snapshot": [
      {
        "label": "Registration archive",
        "value": "1998–present",
        "note": "TEC says lobby registrations have been collected since 1998."
      },
      {
        "label": "Electronic activity data",
        "value": "2000–present",
        "note": "TEC says searchable electronic activity information begins in 2000."
      },
      {
        "label": "Current-year lists",
        "value": "Updated daily",
        "note": "TEC says current registration and activity lists are updated daily."
      }
    ],
    "sections": [
      {
        "heading": "What the Texas lobbying database actually contains",
        "paragraphs": [
          "Texas requires covered lobbyists to register and file activity information with the Texas Ethics Commission. The public tools allow searches of registrations and activity reports and provide lobby expenditure information, client-compensation codes, subject-matter lists and downloadable data. That gives readers a path from a person or organization name to a primary filing rather than to a secondary summary.",
          "The records answer different questions. A registration identifies the registrant and disclosed clients. Activity reports document required filings for a period. Expenditure records document reportable spending. Subject-matter classifications indicate broad areas of interest. None of those fields, standing alone, reveals every private communication or proves why a public official acted."
        ]
      },
      {
        "heading": "How to trace a client through the official records",
        "paragraphs": [
          "A useful starting point is the current registration list sorted by client name. It can show which registered lobbyists identify a particular business, association, nonprofit or other client. The lobbyist-sorted view shows the clients attached to a registrant, while subject-matter lists can narrow a broad research question before individual filings are opened.",
          "The next step is to verify any bill, agency rule, budget item or appointment independently. Legislation belongs in Texas Legislature Online, agency rules in the Texas Register and Texas Administrative Code, and campaign contributions in the separate campaign-finance system. Keeping the systems separate prevents a registration from being misrepresented as a legislative action."
        ]
      },
      {
        "heading": "Compensation codes are ranges, not exact contract prices",
        "paragraphs": [
          "Texas lobbying disclosures use compensation or reimbursement codes. Those codes place compensation within a disclosed range, but they should not be converted into a fabricated exact payment. When the source gives a range, KTR should preserve the range and explain that the filing does not disclose a single precise amount.",
          "Aggregations need the same caution. Adding the high end of every range produces a maximum-style estimate; adding the low end produces a minimum-style estimate. If KTR publishes either calculation, it should label the method and retain the filer, client, year and source record so a reader can reproduce it."
        ]
      },
      {
        "heading": "What activity and expenditure reports can show",
        "paragraphs": [
          "Activity and expenditure records add timing and spending context. They can help identify patterns, compare reporting periods and direct readers to the underlying filing. They are particularly useful when paired with a clearly defined research question, such as which registered lobbyists listed a client during a legislative session.",
          "They still do not establish causation. A reported expenditure is not a vote, a client relationship is not proof that the client wrote a bill, and a broad subject category is not proof of work on one specific measure. Any connection to legislation or rulemaking should be supported by an independent public record."
        ]
      },
      {
        "heading": "How KeepTXRed will use the lobbying data",
        "paragraphs": [
          "The long-term KTR product should make the official data easier to navigate without replacing it. A lobbying profile can show the registrant, disclosed clients, compensation code, subject categories, filing period and direct official links. When a public document connects a client or registrant to a hearing, bill or rule, that connection can be added as a separately sourced fact.",
          "This creates original utility without turning disclosure data into insinuation. Readers should be able to distinguish what the filer reported, what another government record independently shows and what KTR calculated. Calculated fields should state the formula and preserve the source information needed to check the work."
        ],
        "bullets": [
          "Preserve filer names and identifiers exactly as reported.",
          "Label compensation as a range when the source uses a range.",
          "Keep lobbying and campaign-finance records as separate datasets.",
          "Link legislative claims to Texas Legislature Online rather than inferring them from lobbying records.",
          "Display a verification date because current-year filings can change."
        ]
      }
    ],
    "faq": [
      {
        "q": "Does a Texas lobbying registration show exactly how much a client paid?",
        "a": "Not necessarily. Disclosures can use compensation or reimbursement codes representing ranges, so summaries should preserve the disclosed range unless an exact amount is independently documented."
      },
      {
        "q": "Can the database prove a lobbyist changed a legislator’s vote?",
        "a": "No. Registration, activity and expenditure records document required disclosures; they do not by themselves establish causation or the reason for a vote."
      },
      {
        "q": "How current are the 2026 lobby lists?",
        "a": "The Texas Ethics Commission states that current-year registration and activity lists are updated daily. A KTR page should still show its own verification date."
      },
      {
        "q": "How should I research a company or group?",
        "a": "Start with the TEC client-sorted registration list, open the relevant filings, and independently verify any related bills, rules or government actions in the appropriate official system."
      }
    ],
    "sources": [
      {
        "name": "Texas Ethics Commission — Search Lobby Registrations and Activity Reports",
        "url": "https://www.ethics.state.tx.us/search/lobby/",
        "note": "Official search portal, downloadable data and reporting resources."
      },
      {
        "name": "Texas Ethics Commission — 2026 Lobby Registration Lists",
        "url": "https://webservices.ethics.state.tx.us/search/lobby/loblistsREG2026-2030.php",
        "note": "Current-year lists sorted by client, lobbyist and subject matter."
      },
      {
        "name": "Texas Government Code Chapter 305 — Registration of Lobbyists",
        "url": "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.305.htm",
        "note": "Statutory framework for Texas lobby registration and reporting."
      }
    ],
    "related": [
      {
        "label": "Texas bill lookup",
        "href": "/bills"
      },
      {
        "label": "Texas Legislature guide",
        "href": "/texas-legislature"
      },
      {
        "label": "Texas government agencies",
        "href": "/texas-government/agencies"
      }
    ],
    "methodology": "This guide separates filer-reported lobbying disclosures from legislative or agency actions. KeepTXRed uses Texas Ethics Commission records for registration, client, compensation-code, activity and expenditure claims and uses the official legislative or agency system separately for a bill, rule or government action."
  },
  "texas-campaign-finance-2026": {
    "slug": "texas-campaign-finance-2026",
    "title": "Texas Campaign Finance 2026: How to Find Who Is Funding Candidates and PACs",
    "dek": "A practical guide to the Texas Ethics Commission campaign-finance database, including filer IDs, contributions, expenditures, cash on hand, duplicate disclosures, state-versus-local filing limits and reproducible research methods.",
    "eyebrow": "Texas public-record research guide",
    "updated": "2026-09-28",
    "keyTakeaways": [
      "The Texas Ethics Commission publishes campaign-finance reports filed with the commission, searchable reports and downloadable data.",
      "The TEC database is not a complete repository for every local Texas campaign filer; local reports may be held by the applicable local filing authority.",
      "Advanced transaction searches are most reliable when the correct filer ID and report context are preserved.",
      "Contribution totals, expenditure totals and cash on hand answer different questions and should not be used interchangeably.",
      "KTR should publish the filing period, filer ID, metric and verification date whenever it summarizes campaign-finance data."
    ],
    "snapshot": [
      {
        "label": "Detailed electronic data",
        "value": "Since July 2000",
        "note": "TEC says detailed electronically filed campaign-finance data is available from July 2000."
      },
      {
        "label": "2026 reporting",
        "value": "Active",
        "note": "TEC publishes 2026 report totals and current filer records."
      },
      {
        "label": "Local filer coverage",
        "value": "Not complete",
        "note": "TEC directs users to local filing authorities for locally filed reports."
      }
    ],
    "sections": [
      {
        "heading": "Start with the filer, not a headline",
        "paragraphs": [
          "The Texas Ethics Commission provides searches by filer name, filer ID, treasurer name, report number and committee acronym. Once the correct filer is identified, the filer ID is the stable key for detailed transaction research and helps avoid mixing people or committees with similar names.",
          "KTR should capture the filer ID with every structured profile and display the reporting period used for a calculation. That makes a result reproducible instead of asking a reader to trust an unexplained fundraising or spending number."
        ]
      },
      {
        "heading": "Contributions, expenditures and cash on hand are different metrics",
        "paragraphs": [
          "A contribution total describes reported receipts in a reporting context. An expenditure total describes reported spending. Cash on hand is a balance at a point in time. A campaign can raise substantial money and spend substantial money at the same time, so fundraising does not tell a reader what remains available.",
          "TEC provides separate tools for contribution and expenditure totals and for contributions maintained. KTR headlines and charts should preserve those distinctions. Words such as raised, spent and cash on hand should only be used when the underlying field supports that description."
        ]
      },
      {
        "heading": "Why the same transaction can appear more than once",
        "paragraphs": [
          "TEC warns that some contributions or expenditures disclosed in special pre-election or special-session reports must also appear in later reports. That can produce duplicate-looking transactions. Advanced search controls therefore matter when data is being summed.",
          "A naive total of every returned row can overstate activity. Before KTR publishes a derived total, the query method, date range, filer ID and duplicate-report treatment should be documented and compared with official report totals when possible."
        ]
      },
      {
        "heading": "State database coverage stops where local filing begins",
        "paragraphs": [
          "TEC states that only reports filed with the commission are available on its website. Local candidates or committees can file with a local authority instead. A missing TEC result therefore does not prove that no campaign-finance filing exists.",
          "For local races, the research path can lead to a city, county, school district or other filing authority. KTR should say that no report was found in TEC when that is the fact, rather than saying no report exists unless the applicable local authority has also been checked."
        ]
      },
      {
        "heading": "A reproducible KTR campaign-finance record",
        "paragraphs": [
          "A useful KTR record should show filer name, filer ID, office or committee type, report period, contributions, expenditures and cash-on-hand data when available, with direct links to official reports. Transaction-level analysis should preserve the date range and search settings used.",
          "Derived analysis should remain separate from the filing record. KTR can calculate trends or geographic shares, but it should describe what rows were included and excluded. That produces unique value while letting readers distinguish official disclosures from KTR calculations."
        ],
        "bullets": [
          "Record filer ID and reporting period with every calculation.",
          "Do not treat a missing TEC record as proof that no local filing exists.",
          "Check duplicate-report behavior before summing transactions.",
          "Keep contributions, expenditures and cash-on-hand labels distinct.",
          "Link the underlying report whenever a number appears."
        ]
      }
    ],
    "faq": [
      {
        "q": "Does TEC contain every Texas campaign-finance report?",
        "a": "No. TEC says its site contains reports filed with the commission. Locally filed reports must be obtained from the applicable local filing authority."
      },
      {
        "q": "Why can a contribution appear more than once?",
        "a": "Certain transactions can be disclosed in special reports and again in later reports. Search settings and report type should be checked before totals are calculated."
      },
      {
        "q": "Is cash on hand the same as total contributions?",
        "a": "No. Contributions measure reported receipts in a reporting context, while cash on hand is a balance reported for a point in time."
      },
      {
        "q": "What should KTR show beside campaign-finance numbers?",
        "a": "At minimum: filer name, filer ID, reporting period, the metric, a verification date and a link to the official filing or search resource."
      }
    ],
    "sources": [
      {
        "name": "Texas Ethics Commission — Search Campaign Finance Reports",
        "url": "https://www.ethics.state.tx.us/search/cf/index.php",
        "note": "Official campaign-finance search, databases, filer lists and totals."
      },
      {
        "name": "Texas Ethics Commission — Campaign Finance Search Help",
        "url": "https://www.ethics.state.tx.us/search/cf/search-help.php",
        "note": "Official guidance on availability, searches and downloads."
      },
      {
        "name": "Texas Ethics Commission — 2026 Contribution and Expenditure Totals",
        "url": "https://ethics.state.tx.us/search/cf/cANDelists2026-2022.php",
        "note": "Official 2026 report-total resources."
      }
    ],
    "related": [
      {
        "label": "2026 Texas Election Central",
        "href": "/elections/2026"
      },
      {
        "label": "Texas candidates",
        "href": "/elections/candidates"
      },
      {
        "label": "Texas races",
        "href": "/elections/races"
      }
    ],
    "methodology": "KeepTXRed treats TEC filings as the primary source for state-level campaign-finance claims and preserves filer IDs, report periods and metric definitions. Derived totals document query settings and duplicate handling. Local filing coverage is checked separately."
  },
  "how-to-read-a-texas-bill": {
    "slug": "how-to-read-a-texas-bill",
    "title": "How to Read a Texas Bill: Bill Text, Amendments, Fiscal Notes, Committee Reports and Votes",
    "dek": "A document-by-document guide to Texas Legislature Online so readers can tell what a bill says now, what changed, what it may cost, where it is in the process and what lawmakers actually voted on.",
    "eyebrow": "Texas legislative research guide",
    "updated": "2026-09-28",
    "keyTakeaways": [
      "A Texas bill number is only unambiguous when the legislative session is known because numbers are reused across sessions.",
      "The latest text may differ materially from the filed version because substitutes and amendments can change a bill.",
      "Bill analyses and committee materials provide context but are not substitutes for the operative bill text.",
      "Fiscal notes estimate financial effects and should be read alongside the bill version and date to which they apply.",
      "Action history and recorded votes answer process questions; neither replaces the text of the measure being considered."
    ],
    "sections": [
      {
        "heading": "Step one: identify the exact bill and session",
        "paragraphs": [
          "Texas reuses bill numbers from one Legislature or session to another. HB 1 in one session is not the same measure as HB 1 in another. A reliable citation needs the Legislature and, when applicable, the called-session identifier in addition to the bill type and number.",
          "Texas Legislature Online provides Bill Lookup when the number is known and additional search tools when it is not. KTR bill pages preserve session-aware identifiers; readers should confirm that session before comparing sponsors, actions, documents or outcomes."
        ]
      },
      {
        "heading": "Step two: read the text version, not just the caption",
        "paragraphs": [
          "The caption is useful for discovery, but the legal substance is in the bill text. Committee substitutes can replace significant portions of a filed bill and floor amendments can change language later in the process.",
          "When KTR summarizes a bill, the summary should identify the version reviewed. A statement that was accurate for the introduced version may no longer be accurate after substitution or amendment, so fast-moving bills should be compared version to version."
        ]
      },
      {
        "heading": "Step three: use analyses and committee documents as context",
        "paragraphs": [
          "Bill analyses can explain background, existing law and intended operation. Committee reports can package a reported version with related documents. They are valuable because statutory language can be difficult to interpret without context.",
          "They remain explanatory documents. If an analysis and the operative text appear inconsistent, the text is the language being considered. KTR should use analyses to clarify structure, not allow them to replace the bill text."
        ]
      },
      {
        "heading": "Step four: pair fiscal notes with the right version",
        "paragraphs": [
          "Texas Legislature Online publishes fiscal notes with bill documents when available, while the Legislative Budget Board explains the fiscal-note process. Notes can estimate costs, savings, revenue gains or revenue losses and can discuss effects on state agencies or local governments.",
          "A fiscal note belongs to a point in the legislative process. If the bill changes, a later note may become more relevant. KTR should display the note date and version context rather than extracting a number without explaining which version produced it."
        ]
      },
      {
        "heading": "Step five: separate action history from votes",
        "paragraphs": [
          "The action history provides the procedural timeline: filing, referrals, hearings, committee action, chamber passage, concurrence, enrollment and executive action when applicable. It is the best place to answer where a bill stands.",
          "Votes answer a narrower question: how members voted at a particular stage when a recorded vote is available. A bill can have committee votes, amendment votes and final-passage votes. KTR should identify chamber, date and stage for every cited roll call."
        ],
        "bullets": [
          "Capture Legislature, session, bill type and bill number.",
          "State the bill-text version used for a substantive summary.",
          "Use analyses for explanation, not as a substitute for the text.",
          "Date fiscal-note claims and check for later notes.",
          "Identify the stage and chamber for every vote."
        ]
      }
    ],
    "faq": [
      {
        "q": "Is the bill caption enough to know what a Texas bill does?",
        "a": "No. The caption is a short description. The operative language is in the bill text, and substitutes or amendments can change it."
      },
      {
        "q": "Why does the legislative session matter?",
        "a": "Texas reuses bill numbers, so the Legislature and session are needed to identify the correct measure and documents."
      },
      {
        "q": "What is the enrolled version?",
        "a": "It is the version prepared after legislative passage for the final stage of the process. Readers should still check the official history for executive action and effective-date information."
      },
      {
        "q": "Are bill analyses legally controlling?",
        "a": "They are explanatory resources. The bill or enacted statutory text is the primary legal language."
      }
    ],
    "sources": [
      {
        "name": "Texas Legislature Online — Bill Lookup",
        "url": "https://capitol.texas.gov/billlookup/billnumber.aspx",
        "note": "Official entry point for bill status, history, text and documents."
      },
      {
        "name": "Legislative Budget Board — Fiscal Notes",
        "url": "https://lbb.texas.gov/Fiscal_Notes.aspx",
        "note": "Official explanation of fiscal-note purpose and resources."
      },
      {
        "name": "Texas Legislative Reference Library — Bill Statistics",
        "url": "https://www.lrl.texas.gov/sessions/billStatistics.cfm",
        "note": "Official session-level legislative reference."
      }
    ],
    "related": [
      {
        "label": "Texas bill lookup",
        "href": "/bills"
      },
      {
        "label": "Texas Legislature guide",
        "href": "/texas-legislature"
      },
      {
        "label": "Texas laws",
        "href": "/laws"
      }
    ],
    "methodology": "This guide uses Texas Legislature Online as the primary bill-document system and the Legislative Budget Board for fiscal-note methodology. KTR summaries should identify the session, document version, action date and vote stage needed to reproduce each claim."
  },
  "texas-bill-fiscal-notes": {
    "slug": "texas-bill-fiscal-notes",
    "title": "What Does a Texas Bill Cost? How to Read Fiscal Notes and Legislative Budget Estimates",
    "dek": "A guide to Legislative Budget Board fiscal notes, five-year estimates, state and local impacts, assumptions, indeterminate effects and the difference between a projected fiscal effect and an actual future cost.",
    "eyebrow": "Texas fiscal research guide",
    "updated": "2026-09-28",
    "keyTakeaways": [
      "The Legislative Budget Board defines a fiscal note as a written estimate of costs, savings, revenue gains or revenue losses that may result from a bill or joint resolution.",
      "Fiscal notes are estimates built on assumptions; they are not invoices and do not guarantee actual future spending or revenue.",
      "Texas fiscal-note methodology generally projects effects across five years beginning with the effective date and notes whether effects continue.",
      "Local-government impacts can appear separately and may matter even when the direct state effect is small.",
      "When a bill changes, the relevant fiscal analysis can change, so document date and bill version matter."
    ],
    "sections": [
      {
        "heading": "What a fiscal note is designed to answer",
        "paragraphs": [
          "The Legislative Budget Board says state law requires a fiscal-note system for legislation with potential budget effects. In practical terms, a fiscal note estimates what implementation could do to state costs, savings and revenue and, in some cases, what local governments may experience.",
          "That makes the note one of the most useful documents on a bill page, but it remains an estimate based on the bill language and information available at that point in the process."
        ]
      },
      {
        "heading": "Read the assumptions before repeating the headline number",
        "paragraphs": [
          "An estimate can depend on staffing, caseloads, participation, fee collections, federal matching funds, technology costs, implementation dates and agency interpretations. Those assumptions explain how the result was produced.",
          "KTR should preserve material assumptions beside a fiscal figure. If an agency assumes a specific number of employees, cases or transactions, that belongs with the estimate because it is part of the model."
        ]
      },
      {
        "heading": "Five-year projections show timing, not certainty",
        "paragraphs": [
          "LBB guidance describes a five-year projection beginning on the effective date and asks whether the impact continues afterward. A table can therefore reveal a one-time implementation cost, recurring annual cost, delayed revenue effect or a pattern that changes over time.",
          "The five columns should not automatically be called a lifetime cost. If a program continues, the later annual amount can be more informative about ongoing scale than a simple five-year sum."
        ]
      },
      {
        "heading": "State impact and local impact are different questions",
        "paragraphs": [
          "Some bills create duties for counties, cities, school districts or other local governments even when the state impact is limited. Fiscal materials can describe those local effects separately, and a measure can shift a cost from one level of government to another.",
          "KTR should label state and local estimates separately. When a local effect is indeterminate, that status should be preserved rather than converted into a number that the official analysis did not provide."
        ]
      },
      {
        "heading": "How to compare fiscal notes across versions",
        "paragraphs": [
          "A substitute or amendment can change eligibility, dates, enforcement duties, fees or program scope. Any of those changes can alter the estimate. A useful comparison asks what changed in the bill, what changed in the assumptions and what changed in the fiscal effect.",
          "KTR can add original value with a version history showing document date, state impact, local impact and major assumptions, each linked to the official note. That is more useful than repeating one number after a bill has moved on."
        ],
        "bullets": [
          "Show the fiscal-note date and bill version.",
          "Separate one-time from recurring costs.",
          "Keep state and local impacts separate.",
          "Carry material assumptions with the estimate.",
          "Do not invent a number for an indeterminate effect."
        ]
      }
    ],
    "faq": [
      {
        "q": "Does a fiscal note say exactly what a bill will cost?",
        "a": "No. It is an estimate based on assumptions and information available during the legislative process. Actual future costs or revenues can differ."
      },
      {
        "q": "Why can a later fiscal note be different?",
        "a": "The bill, assumptions or agency information may have changed."
      },
      {
        "q": "What does indeterminate fiscal impact mean?",
        "a": "It means analysts could not produce a reliable numeric estimate from available information or because the result depends on future choices or conditions."
      },
      {
        "q": "Where do I find a fiscal note?",
        "a": "Texas Legislature Online publishes bill documents, including fiscal notes when available, and the Legislative Budget Board explains the system and search methods."
      }
    ],
    "sources": [
      {
        "name": "Legislative Budget Board — Fiscal Notes",
        "url": "https://lbb.texas.gov/Fiscal_Notes.aspx",
        "note": "Official definition, statutory basis and resources."
      },
      {
        "name": "Texas Legislature Online — Bill Lookup",
        "url": "https://capitol.texas.gov/billlookup/billnumber.aspx",
        "note": "Official bill-document system."
      },
      {
        "name": "Texas Government Code Chapter 314 — Fiscal Notes and Cost Projections",
        "url": "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.314.htm",
        "note": "Statutory framework for fiscal notes and projections."
      }
    ],
    "related": [
      {
        "label": "Texas bill lookup",
        "href": "/bills"
      },
      {
        "label": "Texas Legislature guide",
        "href": "/texas-legislature"
      },
      {
        "label": "Texas laws",
        "href": "/laws"
      }
    ],
    "methodology": "KeepTXRed reports fiscal-note figures as estimates, preserves the note date and bill version, separates state from local effects and carries forward material assumptions. Derived comparisons link each source note and do not convert indeterminate effects into invented numbers."
  },
  "texas-state-budget-2026-27": {
    "slug": "texas-state-budget-2026-27",
    "title": "Texas State Budget 2026–27: Where the Money Comes From and Where It Goes",
    "dek": "A primary-source guide to Texas fiscal 2026–27 revenue and appropriations, separating Comptroller revenue certification from Legislative Budget Board appropriations and explaining why General Revenue and All Funds are different measures.",
    "eyebrow": "Texas budget data guide",
    "updated": "2026-09-28",
    "keyTakeaways": [
      "Texas budgets on a two-year biennium; the current General Appropriations Act covers fiscal years 2026 and 2027.",
      "The Comptroller’s Certification Revenue Estimate addresses General Revenue-related resources, while the appropriations act shows authorized spending by article and method of finance.",
      "The 2026–27 CRE reports $203.63 billion in General Revenue-related funds available, supporting $198.97 billion in general-purpose spending and a projected $4.66 billion ending balance.",
      "The final General Appropriations Act recapitulation shows about $176.44 billion in All Funds for fiscal 2026 and $162.01 billion for fiscal 2027 after listed adjustments.",
      "Every KTR budget chart should identify fiscal period, fund category and source document."
    ],
    "snapshot": [
      {
        "label": "GR-related available",
        "value": "$203.63B",
        "note": "2026–27 Certification Revenue Estimate."
      },
      {
        "label": "General-purpose spending",
        "value": "$198.97B",
        "note": "Supported by the certification estimate."
      },
      {
        "label": "Projected ending balance",
        "value": "$4.66B",
        "note": "General Revenue-related certification balance."
      },
      {
        "label": "FY 2026 All Funds",
        "value": "$176.44B",
        "note": "Final GAA grand total after listed adjustments."
      },
      {
        "label": "FY 2027 All Funds",
        "value": "$162.01B",
        "note": "Final GAA grand total after listed adjustments."
      }
    ],
    "sections": [
      {
        "heading": "Texas has more than one correct budget number",
        "paragraphs": [
          "Official Texas documents use different fund categories and different stages of the budget process. The Comptroller’s revenue estimate answers how much General Revenue-related money is expected to be available. The General Appropriations Act answers what the Legislature appropriated by article, agency and method of finance.",
          "Those figures should not be forced into one total. All Funds can include General Revenue, General Revenue-Dedicated accounts, federal funds and other funds. An All Funds appropriation is therefore not the same measure as General Revenue-related resources available for general-purpose spending."
        ]
      },
      {
        "heading": "The current revenue certification",
        "paragraphs": [
          "After the 89th Legislature and two called sessions, the Comptroller’s 2026–27 Certification Revenue Estimate reported $203.63 billion in General Revenue-related funds available. It identified $198.97 billion supporting general-purpose spending and a projected $4.66 billion ending General Revenue-related balance.",
          "The earlier Biennial Revenue Estimate remains useful for showing the revenue picture lawmakers had before the regular session and for comparing how estimates changed. The certification estimate is the better source for the post-session certified resource picture."
        ]
      },
      {
        "heading": "Where appropriations go",
        "paragraphs": [
          "The Legislative Budget Board organizes the General Appropriations Act into articles covering General Government, Health and Human Services, Agencies of Education, the Judiciary, Public Safety and Criminal Justice, Natural Resources, Business and Economic Development, Regulatory agencies and the Legislature.",
          "The final recapitulation shows approximately $176.44 billion in All Funds for fiscal 2026 and $162.01 billion for fiscal 2027 after listed adjustments. Those are annual All Funds appropriation totals and should not be described as the state’s General Revenue balance."
        ]
      },
      {
        "heading": "Where General Revenue-related money comes from",
        "paragraphs": [
          "The Comptroller’s revenue materials show the state sales tax as the largest projected source of General Revenue-related tax revenue. Other sources include motor-vehicle sales and rental taxes, oil production tax, franchise tax, insurance taxes, natural-gas production tax, other state taxes and non-tax revenue.",
          "Revenue composition matters because different sources react differently to economic conditions. Sales taxes move with taxable spending, while severance taxes are sensitive to energy production and prices. Revenue estimates are therefore forecasts built on economic assumptions as well as accounting rules."
        ]
      },
      {
        "heading": "How KTR should present budget data",
        "paragraphs": [
          "Every visualization should label fiscal period, method-of-finance category and source. A generic Texas budget label can mislead if it mixes All Funds appropriations with General Revenue-related revenue or combines an annual number with a biennial total.",
          "KTR can add unique value by linking high-level appropriations to the agencies, programs and bills beneath them. A reader should be able to move from an article total to an agency record and then to the official budget document supporting the number."
        ],
        "bullets": [
          "Never compare All Funds and General Revenue without labeling both.",
          "Distinguish biennial totals from fiscal-year totals.",
          "Mark estimates and projections separately from actual collections.",
          "Preserve veto and supplemental-appropriation context.",
          "Link every chart to Comptroller or LBB source material."
        ]
      }
    ],
    "faq": [
      {
        "q": "Why do official Texas budget totals look different?",
        "a": "They can measure different things: revenue available, General Revenue, dedicated funds, federal funds, other funds, All Funds, annual appropriations or biennial totals."
      },
      {
        "q": "What is the difference between the BRE and CRE?",
        "a": "The Biennial Revenue Estimate is issued before the regular session. The Certification Revenue Estimate reflects legislative action and updated information used for certification after the session."
      },
      {
        "q": "What years does the current budget cover?",
        "a": "The current General Appropriations Act covers fiscal 2026 and 2027, from September 1, 2025 through August 31, 2027."
      },
      {
        "q": "Is the sales tax the largest General Revenue-related tax source?",
        "a": "Yes. The Comptroller’s 2026–27 revenue materials show the sales tax as the largest projected share of General Revenue-related tax revenue."
      }
    ],
    "sources": [
      {
        "name": "Texas Comptroller — 2026–27 Certification Revenue Estimate",
        "url": "https://comptroller.texas.gov/transparency/reports/certification-revenue-estimate/2026-27/",
        "note": "Post-session certification of General Revenue-related resources."
      },
      {
        "name": "Texas Comptroller — 2026–27 Biennial Revenue Estimate",
        "url": "https://comptroller.texas.gov/transparency/reports/biennial-revenue-estimate/2026-27/",
        "note": "Pre-session revenue forecast and source data."
      },
      {
        "name": "Legislative Budget Board — 2026–27 State Budget",
        "url": "https://lbb.texas.gov/Legislative_Session.aspx",
        "note": "Final General Appropriations Act and summaries."
      },
      {
        "name": "Legislative Reference Library — General Appropriations Acts",
        "url": "https://lrl.texas.gov/legis/approbills.cfm",
        "note": "Session-by-session appropriations and veto history."
      }
    ],
    "related": [
      {
        "label": "Texas government",
        "href": "/texas-government"
      },
      {
        "label": "Texas Legislature",
        "href": "/texas-legislature"
      },
      {
        "label": "Texas bills",
        "href": "/bills"
      }
    ],
    "methodology": "KeepTXRed keeps revenue certification and appropriations separate. Figures are labeled by fiscal year, fund category and document stage. The snapshot uses the Comptroller’s 2026–27 Certification Revenue Estimate for General Revenue-related availability and the LBB final General Appropriations Act for All Funds appropriations."
  },
  "texas-rulemaking": {
    "slug": "texas-rulemaking",
    "title": "How Texas State Agencies Make Rules: The Texas Register, Public Comment and the Administrative Code",
    "dek": "A practical guide to Texas agency rulemaking: proposed rules, emergency rules, public comment, adopted rules, effective dates, rule review, the Texas Register and the Texas Administrative Code.",
    "eyebrow": "Texas rulemaking research guide",
    "updated": "2026-09-28",
    "keyTakeaways": [
      "The Texas Register is the state’s weekly journal of agency rulemaking and publishes proposed, adopted, withdrawn and emergency rule actions plus other official notices.",
      "After adoption, rules are codified in the Texas Administrative Code, the organized code of state agency rules.",
      "A proposal is not the same thing as an adopted rule, and an adopted rule may have a future effective date.",
      "Public-comment instructions and deadlines are found in the specific notice and can vary by proceeding.",
      "KTR can turn Register notices into a structured tracker without treating every proposal as though it were already law."
    ],
    "sections": [
      {
        "heading": "The Texas Register is the change log",
        "paragraphs": [
          "The Secretary of State describes the Texas Register as the weekly journal of state agency rulemaking. It publishes proposed, adopted, withdrawn and emergency rule actions, rule reviews, governor appointments, attorney general opinions and other notices. For readers asking what an agency is changing now, the Register is usually the first official source.",
          "The Register is chronological, so a reader must follow a proposal forward to learn whether it was adopted, changed, withdrawn or otherwise failed to take effect. An old proposal should not be presented as current law merely because it appears in the archive."
        ]
      },
      {
        "heading": "The Texas Administrative Code is the organized rulebook",
        "paragraphs": [
          "After rulemaking is completed, adopted rules are codified in the Texas Administrative Code. The TAC organizes agency rules by title, part, chapter, subchapter and section. When the question is what rule is currently codified, the TAC is generally more useful than an old proposal notice.",
          "The systems answer different questions: the Register shows rulemaking history and notice, while the TAC presents codified agency rules. KTR should link both for newly adopted rules so readers can see the process and the resulting text."
        ]
      },
      {
        "heading": "Proposed does not mean effective",
        "paragraphs": [
          "A proposed rule is a proposal published for the rulemaking process. It may invite comments, identify a deadline, list agency contact information and describe statutory authority. The final action can be adoption as proposed, adoption with changes, withdrawal or another disposition.",
          "KTR should use proposed, adopted and effective as separate status fields. A proposal should not be described as a new rule already governing Texans unless the official record shows adoption and the applicable effective date."
        ]
      },
      {
        "heading": "Public comment is tied to the specific notice",
        "paragraphs": [
          "Texas Register notices typically explain how and when comments may be submitted, and some proceedings include hearings. The controlling instructions are in the specific notice because methods, contacts and deadlines can vary.",
          "A useful KTR tracker can extract agency, project or docket identifier, affected TAC sections, publication date, comment deadline, hearing information and official submission method. The source notice should remain one click away."
        ]
      },
      {
        "heading": "The case for a Texas Rulemaking Tracker",
        "paragraphs": [
          "KTR already consumes Texas Register material. The higher-value product is a structured tracker that follows important actions from proposal through final disposition. One record can hold the agency, TAC citation, proposal date, comment deadline, adoption date, effective date and official source notices.",
          "That structure also reduces false urgency. A Register issue contains actions at many stages. A tracker can filter open comment periods, newly adopted rules and emergency rules while preserving withdrawn or completed actions in the history."
        ],
        "bullets": [
          "Track proposal, adoption and effective date separately.",
          "Preserve agency docket or rule-project identifiers.",
          "Extract comment instructions directly from the notice.",
          "Link the final TAC section after codification.",
          "Keep withdrawn and superseded actions in the history."
        ]
      }
    ],
    "faq": [
      {
        "q": "What is the Texas Register?",
        "a": "It is the weekly state publication used for agency rulemaking notices and other official notices, including proposed, adopted, withdrawn and emergency rules."
      },
      {
        "q": "What is the Texas Administrative Code?",
        "a": "It is the organized code of rules adopted by Texas state agencies."
      },
      {
        "q": "Does a proposed rule already have legal effect?",
        "a": "Not merely because it was proposed. The official record must be followed through adoption and the applicable effective date."
      },
      {
        "q": "Where is the public-comment deadline?",
        "a": "Use the specific proposed-rule notice in the Texas Register. It normally identifies the deadline and submission method for that proceeding."
      }
    ],
    "sources": [
      {
        "name": "Texas Secretary of State — State Rules and Open Meetings",
        "url": "https://www.sos.state.tx.us/texreg/index.shtml",
        "note": "Official Texas Register hub, current issues, archives and rulemaking resources."
      },
      {
        "name": "Texas Secretary of State — Texas Register Liaison Guide",
        "url": "https://www.sos.state.tx.us/texreg/guides/complete-liaison-guide.pdf",
        "note": "Official operational guidance for Texas Register and TAC filings and searches."
      },
      {
        "name": "Texas Government Code Chapter 2001 — Administrative Procedure",
        "url": "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.2001.htm",
        "note": "Administrative Procedure Act framework for rulemaking."
      }
    ],
    "related": [
      {
        "label": "Texas government agencies",
        "href": "/texas-government/agencies"
      },
      {
        "label": "Texas laws",
        "href": "/laws"
      },
      {
        "label": "Texas Legislature",
        "href": "/texas-legislature"
      }
    ],
    "methodology": "KeepTXRed distinguishes proposed, adopted and effective rule status and uses the Texas Register for the chronological rulemaking record, the Texas Administrative Code for codified rules and the underlying agency notice for comment instructions and deadlines."
  },
  "texas-precinct-chairs-county-parties": {
    "slug": "texas-precinct-chairs-county-parties",
    "title": "Texas Precinct Chairs and County Parties Explained: What They Do and How They’re Chosen",
    "dek": "A neutral guide to Texas county and precinct party offices, county executive committees, primary-election duties, conventions, vacancies, eligibility and the difference between a party office and a government office.",
    "eyebrow": "Texas election administration guide",
    "updated": "2026-09-28",
    "keyTakeaways": [
      "A precinct chair is a political-party office tied to a county election precinct, not a general county-government office.",
      "County executive committees are chaired by the county chair and include the party’s precinct chairs in that county.",
      "Secretary of State guidance describes county executive committees as performing important primary-election and party-convention duties.",
      "Eligibility and filing rules for party offices are distinct from the general rules for public office.",
      "Party administration and county election administration interact during primaries but are not the same institution."
    ],
    "sections": [
      {
        "heading": "What a precinct chair is",
        "paragraphs": [
          "The Texas Secretary of State describes precinct chairs as political-party representatives for county election precincts. They are elected in the party primary and serve with the county chair on that party’s county executive committee. Their role belongs to party organization rather than the general governmental structure of the county.",
          "That distinction matters because the title can sound like a county-government position. A precinct chair does not become a county commissioner, election administrator or justice of the peace by holding the party office."
        ]
      },
      {
        "heading": "How the county executive committee fits together",
        "paragraphs": [
          "The Secretary of State’s county-chair handbook says the county executive committee governs a political party’s activities at the county level. It is chaired by the county chair and consists of the party’s precinct chairs in that county.",
          "The committee has responsibilities connected to the party primary and other party functions, including duties described in the Election Code and SOS guidance. Operational questions should be checked against the current handbook and law because procedures can depend on the election and circumstance."
        ]
      },
      {
        "heading": "What precinct chairs do beyond appearing on the ballot",
        "paragraphs": [
          "SOS guidance says precinct chairs run their party’s precinct conventions in their county election precinct and can serve on other party executive committees when the relevant district includes their precinct. Executive committees can also have roles in certain nomination-vacancy processes.",
          "That is why precinct-chair races can matter inside party organization even though the office does not exercise general governmental authority. The office participates in local party governance and specified election-related functions."
        ]
      },
      {
        "heading": "Eligibility and filing are party-office rules",
        "paragraphs": [
          "The Secretary of State’s 2026 candidate guide says a candidate for county or precinct chair must be a qualified voter of the county, and a precinct-chair candidate must reside in the relevant election precinct. The guide also describes restrictions involving candidacy for or holding certain other elective offices.",
          "KTR should link current SOS guidance when discussing a filing deadline or eligibility rule rather than carrying a date or requirement forward from an older cycle."
        ]
      },
      {
        "heading": "Party organization and election administration are connected but separate",
        "paragraphs": [
          "Texas primaries involve both political parties and public election infrastructure. County parties can contract for election services or participate in joint-primary arrangements, while county election officials and other authorities perform duties under the Election Code.",
          "KTR can make the structure easier to understand by labeling the type of authority on every profile. A party role, county-government role and election-administration role should not be merged into one generic local-official label."
        ],
        "bullets": [
          "Label precinct chair and county chair as party offices.",
          "Show the county and precinct attached to the office.",
          "Use current SOS guidance for filing deadlines and eligibility.",
          "Separate party executive committees from county government bodies.",
          "Link primary-administration claims to the Election Code or SOS handbook."
        ]
      }
    ],
    "faq": [
      {
        "q": "Is a Texas precinct chair a county-government official?",
        "a": "No. It is a political-party office associated with a county election precinct and the party’s county executive committee."
      },
      {
        "q": "Who sits on a county executive committee?",
        "a": "SOS guidance describes the committee as the county chair plus the party’s precinct chairs in that county."
      },
      {
        "q": "How is a precinct chair chosen?",
        "a": "Precinct chairs are elected in the party primary, subject to the Election Code and current filing and eligibility requirements."
      },
      {
        "q": "Why do precinct chairs matter?",
        "a": "They participate in county party governance, precinct conventions and other statutory party functions, including certain nomination-vacancy processes."
      }
    ],
    "sources": [
      {
        "name": "Texas Secretary of State — County Chair Handbook",
        "url": "https://www.sos.state.tx.us/elections/forms/county-chair-handbook.pdf",
        "note": "Official handbook describing county chairs, precinct chairs and party executive committees."
      },
      {
        "name": "Texas Secretary of State — Running for County or Precinct Chair in 2026",
        "url": "https://www.sos.state.tx.us/elections/candidates/guide/2026/precinct-chair.shtml",
        "note": "Current 2026 eligibility, residency and filing guidance."
      },
      {
        "name": "Texas Secretary of State — Laws and Procedures for County Chairs",
        "url": "https://www.sos.state.tx.us/elections/laws/chair-pol-par-laws.shtml",
        "note": "Current election advisories and resources for county party chairs."
      }
    ],
    "related": [
      {
        "label": "2026 Texas Election Central",
        "href": "/elections/2026"
      },
      {
        "label": "County elections",
        "href": "/county-elections"
      },
      {
        "label": "Register to vote",
        "href": "/register-to-vote"
      }
    ],
    "methodology": "This guide uses current Texas Secretary of State election guidance and distinguishes political-party offices from county governmental offices and election-administration offices. Election-cycle dates or eligibility rules are dated and should be reverified each cycle."
  },
  "texas-governor-veto-power": {
    "slug": "texas-governor-veto-power",
    "title": "How the Texas Governor’s Veto Works: Deadlines, Line-Item Vetoes and Overrides",
    "dek": "A constitutional guide to Texas veto power: what happens when a bill reaches the governor, how reconsideration and overrides work, what changes after adjournment and why appropriation line-item vetoes are different.",
    "eyebrow": "Texas constitutional powers guide",
    "updated": "2026-09-28",
    "keyTakeaways": [
      "Article IV, Section 14 of the Texas Constitution establishes the governor’s approval and veto process for bills.",
      "A vetoed bill can be reconsidered under the constitutional process when the Legislature is available to act, with a two-thirds vote of members present required in each chamber.",
      "The Constitution contains timing rules for bills presented to the governor and separately addresses bills remaining with the governor after adjournment.",
      "The governor has line-item veto authority over items of appropriation, which is different from vetoing an ordinary policy bill.",
      "The Legislative Reference Library maintains session-by-session veto records and governor veto documents."
    ],
    "sections": [
      {
        "heading": "The constitutional starting point",
        "paragraphs": [
          "Article IV, Section 14 of the Texas Constitution provides that bills passed by both houses are presented to the governor. The governor can approve a bill by signing it or disapprove it through the constitutional veto process. If a bill is returned with objections while the Legislature can act, the originating chamber can reconsider it.",
          "The constitutional text, rather than political custom, controls the formal veto mechanics, making it the first source to check for a deadline, override or line-item question."
        ]
      },
      {
        "heading": "How an override works while the Legislature can reconsider",
        "paragraphs": [
          "For a returned veto, Article IV, Section 14 describes reconsideration first in the chamber where the bill originated. If two-thirds of the members present agree to pass it, the measure goes to the other chamber, where the same two-thirds-of-members-present threshold applies.",
          "The Constitution also requires yeas and nays to be entered in the journals for the override votes. A KTR veto record should therefore link the veto document and the recorded legislative action when an override is attempted."
        ]
      },
      {
        "heading": "Why adjournment changes the practical picture",
        "paragraphs": [
          "The Constitution contains timing rules for bills presented to the governor and specifically addresses bills remaining with the governor when the Legislature adjourns. Post-session deadlines matter because the Legislature may no longer be assembled to immediately reconsider a veto.",
          "The Legislative Reference Library tracks session deadlines and final veto outcomes. KTR should use the session-specific official calendar or LRL record rather than applying one generic date to every regular or called session."
        ]
      },
      {
        "heading": "Line-item vetoes apply to appropriations",
        "paragraphs": [
          "Article IV, Section 14 gives the governor authority to object to one or more items of appropriation in a bill containing several appropriation items. This differs from vetoing an ordinary policy bill in full because the constitutional power can target appropriation items while other portions remain.",
          "The Legislative Reference Library identifies line-item vetoes separately in its session records. KTR should preserve that distinction on bill and budget pages rather than labeling every executive objection simply as a veto."
        ]
      },
      {
        "heading": "How to verify a Texas veto",
        "paragraphs": [
          "A complete record includes the bill and session, final legislative action, governor’s veto document, date and any later reconsideration. The Legislative Reference Library maintains veto lists by session and governor-document collections that help assemble those pieces.",
          "KTR should not infer a veto from a political statement or from the absence of a signature. Official bill history and veto records should be checked because the constitutional process also allows circumstances in which a bill becomes law without the governor’s signature."
        ],
        "bullets": [
          "Use the Texas Constitution for the legal framework.",
          "Use official bill history for status and dates.",
          "Use LRL records for veto documents and session history.",
          "Label line-item vetoes separately from full bill vetoes.",
          "Do not assume every unsigned bill was vetoed."
        ]
      }
    ],
    "faq": [
      {
        "q": "Can the Texas Legislature override a governor’s veto?",
        "a": "Yes, when the constitutional reconsideration procedure is available. Article IV, Section 14 provides for passage by two-thirds of the members present in each chamber after reconsideration."
      },
      {
        "q": "Can the governor veto only part of a bill?",
        "a": "The Constitution provides line-item veto authority for items of appropriation in bills containing several appropriation items. That is distinct from a general power to rewrite ordinary policy bills line by line."
      },
      {
        "q": "Does every bill require the governor’s signature?",
        "a": "No. The constitutional process includes circumstances in which a bill can become law without the governor’s signature."
      },
      {
        "q": "Where can I find historical Texas vetoes?",
        "a": "The Texas Legislative Reference Library maintains veto lists by legislative session and links to governor veto documents."
      }
    ],
    "sources": [
      {
        "name": "Texas Constitution — Article IV, Section 14",
        "url": "https://statutes.capitol.texas.gov/Docs/SDocs/THETEXASCONSTITUTION.pdf",
        "note": "Constitutional approval, veto, reconsideration and appropriation-item veto framework."
      },
      {
        "name": "Texas Legislative Reference Library — Vetoes by Session",
        "url": "https://www.lrl.texas.gov/legis/Vetoes/lrlhome.cfm",
        "note": "Session-by-session veto counts and bill lists."
      },
      {
        "name": "Texas Legislative Reference Library — General Appropriations Acts",
        "url": "https://lrl.texas.gov/legis/approbills.cfm",
        "note": "Appropriations acts and line-item-veto history."
      }
    ],
    "related": [
      {
        "label": "Powers of the Texas Governor",
        "href": "/news/powers-of-texas-governor-explained"
      },
      {
        "label": "Texas bill lookup",
        "href": "/bills"
      },
      {
        "label": "Texas laws effective dates",
        "href": "/laws/effective-dates"
      }
    ],
    "methodology": "KeepTXRed uses Article IV, Section 14 as the controlling constitutional framework and the Legislative Reference Library plus official bill histories for session-specific veto records. Full vetoes and appropriation line-item vetoes are labeled separately."
  }
};

export const SEARCH_RECOVERY_AUTHORITY_SLUGS = Object.keys(SEARCH_RECOVERY_AUTHORITY_GUIDES);
