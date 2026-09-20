import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const common = {
  updated: "2026-08-15",
  pillarLabel: "Texas Laws",
  pillarHref: "/laws",
  guideLabel: "Texas Law Guide",
} as const;

const treatment = { label: "Texas Health and Safety Code Chapter 821 — Treatment and Disposition of Animals", url: "https://statutes.capitol.texas.gov/Docs/HS/htm/HS.821.htm" };
const animalRegulation = { label: "Texas Health and Safety Code Chapter 822 — Regulation of Animals", url: "https://statutes.capitol.texas.gov/Docs/HS/htm/HS.822.htm" };
const rabies = { label: "Texas Health and Safety Code Chapter 826 — Rabies", url: "https://statutes.capitol.texas.gov/Docs/HS/htm/HS.826.htm" };
const sterilization = { label: "Texas Health and Safety Code Chapter 828 — Dog and Cat Sterilization", url: "https://statutes.capitol.texas.gov/Docs/HS/htm/HS.828.htm" };
const cruelty = { label: "Texas Penal Code § 42.092 — Cruelty to Nonlivestock Animals", url: "https://statutes.capitol.texas.gov/Docs/PE/htm/PE.42.htm" };
const serviceAnimals = { label: "Texas Human Resources Code Chapter 121 — Rights of Persons With Disabilities", url: "https://statutes.capitol.texas.gov/Docs/HR/htm/HR.121.htm" };
const dshsRabies = { label: "Texas DSHS — Rabies", url: "https://www.dshs.texas.gov/notifiable-conditions/zoonosis-control/zoonosis-control-diseases-and-conditions/rabies" };

export const ANIMALS_BATCH24_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-dangerous-dog-law": {
    ...common,
    slug: "texas-dangerous-dog-law",
    title: "Texas Dangerous Dog Law: Definition, Registration, Restraint and Insurance",
    dek: "How Texas Health and Safety Code Chapter 822 defines a dangerous dog, the 30-day compliance deadline, leash or secure-enclosure rules, $100,000 financial responsibility and local regulation.",
    keyTakeaways: [
      "Health and Safety Code Section 822.041 defines a dangerous dog through specified unprovoked attacks causing bodily injury or unprovoked conduct outside a secure enclosure that would cause a reasonable person to believe the dog will attack and cause bodily injury.",
      "Section 822.042 generally gives the owner 30 days after learning the dog is dangerous to register the dog, restrain it by leash in immediate control or secure enclosure, establish at least $100,000 in liability insurance or financial responsibility, and comply with applicable local requirements.",
      "Annual registration generally requires current rabies vaccination, proof of the required financial responsibility and a secure enclosure; the statutory registration fee is $50.",
      "Local governments may impose stricter dangerous-dog restrictions, but Section 822.047 bars local dangerous-dog regulation based on breed or type alone.",
    ],
    intro: ["Texas dangerous-dog law is a statutory public-safety system separate from ordinary civil dog-bite liability. A formal dangerous-dog determination triggers registration, restraint, financial-responsibility and local-compliance duties."],
    sections: [
      { heading: "Section 822.041 defines the dangerous-dog threshold", paragraphs: ["The statute focuses on unprovoked injury attacks outside a secure enclosure and specified threatening conduct outside a secure enclosure. A dog's breed alone is not the statewide definition."] },
      { heading: "The owner has a 30-day compliance period", paragraphs: ["Once the owner learns the dog is dangerous, Section 822.042 generally requires registration, lawful restraint, at least $100,000 in liability coverage or financial responsibility, and compliance with applicable municipal or county requirements within 30 days."] },
      { heading: "Restraint means immediate leash control or secure enclosure", paragraphs: ["The statute permits a leash in the immediate control of a person or a secure enclosure meeting statutory and local requirements. A secure enclosure must prevent escape and public access and be clearly marked as containing a dangerous dog."] },
      { heading: "Determinations and enforcement have hearing and appeal procedures", paragraphs: ["Chapter 822 provides procedures for appealing an animal-control dangerous-dog determination and for court proceedings when an owner does not comply. Deadlines are short, so the written determination and seizure notices matter."] },
    ],
    faq: [
      { q: "How long does a Texas dangerous-dog owner have to comply?", a: "Section 822.042 generally provides 30 days after the owner learns the dog is dangerous." },
      { q: "How much liability coverage does Texas dangerous-dog law require?", a: "At least $100,000 in liability insurance or other financial responsibility meeting the statute." },
      { q: "Can a Texas city create stricter dangerous-dog rules?", a: "Yes, but Section 822.047 says local requirements may not be breed-specific." },
    ],
    sources: [animalRegulation, { label: "Texas Department of State Health Services — Animal Control", url: "https://www.dshs.texas.gov/disease-surveillance-epidemiology-section/zoonosis-control/animal-control" }],
    related: [
      { label: "Texas serious dog-attack law", href: "/guides/texas-dog-attack-serious-injury-law" },
      { label: "Texas rabies vaccination law", href: "/guides/texas-dog-cat-rabies-vaccination-law" },
      { label: "Texas dog tether law", href: "/guides/texas-dog-tether-restraint-law" },
    ],
  },

  "texas-dog-attack-serious-injury-law": {
    ...common,
    slug: "texas-dog-attack-serious-injury-law",
    title: "Texas Dog Attack Law for Death or Serious Bodily Injury: Seizure and Court Hearing",
    dek: "The Chapter 822 court process after a dog attack causing death or statutory serious bodily injury, including the seizure warrant, 10-day hearing and disposition rules.",
    keyTakeaways: [
      "Health and Safety Code Subchapter A allows a court to issue a warrant to seize a dog when a sworn complaint and probable cause show the dog caused a person's death or serious bodily injury by attacking, biting or mauling the person.",
      "For this subchapter, serious bodily injury includes severe bite wounds or severe ripping and tearing of muscle that would cause a prudent person to seek professional treatment and would require hospitalization, regardless of whether treatment was actually sought.",
      "Section 822.003 requires the court to set a hearing not later than the 10th day after the seizure warrant is issued.",
      "The court's disposition depends on the statutory findings and exceptions; the Chapter 822 seizure proceeding should not be confused with a separate civil damages lawsuit arising from the same attack.",
    ],
    intro: ["Texas provides a fast statutory court process for the dog itself after an attack causing death or defined serious bodily injury. That process determines seizure and disposition; it is separate from civil liability, criminal charges or a dangerous-dog registration case."],
    sections: [
      { heading: "A sworn complaint and probable cause support the seizure warrant", paragraphs: ["Section 822.002 authorizes the warrant when the statutory facts are shown to the court. The dog is then impounded securely and humanely pending the hearing."] },
      { heading: "Serious bodily injury has a specific Chapter 822 definition", paragraphs: ["The definition focuses on severe bite wounds or severe muscle ripping and tearing that would prompt professional treatment and require hospitalization. The statute does not make every dog bite a Subchapter A serious-injury case."] },
      { heading: "The hearing must be set quickly", paragraphs: ["Section 822.003 requires the hearing by the 10th day after the warrant is issued. The owner receives the statutory hearing process before the court makes the required disposition findings."] },
      { heading: "Disposition is fact and exception dependent", paragraphs: ["Chapter 822 contains mandatory and exception-based rules depending on whether the attack caused death or serious bodily injury and the surrounding facts. A court order about the dog does not determine all possible civil claims between the people involved."] },
    ],
    faq: [
      { q: "Does every Texas dog bite trigger a seizure hearing?", a: "No. Subchapter A is directed to attacks causing death or the statute's defined serious bodily injury." },
      { q: "How soon is the Chapter 822 hearing?", a: "Section 822.003 requires it to be held not later than the 10th day after the seizure warrant is issued." },
      { q: "Does this proceeding decide a victim's civil damages?", a: "No. The Chapter 822 proceeding concerns seizure and disposition of the dog; civil liability is a separate legal question." },
    ],
    sources: [animalRegulation, { label: "Texas Department of State Health Services — Animal Control", url: "https://www.dshs.texas.gov/disease-surveillance-epidemiology-section/zoonosis-control/animal-control" }],
    related: [
      { label: "Texas dangerous-dog law", href: "/guides/texas-dangerous-dog-law" },
      { label: "Texas animal-bite rabies quarantine", href: "/guides/texas-animal-bite-rabies-quarantine-law" },
      { label: "Texas animal cruelty law", href: "/guides/texas-animal-cruelty-law" },
    ],
  },

  "texas-dog-cat-rabies-vaccination-law": {
    ...common,
    slug: "texas-dog-cat-rabies-vaccination-law",
    title: "Texas Dog and Cat Rabies Vaccination Law: Four-Month Rule and Certificates",
    dek: "Texas rabies-vaccination requirements for dogs and cats, the four-month deadline, veterinarian administration, booster intervals, certificates and stricter local schedules.",
    keyTakeaways: [
      "Health and Safety Code Section 826.021 requires a dog or cat owner to have the animal vaccinated against rabies by four months of age and revaccinated at intervals prescribed by Department of State Health Services rules.",
      "Texas DSHS states that the rabies vaccine must be administered by a licensed veterinarian for the animal to satisfy the ordinary Texas requirement.",
      "The veterinarian issues a rabies vaccination certificate documenting the vaccination and revaccination information.",
      "Local jurisdictions may require more frequent rabies vaccination intervals than the statewide minimum schedule, so local animal-control rules can matter in addition to Chapter 826.",
    ],
    intro: ["Rabies vaccination is one of Texas's few truly statewide everyday pet requirements. Chapter 826 establishes the legal duty, while DSHS rules and local ordinances control important details about intervals, registration and enforcement."],
    sections: [
      { heading: "Vaccination is required by four months of age", paragraphs: ["Section 826.021 sets the initial deadline for owned dogs and cats. Waiting until a pet is older can create a period of noncompliance even if the owner plans to vaccinate later."] },
      { heading: "A licensed veterinarian administers the qualifying vaccine", paragraphs: ["DSHS requires veterinarian administration under the Texas rabies-control framework. The veterinarian also provides the certificate that documents compliance."] },
      { heading: "Boosters follow the approved vaccine and DSHS framework", paragraphs: ["The owner must keep the animal currently vaccinated at the intervals prescribed by rule. A local jurisdiction may impose a more frequent requirement."] },
      { heading: "Vaccination records matter after bites and exposures", paragraphs: ["Current vaccination status affects how rabies-control authorities handle exposure, quarantine and release questions. Owners should keep the signed vaccination certificate available rather than relying only on a clinic reminder or tag."] },
    ],
    faq: [
      { q: "By what age must Texas dogs and cats receive rabies vaccination?", a: "State law requires vaccination by four months of age." },
      { q: "Can I administer my pet's rabies vaccine myself and satisfy Texas law?", a: "Texas DSHS states that the qualifying vaccination must be administered by a licensed veterinarian." },
      { q: "Can a Texas city require rabies vaccination more often?", a: "Yes. DSHS notes that local jurisdictions may require more frequent vaccination intervals." },
    ],
    sources: [rabies, dshsRabies],
    related: [
      { label: "Animal-bite rabies quarantine", href: "/guides/texas-animal-bite-rabies-quarantine-law" },
      { label: "Texas dangerous-dog law", href: "/guides/texas-dangerous-dog-law" },
      { label: "Texas shelter sterilization law", href: "/guides/texas-shelter-dog-cat-sterilization-law" },
    ],
  },

  "texas-animal-bite-rabies-quarantine-law": {
    ...common,
    slug: "texas-animal-bite-rabies-quarantine-law",
    title: "Texas Animal Bite and Rabies Quarantine Law: Reporting and 10-Day Observation",
    dek: "When animal bites and scratches are reported in Texas, the owner's duty to submit an animal for quarantine or testing, the 10-day dog/cat/ferret observation rule and release requirements.",
    keyTakeaways: [
      "Health and Safety Code Section 826.041 requires reporting when a person knows of an animal bite or scratch to a person that could reasonably transmit rabies, or knows of an animal the person suspects is rabid, under the statute's reporting framework.",
      "When the local rabies control authority has the required basis, Chapter 826 authorizes quarantine or testing and requires the owner or custodian to submit the animal as directed.",
      "Texas DSHS uses a 10-day observation period for a biting dog, cat or domestic ferret; an animal that remains alive and normal through that period was not infectious for rabies at the time of the bite.",
      "The 10-day observation rule is not a general rule for every species; DSHS specifically warns that it is valid for dogs, cats and domestic ferrets, while other animals can require different testing or disposition.",
    ],
    intro: ["A pet bite can trigger a public-health process even when the injury seems minor. Texas rabies-control law focuses on identifying the animal, reporting the event and making the animal available for the quarantine or testing decision."],
    sections: [
      { heading: "Chapter 826 creates a bite and suspected-rabies reporting framework", paragraphs: ["Section 826.041 directs reports to the local rabies control authority and calls for identifying information about the victim, animal and owner when known."] },
      { heading: "The owner must submit an animal ordered into quarantine or testing", paragraphs: ["Section 826.042 authorizes quarantine or testing when the statutory basis exists. Refusing or failing to present the animal can itself create an offense under Chapter 826."] },
      { heading: "Dogs, cats and domestic ferrets use the 10-day observation rule", paragraphs: ["DSHS explains that if one of these animals is alive and normal after the 10-day observation period, it was not infectious for rabies when it bit the person. If rabies signs appear or the animal dies, testing is required."] },
      { heading: "Release depends on health and vaccination requirements", paragraphs: ["Chapter 826 provides release conditions following quarantine and can require proof of current vaccination or vaccination at the owner's expense. The owner is also responsible for reasonable quarantine and disposition costs under the statute."] },
    ],
    faq: [
      { q: "How long is the Texas rabies observation period after a dog or cat bite?", a: "Texas DSHS uses a 10-day observation period for dogs, cats and domestic ferrets." },
      { q: "Does the 10-day rule apply to bats, skunks or other wildlife?", a: "No. DSHS says the 10-day observation rule is not valid for species other than dogs, cats and domestic ferrets." },
      { q: "Can an owner refuse to present a biting animal for quarantine?", a: "Chapter 826 requires submission when the local rabies control authority lawfully directs quarantine or testing, and failure or refusal can be an offense." },
    ],
    sources: [rabies, dshsRabies],
    related: [
      { label: "Texas rabies vaccination law", href: "/guides/texas-dog-cat-rabies-vaccination-law" },
      { label: "Texas serious dog-attack law", href: "/guides/texas-dog-attack-serious-injury-law" },
      { label: "Texas dangerous-dog law", href: "/guides/texas-dangerous-dog-law" },
    ],
  },

  "texas-dog-tether-restraint-law": {
    ...common,
    slug: "texas-dog-tether-restraint-law",
    title: "Texas Dog Tether Law: Safe Outdoor Dogs, Chains, Shelter, Water and Restraint Length",
    dek: "Texas Safe Outdoor Dogs rules for leaving a dog outside and unattended on a restraint, including shelter, shade, potable water, chain prohibition, properly fitted collars and the greater-of-10-feet-or-five-times-length rule.",
    keyTakeaways: [
      "Health and Safety Code Section 821.102 prohibits leaving a dog outside and unattended on a restraint unless the dog has access to adequate shelter, an area avoiding standing water and excessive animal waste, shade from direct sunlight and potable water.",
      "An outdoor unattended restraint may not be a chain or have weights attached and must be attached to a properly fitted collar or harness.",
      "The restraint must be at least the greater of five times the dog's length from nose tip to tail base or 10 feet.",
      "The Safe Outdoor Dogs law contains specific exceptions for activities such as compliant public camping, certain licensed hunting or field activities, temporary livestock work and other listed situations, so the general restraint rule should be read with Section 821.103.",
    ],
    intro: ["Texas replaced its older tethering framework with the Safe Outdoor Dogs law. The current rule focuses on humane shelter and restraint conditions and does not require officers to first give the old 24-hour correction notice before the new offense can apply."],
    sections: [
      { heading: "Outdoor unattended restraint requires basic environmental protections", paragraphs: ["Section 821.102 requires adequate shelter, shade, potable water and an area where the dog can avoid standing water and excessive animal waste."] },
      { heading: "Chains and weighted restraints are prohibited", paragraphs: ["The statute prohibits using a chain or attaching weights to the restraint for a dog left outside and unattended. The collar or harness must also be properly fitted."] },
      { heading: "The restraint length uses the greater of two measurements", paragraphs: ["The minimum is the greater of five times the dog's body length measured from nose tip to tail base or 10 feet. A 10-foot restraint is therefore not always long enough for a very large dog."] },
      { heading: "Section 821.103 contains activity-specific exceptions", paragraphs: ["The statute recognizes listed contexts such as certain public camping, hunting or field activities, livestock work, truck-bed restraints and temporary tasks. The exception must fit the actual facts rather than merely being labeled 'working dog.'"] },
    ],
    faq: [
      { q: "Can I tether a dog outside with a chain in Texas?", a: "Not when the dog is left outside and unattended under the Section 821.102 framework; chains are specifically prohibited for that restraint." },
      { q: "How long must an outdoor dog tether be?", a: "At least the greater of five times the dog's length from nose tip to tail base or 10 feet." },
      { q: "Does Texas still require a 24-hour warning before enforcing the tether law?", a: "The Safe Outdoor Dogs law repealed the prior 24-hour pre-citation framework and replaced it with the current Section 821.102 rules." },
    ],
    sources: [treatment, { label: "Texas Legislature — SB 5 enrolled text, 87th Legislature 3rd Called Session", url: "https://capitol.texas.gov/tlodocs/873/billtext/html/SB00005F.HTM" }],
    related: [
      { label: "Texas animal cruelty law", href: "/guides/texas-animal-cruelty-law" },
      { label: "Cruelly treated animal seizure", href: "/guides/texas-cruelly-treated-animal-seizure-law" },
      { label: "Texas dangerous-dog law", href: "/guides/texas-dangerous-dog-law" },
    ],
  },

  "texas-animal-cruelty-law": {
    ...common,
    slug: "texas-animal-cruelty-law",
    title: "Texas Animal Cruelty Law: Food, Water, Shelter, Abandonment, Injury and Penalties",
    dek: "Texas Penal Code Section 42.092 cruelty rules for nonlivestock animals, including neglect, abandonment, cruel confinement, torture, killing or serious injury and the different misdemeanor and felony punishment tiers.",
    keyTakeaways: [
      "Penal Code Section 42.092 covers nonlivestock animals including domesticated animals, stray or feral dogs and cats, and previously captured wild animals; livestock cruelty is governed separately by Section 42.09.",
      "Section 42.092 prohibits conduct including torture, unreasonable failure to provide necessary food, water, care or shelter, unreasonable abandonment, cruel transport or confinement, unauthorized injury and seriously overworking an animal.",
      "Neglect, abandonment, cruel confinement, unauthorized bodily injury and serious overwork under the listed subsections are generally Class A misdemeanors for a basic offense, with repeat-conviction enhancements.",
      "Torturing or cruelly killing or causing serious bodily injury, and specified unauthorized killing, poisoning or serious injury, fall into more serious felony punishment provisions; Section 42.092 does not use one punishment level for every form of cruelty.",
    ],
    intro: ["Texas criminal animal-cruelty law distinguishes the animal involved, the conduct, the actor's mental state and prior convictions. A neglect case and an intentional torture case therefore do not carry the same statutory punishment structure."],
    sections: [
      { heading: "Section 42.092 applies to nonlivestock animals", paragraphs: ["The definition includes domesticated animals, stray or feral dogs and cats, and captured wild animals, but excludes uncaptured wild creatures and livestock animals. Livestock has its own Section 42.09 framework."] },
      { heading: "Neglect and abandonment are expressly covered", paragraphs: ["The statute reaches unreasonable failure to provide necessary food, water, care or shelter and unreasonable abandonment. Custody includes responsibility for an animal's health, safety and welfare even if the person is not the formal owner."] },
      { heading: "Torture and serious injury use higher punishment provisions", paragraphs: ["Section 42.092 separates torture, cruel killing and serious bodily injury from several neglect-type offenses and assigns felony punishment to the specified serious-conduct subsections, with further enhancement rules for prior convictions."] },
      { heading: "Defenses and lawful-authority provisions still matter", paragraphs: ["Section 42.092 contains defenses for specified circumstances and recognizes legal-authority and owner-consent concepts in several subsections. The existence of injury alone does not answer every element of a criminal cruelty charge."] },
    ],
    faq: [
      { q: "Can failure to provide food, water or shelter be animal cruelty in Texas?", a: "Yes. Section 42.092 expressly covers unreasonable failure to provide necessary food, water, care or shelter for an animal in the person's custody." },
      { q: "Is every Texas animal-cruelty offense a felony?", a: "No. Punishment depends on the conduct and criminal history; several neglect-type offenses are ordinarily Class A misdemeanors, while specified torture, killing and serious-injury conduct is punished as a felony." },
      { q: "Does Section 42.092 cover livestock?", a: "No. Livestock cruelty is addressed separately in Penal Code Section 42.09." },
    ],
    sources: [cruelty, { label: "Texas Courts — Penal Code", url: "https://www.txcourts.gov/media/1457527/penal-code.pdf" }],
    related: [
      { label: "Cruelly treated animal seizure", href: "/guides/texas-cruelly-treated-animal-seizure-law" },
      { label: "Texas dog tether law", href: "/guides/texas-dog-tether-restraint-law" },
      { label: "Texas dangerous wild animal law", href: "/guides/texas-dangerous-wild-animal-law" },
    ],
  },

  "texas-cruelly-treated-animal-seizure-law": {
    ...common,
    slug: "texas-cruelly-treated-animal-seizure-law",
    title: "Texas Cruelly Treated Animal Seizure: Warrant, 10-Day Hearing and Appeal",
    dek: "The Chapter 821 civil seizure procedure when animal-control or peace officers believe an animal is being cruelly treated, including probable cause, impoundment, hearing, disposition and appeal deadlines.",
    keyTakeaways: [
      "Health and Safety Code Section 821.022 allows a peace officer or animal-control officer with reason to believe an animal has been or is being cruelly treated to seek a seizure warrant from the appropriate court or magistrate.",
      "On probable cause, the court issues the warrant and sets the cruelty hearing within 10 calendar days after the warrant is issued; the executing officer impounds the animal and gives the owner written notice of the hearing.",
      "If the court finds cruel treatment, Section 821.023 can divest the owner of ownership and order disposition through the statutory options; if cruel treatment is not found, the court orders the animal returned.",
      "An owner divested under Section 821.023 may appeal, but Section 821.025 requires the notice of appeal and required bond not later than the 10th calendar day after the order is issued.",
    ],
    intro: ["The Chapter 821 seizure process is a civil animal-disposition proceeding that can move quickly. It is related to, but separate from, a criminal prosecution under Penal Code Section 42.092."],
    sections: [
      { heading: "The officer applies for a seizure warrant", paragraphs: ["Section 821.022 begins with an officer's reason to believe the animal has been or is being cruelly treated. The court issues the warrant only on a showing of probable cause."] },
      { heading: "The hearing is set within 10 calendar days of the warrant", paragraphs: ["The statute requires a prompt justice- or municipal-court hearing, and the officer must provide written notice of the time and place to the owner after impounding the animal."] },
      { heading: "The court determines return or divestment", paragraphs: ["Interested parties may present evidence. If cruel treatment is found, the court applies Section 821.023's divestment, cost and disposition provisions; if not, the animal must be returned to the owner."] },
      { heading: "Appeal requires prompt notice and bond", paragraphs: ["Section 821.025 permits an owner divested of ownership to appeal to county court or county court at law, but requires the notice and statutory bond within 10 calendar days of the order. The appellate court considers the matter de novo on the statute's expedited timetable."] },
    ],
    faq: [
      { q: "Can Texas animal control seize an allegedly cruelly treated animal without a court process?", a: "Chapter 821's ordinary cruelty-disposition procedure uses a court or magistrate seizure warrant based on probable cause, subject to other emergency authority that may exist under separate law." },
      { q: "How quickly is the cruelty hearing held?", a: "Section 821.022 requires it to be set within 10 calendar days after the warrant is issued." },
      { q: "Can the owner appeal a divestment order?", a: "Yes. Section 821.025 provides an appeal, with notice and the required bond due not later than the 10th calendar day after the order." },
    ],
    sources: [treatment, cruelty],
    related: [
      { label: "Texas animal cruelty law", href: "/guides/texas-animal-cruelty-law" },
      { label: "Texas dog tether law", href: "/guides/texas-dog-tether-restraint-law" },
      { label: "Texas dangerous-dog law", href: "/guides/texas-dangerous-dog-law" },
    ],
  },

  "texas-service-animal-access-law": {
    ...common,
    slug: "texas-service-animal-access-law",
    title: "Texas Service Animal Law: Public Access, Permitted Questions and Misrepresentation",
    dek: "Texas Human Resources Code Chapter 121 rights for assistance and service animals, the two permitted disability questions, housing protections, animals in training and penalties for misrepresenting a pet as a service animal.",
    keyTakeaways: [
      "Texas Human Resources Code Chapter 121 protects full and equal access to public facilities for a person with a disability using a qualifying assistance or service animal, subject to the statute and applicable federal law.",
      "When the disability is not apparent, Chapter 121 permits staff to ask whether the animal is required because of a disability and what work or task the animal has been trained to perform; the statute does not authorize demanding certification papers merely because the disability is not visible.",
      "Chapter 121 also protects specified housing access and service animals in training when accompanied by an approved trainer, while allowing responsibility for actual damage beyond reasonable wear and tear.",
      "Section 121.006 makes intentional or knowing misrepresentation of an animal as an assistance or service animal a misdemeanor punishable by a fine of not more than $1,000 and 30 hours of specified community service.",
    ],
    intro: ["Texas service-animal law overlaps with the federal Americans with Disabilities Act and housing law. Chapter 121 supplies important Texas access, inquiry and misrepresentation rules, but it should not be treated as the entire federal service-animal framework."],
    sections: [
      { heading: "Chapter 121 protects public-facility access", paragraphs: ["A person with a disability who uses a qualifying service or assistance animal is entitled to the statute's public-access protections. Texas's state definition focuses on a canine specially trained or equipped to help a person with a disability."] },
      { heading: "Only two disability-related questions are authorized when need is not apparent", paragraphs: ["Staff may ask whether the animal is required because of a disability and what work or task it has been trained to perform. Chapter 121 does not make formal service-animal certification a prerequisite to access."] },
      { heading: "Housing and training receive separate protections", paragraphs: ["The chapter addresses housing access without an extra service-animal deposit and permits qualifying animals in training to access public facilities when accompanied by an approved trainer."] },
      { heading: "Misrepresentation carries a Texas misdemeanor penalty", paragraphs: ["Section 121.006 targets intentional or knowing representation of an animal as an assistance or service animal when it is not specially trained or equipped to help a person with a disability. The statute sets a maximum $1,000 fine and 30 hours of designated community service."] },
    ],
    faq: [
      { q: "Can a Texas business demand service-animal certification papers?", a: "Chapter 121 permits the two disability/task questions when the disability is not apparent; it does not create a general right to demand certification papers." },
      { q: "Can an emotional-support pet automatically enter every public business as a Texas service animal?", a: "No. Public-access service-animal status depends on the applicable Texas and federal definitions and trained work or tasks, not the label alone." },
      { q: "What is the Texas penalty for knowingly faking service-animal status?", a: "Section 121.006 provides a misdemeanor with a fine up to $1,000 and 30 hours of specified community service." },
    ],
    sources: [serviceAnimals, { label: "U.S. Department of Justice — ADA Requirements: Service Animals", url: "https://www.ada.gov/resources/service-animals-2010-requirements/" }],
    related: [
      { label: "Texas animal cruelty law", href: "/guides/texas-animal-cruelty-law" },
      { label: "Texas rental pets and assistance animals", href: "/guides/texas-rental-pets-assistance-animals-law" },
      { label: "Texas dangerous-dog law", href: "/guides/texas-dangerous-dog-law" },
    ],
  },

  "texas-dangerous-wild-animal-law": {
    ...common,
    slug: "texas-dangerous-wild-animal-law",
    title: "Texas Dangerous Wild Animal Law: Registration, Insurance and Local Restrictions",
    dek: "Texas Chapter 822 rules for privately kept lions, tigers, bears and other listed dangerous wild animals, including registration, $100,000 insurance, attack/escape reporting and local prohibitions.",
    keyTakeaways: [
      "Health and Safety Code Subchapter E lists dangerous wild animals including specified big cats, bears, hyenas, coyotes, jackals and nonhuman primates, while also providing substantial exemptions for qualifying governmental, research, zoo, sanctuary and other entities.",
      "A nonexempt person generally may not own, harbor or have custody or control of a dangerous wild animal without a registration certificate from the local animal registration agency; the certificate is not transferable and is valid for one year.",
      "Section 822.107 requires at least $100,000 per occurrence in liability insurance covering bodily injury or property damage caused by the dangerous wild animal.",
      "Chapter 822 requires prompt reporting of escape and written notice of specified events; an attack on a human must be reported within 48 hours, and local governments may prohibit or more strictly regulate dangerous wild animals.",
    ],
    intro: ["Texas does not have a simple statewide 'exotic pets are legal' rule. Subchapter E creates registration and insurance duties for listed dangerous wild animals while preserving numerous statutory exemptions and local-government authority to prohibit ownership."],
    sections: [
      { heading: "The statute uses a defined list of dangerous wild animals", paragraphs: ["The list includes lions, tigers, cougars, leopards, cheetahs, jaguars, bobcats, lynx, servals, caracals, hyenas, bears, coyotes, jackals, baboons, chimpanzees, orangutans, gorillas and listed hybrids. Other animal laws can regulate species not on this list."] },
      { heading: "Nonexempt private ownership requires annual registration", paragraphs: ["Section 822.103 requires a registration certificate from the applicable animal registration agency. The certificate lasts one year, is not transferable and is tied to statutory documentation and local administration."] },
      { heading: "$100,000 liability coverage is required", paragraphs: ["Section 822.107 requires liability insurance in an amount of at least $100,000 for each occurrence causing bodily injury or property damage by the animal."] },
      { heading: "Attacks, escapes and transfers create notice duties", paragraphs: ["The owner must immediately report an escape to the registration agency and law enforcement and report a human attack within 48 hours. Chapter 822 also regulates permanent relocation, death, sale and other disposition events."] },
    ],
    faq: [
      { q: "Can a private person own a tiger in Texas without registration?", a: "A nonexempt private owner generally needs the Subchapter E registration certificate, and local law may prohibit or more strictly regulate ownership." },
      { q: "How much liability insurance is required?", a: "At least $100,000 per occurrence under Section 822.107." },
      { q: "How quickly must a human attack be reported?", a: "Chapter 822 requires written notice of a dangerous wild animal's attack on a human within 48 hours." },
    ],
    sources: [animalRegulation, { label: "Texas Department of State Health Services — Dangerous Wild Animals", url: "https://www.dshs.texas.gov/disease-surveillance-epidemiology-section/zoonosis-control/animal-control/dangerous-wild-animals" }],
    related: [
      { label: "Texas animal cruelty law", href: "/guides/texas-animal-cruelty-law" },
      { label: "Cruelly treated animal seizure", href: "/guides/texas-cruelly-treated-animal-seizure-law" },
      { label: "Texas dangerous-dog law", href: "/guides/texas-dangerous-dog-law" },
    ],
  },

  "texas-shelter-dog-cat-sterilization-law": {
    ...common,
    slug: "texas-shelter-dog-cat-sterilization-law",
    title: "Texas Shelter Dog and Cat Sterilization Law: Adoption Agreements and Deadlines",
    dek: "When Texas releasing agencies must sterilize adopted dogs and cats or obtain sterilization agreements, including the 30-day adult deadline, puppy/kitten age rules, veterinary extensions and statutory exemptions.",
    keyTakeaways: [
      "Health and Safety Code Chapter 828 generally prohibits a releasing agency from releasing a dog or cat for adoption unless the animal is already sterilized or the new owner signs the statutory sterilization agreement, subject to listed exemptions.",
      "For an adult animal covered by an agreement, Section 828.003 generally sets the sterilization completion date as the 30th day after adoption.",
      "For an infant female the statutory age benchmark is six months and for an infant male it is eight months, with the completion date generally 30 days after the veterinarian-estimated benchmark unless the releasing agency sets an earlier qualifying policy date.",
      "Chapter 828 contains exemptions, including reclaim by an existing owner and releasing agencies in specified smaller counties or municipalities, so the agreement requirement is not universal for every shelter transaction in Texas.",
    ],
    intro: ["Texas shelter sterilization law regulates 'releasing agencies' and adoption transactions rather than imposing a statewide rule that every privately owned dog or cat must be sterilized. The adopter's deadline depends on whether the animal is already an adult or is an infant animal."],
    sections: [
      { heading: "The agency sterilizes first or obtains an agreement", paragraphs: ["Section 828.002 generally requires sterilization before adoption or a written agreement under which the new owner will complete sterilization by the statutory date."] },
      { heading: "Adult animals generally have a 30-day post-adoption deadline", paragraphs: ["Section 828.003 uses the 30th day after adoption for an adult dog or cat covered by a sterilization agreement."] },
      { heading: "Infant deadlines use six- and eight-month benchmarks", paragraphs: ["For infant females, the relevant estimate is six months of age; for infant males, eight months. The statute then generally provides 30 days after that estimated age, unless an earlier qualifying agency policy controls."] },
      { heading: "Veterinary extensions and statutory exemptions exist", paragraphs: ["A veterinarian may support a 30-day extension when timely surgery would jeopardize the animal's life or health, and extensions can be renewed as Chapter 828 allows. Section 828.013 separately exempts specified transactions and releasing agencies."] },
    ],
    faq: [
      { q: "Must every adopted Texas shelter dog or cat already be sterilized?", a: "Not necessarily. A covered releasing agency may use the statutory sterilization agreement when the animal is not already sterilized." },
      { q: "How long does an adult adopted animal generally have?", a: "Section 828.003 generally sets the adult completion date as the 30th day after adoption." },
      { q: "Can a veterinarian extend the sterilization deadline?", a: "Yes. Chapter 828 allows 30-day veterinary extensions when surgery by the current deadline would jeopardize the animal's life or health." },
    ],
    sources: [sterilization, { label: "Texas DSHS — Animal Shelters", url: "https://www.dshs.texas.gov/disease-surveillance-epidemiology-section/zoonosis-control/animal-control/texas-animal-shelters" }],
    related: [
      { label: "Texas rabies vaccination law", href: "/guides/texas-dog-cat-rabies-vaccination-law" },
      { label: "Texas animal cruelty law", href: "/guides/texas-animal-cruelty-law" },
      { label: "Texas service animal law", href: "/guides/texas-service-animal-access-law" },
    ],
  },
};
