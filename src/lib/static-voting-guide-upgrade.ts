type VotingGuideBody = {
  updated?: string;
  intro?: string[];
  sections?: Array<{ heading?: string; paragraphs?: string[]; bullets?: string[]; [key: string]: unknown }>;
  [key: string]: unknown;
};

const INTRO_FINGERPRINT = "This is the Keep TX Red voter guide for 2026";

export function applyVotingGuide2026Upgrade<T extends VotingGuideBody>(body: T): T {
  const isGuide = body.intro?.some((paragraph) => paragraph.includes(INTRO_FINGERPRINT))
    && body.sections?.some((section) => section.heading === "The 2026 Calendar")
    && body.sections?.some((section) => section.heading?.startsWith("Mail Ballots"));
  if (!isGuide) return body;

  const sections = (body.sections ?? []).map((section) => {
    if (section.heading === "The 2026 Calendar") {
      return {
        ...section,
        bullets: (section.bullets ?? []).map((bullet) => {
          if (bullet.includes("Monday, December 8, 2025") && bullet.includes("first day candidates can file")) {
            return "Saturday, November 8, 2025 — first day Republican or Democratic Party candidates may file an application for a place on the 2026 primary ballot.";
          }
          if (bullet.includes("Monday, February 16") && bullet.includes("Friday, February 27, 2026")) {
            return "Tuesday, February 17 – Friday, February 27, 2026 — early voting by personal appearance for the March primary.";
          }
          return bullet;
        }),
      };
    }

    if (section.heading?.startsWith("Mail Ballots")) {
      return {
        ...section,
        paragraphs: (section.paragraphs ?? []).map((paragraph) =>
          paragraph.replace("only if you meet one of four conditions", "only if you meet a statutory eligibility condition"),
        ),
        bullets: [
          "Age 65 or older on Election Day.",
          "Sick or disabled under the Texas Election Code standard.",
          "Expected to give birth within three weeks before or after Election Day.",
          "Absent from the county of registration during the entire in-person early-voting period and on Election Day.",
          "Civilly committed under Chapter 841 of the Texas Health and Safety Code.",
          "Confined in jail, but otherwise eligible to vote.",
        ],
      };
    }
    return section;
  });

  return { ...body, updated: "2026-08-19", sections } as T;
}
