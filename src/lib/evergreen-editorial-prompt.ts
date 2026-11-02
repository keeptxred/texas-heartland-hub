/**
 * Evergreen guides have no breaking-news event. Keep source-accountability and
 * the shared strict article validator, but do NOT use the news-only brief rule
 * which instructs the AI to leave the article empty when no event occurred.
 */
export const EVERGREEN_EVIDENCE_ADDENDUM = `

EVERGREEN GOVERNMENT REFERENCE BRIEF (MANDATORY):
This is a timeless Texas government/policy reference article, not a news event.
Produce the COMPLETE explainer even though no breaking-news event occurred.

Return a JSON object with "brief" as the FIRST property. Use this structure:
"brief": {
  "hasClearNewsEvent": false,
  "storyType": "evergreen-government-explainer",
  "primarySubject": "specific government, legislative, or policy topic",
  "secondarySubjects": [],
  "organizations": [],
  "locations": ["Texas"],
  "dates": [],
  "currentOffices": [],
  "officesSought": [],
  "relationships": [],
  "facts": { "names": [], "dates": [], "locations": [], "actions": [], "officialRoles": [], "numbers": [], "quotes": [] },
  "analysis": { "opinions": [], "predictions": [], "implications": [] }
}

Use the brief to distinguish verifiable official authority and record facts
from contested policy interpretations. Do not invent quotes, officeholders,
statutes, deadlines, numbers, court outcomes or policy changes. Where a fact
cannot be grounded confidently in primary official sources, qualify it or
leave it out. Keep competing policy positions attributed and factually neutral.

NO-NEWS-EVENT RULE:
"hasClearNewsEvent": false is EXPECTED and must NOT cause empty article
fields. Never create a fictitious news event, publication date or "why now"
claim to satisfy a news-oriented editorial template.

STRUCTURE AND ACCEPTANCE:
The first intro paragraph must be a 45–90 word, self-contained direct answer
explaining the topic, the responsible Texas institution, and why it matters.
Subsequent paragraphs should be substantive and readable (normally 40–100
words each), with specific descriptive section headings. Meet the existing
evergreen main-story minimum using only meaningful explanation, legislative
process, oversight, examples, and records readers can verify. Include 3–6
primary official source URLs and 4–6 focused FAQ entries. Return exactly one
complete valid JSON object, with no markdown fences.
`;

export function fatalEvergreenEditorialReasons(reasons: readonly string[]): string[] {
  // Only this news-specific signal is expected in a non-news evergreen guide.
  // Headline accuracy, factual relationships, quality, readability, and
  // minimum prose length are still mandatory failures.
  return reasons.filter((reason) => reason !== "brief_no_clear_news_event");
}
