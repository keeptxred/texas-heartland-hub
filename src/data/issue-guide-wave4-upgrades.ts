import type { IssueGuide } from "@/data/issue-guides";

type IssueSection = IssueGuide["sections"][number];
type IssueSource = IssueGuide["sources"][number];

type Upgrade = {
  sections: IssueSection[];
  sources?: IssueSource[];
};

const WAVE4_UPGRADES: Record<string, Upgrade> = {
  "texas-medical-transition-minors-law": {
    sections: [
      {
        heading: "The statute applies to specified purposes and treatments, not every pediatric service",
        body: [
          "Texas SB 14 was written around specified procedures and prescription treatments provided for the purpose described in the statute. That purpose element matters. A medication can have more than one clinical use, and the legal analysis depends on why the treatment is being provided, the age and circumstances of the patient, and whether a statutory exception applies. Accurate coverage should therefore begin with the operative Health and Safety Code language rather than a broad label for all care involving hormones or surgery.",
          "KTR should identify the treatment at issue and the statutory subsection before describing it as prohibited, permitted or exempt. This avoids two opposite errors: implying that the law bars unrelated care merely because a drug or procedure is also used in gender-transition treatment, and implying that a prohibited purpose becomes lawful simply because the same treatment has another accepted use in different circumstances."
        ]
      },
      {
        heading: "Defined exceptions are part of the law and should appear in any categorical claim",
        body: [
          "The enacted statute contains exceptions for specified medical circumstances. Those exceptions are not side notes; they define the boundary of the prohibition. A responsible explainer should tell readers when a treatment for a minor's medical condition can fall outside the prohibited category and should avoid saying that Texas bans a particular medication or procedure in all pediatric contexts.",
          "The practical reporting method is to compare the documented medical purpose with the exception language and then identify which licensed professional or regulator has authority over compliance. Because individual medical facts can be private and complex, public reporting should not infer a patient's diagnosis from political statements or social-media posts. The legal rule can be explained without speculating about confidential health information."
        ]
      },
      {
        heading: "The Texas Supreme Court allowed SB 14 to operate after reviewing the constitutional challenge",
        body: [
          "In State v. Loe, No. 23-0697, the Supreme Court of Texas on June 28, 2024 reversed and vacated the trial court's temporary injunction. The case addressed a constitutional challenge to SB 14 and produced a majority opinion as well as separate concurring and dissenting opinions. The official opinion is a stronger source for the legal posture than partisan summaries from either supporters or opponents of the law.",
          "A court ruling should be described by what it actually decided. Reversing a temporary injunction is not the same thing as resolving every possible future claim involving every patient, provider or later statute. KTR should cite the opinion, identify the constitutional issue before the court and update this guide if a later controlling decision or legislative amendment changes the governing rule."
        ]
      },
      {
        heading: "Medical licensing and enforcement are separate from political debate",
        body: [
          "A statutory restriction can be enforced through the mechanisms the Legislature authorized, including professional-regulation consequences where applicable. The Texas Medical Board and other state entities operate under their own statutes and procedures. An allegation that a provider violated SB 14 therefore does not itself establish a final disciplinary finding, and a political statement by an official is not a substitute for an agency order or court judgment.",
          "KTR should distinguish an investigation, complaint, emergency action, final agency order and judicial appeal. That procedural precision protects due process while still allowing meaningful scrutiny of enforcement. Readers should know which agency is acting, what authority it cites, what conduct is alleged, whether a hearing has occurred and what review rights remain."
        ]
      },
      {
        heading: "Parental authority is important but does not answer the constitutional question by itself",
        body: [
          "Supporters and opponents of SB 14 frequently frame the dispute through parental rights. Parents ordinarily make many medical decisions for minor children, but states also regulate medical practice, professional licensing, age-based consent and particular procedures. The constitutional dispute is therefore not resolved simply by stating that parents have rights or that the state has a police power; courts examine the particular right asserted, the regulatory classification and the governing standard of review.",
          "An evergreen guide should present those competing legal principles without converting them into advocacy. Current articles can report arguments from families, physicians, lawmakers and state officials, but the permanent page should anchor those arguments in the enacted text and controlling opinions so readers can separate a policy preference from a statement about what Texas law presently requires."
        ]
      },
      {
        heading: "Keep medical evidence, statutory text and litigation in separate lanes",
        body: [
          "Policy disputes over treatment for minors include medical evidence, ethical judgments, parental concerns and constitutional claims. Those are related but not interchangeable. A medical association's clinical recommendation does not itself determine the meaning of a Texas statute, and a statute's validity does not by itself settle every scientific question about benefits, risks or long-term outcomes.",
          "KTR should label each kind of evidence accurately. Statutory claims should cite the code; litigation claims should cite opinions and orders; claims about medical outcomes should cite appropriately designed medical research or authoritative clinical evidence. Keeping those categories separate makes the guide more useful to readers regardless of their policy position and reduces the risk that contested scientific or legal claims are presented as broader than the source supports."
        ]
      }
    ],
    sources: [
      {
        label: "Supreme Court of Texas — State v. Loe, No. 23-0697",
        url: "https://www.txcourts.gov/media/1458813/230697.pdf",
        note: "Official June 28, 2024 opinion reversing and vacating the trial court's temporary injunction against SB 14."
      }
    ]
  },
  "texas-bail-criminal-justice": {
    sections: [
      {
        heading: "Texas bail law changed again in 2025, so current code matters",
        body: [
          "Texas has repeatedly amended Chapter 17 and related constitutional rules in recent sessions. The current Code of Criminal Procedure should therefore be checked before relying on a summary written after an earlier reform. Provisions effective in 2025 changed parts of the bail process, including procedures that appear in the current statutory text. A permanent guide should explain the framework while current articles identify the amendment that controls a particular case.",
          "KTR should date claims about eligibility, timing, personal bonds and detention authority. If a bill has passed but its effective date has not arrived, that distinction belongs in the story. If a statute was amended, quoting an older version without noting the change can misstate both a defendant's rights and a magistrate's duties."
        ]
      },
      {
        heading: "Individualized bail decisions require both appearance and safety analysis",
        body: [
          "Current Texas law requires individualized consideration rather than a single automatic amount for every defendant charged with a particular offense. Article 17.028 directs a magistrate to make a bail decision within the statutory framework and to consider conditions and the form of bond needed to reasonably ensure appearance and protect the community, law enforcement and the victim, subject to constitutional and statutory limits.",
          "That does not mean every defendant must receive release on the least expensive terms, nor does it authorize punitive bail untethered from the legal factors. KTR should distinguish the amount of bail from conditions of release and from lawful denial of bail. Those are separate tools with different legal requirements and review procedures."
        ]
      },
      {
        heading: "Risk assessment tools do not replace judicial responsibility",
        body: [
          "Information systems and risk assessments can help magistrates understand criminal history, pending charges and other relevant facts, but the legal decision remains governed by Texas law. A score should not be reported as though it automatically determines release or detention. The decision-maker must apply the statute and constitutional rules to the individual before the court.",
          "For accountability reporting, KTR should ask what information the magistrate had, whether required records were available, what findings or factors were stated, and whether later violations or failures reveal a problem with the law, implementation, data quality or an individual decision. One high-profile outcome can expose a weakness, but it does not by itself identify which part of the system failed."
        ]
      },
      {
        heading: "County jail populations connect bail policy to local budgets",
        body: [
          "Pretrial detention is administered largely through county jails, so state bail rules have direct local fiscal and operational consequences. Jail capacity, medical care, staffing, transportation and court delays can all affect the cost of holding defendants before trial. At the same time, release decisions can impose public-safety costs when conditions are violated or new offenses occur.",
          "KTR should use county jail and court data to evaluate both sides of that tradeoff. Average daily population, length of stay, case disposition time, failure-to-appear rates and new-offense data answer different questions. Reporting only the jail cost or only a serious reoffense gives an incomplete picture of how the pretrial system performs."
        ]
      },
      {
        heading: "A bail reform proposal should be classified by what it actually changes",
        body: [
          "The phrase 'bail reform' can describe very different policies: expanding or restricting personal bonds, changing constitutional detention authority, adding mandatory conditions, altering appellate review, improving information available to magistrates, changing hearing deadlines or creating new offense-based rules. Support or opposition cannot be meaningfully evaluated without identifying which mechanism is proposed.",
          "KTR should map each proposal to the Texas Constitution and Code of Criminal Procedure and then ask who is affected, what discretion remains and what data would measure success. That approach produces a more durable public-safety debate than labeling every change as either 'soft on crime' or 'wealth-based detention' before the actual statutory language is examined."
        ]
      }
    ]
  },
  "texas-rural-healthcare": {
    sections: [
      {
        heading: "Limited-services rural hospitals are a distinct licensed model",
        body: [
          "Texas Chapter 511 rules create a specific framework for limited services rural hospitals. The model is designed for qualifying rural facilities and is not identical to the licensing model for a full-service general hospital. Requirements concerning emergency capability, outpatient services, governance, staffing and other operations should therefore be evaluated under the rule that applies to the facility's actual license.",
          "That distinction matters when a community says it 'lost its hospital.' A facility may close, convert, reduce service lines or operate under a different rural model, and those outcomes have different consequences. KTR should identify the license category and services that remain instead of using a single closure label for every rural hospital transition."
        ]
      },
      {
        heading: "Federal rural-emergency-hospital policy and Texas licensing interact",
        body: [
          "The Texas limited-services framework is connected to the federal rural emergency hospital model for qualifying facilities. Federal reimbursement and participation requirements can therefore matter alongside state licensing. A hospital's decision to convert may depend on the combination of federal payment rules, local patient volume, staffing and the services the facility can sustainably provide.",
          "Coverage should separate the federal designation from the Texas license and identify which requirement is driving a change. A federal reimbursement adjustment is not the same event as a state license amendment, even when both affect the same hospital. That precision makes rural-health finance easier for local readers to follow."
        ]
      },
      {
        heading: "Emergency access depends on the regional transfer system",
        body: [
          "A rural facility may stabilize patients who need a level of specialty or inpatient care available only in a larger regional center. Ambulance availability, weather, road distance, helicopter access, bed availability and communication between facilities can therefore be as important as the services inside the local building. A hospital's capability should be evaluated as part of a regional emergency network.",
          "KTR should track transfer times and service availability where reliable data exists and should distinguish a scheduled specialty referral from an emergency transfer. Policy proposals that support a local facility but ignore EMS capacity or destination-hospital bottlenecks may address only one link in the access chain."
        ]
      },
      {
        heading: "Workforce shortages are a financing and training problem as well as a recruitment problem",
        body: [
          "Rural communities compete for physicians, nurses, therapists, pharmacists, technicians and emergency personnel. Salary matters, but so do training pipelines, call coverage, professional isolation, housing, spouse employment and the ability to maintain a viable patient volume. State loan-repayment, residency, education and grant programs can affect supply, but their impact should be measured by where clinicians actually practice and how long they remain.",
          "KTR should avoid equating the number of funded training slots with the number of permanent rural clinicians. Program awards, completed training, placement and retention are different stages. The strongest accountability reporting follows participants through those stages and compares them with the shortage the program was intended to address."
        ]
      },
      {
        heading: "Rural hospital finance requires separating recurring reimbursement from temporary support",
        body: [
          "A rural facility can receive Medicare and Medicaid payments, private-insurance revenue, local tax support, state or federal grants and other funding. Temporary stabilization money can prevent an immediate closure without fixing an underlying mismatch between recurring revenue and operating cost. Conversely, a facility with limited inpatient volume may remain valuable because of emergency, outpatient and transfer functions that are difficult to replace.",
          "When a funding announcement is made, KTR should identify whether it is a one-time grant, recurring rate change, capital award, loan or local tax revenue. Readers should also know the eligible facilities, funding period and intended use. That makes it possible to judge whether a program improved sustainable access rather than simply moving a financial problem into the next budget cycle."
        ]
      },
      {
        heading: "Regulatory updates should be tied to their effective dates",
        body: [
          "HHSC continues to update Chapter 511 as later statutes are implemented. For example, rules adopted for limited-services rural hospitals in 2025 and 2026 addressed additional operational requirements. Those changes illustrate why a static description of the licensing regime can become outdated even when the basic rural-hospital model remains the same.",
          "KTR should keep the evergreen explanation focused on the licensing structure and link current rules when reporting a specific compliance dispute. The Texas Register provides adoption dates, statutory authority and agency explanations that can show whether a requirement is proposed, adopted or effective. That is a stronger source than a trade summary that does not distinguish those stages."
        ]
      }
    ]
  },
  "texas-local-preemption-home-rule": {
    sections: [
      {
        heading: "Home-rule cities begin with broader authority than counties",
        body: [
          "Texas home-rule municipalities generally possess broad local authority subject to the Texas Constitution and state law, while counties usually depend more directly on powers granted by statute. That structural difference matters when the same policy idea is proposed by a city and a county. A city may begin by asking whether state law prohibits the ordinance; a county often must first identify affirmative statutory authority.",
          "KTR should therefore identify the type of local government before discussing 'local control.' City charters, state statutes and constitutional provisions can produce different answers, and a rule that is valid for one local entity may be outside another entity's authority even before a preemption question is reached."
        ]
      },
      {
        heading: "HB 2127 created broad statutory preemption rules but not a one-sentence answer to every ordinance",
        body: [
          "The Texas Regulatory Consistency Act added preemption language across multiple state codes and restricted local regulation in fields occupied by those codes unless another statute expressly authorizes the local action. The law was intentionally broad, but applying it still requires identifying the ordinance, the relevant state code and any express authority or exception.",
          "That is why a claim that HB 2127 invalidates 'all local regulation' is too broad, while a claim that home-rule status defeats the act ignores state preemption. KTR should show the field of law involved and the specific conflict rather than treating the statute's nickname or political purpose as the legal test."
        ]
      },
      {
        heading: "Field preemption and direct conflict are related but distinct questions",
        body: [
          "Some preemption disputes ask whether state law has occupied a regulatory field, while others ask whether a local rule directly conflicts with a state requirement or prohibition. The Texas Regulatory Consistency Act contains express language relevant to specified code fields, and other statutes can separately preempt local action. The legal route depends on the subject and text involved.",
          "For reporting, KTR should quote the local requirement and the state provision said to displace it. If the two rules can coexist, the analysis may differ from a case where compliance with one necessarily violates the other. Court opinions are especially important because broad political descriptions of preemption can obscure the narrower reasoning used to decide a particular ordinance."
        ]
      },
      {
        heading: "Local innovation and statewide uniformity are competing policy values",
        body: [
          "Supporters of preemption often argue that businesses and residents benefit from consistent statewide rules rather than a patchwork of local requirements. Supporters of local authority argue that cities need flexibility to address local conditions and that elected local officials are directly accountable to their communities. Those are policy judgments distinct from the legal question of what authority the Legislature has granted or withdrawn.",
          "KTR should present those arguments after establishing the governing law. A policy can be constitutionally and statutorily permissible while still being debatable as a matter of governance. Separating legality from desirability allows readers to evaluate whether statewide uniformity is worth the loss of local experimentation in the particular field at issue."
        ]
      },
      {
        heading: "Enforcement disputes should identify who can sue and what remedy is requested",
        body: [
          "Preemption becomes practically important when a local government enforces an ordinance, a regulated party challenges it, or the state seeks to block local action. Standing, statutory causes of action, declaratory relief, injunctions and appellate review can determine whether a court reaches the merits and what happens while litigation continues. A lawsuit's filing does not make the challenged ordinance invalid by itself.",
          "KTR should report the plaintiff, defendant, challenged rule, legal theory, court and requested remedy. If an injunction is temporary or stayed, that procedural posture belongs in the headline or early context when material. The evergreen guide should explain the framework; current stories should track each case through final judgment rather than freezing an early order into a permanent statement of law."
        ]
      },
      {
        heading: "State-local conflict appears far beyond business regulation",
        body: [
          "Texas local preemption disputes can involve employment standards, natural resources, firearms, housing, land use, public health, environmental rules, elections and other subjects. HB 2127 is an important general framework, but subject-specific statutes may independently control. A city ordinance that survives one preemption theory can still face another statute or constitutional challenge.",
          "The practical checklist is stable across topics: identify the local government's source of authority, the state provision alleged to limit it, any express exception, the enforcing entity and the latest controlling court decision. That checklist lets KTR connect local controversies to the broader Texas governance debate without implying that one case resolves every future state-local dispute."
        ]
      }
    ]
  }
};

export function applyWave4IssueGuideUpgrade(guide: IssueGuide): IssueGuide {
  const upgrade = WAVE4_UPGRADES[guide.slug];
  if (!upgrade) return guide;
  return {
    ...guide,
    sections: [...guide.sections, ...upgrade.sections],
    sources: upgrade.sources ? [...guide.sources, ...upgrade.sources] : guide.sources,
  };
}

export const WAVE4_ISSUE_GUIDE_SLUGS = Object.freeze(Object.keys(WAVE4_UPGRADES));
