import { createFileRoute } from "@tanstack/react-router";
import { ContentPillarView } from "@/components/content-pillar-view";
import { SupportingGuideGrid } from "@/components/supporting-guide-grid";
import { EvergreenAuthorityReference } from "@/components/authority/EvergreenAuthorityReference";

export const LAW_ENFORCEMENT_SECTIONS = [
  { title: "Texas Policing Agencies Compared", description: "Compare city police, sheriffs, constables, DPS, Texas Rangers, ISD police, university police, game wardens, and other Texas peace officers.", href: "/news/texas-policing-agencies-compared" },
  { title: "Public-Safety Agencies & Authority", description: "Start with the state and local institutions responsible for DPS, Highway Patrol, Texas Rangers, licensing, and public-safety authority.", href: "/texas-government" },
  { title: "Texas Laws", description: "Criminal law, public-safety statutes, enforcement authority, and legal changes.", href: "/laws" },
  { title: "Texas Legislature", description: "Bills, committees, hearings, and votes affecting law enforcement and public safety.", href: "/texas-legislature" },
  { title: "Border Security", description: "DPS, Operation Lone Star, border enforcement, and public-safety operations.", href: "/texas-border-security" },
];

const VERIFIED = "Reviewed against the cited official institutional sources on August 11, 2026.";

export const Route = createFileRoute("/texas-law-enforcement")({
  head: () => ({
    meta: [
      { title: "Texas Law Enforcement & Public Safety — Police, DPS & Policy" },
      { name: "description", content: "Texas law enforcement and public safety coverage: police, sheriffs, DPS, criminal justice, emergency response, enforcement actions, legislation, and public-safety policy." },
      { property: "og:title", content: "Texas Law Enforcement & Public Safety — Keep TX Red" },
      { property: "og:description", content: "Texas police, sheriffs, DPS, criminal justice, emergency response, and public-safety policy." },
      { property: "og:url", content: "https://keeptxred.com/texas-law-enforcement" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/texas-law-enforcement" }],
  }),
  component: TexasLawEnforcementPage,
});

function TexasLawEnforcementPage() {
  return (
    <>
      <ContentPillarView
        hubSlug="texas-law-enforcement"
        sections={LAW_ENFORCEMENT_SECTIONS}
        feedSection="law-enforcement"
        heading="Public Safety Across Texas"
        paragraphs={[
          "Keep TX Red follows the agencies, officers, laws, courts, and policy decisions behind statewide and local public safety. Coverage includes Texas DPS, sheriffs, police departments, major enforcement actions, criminal-justice policy, and emergency response when the story has a clear statewide or public-policy impact.",
          "The pillar connects breaking enforcement news to the laws, agencies, legislative decisions, and government authority that explain how Texas public safety actually works.",
        ]}
        related={[
          { label: "Texas Government & Agencies", href: "/texas-government" },
          { label: "Texas Border & Immigration", href: "/texas-border-security" },
          { label: "Texas Laws & Legislature", href: "/laws" },
          { label: "Texas Politics & Government", href: "/texas-politics" },
        ]}
      />
      <EvergreenAuthorityReference
        eyebrow="Public-safety authority map"
        title="DPS, Rangers, TCOLE and local law enforcement"
        summary="Texas public safety is decentralized. DPS operates statewide divisions, the Texas Rangers handle major and specialized investigations, TCOLE sets licensing and training standards, and sheriffs and police departments answer to their own local structures. This reference prevents those roles from being collapsed into a single 'Texas police' authority."
        institutions={[
          { name: "Texas Department of Public Safety", href: "https://www.dps.texas.gov/", role: "State public-safety department that includes Highway Patrol, Texas Rangers and other statewide divisions and programs.", scopeNote: "DPS is not the command authority for every county sheriff or municipal police department in Texas." },
          { name: "Texas Highway Patrol", href: "https://www.dps.texas.gov/section/highway-patrol", role: "DPS division responsible for roadway public-safety functions, patrol, enforcement and statewide response capabilities.", scopeNote: "Highway Patrol responsibilities are different from Texas Ranger major-investigation responsibilities." },
          { name: "Texas Rangers", href: "https://www.dps.texas.gov/section/texas-rangers/texas-rangers", role: "DPS investigative division handling major violent crime, public corruption, complex investigations and specialized public-safety operations.", scopeNote: "The Rangers do not function as the routine complaint office for every local law-enforcement dispute." },
          { name: "Texas Commission on Law Enforcement", href: "https://tcole.texas.gov/content/background", role: "State regulatory agency that establishes and monitors standards for peace officers, county corrections officers and emergency communications personnel.", scopeNote: "TCOLE licensing jurisdiction is not the same as direct command over local departments or general investigation of every misconduct complaint." },
        ]}
        questions={[
          { question: "Does DPS run every police department and sheriff's office in Texas?", answer: "No. DPS is a statewide agency, while sheriffs and municipal police departments operate under separate local authority. Statewide and local agencies can cooperate, but cooperation does not make them one chain of command.", href: "https://www.dps.texas.gov/", linkLabel: "Visit the Texas Department of Public Safety" },
          { question: "What is the difference between Highway Patrol and the Texas Rangers?", answer: "Both are within DPS, but their core roles differ. Highway Patrol focuses heavily on roadway public safety and statewide patrol functions; the Texas Rangers are the department's major criminal investigative branch and handle specialized investigations and operations." },
          { question: "Does TCOLE investigate every complaint against a police officer?", answer: "No. TCOLE regulates licensing, training, appointment and related standards. Its own complaint guidance says many complaints about conduct or investigations belong first with the employing agency or other responsible authority unless they fall within TCOLE's statutory and rule jurisdiction.", href: "https://tcole.texas.gov/content/complaint-procedures", linkLabel: "Read TCOLE complaint jurisdiction" },
        ]}
        sources={[
          { name: "Texas Department of Public Safety", url: "https://www.dps.texas.gov/", note: "Official statewide public-safety source." },
          { name: "Texas Highway Patrol", url: "https://www.dps.texas.gov/section/highway-patrol", note: "Official Highway Patrol responsibility reference." },
          { name: "Texas Rangers", url: "https://www.dps.texas.gov/section/texas-rangers/texas-rangers", note: "Official Ranger role and investigation reference." },
          { name: "Texas Commission on Law Enforcement", url: "https://tcole.texas.gov/content/background", note: "Official licensing and standards authority reference." },
          { name: "Texas Legislature Online", url: "https://capitol.texas.gov/", note: "Official statutes, bills and legislative actions." },
        ]}
        methodology="Keep TX Red distinguishes state operations, specialized investigations, professional licensing and local agency authority. The map describes institutional jurisdiction, not the merits of a particular enforcement action, investigation or complaint."
        lastVerified={VERIFIED}
      />
      <SupportingGuideGrid pillarHref="/texas-law-enforcement" />
    </>
  );
}
