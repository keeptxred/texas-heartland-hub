export type PublicBreakingArticle = {
  title?: string | null;
  dek?: string | null;
  category?: string | null;
  source_name?: string | null;
  published_at: string;
  is_breaking?: boolean | null;
};

export const PUBLIC_BREAKING_WINDOW_MS = 12 * 60 * 60 * 1000;

const PUBLIC_BREAKING_SAFETY = /\b(active shooter|mass shooting|shooting|killed|fatal|dead|death toll|explosion|tornado warning|tornado emergency|hurricane warning|flash flood emergency|evacuation|evacuations|amber alert|manhunt|wildfire evacuation|shelter in place)\b/i;
const PUBLIC_BREAKING_INFRASTRUCTURE = /\b(ercot|power grid|electric grid|rolling blackout|blackout|grid emergency|major outage|boil water notice)\b/i;
const PUBLIC_BREAKING_INFRASTRUCTURE_URGENCY = /\b(emergency|warning|outage|blackout|failure|conservation|shed load|rolling)\b/i;
const PUBLIC_BREAKING_GOVERNMENT = /\b(indicted|indictment|resigns|resigned|resignation|removed from office|impeached|impeachment|state of emergency|emergency declaration|court blocks|court halts|strikes down|supreme court rules|injunction)\b/i;
const PUBLIC_BREAKING_ELECTION = /\b(election|primary|runoff|ballot|race)\b/i;
const PUBLIC_BREAKING_ELECTION_EVENT = /\b(wins|winner|called|projected|concedes|conceded|withdraws|withdrew|drops out|results|recount|disqualified)\b/i;
const PUBLIC_BREAKING_ROUTINE = /\b(announces|announcement|appoints|appointment|approves|passes|signs bill|files bill|launches|opens|awards|visits|speaks|statement|press release)\b/i;

/**
 * Public BREAKING is intentionally stricter than the newsroom's broader
 * `is_breaking` priority flag. Keep this pure so homepage and admin use the
 * exact same rule.
 */
export function isPublicBreaking(article: PublicBreakingArticle, nowMs = Date.now()): boolean {
  if (!article.is_breaking) return false;

  const publishedAt = Date.parse(article.published_at);
  if (!Number.isFinite(publishedAt) || nowMs - publishedAt > PUBLIC_BREAKING_WINDOW_MS) return false;

  const text = `${article.title ?? ""} ${article.dek ?? ""} ${article.category ?? ""} ${article.source_name ?? ""}`;
  const safety = PUBLIC_BREAKING_SAFETY.test(text);
  const infrastructure = PUBLIC_BREAKING_INFRASTRUCTURE.test(text) && PUBLIC_BREAKING_INFRASTRUCTURE_URGENCY.test(text);
  const government = PUBLIC_BREAKING_GOVERNMENT.test(text);
  const election = PUBLIC_BREAKING_ELECTION.test(text) && PUBLIC_BREAKING_ELECTION_EVENT.test(text);

  if (!(safety || infrastructure || government || election)) return false;

  // Preserve the PR #302 public-breaking behavior exactly: routine activity is
  // not sufficient by itself; an urgent signal above must also be present.
  if (PUBLIC_BREAKING_ROUTINE.test(text) && !(safety || infrastructure || government || election)) return false;

  return true;
}
