import type { IssueGuide } from "@/data/issue-guides";

type IssueSection = IssueGuide["sections"][number];

const WAVE3_DEPTH_PATCHES: Record<string, IssueSection[]> = {
  "rural-texas": [
    {
      heading: "Emergency services and volunteer capacity are core rural infrastructure",
      body: [
        "Rural public safety depends not only on hospitals and highways but also on the availability of EMS crews, volunteer and paid fire departments, dispatch systems, law enforcement, equipment and mutual-aid agreements. Long travel distances can make response coverage expensive even where call volumes are lower than in metropolitan counties, and a small number of vacancies or unavailable vehicles can materially change local capacity.",
        "KTR should evaluate rural emergency-service proposals with operational measures such as response areas, staffing, transport distance, equipment replacement cycles and mutual-aid reliance. State grants or local tax measures can help, but the meaningful question is whether a community can reliably put trained personnel and working equipment where residents need them. That makes emergency capacity part of the same infrastructure conversation as broadband, healthcare, roads and water rather than an afterthought after a crisis."
      ]
    }
  ],
  "texas-dei-higher-education": [
    {
      heading: "Compliance review should distinguish documented conduct from political characterization",
      body: [
        "Because SB 17 regulates defined institutional practices, meaningful oversight depends on records showing what a university office, hiring process, training requirement or program actually does. Governing-board policies, job duties, budget records, required forms, training materials and compliance certifications can provide evidence that a practice falls within or outside the statutory language. A program's title alone is a weak substitute for those records.",
        "KTR should also distinguish legislative oversight, university internal review and a formal legal determination. A lawmaker may raise a credible compliance concern without having adjudicated a violation, while a university's own assurance of compliance does not prevent outside scrutiny. Reporting the document, decision-maker and procedural stage gives readers a clearer basis for judging disputes and keeps the evergreen guide focused on enforceable rules rather than partisan labels."
      ]
    }
  ]
};

export function applyWave3DepthPatch(guide: IssueGuide): IssueGuide {
  const additions = WAVE3_DEPTH_PATCHES[guide.slug];
  if (!additions) return guide;
  return { ...guide, sections: [...guide.sections, ...additions] };
}
