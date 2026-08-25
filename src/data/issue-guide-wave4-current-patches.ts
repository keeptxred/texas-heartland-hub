import type { IssueGuide } from "@/data/issue-guides";

type IssueSection = IssueGuide["sections"][number];
type IssueSource = IssueGuide["sources"][number];

type CurrentPatch = {
  sections: IssueSection[];
  sources: IssueSource[];
};

const CURRENT_WAVE4_PATCHES: Record<string, CurrentPatch> = {
  "texas-medical-transition-minors-law": {
    sections: [
      {
        heading: "The current statute is in Health and Safety Code Chapter 161, Subchapter Y",
        body: [
          "Texas's SB 14 restrictions remain in the Health and Safety Code, but the Legislature redesignated the provisions as Chapter 161, Subchapter Y in 2025. Current statutory citations therefore matter when comparing older court filings or commentary with the code now in force. The operative text defines a child as a person younger than 18 and sets out the prohibited purposes, treatments, and statutory exceptions.",
          "State v. Loe remains an important Texas Supreme Court decision on the law's operation: in June 2024 the court reversed and vacated the temporary injunction that had blocked SB 14. That procedural history should be described precisely. The opinion did not turn every medical or constitutional dispute involving minors into a categorical holding beyond the claims and posture before the court."
        ]
      }
    ],
    sources: [
      {
        label: "Texas Health and Safety Code Chapter 161 — current statutory text",
        url: "https://statutes.capitol.texas.gov/Docs/HS/pdf/HS.161.pdf",
        note: "Current code includes Subchapter Y and the 2025 redesignation of the SB 14 provisions."
      }
    ]
  },
  "texas-bail-criminal-justice": {
    sections: [
      {
        heading: "The 2025 Legislature and voters changed the bail framework again",
        body: [
          "Texas bail law materially changed after the older 2021 reform framework. Senate Bill 9 amended Chapter 17 in 2025, including new review procedures and provisions with effective dates extending into 2026. Article 17.028 still requires individualized consideration and ties release conditions to appearance and safety, while Article 17.029 now provides a statutory review path for specified felony bail decisions made by magistrates without trial jurisdiction.",
          "Voters also adopted Proposition 3, submitted as SJR 5, in November 2025. The constitutional amendment requires denial of bail in defined circumstances for people accused of specified serious felony offenses when the state's attorney makes the required showing after a hearing. Reporting in 2026 should therefore distinguish ordinary bail-setting rules from the constitutional categories in which denial of bail is authorized or required."
        ]
      }
    ],
    sources: [
      {
        label: "Texas Code of Criminal Procedure Chapter 17 — current bail law",
        url: "https://statutes.capitol.texas.gov/Docs/CR/htm/CR.17.htm",
        note: "Current Chapter 17 text includes 2025 SB 9 amendments and the Article 17.029 review process."
      },
      {
        label: "Governor certification of 2025 constitutional amendments",
        url: "https://www.sos.state.tx.us/texreg/archive/December52025/The%20Governor/The%20Governor.html",
        note: "Official certification states that voters adopted Proposition 3 (SJR 5) on bail."
      }
    ]
  },
  "texas-rural-healthcare": {
    sections: [
      {
        heading: "Chapter 511 continued to change through 2026 rulemaking",
        body: [
          "Texas HHSC continued updating the limited-services rural hospital rules after the model was created. Texas Register materials in 2026 show amendments within Chapter 511 and also state that HHSC's Regulatory Services Division is reviewing the LSRH rules as part of a broader regulatory-reform initiative. That makes the current rule text and effective date important whenever a compliance requirement is described.",
          "For KTR reporting, the durable distinction is between the licensing model and a particular year's rule amendment. The guide should explain what an LSRH is, while a story about staffing, anesthesia, protocols, discrimination requirements, or another operating rule should cite the version actually in effect when the event occurred."
        ]
      }
    ],
    sources: [
      {
        label: "Texas Register — June 19, 2026 HHSC rulemaking",
        url: "https://www.sos.state.tx.us/texreg/pdf/backview/0619/0619is.pdf",
        note: "Official 2026 Texas Register issue discussing Chapter 511 limited-services rural hospital rule amendments and ongoing review."
      }
    ]
  },
  "texas-local-preemption-home-rule": {
    sections: [
      {
        heading: "The statewide HB 2127 challenge changed posture in 2025 and 2026",
        body: [
          "The broad pre-enforcement challenge brought by Houston, San Antonio, and El Paso no longer stands where it did when a Travis County trial court declared HB 2127 unconstitutional. In July 2025 the Third Court of Appeals reversed that judgment and dismissed the cities' claims without prejudice for lack of subject-matter jurisdiction, holding that the pleaded injuries were not properly traceable to the State as defendant. The court therefore did not resolve the cities' constitutional theories on the merits in that appeal.",
          "In May 2026 the Third Court of Appeals denied en banc reconsideration, with a dissent arguing that the full court should have reconsidered the standing analysis. The practical reporting rule is important: HB 2127's preemption provisions and private enforcement mechanism should not be described as having been invalidated statewide by the old trial-court judgment, but neither should the jurisdictional appellate ruling be overstated as a merits decision approving every application of the Act."
        ]
      }
    ],
    sources: [
      {
        label: "Third Court of Appeals case docket — State v. City of Houston, No. 03-23-00531-CV",
        url: "https://search.txcourts.gov/Case.aspx?cn=03-23-00531-CV&coa=coa03",
        note: "Official appellate docket for the HB 2127 challenge, including the 2025 opinion and later rehearing activity."
      },
      {
        label: "HB 2127 — enrolled Texas Regulatory Consistency Act",
        url: "https://capitol.texas.gov/tlodocs/88R/billtext/html/HB02127F.HTM",
        note: "Enrolled statutory text establishing the Act's preemption framework and exceptions."
      }
    ]
  }
};

export function applyWave4CurrentPatch(guide: IssueGuide): IssueGuide {
  const patch = CURRENT_WAVE4_PATCHES[guide.slug];
  if (!patch) return guide;
  return {
    ...guide,
    sections: [...guide.sections, ...patch.sections],
    sources: [...guide.sources, ...patch.sources],
  };
}
