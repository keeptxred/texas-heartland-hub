import type { TexasCaseSection } from "./texas-case";

export type TexasCasePositionUpgrade = {
  sections: TexasCaseSection[];
  sources?: { label: string; url: string }[];
};

export const TEXAS_CASE_PRIORITY_UPGRADES: Record<string, TexasCasePositionUpgrade> = {
  "protect-unborn-life": {
    sections: [
      {
        heading: "A durable pro-life policy must reduce the pressure that makes abortion feel inevitable",
        paragraphs: [
          "A legal prohibition can establish a boundary, but it cannot by itself answer the fear that drives many pregnancy decisions. A woman who believes she will lose housing, employment, medical care, family support, or the ability to finish school may hear the word choice very differently from someone with a stable support network. A pro-life Texas should therefore judge its success partly by whether women facing difficult pregnancies can identify concrete alternatives before a crisis becomes a deadline. That means expecting pregnancy-assistance programs, adoption services, maternal-health programs, child-support systems, charities, and public agencies to publish clear eligibility information and measurable outcomes rather than relying on rhetoric alone.",
          "This is also where fiscal discipline and compassion belong together. KTR does not believe every hardship justifies an unlimited new government program. We do believe that money already appropriated in the name of women, children, foster care, adoption, maternal health, or family support should be transparent and evaluated. If a program is ineffective, reform it. If a private or local model works better, make it easier for families to find it. The point is not to build a larger bureaucracy around the pro-life label; the point is to make protection of life credible in practice as well as in statute.",
        ],
      },
      {
        heading: "Texas should make the law understandable before asking doctors and families to trust it",
        paragraphs: [
          "Abortion policy becomes less legitimate when ordinary people cannot tell the difference between what the statute says, what a court has interpreted, what an agency has advised, and what a political campaign claims. Texas should maintain plain-language, current explanations of its abortion statutes and medical-emergency provisions, with links to the controlling law and any material court decisions. Hospitals and physicians should be able to identify the legal standard that applies in an emergency without relying on social-media summaries from either side of the debate.",
          "That transparency also protects the pro-life position from overstatement. If lawmakers intend a medical exception to operate in a particular way, the text and implementing guidance should make that intention clear enough to be used at the bedside. If litigation exposes genuine ambiguity, the Legislature should fix the ambiguity rather than insisting that confusion cannot exist. Protecting unborn life and protecting women in medical emergencies are not mutually exclusive goals. A serious law should be written and administered as though both lives matter, because that is the premise the pro-life argument asks Texans to accept.",
        ],
      },
    ],
  },
  "gun-rights-over-gun-control": {
    sections: [
      {
        heading: "Constitutional rights should not depend on administrative friction",
        paragraphs: [
          "One of the easiest ways to weaken a right without formally abolishing it is to make lawful exercise expensive, confusing, discretionary, or slow. That is why KTR is skeptical of gun-control proposals that rely on layers of fees, approvals, location traps, equipment definitions, or paperwork that peaceful citizens are expected to navigate perfectly while criminals can simply ignore them. The relevant question is not whether a rule sounds modest in isolation. It is whether the combined burden remains consistent with an individual constitutional right and whether the rule materially targets the dangerous conduct offered as its justification.",
          "Texas should keep lawful gun rules readable enough that an ordinary citizen can understand the basics without hiring a lawyer. When restrictions are necessary for prohibited persons or genuinely sensitive settings, they should be precise. When the state changes a weapons law, DPS and other responsible agencies should publish accurate public guidance promptly. Clarity helps responsible owners comply, helps officers enforce the law consistently, and reduces the risk that technical mistakes become criminal cases against people who were not threatening anyone.",
        ],
      },
      {
        heading: "Due process is the dividing line in dangerous-person policies",
        paragraphs: [
          "Some of the hardest gun-policy cases involve a person who has not yet committed a new violent crime but is alleged to pose a serious danger. The public has an obvious interest in preventing violence, but constitutional rights cannot safely depend on rumor, political pressure, or one-sided accusations with no meaningful opportunity to respond. Any process that can disarm a specific individual should clearly define the evidence required, provide prompt judicial review, give the affected person a meaningful opportunity to contest the allegation, and create a workable path for restoration when the legal basis for deprivation no longer exists.",
          "This is not an argument that government must ignore credible threats. It is an argument that targeted intervention should be built around conduct, evidence, adjudication, and due process rather than broad restrictions on everyone who has done nothing wrong. Texas can take violent threats, domestic abuse, prohibited possession, trafficking, and repeat violent offending seriously while remaining equally serious about the rights of people who are accused but not proven dangerous. A system confident in its evidence should not fear fair procedure.",
        ],
      },
    ],
  },
  "eliminate-property-taxes": {
    sections: [
      {
        heading: "A phaseout must start with the school-finance and local-spending math",
        paragraphs: [
          "The largest obstacle to eliminating property taxes is not philosophical; it is structural. School districts, cities, counties, and special districts have recurring obligations that do not disappear when a tax does. A credible Texas phaseout therefore needs a public ledger showing which levy is being reduced, what spending obligation remains, what revenue replaces it, and whether the replacement grows faster or slower than the burden it is supposed to eliminate. School finance deserves special attention because state and local funding are intertwined and because a promise to eliminate a local tax can simply shift the same cost to a statewide source if spending is left untouched.",
          "KTR's standard should be simple: no shell game. If state revenue is used to buy down a property-tax levy, the old levy should be permanently constrained as the state assumes that share. If local governments retain authority to recreate the burden through another rate, fee, or debt mechanism, taxpayers have not received elimination. If a replacement tax is proposed, Texans should see distributional examples for homeowners, renters, families, retirees, and businesses before lawmakers call the proposal relief. Ownership is the principle; transparent arithmetic is the discipline that makes the principle achievable.",
        ],
      },
      {
        heading: "Spending restraint is what turns temporary relief into a permanent path",
        paragraphs: [
          "Texas has repeatedly used strong revenues to provide property-tax relief. That can reduce bills, but a one-time infusion does not permanently change the trajectory if government spending and taxable values continue rising underneath it. The long-term strategy should pair tax compression with spending limits that force governments to justify growth, voter control over major new obligations, and a transition schedule that makes each reduction difficult to reverse. Otherwise a future downturn can turn yesterday's relief into tomorrow's tax increase.",
          "A durable phaseout would likely take years and should be designed to survive both boom and recession. That argues for measurable milestones rather than a single election-cycle promise: reduce a defined class of property-tax levy, cap its ability to rebound, dedicate sustainable state revenue only after core obligations are funded, and report progress annually in dollars per taxpayer as well as statewide totals. If the state cannot show that the overall tax burden is falling rather than moving, the plan should not be marketed as elimination.",
        ],
      },
    ],
    sources: [
      { label: "Texas Comptroller — Property Tax Assistance", url: "https://comptroller.texas.gov/taxes/property-tax/" },
    ],
  },
};
