import { CORNERSTONE_GUIDES, type CornerstoneGuide } from "@/data/cornerstone-guides";

function requireCornerstoneGuide(slug: string): CornerstoneGuide {
  const guide = CORNERSTONE_GUIDES[slug];
  if (!guide) throw new Error(`Missing cornerstone guide: ${slug}`);
  return guide;
}

const veteransBase = requireCornerstoneGuide("texas-veterans-military-guide");
const lawEnforcementBase = requireCornerstoneGuide("texas-law-enforcement-public-safety-guide");

const veteransGuide: CornerstoneGuide = {
  ...veteransBase,
  updated: "2026-08-20",
  sections: [
    ...veteransBase.sections.slice(0, 4),
    {
      heading: "Hazlewood is a Texas tuition exemption, not a general cash benefit",
      paragraphs: [
        "The Hazlewood Act is one of the most important Texas-specific education benefits for eligible veterans and qualifying family members, but it is easy to describe too broadly. The Texas Veterans Commission explains that the benefit can provide up to 150 semester credit hours of tuition exemption, including most required fees, at Texas public institutions of higher education for people who satisfy the program's legal requirements. It is not a housing stipend, a book allowance, or a general payment that follows a student to any school. Eligibility, available hours, the type of recipient, and the institution all matter.",
        "The Texas Veterans Commission maintains the Hazlewood database used to track hours, while the public institution where the student plans to use the exemption handles the actual application and eligibility process. Registration in the database does not itself establish eligibility. Veterans, spouses, and children should therefore verify the current statute, TVC rules and instructions, their remaining hours, and the institution's required documentation before assuming tuition will be exempted for a particular term.",
      ],
    },
    {
      heading: "VA claims help should come from accredited representatives",
      paragraphs: [
        "Federal veterans claims are another area where the state and federal roles must stay separate. The U.S. Department of Veterans Affairs accredits three categories of representatives who may assist claimants with VA benefits matters: representatives of VA-recognized veterans service organizations, accredited attorneys, and accredited claims agents. VA maintains a public accreditation search so a veteran can verify whether the person offering representation is actually authorized to prepare, present, or prosecute a benefits claim.",
        "That distinction matters because claims marketing can make ordinary consulting sound like official representation. VA states that recognized VSO representatives provide claims representation without charge, while accredited attorneys and agents may charge fees only under the federal rules that govern when fee-based representation is permitted. A veteran considering paid help should verify accreditation, understand the fee agreement, and distinguish between assistance gathering evidence and the VA's own authority to decide the claim or appeal.",
      ],
    },
    ...veteransBase.sections.slice(4, 5),
    {
      heading: "Disabled-veteran property-tax exemptions depend on the specific statute",
      paragraphs: [
        "Texas has more than one disabled-veteran property-tax provision, and they should not be collapsed into a single promise that every disabled veteran receives a tax-free homestead. The Texas Comptroller explains that Tax Code Section 11.22 provides a partial exemption whose amount depends on the veteran's disability rating and that the exemption can apply to one qualifying property. Separate law provides a residence-homestead exemption for certain veterans who receive 100 percent disability compensation because of a 100 percent disability rating or a determination of individual unemployability from VA.",
        "Those provisions also contain different rules for surviving spouses, donated homesteads, application timing, ownership and residence. The county appraisal district administers the exemption locally, but state law controls the legal entitlement. A veteran should verify the current Comptroller guidance and file the correct form with the appraisal district rather than assuming that a VA rating, by itself, produces the same exemption for every property or every household.",
      ],
    },
    ...veteransBase.sections.slice(5, 6),
    {
      heading: "County, state and federal offices solve different veterans problems",
      paragraphs: [
        "A useful way to navigate veterans services is to start with the decision that needs to be made. Federal VA offices administer federal benefits and health systems. The Texas Veterans Commission provides state advocacy, claims assistance, education oversight, employment and grant-related programs. Texas Workforce Commission and local Workforce Solutions offices handle workforce services. County veterans service offices can provide local navigation and claims assistance, while county appraisal districts administer Texas property-tax exemptions. No single office controls all of those systems.",
        "That division of responsibility is also important for accountability reporting. If a veteran experiences a delay in a federal disability claim, the relevant record is not automatically a Texas legislative record. If a Texas tuition exemption, state grant, property-tax rule or state agency program changes, the federal VA is not the policy maker. Keep TX Red will identify the responsible level of government before assigning credit or blame so readers can follow the official record to the office that can actually change the outcome.",
      ],
    },
    ...veteransBase.sections.slice(6),
  ],
  faq: [
    ...veteransBase.faq,
    {
      q: "Does registering in the Hazlewood database prove that I qualify for the benefit?",
      a: "No. The Texas Veterans Commission states that the database tracks Hazlewood usage and is part of the application process, but registration does not itself establish eligibility. The public institution where the exemption will be used evaluates the application under current Texas law and TVC rules.",
    },
    {
      q: "How can I verify whether someone is authorized to represent me on a VA benefits claim?",
      a: "Use the U.S. Department of Veterans Affairs accreditation search. VA accredits recognized VSO representatives, attorneys, and claims agents to represent claimants in VA benefits matters, and veterans should verify accreditation before relying on a paid or unpaid representative.",
    },
  ],
  sources: [
    ...veteransBase.sources,
    { label: "Texas Veterans Commission — Hazlewood for Veterans and Students", url: "https://hazlewood.tvc.texas.gov/students/VeteranRecords" },
    { label: "Texas Veterans Commission — Hazlewood Act Policy and Procedure Manual", url: "https://tvc.texas.gov/wp-content/uploads/2025/03/Hazlewood-Act-Policy-Procedure-Manual-25-Mar-2025.pdf" },
    { label: "U.S. Department of Veterans Affairs — Accredited Representatives", url: "https://www.benefits.va.gov/vso/index.asp" },
    { label: "Texas Comptroller — Disabled Veteran and Surviving Spouse Exemptions", url: "https://comptroller.texas.gov/taxes/property-tax/exemptions/disabledvet-faq.php" },
    { label: "Texas Comptroller — 100 Percent Disabled Veteran Homestead Exemption", url: "https://comptroller.texas.gov/taxes/property-tax/exemptions/disabledvet-100-faq.php" },
  ],
};

const lawEnforcementGuide: CornerstoneGuide = {
  ...lawEnforcementBase,
  updated: "2026-08-20",
  sections: [
    ...lawEnforcementBase.sections.slice(0, 6),
    {
      heading: "TCOLE licenses peace officers and sets statewide professional standards",
      paragraphs: [
        "The Texas Commission on Law Enforcement is a separate state authority from DPS and from local police departments. TCOLE administers the statewide licensing and standards framework for peace officers and other covered licensees. Its rules address enrollment, licensing, appointment and separation, training providers, continuing education, proficiency certificates and Commission enforcement. That means a local department controls day-to-day employment and policy, while TCOLE controls important parts of the state credentialing framework that allows an officer to hold and maintain a Texas license.",
        "For readers, this distinction prevents two common errors. A disciplinary action by a police chief is not automatically a TCOLE licensing action, and a TCOLE license does not mean the Commission directs the officer's daily assignments. When a story involves whether an officer is licensed, whether required training was completed, or whether the Commission has taken action against a licensee or agency, the TCOLE record is the appropriate statewide source to examine alongside the employing agency's own record.",
      ],
    },
    {
      heading: "Continuing education is part of keeping a Texas peace-officer license active",
      paragraphs: [
        "Texas law requires continuing education for licensed peace officers, and TCOLE publishes the training mandates that apply during each training unit and cycle. TCOLE's current guidance states that peace officers generally must complete at least 40 hours of continuing education during each 24-month training unit, with additional mandated subjects determined by statute, Commission rule, certificate level, appointment and the current training cycle. Some roles, such as first-time supervisors, constables and police chiefs, can carry additional requirements.",
        "The details change as the Legislature amends statutes and TCOLE updates mandates, so a static checklist can age quickly. The correct reporting practice is to identify the officer's role and appointment, confirm the applicable training unit, and use TCOLE's current training-requirements page and Commission rules. A claim that an officer is 'out of compliance' should be tied to an official record or agency statement rather than inferred from an incomplete training transcript or a social-media post.",
      ],
    },
    {
      heading: "Training providers and agencies have recordkeeping responsibilities too",
      paragraphs: [
        "TCOLE's training system depends on more than the individual licensee. Approved academies and training providers must meet Commission requirements for course delivery, documentation and reporting, while agency chief administrators have responsibilities for appointments, training records and compliance. TCOLE's published resources emphasize documented learning objectives, lesson plans, instructor qualifications, attendance records and assessment materials for training providers because the state needs a verifiable record that required instruction actually occurred.",
        "That administrative layer matters when evaluating policy proposals about police training. Mandating a course in statute is only the first step; the state also has to define acceptable curriculum, reporting and deadlines, and agencies need time and resources to schedule personnel. Keep TX Red will distinguish between a proposed training mandate, an adopted TCOLE rule, an active cycle requirement and a completed individual record instead of treating all four as the same thing.",
      ],
    },
    {
      heading: "Accountability can involve an employer, a prosecutor, a court and TCOLE at the same time",
      paragraphs: [
        "Police accountability in Texas is decentralized just like policing itself. An employing agency may investigate policy violations or impose employment discipline. A prosecutor may decide whether evidence supports a criminal charge. A civil court may address a lawsuit. TCOLE may address licensing or Commission-rule issues within its authority. Those processes can overlap, but they have different standards, evidence rules, remedies and timelines, and one outcome does not automatically dictate every other outcome.",
        "That is why responsible coverage should name the forum and the status of the proceeding. An administrative investigation is not a criminal conviction; an arrest is not proof of guilt; a civil allegation is not a licensing finding; and a TCOLE action is not necessarily the same thing as termination by the local agency. Separating those records protects due process while still allowing rigorous scrutiny of agencies, officers, prosecutors and state regulators.",
      ],
    },
    ...lawEnforcementBase.sections.slice(6),
  ],
  faq: [
    ...lawEnforcementBase.faq,
    {
      q: "What is TCOLE responsible for?",
      a: "The Texas Commission on Law Enforcement administers statewide licensing and professional standards for Texas peace officers and other covered licensees. Its rules include licensing, appointment and separation, training providers, continuing education, proficiency certificates and Commission enforcement.",
    },
    {
      q: "How much continuing education does a Texas peace officer generally need?",
      a: "TCOLE states that licensed peace officers generally must complete at least 40 hours of continuing education during each 24-month training unit, with additional mandated topics or role-specific requirements that can apply. Officers and agencies should verify the current cycle requirements directly with TCOLE.",
    },
  ],
  sources: [
    ...lawEnforcementBase.sources,
    { label: "Texas Commission on Law Enforcement — Training Requirements", url: "https://tcole.texas.gov/content/training-requirements" },
    { label: "Texas Commission on Law Enforcement — Commission Statutes and Rules", url: "https://tcole.texas.gov/content/commission-rules" },
    { label: "Texas Commission on Law Enforcement — Frequently Asked Questions", url: "https://tcole.texas.gov/content/frequently-asked-questions" },
    { label: "Texas Commission on Law Enforcement — Training Provider Resources", url: "https://tcole.texas.gov/content/training-provider-resources" },
  ],
};

export const CORNERSTONE_GUIDE_UPGRADES: Record<string, CornerstoneGuide> = {
  [veteransGuide.slug]: veteransGuide,
  [lawEnforcementGuide.slug]: lawEnforcementGuide,
};
