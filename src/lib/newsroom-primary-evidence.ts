import { sourceUrlSupportsPrimaryRecord } from "@/data/source-authority";
import type { ResearchPacket, ResearchPacketSource } from "./newsroom-research-packet";

const GENERIC = new Set("news report reports texas state local official update press release statement announced announces announcement board government company says said after before during today monday tuesday wednesday thursday friday saturday sunday first latest public new".split(" "));
function words(value: string): Set<string> {
  return new Set((value.toLowerCase().match(/[a-z0-9]{3,}/g) ?? [])
    .filter((word) => !GENERIC.has(word)));
}
const bill = /\b(HB|SB|HJR|SJR|House Bill|Senate Bill|House Joint Resolution|Senate Joint Resolution)\s*([0-9]+)\b/ig;
function billIds(value: string): Set<string> {
  return new Set([...value.matchAll(bill)].map((m) => (({ "house bill": "hb", "senate bill": "sb", "house joint resolution": "hjr", "senate joint resolution": "sjr" } as Record<string, string>)[m[1].toLowerCase()] ?? m[1].toLowerCase()) + Number(m[2])));
}
// Entity overlap alone cannot distinguish a CEO's departure from a later
// reinstatement. Use explicit leadership-action phrases from the headline,
// not the body (which often describes earlier events as background).
type LeadershipAction = "return" | "departure" | "appointment" | "investigation";
const LEADERSHIP_ROLE = /\b(?:ceo|chief executive(?: officer)?|president|board director)\b/i;
const LEADERSHIP_ACTIONS: ReadonlyArray<readonly [LeadershipAction, RegExp]> = [
  ["return", /\b(?:reinstat\w*|reappoint\w*|return(?:s|ed|ing)?|resum(?:e|es|ed|ing)|(?:bring|brings|bringing|brought)\b.{0,80}\bback|(?:back|again) as)\b/i],
  ["departure", /\b(?:resign\w*|depart(?:s|ed|ing|ure)?|step(?:s|ped|ping)? down|oust\w*|remov(?:e|es|ed|ing)|dismiss\w*|(?:leav(?:e|es|ing)|left) (?:the )?(?:role|post|company)|(?:retires|retired|retirement))\b/i],
  ["appointment", /\b(?:appoint(?:s|ed|ment|ing)?|nam(?:es|ed|ing)|select(?:s|ed|ing)?|promot(?:es|ed|ing))\b/i],
  ["investigation", /\b(?:investigat\w*|inquiry|probe)\b/i],
];
function leadershipAction(title: string): LeadershipAction | null {
  if (!LEADERSHIP_ROLE.test(title)) return null;
  return LEADERSHIP_ACTIONS.find(([, pattern]) => pattern.test(title))?.[0] ?? null;
}

function leadershipEventCompatible(subject: string, recordTitle: string): boolean {
  const expected = leadershipAction(subject);
  return expected === null || expected === leadershipAction(recordTitle);
}

/** Event identity, not generic keyword or publisher-name similarity. */
export function primaryRecordMatchesEvent(subject: string, title: string, body: string): boolean {
  if (!leadershipEventCompatible(subject, title)) return false;
  const subjectBills = billIds(subject);
  const recordBills = billIds(title + " " + body.slice(0, 1800));
  if (subjectBills.size && [...subjectBills].some((id) => recordBills.has(id))) return true;
  const subjectTerms = words(subject);
  const titleTerms = words(title);
  const bodyTerms = words(body.slice(0, 2400));
  const common = [...subjectTerms].filter((term) => titleTerms.has(term));
  const inBody = [...subjectTerms].filter((term) => bodyTerms.has(term));
  // Require multiple distinctive terms in the headline AND corroboration in
  // extracted text. A boilerplate company or government homepage is not a record.
  return common.length >= 2 && inBody.length >= 2
    && common.length / Math.max(1, Math.min(subjectTerms.size, titleTerms.size)) >= 0.45;
}
export function isSubstantiveEventPrimary(source: ResearchPacketSource, subject: string): boolean {
  if (!sourceUrlSupportsPrimaryRecord(source.url, source.source)) return false;
  let url: URL;
  try { url = new URL(source.url); } catch { return false; }
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.pathname === "/") return false;
  const evidence = (source.extractedBody || source.description || "").trim();
  return evidence.length >= 160 && primaryRecordMatchesEvent(subject, source.title, evidence);
}
export function packetHasVerifiedEventPrimary(packet: ResearchPacket): boolean {
  return packet.sources.some((source) => source.isPrimarySource && isSubstantiveEventPrimary(source, packet.subject));
}
export type PrimaryFeedRecord = {
  id: number; title: string | null; source: string | null; link: string | null;
  pub_date: string | null; description: string | null; extracted_body: string | null;
  source_reputation_score: number | null;
};
/** Search recent direct official records already collected into the feed, even
 * if the clustering algorithm missed them. Never manufacture a source URL. */
export function findEventPrimaryFeedRecords(subject: string, records: readonly PrimaryFeedRecord[], knownIds: ReadonlySet<number>, limit = 2): ResearchPacketSource[] {
  const results: ResearchPacketSource[] = [];
  for (const feed of records) {
    if (knownIds.has(feed.id) || !feed.link || !feed.title) continue;
    const source: ResearchPacketSource = {
      feedItemId: feed.id, title: feed.title, source: feed.source ?? "Official publisher",
      url: feed.link, publishedAt: feed.pub_date, description: feed.description ?? "",
      extractedBody: feed.extracted_body ?? "", isPrimarySource: true,
      sourceReputationScore: feed.source_reputation_score,
    };
    if (!isSubstantiveEventPrimary(source, subject)) continue;
    results.push(source);
    if (results.length >= limit) break;
  }
  return results;
}
